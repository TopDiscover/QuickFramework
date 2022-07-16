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
        /**@description 添加热更新接口导出声明 */
        this.HotUpdateDTS = {
            assetsManager: `
    
        /**@description 热更新地址 */
        setPackageUrl(url:string):void;
        /**@description 设置主包包含哪些bunlde,如果 main,resources */
        setMainBundles(bundles:string[]):void;
        /**
         * @description 设置 下载总数占比(即【将要下载资源文件总数】/【总下载资源文件总数】) 
         * 如 ：当为1时，删除本地缓存直接下载整个zip包进行解压
         *      当为0时，不会下载zip ,都以散列文件方式更新
         *      当 percent > 0 && percent < 1，假设为0.5,【下载总数占比】50%会删除掉本地缓存，重新下载zip包进行解压
         * 注意：在将要下载的总数 == 总下载总数 这个值无效，会直接下载zip包
         * @param percent 取值范围0~1
         */
        setDownloadAgainZip(percent:number):void;
        /**@description 重置检测状态 */
        reset():void;
    
        `,
            manifest: `
    
        constructor (content: string, manifestRoot: string,packageUrl:string);
        getMd5():string;
        
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
        this.logger.log(`Creator 插件版本 : ${this.creatorPluginVersion}`);
        this.logger.log(`当前插件版本 : ${this.pluginVersion}`);
        this.logger.log(`Creator 版本 : ${this.creatorVerion}`);
        this.logger.log(`Creator 安装目录 : ${this.creatorPath}`);
        if (!this.isUpdate) {
            this.logger.log(`您目录Creator 目录下的插件版本已经是最新`);
            return;
        }
        if (!this.isSupport(this.creatorVerion)) {
            this.logger.log(`该插件只能使用在${this.supportVersions.toString()} 版本的Creator`);
            this.logger.log(`请自己手动对比fix_engine/engine目录下对引擎的修改`);
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
                this.logger.log(`${sourcePath} -> ${destPath}`);
                this.logger.log(data.desc);
            }
            else if (data.from == "ccdts") {
                //更新声明文件
                let destPath = (0, path_1.join)(this.creatorPath, data.to);
                destPath = (0, path_1.normalize)(destPath);
                let sourcePath = (0, path_1.join)(this.curExtensionPath, `engine/${data.from}`);
                sourcePath = (0, path_1.normalize)(sourcePath);
                let sourceData = (0, fs_1.readFileSync)(sourcePath, "utf-8");
                if ((0, fs_1.existsSync)(destPath)) {
                    let destData = (0, fs_1.readFileSync)(destPath, "utf-8");
                    let replace = function () {
                        return arguments[1] + sourceData + arguments[3];
                    };
                    if (this.creatorVerion >= "3.0.0") {
                        //3.x 版本Creator 处理
                        destData = destData.replace(/(declare\s*module\s*"cc"\s*\{)([\s\n\S]*)(export\s*function\s* murmurhash2_32_gc)/g, replace);
                    }
                    else {
                        //2.x 版本Creator 处理
                        destData = destData.replace(/(\*\/)([\s\S\n]*)(declare\s*namespace\s*cc\s*\{)/g, replace);
                        //(decRef\s*\()([autoRelease\?:boolean]*)(\)\s*:\s*cc.Asset)
                        let replaceDecRef = function () {
                            return arguments[1] + "autoRelease?:boolean" + arguments[3];
                        };
                        destData = destData.replace(/(decRef\s*\()([autoRelease\?:boolean]*)(\)\s*:\s*cc.Asset)/g, replaceDecRef);
                    }
                    (0, fs_1.writeFileSync)(destPath, destData, { encoding: "utf-8" });
                    this.logger.log(data.desc);
                }
                else {
                    this.logger.error(`找不到引擎目录下文件:${destPath}`);
                }
            }
            else if (data.from == "jsbdts") {
                //更新热更新声明文件
                //(export\s*class\s*Manifest)([\s\n\S]*)(constructor\s*\(manifestUrl:\s*string\))
                let destPath = (0, path_1.join)(this.creatorPath, data.to);
                destPath = (0, path_1.normalize)(destPath);
                if ((0, fs_1.existsSync)(destPath)) {
                    let self = this;
                    let destData = (0, fs_1.readFileSync)(destPath, "utf-8");
                    let replaceManifest = function () {
                        return arguments[1] + self.HotUpdateDTS.manifest + arguments[3];
                    };
                    destData = destData.replace(/(export\s*class\s*Manifest\s*\{)([\s\n\S]*)(constructor\s*\(manifestUrl:\s*string\))/g, replaceManifest);
                    let replaceAssetsManager = function () {
                        return arguments[1] + self.HotUpdateDTS.assetsManager + arguments[3];
                    };
                    destData = destData.replace(/(export\s*class\s*AssetsManager\s*\{)([\s\n\S]*)(constructor\s*\(manifestUrl:\s*string)/g, replaceAssetsManager);
                    (0, fs_1.writeFileSync)(destPath, destData, { encoding: "utf-8" });
                    this.logger.log(data.desc);
                }
                else {
                    this.logger.error(`找不到引擎目录下文件:${destPath}`);
                }
            }
            else {
                //查看本地是否有文件
                let sourcePath = (0, path_1.join)(this.curExtensionPath, `engine/${data.from}`);
                sourcePath = (0, path_1.normalize)(sourcePath);
                let destPath = (0, path_1.join)(this.creatorPath, data.to);
                destPath = (0, path_1.normalize)(destPath);
                if ((0, fs_1.existsSync)(destPath)) {
                    if ((0, fs_1.existsSync)(sourcePath)) {
                        let sourceData = (0, fs_1.readFileSync)(sourcePath, "utf-8");
                        (0, fs_1.writeFileSync)(destPath, sourceData, { encoding: "utf-8" });
                        this.logger.log(data.desc);
                    }
                    else {
                        this.logger.error(`找不到源文件:${sourcePath}`);
                    }
                }
                else {
                    this.logger.error(`找不到引擎目录下文件:${destPath}`);
                }
            }
        }
    }
}
exports.default = Helper;
