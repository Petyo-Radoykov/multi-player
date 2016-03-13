var users = [];
var usersActivated = [];
var clientName = "";
var socket;

MYAPP.chat = {
	connect: function(callback){
		///////////////////////////////////////////////////////////////
		$('#chatName').submit(function(){
			clientName = $('#name').val();
			socket.emit('new user', clientName, function(data){
				if(data) {
					$('#top').hide();

					//$('.container').show();
					$('.chat_box').show();
					callback();
				} else {
					$('#nicknameTaken').show();
				}
			});
			$('#name').val('');
			return false;
		});
	}
};

$(document).ready(function(){
	/////////////////////////////////////////////////////
	//////////////////////|Sockets|//////////////////////
	/////////////////////////////////////////////////////
	socket = io();
	
	 
      

      socket.on('usernames', function(msg){
		$('.chat_body').empty();
		
		$.each(msg, function( index, value ) {
			if(value != clientName){
			  $('.chat_body').append('<div class="user ' + value + '">' + value + '</div>');
			  userClicked(users, usersActivated);
			}  
		});
		
		/*if( msg.length == 1 && msg[0] != clientName ){
			$('.chat_box').show();
		} else if ( msg.length > 1 ){
			$('.chat_box').show();
		}*/
      });
	  
	  socket.on('message', function(data){
		//alert(data.sender + " " + data.msg);
		var body = '.msg_body.' + data.sender;
		var push = '.msg_push.' + data.sender;
		
		$( ".user." + data.sender ).trigger( "click" );
		
		$('<div class="msg_a">' + data.msg + '</div>').insertBefore(push);
		$(body).scrollTop($(body)[0].scrollHeight);
		//$(body).append('<div class="msg_a">' + data.msg + '</div>');
				
	  }); 	 


		 socket.on('test', function(data){
			console.log("test successful");
		 });
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	
	
	/////////////////////////////////////////////////////
	////////////////////|Chat GUI|///////////////////////
	/////////////////////////////////////////////////////
	$('.chat_head').click(function(){
		$('.chat_body').slideToggle('slow');
	});
	
	var users = [];
	var usersActivated = [];
	
	userClicked(users, usersActivated);
	
});


function userClicked(users, usersActivated){
	/*var users = [];
	var usersActivated = [];*/
	
	$('.user').click(function(){
		var user = $(this).text().trim();
		
		var pos = 0;
		
		
		if(users.indexOf(user) == -1){
			

			//users.push(user);
			
			var head = '.msg_head.' + user;
			var wrap = '.msg_wrap.' + user;
			var close = '.close.' + user;
			var box = '.msg_box.' + user;
			var input = '.msg_input.' + user;
			var push = '.msg_push.' + user;
			var body = '.msg_body.' + user;
			
			console.log($(box).css("display"));
			
			if($(box).css("display") == "none"){
				pos = setPosition(users);
				users.push(user);
				$(box).css("right", pos);

				$(box).show();
				$(wrap).show();
			} else {
				pos = setPosition(users);
				users.push(user);
				setDialog(user, pos);
			}
			
			
			if(usersActivated.indexOf(user) == -1){
				$(head).click(function(){
					$(wrap).slideToggle('slow');
				});
			}
			
			
			if(usersActivated.indexOf(user) == -1){
				usersActivated.push(user);
				$(close).click(function(){
					$(box).hide();
					var index = users.indexOf(user);
					//console.log(index);
					if(users.length > 2 && index >= 0){
						for(var i = index+1; i <=2; i++){
							var name = users[i];
							//console.log(name);
							var boxTemp = '.msg_box.' + name;
							var oldPos = $(boxTemp).css("right").substring(0, 3);
							$(boxTemp).css("right", (oldPos - 270));
							//console.log(oldPos);
						}
					} else if(users.length == 2 && index == 0){
						var boxTemp = '.msg_box.' + users[1];
						var oldPos = $(boxTemp).css("right").substring(0, 3);
						$(boxTemp).css("right", (oldPos - 270));
					}
					users.splice(index, 1);
					//console.log(users);
					//console.log("CLOSE");
				});
			}
			
			

			$(input).keypress(
			function(e){
				if (e.keyCode == 13) {
					var msg = $(this).val();
					$(this).val("");
		
					if( msg.trim() != "" ){
						$('<div class="msg_b">'+msg+'</div>').insertBefore(push);
						$(body).scrollTop($(body)[0].scrollHeight);
						socket.emit('message', {sender: clientName, reciever: user, msg: msg});
					}
				}
			});
				
		}	
	});
}


function setDialog(user, pos){	
	var headC = 'msg_head ' + user;
	var wrapC = 'msg_wrap ' + user;
	var closeC = 'close ' + user;
	var boxC = 'msg_box ' + user;
	var inputC = 'msg_input ' + user;
	var pushC = 'msg_push ' + user;
	var bodyC = 'msg_body ' + user;
	
	var head = '.msg_head.' + user;
	var wrap = '.msg_wrap.' + user;
	var close = '.close.' + user;
	var box = '.msg_box.' + user;
	var input = '.msg_input.' + user;
	var push = '.msg_push.' + user;
	var body = '.msg_body.' + user;

	$('body').append( '<div class="' + boxC + '" style="right:' + pos + 'px"></div>' );
		$(box).append('<div class="' + headC + '" >' + user + '</div>');
			$(head).append('<div class="' + closeC + '">x</div>')
			
		$(box).append('<div class="' + wrapC + '"></div>');
			$(wrap).append('<div class="' + bodyC + '"></div>');
				/*$(body).append('<div class="msg_a">This is from A	</div>');
				$(body).append('<div class="msg_b">This is from B, and its amazingly kool nah... i know it even i liked it :)</div>');*/
				$(body).append('<div class="' + pushC + '"></div>');
			
			$(wrap).append('<div class="msg_footer"><textarea class="' + inputC + '" rows="4"></textarea></div>');
				
}

function setPosition(users){
	var pos = 0
	if(users.length == 0){
		pos = 290;
	} else if(users.length == 1) {
		pos = 560;
	} else if(users.length >= 2) {
		pos = 830;
	}
	return pos;
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
  