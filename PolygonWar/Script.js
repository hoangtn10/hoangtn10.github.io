/**************** Variables ****************/
var FPS = 60;
var playerSpeed = 4;
var blastSpeed = 5;
var fireWaitTime = 250;
var enemyFireWaitTime = 750;					
var enemyMovementInterval = 1500; 	// lower is faster!
var enemyFiringInterval = 1000; 	// lower is faster!

var stage;
var player;
var enemy;

var backgroundImg;

var playerDirection;
var enemyFiringIntervalDevice;
var highScoreTextDevice;

var waitFired = true;

var rad2deg = 180/Math.PI;
var deg2rad = Math.PI/180;

var width = 770;
var height = 565;
var XP = 0;
var Life = 3;
var score = 0;
var level = 0;

var KEYCODE_LEFT = 65, 
	KEYCODE_RIGHT = 68,
	KEYCODE_UP = 87, 
	KEYCODE_DOWN = 83,
	KEYCODE_SPACE = 32;

var pressedKeys = [false, false, false, false, false];

var blastOnScreen = [];
var enemyOnScreen = [];
var highScoreUserArray = [];

var imageArray = [];
var imageIndex = 0;
var spriteName = ["Player Sprite", "Enemy Sprite", "Background"];
/**************** Variables ****************/

/**************** Prototype ****************/
function Blast(blast, direction, group) {
	this.blast = blast;
	this.direction = direction;
	this.group = group;			// 0 = player, 1 = enemy 
}

function Enemy(enemy, type) {
	this.enemy = enemy;
	this.type = type;
}

function highScoreUser(user, score) {
	this.user = user;
	this.score = score;
}
/**************** Prototype ****************/

/**************** Menu Functions ****************/
var soundEffectOn = true;
function DisableSoundEffect() {
	if (soundEffectOn) {
		soundEffectOn = false;
		
		var sound = "Effects";
		var soundStrike = sound.strike();
		var soundButton = document.getElementById("SoundEffectToggleButton");
		
		soundButton.innerHTML = soundStrike;
	}
	else {
		soundEffectOn = true;
		
		var sound = "Effects";
		var soundButton = document.getElementById("SoundEffectToggleButton");
		
		soundButton.innerHTML = sound;
	}
}

var queue;
function LoadStart() {
	if (mobileAndTabletcheck()) {
		alert("This game is not designed for phone/tablet!")
		window.history.back();
		return;
	}
	queue = new createjs.LoadQueue(true);
	queue.installPlugin(createjs.Sound);
	queue.loadFile({id:"explosion", src:"Explode.ogg"});
	queue.on("complete", LoadIntroCanvas, this);
}

var container;
function LoadIntroCanvas() {	
	var startOption = document.getElementById("startOptions");
	startOption.style.display = "inline-block";
	
	introStage = new createjs.Stage(document.getElementById("introCanvas"));
	introStage.canvas.width = 770;
	introStage.canvas.height = 522;
	
	var highScore = "---    ---\n---    ---\n---    ---\n---    ---\n---    ---\n";
	var i,j = 0;
	
	var highScoreSign = new createjs.Text("High Score", "100 36px Oswald", "#fff");
	highScoreSign.textAlign = "center";
	
	highScoreTextDevice = new createjs.Text(highScore, "100 24px Oswald", "#fff");
	highScoreTextDevice.textAlign = "center";
	highScoreTextDevice.y = 70;
	
	container = new createjs.Container();
	container.addChild(highScoreSign, highScoreTextDevice);
	
	container.x = 385;
	container.y = 30;
	
	container.regY = highScoreSign.getMeasuredHeight()/2 + 10;
	
	introStage.addChild(container);

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", updateIntroStage);
	
	$("#user").keyup(function(event){
		if(event.keyCode == 13){
			$("#saveScoreButton").click();
		}
	});
}

var rotateLeft = true;
function updateIntroStage() {
	if (container.rotation > 2) {
		rotateLeft = true;
	}
	if (container.rotation < -2) {
		rotateLeft = false;
	}
	if (rotateLeft) {
		container.rotation -= .05;
	}
	else {
		container.rotation += .05;
	}
	
	introStage.update();
}

function PlayButtonClick() {
	var introCanvas = document.getElementById("introCanvas");
	introCanvas.style.display = "none";
	var startOption = document.getElementById("startOptions");
	startOption.style.display = "none";
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.style.display = "inline-block";
	
	Play();
}

