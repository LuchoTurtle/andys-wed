import * as THREE from "three";
import {VarLet} from "../vars";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


/**
 * THREE.js scene, with all the meshes and loaders to set up the site 3D experience.
 */
export default class NotFoundExperience {
    /**
     * Creates experience object.
     * @param canvas canvas HTML element.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.camera = this._setupCamera();
        this.renderer = this._setupRenderer()
    }

    /**
     * Creates and sets up camera.
     * @returns {PerspectiveCamera} a Three.js perspective camera set up in a specific Vec3 space point.
     * @private
     */
    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 75);
        camera.position.set(-15, 1, -10);
        this.scene.add(camera);

        return camera
    }

    /**
     * Creates renderer object and binds it with a canvas object.
     * @returns {WebGLRenderer} a Three.js rendered that is also encoded.
     * @private
     */
    _setupRenderer() {
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            canvas: this.canvas,
            antialias: true
        });
        renderer.setSize(this.sizes.width, this.sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputEncoding = THREE.sRGBEncoding;
        return renderer
    }

    /**
     * Loads all GLB model files and their baked textures.
     * It has a LoadingManager that updates the progress variables accordingly for the loading animation on site start-up.
     * After the loading is finished, it sets the "VarLet.loadCompleted" to true.
     */
    loadFiles() {
        const renderer = this.renderer;

        // Texture loader
        const textureLoader = new THREE.TextureLoader();

        // GLTF loader
        const gltfLoader = new GLTFLoader();

        /**
         * Textures and materials and models
         */
        textureLoader.load('3D/landim/baked2.jpg',
            (bakedTextureLandim) => {
                bakedTextureLandim.flipY = false;
                bakedTextureLandim.encoding = THREE.sRGBEncoding;

                VarLet.bakedMaterialLandim = new THREE.MeshBasicMaterial({
                    map: bakedTextureLandim
                });
                VarLet.poleLightMaterialLandim = new THREE.MeshBasicMaterial({color: new THREE.Color("rgb(255, 125, 69)")});

                renderer.initTexture(bakedTextureLandim);

                gltfLoader.load('3D/landim/merged.glb',
                    (gltf) =>  {

                        VarLet.landimMesh = gltf.scene;

                        // Adding baked textures and emission lights to model
                        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'merged');
                        bakedMesh.material = VarLet.bakedMaterialLandim;

                        const poleLightAMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleA');
                        const poleLightBMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleB');
                        const poleLightCMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleC');
                        const poleLightDMesh = gltf.scene.children.find(obj => obj.name === 'lightPoleD');

                        poleLightAMesh.material = VarLet.poleLightMaterialLandim;
                        poleLightBMesh.material = VarLet.poleLightMaterialLandim;
                        poleLightCMesh.material = VarLet.poleLightMaterialLandim;
                        poleLightDMesh.material = VarLet.poleLightMaterialLandim;

                        VarLet.landimMesh.position.y = -6;

                        this.scene.add(VarLet.landimMesh);
                    }
                );
            });
    }

    /**
     * Adds a resize handler and updates the renderer and camera settings when the viewport/window is is resized.
     */
    addResizeHandler() {
        window.addEventListener('resize', () => {
            // Update sizes
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;

            // Update camera
            this.camera.aspect = this.sizes.width / this.sizes.height;
            this.camera.updateProjectionMatrix();

            // Update renderer
            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        });
    }

    /**
     * Adds orbital controls and returns the object.
     * @returns {OrbitControls} OrbitalControl object
     */
    addOrbitalControls() {
        const controls = new OrbitControls(this.camera, this.canvas);
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI/2;
        controls.minPolarAngle = 0;
        return controls
    }

}
