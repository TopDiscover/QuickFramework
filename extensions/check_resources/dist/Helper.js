"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helper = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class Helper {
    constructor() {
        this.bundles = {};
    }
    get root() {
        let ret = `${Editor.Project.path}/assets/bundles`;
        return path_1.normalize(ret);
    }
    init() {
        let bundleConfigPath = `${Editor.Project.path}/config/bundles.json`;
        let config = fs_1.readFileSync(bundleConfigPath, { encoding: "utf-8" });
        let configObj = JSON.parse(config);
        let bundles = configObj.bundles;
        for (let i = 0; i < bundles.length; i++) {
            let info = bundles[i];
            if (info.dir == "hall") {
                console.log(`${info.name}(${info.dir})不参考检测`);
            }
            else {
                this.bundles[info.dir] = { name: info.name, dir: info.dir, db: `db://assets/bundles/${info.dir}` };
            }
        }
    }
    onCheckSubGame(dir) {
        console.log(dir);
    }
}
exports.helper = new Helper();
