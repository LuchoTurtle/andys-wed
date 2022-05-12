import classie from 'desandro-classie'
import {VarConst, VarLet} from "../vars";

/**
 * Registry class, pertaining to the fade in and fade out animation of Registry page.
 */
export default class Registry {
    /**
     * Initializes the registry object.
     * @param custom_cursor custom cursor to change its styles accordingly within the registry page
     * @param gsap modified GSAP object compatible with loco scroll
     */
    constructor(custom_cursor, gsap) {
        this.closeButton = document.getElementById("registry-close--icon");
        this.registryLink = document.getElementById("registry-link");
        this.figure = document.getElementsByClassName("stack-fanout")[0];
        this.custom_cursor = custom_cursor;
        this.gsap = gsap;
        this._setup();
    }

    /**
     * Sets up the event listeners to open, close and toggle image animation.
     * @private
     */
    _setup() {
        // Registry link
        this.registryLink.addEventListener('click', () => {
            this.openRegistry();
            VarLet.registryIsOpen = true;
        });

        // Close button
        this.closeButton.addEventListener('click', () => {
            this.closeRegistry();
            VarLet.registryIsOpen = false;
        });
        this.closeButton.addEventListener('mouseenter', () => this.custom_cursor.cursorToClickable());
        this.closeButton.addEventListener("mouseleave", () => this.custom_cursor.cursorToNormal());

        // Figure
        this.figure.addEventListener('click', () => classie.toggle(this.figure, 'active'));
        this.figure.addEventListener('mouseenter', () => this.custom_cursor.cursorToClickableEnvelope());
        this.figure.addEventListener("mouseleave", () => this.custom_cursor.cursorToNormal());
    }

    /**
     * Open registry page.
     */
    openRegistry() {
        this.gsap.to(VarConst.registryContainer, { duration: 2, yPercent: 200, ease: "power3.out"});
    }

    /**
     * Close registry page.
     */
    closeRegistry() {
        this.gsap.to(VarConst.registryContainer, { duration: 2, yPercent: -200, ease: "power3.in"});
    }

}
