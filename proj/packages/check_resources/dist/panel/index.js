"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Helper_1 = require("../Helper");
Editor.Panel.extend({
    style: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "../../static/index.css")),
    template: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "../../static/index.html")),
    ready() {
        Helper_1.helper.init();
        const self = this;
        const vm = new window.Vue({
            el: self.shadowRoot,
            created: function () {
            },
            data: {
                gameRoot: Helper_1.helper.root,
                bundles: Helper_1.helper.bundles,
            },
            methods: {
                /**@description 选择子游戏目录 */
                onSelectGameRoot() {
                    let view = this;
                    let result = Editor.Dialog.openFile({
                        title: "选择本地测试服务器路径",
                        defaultPath: view.gameRoot,
                        properties: ["openDirectory"]
                    });
                    if (-1 !== result) {
                        let fullPath = result[0];
                        view.gameRoot = fullPath;
                    }
                },
                /**@description 打开子游戏目录 */
                onOpenGameRoot() {
                    let view = this;
                    Helper_1.helper.openDir(view.gameRoot);
                },
                /**@description 子游戏检测 */
                onCheckSubGame(dir) {
                    Helper_1.helper.onCheckSubGame(dir);
                }
            }
        });
    },
    messages: {}
});
