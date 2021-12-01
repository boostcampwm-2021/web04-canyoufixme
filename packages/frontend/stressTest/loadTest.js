const { io } = require('socket.io-client');

const URL = process.env.REACT_APP_API_URL;
const MAX_CLIENTS = 1000;
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
const EMIT_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

const createClient = () => {
  const socket = io(URL, { withCredentials: true });

  setInterval(() => {
    socket.emit('submit', {
      code: `function iterate(numArr) {
            let result = [];
            numArr.last = 'endPoint';
            for (let i of numArr) {
              result.push(i);
            }
            return result;
          }`,
      problemId: '618a3c998e94a96a2e45efe2',
      id: ['iVt7d9yNO5RQCaUyR3m2g', 'zJfif2adhRvug7nOkfmhf'],
    });
  }, EMIT_INTERVAL_IN_MS);

  socket.on('testSuccess', ({ id, resultCode }) => {
    packetsSinceLastReport++;
    console.log('success', id, resultCode);
  });

  socket.on('disconnect', reason => {
    console.log(`disconnect due to ${reason}`);
  });

  if (++clientCount < MAX_CLIENTS) {
    setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
  }
};

createClient();

const printReport = () => {
  const now = new Date().getTime();
  const durationSinceLastReport = (now - lastReport) / 1000;
  const packetsPerSeconds = (
    packetsSinceLastReport / durationSinceLastReport
  ).toFixed(2);

  console.log(
    `client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`,
  );

  packetsSinceLastReport = 0;
  lastReport = now;
};

setInterval(printReport, 5000);
