import * as THREE from "three";
import GUI from "lil-gui";
import { ParallaxXY } from "./ParallaxXY";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";
import { linkHandler } from "./LinkHandler";
import { handleclose } from "./LinkHandler";
console.log(GUI);
// === Global Elements and Variables
//canvas
const canvas = document.querySelector(".canvasGL");

// Site Links
const links = document.querySelectorAll(".link");
links.forEach((element) => {
  element.addEventListener("click", linkHandler);
});
const closeModal = document.querySelector(".close");
closeModal.addEventListener("click", handleclose);
// Our screen size
const canvasSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// === Scene and Camera === //
const scene = new THREE.Scene();

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(
  75,
  canvasSize.width / canvasSize.height,
  0.1,
  1000
);
camera.position.z = 10;
cameraGroup.add(camera);
/**
 *  TEXTURES, GEOMETRY, MATERIALS, & MESHES
 */
// == Global Model Variables == //
const objectDistance = 9;

// === Textures === //
const textureLoader = new THREE.TextureLoader();

/// === Models === ///
// BROILERPLATE
const modelLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(" /examples/jsm/libs/draco/");
modelLoader.setDRACOLoader(dracoLoader);

// Load Resources
// Hamburger
let hamburgerModel;
modelLoader.load("/public/models/hamburger.glb", function (gltf) {
  hamburgerModel = gltf.scene;
  scene.add(hamburgerModel);
  hamburgerModel.scale.set(0.5, 0.5, 0.5);
  hamburgerModel.scale.set(0.5, 0.5, 0.5);
  hamburgerModel.position.set(-7, -objectDistance * 1, 0);
});

// === Geometry === //
// Donut
const donutGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const donutMaterial = new THREE.MeshBasicMaterial({ color: "pink" });
const donut = new THREE.Mesh(donutGeometry, donutMaterial);
donut.position.set(7.75, 2, 0);
scene.add(donut);

// French Fries
let frenchfriesModel;
modelLoader.load("/public/models/frenchfries.gltf", function (gltf) {
  console.log(gltf);
  frenchfriesModel = gltf.scene;
  scene.add(frenchfriesModel);
  frenchfriesModel.position.set(6, -objectDistance * 2, 0);
  frenchfriesModel.scale.set(1.25, 1.25, 1.25);
});

// Soda
const sodaMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(1.1, 1, 4.5, 40, 3),
  new THREE.MeshStandardMaterial({
    color: "tan",
    roughness: 10,
  })
);
sodaMesh.position.set(-6, -objectDistance * 3, 0);
scene.add(sodaMesh);

// == Sprites == //
// Sprite Params
let params = {
  spriteCount: 3000,
  spriteColor: 0xbf78bf,
};
let spriteCount = params.spriteCount;

// Sprite Creation
const spritePositionArray = new Float32Array(spriteCount * 3);
console.log(spritePositionArray.length); // 900 positions
//procedual generate x,y,z
for (let i = 0; i < spritePositionArray.length; i++) {
  // Our Vector3 positions on the array
  const index3 = i * 3;
  // our array will be like this [x,y,z,x,y,z,x,y,z,x,y,z,x,y,z,x,y,z,x,y,z]
  spritePositionArray[i * index3 + 0] = (Math.random() - 0.5) * 20; //example (i=0, 0 * 3 + 0 = 0)
  spritePositionArray[i * index3 + 1] = -(Math.random() - 0.5) * 50; //example (i=1, 0 * 3 + 1 = 1)
  spritePositionArray[i * index3 + 2] = (Math.random() - 0.5) * 2; //example (i=2, 0 * 3 + 2 = 2)
}
console.log(Math.random());
//buffergeo//getattributes add array
const spriteGeometry = new THREE.BufferGeometry();
spriteGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(spritePositionArray, 3)
);
//points material
const spriteMaterial = new THREE.PointsMaterial({
  color: params.spriteColor,
  sizeAttenuation: true,
  size: 0.5103,
});
//something somethin combine all and add to cameraGroup
const spriteMesh = new THREE.Points(spriteGeometry, spriteMaterial);
cameraGroup.add(spriteMesh);
// === Lights === //
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);
// 0xce4fde a purple color
// === Renderer === //
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialiasing: true,
  alpha: true, // also for background HTML so show
});
// adds a bit of color and intensity to tint whats behind canvas
// I would like to add a feature that randomly reloads a different color for each visit
renderer.setClearColor(0xffaaff, 0.5);
renderer.setSize(canvasSize.width, canvasSize.height);

/**
 * Scroll Feature
 */
const parallaxXY = new ParallaxXY(cameraGroup);

let scrollY = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

/**
 *  Animations and Ticks
 */
function animate() {
  // === Camera Animations === //
  camera.position.y = -(scrollY / window.innerHeight) * objectDistance;
  parallaxXY.tick();

  // === Object Animations === //
  donut.rotation.x += 0.01;
  donut.rotation.y += 0.01;
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}
animate();

/**
 *  Event Loops
 */

window.addEventListener("resize", () => {
  canvasSize.width = window.innerWidth;
  canvasSize.height = window.innerHeight;
  camera.aspect = canvasSize.width / canvasSize.height;
  renderer.setSize(canvasSize.width, canvasSize.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Debug UI Panel
 */
const gui = new GUI();
const spriteFolder = gui.addFolder("Sprites");

spriteFolder
  .add(params, "spriteCount")
  .min(100)
  .max(10000)
  .step(10)
  .name("Sprite Count")
  .onFinishChange(() => {
    console.log("finished change");
  });
