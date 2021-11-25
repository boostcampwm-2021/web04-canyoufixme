/* eslint-env worker */
/* eslint-disable no-restricted-globals */

const TM_SECOND = 1000;
const GC_INTERVAL = 30;
const GC_TIMEOUT = 10;

const pool = new Set();

const broadcast = message => {
  [...pool].forEach(port => port.postMessage(message));
};

// MessageChannel에 close이벤트가 존재하지 않기 때문에 polling 방식으로 직접 구현
const cleanUnusedPort = port => {
  setInterval(() => {
    const timer = setTimeout(() => {
      pool.delete(port);
    }, GC_TIMEOUT * TM_SECOND);

    port.addEventListener(
      'message',
      event => {
        switch (event.data) {
          case 'PONG':
            clearTimeout(timer);
            break;
          default:
            break;
        }
      },
      { once: true },
    );

    port.postMessage('PING');
  }, GC_INTERVAL * TM_SECOND);
};

const handleMessage = (message, from) => {
  switch (message) {
    case 'PING':
      from.postMessage('PONG');
      break;
    default:
      if (message.startsWith('DATA')) {
        broadcast(message);
      }
      break;
  }
};

const acceptConnection = event => {
  const port = event.ports[0];
  pool.add(port);

  port.addEventListener('message', event => handleMessage(event.data, port));
  port.start();
  cleanUnusedPort(port);
};

self.addEventListener('connect', acceptConnection);
