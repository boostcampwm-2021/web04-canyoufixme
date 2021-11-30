import express from 'express';

import 'reflect-metadata';
import { createConnection } from 'typeorm';

import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';

import mysqlConnectionOptions from './settings/ormConfig';
import './settings/mongoConfig';
import { sessionStore } from './settings/sessionConfig';
import { socketConnection } from './settings/socketConfig';

import { router as problemController } from './controller/problemController';
import { router as problemsController } from './controller/problemsController';
import { router as loginController } from './controller/loginController';
import { router as logoutController } from './controller/logoutController';
import { router as statisticController } from './controller/statisticController';

import { COOKIE_MAX_AGE, COOKIE_SECRET } from './util/constant';
import { getDomainFromHostname } from './util/common';
import { setHeaders } from './middlewares/setHeader';

const app: express.Application = express();

const isProduction = process.env.NODE_ENV === 'production';
const origin = new URL(process.env.ORIGIN_URL);

if (isProduction) {
  app.set('trust proxy', 1);
}

const sessionConfig = session({
  secret: COOKIE_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    domain: getDomainFromHostname(origin.hostname),
    secure: isProduction,
  },
});

const server = createServer(app);

app.use(cookieParser());

app.use(express.json());

app.use(setHeaders);

app.use(sessionConfig);

app.use('/api/problems', problemsController);
app.use('/api/problem', problemController);
app.use('/api/login', loginController);
app.use('/api/logout', logoutController);
app.use('/api/statistics', statisticController);

createConnection(mysqlConnectionOptions).then(() => {
  const port = process.env.PORT || 3001;
  socketConnection(server, sessionConfig);
  server.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Running Server port ${port}`);
  });
});
