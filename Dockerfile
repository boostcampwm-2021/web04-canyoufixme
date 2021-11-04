FROM node:14.17.3

WORKDIR /usr/src/app

COPY ["package.json", "yarn.lock", "."]
COPY lerna.json .
COPY packages/ packages/

RUN yarn --frozen-lockfile
RUN yarn bootstrap
RUN yarn build:frontend

RUN apt-get update
RUN apt-get -yq install nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY . .

EXPOSE 80
EXPOSE 3000

CMD ["sh", "-c", "nginx -g 'daemon on;' && yarn start:backend"]
