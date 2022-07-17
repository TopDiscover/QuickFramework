"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const process_1 = require("process");
const Environment_1 = require("./Environment");
class Handler {
    constructor() {
        this.module = "Handler";
        /**@description 日志 */
        this._logger = null;
        /**@description 保存bundles的名称 */
        this.bundleName = "bundles";
        /**@description bundles保存路径 */
        this.bundlesPath = (0, path_1.join)(this.projPath, this.bundleName);
        /**@description 链接代码路径 */
        this.syncBundlesPath = (0, path_1.join)(this.projPath, `proj/assets/${this.bundleName}`);
        /**@description 插件路径 */
        this.extensionsPath = (0, path_1.join)(this.projPath, `proj/${Environment_1.Environment.extensionsName}`);
        /**@description 需要安装依赖的目录 */
        this.extensions = Environment_1.Environment.extensions;
        /**@description 扩展插件配置保存路径 */
        this.configPath = (0, path_1.join)(this.projPath, `config`);
        /**@description 依赖库 */
        this.node_modules = (0, path_1.join)(this.projPath, "tools/node_modules");
        /**@description 构建目录 */
        this.buildPath = (0, path_1.join)(this.projPath, "proj/build");
        /**@description local目录 */
        this.localPath = (0, path_1.join)(__dirname, "../../../proj/local");
    }
    get logger() {
        if (!this._logger) {
            this._logger = console;
        }
        return this._logger;
    }
    set logger(v) {
        this._logger = v;
    }
    /**@description 当前项目路径 */
    get projPath() {
        if (Environment_1.Environment.isTools) {
            return (0, path_1.join)(__dirname, "../../../");
        }
        else {
            return (0, path_1.join)(__dirname, "../../../../../");
        }
    }
    /**@description 当前插件路径 */
    get curExtensionPath() {
        return "";
    }
    /**@description 执行命令 */
    exec(cmd) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            this.logger.log(`执行命令 : ${cmd}`);
            let result = (0, child_process_1.exec)(cmd, (err, stdout, stderr) => {
                if (err) {
                    resolve({ isSuccess: false, data: stderr });
                }
                else {
                    resolve({ isSuccess: true, data: stdout });
                }
            });
            (_a = result.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                this.logger.log(data);
            });
            (_b = result.stderr) === null || _b === void 0 ? void 0 : _b.on("error", (data) => {
                this.logger.error(data);
                console.log(data);
            });
        });
    }
    chdir(dir) {
        this.logger.log(`切换工作目录到 : ${dir}`);
        if ((0, fs_1.existsSync)(dir)) {
            (0, process_1.chdir)(dir);
        }
        else {
            this.logger.error(`切换工作目录失败，找不到 : ${dir}`);
        }
        this.logger.log(`当前工作目录 : ${process.cwd()}`);
    }
    log(name, isEnd) {
        let start = "/****************** 【";
        let end = "】******************/";
        if (isEnd) {
            this.logger.log(`${start}${name} 完成 ${end}`);
        }
        else {
            this.logger.log(`${start}${name} 开始 ${end}`);
        }
    }
    /**@description 当前插件支持的Creator版本号 */
    get supportVersions() {
        return Environment_1.Environment.supportVersions;
    }
    /**
     * @description 是否支持
     * @param version
     * @returns
     */
    isSupport(version) {
        if (this.supportVersions.indexOf(version) >= 0) {
            return true;
        }
        return false;
    }
}
exports.Handler = Handler;
