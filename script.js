document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  let ballPosX = canvas.width / 2;
  let ballPosY = canvas.height - 30;
  let dx = 2;
  let dy = -2;
  const BALL_RADIUS = 10;
  const PADDLE_HEIGHT = 10;
  const PADDLE_WIDTH = 75;
  let paddleX = (canvas.width - PADDLE_WIDTH) / 2;

  let leftPressed = false;
  let rightPressed = false;

  const BRICK_ROW_COUNT = 3;
  const BRICK_COL_COUNT = 5;
  const BRICK_WIDTH = 75;
  const BRICK_HEIGHT = 20;
  const BRICK_PADDING = 10;
  let brickOffsetTop = 30;
  let brickOffsetLeft = 30;
  let bricks = [];
  let score = 0;
  let lives = 3;

  function init() {
    for (let i = 0; i < BRICK_COL_COUNT; i++) {
      bricks[i] = [];
      for (let j = 0; j< BRICK_ROW_COUNT; j++) {
        bricks[i][j] = {
          x: 0,
          y: 0,
          status: 1
        }
      }
    }

    document.addEventListener('keydown', keydownHandler, false);
    document.addEventListener('keyup', keyupHandler, false);
    document.addEventListener('mousemove', mousemoveHandler, false);
  }

  function keydownHandler(evt) {
    if (evt.key === 'right' || evt.key === 'ArrowRight') {
      rightPressed = true;
    } else if (evt.key === 'left' || evt.key === 'ArrowLeft') {
      leftPressed = true;
    }
  }

  function keyupHandler(evt) {
    if (evt.key === 'right' || evt.key === 'ArrowRight') {
      rightPressed = false;
    } else if (evt.key === 'left' || evt.key === 'ArrowLeft') {
      leftPressed = false;
    }
  }

  function mousemoveHandler(evt) {
    const relativeX = evt.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - PADDLE_WIDTH / 2;
    }
  }

  function drawBall(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, BALL_RADIUS, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for (let i = 0; i < BRICK_COL_COUNT; i++) {
      for (let j = 0; j < BRICK_ROW_COUNT; j++) {
        if (bricks[i][j].status === 1) {
          const brickX = (i * (BRICK_WIDTH + BRICK_PADDING)) + brickOffsetLeft;
          const brickY = (j * (BRICK_HEIGHT + BRICK_PADDING)) + brickOffsetTop;
          bricks[i][j].x = brickX;
          bricks[i][j].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
          ctx.fillStyle = '#0095DD';
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection() {
    for (let i = 0; i < BRICK_COL_COUNT; i++) {
      for (let j = 0; j < BRICK_ROW_COUNT; j++) {
        const brick = bricks[i][j];
        if (brick.status === 1) {
          if (
            ballPosX > brick.x &&
            ballPosX < brick.x + BRICK_WIDTH &&
            ballPosY > brick.y &&
            ballPosY < brick.y + BRICK_HEIGHT
          ) {
            dy = -dy;
            brick.status = 0;
            score++;
            if (score === BRICK_COL_COUNT * BRICK_ROW_COUNT) {
              console.log('You Won! CONGRATS');
              document.location.reload();
            }
          }
        }
      }
    }
  }

  function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
  }

  function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
  }

  function start() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(ballPosX, ballPosY);
    drawBricks();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    if (ballPosY + dy < BALL_RADIUS) {
      dy = -dy;
    } else if (ballPosY + dy > canvas.height - BALL_RADIUS) {
      if (ballPosX > paddleX && ballPosX < paddleX + PADDLE_WIDTH) {
        dy = -dy;
      } else {
        lives--;
        if (lives === 0) {
          console.log('Game Over');
          document.location.reload();
        } else {
          ballPosX = canvas.width / 2;
          ballPosY = canvas.height - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width - PADDLE_WIDTH) / 2;
        }
      }
    }
    
    if (ballPosX + dx < BALL_RADIUS || ballPosX + dx > canvas.width - BALL_RADIUS) {
      dx = -dx
    }

    if (rightPressed) {
      paddleX += 7;
      if (paddleX + PADDLE_WIDTH > canvas.width) {
        paddleX = canvas.width - PADDLE_WIDTH
      }
    }
    if (leftPressed) {
      paddleX -= 7;
      if (paddleX < 0) {
        paddleX = 0;
      }
    }

    ballPosX += dx;
    ballPosY += dy;

    requestAnimationFrame(start);
  }

  init();
  start();
});
