const express = require('express');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3030;
let usersData = [];

const addUser = (roomId, userName) => {
  usersData.push({
    userName,
    roomId,
  });
};

const removeUser = (userName) => {
  usersData = usersData.filter((user) => user.userName !== userName);
};

const getRoomUsers = (roomId) => {
  return usersData.filter((user) => user.roomId === roomId);
};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join_room', ({ roomId, userName }) => {
    console.log(`${userName} joined room: ${roomId}`);

    socket.join(roomId);
    addUser(roomId, userName);
    socket.to(roomId).emit('user_connected', userName);

    io.to(roomId).emit('all_users', getRoomUsers(roomId));

    socket.on('disconnect', () => {
      console.log(`User ${userName} disconnected!`);
      socket.leave(roomId);
      removeUser(userName);
      io.to(roomId).emit('all_users', getRoomUsers(roomId));
    });
  });
});

server.listen(3030, () => {
  console.log(`Server listening on port: ${PORT}`);
});
