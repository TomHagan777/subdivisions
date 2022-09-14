//next step ¬
//
//  i.    Make video upload possible. Imagine having this as a video editor… (REALLY HARD)
//        Putting an existing piece of footage and plopping it in to this device to lower sample rate
//        ref: https://creative-coding.decontextualize.com/video/
//        - really would like to do this – i'm not sure why it is not working. It should be simple
//        ^^^^ DONE √
//        
//        next: video proportions inside canvas - like the image upload <<< DONE √
//        next: mute video - maybe not ¯\_(ツ)_/¯ 
//        next: video export – is this even possible?
//        next: UI upload button (easy) - can you make it into one button?? <<< DONE √
//
//  ii.   Mobile version. Same code with detecting screensize. Try using 'modes' (if .this size = mode1 } else = mode2)
//
//  iii.  Fullscreen capability (TRICKY)
//        -> capture.size ?
//        -> translate ?
//        -> resize() ?
//        notes: works when intitiates at full screen but not after with canvas size changes???


let cap;
let d;

let vc2 = 2; //downsampling numbers
let vc3 = 4;
let vc4 = 6;

let increaseRect; //master bitcrush
let posterSlider; //colour stability

let invert1 = false; //boolean switches
let threshold1 = false;
let grid1 = false;
let cameraToggle = false;

let rectButton = false;
let softSquareButton = false;
let ellipseButton = false;
let triangleButton = false;
let stankowskiButton = false;
let dogtoothButton = false;

let triangleArray = []; //complex shapes
let stankowskiArray = []; let stankowskiSpacer = 1;
let dogtoothArray = []; let dogtoothXSpacer = 1; let dogtoothYSpacer = 1;

let input; //file handler variables
let img;
let videoInput;
let vid;
let vidWidth = 4;

// function preload(){
//   cap = createCapture(VIDEO);
//   cap = createCapture({
//     audio: false,
//     video: { width: width, height: height }
//   });
//   cap.hide();
// }

function setup() {
  cnv = createCanvas(640, 480); //640, 480
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 3;
  cnv.position(canvasX, canvasY);

  d = pixelDensity(); //gets pixel density of your display
  rectMode(CENTER)
  ellipseMode(CENTER)
  noStroke();

  cap = createCapture({
    audio: false,
    video: { width: width, height: height }
  });
  cap.hide();

  //res • shape • crush • stabilty //

  //sliders
    //opactity
  opacSlider4 = select('#opacSlider4'); //04
  opacSlider3 = select('#opacSlider3'); //03
  opacSlider2 = select('#opacSlider2'); //02
  opacSlider1 = select('#opacSlider1'); //01
  opacSlider5 = select('#opacSlider5'); //00 –> raw feed
  
  //colour stab + bitcrush
  posterSlider = select('#posterSlider');
  increaseRect = select('#increaseRect');

  //buttons
  gridButton = select('#gridButton');
  gridButton.mousePressed(gridNow);

  threshold1Button = select('#threshold1Button');
  threshold1Button.mousePressed(thresholdNow);
  
  invert1Button = select('#invert1Button');
  invert1Button.mousePressed(invertNow);
  
  //camera button
  cameraButton = select('#cameraButton');
  cameraButton.mousePressed(cameraNow);

  //upload button
  input = createFileInput(handleFile);
  // input = select('#handleFile');
  input.addClass('inputButtonClass');
  input.parent('inputButtonID')
  
  //save button
  exportButton = select('#exportButton');
  exportButton.mousePressed(saveFrame);
  
  //shape buttons
  softSquareButton = select('#softSquareButton');
  softSquareButton.mousePressed(softSquareChange);

  rectButton = select('#rectButton');
  rectButton.mousePressed(rectChange);
  
  ellipseButton = select('#ellipseButton');
  ellipseButton.mousePressed(ellipseChange);

  triangleButton = select('#triangleButton');
  triangleButton.mousePressed(triangleChange);
  
  stankowskiButton = select('#stankowskiButton')
  stankowskiButton.mousePressed(stankowskiChange);

  dogtoothButton = select('#dogtoothButton')
  dogtoothButton.mousePressed(dogtoothChange);
  
// //fullscreen option (not working yet)
//   button3 = createButton('Fullscreen');
//   button3.style('padding:10px;')  
//   button3.position(650,537);
//   button3.mousePressed(fullscreen01);
  
  //sets default on initialisation
  softSquareChange();
  softSquareButton = true;

}

