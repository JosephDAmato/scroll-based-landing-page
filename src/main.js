import * as THREE from "three";
import GUI from "lil-gui";
import { ParallaxXY } from "./ParallaxXY";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";
import { linkHandler } from "./LinkHandler";
import { handleclose } from "./LinkHandler";
import Stats from "stats.js";
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
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
  0.01,
  1000
);
camera.position.z = 10;
cameraGroup.add(camera);
/**
 *  TEXTURES, GEOMETRY, MATERIALS, & MESHES
 */
// == Global Model Variables == //
const objectDistance = 10;
const sceneAssets = new THREE.Group();
scene.add(sceneAssets);

// === Textures === //
const textureLoader = new THREE.TextureLoader();

const pointsTexture = textureLoader.load("/imgs/points/sprinkle2.png");
console.log(pointsTexture);

/// === Models === ///
// BROILERPLATE
const modelLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(" /examples/jsm/libs/draco/");
modelLoader.setDRACOLoader(dracoLoader);

// Load Resources
// Hamburger
let hamburgerModel;
modelLoader.load("./public/models/hamburger.glb", function (gltf) {
  hamburgerModel = gltf.scene;
  sceneAssets.add(hamburgerModel);
  hamburgerModel.scale.set(0.5, 0.5, 0.5);
  hamburgerModel.scale.set(0.5, 0.5, 0.5);
  hamburgerModel.position.set(-6, -objectDistance * 1, 0);
});

// === Geometry === //
// Donut
const donutGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const donutMaterial = new THREE.MeshBasicMaterial({ color: "pink" });
const donut = new THREE.Mesh(donutGeometry, donutMaterial);
donut.position.set(7.75, 2, 0);
sceneAssets.add(donut);

// French Fries
let frenchfriesModel;
modelLoader.load("./public/models/frenchfries.gltf", function (gltf) {
  console.log(gltf);
  frenchfriesModel = gltf.scene;
  sceneAssets.add(frenchfriesModel);
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
sceneAssets.add(sodaMesh);

// == Sprites == //
// Sprite Params
let params = {
  spriteCount: 1000,
  spriteColor: 0xfd395a,
  // 0xbf78bf
};
let spriteCount = params.spriteCount;

// Sprite Creation
const spritePositionArray = new Float32Array(spriteCount * 3);
const spriteColorArray = new Float32Array(spriteCount * 3);
console.log(spritePositionArray.length); // 900 positions

// Procedural generate x,y,z
for (let i = 0; i < spritePositionArray.length; i++) {
  // Our Vector3 positions on the array
  const index3 = i * 3;
  // === Set X Y Z vectors === //
  // our array will be like this:
  // [x,y,z,x,y,z,x,y,z,x,y,z,x,y,z,x,y,z,x,y,z]
  spritePositionArray[index3 + 0] = (Math.random() - 0.5) * 30; //example (i=0, 0 * 3 + 0 = 0)
  spritePositionArray[index3 + 1] = -Math.random() * objectDistance * 45; //example (i=1, 0 * 3 + 1 = 1)
  spritePositionArray[index3 + 2] = (Math.random() - 0.9) * 20; //example (i=2, 0 * 3 + 2 = 2)
  // === Set our RGB colors === //
  spriteColorArray[i] = Math.random();
}

const spriteGeometry = new THREE.BufferGeometry();
spriteGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(spritePositionArray, 3)
);
spriteGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(spriteColorArray, 3)
);
console.log(spriteGeometry.color);

//points material
const spriteMaterial = new THREE.PointsMaterial({
  // color: params.spriteColor,
  sizeAttenuation: true,
  visible: true,
  size: 0.83103,
  map: pointsTexture,
  transparent: true,
  alphaMap: pointsTexture,
  vertexColors: true, // This makes sure our Float32Array colors are applied
  blendAlpha: THREE.AdditiveBlending,
});
//something somethin combine all and add to cameraGroup
const spriteMesh = new THREE.Points(spriteGeometry, spriteMaterial);
scene.add(spriteMesh);

// === Lights === //
const sectionLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
sectionLight1.position.set(0, objectDistance * 0, 5);
const sectionLight2 = sectionLight1.clone();
sectionLight2.position.set(0, objectDistance * 2, 5);
const ambientLight = new THREE.AmbientLight(0xce4fde, 2.5);
sceneAssets.add(ambientLight, sectionLight1, sectionLight2);
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

const clock = new THREE.Clock();
console.log(spriteGeometry);
function animate() {
  //stats
  stats.begin(); // Start measuring
  let deltaTime = clock.getDelta();
  let elapsedTime = clock.getElapsedTime();
  // === Camera Animations === //
  camera.position.y = -(scrollY / window.innerHeight) * objectDistance;
  parallaxXY.tick();

  // === Object Animations === //
  // spriteMesh.position.x = cameraGroup.position.x * -1;
  // spriteMesh.position.z = cameraGroup.position.z * -1;

  for (let i = 0; i < params.spriteCount; i++) {
    let i3 = i * 3;

    const x = spriteGeometry.attributes.position.array[i3 * 0];
    const z = spriteGeometry.attributes.position.array[i3 * 2];
    spriteGeometry.attributes.position.array[i3 + 1] +=
      Math.cos(elapsedTime - z) / 10;
    spriteGeometry.attributes.position.array[i3] +=
      Math.sin(elapsedTime + x) / 104;
  }

  spriteMesh.rotation.z += deltaTime * 0.5;

  spriteGeometry.attributes.position.needsUpdate = true;

  donut.rotation.x += 0.01;
  donut.rotation.y += 0.01;
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
  stats.end(); // Stop measuring
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
