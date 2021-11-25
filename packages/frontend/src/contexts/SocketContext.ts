import React from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(
  `${process.env.REACT_APP_API_URL}`,
  { withCredentials: true },
);

const SocketContext = React.createContext({
  socket,
});

export default SocketContext;
