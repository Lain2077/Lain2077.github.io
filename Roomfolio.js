let room; 
var matrix = [
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // 0 = open, 1 = obstacle
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0], // 1 = obstacle
    [0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 1, 0, 0, 1, 0, 0],
    [1, 0, 1, 0, 0, 0, 1, 1, 0, 0], // 2 = target
];

var grid = new PF.Grid(matrix);

var finder = new PF.AStarFinder({
    diagonalMovement: PF.DiagonalMovement.Never
});
//Find path from (1, 2) to (4, 2)
var path = finder.findPath(1, 2, 4, 2, grid);

function setup() {
    imageMode(CENTER)
  // createCanvas should be the first statement
  createCanvas(windowWidth, windowHeight);
}

function preload() {
    room = loadImage('assets/room.png');
}

function draw() {
    var rowHeight = height / matrix.length;
    var colWidth = width / matrix[0].length;
    
    // Draw the grid
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          fill(0); // Color for obstacles (1)
        } else {
          fill(255); // Color for open nodes (0)
        }
        noStroke();
        rect(j * colWidth, i * rowHeight, colWidth, rowHeight);
      }
    }

    // Draw the path if it exists
    if (path && path.length > 0) {
      stroke(0, 0, 255); // Color for the path
      strokeWeight(4);
      noFill();
      beginShape();
      for (var step of path) {
        var x = step[0] * colWidth + colWidth / 2;
        var y = step[1] * rowHeight + rowHeight / 2;
        vertex(x, y);
      }
      endShape();
    }

    hovernode = PF.getNodeAt(155, 249);

if (windowWidth < windowHeight) {
    // Display a message asking the user to rotate the device
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0); // Red text
    text(path, width / 2, height / 2);
    
    //text("Please rotate your device to landscape mode", width / 2, height / 2);
  } else {
    roomW = width * 0.8;
    roomH = width * 0.6; //room
    background(0); // Set the background to black
    image(room, width / 2, height/ 2, roomW, roomH);
  }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }