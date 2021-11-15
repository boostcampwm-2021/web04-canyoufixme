FROM node:14.17.3 as node-base

FROM node-base as nginx-server

RUN apt-get update && \
    apt-get -yq install nginx

COPY nginx.conf /etc/nginx/nginx.conf


FROM node-base as repository

WORKDIR /app

COPY packages/ packages/
COPY ["package.json", "yarn.lock", "lerna.json", "tsconfig.json", "./"]


FROM node-base as frontend-builder

COPY --from=repository /app /app

WORKDIR /app
RUN yarn global add lerna && lerna link

WORKDIR /app/packages/frontend

ARG API_URL
ARG CLIENT_ID
ENV REACT_APP_API_URL=$API_URL
ENV REACT_APP_CLIENT_ID=$CLIENT_ID

RUN yarn --frozen-lockfile --ignore-scripts && \
    yarn build


FROM node-base as backend-builder

COPY --from=repository /app /app
WORKDIR /app/packages/backend

RUN yarn --frozen-lockfile --ignore-scripts && \
    yarn build


FROM nginx-server as production

COPY --from=backend-builder /app/packages/backend/package.json /app/

WORKDIR /app
RUN yarn --frozen-lockfile --ignore-scripts --prod

COPY --from=backend-builder /app/packages/backend/dist /app/dist
COPY --from=frontend-builder /app/packages/frontend/build /var/www/html

EXPOSE 80
EXPOSE 3001

ENV NODE_ENV=production
CMD ["sh", "-c", "nginx -g 'daemon on;' && yarn start:prod"]
