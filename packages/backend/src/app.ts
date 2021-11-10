import express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

import { User } from './model/User';
import mysqlConnectionOptions from '../settings/ormConfig';

import '../settings/mongoConfig';

import { router as problemController } from './controller/problemController';
import { router as problemsController } from './controller/problemsController';
import { router as problemCodeController } from './controller/problemCodeController';

const app: express.Application = express();

app.use(
  (
    _: express.Request,
    res: express.Response,
    next: (reason?: Error) => void,
  ) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_URL);
    next();
  },
);

app.use('/api/problems', problemsController);
app.use('/api/problem', problemController);
app.use('/api/debug', problemCodeController);

app.get('/api/user', (req: express.Request, res: express.Response) => {
  return res.json(User.find());
});

createConnection(mysqlConnectionOptions).then(() => {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Running Server port ${port}`);
  });
});
