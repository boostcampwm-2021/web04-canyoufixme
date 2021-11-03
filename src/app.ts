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

const items = [
  {
    id: 1,
    title: 'array? object?',
    author: 'Xvezda',
    category: 'JavaScript',
    level: 2,
  },
  {
    id: 2,
    title: 'NaN? baNaNa?',
    author: 'dlckaduq1107',
    category: 'JavaScript',
    level: 1,
  },
  {
    id: 3,
    title: 'for in? for of?',
    author: 'longnh214',
    category: 'JavaScript',
    tags: ['oneline'],
    level: 3,
  },
  {
    id: 4,
    title: 'Where is this?',
    author: 'Winters0727',
    category: 'JavaScript',
    level: 2,
  },
  {
    id: 5,
    title: 'My new keyboard',
    author: 'Xvezda',
    category: 'JavaScript',
    level: 1,
  },
  {
    id: 6,
    title: 'var loop',
    author: 'Xvezda',
    category: 'JavaScript',
    level: 2,
  },
  {
    id: 7,
    title: 'Not a number',
    author: 'Xvezda',
    category: 'JavaScript',
    level: 2,
  },
  {
    id: 8,
    title: '나는 4가 싫어!',
    author: 'longnh214',
    category: 'JavaScript',
    level: 1,
  },
];
app.get('/api/list', (_: express.Request, res: express.Response) => {
  res.json({
    // TODO: DB 연동
    // NOTE: tags?, description?
    items,
  });
});

const datas = [
  // 1
  {
    content: `### 코드를 작성했는데 생각한대로 동작하지 않아요\n\n고쳐주실수 있을까요? 😥\n\n\`\`\`getTypeName([]) === 'array'\`\`\`?`,
    code: `function getTypeName(arrayOrObject) {
              if (typeof arrayOrObject === 'object') {
                return 'object';
              } else {
                return 'array';
            }
          }`,
  },
  // 2
  {
    content: `### 어? 너 혹시 그거 알아? 자바스크립트로 바나나를 만들 수가 있대! <br> 갑자기 바나나가 먹고싶어졌어. <br> 자바스크립트로 \`baNaNa\`를 return 하도록 코드를 구현해줘!`,
    code: `function makeBanana() {
              // TODO: banana 만들기
              const str = 'baNaNa는 적지 말자!';
              return str;
          }`,
  },
  // 3
  {
    content: `실수로 numArr배열 마지막에 새로운 요소를 추가하였다. \n\n
    기존 배열에 담긴 값을 출력하기 위해서 어떻게 해야할까?`,
    code: `
      function iterate(numArr){
        numArr.last = "endPoint"
        for(let i in numArr){
          console.log(i)
        }
      }`,
  },
  // 4
  {
    content: `### 이 this가 네 this냐?

    당신은 노트북(구형)을 들고 연못 옆을 지나가다가 노트북을 연못에 떨어뜨리고 말았습니다.

    연못 앞에서 망연자실하고 있는 당신 앞에 개발자의 신이 나타나 코드로 물었습니다.

    해당 코드를 한국어로 번역하면 다음과 같습니다.

    "이 M1 맥북이 네 노트북이냐? 아니면 이 MS 서피스가 네 노트북이냐? 아니면 이 볼품없는 구형 노트북이 네 노트북이냐?
    
    당신은 그동안의 작업물이 저장되어 있는 구형 노트북이 아깝긴 하지만, M1 맥북과 MS 서피스를 포기할 수 없었습니다. 다음 코드를 변형하여 신형 노트북 둘 중 하나를 가져가보도록 합시다!`,
    code: `
    var developer = {
      laptop: "Old laptop",
      OldOneisMyLaptop: function () {
        this.laptop = "Old laptop";
      },
    };
    
    function M1isMyLaptop() {
      this.laptop = "Apple M1";
    }
    
    var SurfaceisMyLaptop = function () {
      this.laptop = "MS Surface";
    };
    
    // 위의 코드를 수정하면 안됩니다. :(
    
    var getMyLaptop = function () {
      // 이 곳에 코드를 자유롭게 작성하시면 됩니다. :)
      return developer.laptop;
    };
    
    getMyLaptop();      
    `,
  },
  // 5
  {
    content: `새 키보드를 사서 메모장으로 코딩을 하고 있는데 switch case가 자꾸 이상한곳으로 가네요... 해결해 주실 수 있나요?`,
    code: `
      function impossible() {
        throw 'what?';
      }

      const supercalifragilisticexpialidociou = 42;
      switch (typeof supercalifragilistiexpialidociou) {
        case 'number':
          correct();
          break;
        case 'object':
        case 'undefined':
        case 'string':
          impossible();
          break;
      }
    `,
  },
  // 6
  {
    content: `### 오늘 setTimeout에 대해 배워서 1 부터 10까지 1초씩 기다리면서 출력하는 코드를 짰는데 이상하게 출력되네요. 왜 이럴까요?`,
    code: `
    for (var i = 1; i <= 10; ++i) {
       setTimeout(function() {
        console.log(i);
      }, i * 1000);
    }
    `,
  },
  // 7
  {
    content: `### 코드를 작성했는데 생각한대로 동작하지 않아요... \n\n ### 고쳐주실 수 있을까요? 😥 \n\n
      숫자를 입력하면 \`number\`가, 숫자가 아닌걸 입력하면 \`NaN\`이 나와야해요!
    `,
    code: `
      function getTypeName(numberOrNaN) {
        if (typeof numberOrNaN === 'number') {
          return 'number';
        } else {
          return 'NaN';
        }
      }
    `,
  },
  // 8
  {
    content: `\`낙낙\`이는 세상에서 제일 싫어하는 숫자가 있다. \`4\`다. \n\n \`4\`라는 숫자를 전부 지우고 싶다. 주어진 배열에서 \`4\`가 포함된 숫자를 전부 지워줘!`,
    code: `
      const array = [123,4454,1234,435,3456,45,75245,66,2457,46,86,8,5,26,1345,2,48,2,62,4,65,248,2546,8,59,2,567];
      function hateNumberFour(array){
        let newArray = array;
        return newArray;
      }
    `,
  },
];
app.get('/api/debug/:id', (req: express.Request, res: express.Response) => {
  res.json(datas[parseInt(req.params.id, 10) - 1]);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Running Server port ${port}`);
});
