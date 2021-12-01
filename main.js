class Cell {
	constructor() {
		//this.xPos = 0;
		//this.yPos = 0;
		this.state = false;
		this.color = null;
		this.dragState = false;
	}

	born() {
		this.state = true;
	}

	kill() {
		this.state = false;
	}

	changeState() {
		this.state = !this.state;
	}

	isAlive() {
		return this.state;
	}

	drag() {
		this.dragState = true;
	}

	noDrag() {
		this.dragState = false;
	}

	isDrag() {
		return this.dragState;
	}
}


function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for(let i = 0; i < cols; i++) {
		arr[i] = new Array(rows);
	}
	// initialize the array with 0s
	for(let i = 0; i < cols; i++) {
		for(let j = 0; j < rows; j++) {
			// to use random values use:
			arr[i][j] = new Cell();
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
var resolution = 10;
var grid;
var pause = true;

var slider;
var buttonPlay;
var buttonClear;

var time;

function setup() {
	createCanvas(800, 600);

	cols = width / resolution;
	rows = height / resolution;
	grid = make2DArray(cols, rows);
	frameRate(fpsMax);
	time = 0;

	buttonPlay = createButton("Play");
	buttonPlay.mousePressed(handlePlay);
	buttonClear = createButton("Clear");
	buttonClear.mousePressed(clearGrid);
	slider = createSlider(fpsMin, fpsMax, fps);
}

function handlePlay() {
	pause = !pause;
	let text;
	if(pause) text = "Play";
	else text = "Pause";
	buttonPlay.html(text);
}

function draw() {
	fps = slider.value();
	if(fps < 60) {
		frameRate(60);
	} else {
		frameRate(fps);
	}
	time += deltaTime/1000;
	if(time >= 1/fps) {
		time = 0;
		background(0);
		for(let i = 0; i < cols; i++) {
			for(let j = 0; j < rows; j++) {
				let x = i * resolution;
				let y = j * resolution;
				if(grid[i][j].isAlive()) {
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
				let state = grid[i][j].isAlive();
				let neighbors = countNeighbors(grid, i, j);


				// game rules
				if(state == 0 && neighbors == 3) {
					next[i][j].born();
				} else if(state == 1 && (neighbors < 2 || neighbors > 3)) {
					next[i][j].kill();
				} else {
					next[i][j] = grid[i][j];
			}
		}
	}
	
	grid = next;
		
	}
}

function countNeighbors(grid, x, y) {
	let sum = 0;
	for(let i = -1; i < 2; i++) {
		for(let j = -1; j < 2; j++) {
			let col = (x + i + cols) % cols;
			let row = (y + j + rows) % rows;
			sum += grid[col][row].state;
		}
	}
	sum -= grid[x][y].state;
	return sum;
}

function mousePressed() {
	if(mouseX > 0 && mouseY > 0 && mouseX <= width && mouseY <= height) {
		mouseIsActive = true;
		let i = floor(mouseX / resolution);
		let j = floor(mouseY / resolution);
		let cell = grid[i][j];
		if(!cell.isDrag()) {
			cell.drag();
			grid[i][j].changeState();
		}

	}
}

function mouseReleased() {
	mouseIsActive = false;

	for(let i = 0; i < cols; i++) {
		for(let j = 0; j < rows; j++) {
			let cell = grid[i][j];
			if(cell.isDrag()) {
				cell.noDrag();
			}
		}
	}
}

function mouseDragged() {
	if(mouseIsActive && mouseX > 0 && mouseY > 0 && mouseX <= width && mouseY <= height) {
		let i = floor(mouseX / resolution);
		let j = floor(mouseY / resolution);
		let cell = grid[i][j];
		if(!cell.isDrag()) {
			cell.drag();
			grid[i][j].changeState();
		}
	}
}

function clearGrid() {
	for(let i = 0; i < cols; i++) {
		for(let j = 0; j < rows; j++) {
			grid[i][j].kill();
		}
	}
}
