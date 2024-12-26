"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Environment_1 = require("../core/Environment");
const Defines_1 = require("../core/Defines");
const Handler_1 = require("../core/Handler");
class Helper extends Handler_1.Handler {
    constructor() {
        super(...arguments);
        this.module = "【引擎修正】";
        /**@description 添加热更新接口导出声明 */
        this.HotUpdateDTS = {
            manifest: `
        constructor (content: string, manifestRoot: string,packageUrl:string);
        `
        };
        this._curExtensionPath = null;
        this._config = null;
    }
    /**@description cocos creator 版本号 */
    get creatorVerion() {
        return Environment_1.Environment.creatorVerion;
    }
    /**
     * @description cocos creator 安装路径
     */
    get creatorPath() {
        return Environment_1.Environment.creatorPath;
    }
    get curExtensionPath() {
        if (!this._curExtensionPath) {
            this._curExtensionPath = (0, path_1.join)(this.extensionsPath, Defines_1.Extensions.FixEngine);
        }
        return this._curExtensionPath;
    }
    /**@description 当前插件版本 */
    get pluginVersion() {
        let versionPath = (0, path_1.join)(this.curExtensionPath, "engine/version.json");
        versionPath = (0, path_1.normalize)(versionPath);
        if ((0, fs_1.existsSync)(versionPath)) {
            let data = (0, fs_1.readFileSync)(versionPath, "utf-8");
            let source = JSON.parse(data);
            return source.version;
        }
        else {
            return 0;
        }
    }
    /**@description cocos creator 目录下的插件版本 */
    get creatorPluginVersion() {
        let versionPath = (0, path_1.join)(this.creatorPath, "version.json");
        versionPath = (0, path_1.normalize)(versionPath);
        if ((0, fs_1.existsSync)(versionPath)) {
            let data = (0, fs_1.readFileSync)(versionPath, "utf-8");
            let source = JSON.parse(data);
            return source.version;
        }
        return 0;
    }
    /**
     * @description 修正引擎配置
     */
    get config() {
        if (!this._config) {
            let data = (0, fs_1.readFileSync)((0, path_1.join)(this.curExtensionPath, "engine/config.json"), "utf-8");
            this._config = JSON.parse(data);
        }
        return this._config;
    }
    /**
     * @description 是否需要更新插件
     */
    get isUpdate() {
        if (this.creatorPluginVersion == 0) {
            //不存在
            return true;
        }
        if (this.creatorPluginVersion < this.pluginVersion) {
            return true;
        }
        return false;
    }
    run() {
        this.logger.log(`${this.module}Creator 插件版本 : ${this.creatorPluginVersion}`);
        this.logger.log(`${this.module}当前插件版本 : ${this.pluginVersion}`);
        this.logger.log(`${this.module}Creator 版本 : ${this.creatorVerion}`);
        this.logger.log(`${this.module}Creator 安装目录 : ${this.creatorPath}`);
        if (!this.isUpdate) {
            this.logger.log(`${this.module}您目录Creator 目录下的插件版本已经是最新`);
            return;
        }
        if (!this.isSupport(this.creatorVerion)) {
            this.logger.log(`${this.module}该插件只能使用在${this.supportVersions.toString()} 版本的Creator`);
            this.logger.log(`${this.module}请自己手动对比fix_engine/engine目录下对引擎的修改`);
            return;
        }
        let keys = Object.keys(this.config);
        for (let i = 0; i < keys.length; i++) {
            let data = this.config[keys[i]];
            if (data.from == "version.json") {
                //直接把版本文件写到creator目录下
                let destPath = (0, path_1.join)(this.creatorPath, data.to);
                destPath = (0, path_1.normalize)(destPath);
                let sourcePath = (0, path_1.join)(this.curExtensionPath, `engine/${data.from}`);
                sourcePath = (0, path_1.normalize)(sourcePath);
                let sourceData = (0, fs_1.readFileSync)(sourcePath, "utf-8");
                (0, fs_1.writeFileSync)(destPath, sourceData, { encoding: "utf-8" });
                this.logger.log(`${this.module}${sourcePath} -> ${destPath}`);
                this.logger.log(`${this.module}${data.desc}`);
            }
            else if (data.from == "jsbdts") {
                //更新热更新声明文件
                let destPath = (0, path_1.join)(this.creatorPath, data.to);
                destPath = (0, path_1.normalize)(destPath);
                if ((0, fs_1.existsSync)(destPath)) {
                    let self = this;
                    let destData = (0, fs_1.readFileSync)(destPath, "utf-8");
                    let replaceManifest = function () {
                        return arguments[1] + self.HotUpdateDTS.manifest + arguments[3];
                    };
                    destData = destData.replace(/(export\s*class\s*Manifest\s*\{)([\s\n\S]*)(constructor\s*\(manifestUrl:\s*string\))/g, replaceManifest);
                    (0, fs_1.writeFileSync)(destPath, destData, { encoding: "utf-8" });
                    this.logger.log(`${this.module}${data.desc}`);
                }
                else {
                    this.logger.error(`${this.module}找不到引擎目录下文件:${destPath}`);
                }
            }
            else {
                let copyTo = () => {
                    let sourcePath = (0, path_1.join)(this.curExtensionPath, `engine/${data.from}`);
                    sourcePath = (0, path_1.normalize)(sourcePath);
                    let destPath = (0, path_1.join)(this.creatorPath, data.to);
                    destPath = (0, path_1.normalize)(destPath);
                    if ((0, fs_1.existsSync)(destPath)) {
                        if ((0, fs_1.existsSync)(sourcePath)) {
                            let sourceData = (0, fs_1.readFileSync)(sourcePath, "utf-8");
                            (0, fs_1.writeFileSync)(destPath, sourceData, { encoding: "utf-8" });
                            this.logger.log(`${this.module}${data.desc}`);
                        }
                        else {
                            this.logger.error(`${this.module}找不到源文件:${sourcePath}`);
                        }
                    }
                    else {
                        this.logger.error(`${this.module}找不到引擎目录下文件:${destPath}`);
                    }
                };
                //查看本地是否有文件
                if (data.versions) {
                    let versions = data.versions.split("|");
                    this.logger.log(`${this.module} 支持版本 : ${versions.toString()}`);
                    if (versions.indexOf(this.creatorVerion) >= 0) {
                        copyTo();
                    }
                }
                else {
                    copyTo();
                }
            }
        }
    }
}
exports.default = Helper;
