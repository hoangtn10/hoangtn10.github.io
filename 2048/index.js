var board = [
[-1, -1, -1, -1],
[-1, -1, -1, -1],
[-1, -1, -1, -1],
[-1, -1, -1, -1]
];

var color = [
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

var NONE = -1,
UP = 0,
DOWN = 1,
LEFT = 2,
RIGHT = 3;
var NOPOP = 0,
POP = 1;
var VALUE = 0,
CELL = 1,
ISPOP = 2;

var alertOnce = 0;
var width = 0;
var score = 0;
var best = 0;

function load() {
  var cell = document.getElementById("cell");
  for (var i = 0; i < 15; i++) {
    var cln = cell.cloneNode(true);
    cell.parentNode.insertBefore(cln, cell);
  }

  document.onkeydown = function(e) {
    move(e.keyCode)
  };

  $(function() {
    $(".controller").swipe({
      preventDefaultEvents: false,
      allowPageScroll: "none",
      swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
        move(direction);
      },
      threshold: 0
    });
  });
  
  if (typeof(Storage) !== "undefined") {
    var data = localStorage.getItem('2048Board')
    if (data) {
      var dataList = JSON.parse(localStorage.getItem('2048Board'))
      for (i = 0; i < dataList.length; i++) {
        add(dataList[i][0], dataList[i][1], dataList[i][2]);
      }
      score = parseInt(localStorage.getItem('2048BoardCurrent'))
      best = parseInt(localStorage.getItem('2048BoardBest'))
      updateScore()
    }
    else {
      var c = getFree();
      add(c[0], c[1], 2);
    }
  }

  document.getElementById('fixed').addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, false);

  resize();
  window.addEventListener("resize", resize);
}

function storeData() {
  var dataList = [];
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      if (board[i][j] != -1) {
        dataList.push([i, j, board[i][j][0]]);
      }
    }
  }
  localStorage.setItem('2048Board', JSON.stringify(dataList));
}

function add(row, col, value) {
  var cell = document.getElementById("cell");
  var cln = cell.cloneNode(true);
  var clnX = width / 4 * row + 4 + $(".controller").position().left + 'px';
  var clnY = width / 4 * col + $(".controller").position().top + 'px';
  $(cln).css({
    'left': clnX,
    'top': clnY,
    'opacity': 0
  });
  cln.innerHTML = value;
  cell.parentNode.appendChild(cln);
  board[row][col] = [value, cln, 0];

  $(cln).velocity({
    opacity: 1
  }, 500);

  setColor();
}

function setColor() {
  for (var row = 0; row <= 3; row++) {
    for (var col = 0; col <= 3; col++) {
      var cell = board[row][col][CELL];
      var value = board[row][col][VALUE];
      for (var j = 0; j < color.length; j++) {
        if (value == color[j][0]) {
          cell.style.backgroundColor = color[j][1];
          cell.style.color = "white";
          // cell.style.borderColor = "#776e65";
          break;
        }
      }
    }
  }
}

function move(direction) {
  direction = direction || window.event;
  if (direction == '38' || direction == 'up') {
    moveDirect(UP);
  } else if (direction == '40' || direction == 'down') {
    moveDirect(DOWN);
  } else if (direction == '37' || direction == 'left') {
    moveDirect(LEFT);
  } else if (direction == '39' || direction == 'right') {
    moveDirect(RIGHT);
  }
  if (direction == '38' || direction == '40' || direction == '37' || direction == '39' || direction == "up" || direction == "down" || direction == "left" || direction == "right") {
    $('.square').finish();
    animate();
    updateScore();
    storeData();
  }
}

