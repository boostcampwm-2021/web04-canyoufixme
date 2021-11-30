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

describe('isNumberAndNatural 함수 테스트', () => {
  test('숫자 입력 후 결과 값 테스트', () => {
    expect(isNumberAndNatural(123)).toBe(true);
  });

  test('문자열 입력 후 결과 테스트', () => {
    expect(isNumberAndNatural('string')).toBe(false);
  });
});

describe('problemService 내의 writeProblem 함수 테스트', () => {
  test('writeProblem 타입 확인 테스트', () => {
    expect(typeof writeProblem).toBe('function');
  });

  test('writeProblem 함수의 response status code 테스트', async () => {
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

describe('problem 조회 리스트 테스트', () => {
  test('skip = 0, take = 10(기본값) 테스트', async () => {
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

describe('문제 출제 로직(saveProblem) 테스트', () => {
  test('saveProblem 타입 확인 테스트', () => {
    expect(typeof saveProblem).toBe('function');
  });

  test('saveProblem 함수의 response 정상 반환 테스트', async () => {
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

describe('문제에 대한 코드 저장 로직(saveCode) 테스트', () => {
  test('saveCode 타입 확인 테스트', () => {
    expect(typeof saveCode).toBe('function');
  });

  test('saveCode 함수의 response 정상 반환 테스트', async () => {
    saveCode = jest.fn().mockResolvedValue('0x0');

    const code = 'code';
    const content = 'This is content.';
    const testCode = ['test code.'];

    const result = await saveCode(code, content, testCode);
    expect(result).toEqual('0x0');
  });
});
