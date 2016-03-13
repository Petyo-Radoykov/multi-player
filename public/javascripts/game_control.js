$(document).ready(function() {
	var socket = io();
	
	//from util	
	/*centerDivContainer();
	$('.container').show();*/
	
	addSpashScreenContent();
	//on click applyed to the splash div	
	$('#gameStart').click(function(e) {
		if ($(e.target).is('#buttonStart')) {
			return;
		} else {
			startMenu();
		}
	});
	
	//setLevel1Stage();
});


//Level 1
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

//Start
//setLevel1Stage();
//Finish

