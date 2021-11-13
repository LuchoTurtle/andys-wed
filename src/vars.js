import * as THREE from 'three'

const VarConst = {
    // Initial loading container
    loaderContainer: document.querySelector('.loading-wrapper'),
    loadingLine: document.querySelector('.loading-line'),
    loadValue: document.querySelector('.load-value'),
    loadingText: document.querySelector('.loading-text'),
    doneText: document.querySelector('.done-text'),

    // Mesh positions
    landimMesh_initial_position_z: 0,

    bridgeMesh_initial_position_y: -60,
    bridgeMesh_initial_position_z: -17.69,

    knotMesh_initial_position_y: -7.69,
    knotMesh_initial_position_x: -9.24,

    champagneMesh_initial_position_y: -5.6,
    champagneMesh_initial_position_x: -12.26,
    champagneMesh_initial_rotation_z: Math.PI / 2,

    danielsMesh_initial_position_y: -5.6,
    danielsMesh_initial_position_x: -11.61,

    wineMesh_initial_position_y: -5.6,
    wineMesh_initial_position_x: -11.61,

    hennessyMesh_initial_position_y: -5.6,
    hennessyMesh_initial_position_x: -11.61,

    envelopeMesh_initial_position_y: 4,
    envelopeMesh_initial_position_x: -10,
    envelopeMesh_initial_position_z: 0.5,

    // Mouse
    mouse: new THREE.Vector2()
};

let VarLet = {
    loadCompleted: false,

    // Materials
    bakedMaterialLandim: null,
    poleLightMaterialLandim: null,
    bakedMaterialBridge : null,
    bakedMaterialKnot : null,
    bakedMaterialChampagne : null,
    bakedMaterialDaniels: null,
    bakedMaterialWine : null,
    bakedMaterialHennessy: null,
    bakedMaterialEnvelope: null,

    // Meshes
    landimMesh: null,   // it is used in both 404 and landing page
    bridgeMesh: null,
    knotMesh: null,
    champagneMesh: null,
    danielsMesh: null,
    wineMesh: null,
    hennessyMesh: null,
    envelopeMesh: null,
    envelopeBakedMat: null
};


/**
 * Initializes variables according to screen height and width.
 * This affects the scrolling THREE.js experience because it sets the starting points of 3D objects.
 */
