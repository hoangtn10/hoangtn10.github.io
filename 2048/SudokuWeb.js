function load() {
	medBtn();
}

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function getPuzzle() {
	var puzzle = "";
	var list = document.getElementsByClassName("cell");
	for (var i = 0; i < list.length; i++) {
		if (list[i].value) {
			puzzle += list[i].value;
		}
		else {
			puzzle += 0;
		}
	}
	return puzzle;
}

function setPuzzle(puzzle) {
	var list = document.getElementsByClassName("cell");
	for (var i = 0; i < list.length; i++) {
		if (puzzle.charAt(i) != "0") {
			if (!list[i].value) {
				list[i].style.color = "rgba(255,128,1,0.5)";
				list[i].readOnly = true;
			}
			list[i].value = puzzle.charAt(i);
		}
		else {
			list[i].value = "";
			list[i].readOnly = false;
			list[i].style.color = "#A0A0A0";
		}
	}
}

function solveBtn() {
	var puzzle = solve(getPuzzle());
	if (puzzle == -1) {
		$("#wrong").slideDown();
		$("#good").slideUp();
	}
	else if (puzzle == -2) {
		$("#wrong").slideDown();
		$("#good").slideUp();
	}
	else if (puzzle == -3) {
		$("#wrong").slideDown();
		$("#good").slideUp();
	}
	else {
		if (finish() == 1) {
			$("#finish").slideDown();
			$("#good").slideUp();
		}
		setPuzzle(puzzle);
	}
}

function customBtn() {
	setPuzzle("000000000000000000000000000000000000000000000000000000000000000000000000000000000");
}

function checkBtn() {
	var puzzle = solve(getPuzzle());
	if (puzzle == -1) {
		$("#wrong").slideDown();
		$("#good").slideUp();
	}
	else if (puzzle == -2) {
		$("#wrong").slideDown();
		$("#good").slideUp();
	}
	else if (puzzle == -3) {
		$("#wrong").slideDown();
		$("#good").slideUp();
	}
	else {
		$("#good").slideDown();
		$("#wrong").slideUp();
	}
}

function finish() {
	var puzzle = getPuzzle();
	for (var i = 0; i < 81; i++) {
		if (puzzle.charAt(i) == "0") {
			return 0;
		}
	}
	var color = 0;
	var list = document.getElementsByClassName("cell");
	for (var i = 0; i < list.length; i++) {
		if (list[i].style.color == "#A0A0A0") {
			color = 1;
			break;
		}
	}
	if (color == 0) {
		return 0;
	}
	puzzle = solve(puzzle);
	if (puzzle > 0) {
		return 1;
	}
}


function exit(string) {
	if (string == "good") {
		$("#good").slideUp();
	}
	else if (string == "wrong") {
		$("#wrong").slideUp();
	}
	else if (string == "finish") {
		$("#finish").slideUp();
	}
	else {
		console.log("show(): wrong input!");
	}
}

function getRandomPuzzle() {
	var puzzle = "";
	var list = [];
	for (var i = 0; i < 81; i++) {
		if (i%10 == 0) {
			var rand = Math.floor(Math.random() * 9) + 1;
			while (puzzle.indexOf("" + rand) !== -1) {
				rand = Math.floor(Math.random() * 9) + 1;
			}
			puzzle += rand;
		}
		else {
			puzzle += 0;
		}
	}
	console.log(puzzle);
	return solve(puzzle);
}

function easyBtn() {
	setPuzzle("");
	var puzzle = getRandomPuzzle();
	for (var i = 0; i < 81; i++) {
		if (Math.random() > .5) {
			puzzle = puzzle.replaceAt(i, "0");
		}
	}
	setPuzzle(puzzle)
}

function medBtn() {
	setPuzzle("");
	var puzzle = getRandomPuzzle();
	for (var i = 0; i < 81; i++) {
		if (Math.random() > .4) {
			puzzle = puzzle.replaceAt(i, "0");
		}
	}
	setPuzzle(puzzle)
}

function hardBtn() {
	setPuzzle("");
	var puzzle = getRandomPuzzle();
	for (var i = 0; i < 81; i++) {
		if (Math.random() > .3) {
			puzzle = puzzle.replaceAt(i, "0");
		}
	}
	setPuzzle(puzzle)
}