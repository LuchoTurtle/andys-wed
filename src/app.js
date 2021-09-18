import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import '../static/scss/main.scss'
import './locomotive_base.css'
import {VarConst} from "./js/vars";
import GalleryItem from "./anims/gallery_item";
import Storyline from "./anims/storyline";
import Sidebar from "./anims/sidebar";
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


/* --------------------------------------- ANIMATIONS end  -------------------------------- */

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
ScrollTrigger.addEventListener("refresh", () => loco_scroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();
