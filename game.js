// Get the canvas element
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

// Set the number of rows and columns of bricks
var rows = 8;
var columns = 8;

// Set the brick width and height
var brickWidth = 50;
var brickHeight = 20;

// Set the distance between the bricks
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// Create an array of possible brick colors
var brickColors = ["red", "orange", "yellow", "green", "blue", "purple"];

// Create the bricks
var bricks = [];
for (var i = 0; i < rows; i++) {
  bricks[i] = [];
  for (var j = 0; j < columns; j++) {
    // Generate a random color for the brick
    var randomColor = brickColors[Math.floor(Math.random() * brickColors.length)];
    bricks[i][j] = {
      x: 0,
      y: 0,
      status: 1,
      color: randomColor
    };
  }
}

// Set the distance between the bricks
var brickPadding = 10;
var brickOffsetTop = 0; // This value can be increased to move the bricks further up
var brickOffsetLeft = 30;

// Draw the bricks on the canvas
function drawBricks() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      if (bricks[i][j].status == 1) {
        var brickX = (j * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (i * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.fillStyle = bricks[i][j].color;
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}


// Ball object
var ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 10,
  color: "black",
  dx: 4,
  dy: -4
};

// Draw the ball on the canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// Platform object
var platform = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 30 - brickOffsetTop + brickHeight,
  width: 100,
  height: 10,
  color: "black",
  dx: 15
};


// Draw the platform on the canvas
function drawPlatform() {
  ctx.beginPath();
  ctx.rect(platform.x, platform.y, platform.width, platform.height);
  ctx.fillStyle = platform.color;
  ctx.fill();
  ctx.closePath();
}

var leftPressed = false;
var rightPressed = false;

// Track the left and right arrow keys
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

// Track the space and enter keys
document.addEventListener("keydown", startHandler, false);

var gameStarted = false;

function startHandler(e) {
  if ((e.keyCode == 32 || e.keyCode == 13) && !gameStarted) {
    gameStarted = true;
    requestAnimationFrame(draw);
  }
}


var loose = false;
var win = false;

// The main game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw a border around the canvas
  ctx.lineWidth = "5";
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  if (loose) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Lose", canvas.width / 2, canvas.height - 50);
  }

  if (win) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.fillText("Win", canvas.width / 2, canvas.height / 2);
  }

  drawBricks();
  drawBall();
  drawPlatform();

  if (!gameStarted) return;

  // Move the platform left or right
  if (rightPressed && platform.x + platform.dx < canvas.width - platform.width) {
    platform.x += platform.dx;
  } else if (leftPressed && platform.x + platform.dx > 0) {
    platform.x -= platform.dx;
  }


  // Check for ball collision with walls
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  }
  // Check for ball collision with bottom wall
  else if (ball.y + ball.dy > canvas.height - ball.radius) {
    if (ball.x > platform.x && ball.x < platform.x + platform.width) {
      // Add random value to x-direction velocity of the ball
      ball.dx += (Math.random() - 0.5) * 10;
      ball.dy = -ball.dy;
    } else {
      loose = true;
      document.location.reload();

    }
  }

  // Check for ball collision with bricks
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      var b = bricks[i][j];
      if (b.status == 1) {
        if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
          ball.dy = -ball.dy;
          b.status = 0;
        }
      }
    }
  }

  var bricksLeft = false;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      if (bricks[i][j].status == 1) {
        bricksLeft = true;
        break;
      }
    }
    if (bricksLeft) {
      break;
    }
  }
  if (!bricksLeft) {
    win = true;
    document.location.reload();
  }

  // Update the ball's position
  ball.x += ball.dx;
  ball.y += ball.dy;

  requestAnimationFrame(draw);
}

draw();
