FROM node:14.17.3-alpine AS node-base

FROM node-base AS nginx-server

RUN apk update && apk add nginx && rm -rf /var/cache/apk/*
COPY nginx.conf /etc/nginx/nginx.conf


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

RUN yarn cache clean
RUN npm prune --production


FROM nginx-server AS production

WORKDIR /app

COPY --from=builder /app/packages/backend/dist /app/dist
COPY --from=builder /app/packages/backend/package.json /app/package.json
COPY --from=builder /app/packages/frontend/build /var/www/html
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 80
EXPOSE 3001

ENV NODE_ENV=production
CMD ["sh", "-c", "nginx -g 'daemon on;' && yarn start:prod"]
