var hearts = [];
var stars = [];

//sound variables
var laserSound;
var popSound;
var loseSound;
var winSound;
var backgroundSound;
var thudSound;

//booleans
var losePlayed = false;
var winPlayed = false;
var winning = false;

var count = { //counting various hearts in different states
  total: 2,
  broken: 0,
  onGround: 0
}

var laser = {
  y: 500,
  speed: 50
}

var skin = {
  r: 235,
  g: 179,
  b: 169
}

var girl = {
  y: 500,
  dir: 1,
  speed: 0.3
}

var moon = {
  x: 800,
  y: 100,
  speed: 0.3
}

var face = {
  x: 800,
  y: 100,
  speed: 0.3,
}

function lose(size, clr, font) {
  fill(clr);
  strokeWeight(4);
  textSize(size);
  textFont(font);
  text('you only broke ' + count.broken + '/' + count.total + ' hearts. try harder', 100, height / 2);
}

function win(size, clr, font) {
  fill(clr);
  strokeWeight(4);
  textSize(size);
  textFont(font);
  text('congrats, you broke ' + count.broken + '/' + count.total + ' hearts!', 100, height / 2);
  text('love is dead!', 100, height / 2 + 50);
}

function explosion(x, y, w, h) {
  fill(255);
  ellipse(x, y, w, h);
}

function gradiant(g, b) {
  strokeWeight(1);
  for (var i = 0; i < height; i++) {
    stroke(i, g, b);
    line(0, i, width, i);
  }
}

function drawHills(x, y, w, h, clr) {
  noStroke();
  fill(clr);
  ellipse(x, y, w, h);
}

function drawMoon(x, y, w, h, clr) {
  strokeWeight(4);
  fill(clr);
  ellipse(x, y, w, h);
}

function drawFace(x, y, clr, angle1, angle2) {
  strokeWeight(4);
  stroke(clr);
  noFill();
  line(x - 25, y - 25, x - 5, y - 5);
  line(x - 25, y - 5, x - 5, y - 25);
  line(x + 25, y - 25, x + 5, y - 5);
  line(x + 25, y - 5, x + 5, y - 25);
  arc(x, y + 20, 50, 30, angle1, angle2, OPEN);
}

function shoot(x, y) {
  strokeWeight(2);
  stroke(random(0, 255), random(0, 255), random(0, 255));
  line(mouseX, 522, mouseX, laser.y);
  laser.y = laser.y - laser.speed;
}

function drawLaser(x, y) {
  noStroke();
  fill(36, 32, 56);
  ellipse(x, y, 70, 50);
  rect(x - 10, y - 50, 20, 70);
  fill(255);
  strokeWeight(1);
  stroke(255);
  push();
  translate(0, -18);
  bezier(x, y, x - 12, y - 12, x - 11, y + 8, x, y + 14);
  bezier(x, y, x + 12, y - 12, x + 13, y + 8, x, y + 14);
  pop();
  strokeWeight(4);
  stroke(255, 0, 0);
  line(x - 10, y - 20, x + 10, y - 3);
  line(x - 10, y - 3, x + 10, y - 20);
}

function drawGirl(x, y, skinColor) {
  //right arm
  stroke(skinColor);
  strokeWeight(10);
  line(x - 60, y - 40, x - 20, y - 20);

  //shirt
  noStroke();
  fill(133, 217, 242);
  triangle(x - 60, y - 70, x - 95, y, x - 25, y); //shirt

  //hair bottom
  fill(0);
  ellipse(x - 60, y - 70, 52, 60);
  quad(x - 80, y - 70, x - 95, y - 50, x - 25, y - 50, x - 40, y - 70);

  //face
  fill(skinColor);
  ellipse(x - 60, y - 65, 50, 50);

  //bangs
  fill(0);
  arc(x - 60, y - 72, 52, 60, 180, 360, CHORD);

  //eyes
  ellipse(x - 70, y - 65, 5, 5); //left
  ellipse(x - 50, y - 65, 5, 5); //right

  //left arm
  stroke(skinColor);
  strokeWeight(10);
  line(x - 80, y - 35, x - 90, y - 30);
  line(x - 90, y - 30, x - 82, y - 23);
}

function Twinkle() {
  this.x = random(width);
  this.y = random(height);
  this.diameter = random(3, 5);
  this.speed = 0.5;

  this.move = function() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  };

  this.display = function() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  };
}

function Falling() {
  this.x = random(width);
  this.y = random(-650, 0);
  this.broken = 0;
  this.hitByLaser = false;
  this.hitTheGround = false;
  this.speed = random(1, 4);
  this.clr = color(255, random(0, 255), random(0, 255));

  this.move = function() {
    this.y += this.speed;
  };

  this.display = function() {
    strokeWeight(7);
    stroke(this.clr);
    fill(this.clr);
    bezier(this.x, this.y, this.x - 12, this.y - 12, this.x - 11, this.y + 8, this.x, this.y + 14); //left 
    bezier(this.x, this.y, this.x + 12, this.y - 12, this.x + 13, this.y + 8, this.x, this.y + 14); //right 
  };

}

