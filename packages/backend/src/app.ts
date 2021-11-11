import express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import mysqlConnectionOptions from '../settings/ormConfig';

import '../settings/mongoConfig';
import { sessionStore } from '../settings/sessionConfig';

import { router as problemController } from './controller/problemController';
import { router as problemsController } from './controller/problemsController';
import { router as problemCodeController } from './controller/problemCodeController';
import { router as loginController } from './controller/loginController';
import { router as logoutController } from './controller/logoutController';

const app: express.Application = express();

app.use(cookieParser());

app.use(express.json());

app.use(
  (
    _: express.Request,
    res: express.Response,
    next: (reason?: Error) => void,
  ) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type');
    next();
  },
);

app.use(
  session({
    secret: 'GyungGi_FourSkyking',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 3600 * 12 },
  }),
);
app.use('/api/problems', problemsController);
app.use('/api/problem', problemController);
app.use('/api/debug', problemCodeController);
app.use('/api/login', loginController);
app.use('/api/logout', logoutController);

createConnection(mysqlConnectionOptions).then(() => {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Running Server port ${port}`);
  });
});
