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
                "resources/3d/engine/native/extensions/assets-manager/AssetsManagerEx.*",
                "resources/3d/engine/native/extensions/assets-manager/Manifest.*",
                "resources/3d/engine/native/cocos/bindings/auto/jsb_extension_auto.cpp",
                "resources/3d/engine/bin/.declarations/cc.d.ts",
                "resources/3d/engine/native/cocos/application/BaseGame.cpp",
                "resources/3d/engine/native/tools/simulator/frameworks/runtime-src/Classes/Game.cpp",
            ],
            exclude: [],
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
    get customEngineRoot() {
        return (0, path_1.join)(this.projPath, `engine/${this.creatorVerion}`);
    }
    /**@description 备份指定版本引擎路径 */
    get backupEnigineLocalPath() {
        return (0, path_1.join)(this.customEngineRoot, `backupEngine`);
    }
    /**@description 修改指定版本引擎路径 */
    get customEnginePath() {
        return (0, path_1.join)(this.customEngineRoot, `customEngine`);
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
        FileUtils_1.default.instance.createDir(this.customEngineRoot);
        const path = (0, path_1.join)(this.customEngineRoot, `${isRaw ? "raw_" : "local_"}files.json`);
        (0, fs_1.writeFileSync)(path, JSON.stringify(files, undefined, 4));
    }
    readMd5(isRaw = true) {
        const path = (0, path_1.join)(this.customEngineRoot, `${isRaw ? "raw_" : "local_"}files.json`);
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
    async sync(fromMd5, toMd5, fromRoot, toRoot, tag) {
        let addFiles = {};
        let delFiles = {};
        let changeFiles = {};
        for (const key in fromMd5) {
            if (!toMd5[key]) {
                addFiles[key] = fromMd5[key];
            }
            else if (toMd5[key] !== fromMd5[key]) {
                changeFiles[key] = fromMd5[key];
            }
        }
        for (const key in toMd5) {
            if (!fromMd5[key]) {
                delFiles[key] = toMd5[key];
            }
        }
        this.logger.log(`${this.module}${tag}新增文件数量 : ${Object.keys(addFiles).length} 个\n${JSON.stringify(addFiles, undefined, 4)}`);
        this.logger.log(`${this.module}${tag}删除文件数量 : ${Object.keys(delFiles).length} 个\n${JSON.stringify(delFiles, undefined, 4)}`);
        this.logger.log(`${this.module}${tag}变更文件数量 : ${Object.keys(changeFiles).length} 个\n${JSON.stringify(changeFiles, undefined, 4)}`);
        for (const key in addFiles) {
            const src = (0, path_1.join)(fromRoot, key);
            const dest = (0, path_1.join)(toRoot, key);
            this.logger.log(`${this.module}${tag}新增文件 \nfrom: ${src} \nto: ${dest}`);
            await FileUtils_1.default.instance.copyFile(src, dest, true);
        }
        for (const key in delFiles) {
            const filePath = (0, path_1.join)(toRoot, key);
            let isDel = FileUtils_1.default.instance.delFile(filePath);
            if (isDel) {
                this.logger.log(`${this.module}${tag}删除文件 : ${filePath}`);
            }
        }
        for (const key in changeFiles) {
            const src = (0, path_1.join)(fromRoot, key);
            const dest = (0, path_1.join)(toRoot, key);
            this.logger.log(`${this.module}${tag}变更文件 \nfrom: ${src} \nto: ${dest}`);
            await FileUtils_1.default.instance.copyFile(src, dest, true);
        }
    }
    /**
     * @description 同步引擎修改到本地
     */
    async syncEngineToCustom() {
        try {
            this.onSyncEngineBegin();
            // 获取engine md5
            const rawEngineMd5 = this.readMd5();
            if (!rawEngineMd5) {
                throw new Error(`${this.module}备份引擎原始MD5文件不存在!请先备份引擎`);
            }
            // 获取当前引擎md5
            const curRawEngineMd5 = await this.getAllFiles(this.creatorPath);
            if (Object.keys(curRawEngineMd5).length == 0) {
                throw new Error(`${this.module}引擎为空，没有可以同步的文件`);
            }
            // 获取自定义引擎md5
            const curCustomEngineMd5 = await this.getAllFiles(this.customEnginePath);
            await this.sync(curRawEngineMd5, curCustomEngineMd5, this.creatorPath, this.customEnginePath, '【引擎->自定义引擎】');
            // 更新自定义引擎的md5
            this.saveMd5(curRawEngineMd5, false);
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
        // 获取自定义引擎最新md5 
        const curCustomEngineMd5 = await this.getAllFiles(this.customEnginePath);
        const rawEngineMd5 = this.readMd5(true);
        if (!rawEngineMd5) {
            throw new Error(`${this.module}备份引擎原始MD5文件不存在!请先备份引擎`);
        }
        // 重新获取当前引擎md5
        let curRawEngineMd5 = await this.getAllFiles(this.creatorPath);
        await this.sync(curCustomEngineMd5, curRawEngineMd5, this.customEnginePath, this.creatorPath, '【自定义引擎->引擎】');
        // 更新自定义引擎的md5
        this.saveMd5(curCustomEngineMd5, false);
    }
    checkBackupEngine() {
        try {
            if (!(0, fs_1.existsSync)(this.backupEnigineLocalPath)) {
                return false;
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async run() {
        await this.restoreEngine();
        await this.backupEngine();
        await this.syncCustomToEngine();
        // await this.syncEngineToCustom();
    }
}
exports.default = Helper;