function draw() {
  background(0);
  saveCanvas = createGraphics(width,height); //variable for exports
  
//Camera Capture & Image Upload Display 01

//VIDEO UPLOAD
  if ((vid) && (vid.width < vid.height)){ //portrait video
    background(0);
    imageMode(CENTER);
    image(vid, width/2, height/2, vid.width*height/vid.height, height);
    tint(255,255);
    loadPixels();

  } else if ((vid) && (vid.width > vid.height)){ //landscape video
    background(0);
    imageMode(CENTER);
    image(vid, width/2, height/2, width, vid.height*width/vid.width);
    tint(255,255);
    loadPixels();

  } else if ((vid) && (vid.width === vid.height)){ //square video
    background(0);
    imageMode(CENTER); 
    image(vid, width/2, height/2, vid.width*height/vid.height, height);
    tint(255,255);
    loadPixels();

//IMAGE UPLOAD
  } else if ((img) && (img.width < img.height)) { //portrait
    background(0); //set background to black
    imageMode(CENTER); //scale portrait proportionally
    image(img, width/2, height/2, img.width*height/img.height, height) 
    loadPixels();
    
  } else if ((img) && (img.width > img.height)){ //landscape
    background(0);
    imageMode(CENTER); //scale landscape proportionally
    image(img, width/2, height/2, width, img.height*width/img.width);
    loadPixels();

  } else if ((img) && (img.width === img.height)){ //square images
    background(0);
    imageMode(CENTER); //scales square images proportionally
    image(img, width/2, height/2, img.width*height/img.height, height);
    loadPixels();

//CAMERA FEED
  } else {
    translate(cap.width, 0); //flips camera to provide a mirror image
    scale(-1, 1);
    image(cap, 0, 0, width, height);
    tint(255, opacSlider5.value())
  }

  if (cameraToggle == true){
    img = null;
    vid = null;
    cameraToggle = false;
  } else {
    imageMode(CORNER);
  }

  fill(0,0,0,255-opacSlider5.value()); //transparency for image + video upload
  rect(0,0,width*2,height*2);

  for (let y = 0; y < cap.height+1; y += increaseRect.value()*dogtoothYSpacer) {
    for (let x = 0; x < cap.width+1; x += increaseRect.value()*stankowskiSpacer*dogtoothXSpacer) {
        let xpos = (x / cap.width) * width;
        let ypos = (y / cap.height) * height;
      if (vid){ //for video upload
        let offset = ((y*d*cap.width*d)+x*d)*4;
          let vR = pixels[offset + 0];
          let vG = pixels[offset + 1];
          let vB = pixels[offset + 2];
        fill(vR, vG, vB, opacSlider1.value());
      } else if (img){ //for image upload
        let offset = ((y*d*cap.width*d)+x*d)*4; //scales image to pixel density of display
          let r = pixels[offset + 0];
          let g = pixels[offset + 1];
          let b = pixels[offset + 2];
        fill(r, g, b, opacSlider1.value());
      } else { //for camera feed
        let offset = ((y * cap.width)+x)*4;
          let cR = cap.pixels[offset + 0];
          let cG = cap.pixels[offset + 1];
          let cB = cap.pixels[offset + 2];
        fill(cR, cG, cB, opacSlider1.value());
      }
      if (rectButton == true){
          rect(xpos, ypos, increaseRect.value(), increaseRect.value())
      } 
      if (softSquareButton == true ){
          rect(xpos, ypos, increaseRect.value(), increaseRect.value(), 
               increaseRect.value()/6);
      } 
      if (ellipseButton == true){
          ellipse(xpos, ypos, increaseRect.value(), increaseRect.value());
      }
      if (triangleButton == true){
          triangleArray[0] = new triangleNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
          triangleArray[0].display01();
      }
      if (stankowskiButton == true){
          stankowskiSpacer = 2;
          stankowskiArray[0] = new stankowskiNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
          stankowskiArray[0].display01();
      } else {
          stankowskiSpacer = 1;
      }
      if (dogtoothButton == true){
        dogtoothXSpacer = 2;
        dogtoothYSpacer = 2;
        dogtoothArray[0] = new dogtoothNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
        dogtoothArray[0].display01();
      } else {
        dogtoothXSpacer = 1;
        dogtoothYSpacer = 1;
      }
    }
  }  
  
//Video Capture & Image Upload Display 02
  for (let y = 0; y < cap.height+1; y += [increaseRect.value()*vc2]*dogtoothYSpacer) {
    for (let x = 0; x < cap.width+1; x += [increaseRect.value()*vc2]*stankowskiSpacer*dogtoothXSpacer) {
        let xpos = (x / cap.width) * width;
        let ypos = (y / cap.height) * height;
      if (vid){ //for video upload
        let offset = ((y*d*cap.width*d)+x*d)*vidWidth;
          let vR = pixels[offset + 0];
          let vG = pixels[offset + 1];
          let vB = pixels[offset + 2];
        fill(vR, vG, vB, opacSlider2.value());
      } else if (img){ //for image upload
        let offset = ((y*d*cap.width*d)+x*d)*4;
          let r = pixels[offset + 0];
          let g = pixels[offset + 1];
          let b = pixels[offset + 2];
        fill(r, g, b, opacSlider2.value());
      } else { //for camera feed
        let offset = ((y * cap.width)+x)*4;
          let cR = cap.pixels[offset + 0];
          let cG = cap.pixels[offset + 1];
          let cB = cap.pixels[offset + 2];
        fill(cR, cG, cB, opacSlider2.value());
      }
      if (rectButton == true){
          rect(xpos, ypos, increaseRect.value()*vc2, increaseRect.value()*vc2)
      } 
      
      if (softSquareButton == true ){
          rect(xpos, ypos, increaseRect.value()*vc2, 
               increaseRect.value()*vc2,increaseRect.value()*vc2/6);
      } 
      if (ellipseButton == true){
          ellipse(xpos, ypos, increaseRect.value()*vc2, increaseRect.value()*vc2);
      }
      if (triangleButton == true){
          triangleArray[0] = new triangleNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
          triangleArray[0].display02();
      }
      if (stankowskiButton == true){
          stankowskiSpacer = 2;
          stankowskiArray[0] = new stankowskiNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
          stankowskiArray[0].display02();
      } else {
          stankowskiSpacer = 1;
      }
      if (dogtoothButton == true){
        dogtoothXSpacer = 2;
        dogtoothYSpacer = 2;
        dogtoothArray[0] = new dogtoothNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
        dogtoothArray[0].display02();
      } else {
        dogtoothXSpacer = 1;
        dogtoothYSpacer = 1;
      }
    }
  }
  
//Video Capture & Image Upload Display 03
  for (let y = 0; y < cap.height+1; y += [increaseRect.value()*vc3]*dogtoothYSpacer) {
    for (let x = 0; x < cap.width+1; x += [increaseRect.value()*vc3]*stankowskiSpacer*dogtoothXSpacer) {
        let xpos = (x / cap.width) * width;
        let ypos = (y / cap.height) * height;
      if (vid){ //for video upload
        let offset = ((y*d*cap.width*d)+x*d)*vidWidth;
          let vR = pixels[offset + 0];
          let vG = pixels[offset + 1];
          let vB = pixels[offset + 2];
        fill(vR, vG, vB, opacSlider3.value());
      } else if (img){ //for image upload
        let offset = ((y*d*cap.width*d)+x*d)*4;
          let r = pixels[offset + 0];
          let g = pixels[offset + 1];
          let b = pixels[offset + 2];
        fill(r, g, b, opacSlider3.value());
      } else { //for camera feed
        let offset = ((y * cap.width)+x)*4;
          let cR = cap.pixels[offset + 0];
          let cG = cap.pixels[offset + 1];
          let cB = cap.pixels[offset + 2];
        fill(cR, cG, cB, opacSlider3.value());
      }
      if (rectButton == true){
          rect(xpos, ypos, increaseRect.value()*vc3, increaseRect.value()*vc3)
      } 
      if (softSquareButton == true ){
          rect(xpos, ypos, increaseRect.value()*vc3, 
               increaseRect.value()*vc3,increaseRect.value()*vc3/6);
      } 
      if (ellipseButton == true){
          ellipse(xpos, ypos, increaseRect.value()*vc3, increaseRect.value()*vc3);
      }
      if (triangleButton == true){
          triangleArray[0] = new triangleNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
          triangleArray[0].display03();
      }
      if (stankowskiButton == true){
          stankowskiSpacer = 2;
          stankowskiArray[0] = new stankowskiNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
          stankowskiArray[0].display03();
      } else {
          stankowskiSpacer = 1;
      }
      if (dogtoothButton == true){
        dogtoothXSpacer = 2;
        dogtoothYSpacer = 2;
        dogtoothArray[0] = new dogtoothNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
        dogtoothArray[0].display03();
      } else {
        dogtoothXSpacer = 1;
        dogtoothYSpacer = 1;
      }
    }
  }
  
//Video Capture & Image Upload Display 04
  for (let y = 0; y < cap.height+1; y += [increaseRect.value()*vc4]*dogtoothYSpacer) {
    for (let x = 0; x < cap.width+1; x += [increaseRect.value()*vc4]*stankowskiSpacer*dogtoothXSpacer) {
        let xpos = (x / cap.width) * width;
        let ypos = (y / cap.height) * height;
      if (vid){ //for video upload
        let offset = ((y*d*cap.width*d)+x*d)*vidWidth;
          let vR = pixels[offset + 0];
          let vG = pixels[offset + 1];
          let vB = pixels[offset + 2];
        fill(vR, vG, vB, opacSlider4.value());
      } else if (img){ //for image upload
        let offset = ((y*d*cap.width*d)+x*d)*4;
          let r = pixels[offset + 0];
          let g = pixels[offset + 1];
          let b = pixels[offset + 2];
        fill(r, g, b, opacSlider4.value());
      } else { //for camera feed
        let offset = ((y * cap.width)+x)*4;
          let cR = cap.pixels[offset + 0];
          let cG = cap.pixels[offset + 1];
          let cB = cap.pixels[offset + 2];
        fill(cR, cG, cB, opacSlider4.value());
      }
      if (rectButton == true){
          rect(xpos, ypos, increaseRect.value()*vc4, increaseRect.value()*vc4)
      } 
      if (softSquareButton == true ){
          rect(xpos, ypos, increaseRect.value()*vc4, 
               increaseRect.value()*vc4,increaseRect.value()*vc4/6);
      } 
      if (ellipseButton == true){
          ellipse(xpos, ypos, increaseRect.value()*vc4, increaseRect.value()*vc4);
      }
      if (triangleButton == true){
          triangleArray[0] = new triangleNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
          triangleArray[0].display04();
      }
      if (stankowskiButton == true){
          stankowskiSpacer = 2;
          stankowskiArray[0] = new stankowskiNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
          stankowskiArray[0].display04();
      } else {
          stankowskiSpacer = 1;
      }
      if (dogtoothButton == true){
        dogtoothXSpacer = 2;
        dogtoothYSpacer = 2;
        dogtoothArray[0] = new dogtoothNature(xpos,ypos,increaseRect,vc2,vc3,vc4)
        dogtoothArray[0].display04();
      } else {
        dogtoothXSpacer = 1;
        dogtoothYSpacer = 1;
      }
    }
  } cap.updatePixels();
  
  filter(POSTERIZE, posterSlider.value());
  
//filter switches
  if (invert1){
    filter(INVERT);
  } if (threshold1){
    filter(THRESHOLD,0.5);
  } if (grid1){
    stroke(255,255,255,50)
   } else {
    noStroke();
  }
  
//reset shape to default
  if (rectButton == false && softSquareButton == false && ellipseButton == false && 
      triangleButton == false && stankowskiButton == false && dogtoothButton == false) {
    softSquareChange();
  } 
}

