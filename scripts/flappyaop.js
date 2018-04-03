 
var p5functions = [ 'preload', 'setup','draw','keyPressed','keyReleased','keyTyped','mouseMoved','mouseDragged','mousePressed','mouseReleased','mouseClicked','touchStarted','touchMoved','touchEnded'];
var clientWidth;
var clientHeight;


function Bird(sketch)
{
  var image1 = sketch.loadImage('images/aopspritebase1.png');
  var image2 = sketch.loadImage('images/aopspritebase2.png');
  var image3 = sketch.loadImage('images/aopspritebase3.png');
  var birdAnim = [];
      birdAnim.push(image1);
      birdAnim.push(image2);
      birdAnim.push(image3);
  var animCtr = 0;

  this.y = sketch.height/2;
  this.x = 100;

  var gravity = 0.5;
  var velocity = 0;
  var birdWidth = 32;
  var rot = 0;

  this.showBird = function()
  {
     sketch.translate(this.x, this.y);
     //image(this.image);

     if(rot < -0.6)
     {
       rot = -0.6
     }

     if(rot >= -0.6 && rot < 0.5)
     {
       rot += 0.02;
     }
    sketch.rotate(rot);

    if(sketch.frameCount % 15 == 0)
    {
      animCtr += 1;
      animCtr = animCtr % 3;
    }
    sketch.image(birdAnim[animCtr], -32, -10);
      //ellipse(x,y,birdWidth,birdWidth);
      //rot += 1;
  }

  this.update = function()
  {
    velocity += gravity;

    //Stop at bottom of window
    if(this.y <= sketch.height)
    {
      this.y  += velocity;
    }
    else {
      velocity = 0;
      this.y = sketch.height;
    }

    //Stop at top of window
    if(this.y <= 0)
       this.y = 0;
  }

  this.bounce = function()
  { 
    velocity -= 10;
    rot += -0.4;
  }

  this.crash = function()
  {
    return this.y >= sketch.height;
  }
}

function Pipe(sketch)
{
  var gapYLoc = sketch.random(100, sketch.height-100);
  var gapSize = 230;
  var top = gapYLoc - gapSize/2;
  var bottom = gapYLoc;
  var speed = 2;
  var passed = false;

  var x = sketch.width;
  var pipeWidth = 20;

  this.showPipe = function()
  {
    sketch.fill(255);
    sketch.rect(x, 0, pipeWidth, top);

    sketch.rect(x, gapYLoc, pipeWidth, sketch.height-bottom );
  }

  this.hits = function(bird)
  {
    if(!passed)
    {
    if(bird.y < top || bird.y > bottom)
      {
        if(bird.x > x && bird.x < x + pipeWidth)
        {
          passed = true;
          return true;
        }
      }
    }
      return false;
  }

  this.score = function(bird)
  {
    if(!passed)
    {
    if(bird.x > x && bird.x < x + pipeWidth)
    {
      if(!this.hits(bird))
      {
        passed = true;
        return true;
      }
    }
  }
    return false;
  }

  this.update = function()
  {
    x -= speed;
  }
}

var flappy_aop_s = function(sketch) {
  var bird;
  var pipes = [];
  var score;
  var highScore;
  var crashes;
  var tries;
  var gameStarted;
  var flappyBak;

   sketch.setup = function() {
    if(clientWidth === undefined) {
      clientWidth = sketch.displayWidth;
    } 
    if(clientHeight === undefined) {
      clientHeight = sketch.displayHeight; 
    } 
    sketch.createCanvas(clientWidth, clientHeight);
    bird = new Bird(sketch);
    score = 0;
    highScore = 0;
    tries = 0;
    crashes = 0;
    pipes.push(new Pipe(sketch));
    flappyBak = sketch.loadImage('images/flappybak.png');
    gameStarted = false;
  }

   sketch.draw = function() {
    sketch.background(flappyBak);
    //sketch.background(247,134,131);
    sketch.textSize(32);
    sketch.text('Score: ' + score + " High: " + highScore, 40, 30);
    sketch.text('Tries: ' + tries, 40, 70);
    sketch.fill(0, 102, 153, 51);

    if(!gameStarted)
    {
      pipes = [];
      bird = new Bird(sketch);
      pipes.push(new Pipe(sketch));
      sketch.textSize(32);
      sketch.fill(0);
      sketch.text("Tap to Start", 40, sketch.height/2);
      sketch.textSize(16);
      sketch.text("(Tap to Fly)", 100, sketch.height/2 + 20);

    }

    if(gameStarted)
    {
      for(var i = pipes.length-1; i > 0; i--)
      {
        pipes[i].showPipe();
        pipes[i].update();

        if(pipes[i].hits(bird) || bird.crash())
        {
          gameStarted = false;

          if(score > highScore)
            highScore = score;

          tries += 1;
          score = 0;
        }

        if(pipes[i].score(bird))
        {
          score += 1;
        }

        if(pipes[i].x < -50 )
        {
          pipes.splice(i, 1);
        }
      }
      bird.showBird();
      bird.update();
      if(sketch.frameCount % 100 == 0)
        pipes.push(new Pipe(sketch));
    }

  }
/*
  sketch.touchStarted = function() {
    console.log("flappyAop touchstart triggered");
    sketch.mousePressed(); 
  } */


  sketch.mousePressed = function() {
  //  console.log("flappyAop mousePressed triggered");
    sketch.keyPressed();
  }

  sketch.keyPressed = function()
  {
  //  console.log("flappyAop keyPressed triggered");
    if(!gameStarted)
      gameStarted = true;
    bird.bounce();
  }
}

function gameCleanup(s,e_id) {
  $(e_id).empty();
  
  //clear registered methods
  for (var member in s._registeredMethods) delete s._registeredMethods[member];
  s._registeredMethods = { pre: [], post: [], remove: [] };
  s.remove();
  s = null;
}
