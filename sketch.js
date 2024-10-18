 let blockX = 100;        // Initial x position of the block
let blockY = 250;        // y position of the block (fixed)
let blockWidth = 50;     // Width of the block
let blockHeight = 30;    // Height of the block
let appliedForce = 100;  // Applied force in Newtons
let frictionForce = 20;  // Frictional force in Newtons
let displacement = 0;    // Displacement of the block
let work = 0;            // Work done by selected force
let isPlaying = false;   // Play/Pause control
let velocity = 2;        // Speed of the block (2 pixels per frame)
let speed = "normal";    // Slow or normal speed control
let showFBD = true;      // Toggle Free Body Diagram

// UI elements
let forceInput, displacementInput, frictionInput, workResult;
let playButton, pauseButton, replayButton, slowButton, normalButton;
let fbdCheckbox, forceSelector;

function setup() {
  createCanvas(800, 500);

  // Force input field
  forceInput = createInput(appliedForce.toString());
  forceInput.position(20, 20);
  createElement('label', 'Applied Force (N)').position(150, 20);
  
  // Friction input field
  frictionInput = createInput(frictionForce.toString());
  frictionInput.position(20, 60);
  createElement('label', 'Frictional Force (N)').position(150, 60);
  
  // Displacement input field (output)
  displacementInput = createInput(displacement.toString());
  displacementInput.position(20, 100);
  createElement('label', 'Displacement (m)').position(150, 100);
  displacementInput.attribute('readonly', true);
  
  // Work output field (readonly)
  workResult = createInput(work.toString());
  workResult.position(20, 140);
  createElement('label', 'Work (J)').position(150, 140);
  workResult.attribute('readonly', true);
  
  // Play button
  playButton = createButton('Play');
  playButton.position(20, 180);
  playButton.mousePressed(playSimulation);
  
  // Pause button
  pauseButton = createButton('Pause');
  pauseButton.position(80, 180);
  pauseButton.mousePressed(pauseSimulation);
  
  // Replay button
  replayButton = createButton('Replay');
  replayButton.position(160, 180);
  replayButton.mousePressed(replaySimulation);
  
  // Slow speed button (shifted to right of Replay button)
  slowButton = createButton('Slow');
  slowButton.position(240, 180);
  slowButton.mousePressed(setSlowSpeed);
  
  // Normal speed button (shifted to right of Slow button)
  normalButton = createButton('Normal');
  normalButton.position(300, 180);
  normalButton.mousePressed(setNormalSpeed);
  
  // Show Free Body Diagram checkbox (shifted below the surface)
  fbdCheckbox = createCheckbox('Show Free Body Diagram', true);
  fbdCheckbox.position(20, blockY + blockHeight + 50);  // Shifted below the yellow surface
  
  // Force selection dropdown (shifted to right of Normal button)
  forceSelector = createSelect();
  forceSelector.position(380, 180);
  forceSelector.option('Applied Force');
  forceSelector.option('Frictional Force');
  forceSelector.option('Normal Force');
  forceSelector.option('Gravitational Force');
  forceSelector.changed(calculateWork);
  
  // Initial calculation of work
  calculateWork();
}

function draw() {
  background(255);
  
  // Update inputs
  appliedForce = float(forceInput.value());
  frictionForce = float(frictionInput.value());
  
  // Draw the surface (yellow line) based on displacement
  strokeWeight(10);
  stroke(255, 204, 0);  // Yellow color
  line(100, blockY + blockHeight, blockX + 300, blockY + blockHeight);  // Fixed length of 300
  
  // Draw the block
  fill(150);
  rect(blockX, blockY, blockWidth, blockHeight);
  
  // Update displacement if playing
  if (isPlaying) {
    if (blockX < width - blockWidth - 50) {
      blockX += velocity;
      displacement += velocity * 0.01;  // Scale pixels to meters
      displacementInput.value(displacement.toFixed(2));
      calculateWork();
    } else {
      isPlaying = false;
    }
  }

  // Draw forces (FBD) if checked
  if (showFBD) {
    drawForces();
  }
}

// Function to calculate work
function calculateWork() {
  let force = 0;
  let selectedForce = forceSelector.value();
  
  if (selectedForce == 'Applied Force') {
    force = appliedForce;
  } else if (selectedForce == 'Frictional Force') {
    force = -frictionForce;
  } else if (selectedForce == 'Normal Force') {
    force = 0;
  } else if (selectedForce == 'Gravitational Force') {
    force = 0;
  }
  
  work = force * displacement; // Work = F * d * cos(theta), theta = 0 degrees
  workResult.value(work.toFixed(2));
}

// Draw the free body diagram with arrows and labels
function drawForces() {
  strokeWeight(3);
  
  // Applied force (blue)
  stroke(0, 0, 255);
  line(blockX + blockWidth, blockY + blockHeight / 2, blockX + blockWidth + appliedForce, blockY + blockHeight / 2);
  noStroke();
  fill(0);
  text('Applied Force', blockX + blockWidth + appliedForce + 10, blockY + blockHeight / 2 + 5);
  
  // Frictional force (red)
  stroke(255, 0, 0);
  line(blockX, blockY + blockHeight / 2, blockX - frictionForce, blockY + blockHeight / 2);
  noStroke();
  fill(0);
  text('Friction Force', blockX - frictionForce - 80, blockY + blockHeight / 2 + 5);
  
  // Normal force (purple)
  stroke(128, 0, 128);
  line(blockX + blockWidth / 2, blockY, blockX + blockWidth / 2, blockY - 30);
  noStroke();
  fill(0);
  text('Normal Force', blockX + blockWidth / 2 - 30, blockY - 40);
  
  // Gravitational force (green)
  stroke(0, 255, 0);
  line(blockX + blockWidth / 2, blockY + blockHeight, blockX + blockWidth / 2, blockY + blockHeight + 30);
  noStroke();
  fill(0);
  text('Gravitational Force', blockX + blockWidth / 2 - 50, blockY + blockHeight + 50);
}

// Play simulation
function playSimulation() {
  isPlaying = true;
}

// Pause simulation
function pauseSimulation() {
  isPlaying = false;
}

// Replay simulation
function replaySimulation() {
  isPlaying = false;
  blockX = 100;
  displacement = 0;
  displacementInput.value(displacement.toFixed(2));
  calculateWork();
}

// Set slow speed
function setSlowSpeed() {
  velocity = 1;
}

// Set normal speed
function setNormalSpeed() {
  velocity = 2;
}

// Toggle FBD visibility
function toggleFBD() {
  showFBD = !showFBD;
}