function OptionsButtonClick() {
	var introCanvas = document.getElementById("introCanvas");
	introCanvas.style.display = "none";
	var startOption = document.getElementById("startOptions");
	startOption.style.display = "none";
	var options = document.getElementById("options");
	options.style.display = "block";
	
	var dropZone = document.getElementById("dragAndDrop");
	dropZone.addEventListener("dragover", function(evt){
			evt.stopPropagation();
			evt.preventDefault();
			evt.dataTransfer.dropEffect = 'copy';
		},true);
	dropZone.addEventListener("drop", function(evt){
			evt.stopPropagation();
			evt.preventDefault();
			loadSprite(evt.dataTransfer.files[0]);
		}, true);
}

function ResetSelection() {
	for(i = 0; i < imageArray.length; i++) {
		imageArray[i] = undefined;
	}
	
	var dragAndDropCanvas = document.getElementById("dragAndDrop");
	var context2d = dragAndDropCanvas.getContext("2d");
	context2d.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function DoneSelection() {
	var introCanvas = document.getElementById("introCanvas");
	introCanvas.style.display = "inline-block";
	var options = document.getElementById("options");
	options.style.display = "none";
	var startOption = document.getElementById("startOptions");
	startOption.style.display = "inline-block";
}

function BackSelection() {
	if (imageIndex > 0) {
		imageIndex--;
		
		var dragAndDropCanvas = document.getElementById("dragAndDrop");
		var context2d = dragAndDropCanvas.getContext("2d");
		
		if (typeof imageArray[imageIndex] !== 'undefined') {
			var image = imageArray[imageIndex];
			
			var centerX = (CANVAS_WIDTH - image.width) / 2;
			var centerY = (CANVAS_HEIGHT - image.height) / 2;
			
			context2d.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
			context2d.drawImage(image, centerX, centerY, image.width, image.height);
		}
		else {
			context2d.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		}
		
		var spriteID = document.getElementById("spriteID");
		spriteID.innerHTML = spriteName[imageIndex];
	}
}

function NextSelection() {
	if (imageIndex < 2) {
		imageIndex++;
		
		var dragAndDropCanvas = document.getElementById("dragAndDrop");
		var context2d = dragAndDropCanvas.getContext("2d");
		
		if (typeof imageArray[imageIndex] !== 'undefined') {
			var image = imageArray[imageIndex];
			
			var centerX = (CANVAS_WIDTH - image.width) / 2;
			var centerY = (CANVAS_HEIGHT - image.height) / 2;
			
			context2d.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
			context2d.drawImage(image, centerX, centerY, image.width, image.height);
		}
		else {
			context2d.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		}
		
		var spriteID = document.getElementById("spriteID");
		spriteID.innerHTML = spriteName[imageIndex];
	}
}

var CANVAS_HEIGHT = 350;
var CANVAS_WIDTH = 350;

function renderImage(src){
	var image = new Image();
	image.src = src;
	imageArray[imageIndex] = image;
	
	image.onload = function(){
		var dragAndDropCanvas = document.getElementById("dragAndDrop");
		
		if(image.height > CANVAS_HEIGHT) {
			image.width *= CANVAS_HEIGHT / image.height;
			image.height = CANVAS_HEIGHT;
		}
		
		var centerX = (CANVAS_WIDTH - image.width) / 2;
		var centerY = (CANVAS_HEIGHT - image.height) / 2;
		var context2d = dragAndDropCanvas.getContext("2d");
		
		context2d.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context2d.drawImage(image, centerX, centerY, image.width, image.height);
	};
}

function loadSprite(src){
	if(src.type.match(/image.*/)) {
		var reader = new FileReader();
		reader.onload = function(e){
			renderImage(e.target.result);
		};
		reader.readAsDataURL(src);
	}
	else {
		console.log("The dropped file is not an image: ", src.type);
	}
}
/**************** Menu Functions ****************/

/**************** Functions ****************/
function IncreaseXP(xp) {
	score++;
	XP += xp;
	document.getElementById("XPprogress").style.width = XP + "%";
	
	if (XP == 100) {
		level++;
		XP = 0;
	}
}

function DecreaseLife() {
	var heart = document.getElementsByClassName("fa-heart");
	if (heart.length != 0) {
		heart[0].className = "fa fa-heart-o";
	}
	else {
		console.log("you lose!");
		GameOver();
	}
}

function saveScore() {
	var user = document.getElementById("user").value;
	
	if (user.trim() == "") {
		highScoreUserArray.push(new highScoreUser("User", score));
	}
	else {
		highScoreUserArray.push(new highScoreUser(user.substring(0,40), score));
	}
	
	var highScore = "";
	highScoreUserArray.sort(function(a, b){return b.score-a.score});
	for (i = 0; i < highScoreUserArray.length; i++) {
		if (i == 5) {
			break;
		}
		highScore += highScoreUserArray[i].user + " " + highScoreUserArray[i].score + "\n";
	}
	for (j = 0; j < 5-i; j++) {
		highScore += "---    ---\n";
	}
	highScoreTextDevice.text = highScore;
	
	$('#score').modal('toggle');
}

function GameOver() {
	stage.removeAllChildren();
	clearInterval(enemyFiringIntervalDevice);
	
	createjs.Ticker.removeEventListener("tick", updateStage);
	
	enemyOnScreen = [];
	blastOnScreen = [];
	
	$('#score').modal('toggle');
	
	document.getElementById("points").innerHTML = score + " Points"
	
	var introCanvas = document.getElementById("introCanvas");
	introCanvas.style.display = "inline-block";
	var startOption = document.getElementById("startOptions");
	startOption.style.display = "inline-block";
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.style.display = "none";
	
	createjs.Ticker.addEventListener("tick", updateIntroStage);
}

function PlayerBlast() {
	if (pressedKeys[4] == true) {
		if (waitFired == true) {
			if (level == 0) {
				/*********** set-up player blast ***********/
				var blast = new createjs.Shape();
				blast.graphics.beginFill("#3a87ad").drawCircle(0, 0, 2);

				blast.x = player.x;
				blast.y = player.y;
				
				stage.addChild(blast);
				blastOnScreen.push(new Blast(blast, playerDirection, 0));
				/*********** set-up player blast ***********/
				
				/*********** wait ***********/
				waitFired = false;
				setTimeout(function(){ waitFired = true; }, fireWaitTime);
				/*********** wait ***********/
			}
			if (level >= 1) {
				/*********** set-up player blast ***********/
				var blast = new createjs.Shape();
				blast.graphics.beginFill("#3a87ad").drawCircle(0, 0, 2);
				
				var blast2 = blast.clone(true);
				var blast3 = blast.clone(true);

				blast.x = blast2.x = blast3.x = player.x;
				blast.y = blast2.y = blast3.y = player.y;
				
				stage.addChild(blast);
				stage.addChild(blast2);
				stage.addChild(blast3);
				
				var dir2 = playerDirection+90;
				var dir3 = playerDirection-90;
				
				blastOnScreen.push(new Blast(blast, playerDirection, 0));
				blastOnScreen.push(new Blast(blast2, dir2, 0));
				blastOnScreen.push(new Blast(blast3, dir3, 0));
				/*********** set-up player blast ***********/
				
				/*********** wait ***********/
				waitFired = false;
				setTimeout(function(){ waitFired = true; }, fireWaitTime);
				/*********** wait ***********/
			}
		}
	}
}

function EnemyBlast() {
	for (var i = 0; i < enemyOnScreen.length; i++) {
		/*********** find degree between enemy and player ***********/
		var ratio = (enemyOnScreen[i].enemy.x - player.x) / (enemyOnScreen[i].enemy.y - player.y);
		var degree = -1 * Math.atan( ratio ) * rad2deg;
		if (player.y < enemyOnScreen[i].enemy.y) {
			degree += 180;
		}
		degree += 180;
		/*********** find degree between enemy and player ***********/
		
		/*********** create new blast ***********/
		var blast = new createjs.Shape();
		blast.graphics.beginFill("#b94a48").drawCircle(0, 0, 2);

		blast.x = enemyOnScreen[i].enemy.x;
		blast.y = enemyOnScreen[i].enemy.y;
		
		blast.rotation = degree;
		/*********** create new blast ***********/
		
		/*********** add blast to array and update stage ***********/
		blastOnScreen.push(new Blast(blast, degree, 1));
		
		stage.addChild(blast);
		/*********** add blast to array and update stage ***********/
	}
}

function enemyDirection() {
	for (var j = 0; j < enemyOnScreen.length; j++) {
		/*********** find enemy degree to player ***********/
		var ratio = (enemyOnScreen[j].enemy.x - player.x) / (enemyOnScreen[j].enemy.y - player.y);
		var degree = -1 * Math.atan( ratio ) * rad2deg;
		if (player.y < enemyOnScreen[j].enemy.y) {
			degree += 180;
		}
		degree += 180;
		/*********** find enemy degree to player ***********/
		
		/*********** rotate enemy to player ***********/
		enemyOnScreen[j].enemy.rotation = degree;
		/*********** rotate enemy to player ***********/
	}
}

function blastMovement() {
	for (i = 0; i < blastOnScreen.length; i++) { 
		/*********** move on-screen blast ***********/
		var blastXmove = blastSpeed * Math.cos(deg2rad * (blastOnScreen[i].direction - 90));
		var blastYmove = blastSpeed * Math.sin(deg2rad * (blastOnScreen[i].direction - 90));
		blastOnScreen[i].blast.x += blastXmove;
		blastOnScreen[i].blast.y += blastYmove;
		/*********** move on-screen blast ***********/
		
		/*********** remove off-screen blast ***********/
		if (blastOnScreen[i].blast.y < 0 || blastOnScreen[i].blast.y > height || blastOnScreen[i].blast.x < 0 || blastOnScreen[i].blast.x > width) {
			stage.removeChild(blastOnScreen[i].blast);
			blastOnScreen.splice(i, 1);
			continue;
		}
		/*********** remove off-screen blast ***********/
		
		/*********** enemy blast logic ***********/
		if (blastOnScreen[i].group == 1) {
			/*********** get hit-box ***********/
			var hitboxX = blastOnScreen[i].blast.x - player.x;
			var hitboxY = blastOnScreen[i].blast.y - player.y;
			/*********** get hit-box ***********/
			
			/*********** check hit-box ***********/
			if (hitboxX > -15 && hitboxX < 15 && hitboxY > -15 && hitboxY < 15) {
				if (soundEffectOn) {
					createjs.Sound.play("explosion", {volume:.1});
				}
				
				DecreaseLife();
				
				if (typeof blastOnScreen[i] !== 'undefined') {
					stage.removeChild(blastOnScreen[i].blast);
					blastOnScreen.splice(i, 1);
				}
				
				continue;
			}
			/*********** check hit-box ***********/
		}
		/*********** enemy blast logic ***********/
		
		/*********** player blast logic ***********/
		if (blastOnScreen[i].group == 0) {
			for (j = 0; j < enemyOnScreen.length; j++) {
				/*********** get hit-box for all enemy on-screen***********/
				var hitboxX = blastOnScreen[i].blast.x - enemyOnScreen[j].enemy.x;
				var hitboxY = blastOnScreen[i].blast.y - enemyOnScreen[j].enemy.y;
				/*********** get hit-box for all enemy on-screen***********/
				
				/*********** check hit-box ***********/
				if (hitboxX > -15 && hitboxX < 15 && hitboxY > -15 && hitboxY < 15) {
					if (soundEffectOn) {
						createjs.Sound.play("explosion", {volume:.1});
					}
					
					IncreaseXP(10);
					
					var enemyType = enemyOnScreen[j].type;
							
					/*********** remove projectile and enemy ***********/
					stage.removeChild(enemyOnScreen[j].enemy);
					enemyOnScreen.splice(j,1);
					stage.removeChild(blastOnScreen[i].blast);
					blastOnScreen.splice(i, 1);
					/*********** remove projectile and enemy ***********/
					
					/*********** add new enemy ***********/
					if (typeof imageArray[1] === 'undefined') {
						var enemy = new createjs.Shape();
						enemy.graphics.setStrokeStyle(4);
						enemy.graphics.beginStroke("#b94a48").beginFill("#555").drawPolyStar(0, 0, 15, 5, 0, -90);
					}
					else {
						var enemy = new createjs.Bitmap(imageArray[1]);
						enemy.regX = imageArray[1].naturalWidth/2;
						enemy.regY = imageArray[1].naturalHeight/2;
												
						if (imageArray[1].naturalWidth >= 30 && imageArray[1].naturalHeight >= 0) {
							var ratio = imageArray[1].width/imageArray[1].height;
							if (ratio >= 0) {
								var scaleX = 30/imageArray[1].width;
								var scaleY = (30/ratio)/imageArray[1].height;
								enemy.scaleX = scaleX;
								enemy.scaleY = scaleY;
							}
							else {
								var scaleX = (30/ratio)/imageArray[1].width;
								var scaleY = 30/imageArray[1].height;
								enemy.scaleX = scaleX;
								enemy.scaleY = scaleY;
							}
						}
					}
					
					stage.addChild(enemy);
					enemyOnScreen.push(new Enemy(enemy, enemyType));
					
					AIMovement(enemy, enemyType);
					
					break;
				}
				/*********** check hit-box ***********/
			}
		}
		/*********** player blast logic ***********/			
	}
}

function playerMovement() {
	if (pressedKeys[0] == true) {
		if (player.x - playerSpeed > 0) {
			player.x -= playerSpeed;
		}
	}
	if (pressedKeys[1] == true) {
		if (player.x + playerSpeed < width) {
			player.x += playerSpeed;
		}
	}
	if (pressedKeys[2] == true) {
		if (player.y - playerSpeed > 0) {
			player.y -= playerSpeed;
		}
	}
	if (pressedKeys[3] == true) {
		if (player.y + playerSpeed < height) {
			player.y += playerSpeed;
		}
	}
	
	var ratio = (stage.mouseX - player.x) / (stage.mouseY - player.y);
	playerDirection = -1 * Math.atan( ratio ) * rad2deg;
	if (player.y < stage.mouseY) {
		playerDirection += 180
	}

	player.rotation = playerDirection;
}

function AIMovement(Object, type) {
	/*********** set-up random speed ***********/
	var speed = Math.random() * 500 + 1500;
	/*********** set-up random speed ***********/
	
	/*********** set-up movement type ***********/
	if (type == 0) {
		Object.x = Math.random() * 600;
		Object.y = -23;
		
		createjs.Tween.get(Object)
			.to({ x: width}, speed, createjs.Ease.quartInOut);
			
		createjs.Tween.get(Object)
			.to({ y: height}, speed, createjs.Ease.quadIn);
	}
	if (type == 1) {
		Object.x = Math.random() * 600 + 200;
		Object.y = -23;
		
		createjs.Tween.get(Object)
			.to({ x: 0}, speed, createjs.Ease.quartInOut);
			
		createjs.Tween.get(Object)
			.to({ y: height}, speed, createjs.Ease.quadIn);
	}
	if (type == 2) {
		Object.x = Math.random() * 100;
		Object.y = height;
		
		createjs.Tween.get(Object)
			.to({ x: width/2}, speed, createjs.Ease.circIn)
			.to({ x: width}, speed, createjs.Ease.circOut);
			
		createjs.Tween.get(Object)
			.to({ y: 100}, speed)
			.to({ y: height}, speed);
			
		speed *= 2;
	}
	if (type == 3) {
		Object.x = Math.random() * 100 + 700;
		Object.y = -23;
		
		createjs.Tween.get(Object)
			.to({ x: width/2}, speed, createjs.Ease.circIn)
			.to({ x: 0}, speed, createjs.Ease.circOut);
			
		createjs.Tween.get(Object)
			.to({ y: height/2+100}, speed)
			.to({ y: -23}, speed);
		
		speed *= 2;
	}
	/*********** set-up movement type ***********/
	
	/*********** reset random movement speed after random interval ***********/
	setTimeout(function(){ AIMovement(Object, type); }, speed);
	/*********** reset random movement speed after random interval ***********/
}

function keyDown(event) {
	switch(event.keyCode) {
		case KEYCODE_LEFT:	
			pressedKeys[0] = true;
			break;
		case KEYCODE_RIGHT: 
			pressedKeys[1] = true;
			break;
		case KEYCODE_UP: 
			pressedKeys[2] = true;
			break;
		case KEYCODE_DOWN: 
			pressedKeys[3] = true;
			break;
		case KEYCODE_SPACE:
			pressedKeys[4] = true;
			break;
	}
}

function keyUp(event) {
	switch(event.keyCode) {
		case KEYCODE_LEFT:	
			pressedKeys[0] = false;
			break;
		case KEYCODE_RIGHT: 
			pressedKeys[1] = false;
			break;
		case KEYCODE_UP: 
			pressedKeys[2] = false;
			break;
		case KEYCODE_DOWN: 
			pressedKeys[3] = false;
			break;
		case KEYCODE_SPACE:
			pressedKeys[4] = false;
			break;
	}
}

function updateStage() {
	playerMovement();
	PlayerBlast();
	enemyDirection();
	blastMovement();
	stage.update();
}

function Play() {
	createjs.Ticker.removeEventListener("tick", updateIntroStage);
	
	stage = new createjs.Stage(document.getElementById("gameCanvas"));
	stage.canvas.width = width;
	stage.canvas.height = height;
	
	this.document.onkeydown = keyDown;
	this.document.onkeyup = keyUp;
	this.document.onmousedown = function() { pressedKeys[4] = true; };
	this.document.onmouseup = function() { pressedKeys[4] = false; };
	
	var emptyHeart = document.getElementsByClassName("fa-heart-o");
	while (emptyHeart.length > 0) {
		emptyHeart[0].className = "fa fa-heart";
	}
	XP = 0;
	document.getElementById("XPprogress").style.width = XP + "%";
	score = 0;
	level = 0;
	
	if (typeof imageArray[2] !== 'undefined') {
		var background = new createjs.Bitmap(imageArray[2]);
		stage.addChild(background);
	}

	if (typeof imageArray[0] === 'undefined') {
		player = new createjs.Shape();
		player.graphics.setStrokeStyle(4);
		player.graphics.beginStroke("#3a87ad").beginFill("white").drawPolyStar(0, 0, 15, 3, 0, -90);
		
		player.snapToPixel = true;
	}
	else {
		player = new createjs.Bitmap(imageArray[0]);
		player.regX = imageArray[0].naturalWidth/2;
		player.regY = imageArray[0].naturalHeight/2;
		
		player.snapToPixel = true;
		
		if (imageArray[0].naturalWidth >= 30 && imageArray[0].naturalHeight >= 0) {
			var ratio = imageArray[0].width/imageArray[0].height;
			if (ratio >= 0) {
				var scaleX = 30/imageArray[0].width;
				var scaleY = (30/ratio)/imageArray[0].height;
				player.scaleX = scaleX;
				player.scaleY = scaleY;
			}
			else {
				var scaleX = (30/ratio)/imageArray[0].width;
				var scaleY = 30/imageArray[0].height;
				player.scaleX = scaleX;
				player.scaleY = scaleY;
			}
		}
	}
	
	if (typeof imageArray[1] === 'undefined') {
		enemy = new createjs.Shape();
		enemy.graphics.setStrokeStyle(4);
		enemy.graphics.beginStroke("#b94a48").beginFill("#555").drawPolyStar(0, 0, 15, 5, 0, -90);
		
		enemy.snapToPixel = true;
	}
	else {
		enemy = new createjs.Bitmap(imageArray[1]);
		enemy.regX = imageArray[1].naturalWidth/2;
		enemy.regY = imageArray[1].naturalHeight/2;
		
		enemy.snapToPixel = true;
		
		if (imageArray[1].naturalWidth >= 30 && imageArray[1].naturalHeight >= 0) {
			var ratio = imageArray[1].width/imageArray[1].height;
			if (ratio >= 0) {
				var scaleX = 30/imageArray[1].width;
				var scaleY = (30/ratio)/imageArray[1].height;
				enemy.scaleX = scaleX;
				enemy.scaleY = scaleY;
			}
			else {
				var scaleX = (30/ratio)/imageArray[1].width;
				var scaleY = 30/imageArray[1].height;
				enemy.scaleX = scaleX;
				enemy.scaleY = scaleY;
			}
		}
	}
	
	var enemy2 = enemy.clone(true);
	var enemy3 = enemy.clone(true);
	var enemy4 = enemy.clone(true);
	
	enemyOnScreen.push(new Enemy(enemy, 0));
	enemyOnScreen.push(new Enemy(enemy2, 1));
	enemyOnScreen.push(new Enemy(enemy3, 2));
	enemyOnScreen.push(new Enemy(enemy4, 3));
	
	stage.addChild(player);
	stage.addChild(enemy);
	stage.addChild(enemy2);
	stage.addChild(enemy3);
	stage.addChild(enemy4);
	
	player.x = width/2;
	player.y = height-12;
	
	AIMovement(enemy, 0);
	AIMovement(enemy2, 1);
	AIMovement(enemy3, 2);
	AIMovement(enemy4, 3);
	
	enemyFiringIntervalDevice = setInterval(function(){ EnemyBlast(); }, enemyFiringInterval);
	
	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", updateStage);
}

function mobileAndTabletcheck() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};
/**************** Functions ****************/