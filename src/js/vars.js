import * as THREE from 'three'
import LocomotiveScroll from "locomotive-scroll";

const loco_scroll = new LocomotiveScroll({
    el: document.querySelector(".smooth-scroll"),
    smooth: true,
    smartphone: {
        smooth: true
    },
    tablet: {
        smooth: true
    }
});

const VarConst = {
    progress_bar: document.querySelector('.progress-bar'),

    lightBlue: "#E9EFEF",
    normalBlue: "#48717F",
    darkBlue: "#29363C",
    darkerBlue: "#171f22",

    THREElightBlue: new THREE.Color("#E9EFEF"),
    THREEnormalBlue: new THREE.Color("#48717F"),
    THREEdarkBlue: new THREE.Color("#29363C"),
    THREEdarkerBlue: new THREE.Color("#171f22"),
};

let VarLet = {
    loco_scroll: loco_scroll,
};

export { VarConst, VarLet }
