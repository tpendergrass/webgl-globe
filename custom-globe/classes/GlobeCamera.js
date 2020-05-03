import Settings from "./Settings.js";
import Constants from "./Constants.js";

export default class GlobeCamera {
  camera
  rotation = { x: 0, y: 0 };
  distance = Settings.DISTANCE_FROM_GLOBE;
  distanceTarget = 100000;
  target = { x: Math.PI*3/2, y: Math.PI / 6.0 };

  constructor(renderWidth, renderHeight) {
    this.camera = new THREE.PerspectiveCamera(
      30,
      renderWidth / renderHeight,
      1, 
      100000
    );
    this.camera.position.z = Settings.DISTANCE_FROM_GLOBE;
  }

  lookAt(position) {
      this.camera.lookAt(position);
  }

  updateTarget(x, y) {
    this.target.x = x;
    this.target.y = y;

    this.target.y = this.target.y > Constants.PI_HALF ? Constants.PI_HALF : this.target.y;
    this.target.y = this.target.y < - Constants.PI_HALF ? - Constants.PI_HALF : this.target.y;
  }

  setAspect(value) {
    this.camera.aspect = value;
  }

  updateCamera() {
    this.clampZoom();

    this.rotation.x += (this.target.x - this.rotation.x) * 0.1;
    this.rotation.y += (this.target.y - this.rotation.y) * 0.1;
    this.distance += (this.distanceTarget - this.distance) * 0.3;

    this.camera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
    this.camera.position.y = this.distance * Math.sin(this.rotation.y);
    this.camera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);
  }

  clampZoom() {
    this.distanceTarget = this.distanceTarget > 1000 ? 1000 : this.distanceTarget;
    this.distanceTarget = this.distanceTarget < 350 ? 350 : this.distanceTarget;
  }

  zoom(delta) {
    this.distanceTarget -= delta;
  }
}
