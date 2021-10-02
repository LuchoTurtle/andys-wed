import {gsap} from 'gsap';

export default class Sidebar {
    constructor(scrolltrigger, loco_scroll,
                progress_bar, sub_menus) {
        this.scrollTrigger = scrolltrigger;
        this.loco_scroll = loco_scroll;

        this.progress_bar = progress_bar;
        this.sub_menus = sub_menus;

        this.tablet_breakpoint = window.matchMedia("(max-width: 768px)");

        this.addEventListeners();
        this.currentSectionSidebarAnimations();
    }

    // Changes progress bar according to progress and direction.
    updateProgressBarDirection(progress) {
        if (this.tablet_breakpoint.matches) {
            this.progress_bar.style.transform = `translateX(-${progress}%)`
        } else {
            this.progress_bar.style.transform = `translateY(-${progress}%)`
        }
    }

    addEventListeners() {
        /* Progress bar */
        this.tablet_breakpoint.addEventListener('change', this.updateProgressBarDirection);

        this.loco_scroll.on('scroll', ({ limit, scroll }) => {
            const progress = 100 - (scroll.y / limit.y * 100);
            this.updateProgressBarDirection(progress)
        });


        /* Menu toggle highlight */
        const highlight = function() {
            let current_highlight = document.getElementsByClassName("menu__item--current")[0];
            current_highlight.classList.remove("menu__item--current");
            this.classList.add("menu__item--current")
        };

        Array.from(this.sub_menus).forEach(function(element) {
            element.addEventListener('click', highlight);
        });
    }

    currentSectionSidebarAnimations() {

        /* Functions for dynamic current menu styles */
        const highlight = function(menu_link) {
            let current_highlight = document.getElementsByClassName("menu__item--current")[0];
            if(current_highlight)
                current_highlight.classList.remove("menu__item--current");

            if(menu_link)
                menu_link.classList.add("menu__item--current")
        };

        const clear = function() {
            let current_highlight = document.getElementsByClassName("menu__item--current")[0];
            if(current_highlight)
                current_highlight.classList.remove("menu__item--current");
        };


        const menu_links = [...document.querySelectorAll('.menu-container_submenu')];
        const link_home = menu_links[0];
        const link_gallery = menu_links[1];
        const link_venue = menu_links[2];
        const link_rsvp  = menu_links[3];


        const hero = document.getElementsByClassName("hero")[0];
        const story = document.getElementsByClassName("story")[0];
        const photo_gallery = document.getElementsByClassName("photo-gallery")[0];
        const venue = document.getElementsByClassName("venue")[0];
        const rsvp = document.getElementsByClassName("rsvp")[0];

        /* GSAP animation */
        this.scrollTrigger.create({
            trigger: hero,
            start: "top top",
            onEnter: () => highlight(link_home),
            onLeave: () => clear(),
            onLeaveBack: () => clear(),
            onEnterBack: () => highlight(link_home),
        });

        this.scrollTrigger.create({
            trigger: photo_gallery,
            start: "top top",
            onEnter: () => highlight(link_gallery),
            onLeave: () => clear(),
            onLeaveBack: () => clear(),
            onEnterBack: () => highlight(link_gallery),
        });

        this.scrollTrigger.create({
            trigger: venue,
            start: "top top",
            end: "50% top",
            onEnter: () => highlight(link_venue),
            onLeaveBack: () => clear(),
            onEnterBack: () => highlight(link_venue),
        });

        this.scrollTrigger.create({
            trigger: rsvp,
            start: "top bottom",
            onEnter: () => highlight(link_rsvp),
            onEnterBack: () => highlight(link_rsvp),
        });

        /* Click handlers */
        const loco_scroll = this.loco_scroll;
        Array.from(this.sub_menus).forEach(function(element) {
            if(element.id === "link_home") {
                element.addEventListener('click', () => loco_scroll.scrollTo(hero));
            }

            if(element.id === "link_gallery") {
                element.addEventListener('click', () => loco_scroll.scrollTo(photo_gallery, {offset: 5}));
            }

            if(element.id === "link_details") {
                element.addEventListener('click', () => loco_scroll.scrollTo(venue, {offset: 5}));
            }

            if(element.id === "link_rsvp") {
                element.addEventListener('click', () => loco_scroll.scrollTo(rsvp, {offset: 5}));
            }
        });

    }
}
