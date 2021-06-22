"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.unload = exports.load = exports._Helper = void 0;
const fs = require("fs");
const path = require("path");
class _Helper {
    constructor() {
        /**@description creator 安所路径 */
        this._path = null;
        this._engineRoot = null;
        this._config = null;
        this._curPluginVersion = -1;
        this._creatorPluginVersion = -1;
    }
    /**@description 是否是Mac平台 */
    get isMac() {
        let pos = Editor.argv.$0.indexOf("MacOS");
        return pos != -1;
    }
    /**@description creator 版本号 */
    get appVersion() {
        return Editor.versions.CocosCreator;
    }
    get appPath() {
        if (this._path) {
            return this._path;
        }
        this._path = Editor.argv.$0;
        //window : D:\CocosCreator\2.1.2\CocosCreator.exe --path
        //mac : Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path
        let parser = path.parse(this._path);
        this._path = parser.dir;
        return this._path;
    }
    get engineRoot() {
        if (this._engineRoot) {
            return this._engineRoot;
        }
        let root = this.appPath + (this.isMac ? "/Resources" : "/resources");
        root = path.normalize(root);
        this._engineRoot = root;
        return this._engineRoot;
    }
    get config() {
        if (this._config) {
            return this._config;
        }
        let source = fs.readFileSync(path.join(__dirname, "../../engine/config.json"), "utf-8");
        this._config = JSON.parse(source);
        return this._config;
    }
    /**@description 当前目录下的插件版本 */
    get curPluginVersion() {
        if (this._curPluginVersion == -1) {
            let versionPath = `${path.join(__dirname, "../../engine/version.json")}`;
            versionPath = path.normalize(versionPath);
            let data = fs.readFileSync(versionPath, "utf-8");
            let source = JSON.parse(data);
            this._curPluginVersion = source.version;
        }
        return this._curPluginVersion;
    }
    /**@description 当前Creator目录下的引擎修正插件版本 */
    get creatorPluginVersion() {
        if (this._creatorPluginVersion -= -1) {
            let versionPath = `${this.appPath}/version.json`;
            versionPath = path.normalize(versionPath);
            if (fs.existsSync(versionPath)) {
                let data = fs.readFileSync(versionPath, "utf-8");
                let source = JSON.parse(data);
                this._creatorPluginVersion = source.version;
            }
            else {
                this._creatorPluginVersion = 0;
            }
        }
        return this._creatorPluginVersion;
    }
    get isNeedUpdateVersion() {
        if (this.creatorPluginVersion == 0) {
            //不存在
            return true;
        }
        if (this.creatorPluginVersion < this.curPluginVersion) {
            return true;
        }
        return false;
    }
    /**@description 对哪些creator版本有效 */
    get validVersions() {
        return ["2.4.0", "2.4.1", "2.4.2", "2.4.3", "2.4.4"];
    }
    run() {
        Editor.log(`Creator Version : ${this.creatorPluginVersion}`);
        Editor.log(`Plugin Version : ${this.curPluginVersion}`);
        if (!this.isNeedUpdateVersion) {
            Editor.log(`您目录Creator 目录下的插件版本已经是最新`);
            return;
        }
        if (this.validVersions.indexOf(this.appVersion)) {
            Editor.log("Creator 版本 : " + this.appVersion);
        }
        else {
            Editor.log(`该插件只能使用在${this.validVersions.toString()}版本的Creator`);
            Editor.log("请自己手动对比packages/engine目录下对引擎的修改");
            return;
        }
        Editor.log("Creator 安装路径 : " + this.appPath);
        Editor.log("Creator 引擎路径 : " + this.engineRoot);
        let keys = Object.keys(this.config);
        for (let i = 0; i < keys.length; i++) {
            let data = this.config[keys[i]];
            if (data.name == "version.json") {
                //直接把版本文件写到creator目录下
                let destPath = `${this.appPath}/${data.path}`;
                destPath = path.normalize(destPath);
                let sourcePath = `${path.join(__dirname, `../../engine/${data.name}`)}`;
                sourcePath = path.normalize(sourcePath);
                let sourceData = fs.readFileSync(sourcePath, "utf-8");
                fs.writeFileSync(destPath, sourceData, { encoding: "utf-8" });
                Editor.log(data.desc);
            }
            else {
                //查看本地是否有文件
                let sourcePath = `${path.join(__dirname, `../../engine/${data.name}`)}`;
                sourcePath = path.normalize(sourcePath);
                let destPath = `${this.engineRoot}/${data.path}`;
                destPath = path.normalize(destPath);
                if (fs.existsSync(sourcePath)) {
                    let sourceData = fs.readFileSync(sourcePath, "utf-8");
                    fs.writeFileSync(destPath, sourceData, { encoding: "utf-8" });
                    Editor.log(data.desc);
                }
            }
        }
    }
}
exports._Helper = _Helper;
const Helper = new _Helper();
function load() {
}
exports.load = load;
function unload() {
}
exports.unload = unload;
exports.messages = {
    fix_engine: () => {
        Helper.run();
    }
};
