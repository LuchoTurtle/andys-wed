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
const menu_links = [...document.getElementsByClassName("menu__link")];
new Storyline(ScrollTrigger, body, navbar,  texts, menu_links);


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
let queue = new createjs.LoadQueue(false);

// 3D
queue.loadFile('/3D/landim/merged.glb');
queue.loadFile('/3D/knot/knot.glb');
queue.loadFile('/3D/bridge/bridge.glb');
queue.loadFile('/3D/bottles/champagne.glb');
queue.loadFile('/3D/bottles/daniels.glb');
queue.loadFile('/3D/bottles/wine.glb');
queue.loadFile('/3D/bottles/henessy.glb');


// images
queue.loadFile('/3D/landim/baked2.jpg');
queue.loadFile('/3D/knot/baked.jpg');
queue.loadFile('/3D/bridge/baked2.jpg');
queue.loadFile('/3D/bottles/baked_champagne.jpg');
queue.loadFile('/3D/bottles/daniels_baked.jpg');
queue.loadFile('/3D/bottles/henessy_baked.jpg');
queue.loadFile('/3D/bottles/wine_baked.jpg');

queue.loadFile('/3D/landim/baked2.jpg');
queue.loadFile('/3D/knot/baked.jpg');
queue.loadFile('/3D/bridge/baked2.jpg');

queue.loadFile('/img/1.jpg');
queue.loadFile('/img/2.jpg');
queue.loadFile('/img/3.jpg');

// fonts
queue.loadFile('/font/Canela-Bold.woff2');
queue.loadFile('/font/Canela-Medium.woff2');
queue.loadFile('/font/Chapaza.woff');
queue.loadFile('/font/Chapaza.woff2');
queue.loadFile('/font/Founders_Grotesk_Light.woff2');
queue.loadFile('/font/Founders_Grotesk_Medium.woff2');
queue.loadFile('/font/Judson-Regular.woff');
queue.loadFile('/font/Judson-Regular.woff2');
queue.loadFile('/font/Rossanova.woff');
queue.loadFile('/font/Rossanova.woff2');


queue.on("progress", event => {
    let progressValue =  Math.floor(event.progress*100);
    console.log(progressValue)
});

queue.on("complete", event => {
    VarLet.loadFinished = true
});



/* THREE JS ----------------------------------------------------------------------------- */

/**
 * Screen width initializations
 */
// Width -------------
// Mobile S
if (screen.width <= 320) {
    VarLet.landimMesh_initial_position_z = -6;
    VarLet.bridgeMesh_initial_position_z = -31.78;
    VarLet.knotMesh_initial_position_x = -6.9;
    VarLet.champagneMesh_initial_position_x = -11.26;
    VarLet.danielsMesh_initial_position_x = -11.26;
    VarLet.wineMesh_initial_position_x = -10.26;
    VarLet.hennessyMesh_initial_position_x = -11.9;
}
// Mobile M
else if (screen.width <= 375) {
    VarLet.landimMesh_initial_position_z = -6;
    VarLet.bridgeMesh_initial_position_z = -31.78;
    VarLet.knotMesh_initial_position_x = -7;
    VarLet.champagneMesh_initial_position_x = -11.26;
    VarLet.danielsMesh_initial_position_x = -10.26;
    VarLet.wineMesh_initial_position_x = -10.26;
    VarLet.hennessyMesh_initial_position_x = -11.9;
}
// Mobile L
else if (screen.width <= 425) {
    VarLet.landimMesh_initial_position_z = -6;
    VarLet.bridgeMesh_initial_position_z = -31.78;
    VarLet.knotMesh_initial_position_x = -7;
    VarLet.champagneMesh_initial_position_x = -11.26;
    VarLet.danielsMesh_initial_position_x = -10.26;
    VarLet.wineMesh_initial_position_x = -10.26;
    VarLet.hennessyMesh_initial_position_x = -11.9;
}
// Tablet
else if (screen.width <= 768) {
    VarLet.landimMesh_initial_position_z = -3;
    VarLet.bridgeMesh_initial_position_z = -31.78;
    VarLet.knotMesh_initial_position_x = -7;
    VarLet.champagneMesh_initial_position_x = -12.26;
    VarLet.danielsMesh_initial_position_x = -11.26;
    VarLet.wineMesh_initial_position_x = -10.26;
    VarLet.hennessyMesh_initial_position_x = -11.9;
}
// Laptop
else if (screen.width <= 1024) {
    VarLet.knotMesh_initial_position_x = -8.30;
    VarLet.champagneMesh_initial_position_x = -12;
}
// Laptop L
else if (screen.width <= 1440) {
    VarLet.knotMesh_initial_position_x = -8.30;
} else if(screen.width <= 2560) {
    VarLet.knotMesh_initial_position_x = -8.30;
}

