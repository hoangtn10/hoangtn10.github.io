var clnList = [];
var clnCell = null;
var clnColor = "";

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}
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
}
function getColor(i, type) {
    if ((i >= 3 && i < 6)   || (i >= 12 && i < 15) ||
        (i >= 21 && i < 24) || (i >= 27 && i < 30) ||
        (i >= 33 && i < 39) || (i >= 42 && i < 48) ||
        (i >= 51 && i < 54) || (i >= 57 && i < 60) ||
        (i >= 66 && i < 69) || (i >= 75 && i < 78)) {
        if (type) {
            return "#484848";
        }
        return "#555555";
    }
    else {
        if (type) {
            return "#343d47"
        }
        return "#3f4956";
    }
}
function cellClick() {
    var cell        = this;
    var parentCell  = cell.parentNode;
    var sibling     = parentCell.childNodes;
    var length      = clnList.length;
    
    if (clnCell != null) {
        replaceCln(sibling);
        clnCell.style.backgroundColor   = clnColor;
        clnList                         = [];
    }
    if (cell === clnCell) {
        clnCell = null
        return
    }

    clnColor                    = cell.style.backgroundColor;
    cell.style.backgroundColor  = "#3a87ad";
    clnCell                     = cell;
    
    var cellIndex = Math.ceil((Array.prototype.indexOf.call(sibling, cell)+1)/9)*9;
    if (cellIndex == 81) {
        cellIndex = 63
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
                if (clnList.length == 0) {
                    return;
                }
                replaceCln(sibling);
                clnList = [];
                if (clnCell != null) {
                    clnCell.style.backgroundColor   = clnColor;
                    clnCell                         = null;
                }
            }
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
        var sib                     = sibling[index]
        sib.style.backgroundColor   = clnList[i][1];
        sib.innerHTML               = clnList[i][2];
        console.log(clnList[i][1])
        if (clnList[i][1] != "rgb(52, 61, 71)" && clnList[i][1] != "rgb(72, 72, 72)") {
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
        }
        else {
            list[i].innerHTML = "";
            list[i].parentNode.parentNode.parentNode.onclick = cellClick;
            list[i].parentNode.parentNode.parentNode.style.backgroundColor = getColor(i,0);
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
       	var status = "Everything looks good!";
    }
    else {
        var status = "There's a misplaced cell!";
    }
    document.getElementById("status").innerHTML = status;
    $('.modal').modal('toggle');
}