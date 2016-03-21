var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require("path");

app.get('/', function(req, res){
  res.sendFile( path.join( __dirname, '../', 'index.html'));
});

io.on('connection', function(socket){
	console.log("new client... current clients:");
	for(var s in io.sockets.sockets){
		console.log(s);
	}

socket.on('chat message', function(msg){
	if(msg.toLowerCase() === "ready"){
		//When receiving the ready chat message, reply with a confirmation to that socket
		socket.emit('chat message', "Notification - Received your ready message");
		//and send a notification to all other sockets. 
		socket.broadcast.emit('chat message', "Notification - Another socket ready");
		socket.broadcast.emit('start video', "Start it");
	} if(msg === "playVideo" || msg === "stopVideo" || msg === "pauseVideo"){
		socket.emit('chat message', "Notification - Received your " + msg + "command");
		socket.broadcast.emit('videoCmd', msg);
	} else {
		//else just emit the received message to everyone including the sender
		io.emit('chat message', msg);
	}
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


