var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('connection opened');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('message', function(msg){
    console.log('msg is: ', msg);
    io.emit('msgtodisplay', msg);
  });
})

app.use(express.static(path.join(__dirname, ".")));

server.listen(3000);