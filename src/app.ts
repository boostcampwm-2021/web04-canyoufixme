import * as express from 'express';

const app: express.Application = express();

app.use(
  (
    req: express.Request,
    res: express.Response,
    next: (reason?: Error) => void,
  ) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  },
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Running Server port ${port}`);
});

app.listen(3000, () => {
  console.log('Running Server port 3000');
});
