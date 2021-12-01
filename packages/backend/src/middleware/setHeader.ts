import express from 'express';

export const setHeaders = (
  _: express.Request,
  res: express.Response,
  next: (reason?: Error) => void,
) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_URL);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type');
  next();
};