// Height -------------
if (screen.height <= 600) {
    VarLet.bridgeMesh_initial_position_y = -45;
    VarLet.knotMesh_initial_position_y = -3;
    VarLet.champagneMesh_initial_position_y = -2;
    VarLet.danielsMesh_initial_position_y = -2;
    VarLet.wineMesh_initial_position_y = -2;
    VarLet.hennessyMesh_initial_position_y = -2;
}
else if (screen.height <= 720) {
    VarLet.bridgeMesh_initial_position_y = -45;
    VarLet.knotMesh_initial_position_y = -5;
    VarLet.champagneMesh_initial_position_y = -3;
    VarLet.danielsMesh_initial_position_y = -3;
    VarLet.wineMesh_initial_position_y = -3;
    VarLet.hennessyMesh_initial_position_y = -3;
}
else if (screen.height <= 1080) {
    VarLet.bridgeMesh_initial_position_y = -45;
    VarLet.knotMesh_initial_position_y = -8;
    VarLet.champagneMesh_initial_position_y = -6.5;
    VarLet.danielsMesh_initial_position_y = -6.5;
    VarLet.wineMesh_initial_position_y = -6.5;
    VarLet.hennessyMesh_initial_position_y = -6.5;
}
else if (screen.height <= 1440) {
    VarLet.knotMesh_initial_position_y = -13;
    VarLet.champagneMesh_initial_position_y = -11.3;
    VarLet.danielsMesh_initial_position_y = -11.3;
    VarLet.wineMesh_initial_position_y = -11.3;
    VarLet.hennessyMesh_initial_position_y = -11.3;
}
else if (screen.height <= 2160) {
    VarLet.bridgeMesh_initial_position_y = -100;
    VarLet.knotMesh_initial_position_y = -20;
    VarLet.champagneMesh_initial_position_y = -15.3;
    VarLet.danielsMesh_initial_position_y = -15.3;
    VarLet.wineMesh_initial_position_y = -15.3;
    VarLet.hennessyMesh_initial_position_y = -15.3;
}
else {
    VarLet.bridgeMesh_initial_position_y = -150;
    VarLet.knotMesh_initial_position_y = -23;
    VarLet.danielsMesh_initial_position_y = -18.3;
    VarLet.wineMesh_initial_position_y = -18.3;
    VarLet.hennessyMesh_initial_position_y = -18.3;
}





/**
 * Init tools
 */
// Debug
const gui = new dat.GUI();
gui.close();

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

const bakedTextureKnot = textureLoader.load('3D/knot/baked.jpg');
bakedTextureKnot.flipY = false;
bakedTextureKnot.encoding = THREE.sRGBEncoding;

const bakedTextureChampagne = textureLoader.load('3D/bottles/baked_champagne.jpg');
bakedTextureChampagne.flipY = false;
bakedTextureChampagne.encoding = THREE.sRGBEncoding;

const bakedTextureDaniels = textureLoader.load('3D/bottles/daniels_baked.jpg');
bakedTextureDaniels.flipY = false;
bakedTextureDaniels.encoding = THREE.sRGBEncoding;

const bakedTextureWine = textureLoader.load('3D/bottles/wine_baked.jpg');
bakedTextureWine.flipY = false;
bakedTextureWine.encoding = THREE.sRGBEncoding;

const bakedTextureHennessy = textureLoader.load('3D/bottles/henessy_baked.jpg');
bakedTextureHennessy.flipY = false;
bakedTextureHennessy.encoding = THREE.sRGBEncoding;


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

// Knot
const bakedMaterialKnot = new THREE.MeshBasicMaterial({
    map: bakedTextureKnot
});

// Champagne
const bakedMaterialChampagne = new THREE.MeshBasicMaterial({
    map: bakedTextureChampagne
});

// Daniels
const bakedMaterialDaniels = new THREE.MeshBasicMaterial({
    map: bakedTextureDaniels
});

// Wine
const bakedMaterialWine = new THREE.MeshBasicMaterial({
    map: bakedTextureWine
});

// Hennessy
const bakedMaterialHennessy = new THREE.MeshBasicMaterial({
    map: bakedTextureHennessy
});


/**
 * Model
 */
let landimMesh;
let bridgeMesh;
let knotMesh;
let champagneMesh;
let danielsMesh;
let wineMesh;
let hennessyMesh;
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


        bakedMesh.position.x = 16.99;
        bakedMesh.position.z = VarLet.bridgeMesh_initial_position_z;

        bakedMesh.rotation.x = -0.45;
        bakedMesh.rotation.y = 1.18;
        bakedMesh.rotation.z = 1.18;

        scene.add(gltf.scene);
    }
);

gltfLoader.load('3D/knot/knot.glb',
    (gltf) =>  {

        knotMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'knot');
        bakedMesh.material = bakedMaterialKnot;

        knotMesh.position.x = VarLet.knotMesh_initial_position_x;
        knotMesh.position.y = VarLet.knotMesh_initial_position_y;
        knotMesh.position.z = -1.87;

        knotMesh.rotation.x = 1.05;
        knotMesh.rotation.y = -5.76;
        knotMesh.rotation.z = 0.18;

        scene.add(gltf.scene);
    }
);

