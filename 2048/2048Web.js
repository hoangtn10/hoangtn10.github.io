var board = [
	[-1,-1,-1,-1],
	[-1,-1,-1,-1],
	[-1,-1,-1,-1],
	[-1,-1,-1,-1]
]

// TODO
// downPhase1
	// move all tile down == 1
// downPhase2
	// add all tile down == 2
// downPhase1 again

function load() {
	getBoard();
	document.onkeydown = checkKey;
}

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        up();
    }
    else if (e.keyCode == '40') {
        // down arrow
        down();
    }
    else if (e.keyCode == '37') {
       // left arrow
       left();
    }
    else if (e.keyCode == '39') {
       // right arrow
       right();
    }
    setBoard();
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
}

function down() {
	var change = 0;
	for (var row = 2; row >= 0; row--) {
		for (var col = 0; col < 4; col++) {
			if (board[row][col] != -1) {
				if (isDownAble(row, col) == 1) {
					change = 1;
					board[row+1][col] = board[row][col];
					board[row][col] = -1;
				}
				if (isDownAble(row, col) == 2) {
					change = 1;
					board[row+1][col] = board[row+1][col]*2;
					board[row][col] = -1;
				}
			}
		}
		if (change == 1) {
			downClean();
		}
	}
}

function downClean() {
	var change = 0;
	for (var row = 2; row >= 0; row--) {
		for (var col = 0; col < 4; col++) {
			if (board[row][col] != -1) {
				if (isDownAble(row, col) == 1) {
					change = 1;
					board[row+1][col] = board[row][col];
					board[row][col] = -1;
				}
			}
		}
		if (change == 1) {
			downClean();
		}
	}
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
	var change = 0;
	for (var row = 0; row <= 2; row++) {
		for (var col = 0; col < 4; col++) {
			if (board[row][col] != -1) {
				if (isUpAble(row, col) == 1) {
					change = 1;
					board[row-1][col] = board[row][col];
					board[row][col] = -1;
				}
				if (isUpAble(row, col) == 2) {
					change = 1;
					board[row-1][col] = board[row-1][col]*2;
					board[row][col] = -1;
				}
			}
		}
		if (change == 1) {
			upClean();
		}
	}
}

function upClean() {

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
	var col = 4, row = 0, change = 0;
	for (var i = 0; i < 12; i++) {
		row = i%4;
		if (row == 0) {
			col--;
		}
		if (board[row][col] != -1) {
			if (isLeftAble(row, col) == 1) {
				change = 1;
				board[row][col-1] = board[row][col];
				board[row][col] = -1;
			}
			if (isLeftAble(row, col) == 2) {
				change = 1;
				board[row][col-1] = board[row][col-1]*2;
				board[row][col] = -1;
			}
		}
	}
	if (change == 1) {
		leftClean();
	}
}

function leftClean() {

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
	var col = 3, row = 0, change = 0;
	for (var i = 4; i < 16; i++) {
		row = i%4;
		if (row == 0) {
			col--;
		}
		if (board[row][col] != -1) {
			if (isRightAble(row, col) == 1) {
				change = 1;
				board[row][col+1] = board[row][col];
				board[row][col] = -1;
			}
			if (isRightAble(row, col) == 2) {
				change = 1;
				board[row][col+1] = board[row][col+1]*2;
				board[row][col] = -1;
			}
		}
	}
	if (change == 1) {
		right();
	}
}

function rightClean() {

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

function randomPostion() {

}

function getAvailablePositions() {

}