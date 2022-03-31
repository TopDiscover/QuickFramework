"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.unload = exports.load = exports._Helper = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const jsbdts_1 = require("./jsbdts");
const os = __importStar(require("os"));
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
        if (os.platform() == "darwin") {
            return true;
        }
        return false;
    }
    /**@description creator 版本号 */
    get appVersion() {
        return Editor.versions.CocosCreator;
    }
    get appPath() {
        if (this._path) {
            return this._path;
        }
        this._path = Editor.App.path;
        //D:\Creator\Creator\3.1.0\resources\app.asar
        //window : D:\CocosCreator\2.1.2\CocosCreator.exe --path
        //mac : Applications/CocosCreator/Creator/2.4.3/CocosCreator.app/Contents/MacOS --path
        let parser = path.parse(this._path);
        this._path = parser.dir;
        return this._path;
    }
    get engineRoot() {
        if (this._engineRoot) {
            return this._engineRoot;
        }
        let root = this.appPath;
        root = path.normalize(root);
        this._engineRoot = root;
        return this._engineRoot;
    }
    get config() {
        if (this._config) {
            return this._config;
        }
        let source = fs.readFileSync(path.join(__dirname, "../engine/config.json"), "utf-8");
        this._config = JSON.parse(source);
        return this._config;
    }
    /**@description 当前目录下的插件版本 */
    get curPluginVersion() {
        let versionPath = `${path.join(__dirname, "../engine/version.json")}`;
        versionPath = path.normalize(versionPath);
        let data = fs.readFileSync(versionPath, "utf-8");
        let source = JSON.parse(data);
        this._curPluginVersion = source.version;
        return this._curPluginVersion;
    }
    /**@description 当前Creator目录下的引擎修正插件版本 */
    get creatorPluginVersion() {
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
        return ["2.4.0", "2.4.1", "2.4.2", "2.4.3", "2.4.4", "2.4.5", "2.4.6", "2.4.7", "2.4.8"];
    }
    run() {
        this.creatorPluginVersion;
        Editor.log(`Creator Version : ${this.creatorPluginVersion}`);
        Editor.log(`Plugin Version : ${this.curPluginVersion}`);
        if (!this.isNeedUpdateVersion) {
            Editor.log(`您目录Creator 目录下的插件版本已经是最新`);
            return;
        }
        if (this.validVersions.indexOf(this.appVersion) >= 0) {
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
                let sourcePath = `${path.join(__dirname, `../engine/${data.name}`)}`;
                sourcePath = path.normalize(sourcePath);
                let sourceData = fs.readFileSync(sourcePath, "utf-8");
                fs.writeFileSync(destPath, sourceData, { encoding: "utf-8" });
                Editor.log(data.desc);
            }
            else if (data.name == "ccdts") {
                //更新声明文件
                let destPath = `${this.engineRoot}/${data.path}`;
                destPath = path.normalize(destPath);
                let sourcePath = `${path.join(__dirname, `../engine/${data.name}`)}`;
                sourcePath = path.normalize(sourcePath);
                let sourceData = fs.readFileSync(sourcePath, "utf-8");
                if (fs.existsSync(destPath)) {
                    let destData = fs.readFileSync(destPath, "utf-8");
                    let replace = function () {
                        return arguments[1] + sourceData + arguments[3];
                    };
                    destData = destData.replace(/(\*\/)([\s\S\n]*)(declare\s*namespace\s*cc\s*\{)/g, replace);
                    //(decRef\s*\()([autoRelease\?:boolean]*)(\)\s*:\s*cc.Asset)
                    let replaceDecRef = function () {
                        return arguments[1] + "autoRelease?:boolean" + arguments[3];
                    };
                    destData = destData.replace(/(decRef\s*\()([autoRelease\?:boolean]*)(\)\s*:\s*cc.Asset)/g, replaceDecRef);
                    fs.writeFileSync(destPath, destData, { encoding: "utf-8" });
                    Editor.log(data.desc);
                }
                else {
                    Editor.error(`找不到引擎目录下文件:${destPath}`);
                }
            }
            else if (data.name == "jsbdts") {
                //更新热更新声明文件
                //(export\s*class\s*Manifest)([\s\n\S]*)(constructor\s*\(manifestUrl:\s*string\))
                let destPath = `${this.engineRoot}/${data.path}`;
                destPath = path.normalize(destPath);
                if (fs.existsSync(destPath)) {
                    let destData = fs.readFileSync(destPath, "utf-8");
                    let replaceManifest = function () {
                        return arguments[1] + jsbdts_1.HotUpdateDTS.manifest + arguments[3];
                    };
                    destData = destData.replace(/(export\s*class\s*Manifest\s*\{)([\s\n\S]*)(constructor\s*\(manifestUrl:\s*string\))/g, replaceManifest);
                    let replaceAssetsManager = function () {
                        return arguments[1] + jsbdts_1.HotUpdateDTS.assetsManager + arguments[3];
                    };
                    destData = destData.replace(/(export\s*class\s*AssetsManager\s*\{)([\s\n\S]*)(constructor\s*\(manifestUrl:\s*string)/g, replaceAssetsManager);
                    fs.writeFileSync(destPath, destData, { encoding: "utf-8" });
                    console.log(data.desc);
                }
                else {
                    Editor.error(`找不到引擎目录下文件:${destPath}`);
                }
            }
            else {
                //查看本地是否有文件
                let sourcePath = `${path.join(__dirname, `../engine/${data.name}`)}`;
                sourcePath = path.normalize(sourcePath);
                let destPath = `${this.engineRoot}/${data.path}`;
                destPath = path.normalize(destPath);
                if (fs.existsSync(destPath)) {
                    if (fs.existsSync(sourcePath)) {
                        let sourceData = fs.readFileSync(sourcePath, "utf-8");
                        fs.writeFileSync(destPath, sourceData, { encoding: "utf-8" });
                        Editor.log(data.desc);
                    }
                    else {
                        Editor.error(`找不到源文件:${sourcePath}`);
                    }
                }
                else {
                    Editor.error(`找不到引擎目录下文件:${destPath}`);
                }
            }
        }
    }
}
exports._Helper = _Helper;
const Helper = new _Helper();
function onBuildStart(options, callback) {
    if (Helper.isNeedUpdateVersion) {
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
        Helper.run();
    }
};
