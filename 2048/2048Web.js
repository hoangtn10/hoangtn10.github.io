var board = [
	[2,-1,-1,-1],
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

var alertOnce = 0;

function load() {
	var cell = document.getElementById("cell");
    for (var i = 0; i < 15; i++) {
        var cln = cell.cloneNode(true);
        cell.parentNode.insertBefore(cln, cell);
    }

	setBoard();
	getBoard();
	setColor();

	document.onkeydown = checkKey;

	document.getElementById('fixed').addEventListener('touchmove', function(e) {
	    e.preventDefault();
	}, false);

	$(function() {
		$(".controller").swipe( {
			preventDefaultEvents: false,
			allowPageScroll:"none",
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
				var change = 0;
				if (direction == "up") {
					change = up();
				}
				if (direction == "down") {
					change = down();
				}
				if (direction == "left") {
					change = left();
				}
				if (direction == "right") {
					change = right();
				}
				if (direction == "up" || direction == "down" || direction == "left" || direction == "right") {
					var freePos = getAvailablePositions();
				    if (freePos.length != 0) {
				    	console.log("hi")
				    	var pos = randomPostion(freePos);
						var list = document.getElementsByClassName("numbers");
						var index = 4*pos[0] + pos[1]
						var rand = Math.floor((Math.random() * 2) + 1) * 2;

				        if (change == 1) {
				            list[index].style.opacity = 0;
				    		list[index].innerHTML = rand;
				    		board[pos[0]][pos[1]] = rand;
				    
				    		$( list[index] ).animate({
				    		    opacity: 1,
				    		}, 500);
				        }
				        
			        	setBoard();
				        checkWon();
				        checkLost();
				        setColor();  
				    }
				}
			},
			threshold:0
		});
	});
}

function newGame() {
    alertOnce = 0;
    for (var row = 0; row <= 3; row++) {
	    for (var col = 0; col <= 3; col++) {
            board[row][col] = -1;
	    }
    }
    board[0][0] = 2;
    document.getElementById("score").innerHTML = 0;
    setBoard();
}

function setColor() {
	var row = -1, col = 0;
	var list = document.getElementsByClassName("numbers");
	for (var i = 0; i < 16; i++) {
		col = i%4;
		if (col == 0) {
			row++;
		}
		for (var j = 0; j < color.length; j++) {
			if (list[i].innerHTML == "") {
				list[i].parentNode.style.borderColor = "#2a333c"
				break;
			}
			if (list[i].innerHTML == color[j][0]) {
				list[i].style.color = color[j][1];
				list[i].parentNode.style.borderColor = color[j][1];
				break;
			}
			else {
				list[i].style.color = "#3c3a32";
				list[i].parentNode.style.borderColor = "#3c3a32"
			}
		}
	}
}

function checkKey(e) {
    var change = 0;
    e = e || window.event;
    if (e.keyCode == '38') {
        change = up();
    }
    else if (e.keyCode == '40') {
        change = down();
    }
    else if (e.keyCode == '37') {
        change = left();
    }
    else if (e.keyCode == '39') {
        change = right();
    }

    if (e.keyCode == '38' || e.keyCode == '40' || e.keyCode == '37' || e.keyCode == '39') {
	    var freePos = getAvailablePositions();
	    if (freePos.length != 0) {
	    	var pos = randomPostion(freePos);
			var list = document.getElementsByClassName("numbers");
			var index = 4*pos[0] + pos[1]
			var rand = Math.floor((Math.random() * 2) + 1) * 2;

			if (change == 1) {
	            list[index].style.opacity = 0;
	    		list[index].innerHTML = rand;
	    		board[pos[0]][pos[1]] = rand;
	    
	    		$( list[index] ).animate({
	    		    opacity: 1,
	    		}, 500);
	        }
			setBoard();
			checkWon();
			checkLost();
			setColor();
	    }
    }
}

function checkWon() {
    if (alertOnce == 0) {
        for (var row = 0; row <= 3; row++) {
		    for (var col = 0; col <= 3; col++) {
                if (board[row][col] == 2048) {
                    alertOnce = 1;
                    alert("You Won!");
                }
		    }
        }
    }
}

function checkLost() {
    var change = 0;
    for (var row = 0; row <= 3; row++) {
	    for (var col = 0; col <= 3; col++) {
            if (isLeftAble(row, col) || isRightAble(row, col) || isUpAble(row, col) || isDownAble(row, col)) {
            	change = 1
            }
	    }
    }
    if (change == 0) {
        alert("You Lost!");
    }
}

