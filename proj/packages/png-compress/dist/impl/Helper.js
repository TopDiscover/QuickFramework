"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const Config_1 = __importDefault(require("../core/Config"));
const Defines_1 = require("../core/Defines");
const os = __importStar(require("os"));
const FileUtils_1 = __importDefault(require("../core/FileUtils"));
const fs_1 = require("fs");
const Environment_1 = require("../core/Environment");
const AssetsHelper_1 = __importDefault(require("../core/AssetsHelper"));
/**
 * @description pngquant 图集压缩
 */
class Helper extends Config_1.default {
    constructor() {
        super(...arguments);
        this.module = "【图片压缩】";
        this.defaultData = {
            enabled: false,
            enabledNoFound: true,
            minQuality: 40,
            maxQuality: 80,
            speed: 3,
            isProcessing: false,
            excludeFolders: "",
            excludeFiles: "",
        };
        this._dest = null;
        this._platform = null;
        //日志记录
        this.records = null;
        //压缩队列 
        this.compressTasks = [];
        this._assetsHelper = new AssetsHelper_1.default();
    }
    get path() {
        let out = (0, path_1.join)(this.configPath, `${Defines_1.Extensions.PngCompress}.json`);
        return out;
    }
    get data() {
        if (!this._data) {
            this.read(true);
        }
        return this._data;
    }
    get dest() {
        return Environment_1.Environment.build.dest;
    }
    set dest(v) {
        this._dest = v;
    }
    get platform() {
        return Environment_1.Environment.build.platform;
    }
    set platform(v) {
        this._platform = v;
    }
    get pngquantPath() {
        let path = null;
        switch (os.platform()) {
            case "darwin":
                { //MacOS
                    path = (0, path_1.join)(this.extensionsPath, `${Defines_1.Extensions.PngCompress}/pngquant/mac/pngquant`);
                }
                break;
            case "win32":
                { //Windows
                    path = (0, path_1.join)(this.extensionsPath, `${Defines_1.Extensions.PngCompress}/pngquant/windows/pngquant`);
                }
                break;
            default: {
            }
        }
        return path;
    }
    /**@description 引擎内置资源 */
    get enginPath() {
        if (Environment_1.Environment.isVersion3X) {
            return "main";
        }
        else {
            return "internal";
        }
    }
    get assetsHelper() {
        return this._assetsHelper;
    }
    get isWriteLog() {
        return false;
    }
    onStartCompress() {
        this.logger.log(`${this.module}压缩开始`);
        // Editor.Message.send(PACKAGE_NAME, "onStartCompress");
    }
    onSetBuildDir(path) {
        // this.logger.log(`${this.module}设置压缩目录 : ${path}`)
        // Editor.Message.send(PACKAGE_NAME, "onSetBuildDir", path);
    }
    onUpdateProgess(percent) {
        // this.logger.log(`${this.module}当前压缩进度 : ${percent}`);
        // Editor.Message.send(PACKAGE_NAME, "updateProgess", percent)
    }
    onPngCompressComplete(dest, platfrom) {
        this.logger.log(`${this.module}压缩完成`);
        // Editor.Message.send("hotupdate","onPngCompressComplete",dest,platfrom);
    }
    /**
     * @description 压缩
     * @param srcPath 文件路径
     * @param compressOptions 压缩设置
     */
    compress(srcPath, compressOptions, isCompress, isAutoCompress) {
        let files = FileUtils_1.default.instance.getFiles(srcPath, isCompress);
        let totalCount = files.length;
        let curCount = 0;
        this.logger.log(this.module, `正在压缩,进度信息请打开【项目工具】->【图片压缩】查看`);
        this.onStartCompress();
        if (isAutoCompress) {
            this.onSetBuildDir(srcPath);
        }
        files.forEach((info) => {
            this.compressTasks.push(new Promise(res => {
                const sizeBefore = info.size / 1024;
                const command = `"${this.pngquantPath}" ${compressOptions} -- "${info.path}"`;
                this.exec(command, false).then((result) => {
                    curCount++;
                    let percent = curCount / totalCount;
                    percent *= 100;
                    percent = parseFloat(percent.toFixed(2));
                    if (isAutoCompress) {
                        this.onSetBuildDir(srcPath);
                    }
                    this.onUpdateProgess(percent);
                    let err = result.data;
                    if (result.isSuccess) {
                        err = null;
                    }
                    this.recordResult(err, sizeBefore, info);
                    res(null);
                });
            }));
        });
    }
    printResults() {
        let content = `压缩完成（${this.records.successCount} 张成功 | ${this.records.failedCount} 张失败）`;
        this.logger.log(this.module, content);
        const header = `\n # ${'Result'.padEnd(13, ' ')} | ${'Name / Path'.padEnd(50, ' ')} | ${'Size Before'.padEnd(13, ' ')} ->   ${'Size After'.padEnd(13, ' ')} | ${'Saved Size'.padEnd(13, ' ')} | ${'Compressibility'.padEnd(20, ' ')}`;
        content = '压缩日志 >>>' + header + this.records.successInfo + this.records.failedInfo;
        this.logger.log(this.module, content);
        // 清空
        this.logger = null;
        //写入本地文件
        if (this.isWriteLog) {
            this.records.successAssets.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                }
                else if (a.name == b.name) {
                    return 0;
                }
                else {
                    return -1;
                }
            });
            this.records.failedAssets.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                }
                else if (a.name == b.name) {
                    return 0;
                }
                else {
                    return -1;
                }
            });
            let data = {
                success: this.records.successAssets,
                failed: this.records.failedAssets
            };
            let path = (0, path_1.join)(this.localPath, `${Defines_1.Extensions.PngCompress}${this.date}_cache.json`);
            (0, fs_1.writeFileSync)(path, JSON.stringify(data), "utf-8");
        }
    }
    recordResult(error, sizeBefore, info) {
        if (!error) {
            // 成功
            this.records.successCount++;
            const fileName = (0, path_1.basename)(info.path);
            const sizeAfter = (0, fs_1.statSync)(info.path).size / 1024;
            const savedSize = sizeBefore - sizeAfter;
            const savedRatio = savedSize / sizeBefore * 100;
            this.records.successAssets.push(info);
            this.records.successInfo += `\n + ${'Successful'.padEnd(13, ' ')} | ${fileName.padEnd(50, ' ')} | ${(sizeBefore.toFixed(2) + ' KB').padEnd(13, ' ')} ->   ${(sizeAfter.toFixed(2) + ' KB').padEnd(13, ' ')} | ${(savedSize.toFixed(2) + ' KB').padEnd(13, ' ')} | ${(savedRatio.toFixed(2) + '%').padEnd(20, ' ')}`;
        }
        else {
            // 失败
            this.records.failedCount++;
            this.records.failedInfo += `\n - ${'Failed'.padEnd(13, ' ')} | ${info.relative}`;
            switch (error.code) {
                case 98:
                    this.records.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩后体积增大（已经不能再压缩了）`;
                    break;
                case 99:
                    this.records.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩后质量低于已配置最低质量`;
                    break;
                case 127:
                    this.records.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩引擎没有执行权限`;
                    break;
                default:
                    this.records.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：code ${error.code}`;
                    break;
            }
            this.records.failedAssets.push(info);
        }
    }
    /**@description 开始压缩资源 */
    async _startCompress(dir, isCompress, isAutoCompress = true) {
        this.logger.log(this.module, "准备压缩 PNG 资源...");
        let pngquant = this.pngquantPath;
        if (pngquant == null) {
            this.logger.error(this.module, "压缩引擎不支持当前系统平台！");
            return;
        }
        this.logger.log(this.module, `压缩工具路径:${pngquant}`);
        // 设置压缩命令
        const qualityParam = `--quality ${this.data.minQuality}-${this.data.maxQuality}`;
        const speedParam = `--speed ${this.data.speed}`;
        const skipParam = '--skip-if-larger';
        const outputParam = '--ext=.png';
        const writeParam = '--force';
        const compressOptions = `${qualityParam} ${speedParam} ${skipParam} ${outputParam} ${writeParam}`;
        //日志重置
        this.records = {
            successCount: 0,
            failedCount: 0,
            successInfo: "",
            failedInfo: "",
            successAssets: [],
            failedAssets: []
        };
        //开始压缩
        this.logger.warn(this.module, "开始压缩 PNG 资源，请勿进行其他操作！");
        // 初始化队列
        this.compressTasks = [];
        //遍历项目资源
        if ((0, fs_1.existsSync)(dir)) {
            this.logger.log(this.module, `压缩资源路径:${dir}`);
            this.compress(dir, compressOptions, isCompress, isAutoCompress);
        }
        //开始压缩并等待压缩完成
        await Promise.all(this.compressTasks);
        //清空队列
        this.compressTasks = [];
        //打印压缩结果 
        this.printResults();
        this.onPngCompressComplete(this.dest, this.platform);
    }
    getPlatformAssetDir(platform) {
        if (Environment_1.Environment.isVersion3X) {
            if (platform == "android" || platform == "windows" || platform == "ios" || platform == "mac") {
                return "assets/assets";
            }
            else {
                return "assets";
            }
        }
        else {
            return "assets";
        }
    }
    getUUID(filePath, md5Cache) {
        let ret = (0, path_1.parse)(filePath);
        if (md5Cache) {
            //如果加了md5,需要在取一次，才能取到uuid
            ret = (0, path_1.parse)(ret.name);
            return ret.name;
        }
        else {
            return ret.name;
        }
    }
    /**@description 需要排除的文件目录 */
    get excludeFolders() {
        let content = this.data.excludeFolders.replace(/\n/g, ",");
        // 需要排除的文件夹
        let excludeFolders = content.split(",").map(value => value.trim());
        //去除空的
        let i = excludeFolders.length;
        while (i--) {
            if (!!!excludeFolders[i]) {
                excludeFolders.splice(i);
            }
        }
        excludeFolders = excludeFolders.map(value => (0, path_1.normalize)(value));
        return excludeFolders;
    }
    /**@description 需要排除的文件 */
    get excludeFiles() {
        let content = this.data.excludeFiles.replace(/\n/g, ",");
        // 需要排除的文件
        let excludeFiles = content.split(",").map(value => value.trim());
        //去除空的
        let i = excludeFiles.length;
        while (i--) {
            if (!!!excludeFiles[i]) {
                excludeFiles.splice(i);
            }
        }
        excludeFiles = excludeFiles.map(value => (0, path_1.normalize)(value));
        return excludeFiles;
    }
    /**@description 获取工程目录所有资源信息资源 */
    async getAllAssets() {
        return this.assetsHelper.getAssets();
    }
    /**@description 测试用 */
    saveAllAssets(assets) {
        let path = (0, path_1.join)(this.localPath, "assets_cache.json");
        (0, fs_1.writeFileSync)(path, JSON.stringify(assets), "utf-8");
    }
    async onAfterBuild(options) {
        this.logger.log(`${this.module} 构建完成后是否自动压缩资源:${this.data.enabled}`);
        this.logger.log(`${this.module} 构建平台:${options.platform}`);
        this.dest = options.dest;
        this.platform = options.platform;
        if (this.data.enabled) {
            this.logger.log(this.module, `构建目录:${options.dest}`);
            const resPath = (0, path_1.join)(options.dest, this.getPlatformAssetDir(options.platform));
            this.logger.log(this.module, `构建资源目录:${resPath}`);
            //先拿到资源
            let allAssets = await this.getAllAssets();
            //找出所有图片
            let allImages = {};
            allAssets.forEach((info) => {
                if (Environment_1.Environment.isVersion3X) {
                    //排除图片资源 
                    if (info.type == "cc.ImageAsset" || info.type == "cc.SpriteAtlas") {
                        allImages[info.uuid] = info;
                    }
                }
            });
            this.saveAllAssets(allAssets);
            // 需要排除的文件夹
            let excludeFolders = this.excludeFolders;
            let excludeFiles = this.excludeFiles;
            if (excludeFolders.length > 0) {
                this.logger.log(`需要排除目录:`, excludeFolders);
            }
            if (excludeFiles.length > 0) {
                this.logger.log(`需要排除文件:`, excludeFiles);
            }
            const sourceAssetsDir = this.assetsDBPath;
            await this._startCompress(resPath, (result) => {
                // 排除非 png 资源和内置资源
                if ((0, path_1.extname)(result.path) !== '.png' || result.path.includes(this.enginPath)) {
                    return false;
                }
                let uuid = this.getUUID(result.path, options.md5Cache);
                let info = allImages[uuid];
                if (info) {
                    let sourcePath = Environment_1.Environment.isVersion3X ? info.file : info.path;
                    if (!sourcePath) {
                        // this.logger.log(`未找到${uuid}的原始文件`);
                        return false;
                    }
                    //排除指定
                    for (let i = 0; i < excludeFolders.length; i++) {
                        let tempPath = (0, path_1.join)(sourceAssetsDir, excludeFolders[i]);
                        if (sourcePath.startsWith(tempPath)) {
                            // this.logger.log(`需要排除目录:${excludeFolders[i]}`);
                            // this.logger.log(`构建目录文件路径:${result.path}`);
                            // this.logger.log(`源文件路径:${sourcePath}`);
                            return false;
                        }
                    }
                    //排除指定文件
                    for (let i = 0; i < excludeFiles.length; i++) {
                        let tempPath = (0, path_1.join)(sourceAssetsDir, excludeFiles[i]);
                        if (sourcePath.startsWith(tempPath)) {
                            // this.logger.log(`需要排除文件:${excludeFiles[i]}`);
                            // this.logger.log(`构建目录文件路径:${result.path}`);
                            // this.logger.log(`源文件路径:${sourcePath}`);
                            return false;
                        }
                    }
                }
                else {
                    if (this.data.enabledNoFound) {
                        return true;
                    }
                    else {
                        this.logger.warn(`反向查找该文件无法找:${result.path},未开启反向无法找到资源强行压缩，跳过压缩处理`);
                        return false;
                    }
                }
                return true;
            }, true);
        }
        else {
            this.onPngCompressComplete(this.dest, this.platform);
        }
    }
    /**@description 对项目资源目录进度图片压缩 */
    async startCompress(sourceAssetsDir) {
        // 需要排除的文件夹
        let excludeFolders = this.excludeFolders;
        // 需要排除的文件
        let excludeFiles = this.excludeFiles;
        if (excludeFolders.length > 0) {
            this.logger.log(`需要排除目录:`, excludeFolders);
        }
        if (excludeFiles.length > 0) {
            this.logger.log(`需要排除文件:`, excludeFiles);
        }
        await this._startCompress(sourceAssetsDir, (info) => {
            // 排除非 png 资源和内置资源
            if ((0, path_1.extname)(info.path) !== '.png' || info.path.includes(this.enginPath)) {
                return false;
            }
            //排除指定
            for (let i = 0; i < excludeFolders.length; i++) {
                let tempPath = (0, path_1.join)(sourceAssetsDir, excludeFolders[i]);
                if (info.path.startsWith(tempPath)) {
                    // this.logger.log(`需要排除目录:${excludeFolders[i]}`);
                    return false;
                }
            }
            //排除指定文件
            for (let i = 0; i < excludeFiles.length; i++) {
                let tempPath = (0, path_1.join)(sourceAssetsDir, excludeFiles[i]);
                if (info.path.startsWith(tempPath)) {
                    // this.logger.log(`需要排除文件:${excludeFiles[i]}`);
                    return false;
                }
            }
            return true;
        }, false);
    }
}
exports.default = Helper;
