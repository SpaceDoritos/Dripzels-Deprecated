import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {orbit, orbit2} from "./controls.js"; // Import Controls

// Export Objects
export let renderer;
export let scene;
export let camera;
export let ambientLight;
export let spotLight1;
export let spotLight2;
export let spotLight3;
export let spotLight4;
export let torsoMesh;
export let shirtMesh;
export let pantsMesh;


export function initScene() {

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.antialias = true;
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Controls
scene = new THREE.Scene();

renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// Objects ⭐
const loader = new GLTFLoader();

// Floor
const gridGround = new THREE.GridHelper(100, 130, 0x7a7a7a, 0x454545);
scene.fog = new THREE.Fog(0x323232, 7, 15);
scene.add(gridGround);

// Lights
ambientLight = new THREE.AmbientLight(0xf5feff, 1);

spotLight1 = new THREE.SpotLight(0xffffff, 0);
spotLight1.position.set(1.5, 2, 2);
spotLight2 = new THREE.SpotLight(0xffffff, 0);
spotLight2.position.set(-1, 2, -2);

spotLight3 = new THREE.SpotLight(0xeb7f2d, 0);
spotLight3.position.set(3, 4, 3);
spotLight4 = new THREE.SpotLight(0x140078, 0);
spotLight4.position.set(-3, 3, -2);

scene.add(ambientLight, spotLight1, spotLight2, spotLight3, spotLight4);

THREE.ColorManagement.enabled = true;

//   Character
let torsoMaterial = "";
let shirtMaterial = "";
let pantsMaterial = "";
// Torso
loader.load(
  "../models/torso.glb",
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3); // Adjust the scale as needed
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      "../models/textures/baseShirt.png",
      function (texture) {
        texture.flipY = false;
        texture.needsUpdate = true;
      }
    );
    torsoMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
    });
    model.traverse(function (node) {
      if (node.isMesh) {
        node.material = torsoMaterial;
        node.castShadow = true;
      }
    });
    torsoMesh = model;
    scene.add(torsoMesh);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
// Shirt
loader.load(
  "../models/Shirt.glb",
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3); // Adjust the scale as needed
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      "../models/textures/baseShirt.png",
      function (texture) {
        texture.flipY = false;
        texture.needsUpdate = true;
      }
    );
    shirtMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
    });
    model.traverse(function (node) {
      if (node.isMesh) {
        node.material = shirtMaterial;
        node.castShadow = true;
      }
    });
    shirtMesh = model;
    scene.add(shirtMesh);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
// Pants
loader.load(
  "../models/Pants.glb",
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3); // Adjust the scale as needed
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      "../models/textures/basePants.png",
      function (texture) {
        texture.flipY = false;
        texture.needsUpdate = true;
      }
    );
    pantsMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
    });
    model.traverse(function (node) {
      if (node.isMesh) {
        node.material = pantsMaterial;
        node.castShadow = true;
      }
    });
    pantsMesh = model;
    scene.add(pantsMesh);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

scene.add(ambientLight);
renderer.setClearColor(0x323232); // Background color

function animate() {
  // Animate
  const target = orbit.target;
  orbit.update();
  orbit2.target.set(target.x, target.y, target.z);
  orbit2.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
window.addEventListener("resize", function () {
  // Resize window
  camera.aspect = this.window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
}