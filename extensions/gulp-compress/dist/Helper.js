"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.helper = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = __importStar(require("path"));
const LOG_NAME = "[Gulp压缩]:";
class Helper {
    constructor() {
        this.defaultConfig = {
            enabled: false,
            buildDir: "",
            nodejs: ""
        };
        this._config = null;
    }
    get config() {
        if (!this._config) {
            this.readConfig();
        }
        return this._config;
    }
    /**@description 配置存储路径 */
    get configPath() {
        let savePath = `${path_1.default.join(Editor.Project.path, "/local/gulp-compress.json")}`;
        savePath = path_1.normalize(savePath);
        return savePath;
    }
    readConfig() {
        let tempPath = this.configPath;
        if (fs_1.existsSync(tempPath)) {
            this._config = JSON.parse(fs_1.readFileSync(tempPath, { encoding: "utf-8" }));
        }
        else {
            this._config = this.defaultConfig;
        }
    }
    saveConfig() {
        let savePath = this.configPath;
        console.log("保存配置如下：");
        console.log(this.config);
        fs_1.writeFileSync(savePath, JSON.stringify(this.config), { encoding: "utf-8" });
    }
    onBeforeBuild(platform) {
        this.readConfig();
        console.log(LOG_NAME, `是否启用自动压缩:${this.config.enabled},开始构建,构建平台:${platform}`);
    }
    onAfterBuild(dest, platform) {
        this.readConfig();
        console.log(LOG_NAME, `是否启用自动压缩:${this.config.enabled},构建完成,构建目录:${dest},构建平台:${platform}`);
        if (this.config.enabled) {
        }
    }
    /**@description 手动压缩 */
    onStartCompress() {
        let nodeJs = this.config.nodejs;
        let gulpPath = path_1.join(__dirname, "../node_modules/gulp/bin/gulp.js");
        gulpPath = path_1.normalize(gulpPath);
        let command = `${nodeJs} ${gulpPath} copy`;
        command = command.replace(/\\/g, "/");
        console.log(command);
        child_process_1.exec(command, (err, stdout, stderr) => {
            console.log("err", err);
            console.log("stdout", stdout);
            console.log("stderr", stderr);
        });
    }
}
exports.helper = new Helper();
