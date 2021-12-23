import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { createApp } from 'vue';
import { helper } from '../../../Helper';

module.exports = Editor.Panel.define({
    listeners: {

    },
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
    },
    methods: {

    },
    ready() {
        helper.init();
        if (this.$.app) {
            const app = createApp({});
            app.component('view-content', {
                template: readFileSync(join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        bundles: helper.bundles,
                        gameRoot: helper.root,
                    }
                }, methods: {
                    /**@description 子游戏检测 */
                    onCheckSubGame(dir: string) {
                        helper.onCheckSubGame(dir);
                    }
                },
            });
            app.mount(this.$.app);
        }
    },
    beforeClose() { },
    close() { },
});
