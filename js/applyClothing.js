import * as THREE from "three";
import { sendError } from "./index.js";
import { legsMesh, handsMesh, torsoMesh, scene } from "./scene.js";
import { addPaddingToImg, draw2D, drawTorso } from "./imageProcess.js";
import { Man_handsMesh, Man_legsMesh, Man_torsoMesh, Woman_torsoMesh, Woman_handsMesh, Woman_legsMesh ,currentBodyType, Curvy_Woman_legsMesh } from "./renderTypes.js";


// Common variables
const shirtButton = document.getElementById("shirtButton");
const shirtUpload = document.getElementById("shirtUpload");
const pantsButton = document.getElementById("pantsButton");
const pantsUpload = document.getElementById("pantsUpload");
export let defaultShirt = true;
export let reset = false;
let processedShirt;
let currentHands = new Image(); currentHands.src = "../models/textures/baseShirt.png";
let currentLegs = new Image(); currentLegs.src = "../models/textures/basePants.png";
let currentTorso = new Image(); currentTorso.src = "../models/textures/baseShirt.png";
let uploadedShirt = new Image();

export function resetClothing(changed) {
  try{
    if (changed){
      reset = false;
      return;
    }
    reset = true;
    processedShirt = undefined;
    currentHands.src = "../models/textures/baseShirt.png";
    currentLegs.src = "../models/textures/basePants.png";
    currentTorso.src = "../models/textures/baseShirt.png";
    // uploadHandler(currentLegs, 'pants', true);
    changeClothing('hands', currentHands)
    changeClothing('torso', currentTorso)
    changeClothing('legs', currentLegs)
    defaultShirt = true;
    document.getElementById('image2D').src = "../images/2DPreview.png"
  } catch (error) {sendError(error);}
}

export function addSkin(img, callback) {
  if(reset !== true){
  const skinImage = new Image();
  skinImage.src = "../models/textures/skin.webp";
  skinImage.addEventListener("load", () => {
    const faceImage = new Image();
    faceImage.src = "../models/textures/skin2.webp";
    faceImage.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = skinImage.width;
      canvas.height = skinImage.height;
      ctx.drawImage(skinImage, 0, 0);
      ctx.drawImage(img, 0, 0);
      ctx.drawImage(faceImage, 0, 0);
      const overlaidImage = new Image();
      overlaidImage.src = canvas.toDataURL();

      callback(overlaidImage);
    });
  });}
}

export function uploadHandler(file, type) {
  try {
    clothingChecks(file, (passed) => {
      document.getElementById('clothingLoading').style.display = 'block';
      document.getElementById('threeJsCanvas').style.filter = 'brightness(80%)';

      let rawClothing = passed;

      addSkin(passed, (clothingImg) => {
          if (type == "shirt") {
            currentHands = clothingImg;
            uploadedShirt = rawClothing;
            if (reset == false) {
              defaultShirt = false;
            }
            shirtUpload.value = null;
            draw2D("shirt", rawClothing);
          } 
          else if (type == "pants") {
            currentLegs = clothingImg;
            pantsUpload.value = null;
            if (defaultShirt == false) {
                draw2D("shirt", currentHands);
                draw2D("pants", rawClothing);
            } else {
              draw2D("pants", rawClothing);
            }
          }

          Promise.all([
            drawTorso(currentLegs, uploadedShirt, defaultShirt, (result) => {
              currentTorso = result;
              changeClothing("legs", currentLegs);
              changeClothing("torso", currentTorso);
              changeClothing("hands", currentHands);
              document.getElementById('clothingLoading').style.display = 'none';
              document.getElementById('threeJsCanvas').style.filter = 'brightness(100%)';
            }),
          ]);
        
      })

    });
  } catch (error) {
    sendError(error);
  }
}




function clothingChecks(file, callback) {
  try {
  if (!file.name){return;}
  if (file && !file.type.match(/image\/(png|jpe?g)/)) {
    sendError("Invalid file type! \n Only PNG, JPEG, and JPG are allowed!");
    return;
  } else {
    // Wait for the image to load
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const clothingImg = new Image();
      clothingImg.addEventListener("load", () => {
        // Image size check
        if (clothingImg.width != 585 || clothingImg.height != 559) {
          sendError("The image must be 585x559 pixels!");
          return;
        }
        // Passed 🟢
        else {
          callback(clothingImg);
        }
      });
      clothingImg.src = event.target.result;
    });
    reader.readAsDataURL(file);
  }
} catch (error) {sendError(error);}
}

function changeClothing(type, clothing) {
  try{
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(clothing.src, function (texture) {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
  });
  switch (type) {
    case "hands":
      handsMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.map = texture;
        }
      });
      if(Man_handsMesh){
      Man_handsMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.map = texture;
        }
      })}
      if(Woman_handsMesh){
      Woman_handsMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.map = texture;
        }
      })}
      break;
    case "legs":
      legsMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.map = texture;
        }
      });
      if(Man_legsMesh){
      Man_legsMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.map = texture;
        }
      })}
      if(Woman_legsMesh){
      Woman_legsMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.map = texture;
        }
      })}
      if(Curvy_Woman_legsMesh){
      Woman_legsMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.map = texture;
        }
      })}
      break;
    case "torso":
      torsoMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.map = texture;
        }
      });
      if(Man_torsoMesh){
      Man_torsoMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.map = texture;
        }
      })}
      if(Woman_torsoMesh){
      Woman_torsoMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.map = texture;
        }
      })}
      break;
  }
} catch (error) {sendError(error);}
}