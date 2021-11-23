import classie from 'desandro-classie'
import {VarConst} from "../vars";

export default class Registry {
    constructor(custom_cursor, gsap) {
        this.closeButton = document.getElementById("registry-close--icon");
        this.registryLink = document.getElementById("registry-link");
        this.figure = document.getElementsByClassName("stack-fanout")[0];
        this.custom_cursor = custom_cursor;
        this.gsap = gsap;
        this._setup();
    }

    _setup() {
        // Registry link
        this.registryLink.addEventListener('click', () => this.openRegistry());

        // Close button
        this.closeButton.addEventListener('click', () => this.closeRegistry());
        this.closeButton.addEventListener('mouseenter', () => this.custom_cursor.cursorToClickable());
        this.closeButton.addEventListener("mouseleave", () => this.custom_cursor.cursorToNormal());

        // Figure
        this.figure.addEventListener('click', () => classie.toggle(this.figure, 'active'));
        this.figure.addEventListener('mouseenter', () => this.custom_cursor.cursorToClickableEnvelope());
        this.figure.addEventListener("mouseleave", () => this.custom_cursor.cursorToNormal());
    }

    openRegistry() {
        this.gsap.to(VarConst.registryContainer, { duration: 2, yPercent: 200, ease: "power3.out"});
    }

    closeRegistry() {
        this.gsap.to(VarConst.registryContainer, { duration: 2, yPercent: -200, ease: "power3.in"});
    }

}
