import { gsap as vanilla_gsap } from "gsap";
import { ScrollTrigger as vanilla_ScrollTrigger } from "gsap/ScrollTrigger";

import * as THREE from "three";
import * as dat from "dat.gui";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import createjs from 'preload-js'

import {VarConst, VarLet, screenMeshPositionInitialization} from "./vars";
import ScrollTriggerWithLoco from './js/gsap'

import '../static/scss/main.scss'
import './locomotive_base.css'

import GalleryItem from "./gsap_anims/gallery_item";
import Storyline from "./gsap_anims/storyline";
import Sidebar from "./gsap_anims/sidebar";
import Cursor from './js/cursor';


/** ---------------------- GSAP / SCROLLTRIGGER / LOCOSCROLL SETUP ----------------------------- **/

// Modified gsap, ScrollTrigger and locomotive scroll object that are compatible with each other.
const {gsap, loco_scroll, scroll_trigger} = new ScrollTriggerWithLoco(vanilla_gsap, vanilla_ScrollTrigger);


/** ---------------------------------- VAR INITIALIZATIONS ------------------------------------- **/
screenMeshPositionInitialization();


/** ------------------------------ ADDING ANIMATIONS -------------------------------------------- **/
const body = document.body;
const navbar = document.body.getElementsByClassName("navbar");
const texts = [...document.getElementsByClassName("story__section")];
const menu_links = [...document.getElementsByClassName("menu__link")];
new Storyline(scroll_trigger, body, navbar,  texts, menu_links);


const gallery = document.querySelector('.gallery');
const galleryItemElems = [...gallery.querySelectorAll('.gallery__item')];
galleryItemElems.forEach(el => {
    new GalleryItem(el)
});


const progress_bar = document.querySelector('.progress-bar');
const sub_menus = document.getElementsByClassName("menu-container_submenu");
new Sidebar(scroll_trigger, loco_scroll, progress_bar, sub_menus);



/** ---------------------- CURSOR SETUP ----------------------------- **/

const custom_cursor = new Cursor();
const linkItems = document.querySelectorAll("a");
linkItems.forEach(item => {
    item.addEventListener("mouseenter", () => custom_cursor.cursorToClickable());
    item.addEventListener("mouseleave", () => custom_cursor.cursorToNormal());
});



/** ---------------------- PRE-LOAD FILES ----------------------------- **/
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
queue.loadFile('/3D/envelope/envelope.glb');


// images
queue.loadFile('/3D/landim/baked2.jpg');
queue.loadFile('/3D/knot/baked.jpg');
queue.loadFile('/3D/bridge/baked2.jpg');
queue.loadFile('/3D/bottles/baked_champagne.jpg');
queue.loadFile('/3D/bottles/daniels_baked.jpg');
queue.loadFile('/3D/bottles/henessy_baked.jpg');
queue.loadFile('/3D/bottles/wine_baked.jpg');
queue.loadFile('/3D/envelope/baked.jpg');

queue.loadFile('/img/1.webp');
queue.loadFile('/img/2.webp');
queue.loadFile('/img/3.webp');

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
    const progressValue =  event.progress;
    const progressValue100 =  Math.floor(event.progress*100);
    VarConst.loadingLine.style.transform = `scale(${progressValue})`;

    if(progressValue100 < 10) {
        VarConst.loadValue.innerText = `00${ progressValue100}`
    } else if(progressValue100 < 100) {
        VarConst.loadValue.innerText = `0${ progressValue100}`
    } else {
        VarConst.loadValue.innerText = `${ progressValue100}`
    }
});

queue.on("complete", event => {
    VarLet.loadCompleted = true;
    gsap.to(VarConst.loadingText, { duration: .5, opacity: 0 });
    gsap.to(VarConst.doneText, { duration: .5, opacity: 1 });
    gsap.to(VarConst.loaderContainer, { duration: 1, yPercent: -200, ease: "power2.in", delay: 1.8 });
});



/** ---------------------------------- THREE.JS ------------------------------------- **/



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

const bakedTextureEnvelope = textureLoader.load('3D/envelope/baked.jpg');
bakedTextureEnvelope.flipY = false;
bakedTextureEnvelope.encoding = THREE.sRGBEncoding;



/**
 * Materials
 */
// Landim
VarLet.bakedMaterialLandim = new THREE.MeshBasicMaterial({
    map: bakedTextureLandim
});

