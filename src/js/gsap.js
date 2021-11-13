import LocomotiveScroll from "locomotive-scroll";

/**
 * Modified ScrollTrigger object and LocomotiveScroll object, compatible with each other.
 */
export default class ScrollTriggerWithLoco {
    /**
     * Creates an object with a modified GSAP, ScrollTrigger, Locomotive Scroll object and scroller element.
     * @param gsap vanilla GSAP object to be modified.
     * @param ScrollTrigger vanilla ScrollTrigger object to be modified and made compatible with Locomotive scroll.
     */
    constructor(gsap, ScrollTrigger) {
        this.gsap = gsap;
        this.scroll_trigger = ScrollTrigger;
        this.scroller_el = document.querySelector('[data-scroll-container]');
        this.loco_scroll = new LocomotiveScroll({
            el: this.scroller_el,
            multiplier: 0.45,
            lerp: 0.03,
            smooth: true,
        });

        this._initTransformations()
    }

    /**
     * Transforming the vanilla ScrollTrigger and making it compatible with Locomotive Scroller.
     * @private
     */
    _initTransformations() {
        this.gsap.registerPlugin(this.scroll_trigger);

        let loco_scroll = this.loco_scroll;
        let scroller_el = this.scroller_el;
        // Tells ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
        this.scroll_trigger.scrollerProxy(this.scroller_el, {
            scrollTop(value) {
                return arguments.length ? loco_scroll.scrollTo(value, 0, 0) : loco_scroll.scroll.instance.scroll.y;
            },

            // we don't have to define a scrollLeft because we're only scrolling vertically.
            getBoundingClientRect() {
                return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
            },

            // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element)
            pinType: scroller_el.style.transform ? "transform" : "fixed"
        });

        // Bind loco scroller element to ScrollTrigger's scroller
        this.scroll_trigger.defaults({
            scroller: this.scroller_el
        });

        // This is configuration to proxy the locomotive scroll behaviour and map it to GSAP. This is because Locomotive hijacks the scrolling behavior
        window.addEventListener('resize', () => { this.loco_scroll.update() });

        // Updating ScrollTrigger on scroll
        this.loco_scroll.on("scroll", ({currentElements, delta, limit, scroll, speed})=> {
            this.scroll_trigger.update()
        });



        // Each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
        this.scroll_trigger.addEventListener("refresh", () => this.loco_scroll.update());

        // After everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
        this.scroll_trigger.refresh();
    }
}
