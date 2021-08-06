import './style.scss'
import './locomotive.css'
import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


const progress_bar = document.querySelector('.progress-bar')

const locoScroll = new LocomotiveScroll({
    el: document.querySelector(".smooth-scroll"),
    smooth: true
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
locoScroll.on('scroll', ({ limit, scroll }) => {
    const progress = 100 - (scroll.y / limit.y * 100)
    progress_bar.style.transform = `translateY(-${progress}%)`
})


/*
// --- RED PANEL ---
gsap.to('progress', {
    value: 100,
    ease: 'none',
    scrollTrigger: {
        scroller: ".smooth-scroll",
        //markers: true,
        scrub: 0.3,
        start: "top top",
        end: "bottom bottom"
    }
});
 */

