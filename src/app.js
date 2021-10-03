import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";

import GalleryItem from "./anims/gallery_item";
import Storyline from "./anims/storyline";
import Sidebar from "./anims/sidebar";
import '../static/scss/main.scss'
import './locomotive_base.css'
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from "dat.gui";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import createjs from 'preload-js'

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
const bakedTexture = textureLoader.load('3D/baked3.jpg');
bakedTexture.flipY = false;

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({
    map: bakedTexture
});

/**
 * Model
 */
gltfLoader.load('3D/landim3.glb',
    (gltf) =>  {
    gltf.scene.traverse((child) => {
       child.material = bakedMaterial
    });
        scene.add(gltf.scene);
    });


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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const moveCamera = ({x, y}) => {
    const distance_from_top = y;
    camera.position.y = distance_from_top * -0.001
};

loco_scroll.on("scroll", ({currentElements, delta, limit, scroll, speed})=> {
    moveCamera(scroll);
});


const clock = new THREE.Clock();

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime();


    // Update Orbital Controls
    controls.update();      // -> change here so the camera stops looking at mesh

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
};

tick();
