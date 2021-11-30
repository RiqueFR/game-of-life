function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for(let i = 0; i < cols; i++) {
		arr[i] = new Array(rows);
	}
	// initialize the array with 0s
	for(let i = 0; i < cols; i++) {
		for(let j = 0; j < rows; j++) {
			// to use random values use:
			arr[i][j] = floor(random(2));
			// arr[i][j] = 0;
		}
	}
	return arr;
}

var fpsMax = 60;
var fpsMin = 1;
var fps = 10;

var mouseIsActive = false;
var cols;
var rows;
var resolution = 40;
var grid;
var pause = false;

var slider;

function setup() {
	createCanvas(800, 600);

	cols = width / resolution;
	rows = height / resolution;
	grid = make2DArray(cols, rows);

	let button = createButton("play");
	button.mousePressed(handlePlay);
	slider = createSlider(fpsMin, fpsMax, fps);

	frameRate(fpsMin);
}

function handlePlay() {
	pause = !pause;
}

function draw() {
	background(0);
	frameRate(slider.value());
	for(let i = 0; i < cols; i++) {
		for(let j = 0; j < rows; j++) {
			let x = i * resolution;
			let y = j * resolution;
			if(grid[i][j] == 1) {
				fill(255);
				stroke(0);
				rect(x, y, resolution-1, resolution-1)
			}
		}
	}

	if(pause == true) return;
	let next = make2DArray(cols, rows);
	// claculate the next grid
	for(let i = 0; i < cols; i++) {
		for(let j = 0; j < rows; j++) {
			let state = grid[i][j];
			let neighbors = countNeighbors(grid, i, j);


			// game rules
			if(state == 0 && neighbors == 3) {
				next[i][j] = 1;
			} else if(state == 1 && (neighbors < 2 || neighbors > 3)) {
				next[i][j] = 0;
			} else {
				next[i][j] = grid[i][j];
			}
		}
	}
	
	grid = next;
}

function countNeighbors(grid, x, y) {
	let sum = 0;
	for(let i = -1; i < 2; i++) {
		for(let j = -1; j < 2; j++) {
			let col = (x + i + cols) % cols;
			let row = (y + j + rows) % rows;
			sum += grid[col][row];
		}
	}
	sum -= grid[x][y];
	return sum;
}

var pressed = new Array();
function mousePressed() {
	mouseIsActive = true;
}

function mouseReleased() {
	mouseIsActive = false;
	pressed = [];
}

function mouseDragged() {
	if(mouseIsActive && mouseX > 0 && mouseY > 0 && mouseX <= width && mouseY <= height) {
		i = floor(mouseX / resolution);
		j = floor(mouseY / resolution);
		let len = pressed.length;
		for(let i = 0; i < len; i++) {
			if(pressed[i][0] == i && pressed[i][1] == j){ console.log("ababoe");return;}
		}
		grid[i][j] = !grid[i][j];
		arr = new Array(2);
		arr[0] = i;
		arr[1] = j;
		pressed.push(arr);
	}
}
