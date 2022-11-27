"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyWeb = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const Common_1 = require("./Common");
/**web代码处理 */
class ApplyWeb extends Common_1.Common {
    constructor(_encriptSign, _encriptKey, _buildFloderPath) {
        super();
        /**文件前缀 */
        this.encriptSign = "";
        /**加密key */
        this.encriptKey = "";
        /**构建路径 */
        this.buildFloderPath = "";
        this.encriptSign = _encriptSign;
        this.encriptKey = _encriptKey;
        this.buildFloderPath = _buildFloderPath;
        this.copyHelper();
        this.copyHtml();
    }
    copyHelper() {
        let fromPath = Editor.url("packages://build-encrypt/process/web_downloader.js", "utf-8");
        let toPath = path_1.default.join(this.buildFloderPath, "assets", "web_downloader.js");
        (0, fs_1.copyFile)(fromPath, toPath, function (err) {
            if (err) {
                Editor.error("复制web_downloader.js出错");
            }
        });
    }
    searthDir(dirName, callback) {
        if (!(0, fs_1.existsSync)(dirName)) {
            Editor.log(`${dirName} 目录不存在`);
            return;
        }
        let files = (0, fs_1.readdirSync)(dirName);
        files.forEach((fileName) => {
            let filePath = path_1.default.join(dirName, fileName.toString());
            let stat = (0, fs_1.statSync)(filePath);
            if (stat.isDirectory()) {
                this.searthDir(filePath, callback);
            }
            else {
                callback(fileName, filePath);
            }
        });
    }
    /**修改index.html */
    copyHtml() {
        let mainJsName = "main.js";
        let settingJsName = "settings.js";
        let physicsJsName = "physics-min.js";
        let cocos2dJsName = "cocos2d-js-min.js";
        let styleDesktopName = "style-desktop.css";
        let styleMobileName = "style-mobile.css";
        let splashName = "splash.png";
        let icoName = "favicon.ico";
        this.searthDir(this.buildFloderPath, function (fileName, path) {
            if (/main\.([0-9 a-z]|\.)*js/.test(fileName)) {
                mainJsName = fileName;
            }
            else if (/physics(-min)?\.([0-9 a-z]|\.)*js/.test(fileName)) {
                physicsJsName = fileName;
            }
            else if (/settings\.([0-9 a-z]|\.)*js/.test(fileName)) {
                settingJsName = fileName;
            }
            else if (/cocos2d-js(-min)?\.([0-9 a-z]|\.)*js/.test(fileName)) {
                cocos2dJsName = fileName;
            }
            else if (/style-desktop\.([0-9 a-z]|\.)*css/.test(fileName)) {
                styleDesktopName = fileName;
            }
            else if (/style-mobile\.([0-9 a-z]|\.)*css/.test(fileName)) {
                styleMobileName = fileName;
            }
            else if (/favicon\.([0-9 a-z]|\.)*ico/.test(fileName)) {
                icoName = fileName;
            }
            else if (/splash\.([0-9 a-z]|\.)*png/.test(fileName)) {
                splashName = fileName;
            }
        });
        let fromPath = Editor.url("packages://build-encrypt/process/template_web_index.html", "utf-8");
        let toPath = path_1.default.join(this.buildFloderPath, "index.html");
        let htmlStr = (0, fs_1.readFileSync)(fromPath, "utf-8");
        htmlStr = htmlStr.replace('hyz.register_decripted_downloader(tmp_encriptSign,tmp_encriptKey);', `hyz.register_decripted_downloader('${this.encriptSign}','${this.encriptKey}');`);
        htmlStr = htmlStr.replace("main.js", mainJsName);
        htmlStr = htmlStr.replace("settings.js", settingJsName);
        if (physicsJsName.includes("min")) {
            htmlStr = htmlStr.replace("physics-min.js", physicsJsName);
        }
        else {
            htmlStr = htmlStr.replace("physics.js", physicsJsName);
        }
        if (cocos2dJsName.includes("min")) {
            htmlStr = htmlStr.replace("cocos2d-js-min.js", cocos2dJsName);
        }
        else {
            htmlStr = htmlStr.replace("cocos2d-js.js", cocos2dJsName);
        }
        htmlStr = htmlStr.replace("style-desktop.css", styleDesktopName);
        htmlStr = htmlStr.replace("favicon.ico", icoName);
        htmlStr = htmlStr.replace("style-mobile.css", styleMobileName);
        htmlStr = htmlStr.replace("splash.png", splashName);
        // Editor.log(htmlStr)
        (0, fs_1.writeFileSync)(toPath, htmlStr);
    }
}
exports.ApplyWeb = ApplyWeb;
