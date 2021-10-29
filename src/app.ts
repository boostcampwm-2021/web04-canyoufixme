import * as express from 'express';
const app: express.Application = express();

// get
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello express');
});

app.listen(3000, () => {
  console.log('Running Server port 3000');
});