function invertNow(){ //filters
  invert1 = !invert1;
} 

function thresholdNow(){
  threshold1 = !threshold1;
}

function posterizeNow(){
  posterize1 = !posterize1
}

function gridNow(){ //matrix
  grid1 = !grid1
} 

function cameraNow(){ //camera toggle
  cameraToggle = !cameraToggle;
} 

function rectChange(){ //shape buttons
  rectButton = !rectButton;
  softSquareButton = false;
  ellipseButton = false;
  triangleButton = false;
  stankowskiButton = false;
  dogtoothButton = false;
  console.log('| rect:', rectButton, '| softSquare:', softSquareButton, '| ellipse:', 
              ellipseButton,'| triangle:', triangleButton, '| stankowski:', stankowskiButton, 
              '| dogtooth:', dogtoothButton);
} 

function softSquareChange(){
  softSquareButton = !softSquareButton;
  rectButton = false;
  ellipseButton = false;
  triangleButton = false;
  stankowskiButton = false;
  dogtoothButton = false;
  console.log('| rect:', rectButton, '| softSquare:', softSquareButton, '| ellipse:', 
              ellipseButton,'| triangle:', triangleButton, '| stankowski:', stankowskiButton, 
              '| dogtooth:', dogtoothButton);
}

function ellipseChange(){
  ellipseButton = !ellipseButton;
  rectButton = false;
  softSquareButton = false;
  triangleButton = false;
  stankowskiButton = false;
  dogtoothButton = false;
  console.log('| rect:', rectButton, '| softSquare:', softSquareButton, '| ellipse:', 
              ellipseButton,'| triangle:', triangleButton, '| stankowski:', stankowskiButton, 
              '| dogtooth:', dogtoothButton);
}

