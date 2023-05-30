import { Component, Output } from 'rete'
import Socket from '../sockets'
import { NumControl } from '../controls/index'

export class NumComponent extends Component {

    constructor(){
        super("Number");
    }

    builder(node) {
        var out1 = new Output('numOut', "Input", Socket.numSocket);

        return node
            .addControl(new NumControl(this.editor, 'num'))
            .addOutput(out1);
    }

    worker(node, inputs, outputs) {
        outputs['numOut'] = node.data.num;
    }
}