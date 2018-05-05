var board = [
[-1, -1, -1, -1, -1, -1, -1, -1, -1],
[-1, -1, -1, -1, -1, -1, -1, -1, -1],
[-1, -1, -1, -1, -1, -1, -1, -1, -1],
[-1, -1, -1, -1, -1, -1, -1, -1, -1],
[-1, -1, -1, -1, -1, -1, -1, -1, -1],
[-1, -1, -1, -1, -1, -1, -1, -1, -1],
[-1, -1, -1, -1, -1, -1, -1, -1, -1],
[-1, -1, -1, -1, -1, -1, -1, -1, -1],
[-1, -1, -1, -1, -1, -1, -1, -1, -1]];

var cell = null;
var selectCell = null;
var colorBlock = "#3c4859";
var colorSet = "#8AA1B1";
var colorFocus = "#b9c7d0";

String.prototype.replaceAt = function(index, character) {
  return this.substr(0, index) + character + this.substr(index + character.length);
};

function load() {
  var cell = document.getElementById("cell");
  for (var i = 0; i < 80; i++) {
    var cln = cell.cloneNode(true);
    cell.parentNode.insertBefore(cln, cell);
  }

  makeConstraints();
  findNeighbors();

  if (typeof(Storage) !== "undefined") {
    var boardData = localStorage.getItem('sudokuBoard')
    var userData = localStorage.getItem('sudokuBoardUser')
    if (boardData && userData) {
      setBoard(boardData);
      var list = document.getElementsByClassName("square");
      for (i = 0; i < list.length; i++) {
        if (userData[i] != 0) {
          list[i].innerHTML = userData[i];
        }
      }
    }
    else {
      difficulty(.4);
    }
  }

  setColor();
  resize();
  window.addEventListener("resize", resize);
}

function solution(warning) {
  var puzzle = solve(getBoard());
  if (puzzle.length == 81) {
    if (warning == 0) {
      setBoard(puzzle);
    }
    else {
      $("#warningBtn").attr("class", "btn btn-success w-100");
    }
  }
  else {
    $("#warningBtn").attr("class", "btn btn-warning w-100");
  }
}

function difficulty(num) {
  setBoard(0);
  var puzzle = getRandom();
  for (var i = 0; i < 81; i++) {
    if (Math.random() > num) {
      puzzle = puzzle.replaceAt(i, "0");
    }
  }
  setBoard(puzzle);
  setColor();
  storeData();
}

function getRandom() {
  var puzzle = "";
  var list = [];
  for (var i = 0; i < 81; i++) {
    if (i % 10 == 0) {
      var rand = Math.floor(Math.random() * 9) + 1;
      while (puzzle.indexOf("" + rand) !== -1) {
        rand = Math.floor(Math.random() * 9) + 1;
      }
      puzzle += rand;
    } else {
      puzzle += 0;
    }
  }
  return solve(puzzle);
}

function setBoard(puzzle) {
  var list = document.getElementsByClassName("square");
  for (var i = 0; i < puzzle.length; i++) {
    if (puzzle != 0 && puzzle.charAt(i) != "0") {
      list[i].innerHTML = puzzle.charAt(i);
      list[i].onclick = null;
    }
    else {
      list[i].innerHTML = "";
      list[i].onclick = cellClick;
    }
  }
  selectCell = null;
}

function setColor() {
  var list = document.getElementsByClassName("square");
  for (i = 0; i < list.length; i++) {
    if (getColor(i) == 0) {
      list[i].style.backgroundColor = "white";
      list[i].style.color = colorBlock;
      list[i].style.borderColor= colorBlock;
    }
    else {
      list[i].style.backgroundColor = colorBlock;
      list[i].style.color = "white";
    }
    if (list[i].innerHTML != "") {
      if (list[i].onclick != null) {
        list[i].style.backgroundColor = colorSet;
        list[i].style.borderColor = colorSet;
        list[i].style.color = "white";
      }
    }
  }
}

function storeData() {
  var boardPuzzle = "";
  var userPuzzle = "";
  var list = document.getElementsByClassName("square");
  for (var i = 0; i < list.length; i++) {
    if (list[i].innerHTML != "") {
      if (list[i].style.backgroundColor == "rgb(138, 161, 177)") {
        userPuzzle += list[i].innerHTML;
        boardPuzzle += "0";
      }
      else {
        userPuzzle += "0";
        boardPuzzle += list[i].innerHTML;
      }
    } else {
      boardPuzzle += "0";
      userPuzzle += "0";
    }
  }
  localStorage.setItem('sudokuBoard', boardPuzzle);
  localStorage.setItem('sudokuBoardUser', userPuzzle);
}

function getBoard() {
  var puzzle = "";
  var list = document.getElementsByClassName("square");
  for (var i = 0; i < list.length; i++) {
    if (list[i].innerHTML != "") {
      puzzle += list[i].innerHTML;
    } else {
      puzzle += "0";
    }
  }
  return puzzle;
}

function getSelectCellIndex() {
  var child = selectCell;
  var i = 0;
  while( (child = child.previousSibling) != null ) {
    i++;
  }
  return i--;
}

function cellValChg(num) {
  if (selectCell != null) {
    if (num == 0) {
      selectCell.innerHTML = "";
    }
    else {
      selectCell.innerHTML = num;
    }
    selectCell = null;
  }
  setColor();
  storeData();
}

