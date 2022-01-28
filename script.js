//Project Description: 
// I tried to create a simple version of snake as faithfully as possible. It includes wall and self collison-detection, images for the snake's head and fruit, and a game-over and title screen
 
//To get to 60% I must have
// 1. Basic mouvment of the snake head working
// 2. A fruit that can be interacted with
// 3. Snake body correctly follows the path that the snake head took
// 4. The fruit doesn't spawn inside of the snake ever

//To get to 80% I must have:
// 1. Title screen that looks visually appealing
// 2. Game over screen that looks visually appealing
// 3. The ability to re-size the canvas and window without breaking anything
// 4. CSS/html code to help the website look better

// To get 100% I am going to attempt:
// 1. Use classes for creating the apple and snake
// 2. Adding images for the tail, head, fruit, and maybe corners 

let snake;
let apple;
let direction;
let score = 1000;

function preload() {
  // head images
  up = loadImage('images/up.png');
  down = loadImage('images/down.png');
  left = loadImage('images/left.png');
  right = loadImage('images/right.png');

  //tail images
  tailup = loadImage('images/tailup.png');
  taildown = loadImage('images/taildown.png');
  tailleft = loadImage('images/tailleft.png');
  tailright = loadImage('images/tailright.png');
  fruit = loadImage('images/apple.png');
  direction = right

  // corner images
  c_BLeft = loadImage('images/corner/BLeft.png');
  c_BRight = loadImage('images/corner/BRight.png');
  c_TLeft = loadImage('images/corner/TLeft.png');
  c_TRight = loadImage('images/corner/TRight.png');
}

function setup() {
  let sketch = createCanvas(400, 400);
    sketch.parent("mycanvas");
    document.getElementById('mycanvas').setAttribute("style", "height:" + height + "px");
    document.getElementById('mycanvas').setAttribute("style", "width:" + width + "px");

  background(220);

  noStroke();
  textAlign(CENTER)

  snake = new Snake;
  apple = new Apple;

  titleScreen();
}

function draw() {
  background(255)

  if (frameCount % 5 === 0) {
    move();
  }

  snake.update();
  snake.collison();
  snake.display();

  apple.update();
  apple.eat();
  apple.display();

  fill(0)
  textSize(15)
  text("score: " + score, 45, 20)
}

function move() {
  if (key === "w") {
    snake.move(0, -1)
    direction = up;
    snake.moves.push(taildown)
  } else if (key === "s") {
    snake.move(0, 1)
    direction = down;
    snake.moves.push(tailup)
  } else if (key === "a") {
    snake.move(-1, 0)
    direction = left;
    snake.moves.push(tailright)
  } else if (key === "d") {
    snake.move(1, 0)
    direction = right;
    snake.moves.push(tailleft)
  }
}

function gameOver() {
  noLoop();
  setTimeout(function () {
    background(255, 0, 0);
    textSize(50)
    text("Game Over", width/2, height/2 - 50)
    textSize(20)
    text("score: " + score, width/2, height/2 - 20)

    button = createButton('Play Again');
    button.parent("mycanvas");
    button.position(width/2 - button.width/2, height/2)
    button.mousePressed(reset);
  }, 100)
}

function titleScreen() {
  noLoop();
  setTimeout(function () {
    background(134, 247, 141);
    textSize(50)
    text("Snake Game", width/2, height/2 - 50)
    textSize(15)
    text("wasd to move and space to pause", width/2, height/2 - 25)
    
    button = createButton('Play');
    button.parent("mycanvas");
    button.position(width/2 - button.width/2, height/2)
    button.mousePressed(reset);
  }, 50)
}

function reset() {
  snake = new Snake
  apple = new Apple
  direction = right;
  key = null;
  score = 1000;
  button.remove()
  loop();
}

class Snake {
  constructor() {
    this.length = 3;
    this.size = 10;
    this.headx = 50;
    this.heady = 50;
    this.segments = [[20, 50], [30, 50], [40, 50]];
    this.moves = [tailleft]
    this.corners = []
    this.dc;
  }
  display() {

    for (let i = 1; i < this.segments.length; i++){
      fill(40,184,40)
      square(this.segments[i][0], this.segments[i][1], this.size)
    }


    this.corn()
    image(this.moves[0], this.segments[0][0], this.segments[0][1], this.size)
    image(direction, this.headx, this.heady, this.size)

  }
  move(x, y) {
    this.segments.push([this.headx, this.heady])
    this.headx += this.size * x
    this.heady += this.size * y
  }
  update() {
    if (this.segments.length > this.length) {
      this.segments.shift(); 
    }
    if (this.moves.length > this.length) {
      this.moves.shift(); 
    }
  }
  collison() {
    for (let i = 0; i < this.segments.length; i++){
      if (this.headx === this.segments[i][0] && this.heady === this.segments[i][1]){
        gameOver()
      }
    }
    if (this.headx > (width - 1) || this.headx < 0 || this.heady > (height - 1) || this.heady < 0) {
      gameOver()
    }
  }
  corn() {
    for (let i = 1; i < this.segments.length - 1; i++) {
      if( !(this.segments[i - 1][0] === this.segments[i + 1][0]) && !(this.segments[i - 1][1] === this.segments[i + 1][1]) ) {
        
        if (this.segments[i - 1][0] > this.segments[i + 1][0] && this.segments[i - 1][1] > this.segments[i + 1][1]) {
          
          if (this.segments[i - 1][1] === this.segments[i][1]) {
            this.dc = c_TRight
          } else {
            this.dc = c_BLeft
          }

        }

         else if (this.segments[i - 1][0] > this.segments[i + 1][0] && this.segments[i - 1][1] < this.segments[i + 1][1]) {
          
          if (this.segments[i - 1][0] === this.segments[i][0]) {
            this.dc = c_TLeft
          } else {
            this.dc = c_BRight
          }

        }
        else if (this.segments[i - 1][0] < this.segments[i + 1][0] && this.segments[i - 1][1] > this.segments[i + 1][1]) {

          if (this.segments[i - 1][0] === this.segments[i][0]) {
            this.dc = c_BRight
          } else {
            this.dc = c_TLeft
          }

        }
        else if (this.segments[i - 1][0] < this.segments[i + 1][0] && this.segments[i - 1][1] < this.segments[i + 1][1]) {

          if (this.segments[i - 1][1] === this.segments[i][1]) {
            this.dc = c_BLeft
          } else {
            this.dc = c_TRight
          }
        }

        image(this.dc, this.segments[i][0], this.segments[i][1], this.size)

      }
      
    }
  }
}


class Apple {
  constructor () {
    this.applex = 100;
    this.appley = 100;
  }
  update() {
    this.size = snake.size;
    this.headx = snake.headx;
    this.heady = snake.heady;
    this.segments = snake.segments;
  }
  display() {
    fill(255, 0, 0);
    image(fruit, this.applex, this.appley, this.size, this.size)
    fill(255);
  }

  newApple() {
    this.applex = Math.round((Math.random()*(width-10)+0)/this.size)*this.size;
    this.appley = Math.round((Math.random()*(height-10)+0)/this.size)*this.size;
    for (let i = 0; i < this.segments.length; i++) {
      if (this.applex === this.segments[i][0] && this.appley === this.segments[i][1]) {
       this.oops();
      }
    }
  }
  oops() {
    print("oops")
    this.newApple();
  }

  eat() {
    if (this.headx === this.applex && this.heady === this.appley) {
      this.newApple();
      snake.length++
      score += 1000
    }
  }
  
}
