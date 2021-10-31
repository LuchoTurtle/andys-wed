import * as THREE from 'three'

const VarConst = {
    /* Loading */
    loaderContainer: document.querySelector('.loading-wrapper'),
    loadingLine: document.querySelector('.loading-line'),
    loadValue: document.querySelector('.load-value'),
    loadingText: document.querySelector('.loading-text'),
    doneText: document.querySelector('.done-text'),

    mouse: new THREE.Vector2()
};

let VarLet = {
    loadCompleted: false,

    // Meshes
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
};

export { VarConst, VarLet }
