FROM node:14.17.3 as node-base
FROM node-base as frontend-builder

WORKDIR /app

COPY packages/ packages/
COPY ["package.json", "yarn.lock", "lerna.json", "./"]
RUN yarn --frozen-lockfile --ignore-scripts

COPY tsconfig.json .
RUN yarn bootstrap --ignore-scripts && \
    yarn build:frontend

FROM node-base as nginx-server

RUN apt-get update && \
    apt-get -yq install nginx

COPY nginx.conf /etc/nginx/nginx.conf

FROM nginx-server as backend-builder

COPY --from=frontend-builder /app /app

WORKDIR /app
RUN mv packages/frontend/build/* /var/www/html/
COPY package.json .

EXPOSE 80
EXPOSE 3000

ENV NODE_ENV=production
CMD ["sh", "-c", "nginx -g 'daemon on;' && yarn start:backend"]
