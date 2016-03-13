//List of variables
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
var Box2D = require('box2dweb-commonjs').Box2D;


var world = null;
var WIDTH = 1200;
var HEIGHT = 800;
var SCALE = 30;
var fps = 30;



var relativeY = 150;
var relativeScale = 300;
var scaleBaseWidth = 100;
var scaleBaseDistance = 250;

var weightWidth = 65;
var weightHeight = 15;

var weightInsert = 25;

var scaleDensity = 1;
var baseWeightDensity = 0.4;
var damagedWeightDensity = 0.05;

var relativeCenter = WIDTH / 2.5;

 var   b2Vec2 = Box2D.Common.Math.b2Vec2
,  b2AABB = Box2D.Collision.b2AABB
,	b2BodyDef = Box2D.Dynamics.b2BodyDef
,	b2Body = Box2D.Dynamics.b2Body
,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,	b2Fixture = Box2D.Dynamics.b2Fixture
,	b2World = Box2D.Dynamics.b2World
,	b2MassData = Box2D.Collision.Shapes.b2MassData
,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
,   b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
,  b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape
;

var D2R = Math.PI/180;
var R2D = 180/Math.PI;
var PI2 = Math.PI*2;


var destroy_list = [];

var elements_list = [];

var count = 0;
var interval = null;

var DAMAGED_BLOCK = Math.floor((Math.random() * 8));
var SCALE_USED = false;


//Socket communication
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
module.exports = function (io) { 
	var activeUsers = 0;
	
	io.on('connection', function(socket){
		activeUsers++;
		//init(io, activeUsers);
		
		///////////////////////////////////////////////
		socket.on('block position', function(data){
			//console.log(data.top + " " + data.left + " " + data.id);
			socket.broadcast.emit('block position', {top: data.top, left: data.left, id: data.id});
		});
		
		///////////////////////////////////////////////
		socket.on('block placed', function(data){
			socket.broadcast.emit('block placed', {id: data.id, pId: data.pId});
		});
		
		///////////////////////////////////////////////
		socket.on('reset scale', function(data){
			if(SCALE_USED){
				io.emit('reset scale', {reset: data.reset});
				resetGameServer();
			}
		});
		
		///////////////////////////////////////////////
		socket.on('weight', function(data){
			SCALE_USED = true;
			init(io, data, activeUsers);
			var timesRun = 0;
			var inter = setInterval(function(){
				timesRun += 1;
				if(timesRun === 1){
					//console.log("here");
					
					clearInterval(interval);
					clearInterval(inter);
				}
				//do whatever here..
			}, 4000);
		});
		
		////////////////////////////////////////////////
		socket.on('block picked', function(data){
			elementPicked = (data.id).slice(-1);
			if( parseInt(elementPicked) === DAMAGED_BLOCK ){
				io.emit('block picked', {result: "win"});
			} else {
				io.emit('block picked', {result: "lose"});
				resetGameServer();
			}
			
		});
	});	
	

}

function resetGameServer(){
	for (i in elements_list) {
		destroy_list[i] = elements_list[i];
	}
	world = null;
	SCALE_USED = false;
	clearInterval(interval);
}

//Update
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////
function update(io){
	world.Step(
		1/fps,
		10,
		10);

	
	for (var i in destroy_list) {
		world.DestroyBody(destroy_list[i]);
	}
	//Reset the array
	destroy_list.length = 0;

	
	io.emit('game data', gameData());
	
	world.ClearForces();
}

