let maxNodes 
let nodes;
let canvas;
let c1, c2;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  frameRate(60);

  c1 = color(245, 77, 59);
  c2 = color(184, 27, 186);

  maxNodes = width/25
  nodes = new Nodes()
}

function draw() {
  gradientBG(0, 0, width, height, c1, c2);
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

function gradientBG(x, y, w, h, c1, c2) {
  noFill();
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i); 
  }
}

class Nodes {
  constructor() {
    this.pos = [];
    this.vel = [];
    this.distTo = [];
    for (let i = 0; i < maxNodes; i++) {
      this.pos.push(createVector(random(0, width), random(0, height)));
      this.vel.push(createVector(random(-50, 50) / 250, random(-10, 10) / 250));
      this.distTo.push([]);
    }
  }

  update() {
    for (let i = 0; i < maxNodes; i++) {
      this.setWeb(i);
      this.moveNode(this.pos[i], this.vel[i]);
      this.drawWeb(i);
    //  this.drawNode(this.pos[i]);
    }
  }

  moveNode(nodePos, nodeVel) {
    if (nodePos.x < 0 || nodePos.x > width) nodeVel.x *= -1;
    if (nodePos.y < 0 || nodePos.y > height) nodeVel.y *= -1;
    nodePos.add(nodeVel);
  }

  drawNode(nodePos) {
    fill(color(0, 0, 0));
    noStroke();
    ellipse(nodePos.x, nodePos.y, 8);
  }

  drawWeb(index) {
    const nodePos = this.pos[index];
    const closestNodes = this.distTo[index];
    if (closestNodes.length < 2) return;

    const p1 = closestNodes[0].pos;
    const p2 = closestNodes[1].pos;

    const p3 = closestNodes[2].pos
    const p4 = closestNodes[3].pos

    const heightNumber = map(p1.y, 0, height, 0, 1);
    const triangleColor = lerpColor(c1, c2, heightNumber);

    fill(triangleColor);
    noStroke(); 
    triangle(nodePos.x, nodePos.y, p1.x, p1.y, p2.x, p2.y);
    
    fill(triangleColor);
    noStroke(); 
    triangle(nodePos.x, nodePos.y, p3.x, p3.y, p4.x, p4.y)

    for (let i = 0; i < 2 && i < closestNodes.length; i++) {
      const neighborPos = closestNodes[i].pos;
      fill(triangleColor);
      strokeWeight(2);
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


