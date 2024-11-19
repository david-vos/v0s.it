let maxNodes 
let nodes;
let canvas;
let bgColor;

function setup() {
  colorMode(HSB, 360, 100, 100);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  bgColor = color(240, 50, 12);
  canvas.background(bgColor);
  frameRate(60);

  maxNodes = width/25
  nodes = new Nodes()
}

function draw() {
  canvas.background(bgColor);
  nodes.update()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (let i = 1; i < maxNodes; i++) {
    let nodePos = nodes.pos[i];
    nodePos.x = nodePos.x / windowWidth * width;
    nodePos.y = nodePos.y / windowHeight * height;
  }
}

class Nodes {
  constructor() {
    this.pos = [];
    this.vel = [];
    this.distTo = [];
    for (let i = 0; i < maxNodes; i++) {
      this.pos.push(createVector(random(0, width), random(0, height)));
      this.vel.push(createVector(random(-100, 100) / 30, random(-100, 100) / 30));
      this.distTo.push([]);
    }
  }

  update() {
    for (let i = 0; i < maxNodes; i++) {
      this.setWeb(i);
      this.moveNode(this.pos[i], this.vel[i]);
      this.drawNode(this.pos[i]);
      this.drawWeb(i);
    }
  }

  moveNode(nodePos, nodeVel) {
    if (nodePos.x < 0 || nodePos.x > width) nodeVel.x *= -1;
    if (nodePos.y < 0 || nodePos.y > height) nodeVel.y *= -1;
    nodePos.add(nodeVel);
  }

  drawNode(nodePos) {
    fill(color(208.7, 92.93, 38.82));
    noStroke();
    ellipse(nodePos.x, nodePos.y, 8);
  }

  drawWeb(index) {
    const nodePos = this.pos[index];
    const closestNodes = this.distTo[index];
    stroke(208.7, 92.93, 38.82);

    for (let i = 0; i < 5 && i < closestNodes.length; i++) {
      const neighborPos = closestNodes[i].pos;
      line(nodePos.x, nodePos.y, neighborPos.x, neighborPos.y);
    }
  }

  setWeb(index) {
    this.distTo[index] = [];
    for (let j = 0; j < maxNodes; j++) {
      if (j === index) continue;
      const distance = dist(this.pos[index].x, this.pos[index].y, this.pos[j].x, this.pos[j].y);
      this.distTo[index].push({
        pos: this.pos[j], 
        dist: distance
      });
    }

    // Sort using bubble sort
    const distances = this.distTo[index];
    for (let i = 0; i < distances.length - 1; i++) {
      let isSwapped = false;
      for (let j = 0; j < distances.length - i - 1; j++) {
        if (distances[j].dist > distances[j + 1].dist) {
          const temp = distances[j];
          distances[j] = distances[j + 1];
          distances[j + 1] = temp;
          isSwapped = true;
        }
      }
      if (!isSwapped) break;
    }
  }
}


