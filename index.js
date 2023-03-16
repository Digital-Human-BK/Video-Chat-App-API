const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
// const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('hello there');
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log('Someone connected!');
  socket.on('join_room', ({ roomId, userId }) => {
    console.log(`User with id: ${userId} joined room ${roomId}`);
  });
});

server.listen(3030, () => {
  console.log('Server is running on port 3030!');
});
