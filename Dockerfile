FROM node:14.17.3-alpine AS node-base

RUN apk update && apk add gettext
RUN wget -q -O- https://gobinaries.com/tj/node-prune | sh


FROM node-base AS nginx-server

RUN apk add nginx && rm -rf /var/cache/apk/*


FROM node-base AS builder

WORKDIR /app

COPY ["package.json", "yarn.lock", "lerna.json", "./"]
COPY packages/debounce/package.json packages/debounce/package.json
COPY packages/styled/package.json packages/styled/package.json
COPY packages/backend/package.json packages/backend/package.json
COPY packages/frontend/package.json packages/frontend/package.json


RUN yarn --silent --frozen-lockfile --ignore-scripts

COPY packages/backend/ packages/backend/
COPY tsconfig.json ./

RUN yarn build:backend

ARG API_URL
ARG CLIENT_ID
ENV REACT_APP_API_URL=$API_URL
ENV REACT_APP_CLIENT_ID=$CLIENT_ID

COPY packages/ packages/
RUN yarn bootstrap && yarn build:frontend

RUN yarn --prod --silent --frozen-lockfile --ignore-scripts
RUN yarn --silent cache clean
RUN node-prune


FROM nginx-server AS production

ARG PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY
ARG PM2_PUBLIC_KEY=$PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY=$PM2_SECRET_KEY

RUN yarn --silent global add pm2

WORKDIR /app

COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/package.json ./package.json
COPY --from=builder /app/packages/frontend/build /var/www/html
COPY --from=builder /app/node_modules ./node_modules

ARG API_HOST
ARG API_PORT
ENV API_HOST=$API_HOST
ENV API_PORT=${API_PORT:-3001}

COPY nginx.conf.template /app/nginx.conf.template
RUN envsubst '${API_HOST} ${API_PORT}' < ./nginx.conf.template > /etc/nginx/nginx.conf

EXPOSE 80

ENV NODE_ENV=production
CMD ["sh", "-c", "nginx -g 'daemon on;' && yarn start:prod"]
