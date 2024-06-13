<template>
    <div>
        <h3 class="mb-4">This is an editor</h3>
        <b-row class="mb-2 justify-content-md-center">
            <b-button variant="outline-primary" @click="addNodes(2, 5)" class="mr-2">Add 10 nodes</b-button>
            <b-button variant="outline-primary" @click="addNodes(4, 5)" class="mr-2">Add 20 nodes</b-button>
            <b-button variant="outline-primary" @click="addNodes(10, 5)" class="mr-2">Add 150 nodes</b-button>
            <b-button variant="outline-primary" @click="addNodes(10, 10)" class="mr-2">Add 300 nodes</b-button>
            <b-button variant="outline-primary" @click="addNodes(20, 10)" class="mr-2">Add 600 nodes</b-button>
            <b-button variant="outline-primary" @click="addNodes(20, 10)" class="mr-2">Add 1200 nodes</b-button>
        </b-row>
        <div class="rete" ref="rete"></div>
        <!-- <div class="editor-wrapper" ref="background">
            <div id="rete"></div>
        </div> -->
    </div>
</template>
<script>
import "@babel/polyfill";

import { ClassicPreset, NodeEditor } from "rete";
import { VuePlugin, Presets as VuePresets } from "rete-vue-plugin/vue2";
import { AreaExtensions, AreaPlugin } from "rete-area-plugin"
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin"
import { DataflowEngine } from "rete-engine"
import { ContextMenuPlugin, Presets as ContextMenuPresets } from "rete-context-menu-plugin"
import { MinimapPlugin } from "rete-minimap-plugin";
import {
  ReroutePlugin,
  RerouteExtensions,
} from 'rete-connection-reroute-plugin';


// import nodes
// import { NumComponent } from "@/rete/nodes/n-number"
// import { AddComponent } from "@/rete/nodes/n-add"
// import { ImageComponent } from "@/rete/nodes/n-image";
// import Socket from '../rete/sockets'

import { NumberNode } from "@/rete/nodes/n-number-v2";
import { AddNode } from "@/rete/nodes/n-add-v2";
class Connection extends ClassicPreset.Connection { }

