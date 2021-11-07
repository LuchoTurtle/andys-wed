import * as THREE from "three";
import {VarConst, VarLet} from "../vars";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";

/**
 * THREE.js scene, with all the meshes and loaders to set up the site 3D experience.
 */
export default class Experience {
    /**
     * Creates experience object.
     * @param canvas canvas HTML element.
     * @param scroll_trigger modified ScrollTrigger object that is compatible with Loco Scroll
     * @param loco_scroll modified Locomotive Scroll object that is compatible with ScrollTrigger.
     */
    constructor(canvas, scroll_trigger, loco_scroll) {
        this.canvas = canvas;
        this.scroll_trigger = scroll_trigger;
        this.loco_scroll = loco_scroll;
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
        const camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
        camera.rotation.y = -Math.PI / 4;
        camera.position.set(-12.4, 4.1, 2.3);
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
        // Loading manager
        const manager = new THREE.LoadingManager();
        manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            const progressValue =  itemsLoaded/itemsTotal;
            const progressValue100 = Math.floor(progressValue*100);
            VarConst.loadingLine.style.transform = `scale(${progressValue})`;

            if(progressValue100 < 10) {
                VarConst.loadValue.innerText = `00${ progressValue100}`
            } else if(progressValue100 < 100) {
                VarConst.loadValue.innerText = `0${ progressValue100}`
            } else {
                VarConst.loadValue.innerText = `${ progressValue100}`
            }
        };
        manager.onLoad = function ( ) {
            VarLet.loadCompleted = true;
            gsap.to(VarConst.loadingText, { duration: .5, opacity: 0 });
            gsap.to(VarConst.doneText, { duration: .5, opacity: 1 });
            gsap.to(VarConst.loaderContainer, { duration: 1, yPercent: -200, ease: "power2.in", delay: 1.8 });
        };

        // Texture loader
        const textureLoader = new THREE.TextureLoader(manager);

        // GLTF loader
        const gltfLoader = new GLTFLoader(manager);

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

