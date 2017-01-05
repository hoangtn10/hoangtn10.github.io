var frames = [	'    |>\n    |\n   _|\n  | |',
				'     |>\n     |\n    _|\n   / \\',
				'      |>\n      |\n     _|\n    | |\n',
				'       |>\n       |\n      _|\n      \\/\n',
				'        |>\n        |\n       _|\n      | |\n',
				'         |>\n         |\n        _|\n       | |',
				'          |>\n          |\n         _|\n        / \\',
				'           |>\n           |\n          _|\n         | |\n',
				'            |>\n            |\n           _|\n           \\/\n',
				'             |>\n             |\n            _|\n           | |\n',
				'              |>\n              |\n             _|\n            | |',
				'               |>\n               |\n              _|\n             / \\',
				'                |>\n                |\n               _|\n              | |\n',
				'                 |>\n                 |\n                _|\n                \\/\n',
				'                  |>\n                  |\n                 _|\n                | |\n',
				'                  V\n                  |\n                 _|\n                | |\n',
				'                 <|\n                  |\n                 _|\n                | |\n',
				'                <|\n                 |\n                 |\n                | |\n',
				'               <|\n                |\n                |_\n                | |\n',
				'              <|\n               |\n               |_\n               / \\\n',
				'             <|\n              |\n              |_\n              | |\n',
				'            <|\n             |\n             |_\n             \\/\n',
				'           <|\n            |\n            |_\n            | |\n',
				'          <|\n           |\n           |_\n           | |\n',
				'         <|\n          |\n          |_\n          / \\\n',
				'        <|\n         |\n         |_\n         | |\n',
				'       <|\n        |\n        |_\n        \\/\n',
				'      <|\n       |\n       |_\n       | |\n',
				'     <|\n      |\n      |_\n      | |\n',
				'    <|\n     |\n     |_\n     / \\\n',
				'   <|\n    |\n    |_\n    | |\n',
				'  <|\n   |\n   |_\n   \\/\n',
				' <|\n  |\n  |_\n  | |\n',
				'  V\n  |\n  |_\n  | |\n',
				'  |>\n  |\n  |_\n  | |\n',
				'   |>\n   |\n   |\n  | |\n'
];
var frameIndex = 0;

function load() {
	setTimeout(function(){ 
		phase1();;
	}, 500);
}
function phase1() {
	var asciimator = document.getElementById("asciimator");
	asciimator.innerHTML = frames[frameIndex];
	frameIndex = (frameIndex+1)%26;

	if (frameIndex == 10) {
		setTimeout(function(){ 
			phase2();;
		}, 1500);
	}
	else {
		setTimeout(function(){ 
			phase1();;
		}, 100);
	}
}
function phase2() {
	var asciimator = document.getElementById("asciimator");
	asciimator.innerHTML = frames[frameIndex];
	frameIndex = (frameIndex+1)%26;

	if (frameIndex == 23) {
		setTimeout(function(){ 
			phase1();;
		}, 1500);
	}
	else {
		setTimeout(function(){ 
			phase2();;
		}, 100);
	}
}
function sen() {
	var subj = document.getElementById("subj");
	var body = document.getElementById("body");

	window.open('mailto:nguy1931@umn.edu?subject='+subj+'&body='+body);
}
function del() {
	var subj = document.getElementById("subj");
	var body = document.getElementById("body");

	console.log(subj)

	subj.value = '';
	body.value = '';
}