function cellClick() {
  if (selectCell != null) {
    if (selectCell == this) {
      selectCell = null;
      return;
    }
    else {
      setColor();
    }
  }
  selectCell = this;
  selectCell.style.backgroundColor = colorFocus; 
  selectCell.style.borderColor = colorFocus;
}

function getColor(i, type) {
  if ((i >= 3 && i < 6) || (i >= 12 && i < 15) ||
    (i >= 21 && i < 24) || (i >= 27 && i < 30) ||
    (i >= 33 && i < 39) || (i >= 42 && i < 48) ||
    (i >= 51 && i < 54) || (i >= 57 && i < 60) ||
    (i >= 66 && i < 69) || (i >= 75 && i < 78)) {
    return 0;
  } else {
    return 1;
  }
}

function resize() {
  width = $(".controller").outerWidth(true);
  var cellWidth = ((width / 9) - 8) + 'px';
  $(".controller").css({
    "height": width + 'px'
  });
  $(".square").css({
    "width": cellWidth,
    "height": cellWidth,
    "line-height": cellWidth
  });
  var list = document.getElementsByClassName("square");
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var cell = list[i * 9 + j];
      var cellX = (width / 9 * i) + 4 + $(".controller").position().left + 'px';
      var cellY = (width / 9 * j) + $(".controller").position().top + 'px';
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

/*******************/
/** SUDOKU SOLVER **/
/*******************/

var varList = [];
var conList = [];
var worklist = [];
for (var i = 0; i < 81; i++) {
  varList.push({
    domain: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    neighbors: []
  });
}

function diff(i1, i2) {
  list = [];
  for (var i = 0; i < varList[i1].domain.length; i++) {
    sat = 0;
    for (var j = 0; j < varList[i2].domain.length; j++) {
      if (varList[i1].domain[i] != varList[i2].domain[j]) {
        sat = 1;
      }
    }
    if (sat == 0) {
      varList[i1].domain.splice(i, 1);
      for (var k = 0; k < varList[i1].neighbors.length; k++) {
        worklist.push(varList[i1].neighbors[k]);
      }
    }
  }
}

function alldiff(list) {
  for (var i = 0; i < list.length; i++) {
    for (j = 0; j < list.length; j++) {
      if (i != j) {
        diff(list[i], list[j]);
      }
    }
  }
}

function makeConstraints() {
  for (var i = 0; i < 9; i++) {
    list = []
    for (var j = i; j < 81; j += 9) {
      list.push(j);
    }
    conList.push(list);
  }
  for (var i = 0; i < 81; i += 9) {
    list = [];
    for (var j = i; j < i + 9; j++) {
      list.push(j);
    }
    conList.push(list);
  }
  for (var i = 0; i <= 81 - 21; i += 3) {
    list = [];
    if (i == 9 || i == 36) {
      i += 18;
    }
    list.push(i);
    list.push(i + 1);
    list.push(i + 2);
    list.push(i + 9);
    list.push(i + 10);
    list.push(i + 11);
    list.push(i + 18);
    list.push(i + 19);
    list.push(i + 20);
    conList.push(list);
  }
}

function findNeighbors() {
  for (var i = 0; i < conList.length; i++) {
    for (var j = 0; j < conList[i].length; j++) {
      varList[conList[i][j]].neighbors.push(conList[i]);
    }
  }
}

function MRV() {
  var index = -1;
  var min = 10;
  for (var i = 0; i < 81; i++) {
    if (varList[i].domain.length > 1 && varList[i].domain.length < min) {
      index = i;
      min = varList[i].domain.length;
    }
  }
  return index;
}

function DH() {
  worklist = conList.slice();
  while (worklist.length > 0) {
    alldiff(worklist[0]);
    worklist.splice(0, 1);
  }
  for (var i = 0; i < 81; i++) {
    if (varList[i].domain.length < 1) {
      return -1;
    }
  }
  return 0;
}

function copyDomain() {
  var copy = [];
  for (var i = 0; i < 81; i++) {
    copy.push(varList[i].domain.slice());
  }
  return copy;
}

function replaceDomain(copy) {
  for (var i = 0; i < 81; i++) {
    varList[i].domain = copy[i];
  }
}

function backtracking() {
  var index = MRV();
  if (index == -1) {
    return 0;
  } else {
    var domain = varList[index].domain.slice();
    for (var i = 0; i < domain.length; i++) {
      varList[index].domain = [domain[i]];
      var copy = copyDomain();
      if (DH() == 0) {
        if (backtracking() == 0) {
          return 0;
        }
      }
      replaceDomain(copy);
    }
  }
}

function solve(puzzle) {
  if (puzzle.length != 81) {
    console.log("invalid board length");
    return -1;
  }
  for (var i = 0; i < 81; i++) {
    varList[i].domain = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }
  for (var i = 0; i < 81; i++) {
    if (isNaN(parseInt(puzzle.charAt(i)))) {
      console.log("invalid board element");
      return -2;
    }
    if (puzzle.charAt(i) != "0") {
      varList[i].domain = [(parseInt(puzzle.charAt(i)))];
    }
  }
  var solvedPuzzle = "";
  DH();
  backtracking();
  print();
  for (var i = 0; i < 81; i++) {
    if (varList[i].domain.length == 0) {
      console.log("invalid board logic");
      return -3;
    }
    solvedPuzzle += varList[i].domain[0];
  }
  return solvedPuzzle;
}

function print() {
  string = "";
  for (var i = 0; i < 81; i += 9) {
    string += "|";
    for (var j = i; j < i + 9; j++) {
      string += varList[j].domain + "|";
    }
    string += "\n";
  }
  console.log(string);
}