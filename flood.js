$(document).ready(function() {
console.log("ok");

var gridWidth = 18;
var gridHeight = 18;
var maxTurns = 31;
var gameOver = false;
var colours = ["red", "blue", "yellow", "black", "green", "white"];

//courtesy csstricks:
function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function changeSeed(newSeed) {
	seed = newSeed;
	$("#seedInfo").text(seed);
	$("#seedInfo").attr("href", ".?seed=" + seed)
}


function randomString() {
	var chars = "abcdefghijkmnpqrsuvwxyz23456789";
	var result = "";
	for (var i = 0; i < 7; i++) {
		result += chars[Math.floor(Math.random()*31)];
	}
	return result;
}
console.log("Seed from url: " + getQueryVariable("seed"));
Math.seedrandom();
var seed = getQueryVariable("seed") || randomString();
seed = seed.toLowerCase();
Math.seedrandom(seed);
console.log("seed now: " + seed);
changeSeed(seed);

function randomColour() {
	return colours[Math.floor(Math.random() * colours.length)];
}

function Square(row, col, colour) {
	this.row = row;
	this.col = col;
	this.colour = colour;
	this.id = (row * gridHeight) + col;
	this.flooded = false;
}

Square.prototype.toColour = function(colour) {
	if (colours.indexOf(colour) != -1) {
		this.colour = colour;
		$("#" + this.id).attr("class", "square " + colour);
	}
}

var squares = [];
for (var col = 0; col < gridWidth; col++) {
for (var row = 0; row < gridHeight; row++) {
		var newSquare = new Square(row, col, randomColour());
		squares.push(newSquare);
		var nsElement = $("<div/>", {
			"class": "square " + newSquare.colour,
			id: newSquare.id
		});
		$(".gamegrid").append(nsElement);	
	}
}

var controls = [];
for (var i = 0; i < colours.length; i++) {
	
	var newControl = $("<div/>", {
		"class": "square " + colours[i],
		id: "control" + i
	});
	
	$(".controls").append(newControl);
	newControl.click(function() {
		var clickedColour = $(this).attr("class").split(" ")[1];
		console.log("Clicked: " + clickedColour);
		if (clickedColour != floodColour) {
			flood(clickedColour);
		}
	});
}

function toGrid(num) {
	row = Math.floor(num/gridHeight) % gridHeight
	col = num - (row * gridHeight);
	return [row, col];
}

function fromGrid(row, col) {
	return row * gridHeight + col;
}

function squareAt(row, col) {
	return squares[fromGrid(row, col)];
}

var flooded = squares[0];
var floodColour = squares[0].colour;
var turns = -1;

function flood(colour) {
	if (gameOver) return null;
	
	//reset
	squares.forEach(function(square) {
		if (square.flooded) {
			square.toColour(colour);
			square.flooded = false;
		}
	});
	
	floodColour = colour;
	fill(0, 0, colour);
	turns += 1;
	$("#turns").text(turns);
	
	var anyUnflooded = false;
	squares.forEach(function(square) {
		if (!square.flooded) {
			anyUnflooded = true;
		}
	});
	
	if (!anyUnflooded) {
		//victory
		$("#victory").text("Victory!");
		gameOver = true;
	} else {
		if (turns >= maxTurns) {
			$("#victory").text("Game over!");
			gameOver = true;
		} else {
			$("#victory").text("");
		}
	}
}

function fill(row, col, newColour) {
	currentSquare = squareAt(row, col);
	if (!currentSquare.flooded) {
		if (currentSquare.colour == newColour) {
			//flood!
			currentSquare.flooded = true;
		} else {
			//wrong colour
			return -1;
		}
		
		//down
		if (row+1 < gridHeight) {
			fill(row+1, col, newColour);
		}
		//right
		if (col+1 < gridWidth) {
			fill(row, col+1, newColour);
		}
		//left
		if (col > 0) {
			fill(row, col-1, newColour);
		}
		//up
		if (row > 0) {
			fill(row-1, col, newColour);
		}
	}
	return -1;
}

function resetGame(newSeed) {
	Math.seedrandom(newSeed);
	changeSeed(newSeed);
	squares.forEach(function(square) {
		square.flooded = false;
		square.toColour(randomColour());
	});
	turns = -1;
	gameOver = false;
	flood(squares[0].colour);
}
$("#newGame").click(function() {
	resetGame(randomString());
});
$("#retry").click(function() {
	resetGame(seed);
});

//initial flood
flood(floodColour);

})
