import GlobeCamera from "./GlobeCamera.js"
import Globe from "./Globe.js"
import Controls from "./Controls.js"

class GlobeSceneRenderer {
    camera;
    globe;
    scene;
    renderer;
    target = { x: Math.PI*3/2, y: Math.PI / 6.0 };
    overRenderer = false;
    controls;
    container;
  
    createScene(containerElement) {
      this.container = containerElement;
      const width = this.container.offsetWidth || window.innerWidth;
      const height = this.container.offsetHeight || window.innerHeight;
  
      this.scene = new THREE.Scene();
      
      this.globe = new Globe();
      this.globe.addToScene(this.scene);
  
      this.camera = new GlobeCamera(width, height);
      this.createRenderer(width, height);
  
      this.container.appendChild(this.renderer.domElement);
      this.addEventListeners();
    }
  
    createRenderer(width, height) {
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(width, height);
  
      this.renderer.domElement.style.position = 'absolute';
    }
  
    addEventListeners() {
      this.controls = new Controls(this);
      this.container.addEventListener('mousedown', (event) => {this.controls.onMouseDown(event)}, false);
      this.container.addEventListener('mousewheel', (event) => {this.controls.onMouseWheel(event)}, false);
      this.container.addEventListener('mousemove', (event) => {this.controls.onMouseMove(event)}, false);
      this.container.addEventListener('mouseup', (event) => {this.controls.onMouseUp(event)}, false);
      document.addEventListener('keydown', (event) => {this.controls.onDocumentKeyDown(event)}, false);
      window.addEventListener('resize', (event) => {this.onWindowResize(event)}, false);
      this.container.addEventListener('mouseover', () => {
        this.overRenderer = true;
      }, false);
  
      this.container.addEventListener('mouseout', () => {
        this.overRenderer = false;
      }, false);
    }

    onWindowResize (event) {
      this.camera.setAspect(this.container.offsetWidth / this.container.offsetHeight);
      this.camera.camera.updateProjectionMatrix();
      this.renderer.setSize( this.container.offsetWidth, this.container.offsetHeight );
    }
  
    setColor(saturation) {
      const color = new THREE.Color();
      color.setHSL( ( 0.6 - ( saturation * 0.5 ) ), 1.0, 0.5 );
      return color;
    }

    render() {
        if(this.controls.slowRotate) {
          this.camera.target.x += 0.002;
        }
        this.camera.updateCamera();
        this.camera.lookAt(this.globe.globeMesh.position);
        this.renderer.render(this.scene, this.camera.camera);
    }
}

export default GlobeSceneRenderer;
