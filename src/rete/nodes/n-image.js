import { Component, Output } from 'rete'
import Socket from '../sockets'
import { ImagePickerControl } from '../controls/index'

export class ImageComponent extends Component {

    constructor() {
        super("image");
    }

    builder(node) {
        let out = new Output('o0', "Image", Socket.image, false);
        let imageCtrl = new ImagePickerControl("image-picker", this.editor); // The editor is the emitter
        
        return node
            .addControl(imageCtrl)
            .addOutput(out)
    }

    worker(node, inputs, outputs) {
        outputs['o0'] = node.data
    }
}