let orbs = [];
const g = 15;
var canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.background(color(15,15,30));
  canvas.style('z-index', '-1');
  frameRate(60)
  orbs.push(
    new Orb(
      createVector(windowWidth/2, windowHeight/2),
      createVector(0, 0),
      401,
      100,
      true
    )
  )
  for (let i = 0; i < 3; i++) {
    sizeAndMass = random(5, 25) 
    orbs.push(new Orb(
      createVector(random(width), random(height)),
      createVector(random(-10, 3), random(-10, 3)),
      sizeAndMass,
      sizeAndMass*3,
      false
    ));
  }
}

function draw() {
  canvas.background(color(15,15,30));
  update(); 
  orbs.forEach(orb => orb.display());
}

function windowResized() {
  // TODO: move the positions of everything equal to the change of movement...
  resizeCanvas(windowWidth, windowHeight);
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
  constructor(pos, vel, mass, size, isStatic) {
    this.pos = pos;
    this.vel = vel;
    this.mass = mass;
    this.size = size;
    this.isStatic = isStatic;
    this.orbit = [];
  }

  update() {
    this.orbit.push(this.pos.copy()) 
    this.pos.add(this.vel);
    if(this.orbit.length > 40 ) {
      this.orbit.shift()
    }
  }

  display() {
    if(this.isStatic) return
    for(let i = 0; i < this.orbit.length -1; i++) {
      fill(color(111,162,208));
      stroke(color(111,162,208));
      strokeWeight(3)
      line(this.orbit[i].x, this.orbit[i].y, this.orbit[i+1].x, this.orbit[i+1].y);
    }
    
    fill(color(7,55,99));
    stroke(color(77,117,154));
    strokeWeight(2)
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
