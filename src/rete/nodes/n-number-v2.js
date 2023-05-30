import { ClassicPreset } from "rete";
import socket from '../sockets'


export class NumberNode extends ClassicPreset.Node {
    constructor(initial, change) {
        super('Number');
        let out = new ClassicPreset.Output(socket, 'Number');
        this.addOutput('value', out);
        this.addControl(
            'numValue',
            new ClassicPreset.InputControl('number', { initial, change })
        );
    }
    data() {
        const value = this.controls['numValue'].value;

        return {
            value,
        };
    }
    clone = () => {
        return new NumberNode(this.controls['numValue'].value, this.change)
    }
}