export default {
    name: 'VanillaEditor',
    data() {
        return {
            editor: null,
            area: null,
            engine: null,
            dataflow: null,
            editorComponents: null,
        }
    },
    methods: {
        async initEditor() {
            // const container = document.querySelector('#rete');
            // this.editor = new Rete.NodeEditor('demo@0.1.0', container);

            // this.editor.use(ConnectionPlugin)
            // this.editor.use(VuePlugin)
            // this.editor.use(AreaPlugin);

            // this.engine = new Rete.Engine('demo@0.1.0');

            // this.editorComponents = [new NumComponent(), new AddComponent(), new ImageComponent()];

            // this.editorComponents.map(c => {
            //     this.editor.register(c);
            //     this.engine.register(c);
            //});


            this.editor = new NodeEditor();
            this.area = new AreaPlugin(document.querySelector('.rete'));
            // const area = this.area
            const connection = new ConnectionPlugin();
            const vueRender = new VuePlugin();
            const minimap = new MinimapPlugin();
            const reroutePlugin = new ReroutePlugin();

            const contextMenu = new ContextMenuPlugin({
                items: ContextMenuPresets.classic.setup([
                    ['Number', () => new NumberNode(1, process)],
                    ['Add', () => new AddNode(process)]
                ])
            })
            this.area.use(contextMenu);

            connection.addPreset(ConnectionPresets.classic.setup())

            this.editor.use(this.area, {
                background: this.$refs.background,
                snap: false,
                scaleExtent: { min: 0.15, max: 2 },
                // translateExtent: { width: 100000, height: 100000 },
            });

            // this.editor.use(this.area)

            this.area.use(vueRender);
            this.area.use(connection);
            this.area.use(minimap)

            vueRender.use(reroutePlugin);

            // vueRender.addPreset(VuePresets.classic.setup(this.area));
            vueRender.addPreset(VuePresets.classic.setup());
            vueRender.addPreset(VuePresets.contextMenu.setup());
            vueRender.addPreset(VuePresets.minimap.setup());
            vueRender.addPreset(
                VuePresets.reroute.setup({
                    contextMenu(id) {
                        reroutePlugin.remove(id);
                    },
                    translate(id, dx, dy) {
                        reroutePlugin.translate(id, dx, dy);
                    },
                    pointerdown(id) {
                        reroutePlugin.unselect(id);
                        reroutePlugin.select(id);
                    },
                })
            );
            // vueRender.addPreset(VuePresets.contextMenu.setup())


            AreaExtensions.simpleNodesOrder(this.area);
            AreaExtensions.showInputControl(this.area);

            const selector = AreaExtensions.selector();
            const accumulating = AreaExtensions.accumulateOnCtrl();

            AreaExtensions.selectableNodes(this.area, selector, {accumulating});

            RerouteExtensions.selectablePins(reroutePlugin, selector, accumulating);

            const dataflow = new DataflowEngine();
            this.dataflow = dataflow

            this.editor.use(dataflow);

            // this.editor.use(AreaPlugin)
            
        },
        async process() {
            this.dataflow.reset();
            for (const node of this.editor.getNodes()) {
                if (node instanceof AddNode) {
                    await this.dataflow.fetch(node.id);

                    this.area.update('control', node.controls['result'].id);
                }
            }
        },
        async addNodes(rows, cols) {

            let startPosition = this.area.area.transform
            startPosition.x -= 100
            let nodeWidth = 180, nodeHeight = 100, gutterX = 500, gutterY = 50
            for (let i = rows - 1; i >= 0; i--) {
                for (let j = cols - 1; j >= 0; j--) {
                    console.log("i: ", i, ", j: ", j);

                    let posX = ((-1) * startPosition.x / startPosition.k) + j * (nodeWidth + gutterX);
                    let posY = ((-1) * startPosition.y / startPosition.k) + i * (nodeHeight + gutterY) + (i * 200);
                    console.log("posX: ", posX, ", posY: ", posY);

                    const a = new NumberNode(1, this.process);
                    const b = new NumberNode(1, this.process);
                    const add = new AddNode(this.process);

                    await this.editor.addNode(a);
                    await this.editor.addNode(b);
                    await this.editor.addNode(add);

                    console.log(a);
                    console.log(a.data());
                    console.log(b);
                    console.log(add);

                    await this.area.translate(a.id, { x: posX, y: posY });
                    await this.area.translate(b.id, { x: posX, y: posY + 200 });
                    await this.area.translate(add.id, { x: posX + 400, y: posY + 25 });

                    await this.editor.addConnection(new Connection(a, 'value', add, 'left'));
                    await this.editor.addConnection(new Connection(b, 'value', add, 'right'));
                }
            }
            await this.process();
        },

    },
    async mounted() {

        this.initEditor()
        await this.addNodes(1, 1)
        setTimeout(() => { //wait for nodes to be rendered
            AreaExtensions.zoomAt(this.area, this.editor.getNodes());
        }, 1000)

        this.editor.addPipe((context) => {
            if (context.type === 'connectioncreated' ||
                context.type === 'connectionremoved') {
                this.process();
            }
            return context;
        });
        
        AreaExtensions.zoomAt(this.area, this.editor.getNodes());
        // this.area.destroy();

        // this.editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
        //     await this.engine.abort();
        //     await this.engine.process(this.editor.toJSON());
        // });

        // this.editor.view.resize();
        // AreaPlugin.zoomAt(this.editor);
        // this.editor.trigger('process');

        // this.addNodes(5, 5)
        // this.addImageNodes()
    }
}
</script>
<style>
.editor-wrapper {
    height: 936px;
    padding: 8px 24px;
}

#rete {
    display: contents;
}
</style>