function triangleChange(){
  triangleButton = !triangleButton;
  rectButton = false;
  softSquareButton = false;
  ellipseButton = false;
  stankowskiButton = false;
  dogtoothButton = false;
  console.log('| rect:', rectButton, '| softSquare:', softSquareButton, '| ellipse:', 
              ellipseButton,'| triangle:', triangleButton, '| stankowski:', stankowskiButton, 
              '| dogtooth:', dogtoothButton);
}

function stankowskiChange(){
  stankowskiButton = !stankowskiButton;
  rectButton = false;
  softSquareButton = false;
  ellipseButton = false;
  triangleButton = false;
  dogtoothButton = false;
  console.log('| rect:', rectButton, '| softSquare:', softSquareButton, '| ellipse:', 
              ellipseButton,'| triangle:', triangleButton, '| stankowski:', stankowskiButton, 
              '| dogtooth:', dogtoothButton);
}

function dogtoothChange(){
  dogtoothButton = !dogtoothButton;
  rectButton = false;
  softSquareButton = false;
  ellipseButton = false;
  triangleButton = false;
  stankowskiButton = false;
  console.log('| rect:', rectButton, '| softSquare:', softSquareButton, '| ellipse:', 
              ellipseButton,'| triangle:', triangleButton, '| stankowski:', stankowskiButton, 
              '| dogtooth:', dogtoothButton);
}

