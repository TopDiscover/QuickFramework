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
        this.bundleName = Environment_1.Environment.bundleName;
        /**@description 私有项目的名称 */
        this.privateProj = Environment_1.Environment.privateProj;
        /**@description resources 目录名 */
        this.resources = Environment_1.Environment.resources;
        /**@description bundles保存路径 */
        this.bundlesPath = (0, path_1.join)(this.projPath, this.bundleName);
        /**@description resources 保存路径 */
        this.resourcesPath = (0, path_1.join)(this.projPath, this.resources);
        /**@description 私有项目保存路径 */
        this.privateProjPath = (0, path_1.join)(this.projPath, this.privateProj);
        /**@description 项目 assets 目录 */
        this.assetsDBPath = (0, path_1.join)(this.projPath, "proj/assets");
        /**@description 项目 bundles 路径 */
        this.assetsBundlesPath = (0, path_1.join)(this.projPath, `proj/assets/${this.bundleName}`);
        /**@description 项目 resources 路径 */
        this.assetsResourcesPath = (0, path_1.join)(this.projPath, `proj/assets/${this.resources}`);
        /**@description 插件路径 */
        this.extensionsPath = (0, path_1.join)(this.projPath, `proj/${Environment_1.Environment.extensionsName}`);
        /**@description 需要安装依赖的目录 */
        this.extensions = Environment_1.Environment.extensions;
        /**@description 扩展插件配置保存路径 */
        this.configPath = (0, path_1.join)(this.projPath, `proj/config`);
        /**@description 依赖库 */
        this.node_modules = (0, path_1.join)(this.projPath, "tools/node_modules");
        /**@description 构建目录 */
        this.buildPath = (0, path_1.join)(this.projPath, "proj/build");
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
        if (Environment_1.Environment.isCommand) {
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
    formatDate(format, input) {
        let date = {
            "M+": input.getMonth() + 1,
            "d+": input.getDate(),
            "h+": input.getHours(),
            "m+": input.getMinutes(),
            "s+": input.getSeconds(),
            "q+": Math.floor((input.getMonth() + 3) / 3),
            "S+": input.getMilliseconds()
        };
        let replaceYear = function () {
            return input.getFullYear().toString();
        };
        format = format.replace(/(y+)/i, replaceYear);
        for (let k in date) {
            format = format.replace(new RegExp(`(${k})`), (subFormat) => {
                let value = date[k];
                let str = subFormat.length == 1 ? `${value}` : `00${value}`.substring(value.toString().length);
                return str;
            });
        }
        return format;
    }
    ;
    /**@description 获取当前的日期 */
    get date() {
        let date = new Date();
        return this.formatDate("yyyyMMddhhmmss", date);
    }
    /**@description 执行命令 */
    exec(cmd, isLog = true) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            isLog && this.logger.log(`执行命令 : ${cmd}`);
            let result = (0, child_process_1.exec)(cmd, (err, stdout, stderr) => {
                if (err) {
                    isLog && this.logger.error(`执行命令 : ${cmd}失败`);
                    isLog && this.logger.error(err);
                    resolve({ isSuccess: false, data: err });
                }
                else {
                    resolve({ isSuccess: true, data: stdout });
                }
            });
            (_a = result.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                isLog && this.logger.log(data);
            });
            (_b = result.stderr) === null || _b === void 0 ? void 0 : _b.on("error", (data) => {
                isLog && this.logger.error(data);
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
    isSupportUpdate(platform) {
        return Environment_1.Environment.isSupportUpdate(platform);
    }
    /**
     * @description 数组去重
     */
    uniqueArray(arr) {
        return arr.filter(function (item, pos) {
            return arr.indexOf(item) == pos;
        });
    }
}
exports.Handler = Handler;
