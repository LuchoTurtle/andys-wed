import Cursor from './js/cursor';
import NotFoundExperience from "./js/notfound_scene";
import * as THREE from "three";
import { gsap } from "gsap";

import '../static/scss/404.scss'


/** -------------------------------- CURSOR SETUP ---------------------------------------------- **/

const custom_cursor = new Cursor();
document.querySelectorAll('.cursor').forEach((obj) => obj.style.opacity = 1); // by default, cursor has opacity 0. For this page, we set it to 1 programmatically

const clickBack = document.querySelectorAll("#go-back-span");
const overlay = document.querySelectorAll(".redirect-overlay");
clickBack.forEach(item => {
    item.addEventListener("mouseenter", () => custom_cursor.cursorToClickableEnvelope());
    item.addEventListener("mouseleave", () => custom_cursor.cursorToNormal());
    item.addEventListener('click', () => {
        gsap.to(overlay, {opacity: 1, duration: 0.6})
        setTimeout(() => {
            window.location.replace('https://mandylena.pt/')
        }, 2000);
    })
});

/** ---------------------------------- THREE.JS ------------------------------------------------ **/

const canvas = document.querySelector('.notfound-webgl');

const experience = new NotFoundExperience(canvas);
const {camera, scene, renderer} = experience;
experience.loadFiles();
experience.addResizeHandler();
const controls = experience.addOrbitalControls();



const clock = new THREE.Clock();
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Render
    renderer.render(scene, camera);

    // Update orbital controls
    controls.update();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
};

tick();




/** ---------------------------------- ANIMATIONS ---------------------------------------------- **/

// Make tutorial disappear when user scrolls
const tutorial = document.querySelectorAll(".tutorial-wrapper");
canvas.addEventListener("wheel", () => {
    gsap.to(tutorial, {opacity: 0})
});



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
console.log("%c Great seeing you here 😊.\nWe always fancy those that are curious by nature. But today it's time to celebrate. Head on back to the website and get ready for the best wedding ever! 🎉 \n💻 This site was made with ❤ by LuchoTurtle. Check me out at https://github.com/LuchoTurtle/andys-wed . \n🎨 Illustrations were created by Vicente Sampaio. Check him out at https://vicentesampaio.hotglue.me/start .", subtitle_styles);