class triangleNature { //complex shapes
  constructor(xpos,ypos,increaseRect,vc2,vc3,vc4) {
    this.x = xpos
    this.y = ypos
    this.tri = increaseRect.value()
    this.vc2 = vc2
    this.vc3 = vc3
    this.vc4 = vc4
  }
  display01(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri,this.y+this.tri)
      vertex(this.x,this.y+this.tri);  
    endShape();
  }
  display02(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri*this.vc2,this.y+this.tri*this.vc2)
      vertex(this.x,this.y+this.tri*this.vc2);  
    endShape();
  }
  display03(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri*this.vc3,this.y+this.tri*this.vc3)
      vertex(this.x,this.y+this.tri*this.vc3);  
    endShape();
  }
  display04(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri*this.vc4,this.y+this.tri*this.vc4)
      vertex(this.x,this.y+this.tri*this.vc4);  
    endShape();
  }
}

class stankowskiNature {
  constructor(xpos,ypos,increaseRect,vc2,vc3,vc4) {
    this.x = xpos
    this.y = ypos
    this.tri = increaseRect.value()
    this.vc2 = vc2
    this.vc3 = vc3
    this.vc4 = vc4
  }
  display01(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri,this.y);
      vertex(this.x-this.tri,this.y+this.tri*2);
      vertex(this.x-this.tri*2,this.y+this.tri*2);
    endShape();
  }
  display02(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri*this.vc2,this.y);
      vertex(this.x-this.tri*this.vc2,this.y+this.tri*this.vc2*2);
      vertex(this.x-this.tri*this.vc2*2,this.y+this.tri*this.vc2*2);
    endShape();
  }
  display03(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri*this.vc3,this.y);
      vertex(this.x-this.tri*this.vc3,this.y+this.tri*this.vc3*2);
      vertex(this.x-this.tri*this.vc3*2,this.y+this.tri*this.vc3*2);
    endShape();
  }
  display04(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri*this.vc4,this.y);
      vertex(this.x-this.tri*this.vc4,this.y+this.tri*this.vc4*2);
      vertex(this.x-this.tri*this.vc4*2,this.y+this.tri*this.vc4*2);
    endShape();
  }
}

