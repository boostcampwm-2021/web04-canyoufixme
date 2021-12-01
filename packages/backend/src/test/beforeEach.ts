/* eslint-disable one-var */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/no-var-requires */
import EventEmitter from 'events';

const httpMocks = require('node-mocks-http');

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest({
    session: {
      session_id: 'KyjCxxSuhG1psAk2baqskgUOb88GgDR9',
      expires: 1230912309123,
      data: {
        cookie: {
          originalMaxAge: 43200000,
          expires: '2021-11-29T21:18:22.896Z',
          secure: true,
          httpOnly: true,
          domain: 'canyoufix.me',
          path: '/',
        },
        name: 'longnh214',
      },
    },
  });
  res = httpMocks.createResponse({ EventEmitter });
  next = jest.fn();

  req.body = {
    code: 'code',
    content: 'content',
    testCode: 'testCode',
    title: 'title',
    category: 'JavaScript',
    level: 2,
  };
});

export { req, res, next };
