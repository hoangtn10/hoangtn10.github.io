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


/** TEST
solve("dd0000000000000000000000000000000000000000000000000000000000000000000000000000000");
solve("110000000000000000000000000000000000000000000000000000000000000000000000000000000");
solve("10000000000000000000000000000000000000000000000000000000000000000000000000000000");
solve("200804006006000500074000920300040007000305000400060009019000740008000200500608001");
    TEST **/