gltfLoader.load('3D/bottles/champagne.glb',
    (gltf) =>  {

        champagneMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'Champagne');
        bakedMesh.material = bakedMaterialChampagne;

        champagneMesh.position.x = VarLet.champagneMesh_initial_position_x;
        champagneMesh.position.y = VarLet.champagneMesh_initial_position_y;
        champagneMesh.position.z = 1.45;

        champagneMesh.rotation.x = -0.32;
        champagneMesh.rotation.y = -1.13;
        champagneMesh.rotation.z = VarLet.champagneMesh_initial_rotation_z;

        scene.add(gltf.scene);
    }
);


gltfLoader.load('3D/bottles/daniels.glb',
    (gltf) =>  {

        danielsMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'daniels');
        bakedMesh.material = bakedMaterialDaniels;

        danielsMesh.position.x = VarLet.danielsMesh_initial_position_x;
        danielsMesh.position.y = VarLet.danielsMesh_initial_position_y;
        danielsMesh.position.z = 2.1;

        danielsMesh.rotation.x = 0.09;
        danielsMesh.rotation.y = 4.45;
        danielsMesh.rotation.z = 0.74;

        scene.add(gltf.scene);
    }
);


gltfLoader.load('3D/bottles/wine.glb',
    (gltf) =>  {

        wineMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'Wine');
        bakedMesh.material = bakedMaterialWine;

        wineMesh.position.x = VarLet.wineMesh_initial_position_x;
        wineMesh.position.y = VarLet.wineMesh_initial_position_y;
        wineMesh.position.z = 1.0;

        wineMesh.rotation.x = -5.9;
        wineMesh.rotation.y = -1.68;
        wineMesh.rotation.z = 0.04;

        scene.add(gltf.scene);
    }
);

gltfLoader.load('3D/bottles/henessy.glb',
    (gltf) =>  {

        hennessyMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'Hennessy');
        bakedMesh.material = bakedMaterialHennessy;

        hennessyMesh.position.x = VarLet.hennessyMesh_initial_position_x;
        hennessyMesh.position.y = VarLet.hennessyMesh_initial_position_y;
        hennessyMesh.position.z = 1.66;

        hennessyMesh.rotation.x = -5.9;
        hennessyMesh.rotation.y = 0.18;
        hennessyMesh.rotation.z = 0.04;

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

const tiltBridgeMesh = () => {
    if(bridgeMesh) {
        bridgeMesh.rotation.y = cursor.x * 0.05;
        bridgeMesh.rotation.z = cursor.y * 0.05;
    }
};

// Knot
const moveKnotMesh = ({x, y}) => {
    if(VarLet.knotMesh_initial_position_y !== undefined && knotMesh !== undefined) {
        const distance_from_top = y;
        knotMesh.position.y = VarLet.knotMesh_initial_position_y + (distance_from_top * 0.002);
    }
};

const tiltKnotMesh = () => {
    if(knotMesh) {
        knotMesh.rotation.y = cursor.x * 0.05;
        knotMesh.rotation.z = cursor.y * 0.05;
    }
};

// Champagne
const moveChampagneMesh = ({x, y}) => {
    if(VarLet.champagneMesh_initial_position_y !== undefined && knotMesh !== undefined) {
        const distance_from_top = y;
        champagneMesh.position.y = VarLet.champagneMesh_initial_position_y + (distance_from_top * 0.001);
        champagneMesh.rotation.z = VarLet.champagneMesh_initial_rotation_z + (distance_from_top * 0.001);
    }
};

// Daniels
const moveDanielsMesh = ({x, y}) => {
    if(VarLet.danielsMesh_initial_position_y !== undefined && knotMesh !== undefined) {
        const distance_from_top = y;
        danielsMesh.position.y = VarLet.danielsMesh_initial_position_y + (distance_from_top * 0.001);
    }
};


// Wine
const moveWineMesh = ({x, y}) => {
    if(VarLet.wineMesh_initial_position_y !== undefined && knotMesh !== undefined) {
        const distance_from_top = y;
        wineMesh.position.y = VarLet.wineMesh_initial_position_y + (distance_from_top * 0.001);
    }
};


// Hennessy
const moveHennesyMesh = ({x, y}) => {
    if(VarLet.hennessyMesh_initial_position_y !== undefined && knotMesh !== undefined) {
        const distance_from_top = y;
        hennessyMesh.position.y = VarLet.hennessyMesh_initial_position_y + (distance_from_top * 0.001);
    }
};


loco_scroll.on("scroll", ({currentElements, delta, limit, scroll, speed})=> {
    moveLandimMesh(scroll);
    moveBridgeMesh(scroll);
    moveKnotMesh(scroll);
    moveChampagneMesh(scroll);
    moveDanielsMesh(scroll);
    moveWineMesh(scroll);
    moveHennesyMesh(scroll);
});


const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Render
    renderer.render(scene, camera);

    // Animated things
    tiltLandimMesh();
    tiltBridgeMesh();
    tiltKnotMesh();

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







//https://codepen.io/mburakerman/pen/roJmaZ?editors=0010
// Loading
const buttons = document.getElementsByTagName("button");

for (const button of buttons) {
    button.addEventListener('click', () => {
        const layers = document.querySelectorAll(".bottom-layer");
        const container = document.getElementById("loader");

        for (const layer of layers) {
            layer.classList.toggle("active");
        }
        container.classList.toggle('hidden');
    });
}
