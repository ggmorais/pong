const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var data = {
  players: [

  ],
  ball: [200, 200, 40, 40]
};

app.use('/', express.static('src/static'));

io.on('connect', socket => {
  console.log('conectado')
  
  if (data.players.length < 2) {
    data.players.push({
      id: socket.id,
      info: [150, data.players.length > 0 ? 20 : 440, 130, 25]
    });
  }
  
  socket.emit('id', socket.id);
  socket.emit('data', data);
  socket.on('update', player => {
    for (let i in data.players) {
      if (data.players[i].id === player.id) {
        data.players[i] = player;
      }
    }
    io.sockets.emit('data', data);
    console.log(JSON.stringify(data.players))
  })

  socket.on('disconnect', () => {
    console.log('disconectado');

    for (let i in data.players) {
      if (data.players[i].id === socket.id) {
        data.players.splice(i, 1);
      }
    }
  });

});

http.listen(process.env.PORT || 5000);