function getBoard() {
	var row = -1, col = 0;
	var list = document.getElementsByClassName("numbers");
	for (var i = 0; i < 16; i++) {
		col = i%4;
		if (col == 0) {
			row++;
		}
		if (list[i].innerHTML) {
			board[row][col] = list[i].innerHTML;
		}
	}
}

function setBoard() {
	var row = -1, col = 0;
	var list = document.getElementsByClassName("numbers");
	for (var i = 0; i < 16; i++) {
		col = i%4;
		if (col == 0) {
			row++;
		}
		if (board[row][col] != -1) {
			list[i].innerHTML = board[row][col];
		}
		else {
			list[i].innerHTML = "";
		}
	}
	setColor();
}

function addScore(newScore) {
	var score = document.getElementById("score");
	var best = document.getElementById("best");

	if (newScore != null) {
		score.innerHTML = eval(score.innerHTML) + newScore;
		if (eval(score.innerHTML) > eval(best.innerHTML)) {
			best.innerHTML = score.innerHTML;
		}
	}
}

function glow(row, col) {
	var from = document.getElementsByClassName("numbers")[4*row + col];
	addScore(board[row][col]);
	from.innerHTML = board[row][col];

	$(from).css('transform', 'scale(2)');
	setTimeout(function() { $(from).css('transform', 'scale(1)') }, 250);
}

function down() {
	var change = 0;
	change |= downPhase1();
	change |= downPhase2();
	change |= downPhase1();
    return change;
}

function downPhase1() {
	var change = 0;
	for (var row = 2; row >= 0; row--) {
		for (var col = 0; col <= 3; col++) {
			if (board[row][col] != -1) {
				if (isDownAble(row, col) == 1) {
					change = 1;
					board[row+1][col] = board[row][col];
					board[row][col] = -1;
				}
			}
		}
	}
	if (change == 1) {
		downPhase1();
	}
	return change;
}

function downPhase2() {
    var change = 0;
	for (var row = 2; row >= 0; row--) {
		for (var col = 0; col <= 3; col++) {
			if (board[row][col] != -1) {
				if (isDownAble(row, col) == 2) {
					change = 1;
					board[row+1][col] = board[row+1][col]*2;
					board[row][col] = -1;
					glow(row+1, col)
				}
			}
		}
	}
	return change;
}

function isDownAble(row, col) {
	if (4*row+col < 12) {
		if (board[row][col] == -1) {
			return 0;
		}
		else if (board[row+1][col] == -1) {
			return 1;
		}
		else if (board[row+1][col] == board[row][col]) {
			return 2;
		}
	}
	return 0;
}

function up() {
    var change = 0;
	change |= upPhase1();
	change |= upPhase2();
	change |= upPhase1();
	return change;
}

function upPhase1() {
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
		upPhase1();
	}
	return change;
}

function upPhase2() {
    var change = 0;
	for (var row = 1; row <= 3; row++) {
		for (var col = 0; col <= 3; col++) {
			if (board[row][col] != -1) {
				if (isUpAble(row, col) == 2) {
					change = 1;
					board[row-1][col] = board[row-1][col]*2;
					board[row][col] = -1;
					glow(row-1, col)
				}
			}
		}
	}
	return change;
}

function isUpAble(row, col) {
	if (4*row+col >= 4) {
		if (board[row][col] == -1) {
			return 0;
		}
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
    var change = 0;
	change |= leftPhase1();
	change |= leftPhase2();
	change |= leftPhase1();
    return change;
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
	return change;
}

function leftPhase2() {
	var change = 0;
	for (var col = 1; col <= 3; col++) {
		for (var row = 0; row <= 3; row++) {
			if (board[row][col] != -1) {
				if (isLeftAble(row, col) == 2) {
					change = 1;
					board[row][col-1] = board[row][col-1]*2;
					board[row][col] = -1;
					glow(row, col-1)
				}
			}
		}
	}
	return change;
}

function isLeftAble(row, col) {
	if (col > 0 && col < 4 && row >= 0 && row < 4) {
		if (board[row][col] == -1) {
			return 0;
		}
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
    var change = 0;
	change |= rightPhase1();
	change |= rightPhase2();
	change |= rightPhase1();
    return change;
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
	return change;
}

function rightPhase2() {
	var change = 0;
	for (var col = 2; col >= 0; col--) {
		for (var row = 0; row <= 3; row++) {
			if (board[row][col] != -1) {
				if (isRightAble(row, col) == 2) {
					change = 1;
					board[row][col+1] = board[row][col+1]*2;
					board[row][col] = -1;
					glow(row, col+1)
				}
			}
		}
	}
	return change;
}

function isRightAble(row, col) {
	if (col >= 0 && col < 3 && row >= 0 && row < 4) {
		if (board[row][col] == -1) {
			return 0;
		}
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