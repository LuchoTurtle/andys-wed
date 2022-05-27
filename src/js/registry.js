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
        this.custom_cursor = custom_cursor;
        this.gsap = gsap;
        this._setup();
        this.addScribbleCanvas()
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
    }

    /**
     * Open registry page.
     */
    openRegistry() {
        this.gsap.to(VarConst.registryContainer, { duration: 2, opacity: 1, ease: "power3.out"});
        document.querySelector('.registry').style.display = 'flex';
    }

    /**
     * Close registry page.
     */
    closeRegistry() {
        const tl = this.gsap.timeline({
            onComplete: () => {
                document.querySelector('.registry').style.display = 'none';
                // Resetting drawing canvas
                const canvas = document.querySelector('#scribble_canvas');
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
        tl.to(VarConst.registryContainer, { duration: 1, opacity: 0, ease: "power1.in"});
    }

    /**
     * Add scribble canvas.
     */
    addScribbleCanvas() {
        // wait for the content of the window element
        // to load, then performs the operations.
        // This is considered best practice.
        window.addEventListener('load', () => {

            resize(); // Resizes the canvas once the window loads
            //document.addEventListener('mousedown', startPainting);
            //document.addEventListener('mouseup', stopPainting);
            document.addEventListener('mousemove', (e) => {
                if(VarLet.registryIsOpen)
                    sketch(e)
            });
            window.addEventListener('resize', resize);
        });

        const canvas = document.querySelector('#scribble_canvas');

        // Context for the canvas for 2 dimensional operations
        const ctx = canvas.getContext('2d');

        // Resizes the canvas to the available size of the window.
        function resize(){
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        }

        // Stores the initial position of the cursor
        let coord = {x:0 , y:0};

        // This is the flag that we are going to use to
        // trigger drawing
        let paint = true;

        // Updates the coordianates of the cursor when
        // an event e is triggered to the coordinates where
        // the said event is triggered.
        function getPosition(event){
            coord.x = event.clientX - canvas.offsetLeft;
            coord.y = event.clientY - canvas.offsetTop;
        }

        // The following functions toggle the flag to start
        // and stop drawing
        function startPainting(event){
            paint = true;
            getPosition(event);
        }
        function stopPainting(){
            paint = false;
        }

        function sketch(event){
            if (!paint) return;
            ctx.beginPath();

            ctx.lineWidth = 1;

            // Sets the end of the lines drawn
            // to a round shape.
            ctx.lineCap = 'butt';

            ctx.strokeStyle = 'black';


            // The cursor to start drawing
            // moves to this coordinate
            ctx.moveTo(coord.x, coord.y);

            // The position of the cursor
            // gets updated as we move the
            // mouse around.
            getPosition(event);

            // A line is traced from start
            // coordinate to this coordinate
            ctx.lineTo(coord.x , coord.y);

            // Draws the line.
            ctx.stroke();
        }
    }

}
