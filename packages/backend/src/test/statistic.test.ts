import {
  getAllSomethingNum,
  mostCorrectProblems,
  dataTransfer,
  getAllData,
  getAllProblemNum,
  getAllSubmitNum,
  getUserCount,
  mostSubmitProblems,
  mostWrongProblems,
} from '../service/statisticService';

import { Problem } from '../model/Problem';
import { SubmitLog } from '../model/SubmitLog';
import { User } from '../model/User';

import { req, res } from './beforeEach';

describe('전체 숫자 조회 테스트', () => {
  const messages = ['문제', '제출', '유저'];
  const models = [Problem, SubmitLog, User];
  const params = ['problemCount', 'submitCount', 'userCount'];

  models.forEach((model, idx) => {
    test(`전체 ${messages[idx]} 수 test`, async () => {
      // eslint-disable-next-line no-param-reassign
      model.findAndCount = jest.fn();
      await getAllSomethingNum(model, `${params[idx]}`);
      expect(model.findAndCount).toBeCalled();
    });
  });
});

describe('Promise.all 반환 데이터 변환', () => {
  test('배열->객체', () => {
    expect(
      dataTransfer([{ test1: 123 }, { test2: 456 }, { test3: [1, 2, 3] }]),
    ).toEqual({ test1: 123, test2: 456, test3: [1, 2, 3] });
  });
});

describe('메인 페이지 기본 통계', () => {
  const messages = [
    '기본 통계 데이터 가져오기',
    '총 문제 수 가져오기',
    '총 제출 수 가져오기',
    '총 유저 수 가져오기',
    '가장 많이 제출한 문제',
    '가장 많이 맞은 문제',
    '가장 많이 틀린 문제',
  ];
  const APIs = [
    getAllData,
    getAllProblemNum,
    getAllSubmitNum,
    getUserCount,
    mostSubmitProblems,
    mostCorrectProblems,
    mostWrongProblems,
  ];

  APIs.forEach((api, idx) => {
    test(`${messages[idx]}`, async () => {
      try {
        await api(req, res);
        res.on('end', () => {
          expect(res.statusCode).toBe(200);
        });
      } catch (err) {
        expect(res.statusCode).toBe(500);
      }
    });
  });
});
