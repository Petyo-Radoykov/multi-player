

module.exports = function (io) { 

    var users = {}; 
	// io stuff here... io.on('conection.....
	
	io.on('connection', function(socket){
	   ///////////////////////////////////////////////
	   socket.on('new user', function(data, callback){
		if(data in users){
		   callback(false);	
		} else {
		   socket.nickname = data;
		   users[socket.nickname] = socket;
		   updateNicknames();
		   callback(true);	
		}
	  });

	   ///////////////////////////////////////////////
	  socket.on('message', function(data){
		//console.log(data);
		users[data.reciever].emit('message', {msg: data.msg, sender: data.sender});
	  });			
	  
	  ///////////////////////////////////////////////
	  socket.on('disconnect', function(msg){
		if(!socket.nickname) return;	
		delete users[socket.nickname];		
		updateNicknames();
	  });

	  function updateNicknames(){ 
		io.emit('usernames', Object.keys(users));
	  }	

	});
}

/*
// sending to sender-client only
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
 io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
 socket.broadcast.to(socketid).emit('message', 'for your eyes only');
*/