//init
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
function init(io, data, activeUsers){
	world = new b2World(
		new b2Vec2(0, 9.81),
		true);
	
	if(activeUsers >= 2){
		elements_list[0] = createDOMObject(relativeCenter, relativeY - 1, 10, 10, true, "point", scaleDensity);
		elements_list[1] = createDOMObject( relativeCenter - relativeScale + 10 , relativeY + 20, relativeScale, 5, false, "scale", scaleDensity);
		
		createJoint(elements_list[0].GetBody(), elements_list[1].GetBody(), elements_list[0].GetBody().GetWorldCenter(), elements_list[1].GetBody().GetWorldCenter());
		
		elements_list[2] = createDOMObject((relativeCenter - relativeScale + 10) - scaleBaseWidth, relativeY + scaleBaseDistance, scaleBaseWidth, 5, false, "weight1", scaleDensity);
		elements_list[3] = createDOMObject((relativeCenter + relativeScale + 10) - scaleBaseWidth, relativeY + scaleBaseDistance, scaleBaseWidth, 5, false, "weight2", scaleDensity);
	
		//scale
		var x = (elements_list[1].GetBody().GetWorldCenter().x);
		var y = (elements_list[1].GetBody().GetWorldCenter().y);
		//weight1
		var x1 = (elements_list[2].GetBody().GetWorldCenter().x);
		var y1 = (elements_list[2].GetBody().GetWorldCenter().y);
		//weight2
		var x2 = (elements_list[3].GetBody().GetWorldCenter().x);
		var y2 = (elements_list[3].GetBody().GetWorldCenter().y);
		
		createJoint(elements_list[1].GetBody(), elements_list[2].GetBody(), new b2Vec2( x - relativeScale/SCALE, y), new b2Vec2( x1 - scaleBaseWidth/SCALE, y1));
		createJoint(elements_list[1].GetBody(), elements_list[2].GetBody(), new b2Vec2( x - relativeScale/SCALE, y), new b2Vec2( x1 + scaleBaseWidth/SCALE, y1));
		
		createJoint(elements_list[1].GetBody(), elements_list[3].GetBody(), new b2Vec2( x + relativeScale/SCALE, y), new b2Vec2( x2 - scaleBaseWidth/SCALE, y2));
		createJoint(elements_list[1].GetBody(), elements_list[3].GetBody(), new b2Vec2( x + relativeScale/SCALE, y), new b2Vec2( x2 + scaleBaseWidth/SCALE, y2));
		
		
		
		/*elements_list[4] = createDOMObject((relativeCenter - relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj1", baseWeightDensity);
		elements_list[5] = createDOMObject((relativeCenter - relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj1", baseWeightDensity);
		elements_list[6] = createDOMObject((relativeCenter - relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj1", baseWeightDensity);
		elements_list[7] = createDOMObject((relativeCenter - relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj1", baseWeightDensity);
		
		
		elements_list[8] = createDOMObject((relativeCenter + relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj2", baseWeightDensity);
		elements_list[9] = createDOMObject((relativeCenter + relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj2", baseWeightDensity);
		elements_list[10] = createDOMObject((relativeCenter + relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj2", baseWeightDensity);
		elements_list[11] = createDOMObject((relativeCenter + relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj2", damagedWeightDensity);*/
		//elements_list[5] = createDOMObject((relativeCenter + relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj2", damagedWeightDensity);
		
		
		/*console.log(data.leftScale);
		console.log("");
		console.log(data.rightScale);*/
		
		for (i = 4, j = 0; i < (data.leftScale.length + 4); i++, j++){
			if(data.leftScale[j] === "wId" + DAMAGED_BLOCK){
				elements_list[i] = createDOMObject((relativeCenter - relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj1", damagedWeightDensity);
			} else {
				elements_list[i] = createDOMObject((relativeCenter - relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj1", baseWeightDensity);
				//console.log("left " + i);
			}
		}
		
		for (i = (data.leftScale.length + 4 ), j = 0; i < (data.leftScale.length + 4 + data.rightScale.length); i++, j++){
			if(data.rightScale[j] === "wId" + DAMAGED_BLOCK){
				elements_list[i] = createDOMObject((relativeCenter + relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj2", damagedWeightDensity);
			} else {
				elements_list[i] = createDOMObject((relativeCenter + relativeScale + 10) - weightWidth, relativeY + scaleBaseDistance - weightInsert, weightWidth, weightHeight, false, "obj2", baseWeightDensity);
				//console.log("right " + i);
			}	
		}
		
		//////////////////////////////////////////////////////
		interval = setInterval(function() {
			update(io);
		}, 500/fps);
		update(io);
	}	
}





//Functions for Object generation
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
function createDOMObject(x, y, width, height, static, id, density) {
	var domObj = {id: id};
	var domPos = {left:x, top:y};
	var width = width;
	var height = height;

	var x = (domPos.left) + width;
	var y = (domPos.top) + height;
	var body = createBox(x, y, width, height, static, id, density);	
	
	body.m_userData = {domObj:domObj, width:width, height:height};
	
	return body;
}


//Functions for createBox
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
function createBox(x, y, width, height, static, id, density){
	var bodyDef = new b2BodyDef;
	bodyDef.type = static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
	bodyDef.position.x = x/SCALE;
	bodyDef.position.y = y/SCALE;

	var fixDef = new b2FixtureDef;
	fixDef.density = density;
	fixDef.friction = 5;
	fixDef.restitution = 0;

	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(width/SCALE, height/SCALE);


	obj = world.CreateBody(bodyDef).CreateFixture(fixDef);
	//obj.GetBody().SetUserData({ tankClass : tankClass});
	
	return obj;
}

//Function for creation of the joints
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
function createJoint(body1, body2, body1Pont, body2Point){
	def = new Box2D.Dynamics.Joints.b2DistanceJointDef();
	def.collideConnected = true;
	def.Initialize(body1, body2, body1Pont, body2Point);
	var joint = world.CreateJoint(def); 
}

//Function for data sent to users
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
function gameData() {
	var ret = [];
	var data = {};
	
	for( var i = 0; i < elements_list.length; i++ ){
		
		f = elements_list[i];
		
		var xScale = f.m_body.m_xf.position.x*SCALE;
		var xWidth = f.m_userData.width;
		
		var yScale = f.m_body.m_xf.position.y*SCALE;
		var yHeight = f.m_userData.height;
				
		var x = (Math.round( (xScale - xWidth) * 100 )/100).toFixed(2);
		var y = (Math.round( ( yScale - yHeight) * 100 )/100).toFixed(2);

		var r = Math.round( ((f.m_body.m_sweep.a + PI2) % PI2) * R2D * 100 )/100;
		
		data = {x: x, y: y, r: r, h: yHeight*2, w: xWidth*2};
		
		ret.push(data);
	}
	
	return ret;
}







