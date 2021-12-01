FROM node:14.17.3-alpine AS node-base

RUN apk update && apk add gettext nginx && rm -rf /var/cache/apk/* && \
    wget -q -O- https://gobinaries.com/tj/node-prune | sh

FROM node-base AS builder
WORKDIR /app

COPY ["package.json", "yarn.lock", "lerna.json", "./"]
COPY packages/throttle/package.json packages/throttle/package.json
COPY packages/styled/package.json packages/styled/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/backend/package.json packages/backend/package.json
COPY packages/frontend/package.json packages/frontend/package.json

RUN yarn --silent --frozen-lockfile --ignore-scripts install --network-timeout 300000

COPY packages/types/ packages/types/
COPY tsconfig.json ./
RUN yarn build:types && \
    yarn --silent --frozen-lockfile --ignore-scripts bootstrap


FROM builder AS backend-builder
WORKDIR /app

COPY packages/backend/ packages/backend/
RUN yarn build:backend

RUN yarn --prod --silent && \
    yarn --silent cache clean && \
    node-prune

FROM builder AS frontend-builder
WORKDIR /app

COPY packages/ packages/

ARG API_URL
ARG CLIENT_ID
ENV REACT_APP_API_URL=$API_URL
ENV REACT_APP_CLIENT_ID=$CLIENT_ID

ENV GENERATE_SOURCEMAP=false
RUN yarn build:frontend


FROM node-base AS production

ARG PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY
ENV PM2_PUBLIC_KEY=$PM2_PUBLIC_KEY
ENV PM2_SECRET_KEY=$PM2_SECRET_KEY

WORKDIR /app

COPY --from=builder /app/packages/types/dist/ ./packages/types/dist/
COPY --from=builder /app/packages/types/package.json ./packages/types/package.json
COPY --from=backend-builder /app/packages/backend/dist/ ./packages/backend/dist/
COPY --from=frontend-builder /app/packages/frontend/build /var/www/html
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/packages/backend/package.json ./packages/backend/package.json
COPY --from=builder /app/package.json ./package.json

ARG API_HOST
ARG API_PORT
ENV API_HOST=$API_HOST
ENV API_PORT=${API_PORT:-3001}

COPY nginx.conf.template ./nginx.conf.template
RUN yarn --silent global add pm2 && \
    envsubst '${API_HOST} ${API_PORT}' < ./nginx.conf.template > /etc/nginx/nginx.conf

EXPOSE 80

ENV NODE_ENV=production
CMD ["sh", "-c", "nginx -g 'daemon on;' && yarn start:prod"]
