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
const fs_1 = require("fs");
const path_1 = __importStar(require("path"));
const LOG_NAME = "[Gulp压缩]:";
class Helper {
    constructor() {
        this._config = { platform: "", dest: "" };
    }
    /**@description 配置存储路径 */
    get configPath() {
        let savePath = `${path_1.default.join(__dirname, "../../../local/gulp-compress.json")}`;
        savePath = path_1.normalize(savePath);
        return savePath;
    }
    readConfig() {
        let tempPath = this.configPath;
        if (fs_1.existsSync(tempPath)) {
            this._config = JSON.parse(fs_1.readFileSync(tempPath, { encoding: "utf-8" }));
        }
        else {
            this._config = { platform: "", dest: "" };
        }
    }
    saveConfig(dest, platform) {
        let savePath = this.configPath;
        this._config.dest = dest;
        this._config.platform = platform;
        console.log(`保存构建信息:`, this._config);
        fs_1.writeFileSync(savePath, JSON.stringify(this._config), { encoding: "utf-8" });
    }
    onBeforeBuild(platform) {
        console.log(LOG_NAME, `开始构建,构建平台:${platform}`);
    }
    onAfterBuild(dest, platform) {
        console.log(LOG_NAME, `构建完成,构建目录:${dest},构建平台:${platform}`);
        this.saveConfig(dest, platform);
        let tempPath = path_1.join(__dirname, "../");
        tempPath = path_1.normalize(tempPath);
        console.warn(LOG_NAME, `如果需要对构建的JS脚本进行资源压缩，请到${tempPath}目录下`);
        console.warn(LOG_NAME, `执行 gulp 命令 提示：gulp --compex true 可执行代码混淆，默认不开启`);
    }
    get dest() {
        this.readConfig();
        if (!!!this._config.dest || !!!this._config.platform) {
            console.error(`构建信息有误`);
            return "";
        }
        let platform = this._config.platform;
        let dest = this._config.dest;
        if (platform == "android" || platform == "windows" || platform == "ios" || platform == "mac") {
            dest = path_1.join(dest, "assets");
        }
        console.log(`构建资源目录为:${dest}`);
        return dest;
    }
    /**@description 判断是否是web */
    get isWeb() {
        this.readConfig();
        if (!!!this._config.dest || !!!this._config.platform) {
            console.error(`构建信息有误`);
            return true;
        }
        let platform = this._config.platform;
        if (platform == "android" || platform == "windows" || platform == "ios" || platform == "mac") {
            return false;
        }
        console.log(`构建平台:${platform}`);
        return true;
    }
    get platform() {
        this.readConfig();
        if (!!!this._config.dest || !!!this._config.platform) {
            console.error(`构建信息有误`);
            return "";
        }
        return this._config.platform;
    }
}
exports.helper = new Helper();
