"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = exports._Helper = void 0;
const path_1 = require("path");
const Helper_1 = __importDefault(require("./impl/Helper"));
class _Helper extends Helper_1.default {
    constructor() {
        super(...arguments);
        this._path = null;
    }
    get creatorVerion() {
        return Editor.App.version;
    }
    get creatorPath() {
        if (this._path) {
            return this._path;
        }
        this._path = Editor.App.path;
        //windows :  D:\Creator\Creator\3.1.0\resources\app.asar
        //mac : /Applications/CocosCreator/Creator/3.3.1/CocosCreator.app/Contents/Resources/app.asar --path
        let parser = (0, path_1.parse)(this._path);
        this._path = parser.dir;
        return this._path;
    }
}
exports._Helper = _Helper;
const Impl = new _Helper();
/**
* @en
* @zh 为扩展的主进程的注册方法
*/
exports.methods = {
    fixEngine() {
        Impl.run();
    },
    onBeforeBuild() {
        if (Impl.isUpdate) {
            console.error(`请先执行【项目工具】->【引擎修正】同步对引擎的修改，再构建!!!`);
        }
    }
};
/**
* @en Hooks triggered after extension loading is complete
* @zh 扩展加载完成后触发的钩子
*/
const load = function () {
    console.log("加载fix_engine");
};
exports.load = load;
/**
* @en Hooks triggered after extension uninstallation is complete
* @zh 扩展卸载完成后触发的钩子
*/
const unload = function () {
    console.log("卸载fix_engine");
};
exports.unload = unload;
