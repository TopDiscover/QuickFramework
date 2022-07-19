"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.unload = exports.load = exports.HelperImpl = void 0;
const path_1 = require("path");
const Helper_1 = __importDefault(require("./impl/Helper"));
class HelperImpl extends Helper_1.default {
    constructor() {
        super(...arguments);
        /**@description creator 安所路径 */
        this._path = null;
    }
    get creatorVerion() {
        return Editor.versions.CocosCreator;
    }
    get creatorPath() {
        if (this._path) {
            return this._path;
        }
        this._path = Editor.App.path;
        //D:\Creator\Creator\3.1.0\resources\app.asar
        //window : D:\CocosCreator\2.1.2\CocosCreator.exe --path
        //mac : Applications/CocosCreator/Creator/2.4.3/CocosCreator.app/Contents/MacOS --path
        let parser = (0, path_1.parse)(this._path);
        this._path = parser.dir;
        return this._path;
    }
}
exports.HelperImpl = HelperImpl;
const helper = new HelperImpl();
helper.logger = Editor;
function onBuildStart(options, callback) {
    if (helper.isUpdate) {
        Editor.error(`请先执行【项目工具】->【引擎修正】同步对引擎的修改，再构建!!!`);
    }
    callback();
}
function onBuildFinished(options, callback) {
    callback();
}
function load() {
    Editor.Builder.on('build-start', onBuildStart);
    Editor.Builder.on('build-finished', onBuildFinished);
}
exports.load = load;
function unload() {
    Editor.Builder.removeListener('build-start', onBuildStart);
    Editor.Builder.removeListener('build-finished', onBuildFinished);
}
exports.unload = unload;
exports.messages = {
    fix_engine: () => {
        helper.run();
    }
};
