import Shaders from "./Shaders.js";

export default class Globe {
    IMG_DIR = '/'
    globeMesh
    atmosphereMesh
    constructor(opts = {}) {
      this._createGlobe();
      this._createAtmosphere();
    }
  
    addToScene(scene) {
      scene.add(this.globeMesh);
      scene.add(this.atmosphereMesh);
    }
  
    _createGlobe() {
      const geometry = new THREE.SphereGeometry(200, 40, 30);      
      const material = this._getGlobeMaterial();
  
      this.globeMesh = new THREE.Mesh(geometry, material);
      this.globeMesh.rotation.y = 4.8;
    }

    _getBasicMaterial() {
      return new THREE.MeshBasicMaterial();
    }

    _getGlobeMaterial() {
      const shader = Shaders.EARTH;
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
      uniforms['texture'].value = THREE.ImageUtils.loadTexture(this.IMG_DIR+'world.jpg');
      return new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader

      });
    }
  
    _createAtmosphere() {
      const geometry = new THREE.SphereGeometry(200, 40, 30);
      const shader = Shaders.ATMOSPHERE;
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
  
      const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
          });
  
      this.atmosphereMesh = new THREE.Mesh(geometry, material);
      this.atmosphereMesh.scale.set( 1.1, 1.1, 1.1 );
    }
}
