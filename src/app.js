import './style.scss'
import './locomotive.css'
import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from "gsap";

const scroller = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
});