VarLet.poleLightMaterialLandim = new THREE.MeshBasicMaterial({color: new THREE.Color("rgb(255, 125, 69)")});

// Bridge
VarLet.bakedMaterialBridge = new THREE.MeshBasicMaterial({
    map: bakedTextureBridge
});

// Knot
VarLet.bakedMaterialKnot = new THREE.MeshBasicMaterial({
    map: bakedTextureKnot
});

// Champagne
VarLet.bakedMaterialChampagne = new THREE.MeshBasicMaterial({
    map: bakedTextureChampagne
});

// Daniels
VarLet.bakedMaterialDaniels = new THREE.MeshBasicMaterial({
    map: bakedTextureDaniels
});

// Wine
VarLet.bakedMaterialWine = new THREE.MeshBasicMaterial({
    map: bakedTextureWine
});

// Hennessy
VarLet.bakedMaterialHennessy = new THREE.MeshBasicMaterial({
    map: bakedTextureHennessy
});

// Envelope
VarLet.bakedMaterialEnvelope = new THREE.MeshBasicMaterial({
    map: bakedTextureEnvelope
});


/**
 * Model
 */
gltfLoader.load('3D/landim/merged.glb',
    (gltf) =>  {

        VarLet.landimMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'merged');
        bakedMesh.material = VarLet.bakedMaterialLandim;

        const poleLightAMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleA');
        const poleLightBMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleB');
        const poleLightCMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleC');
        const poleLightDMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleD');

        poleLightAMesh.material = VarLet.poleLightMaterialLandim;
        poleLightBMesh.material = VarLet.poleLightMaterialLandim;
        poleLightCMesh.material = VarLet.poleLightMaterialLandim;
        poleLightDMesh.material = VarLet.poleLightMaterialLandim;

        scene.add(VarLet.landimMesh);
    }
);

gltfLoader.load('3D/bridge/bridge.glb',
    (gltf) =>  {

        VarLet.bridgeMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'bridge');
        bakedMesh.material = VarLet.bakedMaterialBridge;


        bakedMesh.position.x = 16.99;
        bakedMesh.position.z = VarConst.bridgeMesh_initial_position_z;

        bakedMesh.rotation.x = -0.45;
        bakedMesh.rotation.y = 1.18;
        bakedMesh.rotation.z = 1.18;

        scene.add(VarLet.bridgeMesh);
    }
);

gltfLoader.load('3D/knot/knot.glb',
    (gltf) =>  {

        VarLet.knotMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'knot');
        bakedMesh.material = VarLet.bakedMaterialKnot;

        VarLet.knotMesh.position.x = VarConst.knotMesh_initial_position_x;
        VarLet.knotMesh.position.y = VarConst.knotMesh_initial_position_y;
        VarLet.knotMesh.position.z = -1.87;

        VarLet.knotMesh.rotation.x = 1.05;
        VarLet.knotMesh.rotation.y = -5.76;
        VarLet.knotMesh.rotation.z = 0.18;

        scene.add(VarLet.knotMesh);
    }
);

gltfLoader.load('3D/bottles/champagne.glb',
    (gltf) =>  {

        VarLet.champagneMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'Champagne');
        bakedMesh.material = VarLet.bakedMaterialChampagne;

        VarLet.champagneMesh.position.x = VarConst.champagneMesh_initial_position_x;
        VarLet.champagneMesh.position.y = VarConst.champagneMesh_initial_position_y;
        VarLet.champagneMesh.position.z = 1.45;

        VarLet.champagneMesh.rotation.x = -0.32;
        VarLet.champagneMesh.rotation.y = -1.13;
        VarLet.champagneMesh.rotation.z = VarConst.champagneMesh_initial_rotation_z;

        scene.add(VarLet.champagneMesh);
    }
);


gltfLoader.load('3D/bottles/daniels.glb',
    (gltf) =>  {

        VarLet.danielsMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'daniels');
        bakedMesh.material = VarLet.bakedMaterialDaniels;

        VarLet.danielsMesh.position.x = VarConst.danielsMesh_initial_position_x;
        VarLet.danielsMesh.position.y = VarConst.danielsMesh_initial_position_y;
        VarLet.danielsMesh.position.z = 2.1;

        VarLet.danielsMesh.rotation.x = 0.09;
        VarLet.danielsMesh.rotation.y = 4.45;
        VarLet.danielsMesh.rotation.z = 0.74;

        scene.add(VarLet.danielsMesh);
    }
);


