import { Control } from 'rete';
import VueNumControl from './c-number.vue'
import VueImagePickerControl from './c-image.vue'

export class NumControl extends Control {

    constructor(emitter, key, readonly) {
        super(key);
        this.component = VueNumControl;
        this.props = { emitter, ikey: key, readonly };
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}


export class ImagePickerControl extends Control {
    constructor(key, emitter) {
        super(key)
        this.render = 'vue'
        this.component = VueImagePickerControl
        this.props = { emitter }
    }

    destroyed() {
        this.vueContext.destroyed()
    }
}