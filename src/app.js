import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";

import GalleryItem from "./anims/gallery_item";
import Storyline from "./anims/storyline";
import Sidebar from "./anims/sidebar";
import '../static/scss/main.scss'
import './locomotive_base.css'
import * as THREE from "three";
import * as dat from "dat.gui";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import createjs from 'preload-js'
import {VarConst, VarLet} from "./js/vars";

gsap.registerPlugin(ScrollTrigger);

const scroller_el = document.querySelector('[data-scroll-container]')
const loco_scroll = new LocomotiveScroll({
    el: scroller_el,
    multiplier: 0.45,
    lerp: 0.03,
    smooth: true,
    smartphone: {
        smooth: true
    },
    tablet: {
        smooth: true
    }
});


/* This is configuration to proxy the locomotive scroll behaviour and map it to GSAP. This is because Locomotive hijacks the scrolling behavior ---------------------- */
window.addEventListener('resize', () => { loco_scroll.update() });

loco_scroll.on("scroll", ({currentElements, delta, limit, scroll, speed})=> {
    ScrollTrigger.update()
});

// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy(scroller_el, {
    scrollTop(value) {
        return arguments.length ? loco_scroll.scrollTo(value, 0, 0) :    loco_scroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: scroller_el.style.transform ? "transform" : "fixed"
});

ScrollTrigger.defaults({
    scroller: scroller_el
});


/* ------------- ANIMATIONS START ---------- */


/* Storyline effects -------------*/
const body = document.body;
const navbar = document.body.getElementsByClassName("navbar");
const texts = [...document.getElementsByClassName("story__section")];
new Storyline(ScrollTrigger, body, navbar,  texts);


/* Gallery effects ---------------*/
const gallery = document.querySelector('.gallery');
const galleryItemElems = [...gallery.querySelectorAll('.gallery__item')];
galleryItemElems.forEach(el => {
    new GalleryItem(el)
});

/* Sidebar effects --------------*/
const progress_bar = document.querySelector('.progress-bar')
const sub_menus = document.getElementsByClassName("menu-container_submenu");
new Sidebar(ScrollTrigger, loco_scroll, progress_bar, sub_menus);


/* ----------- ANIMATIONS end  -------- */

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
ScrollTrigger.addEventListener("refresh", () => loco_scroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();





/* PRE-LOAD FILES ----------------------------------------------------------------------- */
// Preload
//let queue = new createjs.LoadQueue(false);

// 3D
//queue.loadFile('/3D/landim.glb');
//queue.on("progress", event => {console.log(Math.floor(event.progress*100))})


/* THREE JS ----------------------------------------------------------------------------- */

/**
 * Screen width initializations
 */
// Mobile L
if (screen.width < 425) {
    VarLet.landimMesh_initial_position_z = -6;
    VarLet.bridgeMesh_initial_position_z = -31.78;
}

// Tablet
if (screen.width < 768) {
    VarLet.landimMesh_initial_position_z = -3;
    VarLet.bridgeMesh_initial_position_z = -31.78;
}

console.log(screen.height)
// Height
if (screen.height < 1080) {
    VarLet.bridgeMesh_initial_position_y = -40;
}

// Height
if (screen.height < 720) {
    VarLet.bridgeMesh_initial_position_y = -38;
}

/**
 * Init tools
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Textures
 */
const bakedTextureLandim = textureLoader.load('3D/landim/baked2.jpg');
bakedTextureLandim.flipY = false;
bakedTextureLandim.encoding = THREE.sRGBEncoding;

const bakedTextureBridge = textureLoader.load('3D/bridge/baked2.jpg');
bakedTextureBridge.flipY = false;
bakedTextureBridge.encoding = THREE.sRGBEncoding;

/**
 * Materials
 */
// Landim
const bakedMaterialLandim = new THREE.MeshBasicMaterial({
    map: bakedTextureLandim
});

const poleLightMaterialLandim = new THREE.MeshBasicMaterial({color: new THREE.Color("rgb(255, 125, 69)")});

// Bridge
const bakedMaterialBridge = new THREE.MeshBasicMaterial({
    map: bakedTextureBridge
});

/**
 * Model
 */
let landimMesh;
let bridgeMesh;
gltfLoader.load('3D/landim/merged.glb',
    (gltf) =>  {

        landimMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'merged');
        bakedMesh.material = bakedMaterialLandim;

        const poleLightAMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleA');
        const poleLightBMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleB');
        const poleLightCMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleC');
        const poleLightDMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleD');

        poleLightAMesh.material = poleLightMaterialLandim;
        poleLightBMesh.material = poleLightMaterialLandim;
        poleLightCMesh.material = poleLightMaterialLandim;
        poleLightDMesh.material = poleLightMaterialLandim;

        scene.add(gltf.scene);
    }
);

gltfLoader.load('3D/bridge/bridge.glb',
    (gltf) =>  {

        bridgeMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'bridge');
        bakedMesh.material = bakedMaterialBridge;


        gui.add(bridgeMesh.position, "x").min(-50).max(50).step(0.01).setValue(16.99)
        //gui.add(bridgeMesh.position, "y").min(-50).max(50).step(0.01).setValue(12.66)
        gui.add(bridgeMesh.position, "z").min(-50).max(50).step(0.01).setValue(VarLet.bridgeMesh_initial_position_z)

        gui.add(bridgeMesh.rotation, "x").min(-Math.PI * 2).max(Math.PI * 2).step(0.01).setValue(-0.45)
        gui.add(bridgeMesh.rotation, "y").min(-Math.PI * 2).max(Math.PI * 2).step(0.01).setValue(1.18)
        gui.add(bridgeMesh.rotation, "z").min(-Math.PI * 2).max(Math.PI * 2).step(0.01).setValue(1.18)

        /*
        bakedMesh.position.x = 16.99;
        bakedMesh.position.z = -17.69;

        bakedMesh.rotation.x = -0.45;
        bakedMesh.rotation.y = 1.18;
        bakedMesh.rotation.z = 1.18;

         */







        scene.add(gltf.scene);
    }
);



// Helper
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.rotation.y = -Math.PI / 4;
camera.position.set(-12.4, 4.1, 2.3);
scene.add(camera);



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Models animations
 */

// Landim
const moveLandimMesh = ({x, y}) => {
    if(VarLet.landimMesh_initial_position_z !== undefined && landimMesh !== undefined) {
        const distance_from_top = y;
        landimMesh.position.z = VarLet.landimMesh_initial_position_z + (distance_from_top * 0.02);
    }
};

const tiltLandimMesh = () => {
    if(landimMesh) {
        landimMesh.rotation.y = cursor.x * 0.05;
        landimMesh.rotation.z = cursor.y * 0.05;
    }
};


// Bridge
const moveBridgeMesh = ({x, y}) => {
    if(VarLet.bridgeMesh_initial_position_y !== undefined && bridgeMesh !== undefined) {
        const distance_from_top = y;
        bridgeMesh.position.y = VarLet.bridgeMesh_initial_position_y + (distance_from_top * 0.02);
    }
};

loco_scroll.on("scroll", ({currentElements, delta, limit, scroll, speed})=> {
    moveLandimMesh(scroll);
    moveBridgeMesh(scroll);
});


const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Render
    renderer.render(scene, camera);

    // Animated things
    tiltLandimMesh();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
};

tick();


/** Update cursor positions **/
document.addEventListener("mousemove", e => {
    VarConst.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    VarConst.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

// Cursor
const cursor = {
    x: 0, y: 0
};
window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
});
