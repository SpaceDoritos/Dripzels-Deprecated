import {
  WebGLRenderer,
  PerspectiveCamera,
  SpotLight,
  AmbientLight,
  GridHelper,
  TextureLoader,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Scene,
  SRGBColorSpace,
  Fog,
  ColorManagement,
} from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {orbit, orbit2} from "./controls.js"; // Import Controls
import { sendError } from "./index.js";
// Export Objects
export let renderer, scene, camera, ambientLight, spotLight1, spotLight2, spotLight3, spotLight4, headMesh, torsoMesh, handsMesh, legsMesh, headMaterial, torsoMaterial, handsMaterial, legsMaterial, loader = new GLTFLoader(), sceneAdded = false;

export function initScene() {

  try {
    try {
      var container = document.getElementById("section75");

      renderer = new WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      // renderer.LinearSRGBColorSpace;
      renderer.outputColorSpace = SRGBColorSpace;
      renderer.setClearColor(0x0d0d0d, 1); // Background color
      ColorManagement.enabled = true;
      scene = new Scene();
      scene.fog = new Fog(0x0d0d0d, 7, 15);
      camera = new PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );

      // Objects ⭐

      // Floor
      const gridGround = new GridHelper(100, 130, 0x212121, 0x121212);
      scene.add(gridGround);

      // Lights
      ambientLight = new AmbientLight(0xf2fcff, 2.3);

      spotLight1 = new SpotLight(0xffffff, 10);
      spotLight1.position.set(1.5, 2, 2);
      spotLight2 = new SpotLight(0xffffff, 10);
      spotLight2.position.set(-1, 2, -2);
      spotLight3 = new SpotLight(0xeb7f2d, 0);
      spotLight3.position.set(3, 4, 3);
      spotLight4 = new SpotLight(0x140078, 0);
      spotLight4.position.set(-3, 3, -2);
      scene.add(ambientLight, spotLight1, spotLight2, spotLight3, spotLight4);
    } catch (error) {
      console.error("Error: " + error);
      alert("Error: " + error);
      sendError(error)
    }

    let totalModelsToLoad = 5; // Update this if you add or remove models
    let modelsLoaded = 0;

    // Function to update the loading percentage
    function updateLoadingPercentage() {
      const threeSceneLoading = (modelsLoaded / totalModelsToLoad) * 100;
      document.getElementById(
        "loadingProgress"
      ).innerHTML = `${threeSceneLoading}%`;
      
      if (threeSceneLoading == 100) {
        sceneAdded = true;
        setTimeout(() => {
          threeCanvas.style.opacity = 1;
        }, 50);
      }
    }
    let threeCanvas = document.getElementById("section75").appendChild(renderer.domElement);
    threeCanvas.style.opacity = 0;
    threeCanvas.id = "threeJsCanvas";

    // Floor
    loader.load(
      "../models/floor.glb",
      function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        headMaterial = new MeshStandardMaterial({
          color: 0x121212,
        });
        model.traverse(function (node) {
          if (node.isMesh) {
            node.material = headMaterial;
            node.castShadow = true;
          }
        });
        scene.add(model);
        modelsLoaded++;
        updateLoadingPercentage();
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
    // Head
    loader.load(
      "../models/Blocky_Head.glb",
      function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        const textureLoader = new TextureLoader();
        const randNum = Math.floor(Math.random() * (13 - 1 + 1) + 1); // Face picker
        const texture = textureLoader.load(
          `../models/textures/faces/${randNum}.webp`,
          function (texture) {
            texture.flipY = false;
            texture.colorSpace = SRGBColorSpace;
            texture.needsUpdate = true;
          }
        );
        headMaterial = new MeshBasicMaterial({
          color: 0xffffff,
          map: texture,
        });
        model.traverse(function (node) {
          if (node.isMesh) {
            node.material = headMaterial;
            node.castShadow = true;
          }
        });
        headMesh = model;
        scene.add(headMesh);
        modelsLoaded++;
        updateLoadingPercentage();
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
    // Torso
    loader.load(
      "../models/Blocky_Torso.glb",
      function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3); // Adjust the scale as needed
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(
          `../models/textures/baseShirt.png`,
          function (texture) {
            texture.flipY = false;
            texture.colorSpace = SRGBColorSpace;
            texture.needsUpdate = true;
          }
        );
        torsoMaterial = new MeshBasicMaterial({
          color: 0xffffff,
          map: texture,
        });
        model.traverse(function (node) {
          if (node.isMesh) {
            node.material = torsoMaterial;
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        torsoMesh = model;
        scene.add(torsoMesh);
        modelsLoaded++;
        updateLoadingPercentage();
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
    // Hands
    loader.load(
      "../models/Blocky_Hands.glb",
      function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(
          "../models/textures/baseShirt.png",
          function (texture) {
            texture.flipY = false;
            texture.colorSpace = SRGBColorSpace;
            texture.needsUpdate = true;
          }
        );
        handsMaterial = new MeshBasicMaterial({
          color: 0xffffff,
          map: texture,
        });
        model.traverse(function (node) {
          if (node.isMesh) {
            node.material = handsMaterial;
            node.castShadow = true;
          }
        });
        handsMesh = model;
        scene.add(handsMesh);
        modelsLoaded++;
        updateLoadingPercentage();
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
    // Legs
    loader.load(
      "../models/Blocky_Legs.glb",
      function (gltf) {
        const model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(
          "../models/textures/basePants.png",
          function (texture) {
            texture.flipY = false;
            texture.colorSpace = SRGBColorSpace;
            texture.needsUpdate = true;
          }
        );
        legsMaterial = new MeshBasicMaterial({
          color: 0xffffff,
          map: texture,
        });
        model.traverse(function (node) {
          if (node.isMesh) {
            node.material = legsMaterial;
            node.castShadow = true;
          }
        });
        legsMesh = model;
        scene.add(legsMesh);
        modelsLoaded++;
        updateLoadingPercentage();
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    scene.add(ambientLight);

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
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    //   // Resize window on top Message close
    // document.getElementById('bannerClose').addEventListener("click", function () {
    //   camera.aspect = container.clientWidth / container.clientHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(container.clientWidth, container.clientHeight);
    // });
  } catch (error) {
    console.error(error); // Log the error to the console
    sendError(`Error while building the scene: <br> ${error}`)
    alert(error)
  }
}