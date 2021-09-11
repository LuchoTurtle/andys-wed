import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import '../static/scss/main.scss'
import './locomotive_base.css'
import {VarConst} from "./js/vars";
import GalleryItem from "./js/galleryItem";
//import "./js/three_script"

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


/* This is configurations to proxy the locomotive scroll behaviour and map it to GSAP. This is because Locomotive hijacks the scrolling behavior ---------------------- */
window.addEventListener('resize', () => { loco_scroll.update() });

loco_scroll.on("scroll", ScrollTrigger.update);

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


/* --------------------------------------- ANIMATIONS START --------------------------------- */

/* Sticky story lines -------------*/
const body = document.body;
const texts = [...document.getElementsByClassName("story__section")];
texts.forEach((section, i) => {
    ScrollTrigger.create({
        trigger: section,
        scrub: true,
        pin: true,
        start: "top top",
        end: "+=300%",
    });
});

/* Opacity of each text in each story line section --------- */
texts.forEach((section, i) => {
    const h = section.querySelector('h1');

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=275% 50%",      // slightly before the end so the scroll up is not shown
        onEnter: () => gsap.to(h, { opacity: 1, ease: "power1.in", immediateRender: false },),
        onLeave: () => gsap.to(h, { opacity: 0, ease: "power4.out", immediateRender: false }),
        onLeaveBack: () => gsap.to(h, { opacity: 0, ease: "power4.out", immediateRender: false }),
        onEnterBack: () => gsap.to(h, { opacity: 1, ease: "power1.in", immediateRender: false })
    });
});

/* Gradient transitions -------------*/
const bodyToLightPurple = gsap.fromTo(body, { backgroundColor: "#FBE7C6" },{ backgroundColor: "#F2A0E9" });
const lightPurtpleToDarkerPurple = gsap.fromTo(body, { backgroundColor: "#F2A0E9" },{ backgroundColor: "#EB9C9C", immediateRender: false });
const darkerPurpleToOrange = gsap.fromTo(body, { backgroundColor: "#EB9C9C" },{ backgroundColor: "#FBE7C6", immediateRender: false });
ScrollTrigger.create({
    trigger: texts[0],
    start: "top top",
    scrub: true,
    animation: bodyToLightPurple
});
ScrollTrigger.create({
    trigger: texts[1],
    start: "top top",
    scrub: true,
    animation: lightPurtpleToDarkerPurple
});
ScrollTrigger.create({
    trigger: texts[2],
    start: "top top",
    scrub: true,
    animation: darkerPurpleToOrange
});


/* Gallery effects ---------------*/
const gallery = document.querySelector('.gallery');

const galleryItemElems = [...gallery.querySelectorAll('.gallery__item')];
galleryItemElems.forEach(el => {
    new GalleryItem(el)
});










/* --------------------------------------- ANIMATIONS end  -------------------------------- */

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
ScrollTrigger.addEventListener("refresh", () => loco_scroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();













/* OTHER TINGS -------------------------------------------------------*/
/* Progress Bar */
let tablet_breakpoint = window.matchMedia("(max-width: 768px)")
function updateProgressBarDirection(progress) {
    if (tablet_breakpoint.matches) {
        VarConst.progress_bar.style.transform = `translateX(-${progress}%)`
    } else {
        VarConst.progress_bar.style.transform = `translateY(-${progress}%)`
    }
}

tablet_breakpoint.addEventListener('change', updateProgressBarDirection)


loco_scroll.on('scroll', ({ limit, scroll }) => {
    const progress = 100 - (scroll.y / limit.y * 100)
    updateProgressBarDirection(progress) // Call listener function at run time
});


/* Menu toggle highlight */

const sub_menus = document.getElementsByClassName("menu-container_submenu");

const highlight = function() {
    let current_highlight = document.getElementsByClassName("menu__item--current")[0]
    current_highlight.classList.remove("menu__item--current")
    this.classList.add("menu__item--current")
};

Array.from(sub_menus).forEach(function(element) {
    element.addEventListener('click', highlight);
});

