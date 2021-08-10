var scene, camera,globalTime = Date.now();
var objects= new Array();
var canvas = document.getElementById("canvas");
var engine = new BABYLON.Engine(canvas,true,null,true);
scene = new BABYLON.Scene(engine);
scene.clearColor=  new BABYLON.Color3(0, 0.05, 0.1);
//Handeling Screen Resizing
window.addEventListener("resize", function () {
  engine.resize();
});

camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI/2, 5, new BABYLON.Vector3(90,30,30), scene);
camera.angularSensibilityX = 500;
camera.angularSensibilityY = 500;
camera.inertia = 0;
camera.attachControl(canvas, true);
scene.activeCamera=camera;
camera.setTarget(new BABYLON.Vector3(0,0,0));
/*
let isLocked = false;
scene.onPointerDown = evt => {
    if (!isLocked) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
            return;
        }
    }
}

const pointerlockchange = () => {
  // @ts-ignore
  const controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
  if (!controlEnabled) {
      isLocked = false;
  } else {
      isLocked = true;
  }
};*/
function createGUI(){
  advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  textblock = new BABYLON.GUI.InputText("inputBox");
  GUIx=50-(canvas.height/2);
  textblock.fontSize = 24;
  textblock.top = GUIx;
  textblock.height =0.1;
  textblock.width = 0.2;
  textblock.color = "white";
  //advancedTexture.addControl(textblock);    
}

function createWorld(){
  var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-2, -2, -1), scene);
  light.position = new BABYLON.Vector3( 30 ,30 ,30);
  light.intensity=4;
  var light2 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(2, 2, 1), scene);
  light2.intensity=1;

  var assetsManager = new BABYLON.AssetsManager(scene);
  var meshTask = assetsManager.addMeshTask("Planet", "", "", "./bin/Planet.babylon");
  assetsManager.load();
  meshTask.onSuccess = function (task) { 
    task.loadedMeshes[0].physicalProperties = {mass: 10};
    task.loadedMeshes[0].rotation.y=-0.7;
    objects.push(task.loadedMeshes[0]);
    renderFrame();
    createPhysics(objects);
  }

  var sphere = new BABYLON.MeshBuilder.CreateSphere("sphere",{diameter : 1}, scene);
  sphere.position = new BABYLON.Vector3(20,20,20);
  sphere.physicalProperties = {mass : 1};
  objects.push(sphere);
}

var delT=0,delTsec=1;
function renderFrame(){
  engine.runRenderLoop(function () {
    delT+=0.01;
    if(delT>delTsec){
      delTsec=Math.ceil(delT);    
    };
    scene.meshes[1].rotation.y -=0.0002; 
    scene.render();    
  });
}
var userCommand = {
  moveBackwardKeyDown: false,
  moveForwardKeyDown: false,
  moveLeftKeyDown: false,
  moveRightKeyDown: false,
  jumpKeyDown: false,
  cameraAlpha: 0,
  cameraBeta: 0,
  frameTime:0
};

scene.onKeyboardObservable.add(kbInfo => {
  switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
          switch (kbInfo.event.key) {
              case 'w':
              case 'W':
                  userCommand.moveForwardKeyDown = true;
                  break;
              case 'a':
              case 'A':
                  userCommand.moveLeftKeyDown = true;
                  break;
              case 's':
              case 'S':
                  userCommand.moveBackwardKeyDown = true;
                  break;
              case 'd':
              case 'D':
                  userCommand.moveRightKeyDown = true;
                  break;
              case ' ':
                  userCommand.jumpKeyDown = true;
                  break;
          }
          
          break;
      case BABYLON.KeyboardEventTypes.KEYUP:
          switch (kbInfo.event.key) {
              case 'w':
              case 'W':
                  userCommand.moveForwardKeyDown = false;
                  break;
              case 'a':
              case 'A':
                  userCommand.moveLeftKeyDown = false;
                  break;
              case 's':
              case 'S':
                  userCommand.moveBackwardKeyDown = false;
                  break;
              case 'd':
              case 'D':
                  userCommand.moveRightKeyDown = false;
                  break;
              case ' ':
                  userCommand.jumpKeyDown = false;
                  break;
          }
          break;
  }
 
} );
const direction = new BABYLON.Vector3();
const velocity = new BABYLON.Vector3(0.0,0.0,0.0);
const ray = new BABYLON.Ray();
const rayHelper = new BABYLON.RayHelper(ray);
//rayHelper.attachToMesh(player, new BABYLON.Vector3(0, -0.995, 0), new BABYLON.Vector3(0, -1, 0), 0.9);
//rayHelper.show(scene, new BABYLON.Color3(1, 0, 0));

createGUI();
createWorld();

//document.addEventListener('pointerlockchange', pointerlockchange, false);
//document.addEventListener('mspointerlockchange', pointerlockchange, false);
//document.addEventListener('mozpointerlockchange', pointerlockchange, false);
//document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
function createPhysics(objects){
  var massLimit = 10 ; 
  var forceCausers = Array();
  objects.forEach(object => {
    if (object.physicalProperties['mass']>= massLimit) forceCausers.push(object);
  });
  console.log(forceCausers);
  
  
}