gltfLoader.load('3D/bottles/wine.glb',
    (gltf) =>  {

        VarLet.wineMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'Wine');
        bakedMesh.material = VarLet.bakedMaterialWine;

        VarLet.wineMesh.position.x = VarConst.wineMesh_initial_position_x;
        VarLet.wineMesh.position.y = VarConst.wineMesh_initial_position_y;
        VarLet.wineMesh.position.z = 1.0;

        VarLet.wineMesh.rotation.x = -5.9;
        VarLet.wineMesh.rotation.y = -1.68;
        VarLet.wineMesh.rotation.z = 0.04;

        scene.add(VarLet.wineMesh);
    }
);

gltfLoader.load('3D/bottles/henessy.glb',
    (gltf) =>  {

        VarLet.hennessyMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'Hennessy');
        bakedMesh.material = VarLet.bakedMaterialHennessy;

        VarLet.hennessyMesh.position.x = VarConst.hennessyMesh_initial_position_x;
        VarLet.hennessyMesh.position.y = VarConst.hennessyMesh_initial_position_y;
        VarLet.hennessyMesh.position.z = 1.66;

        VarLet.hennessyMesh.rotation.x = -5.9;
        VarLet.hennessyMesh.rotation.y = 0.18;
        VarLet.hennessyMesh.rotation.z = 0.04;

        scene.add(VarLet.hennessyMesh);
    }
);

