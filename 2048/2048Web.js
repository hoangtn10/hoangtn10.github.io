var board = [
	[-1,-1,-1,-1],
	[-1,-1,-1,-1],
	[-1,-1,-1,-1],
	[-1,-1,-1,-1]
]

function load() {
	getBoard();
	console.log(board);
	console.log(isDownAble(0,2))
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

function down() {
	var row = 4, col = 0;
	for (var i = 12; i >= 0; i++) {
		col = i%4;
		if (col == 0) {
			row--;
		}
		if (list[i].value) {
			board[row][col] = list[i].value;
		}
	}
}

function isDownAble(row, col) {
	if (4*row+col < 12) {
		if (board[row+1][col] == -1 || board[row+1][col] == board[row][col]) {
			return true;
		}
	}
	return false;
}

function setBoard() {

}

function randomPostion() {

}

function getAvailablePositions() {

}