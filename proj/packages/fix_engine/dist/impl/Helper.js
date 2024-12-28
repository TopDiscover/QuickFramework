"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Environment_1 = require("../core/Environment");
const Defines_1 = require("../core/Defines");
const Config_1 = __importDefault(require("../core/Config"));
const FileUtils_1 = __importDefault(require("../core/FileUtils"));
const minimatch_1 = require("minimatch");
class Helper extends Config_1.default {
    constructor() {
        super(...arguments);
        this.module = "【引擎修正】";
        this.defaultData = {
            include: [
                "**/libcocos2d.vcxproj.filters",
                "**/assets-manager/AssetsManagerEx.*",
                "**/assets-manager/Manifest.*",
                "**/jsb_cocos2dx_extension_auto.*",
                "**/HelloJavascript.vcxproj",
                "**/jsb_cocos2dx_extension_auto.*",
                "**/app/build.gradle",
                "utils/api/**",
                "**/js-template-default/frameworks/runtime-src/Classes/AppDelegate.cpp",
                "**/js-template-link/frameworks/runtime-src/Classes/AppDelegate.cpp",
            ],
            exclude: [],
        };
        /**@description 添加热更新接口导出声明 */
        this.HotUpdateDTS = {
            manifest: `
        constructor (content: string, manifestRoot: string,packageUrl:string);
        `
        };
        this._curExtensionPath = null;
    }
    get path() {
        return (0, path_1.join)(this.configPath, "fix_engine.json");
    }
    /**@description cocos creator 版本号 */
    get creatorVerion() {
        return Environment_1.Environment.creatorVerion;
    }
    /**@description 本地引擎路径 */
    get localEnginePath() {
        return (0, path_1.join)(this.projPath, `engine/${this.creatorVerion}`);
    }
    /**@description 备份指定版本引擎路径 */
    get backupEnigineLocalPath() {
        return (0, path_1.join)(this.projPath, `engine/${this.creatorVerion}/backupEngine`);
    }
    /**@description 修改指定版本引擎路径 */
    get customEnginePath() {
        return (0, path_1.join)(this.projPath, `engine/${this.creatorVerion}/customEngine`);
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
    read(isReload) {
        super.read(isReload);
        if (this.data) {
            this.data.include = this.data.include.concat(this.defaultData.include);
            this.data.include = this.uniqueArray(this.data.include);
            this.data.exclude = this.data.exclude.concat(this.defaultData.exclude);
            this.data.exclude = this.uniqueArray(this.data.exclude);
        }
    }
    /**
     * @description 对目录进行md5
     */
    async md5engine(path) {
        const files = FileUtils_1.default.instance.getFiles(path, (info) => {
            const relative = info.relative.replace(/\\/g, "/");
            // 包含的文件
            let isInclude = false;
            for (let i = 0; i < this.data.include.length; i++) {
                const v = this.data.include[i];
                if ((0, minimatch_1.minimatch)(relative, v, { dot: true, matchBase: true })) {
                    isInclude = true;
                    break;
                }
            }
            // 排除的文件
            for (let i = 0; i < this.data.exclude.length; i++) {
                const v = this.data.exclude[i];
                if ((0, minimatch_1.minimatch)(relative, v, { dot: true, matchBase: true })) {
                    isInclude = false;
                    break;
                }
            }
            return isInclude;
        }, path);
        const concurrentLimit = 50; // 同时处理的最大文件数
        let assets = {};
        // 将文件列表分成多个批次
        for (let i = 0; i < files.length; i += concurrentLimit) {
            const batch = files.slice(i, i + concurrentLimit);
            try {
                // 并发处理当前批次的文件
                const results = await Promise.all(batch.map(async (v) => {
                    try {
                        const md5 = await FileUtils_1.default.instance.md5File(v.path);
                        return {
                            relative: FileUtils_1.default.instance.formatPath(v.relative),
                            size: v.size,
                            md5
                        };
                    }
                    catch (error) {
                        this.logger.error(`计算文件MD5失败: ${v.path}`, error);
                        return null;
                    }
                }));
                // 更新assets对象
                results.forEach(result => {
                    if (result) {
                        assets[result.relative] = result.md5;
                    }
                });
            }
            catch (error) {
                this.logger.error('批次处理失败:', error);
            }
        }
        return assets;
    }
    async getAllFiles(dir) {
        this.read();
        const files = await this.md5engine(dir);
        // writeFileSync(join(__dirname, "files.json"), JSON.stringify(files, undefined, 4));
        return files;
    }
    saveMd5(files, isRaw = true) {
        FileUtils_1.default.instance.createDir(this.localEnginePath);
        const path = (0, path_1.join)(this.localEnginePath, `${isRaw ? "raw_" : "local_"}files.json`);
        (0, fs_1.writeFileSync)(path, JSON.stringify(files, undefined, 4));
    }
    readMd5(isRaw = true) {
        const path = (0, path_1.join)(this.localEnginePath, `${isRaw ? "raw_" : "local_"}files.json`);
        if ((0, fs_1.existsSync)(path)) {
            return JSON.parse((0, fs_1.readFileSync)(path, "utf-8"));
        }
        return null;
    }
    /**
     * @description 备份引擎开始
     */
    onBackupEngineBegin() {
        this.logger.log(`${this.module}开始备份引擎`);
    }
    /**
     * @description 备份引擎结束
     */
    onBackupEngineEnd() {
        this.logger.log(`${this.module}引擎备份完成`);
    }
    /**
     * @description 备份引擎
     */
    async backupEngine() {
        try {
            this.onBackupEngineBegin();
            const files = await this.getAllFiles(this.creatorPath);
            for (const key in files) {
                files[key] = files[key].replace(/\\/g, "/");
                const sourcePath = (0, path_1.join)(this.creatorPath, key);
                const destPath = (0, path_1.join)(this.backupEnigineLocalPath, key);
                this.logger.log(`${this.module}备份引擎文件 \nfrom: ${sourcePath} \nto: ${destPath}`);
                await FileUtils_1.default.instance.copyFile(sourcePath, destPath, true);
            }
            // for (const key in files) {
            //     files[key] = files[key].replace(/\\/g, "/");
            //     const sourcePath = join(this.creatorPath, key);
            //     const destPath = join(this.customEnginePath, key);
            //     this.logger.log(`${this.module}备份引擎文件 \nfrom: ${sourcePath} \nto: ${destPath}`);
            //     FileUtils.instance.copyFile(sourcePath, destPath);
            // }
            // 保存引擎原始md5
            this.saveMd5(files);
            // 保存自定义引擎md5
            const customFiles = await this.getAllFiles(this.customEnginePath);
            this.saveMd5(customFiles, false);
            this.onBackupEngineEnd();
        }
        catch (error) {
            this.logger.error(error);
            this.onBackupEngineEnd();
        }
    }
    /**
     * @description 还原引擎开始
     */
    onRestoreEngineBegin() {
        this.logger.log(`${this.module}开始还原引擎`);
    }
    /**
     * @description 还原引擎结束
     */
    onRestoreEngineEnd() {
        this.logger.log(`${this.module}引擎还原完成`);
    }
    /**
     * @description 还原引擎
     */
    async restoreEngine() {
        try {
            this.onRestoreEngineBegin();
            if (!(0, fs_1.existsSync)(this.backupEnigineLocalPath)) {
                throw new Error(`${this.module}备份引擎不存在`);
            }
            // 获取所有的备份文件
            const files = await this.getAllFiles(this.backupEnigineLocalPath);
            if (Object.keys(files).length == 0) {
                throw new Error(`${this.module}备份引擎为空，没有可以还原的文件`);
            }
            let rawMd5 = this.readMd5(true);
            if (!rawMd5) {
                throw new Error(`${this.module}备份引擎原始MD5文件不存在!请先备份引擎`);
            }
            // 还原引擎
            for (const key in files) {
                files[key] = files[key].replace(/\\/g, "/");
                const sourcePath = (0, path_1.join)(this.backupEnigineLocalPath, key);
                const destPath = (0, path_1.join)(this.creatorPath, key);
                const sourceMd5 = await FileUtils_1.default.instance.md5File(sourcePath);
                // 检测原始文件是否被修改
                if (rawMd5[key] !== sourceMd5) {
                    throw new Error(`${this.module}备份引擎文件${sourcePath}已经被修改，无法还原`);
                }
                this.logger.log(`${this.module}还原引擎文件 \nfrom: ${sourcePath} \nto: ${destPath}`);
                await FileUtils_1.default.instance.copyFile(sourcePath, destPath, true);
            }
            // 需要把新增文件删除掉
            const customMd5 = this.readMd5(false);
            for (const key in customMd5) {
                if (!files[key]) {
                    const filePath = (0, path_1.join)(this.creatorPath, key);
                    let isDel = FileUtils_1.default.instance.delFile(filePath);
                    if (isDel) {
                        this.logger.log(`${this.module}删除自定义引擎文件 : ${filePath}`);
                    }
                }
            }
            this.onRestoreEngineEnd();
        }
        catch (error) {
            this.logger.error(error);
            this.onRestoreEngineEnd();
        }
    }
    /**
     * @description 同步引擎开始
     */
    onSyncEngineBegin() {
        this.logger.log(`${this.module}开始同步引擎修改到本地`);
    }
    /**
     * @description 同步引擎结束
     */
    onSyncEngineEnd() {
        this.logger.log(`${this.module}同步引擎修改到本地完成`);
    }
    /**
     * @description 同步引擎修改到本地
     */
    async syncEngineToCustom() {
        try {
            this.onSyncEngineBegin();
            // 获取engine md5
            const rawMd5 = this.readMd5();
            if (!rawMd5) {
                throw new Error(`${this.module}备份引擎原始MD5文件不存在!请先备份引擎`);
            }
            // 获取引擎所有文件
            const files = await this.getAllFiles(this.creatorPath);
            if (Object.keys(files).length == 0) {
                throw new Error(`${this.module}引擎为空，没有可以同步的文件`);
            }
            // 新增的文件
            let addFiles = {};
            // 删除的文件
            let delFiles = {};
            // 变更的文件
            let changeFiles = {};
            for (const key in files) {
                if (!rawMd5[key]) {
                    addFiles[key] = files[key];
                }
                else if (rawMd5[key] !== files[key]) {
                    changeFiles[key] = files[key];
                }
            }
            // 删除的文件
            for (const key in rawMd5) {
                if (!files[key]) {
                    delFiles[key] = rawMd5[key];
                }
            }
            // 保存修改文件到本地
            for (const key in changeFiles) {
                // 先复制修改的文件到本地备份目录
                const src = (0, path_1.join)(this.creatorPath, key);
                const dest = (0, path_1.join)(this.customEnginePath, key);
                // 先判断文件是否是原引擎未改动的文件
                this.logger.log(`${this.module}保存引擎修改文件 \nfrom: ${src} \nto: ${dest}`);
                await FileUtils_1.default.instance.copyFile(src, dest, true);
            }
            // 保存新增文件到本地
            for (const key in addFiles) {
                // 先复制新增的文件到本地备份目录
                const src = (0, path_1.join)(this.creatorPath, key);
                const dest = (0, path_1.join)(this.customEnginePath, key);
                // 先判断文件是否是原引擎未改动的文件
                this.logger.log(`${this.module}保存引擎新增文件 \nfrom: ${src} \nto: ${dest}`);
                await FileUtils_1.default.instance.copyFile(src, dest, true);
            }
            // 删除文件到本地
            for (const key in delFiles) {
                // 先复制删除的文件到本地备份目录
                const dest = (0, path_1.join)(this.customEnginePath, key);
                // 先判断文件是否是原引擎未改动的文件
                this.logger.log(`${this.module}删除文件: ${dest}`);
                await FileUtils_1.default.instance.delFile(dest);
            }
            // 保存最后自定义引擎的md5
            const localMd5 = await this.getAllFiles(this.customEnginePath);
            this.saveMd5(localMd5, false);
            // this.logger.log(`${this.module}原引擎文件量 : ${Object.keys(rawMd5).length} 个\n${JSON.stringify(rawMd5,undefined,4)}`);
            this.logger.log(`${this.module}新增文件数量 : ${Object.keys(addFiles).length} 个\n${JSON.stringify(addFiles, undefined, 4)}`);
            this.logger.log(`${this.module}删除文件数量 : ${Object.keys(delFiles).length} 个\n${JSON.stringify(delFiles, undefined, 4)}`);
            this.logger.log(`${this.module}变更文件数量 : ${Object.keys(changeFiles).length} 个\n${JSON.stringify(changeFiles, undefined, 4)}`);
            this.onSyncEngineEnd();
        }
        catch (error) {
            this.logger.error(error);
            this.onSyncEngineEnd();
        }
    }
    /**
     * @description 同步自定义引擎到引擎
     */
    async syncCustomToEngine() {
        // 获取自定义引擎md5 
        // 用户可能直接在自定义引擎下修改，直接重新读文件
        const files = await this.getAllFiles(this.customEnginePath);
        // 复制文件到引擎目录 // 里面包含了新增，修改
        for (const key in files) {
            const src = (0, path_1.join)(this.customEnginePath, key);
            const dest = (0, path_1.join)(this.creatorPath, key);
            this.logger.log(`${this.module}同步自定义引擎文件 \nfrom: ${src} \nto: ${dest}`);
            await FileUtils_1.default.instance.copyFile(src, dest, true);
        }
        const customMd5 = this.readMd5(false);
        for (const key in customMd5) {
            if (!files[key]) {
                const filePath = (0, path_1.join)(this.creatorPath, key);
                let isDel = FileUtils_1.default.instance.delFile(filePath);
                if (isDel) {
                    this.logger.log(`${this.module}删除自定义引擎文件 : ${filePath}`);
                }
            }
        }
        // 保存最后自定义引擎的md5
        this.saveMd5(files, false);
    }
    async run() {
        await this.restoreEngine();
        await this.backupEngine();
        await this.syncCustomToEngine();
        // this.logger.log(`${this.module}Creator 插件版本 : ${this.creatorPluginVersion});
        // this.logger.log(`${this.module}当前插件版本 : ${this.pluginVersion}`);
        // this.logger.log(`${this.module}Creator 版本 : ${this.creatorVerion}`);
        // this.logger.log(`${this.module}Creator 安装目录 : ${this.creatorPath}`);
        // if (!this.isUpdate) {
        //     this.logger.log(`${this.module}您目录Creator 目录下的插件版本已经是最新`);
        //     return;
        // }
        // if (!this.isSupport(this.creatorVerion)) {
        //     this.logger.log(`${this.module}该插件只能使用在${this.supportVersions.toString()} 版本的Creator`);
        //     this.logger.log(`${this.module}请自己手动对比fix_engine/engine目录下对引擎的修改`);
        //     return;
        // }
        // let keys = Object.keys(this.config);
        // for (let i = 0; i < keys.length; i++) {
        //     let data: FixEngineData = this.config[keys[i]];
        //     if (data.from == "version.json") {
        //         //直接把版本文件写到creator目录下
        //         let destPath = join(this.creatorPath, data.to);
        //         destPath = normalize(destPath);
        //         let sourcePath = join(this.curExtensionPath, `engine/${data.from}`);
        //         sourcePath = normalize(sourcePath);
        //         let sourceData = readFileSync(sourcePath, "utf-8");
        //         writeFileSync(destPath, sourceData, { encoding: "utf-8" });
        //         this.logger.log(`${this.module}${sourcePath} -> ${destPath}`);
        //         this.logger.log(`${this.module}${data.desc}`);
        //     } else if (data.from == "jsbdts") {
        //         //更新热更新声明文件
        //         let destPath = join(this.creatorPath, data.to);
        //         destPath = normalize(destPath);
        //         if (existsSync(destPath)) {
        //             let self = this;
        //             let destData = readFileSync(destPath, "utf-8");
        //             let replaceManifest = function () {
        //                 return arguments[1] + self.HotUpdateDTS.manifest + arguments[3];
        //             }
        //             destData = destData.replace(/(export\s*class\s*Manifest\s*\{)([\s\n\S]*)(constructor\s*\(manifestUrl:\s*string\))/g, replaceManifest);
        //             writeFileSync(destPath, destData, { encoding: "utf-8" });
        //             this.logger.log(`${this.module}${data.desc}`);
        //         } else {
        //             this.logger.error(`${this.module}找不到引擎目录下文件:${destPath}`);
        //         }
        //     } else {
        //         let copyTo = ()=>{
        //             let sourcePath = join(this.curExtensionPath, `engine/${data.from}`);
        //             sourcePath = normalize(sourcePath);
        //             let destPath = join(this.creatorPath, data.to);
        //             destPath = normalize(destPath);
        //             if (existsSync(destPath)) {
        //                 if (existsSync(sourcePath)) {
        //                     let sourceData = readFileSync(sourcePath, "utf-8");
        //                     writeFileSync(destPath, sourceData, { encoding: "utf-8" });
        //                     this.logger.log(`${this.module}${data.desc}`);
        //                 } else {
        //                     this.logger.error(`${this.module}找不到源文件:${sourcePath}`);
        //                 }
        //             } else {
        //                 this.logger.error(`${this.module}找不到引擎目录下文件:${destPath}`);
        //             }
        //         }
        //         //查看本地是否有文件
        //         if ( data.versions ){
        //             let versions = data.versions.split("|");
        //             this.logger.log(`${this.module} 支持版本 : ${versions.toString()}`);
        //             if ( versions.indexOf(this.creatorVerion) >=0 ){
        //                 copyTo();
        //             }
        //         }else{
        //             copyTo();
        //         }
        //     }
        // }
    }
}
exports.default = Helper;
