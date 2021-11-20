# 🛠 Canyoufixme

<div align="center">
  <img src="https://user-images.githubusercontent.com/9497404/139361908-b3958e61-840c-43f9-ac98-a503283d5b1d.png" />
</div>

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/boostcampwm-2021/web04-canyoufixme/hit-counter&count_bg=%239D17CB&title_bg=%23555555&icon=javascript.svg&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)
[![canyoufixme-auto-deploy](https://github.com/boostcampwm-2021/web04-canyoufixme/actions/workflows/deploy.yml/badge.svg)](https://github.com/boostcampwm-2021/web04-canyoufixme/actions/workflows/deploy.yml)

# ⚓ 배포 링크

[Can you fix me?](http://dev.canyoufix.me/)

<br>
<br>

# 👨🏻‍💻 팀원 소개

<img src="https://github.com/winters0727.png" width=100 height=100 />

### 🌚  **J094 박춘화**

- 소개: 성남시 담당 사천왕 && 커피, 밀크티 중독자
- 역할: PT 담당자 && 면접관(질문 많이합니다) 👍🏻
- 보드게임 좋아합니다. 🧐
- Frontend 개발자
- `Python`, `JavaScript`

**👉 [Github Repository](https://github.com/winters0727)**

<img src="https://github.com/dlckdduq1107.png" width=100 height=100 />

### 👨🏻‍💼  **J165 이창엽**

- Canyoufixme CEO + 수원시 담당 사천왕
- 파이팅 담당!!!🤸‍♂️
- 발표 컨셉 아이디어 뱅크
- 팀원 너무 좋아 사랑해❤️ from. 막내올림 💛

**👉 [Github Repository](https://github.com/dlckdduq1107)**

<img src="https://github.com/longnh214.png" width=100 height=100 />

### 👨🏻‍💻  **J205 최낙훈**

- 소개: 고양시 담당 사천왕
- 역할: 🦒 🏂  😱
- [g.dev/springboot](http://g.dev/springboot) + `Backend Developer` + `Java`
- New York 가고 싶습니다. I♥️NY 🗽
- ` 사과 농장 주인`

**👉 [Github Repository](https://github.com/longnh214)**

<img src="https://github.com/xvezda.png" width=100 height=100 />

### 🤔  **J206 최영근**

- 소개: 화성시 담당 사천왕
- 역할: CTO, 기술자문, 패키지 개발
- Front-End Dev
- Bug Hunter
- Terminal ❤️
- [g.dev/vim](https://g.dev/vim)

**👉 [Github Repository](https://github.com/Xvezda)**

<br>
<br>

# 🗽 프로젝트 소개

<img src="https://user-images.githubusercontent.com/23649097/142730553-3f5c79c5-4429-4fde-a0ae-a8c704032df6.gif" width=400 height=170 />

> **_"처음 JavaScript 배우는데 너무 어려운데...?"_**
>
> ```jsx
> const banana = 'ba' + 'str' / 2 + 'a';
>
> console.log(banana); //!?
> ```
>
> **Canyoufixme에서 `JavaScript`를 익혀볼까?**

**_개발을 하면서 버그를 잡느라 시간을 낭비한 경험이 있으신가요? 누구나 개발을 하면서 다양한 버그를 맞닥뜨리게 되는데요, 혼자 디버깅을 하면서 버그를 고치는 것도 좋지만 버그를 찾아내고 해결하는 과정을 서로 공유할 수 있다면, 혹은 다른 사람이 마주친 버그를 내가 해결해볼 수 있다면, 더욱 값진 경험이 되지 않을까요?_**

## **코딩은 직접 부딪히고 경험해야 실력이 향상 된다고 합니다!**

- _출제자는 **실제 개발 과정에서 마주칠 만한 버그가 포함된 코드**를 출제합니다._
- _사용자는 디버깅하여 의도된 동작을 하도록 출제된 코드를 수정하고 제출합니다._
- _해당 코드에 대한 `체크포인트✅`를 만족하는 지 확인하면서 디버깅에 관한 능력을 향상시킬 수 있습니다._

<br>
<br>

# 🚀 기술 스택

![stack](https://user-images.githubusercontent.com/56329233/142729892-8587f553-4539-4c00-967c-4526ef70e747.png)

<br>
<br>

# 🎯 기술 특장점 소개

### ⚙️ 백엔드 멀티 스레드

    - 서비스가 성장하고 트래픽이 집중될 때에도 사용자 경험을 유지하고 싶었습니다.
    - 이를 위해 JavaScript의 싱글스레드 환경에서 여러 클라이언트에 대한 동시 채점이 가능해야 했습니다.
    - `workerpool` 모듈을 이용해 일정 스레드 개수 만큼 동시에 채점할 수 있습니다 (with 대기큐)

### 🚨 프론트엔드 샌드박스, 웹워커 + 보안

    - 코드 실행부를  `sandbox="allow-scripts"` 옵션을 주어 `iframe` 태그 내부로 옮겼습니다.
    - 웹 워커를 사용하여 코드 실행 시간이 오래 걸리거나 무한 루프에 빠진 경우, 코드 실행이 브라우저의 UI 메인 스레드에 영향을 주지 않도록 했습니다.
    - `Content Security Policy` 를 적용하여 XSS 및 CSRF 공격 등에 대한 보안을 강화했습니다.

### 📊 RDBMS + NoSQL 조합

    - 회원 관리와 출제한 문제, 풀이한 문제 등 관계가 필요한 데이터에 대해서는 RDBMS인 `MySQL`을 통해 데이터 저장에 대한 신뢰성을 높이고 싶었습니다.
    - 가변적인 데이터(ex. string, 배열)를 저장하기 위해서 추가적으로 NoSQL인 `MongoDB`를 동시에 채택하였습니다.

### 📶 Socket.io를 통해 채점 결과 전달

    - 채점이 진행되는 상황을 클라이언트에 전달해주고 싶었습니다.
    - `Socket.io`를 통해 각 테스트가 완료될 때 마다 데이터를 전달합니다.
    - 테스트가 완료되면 세션으로 검증합니다.
    - 검증이 완료되면 제출기록을 DB에 저장합니다.
    - 클라이언트에서 채점 상황을 실시간으로 확인 할 수 있습니다.

### 📦 모노 레포 구조의 패키지 관리 with styled-component, debounce

    - 프로젝트의 패키지 관리 방법으로 `lerna`와 `yarn workspace`를 사용한 Monorepo 구조를 사용하고 있습니다.
    - 필요한 기능(`styled-component`, `debounce`)들을 직접 구현한 뒤, 패키지로 만들어 사용하고 있습니다.

### 🐳 Github Action + Docker 사용한 배포 자동화

    - Github Action을 사용하여 `dev` 브랜치로 `push` 이벤트가 발생할 경우 서버에 저장된 `[deploy.sh](http://deploy.sh)` 파일을 실행하여 배포가 자동으로 이루어지도록 구현했습니다.
    - 또한, Docker를 사용하여 프로젝트 빌드 및 서버 실행을 하며, 빌드 시간을 단축시키기 위해 캐시를 고려하여 패키지 설치 레이어 순서를 배치하였고, `Alpine`이미지 같은 경량화된 이미지를 사용했습니다.
    - 빌드된 이미지의 크기를 줄이기 위해 Multi-stage build 방법을 사용하여 불필요한 파일이 포함되지 않도록 하여 경량화 하였습니다.

<br>
<br>

# 📹 기능 시연 예제

## 무한 스크롤

![infinite](https://user-images.githubusercontent.com/56329233/142729939-808e0285-b72c-4f31-b50d-55a48263c8c3.gif)

- 문제 리스트 페이지 입니다.
- `IntersectionObserver API` 를 이용해서 무한 스크롤을 구현하였습니다.

## 에디터 크기 조절

![layoutmoving](https://user-images.githubusercontent.com/56329233/142729952-414edb75-2137-4782-a542-f9f2bb2a8f69.gif)

- 에디터 크기를 좌우 스크롤을 통해 조절할 수 있습니다.
- 조절된 크기는 `localStorage`에 저장되어 페이지를 이동하더라도 반영됩니다.

## 답안 제출

![correctanswer](https://user-images.githubusercontent.com/56329233/142729965-5a7c5aff-1922-4d76-a690-837bc4266a05.gif)

- 제출 버튼을 클릭하면 웹 소켓 통신이 이루어지고 채점 결과를 모달창으로 보여줍니다.

## 시간 제한

![timeout](https://user-images.githubusercontent.com/56329233/142729980-989ef3a1-14b2-4766-b2f1-2b3d5e329c86.gif)

- timeout 5초 제한을 두어 무한 루프를 방지했습니다.
