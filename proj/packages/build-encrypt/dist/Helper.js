"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helper = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const ApplyJsb_1 = require("./utils/ApplyJsb");
const ApplyWeb_1 = require("./utils/ApplyWeb");
const EncriptTool_1 = require("./utils/EncriptTool");
/**构建类型 */
var BuildTypeEnum = {
    web_desktop: 0,
    web_mobile: 1,
    jsb_link: 2,
};
class Helper {
    constructor() {
        this._config = null;
        /**加密文件后缀支持目录 */
        this.root_path_List = ["web-desktop", "web-mobile", "jsb-link"];
        /**加密后缀名排除列表 */
        this.encript_ignore_extList = ["mp3", "ogg", "wav", "m4a", "jsc", "bin"];
        /**加密实现工具类 */
        this._encriptTool = new EncriptTool_1.EncriptTool();
        /**计数 */
        this.encriptFinishNum = 0;
    }
    /**@description 生成默认缓存 */
    get defaultConfig() {
        let config = {
            encriptSign: "+.+lieyou...",
            encriptKey: "lieyou-.-^^",
            srcLabel: "",
            buildType: 2,
        };
        return config;
    }
    get config() {
        this.encriptFinishNum = 0;
        if (!this._config) {
            this._config = this.defaultConfig;
        }
        return this._config;
    }
    set config(v) {
        this._config = v;
    }
    /**
     * @description 添加日志
     * @param {*} message
     * @param {*} obj
     * @returns
     */
    log(message, obj = null) {
        if (typeof obj == "function") {
            return;
        }
        if (obj) {
            Editor.log("[资源替换]", message, obj);
        }
        else {
            Editor.log("[资源替换]", message);
        }
    }
    checkBuildDir(fullPath) {
        let is = -1;
        if ((0, fs_1.existsSync)(fullPath)) {
            // 检查目录后缀是否符合
            let path = fullPath.split("\\");
            is = this.root_path_List.indexOf(path[path.length - 1]);
        }
        if (is < 0) {
            this.log(`选择目录错误`);
        }
        return is;
    }
    setBuildType(fullPath) {
        this._config.buildType = this.checkBuildDir(fullPath);
        if (this._config.buildType == BuildTypeEnum.jsb_link) {
            ///jsb
            this.encript_ignore_extList = [
                "mp3", "ogg", "wav", "m4a", "jsc", "bin"
            ];
        }
        else if (this._config.buildType == BuildTypeEnum.web_desktop || this._config.buildType == BuildTypeEnum.web_mobile) {
            ///web平台，只加密文本、图片
            this.encript_ignore_extList = [
                "js", "jsc",
                "mp3", "ogg", "wav", "m4a",
                "font", "eot", "ttf", "woff", "svg", "ttc",
                "mp4", "avi", "mov", "mpg", "mpeg", "rm", "rmvb",
                "bin",
            ];
        }
    }
    replaceResources() {
        this.log(`开始进行资源加密,加密指定目录：` + this.config.srcLabel);
        this.setBuildType(this._config.srcLabel);
        this._encriptTool.setKeySign(this._config.encriptKey, this._config.encriptSign);
        let assetsPath = path_1.default.join(this._config.srcLabel, "assets");
        this.encriptDir(assetsPath);
        if (this._config.buildType == BuildTypeEnum.jsb_link) {
            new ApplyJsb_1.ApplyJsb(this._config.encriptSign, this._config.encriptKey);
            let jsb_adapterPath = path_1.default.join(this._config.srcLabel, "jsb-adapter");
            let srcPath = path_1.default.join(this._config.srcLabel, "src");
            let mainJsPath = path_1.default.join(this._config.srcLabel, "main.js");
            this.encriptDir(jsb_adapterPath);
            this.encriptDir(srcPath);
            this.encodeFile(mainJsPath);
        }
        else if (this._config.buildType == BuildTypeEnum.web_desktop || this._config.buildType == BuildTypeEnum.web_mobile) {
            //web
            new ApplyWeb_1.ApplyWeb(this._config.encriptSign, this._config.encriptKey, this._config.srcLabel);
        }
        this.log("加密结束，累计加密：" + this.encriptFinishNum + "个文件");
    }
    /**加密文件夹 */
    encriptDir(dirName) {
        if (!(0, fs_1.existsSync)(dirName)) {
            this.log(`${dirName} 目录不存在`);
            return;
        }
        let files = (0, fs_1.readdirSync)(dirName);
        files.forEach((fileName) => {
            let filePath = path_1.default.join(dirName, fileName.toString());
            let stat = (0, fs_1.statSync)(filePath);
            if (stat.isDirectory()) {
                this.encriptDir(filePath);
            }
            else {
                this.encodeFile(filePath);
            }
        });
    }
    /**加密文件 */
    encodeFile(filePath) {
        let ext = path_1.default.extname(filePath);
        if (this.encript_ignore_extList.indexOf(ext.slice(1)) >= 0) {
            return;
        }
        let inbuffer = (0, fs_1.readFileSync)(filePath);
        if (this._encriptTool.checkIsEncripted(inbuffer)) {
            this.log("已加密过:", filePath);
            return;
        }
        else {
            this.log("加密文件：" + filePath);
        }
        let outBuffer = this._encriptTool.encodeArrayBuffer(inbuffer);
        (0, fs_1.unlinkSync)(filePath);
        (0, fs_1.writeFileSync)(filePath, outBuffer);
        this.encriptFinishNum = this.encriptFinishNum + 1;
    }
}
exports.helper = new Helper();
