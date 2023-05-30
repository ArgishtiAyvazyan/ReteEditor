import Rete from "rete";
import Socket from '../sockets'
import { NumControl } from '../controls/index'


export class AddComponent extends Rete.Component {
    constructor() {
        super("Add");
    }

    builder(node) {
        var inp1 = new Rete.Input('in1', "Number 1", Socket.numSocket);
        var inp2 = new Rete.Input('in2', "Number 2", Socket.numSocket);
        var out = new Rete.Output('out', "Output", Socket.numSocket);

        inp1.addControl(new NumControl(this.editor, 'num1'))
        inp2.addControl(new NumControl(this.editor, 'num2'))

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl(this.editor, 'preview', true))
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
        var n1 = inputs['in1'].length ? inputs['in1'][0] : node.data.num1;
        var n2 = inputs['in2'].length ? inputs['in2'][0] : node.data.num2;
        var sum = n1 + n2;

        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(sum);
        outputs['out'] = sum;
    }
}
