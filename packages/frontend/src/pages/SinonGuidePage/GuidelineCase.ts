import type { IGuidelineWithCode } from '@cyfm/types';

const GUIDELINES: IGuidelineWithCode[] = [
  {
    title: `Fake timers`,
    content: `비동기 타이머 작업을 동기적으로 바꿔주는 역할을 합니다.\nclock 변수를 사용하여 시간을 확인할 수 있습니다.`,
    codes: `// code
setTimeout(() => console.log('hi'), 1000);
setTimeout(() => console.log('hello'), 2000);
setTimeout(() => console.log(':)'), 3000);
const hello = 'world';

// test code
// testcase 1 : check max time
clock.runAll(); // 모든 작업이 실행시키고
expect(clock.now).to.equal(3000); // 타이머의 시간이 3000ms 인가? → true

// testcase 2 : check hello
expect(hello).to.equal('world');
    `,
  },
];

export default GUIDELINES;
