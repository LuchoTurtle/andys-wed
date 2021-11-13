import { gsap as vanilla_gsap } from "gsap";
import { ScrollTrigger as vanilla_ScrollTrigger } from "gsap/ScrollTrigger";

import * as THREE from "three";

import {VarConst, VarLet, screenMeshPositionInitialization} from "./vars";
import ScrollTriggerWithLoco from './js/gsap'

import '../static/scss/main.scss'
import './locomotive_base.css'

import GalleryItem from "./gsap_anims/gallery_item";
import Storyline from "./gsap_anims/storyline";
import Sidebar from "./gsap_anims/sidebar";
import Cursor from './js/cursor';
import Experience from "./js/scene";


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

const scrolldown = document.body.getElementsByClassName("scroll-down");
const hero = document.body.getElementsByClassName("hero");
scroll_trigger.create({
    trigger: hero,
    start: "bottom 80%",
    animation: gsap.to(scrolldown, {opacity: 0, duration: 0.4})
});


/** -------------------------------- CURSOR SETUP ---------------------------------------------- **/

const custom_cursor = new Cursor();
const linkItems = document.querySelectorAll("a");
linkItems.forEach(item => {
    item.addEventListener("mouseenter", () => custom_cursor.cursorToClickable());
    item.addEventListener("mouseleave", () => custom_cursor.cursorToNormal());
});

/** ---------------------------------- THREE.JS ------------------------------------------------ **/

const canvas = document.querySelector('.webgl');

const experience = new Experience(canvas, scroll_trigger, loco_scroll);
const {camera, scene, renderer} = experience;
experience.loadFiles();
experience.modelsAnimations();
experience.addResizeHandler();
//experience.addHelper();


/**
 * Envelope click handler
 */
let envelope_intersect_witness = null;
window.addEventListener('click', () => {
    if(envelope_intersect_witness && VarLet.envelopeBakedMat.material.opacity === 1) {
        window.open("https://www.theknot.com/us/madalena-vicente-gravato-de-castro-e-almeida-and-andrew-sampaio-da-novoa-reid-jun-2022/rsvp", '_blank').focus();
    }
});

/**
 * Tilt animations
 */

// Landim
const tiltLandimMesh = () => {
    if(VarLet.landimMesh && VarLet.landimMesh) {
        VarLet.landimMesh.rotation.y = VarConst.mouse.x * 0.01;
        VarLet.landimMesh.rotation.z = VarConst.mouse.y * 0.01;
    }
};

// Bridge
const tiltBridgeMesh = () => {
    if(VarLet.bridgeMesh) {
        VarLet.bridgeMesh.rotation.y = VarConst.mouse.x * 0.01;
        VarLet.bridgeMesh.rotation.z = VarConst.mouse.y * 0.01;
    }
};

// Knot
const tiltKnotMesh = () => {
    if(VarLet.knotMesh) {
        VarLet.knotMesh.rotation.y = VarConst.mouse.x * 0.01;
        VarLet.knotMesh.rotation.z = VarConst.mouse.y * 0.01;
    }
};

// Envelope
const tiltEnvelopeMesh = () => {
    if(VarLet.envelopeMesh) {
        VarLet.envelopeMesh.rotation.y = (VarConst.mouse.x * 0.1) + 1;
    }
};


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
