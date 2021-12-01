import express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';

import mysqlConnectionOptions from './setting/ormConfig';
import './setting/mongoConfig';
import { sessionStore } from './setting/sessionConfig';
import { socketConnection } from './setting/socketConfig';

import { router as problemController } from './controller/problemController';
import { router as problemsController } from './controller/problemsController';
import { router as loginController } from './controller/loginController';
import { router as logoutController } from './controller/logoutController';
import { router as statisticController } from './controller/statisticController';

import { COOKIE_MAX_AGE, COOKIE_SECRET } from './util/constant';
import { getDomainFromHostname, isProduction, origin } from './util/common';
import { setHeaders } from './middleware/setHeader';

const app: express.Application = express();

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
