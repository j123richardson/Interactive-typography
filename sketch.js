var mic;
var mouse;
let variableText;
let fontname;
let randombackground;
let sound;
let video;
let poseNet;
let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;
let wristX = 0;
let wristY = 0;

// modes
// "mouse", "sound", "motion"
let mode = "mouse";

let color_picker = document.getElementById("color-picker");
let color_picker_wrapper = document.getElementById("color-picker-wrapper");

color_picker.onchange = function () {
  color_picker_wrapper.style.backgroundColor = color_picker.value;
};
document.getElementById("color-picker").addEventListener("change", function () {
  document.body.style.backgroundColor = this.value;
});

let color_picker2 = document.getElementById("color-picker2");
let color_picker_wrapper2 = document.getElementById("color-picker-wrapper2");
let colourtext = document.getElementById("variable-text");
let mousecolour = document.getElementById("Mouse");
let soundcolour = document.getElementById("Sound");
let motioncolour = document.getElementById("Motion");
let cursor1colour = document.getElementById("cursor1");
let backgroundcolour = document.getElementById("backgroundcolour");
let downarrow = document.getElementById("downarrow");
let information = document.getElementById("information");
  

color_picker2.oninput = function () {
  colourtext.style.color = color_picker2.value;
  color_picker_wrapper2.style.backgroundColor = color_picker2.value;
  mousecolour.style.color = color_picker2.value;
  soundcolour.style.color = color_picker2.value;
  motioncolour.style.color = color_picker2.value;
  color_picker_wrapper.style.color = color_picker2.value;
  cursor1colour.style.backgroundColor = color_picker2.value;
  downarrow.style.color = color_picker2.value;
  information.style.color = color_picker2.value;

};

let pressed = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);

  variableText = select("#variable-text");
  fontname = select("#fontname");
  randombackground = select("#RandomBackground");
  sound = select("#Sound");
  randomfill = select("#RandomFill");
  mouse = select("#Mouse");
  motion = select("#Motion");

  sound.mousePressed(soundon);
  motion.mousePressed(motionon);
  mouse.mousePressed(mouseon);

  circleCursor = select("#cursor1");
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    let nX = poses[0].pose.keypoints[0].position.x;
    let nY = poses[0].pose.keypoints[0].position.y;
    let eX = poses[0].pose.keypoints[1].position.x;
    let eY = poses[0].pose.keypoints[1].position.y;
    let wX = poses[0].pose.keypoints[9].position.x;
    let wY = poses[0].pose.keypoints[9].position.y;

    noseX = lerp(noseX, nX, 0.5);
    noseY = lerp(noseY, nY, 0.5);
    eyelX = lerp(eyelX, eX, 0.5);
    eyelY = lerp(eyelY, eY, 0.5);
    wristX = lerp(wristX, wX, 0.5);
    wristY = lerp(wristY, wY, 0.5);
  }
}

function modelLoaded() {
  //console.log("poseNet ready");
}

function draw() {
  // this clears everything and leaves you with a transparent background
  clear();
  
  // console.log(mode)
  circleCursor.style("left", mouseX + "px");
  circleCursor.style("top", mouseY + "px");
  circleCursor.style.color = color_picker2.value;

  //Mouse interaction
  // modes are selected with the buttons
  if (mode === "mouse") {
    let textwidth = map(mouseX, 0, width, 62, 125);
    variableText.style("font-variation-settings", "'wdth' " + textwidth);

    let textweight = map(mouseY, height, 0, 100, 900);
    variableText.style("font-weight", textweight);
    
  } else if (mode === "sound") {
    //Sound interaction

    if (mic) {
      let vol = mic.getLevel();

      let textwidthsound = Math.floor(map(vol, 0, 0.1, 100, 900, true));
      variableText.style("font-weight", textwidthsound);

     let textwidthsound2 = Math.floor(map(vol, 0, 0.1, 62, 125, true));
      variableText.style("font-variation-settings", "'wdth' " + textwidthsound2);
      
    }
  } else if (mode === "motion") {

    // Motion interaction

    image(video, 0, 0,windowWidth, windowHeight );
    tint(255, 30);

    let d = dist(noseX, noseY, eyelX, eyelY);

    let textwidthmotionwidth = map(noseX, d, width, 62, 125);
    variableText.style(
      "font-variation-settings",
      "'wdth' " + textwidthmotionwidth
    );

    let textwidthmotionweight = map(noseY, height, d, 100, 900);
    variableText.style("font-weight", textwidthmotionweight);
    
  }
}

function apiAsk() {}

function mouseon() {
  mode = "mouse";
}

function soundon() {
  mode = "sound";

  getAudioContext().resume();
  mic = new p5.AudioIn();
  mic.start();
}

function motionon() {
  mode = "motion";
}