function screenMeshPositionInitialization() {
    /* ------- Width --------- */

    // Mobile S
    if (screen.width <= 320) {
        VarConst.landimMesh_initial_position_z = -6;
        VarConst.bridgeMesh_initial_position_z = -31.78;
        VarConst.knotMesh_initial_position_x = -6.9;
        VarConst.champagneMesh_initial_position_x = -11.26;
        VarConst.danielsMesh_initial_position_x = -11.26;
        VarConst.wineMesh_initial_position_x = -10.26;
        VarConst.hennessyMesh_initial_position_x = -11.9;
        VarConst.envelopeMesh_initial_position_x = -9.2;
        VarConst.envelopeMesh_initial_position_z = -0.93;
        VarConst.envelopeMesh_initial_position_y = 3.2;
    }
    // Mobile M
    else if (screen.width <= 375) {
        VarConst.landimMesh_initial_position_z = -6;
        VarConst.bridgeMesh_initial_position_z = -31.78;
        VarConst.knotMesh_initial_position_x = -7;
        VarConst.champagneMesh_initial_position_x = -11.26;
        VarConst.danielsMesh_initial_position_x = -10.26;
        VarConst.wineMesh_initial_position_x = -10.26;
        VarConst.hennessyMesh_initial_position_x = -11.9;
        VarConst.envelopeMesh_initial_position_x = -9.2;
        VarConst.envelopeMesh_initial_position_z = -0.93;
        VarConst.envelopeMesh_initial_position_y = 3.2;
    }
    // Mobile L
    else if (screen.width <= 425) {
        VarConst.landimMesh_initial_position_z = -6;
        VarConst.bridgeMesh_initial_position_z = -31.78;
        VarConst.knotMesh_initial_position_x = -7;
        VarConst.champagneMesh_initial_position_x = -11.26;
        VarConst.danielsMesh_initial_position_x = -10.26;
        VarConst.wineMesh_initial_position_x = -10.26;
        VarConst.hennessyMesh_initial_position_x = -11.9;
        VarConst.envelopeMesh_initial_position_x = -9.2;
        VarConst.envelopeMesh_initial_position_z = -0.93;
        VarConst.envelopeMesh_initial_position_y = 3.2;
    }
    // Tablet
    else if (screen.width <= 768) {
        VarConst.landimMesh_initial_position_z = -3;
        VarConst.bridgeMesh_initial_position_z = -31.78;
        VarConst.knotMesh_initial_position_x = -7;
        VarConst.champagneMesh_initial_position_x = -12.26;
        VarConst.danielsMesh_initial_position_x = -11.26;
        VarConst.wineMesh_initial_position_x = -10.26;
        VarConst.hennessyMesh_initial_position_x = -11.9;
        VarConst.envelopeMesh_initial_position_y = 3.2;
        if (screen.width === 768) VarConst.envelopeMesh_initial_position_y = 4;
    }
    // Laptop
    else if (screen.width <= 1024) {
        VarConst.knotMesh_initial_position_x = -8.30;
        VarConst.champagneMesh_initial_position_x = -12;
        VarConst.envelopeMesh_initial_position_y = 4;
    }
    // Laptop L
    else if (screen.width <= 1440) {
        VarConst.knotMesh_initial_position_x = -8.30;
        VarConst.envelopeMesh_initial_position_y = 4;
    } else if(screen.width <= 2560) {
        VarConst.knotMesh_initial_position_x = -8.30;
        VarConst.envelopeMesh_initial_position_y = 4;
    }


    /* ------- Height --------- */
    if (screen.height <= 600) {
        VarConst.bridgeMesh_initial_position_y = -45;
        VarConst.knotMesh_initial_position_y = -3;
        VarConst.champagneMesh_initial_position_y = -2;
        VarConst.danielsMesh_initial_position_y = -2;
        VarConst.wineMesh_initial_position_y = -2;
        VarConst.hennessyMesh_initial_position_y = -2;
    }
    else if (screen.height <= 720) {
        VarConst.bridgeMesh_initial_position_y = -45;
        VarConst.knotMesh_initial_position_y = -5;
        VarConst.champagneMesh_initial_position_y = -3;
        VarConst.danielsMesh_initial_position_y = -3;
        VarConst.wineMesh_initial_position_y = -3;
        VarConst.hennessyMesh_initial_position_y = -3;
    }
    else if (screen.height <= 900) {
        VarConst.bridgeMesh_initial_position_y = -35;
        VarConst.knotMesh_initial_position_y = -6;
        VarConst.champagneMesh_initial_position_y = -4.5;
        VarConst.danielsMesh_initial_position_y = -4.5;
        VarConst.wineMesh_initial_position_y = -4.5;
        VarConst.hennessyMesh_initial_position_y = -4.5;
    }
    else if (screen.height <= 1080) {
        VarConst.bridgeMesh_initial_position_y = -45;
        VarConst.knotMesh_initial_position_y = -8;
        VarConst.champagneMesh_initial_position_y = -6.5;
        VarConst.danielsMesh_initial_position_y = -6.5;
        VarConst.wineMesh_initial_position_y = -6.5;
        VarConst.hennessyMesh_initial_position_y = -6.5;
    }
    else if (screen.height <= 1440) {
        VarConst.knotMesh_initial_position_y = -13;
        VarConst.champagneMesh_initial_position_y = -11.3;
        VarConst.danielsMesh_initial_position_y = -11.3;
        VarConst.wineMesh_initial_position_y = -11.3;
        VarConst.hennessyMesh_initial_position_y = -11.3;
    }
    else if (screen.height <= 2160) {
        VarConst.bridgeMesh_initial_position_y = -100;
        VarConst.knotMesh_initial_position_y = -20;
        VarConst.champagneMesh_initial_position_y = -15.3;
        VarConst.danielsMesh_initial_position_y = -15.3;
        VarConst.wineMesh_initial_position_y = -15.3;
        VarConst.hennessyMesh_initial_position_y = -15.3;
    }
    else {
        VarConst.bridgeMesh_initial_position_y = -150;
        VarConst.knotMesh_initial_position_y = -23;
        VarConst.danielsMesh_initial_position_y = -18.3;
        VarConst.wineMesh_initial_position_y = -18.3;
        VarConst.hennessyMesh_initial_position_y = -18.3;
    }
}


/**
 * Update mouse cursor positions
 */
document.addEventListener("mousemove", e => {
    VarConst.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    VarConst.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

export { VarConst, VarLet, screenMeshPositionInitialization }
