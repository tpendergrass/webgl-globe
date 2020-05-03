import GlobeSceneRenderer from "./classes/GlobeSceneRenderer.js";
const container = document.getElementById('container');
const scene = new GlobeSceneRenderer();
scene.createScene(container);
function animate() {
    requestAnimationFrame(animate);
    scene.render();
}

animate();
