// Credits go to https://tympanus.net/codrops/2019/01/31/custom-cursor-effects/

import SimplexNoise from 'simplex-noise';
import paper from 'paper'
import {gsap} from 'gsap';

// Cursor -----------------------------------------------------------------

// set the starting position of the cursor outside of the screen
let clientX = -100;
let clientY = -100;
const innerCursor = document.querySelector(".cursor--small");

const initCursor = () => {
    // add listener to track the current mouse position
    document.addEventListener("mousemove", e => {
        clientX = e.clientX;
        clientY = e.clientY;
    });

    const xSetter = gsap.quickSetter(innerCursor, "x", "px");
    const ySetter = gsap.quickSetter(innerCursor, "y", "px");

    // transform the innerCursor to the current mouse position
    // use requestAnimationFrame() for smooth performance
    const render = () => {
        xSetter(clientX);
        ySetter(clientY);

        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
};

initCursor();


// Cursor canvas -----------------------------------------------------------------
let lastX = 0;
let lastY = 0;
let group;

// For the noisy circle
let noiseScale = 350;        // speed (less is faster)
let noiseRange = 3;          // range of distortion
let strokeColor = "#d94f5c"; // stroke color of noisy circle

const initCanvas = () => {
    const canvas = document.querySelector(".cursor--canvas");
    const shapeBounds = {
        width: 30,
        height: 30
    };
    paper.setup(canvas);
    const strokeWidth = 1;
    const segments = 8;
    const radius = 15;

    // the base shape for the noisy circle
    const polygon = new paper.Path.RegularPolygon(
        new paper.Point(0, 0),
        segments,
        radius
    );
    polygon.strokeWidth = strokeWidth;
    polygon.smooth();
    group = new paper.Group([polygon]);
    group.applyMatrix = false;

    const noiseObjects = polygon.segments.map(() => new SimplexNoise());
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
        lastX = lerp(lastX, clientX, 0.15);
        lastY = lerp(lastY, clientY, 0.15);
        group.position = new paper.Point(lastX, lastY);

        polygon.strokeColor = strokeColor;
        polygon.scale(1.08);

        // apply simplex noise
        if (polygon.bounds.width >= shapeBounds.width) {
            // first get coordinates of large circle
            if (bigCoordinates.length === 0) {
                polygon.segments.forEach((segment, i) => {
                    bigCoordinates[i] = [segment.point.x, segment.point.y];
                });
            }

            // loop over all points of the polygon
            polygon.segments.forEach((segment, i) => {

                // get new noise value
                // we divide event.count by noiseScale to get a very smooth value
                const noiseX = noiseObjects[i].noise2D(event.count / noiseScale, 0);
                const noiseY = noiseObjects[i].noise2D(event.count / noiseScale, 1);

                // map the noise value to our defined range
                const distortionX = map(noiseX, -1, 1, -noiseRange, noiseRange);
                const distortionY = map(noiseY, -1, 1, -noiseRange, noiseRange);

                // apply distortion to coordinates
                const newX = bigCoordinates[i][0] + distortionX;
                const newY = bigCoordinates[i][1] + distortionY;

                // set new (noisy) coordinate of point
                segment.point.set(newX, newY);
            });

        }
        polygon.smooth();
    };
};

initCanvas();

// On hover handlers (used only for links right now) -----------
const linkItems = document.querySelectorAll("a");
const initHovers = () => {
    const handleMouseEnter = e => {
        noiseScale = 120;
        noiseRange = 5;
        strokeColor = "#8fa6ff";
        innerCursor.style.display = 'none'
    };

    // reset isStuck on mouseLeave
    const handleMouseLeave = () => {
        noiseScale = 350;
        noiseRange = 3;
        strokeColor = "#d94f5c";
        innerCursor.style.display = 'unset'
    };

    linkItems.forEach(item => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
    });
};

initHovers();
