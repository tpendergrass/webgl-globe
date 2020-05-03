import GlobeSceneRenderer from "./classes/GlobeSceneRenderer.js";
import Dataset from "./classes/Dataset.js";

const container = document.getElementById('container');
const scene = new GlobeSceneRenderer();

scene.createScene(container);

const data = new Dataset(scene.globe, scene.scene);
data.fetchData();

window.data = data;
function animate() {
    requestAnimationFrame(animate);
    // data.processDataQueue();
    scene.render();
}

animate();