function preload() {
  popSound = loadSound('assets/pop.wav'); //from http://www.freesound.org/people/muel2002/sounds/266965/
  laserSound = loadSound('assets/laser.mp3'); //from http://www.freesound.org/people/peepholecircus/sounds/169991/
  loseSound = loadSound('assets/lose.wav'); //from http://www.freesound.org/people/AdamWeeden/sounds/157218/
  winSound = loadSound('assets/win.wav'); //from http://www.freesound.org/people/pyzaist/sounds/118655/
  backgroundSound = loadSound('assets/Beatoven_-_02_-_Wanna_See_My_Spaceship.mp3'); // from http://freemusicarchive.org/music/Beatoven/projekt168_v30/
  thudSound = loadSound('assets/thud.wav'); // from https://freesound.org/people/NenadSimic/sounds/149966/

}

function setup() {
  createCanvas(1000, 500);
  // create hearts
  for (var i = 0; i < count.total; i++) {
    hearts.push(new Falling());
    if (backgroundSound.isPlaying()) { 
      backgroundSound.stop();
    } else {
      backgroundSound.play();
    }
  }

  // create stars
  for (var s = 0; s < 100; s++) {
    stars.push(new Twinkle());
  }
}

function draw() {
  
  print('hi');
  angleMode(DEGREES);
  
  //background
  gradiant(30, 160);

  //draw stars
  for (var s = 0; s < stars.length; s++) {
    stars[s].move();
    stars[s].display();
  }
  
  //draw hills
  drawHills(160, height, 550, 325, color(154, 39, 242));
  drawHills(700, height, 580, 300, color(179, 52, 187));
  drawHills(370, height, 600, 350, color(205, 65, 131));
  drawHills(830, height + 50, 500, 300, color(230, 78, 76));
  drawHills(240, height + 50, 750, 300, color(255, 91, 20));

  //draw face
  drawMoon(moon.x, moon.y, 100, 100, color(248, 166, 255, 140));
  moon.x += random(-moon.speed, moon.speed);
  moon.y += random(-moon.speed, moon.speed);

  //shoots laser when mouse is pressed
  if (mouseIsPressed) {
    shoot(mouseX, 522);
    if (laserSound.isPlaying() === false) {
      laserSound.rate(0.5);
      laserSound.play()
    }
  } else {
    laser.y = 522;
    laserSound.stop();
  }

  //draw laser 
  drawLaser(mouseX, height);
  drawGirl(mouseX, girl.y, color(skin.r, skin.g, skin.b));
  girl.y += girl.dir * girl.speed;
  if (girl.y > 500 || girl.y < 490) {
    girl.dir = -girl.dir;
  }

  //if you're not winning, make her frown. if win, make her smile
  if (winning === false) {
    noFill();
    strokeWeight(1);
    stroke(1);
    arc(mouseX - 60, girl.y - 50, 15, 12, 180, 360, OPEN);
  } else {
    noFill();
    strokeWeight(1);
    stroke(1);
    arc(mouseX - 60, girl.y - 55, 15, 12, 360, 180, OPEN);
  }

  //draw falling hearts
  for (var i = 0; i < hearts.length; i++) {
    // if the laser hits the heart..
    if (hearts[i].y <= laser.y + 20 &&
      hearts[i].y >= laser.y - 20 &&
      mouseX <= hearts[i].x + 20 &&
      mouseX >= hearts[i].x - 20 &&
      hearts[i].hitByLaser === false) {
      hearts[i].hitByLaser = true; //...make hitByLaser true 
      count.broken++; //...add to the number of broken hearts
      popSound.play();
      explosion(mouseX, hearts[i].y, 50, 50);
    }

    //if the laser is not hitting the heart...
    if (hearts[i].hitByLaser === false) {
      hearts[i].move(); //...make the hearts fall
      if (hearts[i].y > height) {
        hearts[i].y = height
      }
      hearts[i].display(); //...and display them only until the bottom of the screen
    }

    //if the heart hits the ground...
    if (hearts[i].y == height) {
      if (hearts[i].hitTheGround === false) {
        count.onGround++; //...count number of hearts on the ground
        skin.r = skin.r - 10; //...skin changes color
        skin.g = skin.g + 5;
        skin.b = skin.b + 5;
        hearts[i].clr = (0); //...hearts turn black
        thudSound.play();
      }
      hearts[i].hitTheGround = true;
    }

    //if you don't win...
    if (count.onGround + count.broken == count.total && count.onGround >= 1) {
      lose(50, 255, "Helvetica")
      if (loseSound.isPlaying() === false && losePlayed === false) {
        backgroundSound.stop();
        loseSound.play();
      }
      losePlayed = true;
      drawFace(face.x, face.y, 0, 180, 360);
    }

    //if you do win... 
    if (count.total == count.broken) {
      win(50, color(random(0, 255), random(0, 255), random(0, 255)), "Helvetica");
      if (winSound.isPlaying() === false && winPlayed === false) {
        backgroundSound.stop();
        winSound.rate(2);
        winSound.play();
      }
      winPlayed = true;
      winning = true;
      drawFace(face.x, face.y, 0, 360, 180);
    } else {
      winning = false;
    }
  }
}