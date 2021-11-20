import {gsap as vanilla_gsap} from "gsap";
import {ScrollTrigger as vanilla_ScrollTrigger} from "gsap/ScrollTrigger";

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

import I18N from './js/i18n';


/** ---------------------- GSAP / SCROLLTRIGGER / LOCOSCROLL SETUP ----------------------------- **/

// Modified gsap, ScrollTrigger and locomotive scroll object that are compatible with each other.
const {gsap, loco_scroll, scroll_trigger} = new ScrollTriggerWithLoco(vanilla_gsap, vanilla_ScrollTrigger);


/** ---------------------------------- VAR INITIALIZATIONS ------------------------------------- **/
const isDayTime = (new Date().getHours() > 6 && new Date().getHours() < 18);

screenMeshPositionInitialization();

function changeHeroAccordingToDaytime() {
    // Day-time different colors on hero
    const andrew_title = document.getElementById("andrew--title");
    const madalena_title = document.getElementById("madalena--title");
    const hero_subtitle = document.getElementsByClassName("hero--subtitle")[0];
    const scroll_down = document.getElementsByClassName("scroll-down-text")[0];
    const scroll_down_bar = document.getElementsByClassName("scroll-down-bar")[0];

    if(isDayTime) {
        andrew_title.style.color = '#29363c';
        madalena_title.style.color = '#29363c';
        hero_subtitle.style.color = '#697277';
        scroll_down.style.color = '#29363c';
        scroll_down_bar.style.background = '#29363c';
        document.getElementsByClassName("done-text")[0].innerHTML = 'It\'s bright outside, have fun!';
    } else {
        andrew_title.style.color = 'whitesmoke';
        madalena_title.style.color = 'whitesmoke';
        hero_subtitle.style.color = 'navajowhite';
        document.getElementsByClassName("done-text")[0].innerHTML = 'It\'s a dark outside but we\'re open!';
    }
}


/** ------------------------------ ADDING ANIMATIONS -------------------------------------------- **/
const body = document.body;
const navbar = document.body.getElementsByClassName("navbar");
const texts = [...document.getElementsByClassName("story__section")];
const menu_links = [...document.getElementsByClassName("menu__link")];
new Storyline(scroll_trigger, body, navbar, texts, menu_links, isDayTime);

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

function addGalleryAnimations() {
    const gallery = document.querySelector('.gallery');
    const galleryItemElems = [...gallery.querySelectorAll('.gallery__item')];
    galleryItemElems.forEach(el => {
        new GalleryItem(el)
    });

}


/** -------------------------------- CURSOR SETUP ---------------------------------------------- **/

const custom_cursor = new Cursor();
const linkItems = document.querySelectorAll("a");
linkItems.forEach(item => {
    item.addEventListener("mouseenter", () => custom_cursor.cursorToClickable());
    item.addEventListener("mouseleave", () => custom_cursor.cursorToNormal());
});

/** -------------------------------- INITIAL LOADING CHOICE ------------------------------------- **/
const i18n = new I18N();

const tablet_breakpoint = window.matchMedia("(max-width: 768px)");
const chosenLanguage = (language) => {
    // Change cursor to normal
    custom_cursor.cursorToNormal();

    // Animation to begin the site experience
    const tl = gsap.timeline();
    tl.to(VarConst.languageContainer, { duration: .5, opacity: 0 });
    tl.to(VarConst.cursorCanvas, { duration: 1, opacity: 1 }, "<");
    tl.to(VarConst.initialContainer, { duration: 1, yPercent: -200, ease: "power2.in"});

    // Requesting fullscreen on mobile devices (we needed a user gesture for fullscreen request to work)
    if (tablet_breakpoint.matches) {
        //document.body.requestFullscreen();
    }

    setTimeout(() => {
        // This is to make bridge mesh start correctly (it's a bug with var initializations but this is a dirty fix, cba)
        loco_scroll.scrollTo(1);

        // Changing language, adding gallery animations and hero color changing according to day time.
        // (we call here so the CSS animations work properly on the updated language HTML)
        i18n.setLanguage(language);
        addGalleryAnimations();
        changeHeroAccordingToDaytime()

    }, 1000)
};

