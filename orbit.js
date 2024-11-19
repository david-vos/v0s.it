let orbs = [];
const g = 15;
let canvas;
let bgColor;

function setup() {
  colorMode(HSB, 360, 100, 100);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  bgColor = color(240, 50, 12); // Background color in HSB
  canvas.background(bgColor);
  OrbColor = color(3, 255, 3)
  frameRate(60);

  // Static central orb
  orbs.push(
    new Orb(
      createVector(windowWidth / 2, windowHeight / 2),
      createVector(0, 0),
      401,
      100,
      true,
      OrbColor
    )
  );

  // Randomly placed orbs
  for (let i = 0; i < 3; i++) {
    let sizeAndMass = random(10, 30);
    orbs.push(
      new Orb(
        createVector(random(width), random(height)),
        createVector(random(-10, 10), random(-10, 10)),
        sizeAndMass,
        sizeAndMass,
        false,
        255
      )
    );
  }
}

function draw() {
  canvas.background(bgColor);
  update();
  displayGravPull()
  orbs.forEach(orb => orb.display());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  orbs[0].pos = createVector(windowWidth / 2, windowHeight / 2);
  for (let i = 1; i < orbs.length; i++) {
    let orb = orbs[i];
    orb.pos.x = orb.pos.x / windowWidth * width;
    orb.pos.y = orb.pos.y / windowHeight * height;
  }
}

function update() {
  for (let i = 0; i < orbs.length; i++) {
    let orb = orbs[i];
    for (let j = 0; j < orbs.length; j++) {
      if (i === j || orb.isStatic) continue; 
      let otherOrb = orbs[j];
      let dir = p5.Vector.sub(otherOrb.pos, orb.pos);
      let dist = constrain(dir.mag(), 10, 100) + orb.size; 
      dir.normalize();
      let force = (g * orb.mass * otherOrb.mass) / (dist ** 2);
      let acceleration = dir.mult(force / orb.mass);
      orb.vel.add(acceleration);
    }
  }
  orbs.forEach(orb => orb.update());
}

class Orb {
  constructor(pos, vel, mass, size, isStatic, color) {
    this.pos = pos;
    this.vel = vel;
    this.mass = mass;
    this.size = size;
    this.isStatic = isStatic;
    this.orbit = [];
    if(color) {
      this.color = color
    } else {
      this.color = ranomOrbColor
    }
  }

  update() {
    this.orbit.push(this.pos.copy());
    this.pos.add(this.vel);
    if (this.orbit.length > 40) {
      this.orbit.shift();
    }
  }

  displayOrbit() {
    for (let i = 0; i < this.orbit.length - 1; i++) {
      stroke(color(207.45, 46.63, 81.67));
      strokeWeight(3);
      line(this.orbit[i].x, this.orbit[i].y, this.orbit[i + 1].x, this.orbit[i + 1].y);
    }
  }

  displayOrb() {
    fill(color(208.7, 92.93, 38.82));
    stroke(color(208.83, 50, 60.39));
    strokeWeight(2);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  display() {
    if (this.isStatic) return;
    this.displayOrbit();
    this.displayOrb();
  }
}

function displayGravPull() {
  colorMode(RGB, 255);
  blendMode(ADD);

  for (let i = 0; i < orbs.length; i++) {
    let orb = orbs[i];
    let maxSize;
    let gradJumps
    let orbcolorEnd
    if (orb.isStatic) {
      maxSize = orb.size*1.8;
      gradJumps = 7
      orbcolorEnd = color(184, 132, 11)
    } else {
      maxSize = orb.size*7;
      gradJumps = 20
      orbcolorEnd = color(0, 255,2)
    }

    for (let r = 1; r < maxSize; r += gradJumps) {
      let distance = r;

      let smoothAlpha = map(distance, 0, maxSize, 255, 0);
      smoothAlpha = pow(smoothAlpha / 255, 2) * 255;

      let gradientColor = lerpColor(color(orb.color, 60, 0), orbcolorEnd, distance / maxSize);
      gradientColor.setAlpha(smoothAlpha);

      fill(gradientColor);
      noStroke();
      ellipse(orb.pos.x, orb.pos.y, distance * 2);
    }
  }

  blendMode(BLEND);
  colorMode(HSB, 360, 100, 100);
}

