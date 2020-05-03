import DataMesh from "./DataMesh.js";

export default class Dataset {
    scene;
    dataMesh;
    dataQueue = [];

    constructor(globe, scene) {
        this.dataMesh = new DataMesh(globe);
        this.scene = scene;
    }

    async fetchData() {
        const response = await fetch('/population909500.json');
        const data = await response.json();
        for (let index=0;index<data.length;index++) {
            this._addData(data[index][1], {format: 'magnitude', name: data[index][0], animated: true});
        }
    }

    processDataQueue() {
        if(this.dataQueue.length > 0) {
            const dataPoint = this.dataQueue.shift();
            this.dataMesh.addPoint(
                dataPoint.latitude,
                dataPoint.longitude,
                dataPoint.size,
                dataPoint.color
            );
        }
    }

    _addData(data, opts) {
        let latitude, longitude, size, color, index, step, colorFnWrapper;
    
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
          latitude = data[index];
          longitude = data[index + 1];
          color = colorFnWrapper(data,index);
          size = data[index + 2];
          size = size * 200;
          this.dataQueue.push({latitude, longitude, size, color});
          this.dataMesh.addPoint(latitude, longitude, size, color);
        }

        this.scene.add(this.dataMesh.compoundMesh);
    }

    _colorFn (value) {
        var color = new THREE.Color();
        color.setHSL( ( 0.6 - ( value * 0.5 ) ), 1.0, 0.5 );
        return color;
    }
}
