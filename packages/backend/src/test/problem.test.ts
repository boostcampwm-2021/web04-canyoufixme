/* eslint-disable one-var */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  getList,
  isNumberAndNatural,
  writeProblem,
} from '../service/problemService';
import { req, res } from './beforeEach';

let { saveProblem, saveCode } = require('../service/problemService');

describe('is Number And Natural Method test', () => {
  test('input number', () => {
    expect(isNumberAndNatural(123)).toBe(true);
  });

  test('input string', () => {
    expect(isNumberAndNatural('string')).toBe(false);
  });
});

describe('Problem Service create problem', () => {
  test('should have a write Problem function', () => {
    expect(typeof writeProblem).toBe('function');
  });

  test('writeProblem function called saveProblem', async () => {
    try {
      await writeProblem(req, res);
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
      });
    } catch (err) {
      expect(res.statusCode).toBe(500);
    }
  });
});

describe('get problem list test', () => {
  test('skip = 0, take = 10(default)', async () => {
    try {
      await getList(req, res);
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
      });
    } catch (err) {
      expect(res.statusCode).toBe(500);
    }
  });
});

describe('create problem test', () => {
  test('should have a create Problem function', () => {
    expect(typeof saveProblem).toBe('function');
  });

  test('create problem function return test', async () => {
    saveProblem = jest.fn().mockResolvedValue('0x0');

    const testData = {
      title: 'title',
      category: 'category',
      level: 2,
      author: {
        id: 1,
        name: 'admin',
        oauthType: 'github',
        token: 'asdfasdf',
      },
      codeId: 'codeId',
    };

    const result = await saveProblem(testData);
    expect(result).toEqual('0x0');
  });
});

describe('create code data test', () => {
  test('should have a create code data function', () => {
    expect(typeof saveCode).toBe('function');
  });

  test('create code data function return test', async () => {
    saveCode = jest.fn().mockResolvedValue('0x0');

    const code = 'code';
    const content = 'This is content.';
    const testCode = ['test code.'];

    const result = await saveCode(code, content, testCode);
    expect(result).toEqual('0x0');
  });
});
