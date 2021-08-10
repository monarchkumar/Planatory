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
    if (window.mobileCheck()) scene.meshes[1].rotation.y -=0.001;
    else scene.meshes[1].rotation.y -=0.0002; 
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
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function createPhysics(objects){
  var massLimit = 10 ; 
  var forceCausers = Array();
  objects.forEach(object => {
    if (object.physicalProperties['mass']>= massLimit) forceCausers.push(object);
  });
  console.log(forceCausers);
  
  
}