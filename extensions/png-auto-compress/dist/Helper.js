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
class Helper {
    constructor() {
        /** 默认配置 */
        this.defaultConfig = {
            enabled: false,
            minQuality: 40,
            maxQuality: 80,
            colors: 256,
            speed: 3,
            excludeFolders: "",
            excludeFiles: "",
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
        let savePath = `${path_1.default.join(Editor.Project.path, "/local/png-auto-compress.json")}`;
        savePath = path_1.normalize(savePath);
        return savePath;
    }
    saveConfig() {
        let savePath = this.configPath;
        console.log("保存配置如下：");
        console.log(this.config);
        fs_1.writeFileSync(savePath, JSON.stringify(this.config), { encoding: "utf-8" });
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
}
exports.helper = new Helper();