class dogtoothNature {
  constructor(xpos,ypos,increaseRect,vc2,vc3,vc4) {
    this.x = xpos;
    this.y = ypos;
    this.tri = increaseRect.value()/2;
    this.vc2 = vc2;
    this.vc3 = vc3;
    this.vc4 = vc4;
  }
  display01(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri,this.y);
      vertex(this.x+this.tri*2,this.y-this.tri);
      vertex(this.x+this.tri*2,this.y);
      vertex(this.x+this.tri*3,this.y);
      vertex(this.x+this.tri*2,this.y+this.tri);
      vertex(this.x+this.tri*2,this.y+this.tri*2);
      vertex(this.x,this.y+this.tri*4);
      vertex(this.x,this.y+this.tri*3);
      vertex(this.x+this.tri,this.y+this.tri*2);
      vertex(this.x,this.y+this.tri*2);
      vertex(this.x,this.y+this.tri);
      vertex(this.x-this.tri,this.y+this.tri*2);
      vertex(this.x-this.tri*2,this.y+this.tri*2);
    endShape();
  }
  display02(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri*vc2,this.y);
      vertex(this.x+this.tri*2*vc2,this.y-this.tri*vc2);
      vertex(this.x+this.tri*2*vc2,this.y);
      vertex(this.x+this.tri*3*vc2,this.y);
      vertex(this.x+this.tri*2*vc2,this.y+this.tri*vc2);
      vertex(this.x+this.tri*2*vc2,this.y+this.tri*2*vc2);
      vertex(this.x,this.y+this.tri*4*vc2);
      vertex(this.x,this.y+this.tri*3*vc2);
      vertex(this.x+this.tri*vc2,this.y+this.tri*2*vc2);
      vertex(this.x,this.y+this.tri*2*vc2);
      vertex(this.x,this.y+this.tri*vc2);
      vertex(this.x-this.tri*vc2,this.y+this.tri*2*vc2);
      vertex(this.x-this.tri*2*vc2,this.y+this.tri*2*vc2);
    endShape();
  }
  display03(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri*vc3,this.y);
      vertex(this.x+this.tri*2*vc3,this.y-this.tri*vc3);
      vertex(this.x+this.tri*2*vc3,this.y);
      vertex(this.x+this.tri*3*vc3,this.y);
      vertex(this.x+this.tri*2*vc3,this.y+this.tri*vc3);
      vertex(this.x+this.tri*2*vc3,this.y+this.tri*2*vc3);
      vertex(this.x,this.y+this.tri*4*vc3);
      vertex(this.x,this.y+this.tri*3*vc3);
      vertex(this.x+this.tri*vc3,this.y+this.tri*2*vc3);
      vertex(this.x,this.y+this.tri*2*vc3);
      vertex(this.x,this.y+this.tri*vc3);
      vertex(this.x-this.tri*vc3,this.y+this.tri*2*vc3);
      vertex(this.x-this.tri*2*vc3,this.y+this.tri*2*vc3);
    endShape();
}
  display04(){
    beginShape();
      vertex(this.x,this.y); 
      vertex(this.x+this.tri*vc4,this.y);
      vertex(this.x+this.tri*2*vc4,this.y-this.tri*vc4);
      vertex(this.x+this.tri*2*vc4,this.y);
      vertex(this.x+this.tri*3*vc4,this.y);
      vertex(this.x+this.tri*2*vc4,this.y+this.tri*vc4);
      vertex(this.x+this.tri*2*vc4,this.y+this.tri*2*vc4);
      vertex(this.x,this.y+this.tri*4*vc4);
      vertex(this.x,this.y+this.tri*3*vc4);
      vertex(this.x+this.tri*vc4,this.y+this.tri*2*vc4);
      vertex(this.x,this.y+this.tri*2*vc4);
      vertex(this.x,this.y+this.tri*vc4);
      vertex(this.x-this.tri*vc4,this.y+this.tri*2*vc4);
      vertex(this.x-this.tri*2*vc4,this.y+this.tri*2*vc4);
    endShape();
  }
}

function saveFrame() { //download function  
  if (exportButton) {
    let c = get(0, 0, width, height);
    saveCanvas.image(c, 0, 0);
    save(saveCanvas, "Frame "+frameCount+".png");
  }
} 

// function fullscreen01() { //NOT QUITE WORKING YET
  
//   let fs = fullscreen();
//   fullscreen(!fs);
  
//   if (fullscreen()){
//     createCanvas(640,480);
//   } else {
//     createCanvas(windowWidth, windowHeight); 
//   }

//   cap = createCapture({ //new capture / capture reset
//     audio: false,
//     video: { width: width, height: height }
//   });
//   cap.hide();

// } 

// function windowResized() {
//   resizeCanvas(640, 480);
//   centerCanvas();
// }

function handleFile(file) { //file uploader image
  print(file);
  if (file.type === 'image') { //image load
    img = createImg(file.data, '')
    img.hide();
    vid = null;
  } else {
    vid = createVideo(file.data, playVid) //video load
    img = null;
  }
} 

function playVid(){
  vid.loop()
  vid.hide();
}