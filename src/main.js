import "remixicon/fonts/remixicon.css";
import "./style.css";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import LocomotiveScroll from "locomotive-scroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";



const locomotiveScroll = new LocomotiveScroll();
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase)
gsap.registerPlugin(SplitText);

// ---------------- setting up scene ------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#hero"),
  alpha: true,
});
renderer.setClearColor(0x000000, 0); // Fully transparent
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
const textureLoader = new THREE.TextureLoader();


// --------- Geometries --------------------
let texture1 = textureLoader.load("/final.png");
texture1.colorSpace = THREE.SRGBColorSpace;
texture1.minFilter = THREE.LinearMipMapLinearFilter; // high-quality when texture is small
texture1.magFilter = THREE.LinearFilter; // high-quality when texture is large
texture1.anisotropy = renderer.capabilities.getMaxAnisotropy(); // extra sharpness at angles
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.6;
renderer.outputEncoding = THREE.sRGBEncoding;

const geometry = new THREE.CylinderGeometry(1, 1, 0.5, 40, 1, true);
const material = new THREE.MeshBasicMaterial({
  map: texture1,
  side: THREE.DoubleSide,
  transparent: true,
});

const cylinder = new THREE.Mesh(geometry, material);
cylinder.position.y = -0.15;
cylinder.position.x = 0;

// Scale cylinder for different screen sizes
let isMobile = window.innerWidth<768;

if(isMobile){
  cylinder.scale.set(0.55, 0.8, 0.55);
  camera.position.z = 1.9;
  cylinder.position.y = 0.17;

  // if(isMobile){
  //   document.querySelectorAll('[data-scroll-speed]').forEach(element => {
  //     element.setAttribute('data-scroll-speed', '0');
  //   });
  // }
}


scene.add(cylinder);

// Update scale on window resize

camera.position.z = 1.9;

// ----------------- Geometry Manupulaton ---------------------
let rotatingSpeed = 0.001;


// --------------- Window Resize --------------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // const scale = window.innerWidth <= 768 ? window.innerWidth / 700 : Math.min(1, window.innerWidth / 1200);
  // const newScale = Math.min(1, window.innerWidth / 1200);
  // cylinder.scale.set(newScale, newScale, newScale);
  // finalComposer.setSize(window.innerWidth, window.innerHeight);
});

// ------------------------ DOM MANUPULATION ----------------------

// ----- MOUSE FOLLOWER ---------
let mouseFollower = document.querySelector("#mouse-follower");
let isMagneticElement = false;

window.addEventListener("mousemove", (event) => {
  let xpos = event.screenX;
  let ypos = event.clientY;

  let normalizedX = ((xpos / window.innerWidth) * 0.1) - 0.05;
  let normalizedY = ((ypos / window.innerHeight) * 0.1) - 0.05;

  // hero element manupulation
  gsap.to(cylinder.rotation, {
    z: normalizedY,
    x: normalizedX,
    duration: 1,
    ease: CustomEase.create("custom", "0.22, 1, 0.36, 1"),
  })


  // if (!isMagneticElement) {
  //   gsap.to(mouseFollower, {
  //     left: xpos,
  //     top: ypos,
  //     duration: 0.35,
  //     ease: CustomEase.create("custom", "0.22, 1, 0.36, 1"),
  //   })
  // }

})

// let specialTexts = document.querySelectorAll(".special-text");
// specialTexts.forEach((specialText, index) => {
//   specialText.addEventListener("mouseenter", (e) => {
//     gsap.to(mouseFollower, {
//       scale: 8,
//       duration: 0.4,
//       ease: CustomEase.create("custom", "0.22, 1, 0.36, 1"),
//     })
//   })

//   specialText.addEventListener("mouseleave", () => {
//     gsap.to(mouseFollower, {
//       scale: 1,
//       duration: 0.4,
//       ease: CustomEase.create("custom", "0.22, 1, 0.36, 1"),
//     })
//   })
// })

// ------- MAGNET EFFECT -------
// let magnetEffects = document.querySelectorAll(".magnet-effect");

// magnetEffects.forEach(magnetEffect => {
//   magnetEffect.addEventListener("mouseenter", (event) => {
//     event.stopPropagation();
//     isMagneticElement = true;
//     let bounds = magnetEffect.querySelector(".magnetic-item").getBoundingClientRect();
//     let magnetTop = bounds.top;
//     let magnetLeft = bounds.left;
//     let magnetWidth = bounds.width;
//     let magnetHeight = bounds.height;
//     let magnetCenterX = magnetLeft + (magnetWidth / 2);
//     let magnetCenterY = magnetTop + (magnetHeight / 2);

