export default class DataMesh {
    templateMesh;
    compoundMesh;
    compoundGeometry;
    globe;

    constructor(globe) {
        this._createCompoundMesh();
        this._createDataPointTemplate();
        this.globe = globe;
    }

    _createCompoundMesh() {
        this.compoundGeometry = new THREE.Geometry();
        this.compoundMesh = new THREE.Mesh(this.compoundGeometry, new THREE.MeshBasicMaterial({
            color: 0xffffff,
            vertexColors: THREE.FaceColors,
            morphTargets: false
          }));
    }

    addPoint(lat, lng, size, color) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (180 - lng) * Math.PI / 180;
    
        this.templateMesh.position.x = 200 * Math.sin(phi) * Math.cos(theta);
        this.templateMesh.position.y = 200 * Math.cos(phi);
        this.templateMesh.position.z = 200 * Math.sin(phi) * Math.sin(theta);
    
        this.templateMesh.lookAt(this.globe.globeMesh.position);
    
        this.templateMesh.scale.z = Math.max( size, 0.1 ); // avoid non-invertible matrix
        this.templateMesh.updateMatrix();
    
        for (let index = 0; index < this.templateMesh.geometry.faces.length; index++) {
            this.templateMesh.geometry.faces[index].color = color;
    
        }
        if(!this.templateMesh.matrixAutoUpdate){
            this.templateMesh.updateMatrix();
        }
        this.compoundMesh.geometry.merge(this.templateMesh.geometry, this.templateMesh.matrix);
    }

    _createDataPointTemplate() {
        const geometry = new THREE.BoxGeometry(0.75, 0.75, 1);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-0.5));
        this.templateMesh = new THREE.Mesh(geometry);
    }
}