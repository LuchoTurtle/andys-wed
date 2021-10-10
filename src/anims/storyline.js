import {gsap} from 'gsap';

export default class Storyline {
    constructor(scrolltrigger, body, navbar, texts, menu_links) {
        this.scrollTrigger = scrolltrigger;
        this.navbar = navbar;
        this.body = body;
        this.texts = texts;
        this.menu_links = menu_links;
        this.sectionHeight = 300;
        this.makeSectionsStickyAndTextFade();
        this.gradientBodyBackground()
    }

    makeSectionsStickyAndTextFade() {

        /* Makes section sticky for a certain amount of height --------- */
        this.texts.forEach((section) => {
            this.scrollTrigger.create({
                trigger: section,
                scrub: true,
                pin: true,
                start: "top top",
                end: `+=${this.sectionHeight}%`,
            });
        });

        /* Opacity of each text in each story line section --------- */
        this.texts.forEach((section) => {
            const h = section.querySelector('h1');

            this.scrollTrigger.create({
                trigger: section,
                start: "top top",
                end: `+=${this.sectionHeight - (this.sectionHeight * 0.1)}% 50%`,      // slightly before the end so the scroll up is not shown
                onEnter: () => gsap.to(h, { opacity: 1, ease: "power1.in", immediateRender: false },),
                onLeave: () => gsap.to(h, { opacity: 0, ease: "power4.out", immediateRender: false }),
                onLeaveBack: () => gsap.to(h, { opacity: 0, ease: "power4.out", immediateRender: false }),
                onEnterBack: () => gsap.to(h, { opacity: 1, ease: "power1.in", immediateRender: false })
            });
        });
    }

    gradientBodyBackground() {

        const BODY_bodyToLightPurple = gsap.fromTo(this.body, { backgroundColor: "#322633" },{ backgroundColor: "#637CAD" });
        const BODY_lightPurtpleToDarkerPurple = gsap.fromTo(this.body, { backgroundColor: "#637CAD" },{ backgroundColor: "#E2E8F9", immediateRender: false });
        const BODY_darkerPurpleToOrange = gsap.fromTo(this.body, { backgroundColor: "#E2E8F9" },{ backgroundColor: "#FBE7C6", immediateRender: false });

        const NAVBAR_bodyToLightPurple = gsap.fromTo(this.navbar, { backgroundColor: "#322633" },{ backgroundColor: "#637CAD" });
        const NAVBAR_lightPurtpleToDarkerPurple = gsap.fromTo(this.navbar, { backgroundColor: "#637CAD" },{ backgroundColor: "#E2E8F9", immediateRender: false });
        const NAVBAR_darkerPurpleToOrange = gsap.fromTo(this.navbar, { backgroundColor: "#E2E8F9" },{ backgroundColor: "#FBE7C6", immediateRender: false });

        for(let ml of this.menu_links) {
            const MENU_LINK_bodyToLightPurple = gsap.fromTo(ml, { color: "#ededed" },{ color: "#E4F1FE" });
            const MENU_LINK_lightPurtpleToDarkerPurple = gsap.fromTo(ml, { color: "#E4F1FE" },{ color: "#aaaaaa", immediateRender: false });
            const MENU_LINK_darkerPurpleToOrange = gsap.fromTo(ml, { color: "#aaaaaa" },{ color: "#545353", immediateRender: false });

            this.scrollTrigger.create({
                trigger: this.texts[0],
                start: "top top",
                scrub: true,
                animation: MENU_LINK_bodyToLightPurple
            });
            this.scrollTrigger.create({
                trigger: this.texts[1],
                start: "top top",
                scrub: true,
                animation: MENU_LINK_lightPurtpleToDarkerPurple
            });
            this.scrollTrigger.create({
                trigger: this.texts[2],
                start: "top top",
                scrub: true,
                animation: MENU_LINK_darkerPurpleToOrange
            });
        }


        this.scrollTrigger.create({
            trigger: this.texts[0],
            start: "top top",
            scrub: true,
            animation: BODY_bodyToLightPurple
        });
        this.scrollTrigger.create({
            trigger: this.texts[1],
            start: "top top",
            scrub: true,
            animation: BODY_lightPurtpleToDarkerPurple
        });
        this.scrollTrigger.create({
            trigger: this.texts[2],
            start: "top top",
            scrub: true,
            animation: BODY_darkerPurpleToOrange
        });


        this.scrollTrigger.create({
            trigger: this.texts[0],
            start: "top top",
            scrub: true,
            animation: NAVBAR_bodyToLightPurple
        });
        this.scrollTrigger.create({
            trigger: this.texts[1],
            start: "top top",
            scrub: true,
            animation: NAVBAR_lightPurtpleToDarkerPurple
        });
        this.scrollTrigger.create({
            trigger: this.texts[2],
            start: "top top",
            scrub: true,
            animation: NAVBAR_darkerPurpleToOrange
        });
    }
}