//     if (isMagneticElement) {
//       gsap.to(mouseFollower, {
//         scale: 3.15,
//         top: magnetCenterY + "px",
//         left: magnetCenterX + "px",
//         duration: 0.4,
//         // delay: 0.2,
//         ease: CustomEase.create("custom", "0.16, 1, 0.3, 1"),
//       })
//     }
//   })


//   magnetEffect.addEventListener("mousemove", (event) => {
//     event.stopPropagation();
//     // isMagneticElement = true;
//     let bounds = magnetEffect.getBoundingClientRect();
//     let magnetTop = bounds.top;
//     let magnetLeft = bounds.left;
//     let magnetWidth = bounds.width;
//     let magnetHeight = bounds.height;
//     let magnetCenterX = magnetLeft + (magnetWidth / 2);
//     let magnetCenterY = magnetTop + (magnetHeight / 2);
//     let xpos = ((event.offsetX / magnetWidth) - 0.5) * 10;
//     let ypos = ((event.offsetY / magnetHeight) - 0.5) * 10;
//     console.log(xpos, ypos);
//     gsap.to(magnetEffect.querySelector(".magnetic-item"), {
//       x: xpos + "px",
//       y: ypos + "px",
//       duration: 0.4,
//       ease: CustomEase.create("custom", "0.16, 1, 0.3, 1"),
//       // transform: `translate(${xpos}%, ${ypos}%)`
//     })
//   })

//   magnetEffect.addEventListener("mouseleave", (event) => {
//     isMagneticElement = false;
//     if (!isMagneticElement) {
//       gsap.to(mouseFollower, {
//         scale: 1,
//         top: event.clientY,
//         left: event.screenX,
//         duration: 0.4,
//         ease: CustomEase.create("custom", "0.16, 1, 0.3, 1"),
//       })
//       gsap.to(magnetEffect.querySelector(".magnetic-item"), {
//         x: 0,
//         y: 0,
//         duration: 0.4,
//         ease: "elastic.out(2,0.3)",
//       })
//     }
//   })
// })


// ---- PROJECTS ----------

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#work-container",
    start: 'top bottom',
    end: 'bottom 10%',
    scrub: 0.2,
  }
});

tl.to(cylinder.position, {
  y: 0.07,
  // z: 0,
});

tl.to(camera.position, {
  y: 0.15,
}, "b");





// let projectHeadings = document.querySelectorAll(".project-headings h3");

// projectHeadings.forEach((heading, index) => {
//   heading.addEventListener("mouseenter", (event) => {
//     gsap.to(heading, {
//       paddingLeft: "1rem",
//       duration: 0.2,
//     });
//   });

//   heading.addEventListener("mouseleave", (event) => {
//     gsap.to(heading, {
//       paddingLeft: "0rem",
//       duration: 0.2,
//     });
//   })

// });


// ----------------------- Special Button -------------------
// let specialButtons = document.querySelectorAll(".special-button");
// const highlighters = document.querySelectorAll(".highlighter");
// highlighters.forEach(highlighter => {
//   const text = highlighter.textContent;
//   highlighter.innerHTML = text.split('').map(char => 
//     `<span class="char">${char===" "?'&nbsp': char}</span>`
//   ).join('');
// });

// specialButtons.forEach(specialButton=>{
//   specialButton.addEventListener("mouseenter", ()=>{
//     const highlighter = specialButton.querySelector(".highlighter");

//     gsap.to(specialButton, {
//       background: "black",
//       duration: 0.5,
//       ease: CustomEase.create("custom", "0.83, 0, 0.17, 1"),
//     })

//     gsap.to(highlighter, {
//       y: "0%",
//       duration: 0.6,
//       ease: CustomEase.create("custom", "0.83, 0, 0.17, 1")
//     })
//     gsap.from(highlighter.querySelectorAll("span"), {
//       y: '100%',
//       opacity: 0,
//       duration: 0.5,
//       stagger: 0.02,
//       ease: CustomEase.create("custom", "0.83, 0, 0.17, 1")
//     })

//   })
//   specialButton.addEventListener("mouseleave", ()=>{
//     const hightligher = specialButton.querySelector(".highlighter");
//     gsap.to(specialButton, {
//       background: "white",
//       duration: 0.5,
//       ease: CustomEase.create("custom", "0.83, 0, 0.17, 1"),
//     })
//     gsap.to(hightligher, {
//       y: "103%",
//       duration: 0.6,
//       ease: CustomEase.create("custom", "0.83, 0, 0.17, 1")
//     })
//   })
// })


function animate() {
  cylinder.rotation.y += rotatingSpeed;
  // controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