function moveDirect(direction) {
  var x = 0,
  y = 0;
  var r1, r2, c1, c2;
  var changeOnce = 0;

  if (direction == UP) {
    y = -1;
    r1 = 0, c1 = 0;
  } else if (direction == DOWN) {
    y = 1;
    r1 = 0, c1 = 3;
  } else if (direction == LEFT) {
    x = -1;
    r1 = 0, c1 = 0;
  } else {
    x = 1;
    r1 = 3, c1 = 0;
  }

  do {
    var change = 0;
    for (var row = r1; r1 == 0 ? row <= 3 : row >= 0; r1 == 0 ? row++ : row--) {
      for (var col = c1; c1 == 0 ? col <= 3 : col >= 0; c1 == 0 ? col++ : col--) {
        var value = board[row][col][VALUE];
        var cell = board[row][col][CELL];
        var pop = board[row][col][ISPOP];

        if (cell && value) {
          if (isFree(row + x, col + y)) {
            board[row + x][col + y] = [value, cell, NOPOP];
            board[row][col] = -1;
            change = 1;
          } else if (isSame(value, row + x, col + y) && pop == 0 && board[row + x][col + y][ISPOP] == 0) {
            var cellSib = board[row + x][col + y][CELL];
            cellSib.parentNode.removeChild(cellSib);
            board[row + x][col + y] = [value * 2, cell, POP];
            board[row][col] = -1;

            score += value;
            if (score > best) {
              best = score
            }
            change = 1;
          }
        }
        changeOnce |= change;
      }
    }
  } while (change == 1);

  if (changeOnce) {
    var cell = getFree();
    add(cell[0], cell[1], 2);
  }
}

function isFree(row, col) {
  if (board[row] && board[row][col] && board[row][col] == -1) {
    return 1;
  }
  return 0;
}

function isSame(value, row, col) {
  if (board[row] && board[row][col] && board[row][col][0] && board[row][col][0] == value) {
    return 1;
  }
  return 0;
}

function getFree() {
  var row = Math.floor(Math.random() * 4);
  var col = Math.floor(Math.random() * 4);
  while (board[row][col] != -1) {
    row = Math.floor(Math.random() * 4);
    col = Math.floor(Math.random() * 4);
  }
  return [row, col];
}

function animate() {
  for (var row = 0; row <= 3; row++) {
    for (var col = 0; col <= 3; col++) {
      if (board[row][col] == -1) {
        continue;
      }
      var cell = board[row][col][CELL];
      var value = board[row][col][VALUE];
      var pop = board[row][col][ISPOP];

      var cellX = (width / 4 * col) + $(".controller").position().top + 'px';
      var cellY = (width / 4 * row) + 4 + $(".controller").position().left + 'px';

      if ($(cell).css("top") != cellX || $(cell).css("left") != cellY) {
        $(cell).animate({
          top: cellX,
          left: cellY
        }, 100, (function(cell, value, pop) {
          cell.innerHTML = value;
          if (pop == 1) {
            $(cell).css('transform', 'scale(1.1)');
            setTimeout(function() {
              $(cell).css('transform', 'scale(1)')
            }, 250);
          }
        })(cell, value, pop));
      }

      board[row][col][ISPOP] = 0;
    }
  }
}

function resize() {
  width = $(".controller").outerWidth(true);
  var cellWidth = ((width / 4) - 8) + 'px';

  $(".controller").css({
    "height": width
  });
  $(".square").css({
    "width": cellWidth,
    "height": cellWidth,
    "line-height": cellWidth
  });

  var list = document.getElementsByClassName("square");
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var cell = list[i * 4 + j];
      var cellX = (width / 4 * i) + 4 + $(".controller").position().left + 'px';
      var cellY = (width / 4 * j) + $(".controller").position().top + 'px';
      $(cell).css({
        'left': cellX,
        'top': cellY
      });

      if (board[i][j] != -1) {
        cell = board[i][j][CELL];
        $(cell).css({
          'left': cellX,
          'top': cellY
        });
      }
    }
  }
}

function newGame() {
  for (var row = 0; row <= 3; row++) {
    for (var col = 0; col <= 3; col++) {
      if (board[row][col] == -1) {
        continue;
      }
      var cell = board[row][col][CELL];
      cell.parentNode.removeChild(cell);
      board[row][col] = -1
    }
  }
  var cell = getFree();
  add(cell[0], cell[1], 2);
  score = 0;
  updateScore();
  storeData()
}

function updateScore() {
  document.getElementById("HighScore").innerHTML = best;
  document.getElementById("CurrentScore").innerHTML = score;

  localStorage.setItem('2048BoardBest', best);
  localStorage.setItem('2048BoardCurrent', score);
}