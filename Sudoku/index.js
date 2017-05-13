/*******************/
/**  SUDOKU WEB   **/
/*******************/

var clnList = [];
var clnCell = null;
var clnColor = "";

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
};
function load() {
    var cell                = document.getElementById("cell");
    var parentCell          = cell.parentNode;
    var firstChild          = parentCell.firstChild;
    var lastChild           = parentCell.lastChild;

    cell.onclick            = cellClick;
    parentCell.removeChild(firstChild);
    parentCell.removeChild(lastChild);

    for (var i = 0; i < 80; i++) {
        var cln                     = cell.cloneNode(true);

        cln.onclick                 = cellClick;
        cln.style.backgroundColor   = getColor(i+1);
        parentCell.appendChild(cln);
    }

    medBtn();
    
    $('.item-modal').click(function(e) {
      e.stopPropagation();
    });
}
function getColor(i, type) {
    if ((i >= 3 && i < 6)   || (i >= 12 && i < 15) ||
        (i >= 21 && i < 24) || (i >= 27 && i < 30) ||
        (i >= 33 && i < 39) || (i >= 42 && i < 48) ||
        (i >= 51 && i < 54) || (i >= 57 && i < 60) ||
        (i >= 66 && i < 69) || (i >= 75 && i < 78)) {
        if (type) {
            return "#535353";
        }
        return "#7a7a7a";
    }
    else {
        if (type) {
            return "#343d47";
        }
        return "#3f4956";
    }
}
function cellClick() {
    var cell        = this;
    var parentCell  = cell.parentNode;
    var sibling     = parentCell.childNodes;
    var length      = clnList.length;
    
    if (clnCell !== null) {
        replaceCln(sibling);
        clnCell.style.backgroundColor   = clnColor;
        clnList                         = [];
    }
    if (cell === clnCell) {
        clnCell = null;
        return;
    }

    clnColor                    = cell.style.backgroundColor;
    cell.style.backgroundColor  = "#3a87ad";
    clnCell                     = cell;
    
    var cellIndex = Math.ceil((Array.prototype.indexOf.call(sibling, cell)+1)/9)*9;
    if (cellIndex == 81) {
        cellIndex = 63;
    }
    for (i = 0; i < 9; i++) {
        var index   = cellIndex+i;
        var cln     = sibling[index];
        var color   = cln.style.backgroundColor;
        var number  = cln.innerHTML;

        clnList.push([index, color, number]);
        cln.style.backgroundColor = "#3a87ad";
        setCellValue(cln, i+1);
        cln.onclick = function(cln, cell, sibling, length) {
            return function() {
                if (getCellValue(cln) == getCellValue(cell)) {
                    setCellValue(cell, "");
                }
                else {
                    cell.innerHTML = cln.innerHTML;
                }
                if (clnList.length === 0) {
                    return;
                }
                replaceCln(sibling);
                clnList = [];
                if (clnCell !== null) {
                    clnCell.style.backgroundColor   = clnColor;
                    clnCell                         = null;
                }
            };
        }(cln, cell, sibling);
    }
}
function getCellValue(cell) {
    return cell.childNodes[1].childNodes[1].childNodes[1].innerHTML;
}
function setCellValue(cell, value) {
    cell.childNodes[1].childNodes[1].childNodes[1].innerHTML = value;
}
function replaceCln(sibling) {
    for (var i = 0; i < 9; i++) {
        var index                   = clnList[i][0];
        var sib                     = sibling[index];
        sib.style.backgroundColor   = clnList[i][1];
        sib.innerHTML               = clnList[i][2];
        if (clnList[i][1] != "rgb(83, 83, 83)" && clnList[i][1] != "rgb(52, 61, 71)") {
            sib.onclick             = cellClick;
        }
        else {
            sib.onclick             = "";
        }
    }
}
function setPuzzle(puzzle, type) {
    clnList = [];
    clnCell = null;
    clnColor = "";
    var list = document.getElementsByClassName("numbers");
    for (var i = 0; i < puzzle.length; i++) {
        if (type) {
            list[i].innerHTML = puzzle.charAt(i);
            continue;
        }
        if (puzzle.charAt(i) != "0") {
            list[i].innerHTML = puzzle.charAt(i);
            list[i].parentNode.parentNode.parentNode.onclick = "";
            list[i].parentNode.parentNode.parentNode.style.backgroundColor = getColor(i,1);
            list[i].parentNode.parentNode.parentNode.className = "square";
        }
        else {
            list[i].innerHTML = "";
            list[i].parentNode.parentNode.parentNode.onclick = cellClick;
            list[i].parentNode.parentNode.parentNode.style.backgroundColor = getColor(i,0);
            list[i].parentNode.parentNode.parentNode.className = "square shine";
        }
    }
}
function getPuzzle() {
    var puzzle = "";
    var list = document.getElementsByClassName("numbers");
    for (var i = 0; i < list.length; i++) {
        if (list[i].innerHTML != "") {
            puzzle += list[i].innerHTML;
        }
        else {
            puzzle += "0";
        }
    }
    return puzzle;
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
function solveBtn() {
    var puzzle = solve(getPuzzle());
    if (puzzle.length == 81) {
       setPuzzle(puzzle, 1);
    }
    else {
        document.getElementById("status").innerHTML = "Uh oh, there's a misplaced cell!"
        $('.modal').modal('toggle');
    }
}
function blankBtn() {
    setPuzzle("000000000000000000000000000000000000000000000000000000000000000000000000000000000");
}
function checkBtn() {
    var puzzle = solve(getPuzzle());
    if (puzzle.length == 81) {
      $('#success').show(250);
      $('#failure').hide(250);

    }
    else {
      $('#failure').show(250);
      $('#success').hide(250);
    }
}

/*******************/
/**  SUDOKU WEB   **/
/*******************/

/*******************/
/** SUDOKU SOLVER **/
/*******************/

var varList = [];
var conList = [];
var worklist = [];
for (var i = 0; i < 81; i++) { 
  varList.push({ domain: [1,2,3,4,5,6,7,8,9], neighbors: [] });
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
      if ( i != j ) {
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
  for (var i = 0; i <= 81-21; i += 3) {
    list = [];
    if (i == 9 || i == 36) {
      i += 18;
    }
    list.push(i);
    list.push(i+1);
    list.push(i+2);
    list.push(i+9);
    list.push(i+10);
    list.push(i+11);
    list.push(i+18);
    list.push(i+19);
    list.push(i+20);
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
  while(worklist.length > 0) {
    alldiff(worklist[0]);
    worklist.splice(0,1);
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
  }
  else {
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

makeConstraints();
findNeighbors();

function solve(puzzle) {
  if (puzzle.length != 81) {
    console.log("invalid board length");
    return -1;
  }
  for (var i = 0; i < 81; i++) { 
    varList[i].domain = [1,2,3,4,5,6,7,8,9];
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

/*******************/
/** SUDOKU SOLVER **/
/*******************/