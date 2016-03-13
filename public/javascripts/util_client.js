//Util functions
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
function translateObject(x, y, object){
	myCss = {'-webkit-transform':'translate(' + x + 'px,' + y + 'px)',
		   '-moz-transform':'translate(' + x + 'px,' + y + 'px)',
			   '-ms-transform':'translate(' + x + 'px,' + y + 'px)',
		   '-o-transform':'translate(' + x + 'px,' + y + 'px)',  
		   'transform':'translate(' + x + 'px,' + y + 'px)'};
	
	object.css(myCss);
}

function centerDiv(id){
	object = $(id);
	x = (($( window ).width()) / 2) - ((object.width()) / 2);
	y =	(($( window ).height()) / 2) - ((object.height()) / 2);
	
	
	myCss = {'-webkit-transform':'translate(' + x + 'px,' + y + 'px)',
		   '-moz-transform':'translate(' + x + 'px,' + y + 'px)',
			   '-ms-transform':'translate(' + x + 'px,' + y + 'px)',
		   '-o-transform':'translate(' + x + 'px,' + y + 'px)',  
		   'transform':'translate(' + x + 'px,' + y + 'px)'};
	
	object.css(myCss);
}

function centerDivContainer(){
	object = $(".container");
	x = (($( window ).width()) / 2) - (1200 / 2);
	y =	(($( window ).height()) / 2) - (800 / 2);
	
	
	myCss = {'-webkit-transform':'translate(' + x + 'px,' + y + 'px)',
		   '-moz-transform':'translate(' + x + 'px,' + y + 'px)',
			   '-ms-transform':'translate(' + x + 'px,' + y + 'px)',
		   '-o-transform':'translate(' + x + 'px,' + y + 'px)',  
		   'transform':'translate(' + x + 'px,' + y + 'px)'};
	
	object.css(myCss);
}

function translateRotateCSS(x, y, r){
	css = {'-webkit-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg)',
			   '-moz-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg)',
			   '-ms-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg)',
			   '-o-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg)',  
			   'transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg)'}; 
		
	return css;
}

function rotateCSS( r ){
	css = {'-webkit-transform':'rotate(' + r + 'deg)',
		   '-moz-transform':'rotate(' + r + 'deg)',
		   '-ms-transform':'rotate(' + r + 'deg)',
		   '-o-transform':'rotate(' + r + 'deg)',  
		   'transform':'rotate(' + r + 'deg)'}; 
		
	return css;
}

function resetDivCss(id){
	object = $(id);
	
	myCss = {'all':'initial',
		     'all':'unset'};
	
	object.css(myCss);
}
//Handles the user input
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
$(window).keydown(function(e) {
	if( !$('textarea').is(':focus') ){
		if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 32 || e.keyCode == 84){
			socket.emit('control key pressed', {keyCode: e.keyCode, userID: 1}, function(data){});
		}
	}

	//F11 for full screen
	/*if( e.keyCode == 122 ){
		//from util
		centerDiv('.container');
	}*/
});

$(window).keyup(function(e) {
	if( !$('textarea').is(':focus') ){
		if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 32){
			socket.emit('control key released', {keyCode: e.keyCode, userID: 1}, function(data){});
		}
	}	
});