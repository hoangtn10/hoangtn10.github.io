var board = [
	[-1,-1,-1,-1],
	[-1,-1,-1,-1],
	[-1,-1,-1,-1],
	[-1,-1,-1,-1]
]

var color = [
	[2, "#ffffff"],
	[4, "#ede0c8"],
	[8, "#f2b179"],
	[16, "#f59563"],
	[32, "#f67c5f"],
	[64, "#f65e3b"],
	[128, "#edcf72"],
	[256, "#edcc61"],
	[512, "#edc850"],
	[1024, "#edc53f"],
	[2048, "#edc22e"],
]

function load() {
	getBoard();
	setColor();
	document.onkeydown = checkKey;
}

function setColor() {
	var row = -1, col = 0;
	var list = document.getElementsByClassName("cell");
	for (var i = 0; i < 16; i++) {
		col = i%4;
		if (col == 0) {
			row++;
		}
		for (var j = 0; j < color.length; j++) {
			if (list[i].value == color[j][0]) {
				list[i].style.color = color[j][1];
				break;
			}
			else {
				list[i].style.color = "#3c3a32";
			}
		}
	}
}

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        up();
    }
    else if (e.keyCode == '40') {
        down();
    }
    else if (e.keyCode == '37') {
       left();
    }
    else if (e.keyCode == '39') {
       right();
    }

    if (e.keyCode == '38' || e.keyCode == '40' || e.keyCode == '37' || e.keyCode == '39') {
    	var freePos = getAvailablePositions();
		var pos = randomPostion(freePos);
		board[pos[0]][pos[1]] = 2;

	    setBoard();
    }
}

function getBoard() {
	var row = -1, col = 0;
	var list = document.getElementsByClassName("cell");
	for (var i = 0; i < 16; i++) {
		col = i%4;
		if (col == 0) {
			row++;
		}
		if (list[i].value) {
			board[row][col] = list[i].value;
		}
	}
}

function setBoard() {
	var row = -1, col = 0;
	var list = document.getElementsByClassName("cell");
	for (var i = 0; i < 16; i++) {
		col = i%4;
		if (col == 0) {
			row++;
		}
		if (board[row][col] != -1) {
			list[i].value = board[row][col];
		}
		else {
			list[i].value = null;
		}
	}
	setColor();
}

function down() {
	downPhase1();
	downPhase2();
	downPhase1();
}

function downPhase1() {
	var change = 0;
	for (var row = 2; row >= 0; row--) {
		for (var col = 0; col <= 3; col++) {
			if (board[row][col] != -1) {
				if (isDownAble(row, col) == 1) {
					downAnimate(row, col);
					change = 1;
					board[row+1][col] = board[row][col];
					board[row][col] = -1;
				}
			}
		}
	}
	if (change == 1) {
		setTimeout(downPhase1(), 1000);
	}
}

function downPhase2() {
	for (var row = 2; row >= 0; row--) {
		for (var col = 0; col <= 3; col++) {
			if (board[row][col] != -1) {
				if (isDownAble(row, col) == 2) {
					change = 1;
					board[row+1][col] = board[row+1][col]*2;
					board[row][col] = -1;
				}
			}
		}
	}
}

function downAnimate(row, col) {
	$("#jf").animate({
            left: '250px',
            opacity: '0.5',
            height: '150px',
            width: '150px'
        });

	//iDiv.
	//document.getElementsByTagName('body')[0].appendChild(iDiv);
}

function isDownAble(row, col) {
	if (4*row+col < 12) {
		if (board[row+1][col] == -1) {
			return 1;
		}
		else if (board[row+1][col] == board[row][col]) {
			return 2
		}
	}
	return 0;
}

function up() {
	upPhrase1();
	upPhrase2();
	upPhrase1();
}

function upPhrase1() {
	var change = 0;
	for (var row = 1; row <= 3; row++) {
		for (var col = 0; col <= 3; col++) {
			if (board[row][col] != -1) {
				if (isUpAble(row, col) == 1) {
					change = 1;
					board[row-1][col] = board[row][col];
					board[row][col] = -1;
				}
			}
		}
	}
	if (change == 1) {
		upPhrase1();
	}
}

function upPhrase2() {
	for (var row = 1; row <= 3; row++) {
		for (var col = 0; col <= 3; col++) {
			if (board[row][col] != -1) {
				if (isUpAble(row, col) == 2) {
					change = 1;
					board[row-1][col] = board[row-1][col]*2;
					board[row][col] = -1;
				}
			}
		}
	}
}

function isUpAble(row, col) {
	if (4*row+col >= 4) {
		if (board[row-1][col] == -1) {
			return 1;
		}
		else if (board[row-1][col] == board[row][col]) {
			return 2
		}
	}
	return 0;
}

function left() {
	leftPhase1();
	leftPhase2();
	leftPhase1();
}

function leftPhase1() {
	var change = 0;
	for (var col = 1; col <= 3; col++) {
		for (var row = 0; row <= 3; row++) {
			if (board[row][col] != -1) {
				if (isLeftAble(row, col) == 1) {
					change = 1;
					board[row][col-1] = board[row][col];
					board[row][col] = -1;
				}
			}
		}
	}
	if (change == 1) {
		leftPhase1();
	}
}

function leftPhase2() {
	for (var col = 1; col <= 3; col++) {
		for (var row = 0; row <= 3; row++) {
			if (board[row][col] != -1) {
				if (isLeftAble(row, col) == 2) {
					change = 1;
					board[row][col-1] = board[row][col-1]*2;
					board[row][col] = -1;
				}
			}
		}
	}
}

function isLeftAble(row, col) {
	if (col > 0 && col < 4 && row >= 0 && row < 4) {
		if (board[row][col-1] == -1) {
			return 1;
		}
		else if (board[row][col-1] == board[row][col]) {
			return 2;
		}
	}
	return 0;
}

function right() {
	rightPhase1();
	rightPhase2();
	rightPhase1();
}

function rightPhase1() {
	var change = 0;
	for (var col = 2; col >= 0; col--) {
		for (var row = 0; row <= 3; row++) {
			if (board[row][col] != -1) {
				if (isRightAble(row, col) == 1) {
					change = 1;
					board[row][col+1] = board[row][col];
					board[row][col] = -1;
				}
			}
		}
	}
	if (change == 1) {
		rightPhase1();
	}
}

function rightPhase2() {
	for (var col = 2; col >= 0; col--) {
		for (var row = 0; row <= 3; row++) {
			if (board[row][col] != -1) {
				if (isRightAble(row, col) == 2) {
					change = 1;
					board[row][col+1] = board[row][col+1]*2;
					board[row][col] = -1;
				}
			}
		}
	}
}

function isRightAble(row, col) {
	if (col >= 0 && col < 3 && row >= 0 && row < 4) {
		if (board[row][col+1] == -1) {
			return 1;
		}
		else if (board[row][col+1] == board[row][col]) {
			return 2;
		}
	}
	return 0;
}

function randomPostion(pos) {
	var rand = Math.floor((Math.random() * pos.length));
	return pos[rand];
}

function getAvailablePositions() {
	var positions = [];
	for (var row = 0; row <= 3; row++) {
		for (var col = 0; col <= 3; col++) {
			if (board[row][col] == -1) {
				positions.push([row, col]);
			}
		}
	}
	return positions;
}