                        this.scene.add(VarLet.landimMesh);
                    }
                );
            });

        textureLoader.load('3D/bridge/baked2.jpg',
            (bakedTextureBridge) => {
                bakedTextureBridge.flipY = false;
                bakedTextureBridge.encoding = THREE.sRGBEncoding;

                VarLet.bakedMaterialBridge = new THREE.MeshBasicMaterial({
                    map: bakedTextureBridge
                });

                gltfLoader.load('3D/bridge/bridge.glb',
                    (gltf) =>  {

                        // Adding baked textures and emission lights to model
                        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'bridge');
                        bakedMesh.material = VarLet.bakedMaterialBridge;

                        bakedMesh.position.x = 16.99;
                        bakedMesh.position.z = VarConst.bridgeMesh_initial_position_z;
                        //bakedMesh.position.y = VarConst.bridgeMesh_initial_position_y;

                        bakedMesh.rotation.x = -0.45;
                        bakedMesh.rotation.y = 1.18;
                        bakedMesh.rotation.z = 1.18;

                        VarLet.bridgeMesh = gltf.scene;

                        this.scene.add(VarLet.bridgeMesh);
                    }
                );
            });

        textureLoader.load('3D/knot/baked.jpg',
            (bakedTextureKnot) => {
                bakedTextureKnot.flipY = false;
                bakedTextureKnot.encoding = THREE.sRGBEncoding;

                VarLet.bakedMaterialKnot = new THREE.MeshBasicMaterial({
                    map: bakedTextureKnot
                });

                gltfLoader.load('3D/knot/knot.glb',
                    (gltf) =>  {

                        VarLet.knotMesh = gltf.scene;

                        // Adding baked textures and emission lights to model
                        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'knot');
                        bakedMesh.material = VarLet.bakedMaterialKnot;

                        VarLet.knotMesh.position.x = VarConst.knotMesh_initial_position_x;
                        VarLet.knotMesh.position.y = VarConst.knotMesh_initial_position_y;
                        VarLet.knotMesh.position.z = -1.87;

                        VarLet.knotMesh.rotation.x = 1.05;
                        VarLet.knotMesh.rotation.y = -5.76;
                        VarLet.knotMesh.rotation.z = 0.18;

                        this.scene.add(VarLet.knotMesh);
                    }
                );
            });

        textureLoader.load('3D/bottles/baked_champagne.jpg',
            (bakedTextureChampagne) => {
                bakedTextureChampagne.flipY = false;
                bakedTextureChampagne.encoding = THREE.sRGBEncoding;

                VarLet.bakedMaterialChampagne = new THREE.MeshBasicMaterial({
                    map: bakedTextureChampagne
                });

                gltfLoader.load('3D/bottles/champagne.glb',
                    (gltf) =>  {

                        VarLet.champagneMesh = gltf.scene;

                        // Adding baked textures and emission lights to model
                        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'Champagne');
                        bakedMesh.material = VarLet.bakedMaterialChampagne;

                        VarLet.champagneMesh.position.x = VarConst.champagneMesh_initial_position_x;
                        VarLet.champagneMesh.position.y = VarConst.champagneMesh_initial_position_y;
                        VarLet.champagneMesh.position.z = 1.45;

                        VarLet.champagneMesh.rotation.x = -0.32;
                        VarLet.champagneMesh.rotation.y = -1.13;
                        VarLet.champagneMesh.rotation.z = VarConst.champagneMesh_initial_rotation_z;

                        this.scene.add(VarLet.champagneMesh);
                    }
                );
            });

        textureLoader.load('3D/bottles/daniels_baked.jpg',
            (bakedTextureDaniels) => {
                bakedTextureDaniels.flipY = false;
                bakedTextureDaniels.encoding = THREE.sRGBEncoding;

                VarLet.bakedMaterialDaniels = new THREE.MeshBasicMaterial({
                    map: bakedTextureDaniels
                });

                gltfLoader.load('3D/bottles/daniels.glb',
                    (gltf) =>  {

                        VarLet.danielsMesh = gltf.scene;

                        // Adding baked textures and emission lights to model
                        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'daniels');
                        bakedMesh.material = VarLet.bakedMaterialDaniels;

                        VarLet.danielsMesh.position.x = VarConst.danielsMesh_initial_position_x;
                        VarLet.danielsMesh.position.y = VarConst.danielsMesh_initial_position_y;
                        VarLet.danielsMesh.position.z = 2.1;

                        VarLet.danielsMesh.rotation.x = 0.09;
                        VarLet.danielsMesh.rotation.y = 4.45;
                        VarLet.danielsMesh.rotation.z = 0.74;

                        this.scene.add(VarLet.danielsMesh);
                    }
                );
            });

        textureLoader.load('3D/bottles/wine_baked.jpg',
            (bakedTextureWine) => {
                bakedTextureWine.flipY = false;
                bakedTextureWine.encoding = THREE.sRGBEncoding;

                VarLet.bakedMaterialWine = new THREE.MeshBasicMaterial({
                    map: bakedTextureWine
                });

                gltfLoader.load('3D/bottles/wine.glb',
                    (gltf) =>  {

                        VarLet.wineMesh = gltf.scene;

                        // Adding baked textures and emission lights to model
                        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'Wine');
                        bakedMesh.material = VarLet.bakedMaterialWine;

                        VarLet.wineMesh.position.x = VarConst.wineMesh_initial_position_x;
                        VarLet.wineMesh.position.y = VarConst.wineMesh_initial_position_y;
                        VarLet.wineMesh.position.z = 1.0;

                        VarLet.wineMesh.rotation.x = -5.9;
                        VarLet.wineMesh.rotation.y = -1.68;
                        VarLet.wineMesh.rotation.z = 0.04;

                        this.scene.add(VarLet.wineMesh);
                    }
                );
            });

        textureLoader.load('3D/bottles/henessy_baked.jpg',
            (bakedTextureHennessy) => {
                bakedTextureHennessy.flipY = false;
                bakedTextureHennessy.encoding = THREE.sRGBEncoding;

                VarLet.bakedMaterialHennessy = new THREE.MeshBasicMaterial({
                    map: bakedTextureHennessy
                });

                gltfLoader.load('3D/bottles/henessy.glb',
                    (gltf) =>  {

                        VarLet.hennessyMesh = gltf.scene;

                        // Adding baked textures and emission lights to model
                        const bakedMesh = gltf.scene.children.find(obj => obj.name === 'Hennessy');
                        bakedMesh.material = VarLet.bakedMaterialHennessy;

                        VarLet.hennessyMesh.position.x = VarConst.hennessyMesh_initial_position_x;
                        VarLet.hennessyMesh.position.y = VarConst.hennessyMesh_initial_position_y;
                        VarLet.hennessyMesh.position.z = 1.66;

                        VarLet.hennessyMesh.rotation.x = -5.9;
                        VarLet.hennessyMesh.rotation.y = 0.18;
                        VarLet.hennessyMesh.rotation.z = 0.04;

                        this.scene.add(VarLet.hennessyMesh);
                    }
                );
            });

        textureLoader.load('3D/envelope/baked.jpg',
            (bakedTextureEnvelope) => {
                bakedTextureEnvelope.flipY = false;
                bakedTextureEnvelope.encoding = THREE.sRGBEncoding;

                VarLet.bakedMaterialEnvelope = new THREE.MeshBasicMaterial({
                    map: bakedTextureEnvelope
                });

                gltfLoader.load('3D/envelope/envelope.glb',
                    (gltf) =>  {

                        VarLet.envelopeMesh = gltf.scene;

                        // Adding baked textures and emission lights to model
                        VarLet.envelopeBakedMat = gltf.scene.children.find(obj => obj.name === 'envelope');
                        VarLet.envelopeBakedMat.material = VarLet.bakedMaterialEnvelope;
                        VarLet.envelopeBakedMat.material.transparent = true;
                        VarLet.envelopeBakedMat.material.opacity = 0;

                        VarLet.envelopeMesh.position.x = VarConst.envelopeMesh_initial_position_x;
                        VarLet.envelopeMesh.position.y = VarConst.envelopeMesh_initial_position_y;
                        VarLet.envelopeMesh.position.z = VarConst.envelopeMesh_initial_position_z;

                        VarLet.envelopeMesh.rotation.x = -3.449;
                        VarLet.envelopeMesh.rotation.y = 2.272;
                        VarLet.envelopeMesh.rotation.z = 3.4;

                        // Opacity animation
                        if(this.scroll_trigger) {
                            this.scroll_trigger.create({
                                trigger: document.getElementsByClassName("rsvp")[0],
                                scrub: true,
                                start: "top 70%",
                                onEnter: () => gsap.to(VarLet.envelopeBakedMat.material, { opacity: 1, ease: "power1.in", immediateRender: false }),
                                onLeave: () => gsap.to(VarLet.envelopeBakedMat.material, { opacity: 0, ease: "power4.out", immediateRender: false }),
                                onLeaveBack: () => gsap.to(VarLet.envelopeBakedMat.material, { opacity: 0, ease: "power4.out", immediateRender: false }),
                                onEnterBack: () => gsap.to(VarLet.envelopeBakedMat.material, { opacity: 1, ease: "power1.in", immediateRender: false })
                            });
                        }

                        this.scene.add(VarLet.envelopeMesh);
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
     * Makes the models move when the user is scrolling the page. It binds the Locomotive Scroll scroll event .
     * Should only be called after the initial positions of models are properly initialized.
     */
    modelsAnimations() {
        // Landim
        const moveLandimMesh = ({x, y}) => {
            if(VarLet.landimMesh && VarConst.landimMesh_initial_position_z !== undefined && VarLet.landimMesh) {
                const distance_from_top = y;
                VarLet.landimMesh.position.z = VarConst.landimMesh_initial_position_z + (distance_from_top * 0.02);
            }
        };

        // Bridge
        const moveBridgeMesh = ({x, y}) => {
            if(VarLet.bridgeMesh && VarConst.bridgeMesh_initial_position_y !== undefined && VarLet.bridgeMesh) {
                const distance_from_top = y;
                VarLet.bridgeMesh.position.y = VarConst.bridgeMesh_initial_position_y + (distance_from_top * 0.02);
            }
        };

        // Knot
        const moveKnotMesh = ({x, y}) => {
            if(VarLet.knotMesh && VarConst.knotMesh_initial_position_y !== undefined && VarLet.knotMesh) {
                const distance_from_top = y;
                VarLet.knotMesh.position.y = VarConst.knotMesh_initial_position_y + (distance_from_top * 0.002);
            }
        };

        // Champagne
        const moveChampagneMesh = ({x, y}) => {
            if(VarLet.champagneMesh && VarConst.champagneMesh_initial_position_y !== undefined && VarLet.knotMesh) {
                const distance_from_top = y;
                VarLet.champagneMesh.position.y = VarConst.champagneMesh_initial_position_y + (distance_from_top * 0.001);
                VarLet.champagneMesh.rotation.z = VarConst.champagneMesh_initial_rotation_z + (distance_from_top * 0.001);
            }
        };

        // Daniels
        const moveDanielsMesh = ({x, y}) => {
            if(VarLet.danielsMesh && VarConst.danielsMesh_initial_position_y !== undefined && VarLet.knotMesh) {
                const distance_from_top = y;
                VarLet.danielsMesh.position.y = VarConst.danielsMesh_initial_position_y + (distance_from_top * 0.001);
            }
        };

        // Wine
        const moveWineMesh = ({x, y}) => {
            if(VarLet.wineMesh && VarConst.wineMesh_initial_position_y !== undefined && VarLet.knotMesh) {
                const distance_from_top = y;
                VarLet.wineMesh.position.y = VarConst.wineMesh_initial_position_y + (distance_from_top * 0.001);
            }
        };

        // Hennessy
        const moveHennesyMesh = ({x, y}) => {
            if(VarLet.hennessyMesh && VarConst.hennessyMesh_initial_position_y !== undefined && VarLet.knotMesh) {
                const distance_from_top = y;
                VarLet.hennessyMesh.position.y = VarConst.hennessyMesh_initial_position_y + (distance_from_top * 0.001);
            }
        };


        // Add animations on locomotive scroll
        this.loco_scroll.on("scroll", ({currentElements, delta, limit, scroll, speed})=> {
            moveLandimMesh(scroll);
            moveBridgeMesh(scroll);
            moveKnotMesh(scroll);
            moveChampagneMesh(scroll);
            moveDanielsMesh(scroll);
            moveWineMesh(scroll);
            moveHennesyMesh(scroll);
        });
    }

    /**
     * Adds axis helper (for debug purposes)
     */
    addHelper() {
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
    }

}