const enBtn = document.getElementById("en-btn");
const ptBtn = document.getElementById("pt-btn");
enBtn.addEventListener("mouseenter", () => custom_cursor.cursorToClickableEnvelope());
enBtn.addEventListener("mouseleave", () => custom_cursor.cursorToNormal());
enBtn.addEventListener("click", () => chosenLanguage('en'));
ptBtn.addEventListener("mouseenter", () => custom_cursor.cursorToClickableEnvelope());
ptBtn.addEventListener("mouseleave", () => custom_cursor.cursorToNormal());
ptBtn.addEventListener("click", () => chosenLanguage('pt'));

/** ---------------------------------- THREE.JS ------------------------------------------------ **/

const canvas = document.querySelector('.webgl');

const experience = new Experience(canvas, scroll_trigger, loco_scroll, isDayTime);
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
    if (envelope_intersect_witness && VarLet.envelopeBakedMat.material.opacity === 1) {
        window.open("https://www.theknot.com/us/madalena-vicente-gravato-de-castro-e-almeida-and-andrew-sampaio-da-novoa-reid-jun-2022/rsvp", '_blank').focus();
    }
});

/**
 * Tilt animations
 */

// Landim
const tiltLandimMesh = () => {
    if (VarLet.landimMesh && VarLet.landimMesh) {
        VarLet.landimMesh.rotation.y = VarConst.mouse.x * 0.01;
        VarLet.landimMesh.rotation.z = VarConst.mouse.y * 0.01;
    }
};

// Bridge
const tiltBridgeMesh = () => {
    if (VarLet.bridgeMesh) {
        VarLet.bridgeMesh.rotation.y = VarConst.mouse.x * 0.01;
        VarLet.bridgeMesh.rotation.z = VarConst.mouse.y * 0.01;
    }
};

// Knot
const tiltKnotMesh = () => {
    if (VarLet.knotMesh) {
        VarLet.knotMesh.rotation.y = VarConst.mouse.x * 0.01;
        VarLet.knotMesh.rotation.z = VarConst.mouse.y * 0.01;
    }
};

// Envelope
const tiltEnvelopeMesh = () => {
    if (VarLet.envelopeMesh) {
        VarLet.envelopeMesh.rotation.y = (VarConst.mouse.x * 0.1) + 1;
    }
};


/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();
const tick = () => {
    if (VarLet.loadCompleted) {
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
            if (intersects.length) {

                if (envelope_intersect_witness === null && VarLet.envelopeBakedMat.material.opacity === 1) {
                    custom_cursor.cursorToClickableEnvelope()
                }

                envelope_intersect_witness = intersects[0]
            }
            // Mouse event on envelope leave
            else {
                if (envelope_intersect_witness) {
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


/** -------------------------------- CONSOLE LOG EASTER EGG ---------------------------------------------- **/


let title_style = [
    'font-weight: bold',
    'font-size: 50px',
    `color: red`,
    `text-shadow: 3px 3px 0 rgb(217,31,38)`,
    `6px 6px 0 rgb(226,91,14)`,
    `9px 9px 0 rgb(245,221,8)`,
    `12px 12px 0 rgb(5,148,68)`,
    `15px 15px 0 rgb(25,18,168)`
].join(';');
console.log('%c Hey there!', title_style);

let subtitle_styles = [
    `font-size: 12px`,
    `font-family: monospace`,
    `background: white`,
    `display: inline-block`,
    `color: black`,
    `padding: 8px 19px`,
    `border: 1px dashed;`
].join(';');
console.log("%c Great seeing you here 😊.\nWe always fancy those that are curious by nature. But today it's time to celebrate. Head on back to the website and get ready for the best wedding ever! 🎉", subtitle_styles);
