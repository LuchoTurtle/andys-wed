import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import './styles/main.scss'
import './locomotive_base.css'
import {VarConst, VarLet} from "./js/vars";
import "./js/three_script"

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('resize', () =>
{
    VarLet.loco_scroll.update()
});

/* Linking GSAP with Locomotive Scroll - making sure they update accordingly --------------------------------- */
VarLet.loco_scroll.on("scroll", ScrollTrigger.update);
ScrollTrigger.scrollerProxy(".smooth-scroll", {
    scrollTop(value) {
        return arguments.length ? VarLet.loco_scroll.scrollTo(value, 0, 0) : VarLet.loco_scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    },
    pinType: document.querySelector(".smooth-scroll").style.transform ? "transform" : "fixed"
});
// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
ScrollTrigger.addEventListener("refresh", () => VarLet.loco_scroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

/* --------------------------------- */

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


VarLet.loco_scroll.on('scroll', ({ limit, scroll }) => {
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

