var express = require('express');
var app = express();
var server = require('http').Server(app);
var querystring = require('querystring');
var io = require('socket.io')(server);
var path = require('path');

io.on('connection', function(socket){

  socket.on('join', function(room) {
    socket.join(room);
  });


  socket.on('offer', function(description) {
    var room = socket.rooms[1];
    // console.log('offer', room);
    socket.broadcast.to(room).emit('offer', description); //change to broadcast
  });

  socket.on('answer', function(description) {
    var room = socket.rooms[1];
    // console.log('answer', room);
    socket.broadcast.to(room).emit('answer', description);
  });

  socket.on('candidate', function(candidate) {
    var room = socket.rooms[1];
    // console.log('candidate', room);
    socket.broadcast.to(room).emit('candidate', candidate);
  });

});

// app.use('/*', express.static(path.join(__dirname, ".")));


// app.use('/css', express.static(__dirname + '/client/css'));
// app.use('/js', express.static(__dirname + '/client/js'));

app.get('/socket.io/socket.io.js', function(req, res) {
  res.sendfile('./socket.io/socket.io.js');
});

app.get('/client/js/adapter.js', function(req, res) {
  res.sendfile('./client/js/adapter.js');
});

app.get('/client/js/main.js', function(req, res) {
  res.sendfile('./client/js/main.js');
});

app.get('/*', function(req, res) {
  res.sendfile('./client/index.html');
});

// app.get('/*', function(req, res){
//     res.sendfile('index.html', {root: __dirname + '/client' });
// });

server.listen(3000);