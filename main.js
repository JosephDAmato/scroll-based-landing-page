import * as THREE from "three";
import { ParallaxXY } from "./ParallaxXY";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";
import { linkHandler } from "./LinkHandler";
import { handleclose } from "./LinkHandler";

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
modelLoader.load("hamburger.glb", function (gltf) {
  const hamburgerModel = gltf.scene;
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

// French Fries Place holder
const frenchFryMesh = new THREE.Mesh(
  new THREE.BoxGeometry(2, 4.5, 1.88),
  new THREE.MeshStandardMaterial({ color: "red" })
);
scene.add(frenchFryMesh);
frenchFryMesh.position.set(6, -objectDistance * 2, 0);

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
console.log(frenchFryMesh);

// === Lights === //
const ambientLight = new THREE.AmbientLight(0xce4fde, 2.5);
scene.add(ambientLight);

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
