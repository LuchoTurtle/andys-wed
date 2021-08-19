import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './style.scss'
import './locomotive.css'
import {VarConst, VarLet} from "./vars";

gsap.registerPlugin(ScrollTrigger);

const locoScroll = new LocomotiveScroll({
    el: document.querySelector(".smooth-scroll"),
    smooth: true
});

window.addEventListener('resize', () =>
{
    locoScroll.update()
});

/* Linking GSAP with Locomotive Scroll - making sure they update accordingly --------------------------------- */
locoScroll.on("scroll", ScrollTrigger.update);
ScrollTrigger.scrollerProxy(".smooth-scroll", {
    scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    },
    pinType: document.querySelector(".smooth-scroll").style.transform ? "transform" : "fixed"
});
// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

/* --------------------------------- */

/* Progress Bar */
function updateProgressBarDirection(progress) {
    if (x.matches) {
        VarConst.progress_bar.style.transform = `translateX(-${progress}%)`
    } else {
        VarConst.progress_bar.style.transform = `translateY(-${progress}%)`
    }
}

let tablet_breakpoint = window.matchMedia("(max-width: 768px)")
tablet_breakpoint.addEventListener('change', updateProgressBarDirection)


locoScroll.on('scroll', ({ limit, scroll }) => {
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

