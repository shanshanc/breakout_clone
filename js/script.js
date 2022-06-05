document.addEventListener('DOMContentLoaded', () => {
  var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload: preload, create: create, update: update
  });

  let ball;
  let paddle;
  let bricks;
  let newBrick;
  let brickInfo;
  let scoreText;
  let score = 0;

  let lives = 3;
  let livesText;
  let lifeLostText;
  let textStyle = { font: '18px Arial', fill: '#0095DD' };

  let playing = false;
  let startButton;

  function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';

    // game.load.image('ball', 'img/ball.png');
    game.load.image('paddle', 'img/paddle.png');
    game.load.image('brick', 'img/brick.png');
    game.load.spritesheet('ball', 'img/wobble.png', 20, 20);
    game.load.spritesheet('button', 'img/button.png', 120, 40);
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    ball = game.add.sprite(
      game.world.width * 0.5,
      game.world.height - 25,
      'ball'
    );
    ball.anchor.set(0.5);
    ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24)

    paddle = game.add.sprite(
      game.world.width * 0.5,
      game.world.height - 5,
      'paddle'
    );
    paddle.anchor.set(0.5, 1);

    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    // ball.body.velocity.set(150, -150);
    ball.body.bounce.set(1);

    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    paddle.body.immovable = true;

    // Game Over
    game.physics.arcade.checkCollision.down = false;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);

    initBricks();

    scoreText = game.add.text(5, 5, 'Points: 0', textStyle);

    livesText = game.add.text(
      game.world.width - 5, 5, 'Lives: '+lives, textStyle
    );
    livesText.anchor.set(1,0);

    lifeLostText = game.add.text(
      game.world.width * 0.5,
      game.world.height * 0.5,
      'Life lost, click to continue',
      textStyle
    );
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;

    startButton = game.add.button(
      game.world.width*0.5,
      game.world.height*0.5,
      'button',
      startGame, this, 1, 0, 2
    );
    startButton.anchor.set(0.5);
  }

  function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    // Collision detection
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    if (playing) {
      paddle.x = game.input.x || game.world.width * 0.5;
    }
  }

  function initBricks() {
    brickInfo = {
      width: 50,
      height: 20,
      count: { row: 3, col: 7 },
      offset: { top: 50, left: 60 },
      padding: 10
    };

    bricks = game.add.group();

    for (let i = 0; i < brickInfo.count.col; i++) {
      for (let j = 0; j < brickInfo.count.row; j++) {
        const brickX = (i * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
        const brickY = (j * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
        newBrick = game.add.sprite(brickX, brickY, 'brick');
        game.physics.enable(newBrick, Phaser.Physics.ARCADE);
        newBrick.body.immovable = true;
        newBrick.anchor.set(0.5);
        bricks.add(newBrick);
      }
    }
  }

  function ballHitBrick(ball, brick) {
    var killTween = game.add.tween(brick.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        brick.kill();
    }, this);
    killTween.start();

    score += 10;
    scoreText.setText('Points: ' + score);

    // Count remaining bricks
    let count_alive = 0;
    for (i = 0; i < bricks.children.length; i++) {
      if (bricks.children[i].alive == true) {
        count_alive++;
      }
    }
    if (count_alive == 0) {
      alert('You won the game, congratulations!');
      location.reload();
    }
  }

  function ballHitPaddle(ball, paddle) {
    ball.animations.play('wobble');
    ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x);
  }

  function ballLeaveScreen() {
    lives--;
    if(lives) {
        livesText.setText('Lives: '+lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width*0.5, game.world.height-25);
        paddle.reset(game.world.width*0.5, game.world.height-5);
        // Restart the game on user input (click)
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            ball.body.velocity.set(150, -150);
        }, this);
    }
    else {
        alert('You lost, game over!');
        location.reload();
    }
  }

  function startGame() {
    startButton.destroy();
    ball.body.velocity.set(150, -150);
    playing = true;
  }
});
