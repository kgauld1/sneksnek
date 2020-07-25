
let backgroundColor, playerSnake, currentApple, badApple, score, obstacles, highScore;

function setup() {
  // Canvas & color settings
  createCanvas(400, 400)
  colorMode(HSB, 360, 100, 100)
  backgroundColor = 95
  frameRate(12)
  playerSnake = new Snake()
  obstacles = [new Obstacle()]
  currentApple = new Apple(false)
  badApple = new Apple(true);
  score = 0
  highScore = 0;
}

function draw() {
  background(backgroundColor)
  // The snake performs the following four methods:
  playerSnake.moveSelf()
  playerSnake.showSelf()
  playerSnake.checkCollisions()
  playerSnake.checkApples()
  // The apple needs fewer methods to show up on screen.
  for(let o of obstacles)
    o.show();
  
  if(Math.floor(playerSnake.tail.length/5) > obstacles.length)
    obstacles.push(new Obstacle());
  
  currentApple.showSelf()
  badApple.showSelf()
  // We put the score in its own function for readability.
  displayScore()
}

function displayScore() {
  fill(0)
  text(`Score: ${score}`, 20, 20)
  text(`High score: ${highScore}`, 20, 40)
}

class Snake {
  constructor() {
    this.size = 10
    this.x = width/2
    this.y = height - 10
    this.direction = 'N'
    this.speed = 12
    this.tail = [new TailSegment(this.x, this.y, color(random(360),80,80))]
  }

  moveSelf() {
    if (this.direction === "N") {
      this.y -= this.speed
      if(this.y <= 0) this.y += height;
    } else if (this.direction === "S") {
      this.y += this.speed
      if(this.y >= height) this.y -= height;
    } else if (this.direction === "E") {
      this.x += this.speed
      if(this.x >= width) this.x -= width;
    } else if (this.direction === "W") {
      this.x -= this.speed
      if(this.x <= 0) this.x += width;
    } else {
      console.log("Error: invalid direction")
    }
    this.tail.unshift(new TailSegment(this.x, this.y, color(random(360),80,80)))
    this.tail.pop()
  }

  showSelf() {
    stroke(240, 100, 100)
    noFill()
    rect(this.x, this.y, this.size, this.size)
    noStroke()
    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].showSelf()
    }
  }

  checkApples() {
    // If the head of the snake collides with the apple...
    if(this.collideApple(currentApple))
      currentApple.place();
    if(this.collideApple(badApple))
      badApple.place();
  }
  
  collideApple(a){
    if (collideRectRect(this.x, this.y, this.size, this.size, a.x, a.y, a.size, a.size)) {
      // Make a new apple, increment the score, and extend the tail.
      if(a.isBad) score -= 2;
      else{
        score += 1
        highScore = Math.max(highScore, score);
        this.extendTail()
      }
      return true;
    }
    else return false;
  }

  checkCollisions() {
    if (this.tail.length > 2) {
      for (let i=1; i < this.tail.length; i++) {
        if (this.x == this.tail[i].x && this.y == this.tail[i].y) {
          gameOver()
        }
        // This helper text will show the index of each tail segment.
        // text(i, this.tail[i].x, this.tail[i].y)
      }
    }
    
    for(let o of obstacles)
      if(collideRectRect(this.x, this.y, this.size, this.size, o.x, o.y, o.sizeX, o.sizeY))
        gameOver();
  }

  extendTail() {
    // Add a new segment by duplicating whatever you find at the end of the tail.
    let lastTailSegment = this.tail[this.tail.length - 1]
    // Push a new tail segment to the end, using the same position as the current last segment of the tail.
    this.tail.push(new TailSegment(lastTailSegment.x, lastTailSegment.y, color(random(360),80,80)))
  }
}

class TailSegment {
  constructor(x, y, c) {
    this.x = x
    this.y = y
    this.c = c
    this.size = 10
  }

  showSelf() {
    fill(this.c);
    rect(this.x, this.y, this.size, this.size)
  }
}

class Apple {
  constructor(n) {
    this.place();
    this.size = 10;
    this.isBad = n;
    if(this.isBad) this.c = color(120,80,80);
    else this.c = color(0,80,80)
  }
  
  place(){
    this.x = round(random(width - 10))
    this.y = round(random(height - 10))
    for(let o of obstacles)
      if(collideRectRect(this.x,this, this.size, this.size, o.x, o.y, o.sizeX, o.sizeY)){
        this.x = round(random(width - 10))
        this.y = round(random(height - 10))
      }
  }
  
  showSelf() {
    fill(this.c)
    rect(this.x, this.y, this.size, this.size)
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW && playerSnake.direction != 'S') {
    playerSnake.direction = "N"
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != 'N') {
    playerSnake.direction = "S"
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != 'W') {
    playerSnake.direction = "E"
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != 'E') {
    playerSnake.direction = "W"
  } else if (keyCode === 32) {
    restartGame()
  }
}

class Obstacle{
  constructor(){
    this.x = random(width-30)
    this.y = random(height-30)
    this.sizeX = random(10,30)
    this.sizeY = random(10,30)
  }
  show(){
    fill(70);
    rect(this.x, this.y, this.sizeX, this.sizeY);
  }
}


function restartGame() {
  score = 0
  playerSnake = new Snake()
  currentApple = new Apple()
  loop()
  obstacles = [new Obstacle()]
}

function gameOver() {
  stroke(0)
  text("GAME OVER", 50, 70)
  noLoop()
}