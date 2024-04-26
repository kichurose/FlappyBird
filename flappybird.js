//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImage;

// bird object
let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];

let pipeWidth = 64;
let pipeheight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;

let velocityY = 0;

let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // for drawing on board

  // draw bird
  // context.fillStyle = "green";
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);

  birdImage = new Image();
  birdImage.src = "./flappybird.png";
  birdImage.onload = function () {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  requestAnimationFrame(update);

  setInterval(placePipe, 1500); //every 1.5 sec

  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, boardWidth, boardHeight);

  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); //0 top
  context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }
  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];

    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
      pipe.passed = true;
    }
  }

  // score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 70,70);
}

function placePipe() {
  if (gameOver) {
    return;
  }
  let randompipeY = pipeY - pipeheight / 4 - Math.random() * (pipeheight / 2);
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randompipeY,
    width: pipeWidth,
    height: pipeheight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randompipeY + pipeheight + board.height / 4,
    width: pipeWidth,
    height: pipeheight,
    passed: false,
  };

  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space") {
    velocityY = -6;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y 
  ); //a's bottom left corner passes b's top left corner
}
