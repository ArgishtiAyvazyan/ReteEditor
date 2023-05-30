import socket from '../sockets'
import { ClassicPreset } from "rete";

export class AddNode extends ClassicPreset.Node {
    constructor(change) {
        super('Add');
        const left = new ClassicPreset.Input(socket, 'Left')
        const right = new ClassicPreset.Input(socket, 'Right')

        left.addControl(new ClassicPreset.InputControl('number', { initial: 0, change }))
        right.addControl(new ClassicPreset.InputControl('number', { initial: 0, change }))

        this.addInput('left', left);
        this.addInput('right', right);
        // this.addOutput('addOut', new ClassicPreset.Output(socket, 'Number'));
        this.addControl('result', new ClassicPreset.InputControl('number', { initial: 0, readonly: true }));
    }
    data(inputs) {
        const { left = [], right = [] } = inputs;
        const leftControl = this.inputs['left'].control
        const rightControl = this.inputs['right'].control
        const sum = (left[0] || leftControl.value) + (right[0] || rightControl.value);

        this.controls['result'].setValue(sum);

        return {
            value: sum,
        };
    }
    clone = () => {
        return new AddNode(this.change)
    }
}