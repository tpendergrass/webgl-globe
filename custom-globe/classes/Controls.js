import Settings from "./Settings.js";

export default class Controls {
    constructor(sceneRenderer) {
        this.renderer = sceneRenderer
        this.mouse = { x: 0, y: 0 };
        this.mouseOnDown = { x: 0, y: 0 };
        this.targetOnDown = { x: 0, y: 0 };
        this.zoomDamp = Settings.DISTANCE_FROM_GLOBE/1000;
        this.mouseDown = false;
        this.slowRotate = true;
    }

    onMouseDown (event) {
        event.preventDefault();
        this.mouseDown = true;
        this.slowRotate = false;

        this.mouseOnDown.x = - event.clientX;
        this.mouseOnDown.y = event.clientY;

        this.targetOnDown.x = this.renderer.camera.target.x;
        this.targetOnDown.y = this.renderer.camera.target.y;

        this.renderer.container.style.cursor = 'move';
    }

    onMouseMove(event) {
        if(!this.mouseDown) {
            return;
        }
        this.mouse.x = - event.clientX;
        this.mouse.y = event.clientY;

        this.renderer.camera.updateTarget(
            this.targetOnDown.x + this.dampenMouseMovement((this.mouse.x - this.mouseOnDown.x)),
            this.targetOnDown.y + this.dampenMouseMovement((this.mouse.y - this.mouseOnDown.y))
        );
    }

    dampenMouseMovement(value) {
        return value * 0.005 * this.renderer.camera.distance/1000;
    }

    onMouseUp(event) {
        this.mouseDown = false;
        this.renderer.container.style.cursor = 'auto';
    }

    onMouseWheel (event) {
        event.preventDefault();
        if (this.renderer.overRenderer) {
            this.renderer.camera.zoom(event.wheelDeltaY * 0.3);
        }
        return false;
    }

    onDocumentKeyDown (event) {
        switch (event.keyCode) {
            case 38: // upArrow
                this.zoom(100);
                event.preventDefault();
                break;
            case 40: // downArrow
                this.zoom(-100);
                event.preventDefault();
                break;
          }
    }
}
