import { Server } from 'socket.io';

export const socketConnection = httpServer => {
  const io = new Server(httpServer, { cors: { origin: '*' } });
  io.on('connection', socket => {
    console.log(socket.id, 'Client Connected...');

    socket.on('message', data => console.log(data));
  });

  io.on('disconnect', socket => {
    console.log(socket.id, 'Client disconnected...');
  });
};
