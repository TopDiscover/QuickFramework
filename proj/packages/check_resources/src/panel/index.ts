"use strict";

import { readFileSync } from "fs-extra";
import { join } from "path";
import { helper, ShowInfo } from "../Helper";
interface MyView {
    shadowRoot: any;
    gameRoot: string;
    bundles: { [key: string]: ShowInfo };
}

Editor.Panel.extend({
    style: readFileSync(join(__dirname, "../../static/index.css")),
    template: readFileSync(join(__dirname, "../../static/index.html")),
    ready() {
        helper.init();
        const self: MyView = this as any;
        const vm = new window.Vue({
            el: self.shadowRoot,
            created: function () {

            },
            data: {
                gameRoot: helper.root,
                bundles: helper.bundles,
            },
            methods: {
                /**@description 选择子游戏目录 */
                onSelectGameRoot() {
                    let view: MyView = this as any;
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
                    let view: MyView = this as any;
                    helper.openDir(view.gameRoot);
                },


                /**@description 子游戏检测 */
                onCheckSubGame(dir: string) {
                    helper.onCheckSubGame(dir);
                }
            }
        });
    },
    messages: {

    }
});
