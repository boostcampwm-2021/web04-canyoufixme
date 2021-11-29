import type { IGuideline } from '@cyfm/types';

const GUIDELINES: IGuideline[] = [
  {
    title: `expect(val1).to.equal(val2);`,
    content: `'val1'과 'val2'가 동일한지 확인할 때 사용합니다.`,
    codes: [`expect(3).to.equals(3);`, `expect('foo').to.equals('bar');`],
  },
  {
    title: `expect(array|string).to.include(val);`,
    content: `'array|string'이 'val'을 포함하는지 확인할 때 사용합니다.`,
    codes: [
      `expect('foobar').to.include('foo');`,
      `expect([1,2,3]).to.include(4);`,
    ],
  },
  {
    title: `expect(var).to.a/an(type);`,
    content: `'var'의 타입이 'type'인지 확인할 때 사용합니다.`,
    codes: [
      `expect('foo').to.a('string');`,
      `expect([1,2,3]).to.an('array');`,
      `expect({a: 1}).to.an('object');`,
    ],
  },
  {
    title: `expect(var).to.true/false;`,
    content: `'var'가 'true|false'인지 확인할 때 사용합니다.`,
    codes: [`expect(true).to.true;`, `expect(false).to.false;`],
  },
  {
    title: `expect(string).to.match(regex);`,
    content: `'string'이 정규표현식 'regex'에 맞는지 확인할 때 사용합니다.`,
    codes: [`expect('foobar').to.match(/^foo/);`],
  },
];

export default GUIDELINES;
