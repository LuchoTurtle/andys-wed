import Cursor from './js/cursor';
import NotFoundExperience from "./js/notfound_scene";
import * as THREE from "three";
import { gsap } from "gsap";

import '../static/scss/404.scss'


/** -------------------------------- CURSOR SETUP ---------------------------------------------- **/

const custom_cursor = new Cursor();
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
