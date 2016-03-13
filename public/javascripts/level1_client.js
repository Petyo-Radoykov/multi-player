/////////////////////////////////////////////////////
//////////////////////|Sockets|//////////////////////
/////////////////////////////////////////////////////
var socket = io();

/*$(document).ready(function() {
	setLevel1Stage();
});*/

MYAPP.level1 = {
	start: function(){
		setLevel1Stage();
	}
};

function setLevel1Stage(){
	$('.container').empty();
	
	//scale
	for (i = 0; i < 4; i++) { 
		$('.container').append('<div class="box" id="id' + i + '"></div>');
	}


	//holders
	for (i = 0; i < 3; i++) { 
		$('.container').append('<div class="holder" id="holder' + i + '"></div>');
	}
	//good blocks holder
	$('.container').append('<div class="holder" id="holderIntact"></div>');

	//damaged block holder
	$('.container').append('<div class="holder" id="holderDamaged"></div>');


	//weight
	for (i = 0; i < 8; i++) { 
		$('#holder2').append('<div class="weight" id="wId' + i + '"></div>');
	}


	//holders coins
	for (i = 0; i < 2; i++) { 
		$('.container').append('<div class="holderCoins" id="holderCoins' + i + '"></div>');
	}

	//coins
	for (i = 0; i < 2; i++) { 
		$('#holderCoins1').append('<div class="coins" id="cId' + i + '"></div>');
	}
	
	//Drag and drop
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	dragDropHandler("weight", "holder");
	dragDropHandler("coins", "holderCoins");
}

function dragDropHandler(draggableClass, droppableClass){
	$('.' + draggableClass).draggable( blockhandler );
     
    $('.' + droppableClass).droppable({
		accept: '.' + draggableClass,
        tolerance: 'touch',
        drop: function(event,ui) {
            var id = $(ui.draggable).attr('id');
            var holder = $(this).attr('id');
            
			dropHandler(id, holder, blockhandler, true); 
        }
    });
}

var blockhandler = {
	revert: function (droppableObj) {
		return  droppableObj === false;
	},
	start: function( event, ui ) {
		var id = $(this).attr('id');		
		var elem = $("#" + id);
		//console.log("START");
		interval = setInterval(function() {
			positionData(elem.offset().top, elem.offset().left, id);
		}, 50);
		positionData(elem.offset().top, elem.offset().left, id);		
	},
	stop: function( event, ui ) {
		//console.log("STOP");
		var id = $(this).attr('id');		
		var elem = $("#" + id);

		socket.emit('block placed', {id: id, pId: elem.parent().attr('id')}, function(data){});
		
		clearInterval(interval);			
	}
}

function positionData(top, left, id){
	//console.log(top + "  " + left);
	socket.emit('block position', {top: top, left: left, id: id}, function(data){});
}

function dropHandler(id, pId, blockhandler, client){	
	if( (id.indexOf("wId") > -1) /*&& (pId.indexOf("holder") > -1)*/ ){
		$("#" + id).remove();
		$('#' + pId).append('<div class="weight" id="' + id + '"></div>');
		$('div#' + id).draggable( blockhandler );
		if( pId ==="holderIntact" || pId ==="holderDamaged" || pId ==="holder2" ){
			resetScale = $("#holderIntact > div").length + $("#holderDamaged > div").length + $("#holder2 > div").length;
			if(resetScale == 8 && client){
				socket.emit('reset scale', {reset: true}, function(data){});
			}
		}
		
		if(pId ==="holderDamaged" && client){
			socket.emit('block picked', {id: id}, function(data){});
		}
	} else if( ((id.indexOf("cId") > -1) /*&& (pId.indexOf("holderCoins") > -1)*/) ){
		$("#" + id).remove();
		$('#' + pId).append('<div class="coins" id="' + id + '"></div>');
		$('div#' + id).draggable( blockhandler );

		if( pId !== "holderCoins1"){
			setWeigthDistance();
		}
		
		if( pId === "holderCoins0"){
			$("#holderCoins0").empty();
			if(client){
				var weight =  getWeight();
				//console.log(weight);
				socket.emit('weight', weight, function(data){});
			}
		}	
	}	
}

function getWeight(){
	var leftScale = [];
	var rightScale = [];
	
	$("#holder0").children().each(function(n, i) {
	  var id = this.id;
	  leftScale.push(id);
	});
	
	$("#holder1").children().each(function(n, i) {
	  var id = this.id;
	  rightScale.push(id);
	});
	
	return {leftScale: leftScale, rightScale, rightScale};
}

function setWeigthDistance(){
	var leftScale = [];
	var rightScale = [];
	
	$("#holder0").children().each(function(n, i) {
	  var id = this.id;
	  $("#" + id).css("margin-top", "3px");
	});
	
	$("#holder1").children().each(function(n, i) {
	  var id = this.id;
	  $("#" + id).css("margin-top", "3px");
	});
}

function resetScaleAfterUse(){
	$("#id1").css({"transform": "translate(190px, 170px) rotate(0deg)", "height": "10px", "width": "600px"});
	$("#id2").css({"transform": "translate(90px, 400px) rotate(0deg)", "height": "10px", "width": "200px"});
	$("#id3").css({"transform": "translate(690px, 400px) rotate(0deg)", "height": "10px", "width": "200px"});
	
	$("#holder0").css({"left": " 90px", "bottom": "400px"});
	$("#holder1").css({"left": " 690px", "bottom": "400px"});
}

//Sockets	
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
socket.on('game data', function (data) {
	
	for(var i = 0; i < data.length; i++) {

		var inf = data[i];
		var css = null;
		var myCss = {};
		
		
		var x = inf.x;
		var y = inf.y;
		var r = inf.r;
		var h = inf.h;
		var w = inf.w;
		
		
		css = translateRotateCSS(x, y, r);
		
		css['height'] = h;
		css['width'] = w;
		
		
		$('#id' + i).css(css);
		
		if ( i == 2 ){
			myCss =  rotateCSS( r );
			myCss['bottom'] = (800 - y) + "px";
			myCss['right'] = x + "px";
			
			$('#holder0').css(myCss);
		} 
		if ( i == 3 ){
			myCss =  rotateCSS( r );
			myCss['bottom'] = (800 - y) + "px";
			myCss['right'] = x + "px";
			
			$('#holder1').css(myCss);
		}
		
	}
});


socket.on('block position', function (data) {
	//console.log(data.top + " " + data.left + " " + data.id);
	$("#" + data.id).offset({top: data.top, left: data.left});
}); 

socket.on('block placed', function (data) {
	dropHandler(data.id, data.pId, blockhandler, false);
});

socket.on('reset scale', function (data) {
	resetScaleAfterUse();
});

socket.on('block picked', function (data) {
	if(data.result == "win"){
		alert("you won");
	} else {
		setLevel1Stage();
	}
});