gltfLoader.load('3D/envelope/envelope.glb',
    (gltf) =>  {

        VarLet.envelopeMesh = gltf.scene;

        // Adding baked textures and emission lights to model
        VarLet.envelopeBakedMat = gltf.scene.children.find(obj => obj.name === 'envelope');
        VarLet.envelopeBakedMat.material = VarLet.bakedMaterialEnvelope;
        VarLet.envelopeBakedMat.material.transparent = true;
        VarLet.envelopeBakedMat.material.opacity = 0;

        VarLet.envelopeMesh.position.x = VarConst.envelopeMesh_initial_position_x;
        VarLet.envelopeMesh.position.y = VarConst.envelopeMesh_initial_position_y;
        VarLet.envelopeMesh.position.z = VarConst.envelopeMesh_initial_position_z;

        VarLet.envelopeMesh.rotation.x = -3.449;
        VarLet.envelopeMesh.rotation.y = 2.272;
        VarLet.envelopeMesh.rotation.z = 3.4;

        // Opacity animation
        if(scroll_trigger) {
            scroll_trigger.create({
                trigger: document.getElementsByClassName("rsvp")[0],
                scrub: true,
                start: "top 70%",
                onEnter: () => gsap.to(VarLet.envelopeBakedMat.material, { opacity: 1, ease: "power1.in", immediateRender: false },),
                onLeave: () => gsap.to(VarLet.envelopeBakedMat.material, { opacity: 0, ease: "power4.out", immediateRender: false }),
                onLeaveBack: () => gsap.to(VarLet.envelopeBakedMat.material, { opacity: 0, ease: "power4.out", immediateRender: false }),
                onEnterBack: () => gsap.to(VarLet.envelopeBakedMat.material, { opacity: 1, ease: "power1.in", immediateRender: false })
            });
        }

        scene.add(VarLet.envelopeMesh);
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
    if(VarConst.landimMesh_initial_position_z !== undefined && VarLet.landimMesh) {
        const distance_from_top = y;
        VarLet.landimMesh.position.z = VarConst.landimMesh_initial_position_z + (distance_from_top * 0.02);
    }
};

const tiltLandimMesh = () => {
    if(VarLet.landimMesh) {
        VarLet.landimMesh.rotation.y = VarConst.mouse.x * 0.01;
        VarLet.landimMesh.rotation.z = VarConst.mouse.y * 0.01;
    }
};

// Where are the tests...? ;-)

// Bridge
const moveBridgeMesh = ({x, y}) => {
    if(VarConst.bridgeMesh_initial_position_y !== undefined && VarLet.bridgeMesh) {
        const distance_from_top = y;
        VarLet.bridgeMesh.position.y = VarConst.bridgeMesh_initial_position_y + (distance_from_top * 0.02);
    }
};

const tiltBridgeMesh = () => {
    if(VarLet.bridgeMesh) {
        VarLet.bridgeMesh.rotation.y = VarConst.mouse.x * 0.01;
        VarLet.bridgeMesh.rotation.z = VarConst.mouse.y * 0.01;
    }
};

// Knot
const moveKnotMesh = ({x, y}) => {
    if(VarConst.knotMesh_initial_position_y !== undefined && VarLet.knotMesh) {
        const distance_from_top = y;
        VarLet.knotMesh.position.y = VarConst.knotMesh_initial_position_y + (distance_from_top * 0.002);
    }
};

const tiltKnotMesh = () => {
    if(VarLet.knotMesh) {
        VarLet.knotMesh.rotation.y = VarConst.mouse.x * 0.01;
        VarLet.knotMesh.rotation.z = VarConst.mouse.y * 0.01;
    }
};

// Champagne
const moveChampagneMesh = ({x, y}) => {
    if(VarConst.champagneMesh_initial_position_y !== undefined && VarLet.knotMesh) {
        const distance_from_top = y;
        VarLet.champagneMesh.position.y = VarConst.champagneMesh_initial_position_y + (distance_from_top * 0.001);
        VarLet.champagneMesh.rotation.z = VarConst.champagneMesh_initial_rotation_z + (distance_from_top * 0.001);
    }
};

// Daniels
const moveDanielsMesh = ({x, y}) => {
    if(VarConst.danielsMesh_initial_position_y !== undefined && VarLet.knotMesh) {
        const distance_from_top = y;
        VarLet.danielsMesh.position.y = VarConst.danielsMesh_initial_position_y + (distance_from_top * 0.001);
    }
};


// Wine
const moveWineMesh = ({x, y}) => {
    if(VarConst.wineMesh_initial_position_y !== undefined && VarLet.knotMesh) {
        const distance_from_top = y;
        VarLet.wineMesh.position.y = VarConst.wineMesh_initial_position_y + (distance_from_top * 0.001);
    }
};


// Hennessy
const moveHennesyMesh = ({x, y}) => {
    if(VarConst.hennessyMesh_initial_position_y !== undefined && VarLet.knotMesh) {
        const distance_from_top = y;
        VarLet.hennessyMesh.position.y = VarConst.hennessyMesh_initial_position_y + (distance_from_top * 0.001);
    }
};

// Envelope
let envelope_intersect_witness = null;
const tiltEnvelopeMesh = () => {
    if(VarLet.envelopeMesh) {
        VarLet.envelopeMesh.rotation.y = (VarConst.mouse.x * 0.1) + 1;
    }
};

window.addEventListener('click', () => {
    if(envelope_intersect_witness && VarLet.envelopeBakedMat.material.opacity === 1) {
        window.open("https://www.theknot.com/us/madalena-vicente-gravato-de-castro-e-almeida-and-andrew-sampaio-da-novoa-reid-jun-2022/rsvp", '_blank').focus();
    }
})


loco_scroll.on("scroll", ({currentElements, delta, limit, scroll, speed})=> {
    moveLandimMesh(scroll);
    moveBridgeMesh(scroll);
    moveKnotMesh(scroll);
    moveChampagneMesh(scroll);
    moveDanielsMesh(scroll);
    moveWineMesh(scroll);
    moveHennesyMesh(scroll);
});


/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

const clock = new THREE.Clock();
const tick = () =>
{
    if(VarLet.loadCompleted) {
        const elapsedTime = clock.getElapsedTime();

        // Render
        renderer.render(scene, camera);

        // Floating landim mesh
        if (VarLet.landimMesh) {
            VarLet.landimMesh.position.y = Math.sin(elapsedTime) * .07;
        }

        // Floating envelope mesh (and raycaster)
        if (VarLet.envelopeMesh && VarLet.envelopeBakedMat) {
            VarLet.envelopeMesh.position.y += Math.sin(elapsedTime) * .0003;

            // Cast a ray
            raycaster.setFromCamera(VarConst.mouse, camera);
            const intersects = raycaster.intersectObjects(VarLet.envelopeMesh.children);

            // Mouse event on envelope enter
            if(intersects.length) {

                if(envelope_intersect_witness === null && VarLet.envelopeBakedMat.material.opacity === 1) {
                    custom_cursor.cursorToClickableEnvelope()
                }

                envelope_intersect_witness = intersects[0]
            }
            // Mouse event on envelope leave
            else {
                if(envelope_intersect_witness) {
                    custom_cursor.cursorToNormal()
                }

                envelope_intersect_witness = null
            }
        }

        // Animated things
        tiltLandimMesh();
        tiltBridgeMesh();
        tiltKnotMesh();
        tiltEnvelopeMesh();
    }


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
};

tick();
