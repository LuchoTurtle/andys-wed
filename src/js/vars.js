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

    palette_darkblue: "#264653",
    palette_darkcyan: "#2A9D8F",
    palette_yellow: "#E9C46A",
    palette_orange: "#F4A261",
    palette_red: "#E76F51",


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
