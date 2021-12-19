import { readFileSync } from 'fs-extra';
import { join } from 'path';
import Vue from 'vue/dist/vue';

module.exports = Editor.Panel.extend({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
        text: '#text',
    },
    methods: {
        hello() {
            // if (this.$.text) {
            //     this.$.text.innerHTML = 'hello';
            //     console.log('[cocos-panel-html.default]: hello');
            // }
        },
    },
    ready() {
        let vv : any = this;
        Editor.log(vv.$app); 
        if (vv.$text) {
            vv.$text.innerHTML = 'Hello Cocos.';
        }
        if (vv.$app) {
            const vm = new Vue({
                template: readFileSync(join(__dirname, '../../../../static/template/vue/app.html'), 'utf-8'),
                data() {
                    return {
                        counter: 0,
                    };
                },
                methods: {
                    addition() {
                        this.counter += 1;
                    },
                    subtraction() {
                        this.counter -= 1;
                    },
                },
                el: vv.$app,
            });
        }
    },
    beforeClose() { },
    close() { },
});
