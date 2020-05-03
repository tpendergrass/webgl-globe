export default class Dataset {
    templateMesh;
    compoundMesh;
    compoundGeometry;
    globe;

    constructor(globe, scene) {
        this._createCompoundMesh();
        this._createDataPointTemplate();
        this.globe = globe;
        this.scene = scene;
    }

    _createCompoundMesh() {
        this.compoundGeometry = new THREE.Geometry();
        this.compoundMesh = new THREE.Mesh(this.compoundGeometry, new THREE.MeshBasicMaterial({
            color: 0xffffff,
            vertexColors: THREE.FaceColors,
            morphTargets: false
          }));
    }

    fetchData() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/population909500.json', true);
        xhr.onreadystatechange = (event) => {
            if (xhr.readyState === 4) { // DONE
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    window.data = data;
                    for (let index=0;index<data.length;index++) {
                        this._addData(data[index][1], {format: 'magnitude', name: data[index][0], animated: true});
                    }
                }
            }
        };
        xhr.send(null);
    }

    _createDataPointTemplate() {
        const geometry = new THREE.BoxGeometry(0.75, 0.75, 1);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-0.5));
        this.templateMesh = new THREE.Mesh(geometry);
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
        if(this.templateMesh.matrixAutoUpdate){
            this.templateMesh.updateMatrix();
        }
        this.compoundGeometry.merge(this.templateMesh.geometry, this.templateMesh.matrix);
    }

    _addData(data, opts) {
        let lat, lng, size, color, index, step, colorFnWrapper;
    
        opts.format = opts.format || 'magnitude'; // other option is 'legend'
        if (opts.format === 'magnitude') {
          step = 3;
          colorFnWrapper = (data, i) => { return this._colorFn(data[i+2]); }
        } else if (opts.format === 'legend') {
          step = 4;
          colorFnWrapper = (data, i) => { return this._colorFn(data[i+3]); }
        } else {
          throw('error: format not supported: '+opts.format);
        }

        for (index = 0; index < data.length; index += step) {
          lat = data[index];
          lng = data[index + 1];
          color = colorFnWrapper(data,index);
          size = data[index + 2];
          size = size * 200;
          this.addPoint(lat, lng, size, color);
        }

        this.scene.add(this.compoundMesh);
    }

    _colorFn (value) {
        var color = new THREE.Color();
        color.setHSL( ( 0.6 - ( value * 0.5 ) ), 1.0, 0.5 );
        return color;
    }
}
