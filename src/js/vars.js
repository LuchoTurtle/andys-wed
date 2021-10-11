import * as THREE from 'three'

const VarConst = {
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
};

export { VarConst, VarLet }
