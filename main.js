import * as THREE from "three";
import { ParallaxXY } from "./ParallaxXY";
// === Global Elements and Variables
const canvas = document.querySelector(".canvasGL");
console.log(ParallaxXY);
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
camera.position.z = 5;
cameraGroup.add(camera);
/**
 *  GEOMETRY MATERIALS & MESHES
 */

// === Geometry === //
const donutGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const donutMaterial = new THREE.MeshBasicMaterial({ color: "pink" });
const donut = new THREE.Mesh(donutGeometry, donutMaterial);
donut.position.set(7.75, 0, 0);
scene.add(donut);

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

/**
 *  Animations and Ticks
 */
function animate() {
  // === Camera Animations === //
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
