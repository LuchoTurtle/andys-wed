import {gsap} from 'gsap';

export default class Storyline {
    constructor(scrolltrigger, body, navbar, texts) {
        this.scrollTrigger = scrolltrigger;
        this.navbar = navbar;
        this.body = body;
        this.texts = texts;
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

        const BODY_bodyToLightPurple = gsap.fromTo(this.body, { backgroundColor: "#303030" },{ backgroundColor: "#F2A0E9" });
        const BODY_lightPurtpleToDarkerPurple = gsap.fromTo(this.body, { backgroundColor: "#F2A0E9" },{ backgroundColor: "#EB9C9C", immediateRender: false });
        const BODY_darkerPurpleToOrange = gsap.fromTo(this.body, { backgroundColor: "#EB9C9C" },{ backgroundColor: "#FBE7C6", immediateRender: false });

        const NAVBAR_bodyToLightPurple = gsap.fromTo(this.navbar, { backgroundColor: "#FBE7C6" },{ backgroundColor: "#F2A0E9" });
        const NAVBAR_lightPurtpleToDarkerPurple = gsap.fromTo(this.navbar, { backgroundColor: "#F2A0E9" },{ backgroundColor: "#EB9C9C", immediateRender: false });
        const NAVBAR_darkerPurpleToOrange = gsap.fromTo(this.navbar, { backgroundColor: "#EB9C9C" },{ backgroundColor: "#FBE7C6", immediateRender: false });

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
