// Credits go to https://tympanus.net/codrops/2019/01/31/custom-cursor-effects/

import SimplexNoise from 'simplex-noise';
import paper from 'paper'
import {gsap} from 'gsap';

export default class Cursor {
    constructor() {
        this.innerCursor = document.querySelector(".cursor--small");
        this.cursor = document.querySelector('.cursor')

        // set the starting position of the cursor outside of the screen
        this.clientX = -100;
        this.clientY = -100;

        // cursor canvas properties
        this.lastX = 0;
        this.lastY = 0;
        this.group = null;

        // For the noisy circle
        this.outterCircle = null;
        this.noiseScale = 350;        // speed (less is faster)
        this.noiseRange = 3;          // range of distortion
        this.strokeColor = "#d94f5c"; // stroke color of noisy circle
        this.shapeBounds = {
            width: 30,
            height: 30
        };

        this._initCursor();
        this._initCanvas();
    }

    _initCursor() {
        // add listener to track the current mouse position
        document.addEventListener("mousemove", e => {
            this.clientX = e.clientX;
            this.clientY = e.clientY;
        });

        const xSetter = gsap.quickSetter(this.innerCursor, "x", "px");
        const ySetter = gsap.quickSetter(this.innerCursor, "y", "px");

        // transform the innerCursor to the current mouse position
        // use requestAnimationFrame() for smooth performance
        const render = () => {
            xSetter(this.clientX);
            ySetter(this.clientY);

            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }

    _initCanvas() {
        const canvas = document.querySelector(".cursor--canvas");
        paper.setup(canvas);
        const strokeWidth = 1;
        const segments = 8;
        const radius = 15;

        // the base shape for the noisy circle
        this.outterCircle = new paper.Path.RegularPolygon(
            new paper.Point(0, 0),
            segments,
            radius
        );
        this.outterCircle.strokeWidth = strokeWidth;
        this.outterCircle.smooth();
        this.group = new paper.Group([this.outterCircle]);
        this.group.applyMatrix = false;

        const noiseObjects = this.outterCircle.segments.map(() => new SimplexNoise());
        let bigCoordinates = [];

        // function for linear interpolation of values
        const lerp = (a, b, n) => {
            return (1 - n) * a + n * b;
        };

        // function to map a value from one range to another range
        const map = (value, in_min, in_max, out_min, out_max) => {
            return (
                ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
            );
        };

        // the draw loop of Paper.js
        // (60fps with requestAnimationFrame under the hood)
        paper.view.onFrame = event => {
            // using linear interpolation, the circle will move 0.2 (20%)
            // of the distance between its current position and the mouse
            // coordinates per Frame
            this.lastX = lerp(this.lastX, this.clientX, 0.15);
            this.lastY = lerp(this.lastY, this.clientY, 0.15);
            this.group.position = new paper.Point(this.lastX, this.lastY);

            this.outterCircle.strokeColor = this.strokeColor;
            this.outterCircle.scale(1.08);

            // apply simplex noise
            if (this.outterCircle.bounds.width >= this.shapeBounds.width) {
                // first get coordinates of large circle
                if (bigCoordinates.length === 0) {
                    this.outterCircle.segments.forEach((segment, i) => {
                        bigCoordinates[i] = [segment.point.x, segment.point.y];
                    });
                }

                // loop over all points of the polygon
                this.outterCircle.segments.forEach((segment, i) => {

                    // get new noise value
                    // we divide event.count by noiseScale to get a very smooth value
                    const noiseX = noiseObjects[i].noise2D(event.count / this.noiseScale, 0);
                    const noiseY = noiseObjects[i].noise2D(event.count / this.noiseScale, 1);

                    // map the noise value to our defined range
                    const distortionX = map(noiseX, -1, 1, -this.noiseRange, this.noiseRange);
                    const distortionY = map(noiseY, -1, 1, -this.noiseRange, this.noiseRange);

                    // apply distortion to coordinates
                    const newX = bigCoordinates[i][0] + distortionX;
                    const newY = bigCoordinates[i][1] + distortionY;

                    // set new (noisy) coordinate of point
                    segment.point.set(newX, newY);
                });

            }
            this.outterCircle.smooth();
        };
    };

    cursorToNormal() {
        gsap.to(this.innerCursor, { duration: .40, padding: 3, ease: "power4.easeOut" });
        gsap.to(this.outterCircle, { duration: .4,  opacity: 1, ease: "power4.easeIn" });

        this.noiseScale = 350;
        this.noiseRange = 3;
        gsap.to(this, {strokeColor: "#d94f5c", duration: .70});
        this.innerCursor.style.display = 'unset'

        this.cursor.style.backgroundColor = 'transparent';
        this.cursor.style.mixBlendMode = 'unset';
        this.cursor.style.border = '.1px solid #F4A261'
    }

    cursorToClickable() {
        this.noiseScale = 120;
        this.noiseRange = 5;
        gsap.to(this, {strokeColor: "#8fa6ff", duration: .70});
        this.innerCursor.style.display = 'none'
    }

    cursorToClickableEnvelope() {
        gsap.to(this.innerCursor, { duration: .4, padding: 35, ease: "power1.easeOut" });
        gsap.to(this.outterCircle, { duration: .2, opacity: 0, ease: "power4.easeOut" });

        this.cursor.style.backgroundColor = 'rgb(202, 120, 120)';
        this.cursor.style.mixBlendMode = 'color-burn';
        this.cursor.style.border = 'unset'

        //this.noiseScale = 120;
        //this.noiseRange = 5;
        //this.strokeColor = "#8fa6ff";
        //this.innerCursor.style.display = 'none';
    }

}
