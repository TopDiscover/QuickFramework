"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
const Helper_1 = require("../../../Helper");
module.exports = Editor.Panel.define({
    listeners: {},
    template: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
    },
    methods: {},
    ready() {
        Helper_1.helper.init();
        if (this.$.app) {
            const app = vue_1.createApp({});
            app.component('view-content', {
                template: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        bundles: Helper_1.helper.bundles,
                        gameRoot: Helper_1.helper.root,
                    };
                }, methods: {
                    /**@description 子游戏检测 */
                    onCheckSubGame(dir) {
                        Helper_1.helper.onCheckSubGame(dir);
                    }
                },
            });
            app.mount(this.$.app);
        }
    },
    beforeClose() { },
    close() { },
});
