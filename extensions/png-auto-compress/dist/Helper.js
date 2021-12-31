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
const os = __importStar(require("os"));
const child_process_1 = require("child_process");
const PACKAGE_NAME = 'png-auto-compress';
const LOG_NAME = "[图片压缩]:";
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
        //日志
        this.logger = null;
        /**@description 压缩队列 */
        this.compressTasks = [];
        /**@description 引擎内置资源 */
        this.enginPath = path_1.default.normalize("main");
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
    get pngquantPath() {
        let outPath = null;
        //获取压缩引擎路径
        switch (os.platform()) {
            case "darwin":
                { //MacOS
                    outPath = path_1.default.join(__dirname, "../pngquant/mac/pngquant");
                }
                break;
            case "win32":
                { //Windows
                    outPath = path_1.default.join(__dirname, "../pngquant/windows/pngquant");
                }
                break;
            default: {
            }
        }
        if (outPath) {
            outPath = path_1.normalize(outPath);
        }
        return outPath;
    }
    /**
     * @description 压缩
     * @param srcPath 文件路径
     * @param compressOptions 压缩设置
     */
    compress(srcPath, compressOptions, isCompress, isAutoCompress) {
        let files = [];
        this.readDir(srcPath, files, isCompress);
        let totalCount = files.length;
        let curCount = 0;
        console.log(LOG_NAME, `正在压缩,进度信息请打开【项目工具】->【自动压缩PNG资源】查看`);
        Editor.Message.send(PACKAGE_NAME, "onStartCompress");
        if (isAutoCompress) {
            Editor.Message.send(PACKAGE_NAME, "onSetBuildDir", srcPath);
        }
        files.forEach((info) => {
            this.compressTasks.push(new Promise(res => {
                const sizeBefore = info.size;
                const command = `"${this.pngquantPath}" ${compressOptions} -- "${info.path}"`;
                child_process_1.exec(command, (error, stdout, stderr) => {
                    curCount++;
                    let percent = curCount / totalCount;
                    percent *= 100;
                    percent = parseFloat(percent.toFixed(2));
                    if (isAutoCompress) {
                        Editor.Message.send(PACKAGE_NAME, "onSetBuildDir", srcPath);
                    }
                    Editor.Message.send(PACKAGE_NAME, "updateProgess", percent);
                    this.recordResult(error, sizeBefore, info.path);
                    res(null);
                });
            }));
        });
    }
    /**
     * @description 读取目录下的所有文件的md5及大小信息到obj
     * @param dir 读取目录
     * @param outFiles 输出对象
     * @returns
     */
    readDir(dir, outFiles, isCompress) {
        let stat = fs_1.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        var subpaths = fs_1.readdirSync(dir);
        let subpath = "";
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path_1.default.join(dir, subpaths[i]);
            stat = fs_1.statSync(subpath);
            if (stat.isDirectory()) {
                this.readDir(subpath, outFiles, isCompress);
            }
            else if (stat.isFile()) {
                if (isCompress(subpath)) {
                    outFiles.push({ size: stat.size / 1024, path: subpath });
                }
            }
        }
    }
    printResults() {
        let content = `压缩完成（${this.logger.succeedCount} 张成功 | ${this.logger.failedCount} 张失败）`;
        console.log(LOG_NAME, content);
        const header = `\n # ${'Result'.padEnd(13, ' ')} | ${'Name / Path'.padEnd(50, ' ')} | ${'Size Before'.padEnd(13, ' ')} ->   ${'Size After'.padEnd(13, ' ')} | ${'Saved Size'.padEnd(13, ' ')} | ${'Compressibility'.padEnd(20, ' ')}`;
        content = '压缩日志 >>>' + header + this.logger.successInfo + this.logger.failedInfo;
        console.log(LOG_NAME, content);
        // 清空
        this.logger = null;
    }
    recordResult(error, sizeBefore, filePath) {
        if (!error) {
            // 成功
            this.logger.succeedCount++;
            const fileName = path_1.default.basename(filePath);
            const sizeAfter = fs_1.statSync(filePath).size / 1024;
            const savedSize = sizeBefore - sizeAfter;
            const savedRatio = savedSize / sizeBefore * 100;
            this.logger.successInfo += `\n + ${'Successful'.padEnd(13, ' ')} | ${fileName.padEnd(50, ' ')} | ${(sizeBefore.toFixed(2) + ' KB').padEnd(13, ' ')} ->   ${(sizeAfter.toFixed(2) + ' KB').padEnd(13, ' ')} | ${(savedSize.toFixed(2) + ' KB').padEnd(13, ' ')} | ${(savedRatio.toFixed(2) + '%').padEnd(20, ' ')}`;
        }
        else {
            // 失败
            this.logger.failedCount++;
            this.logger.failedInfo += `\n - ${'Failed'.padEnd(13, ' ')} | ${filePath.replace(Editor.Project.path, '')}`;
            switch (error.code) {
                case 98:
                    this.logger.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩后体积增大（已经不能再压缩了）`;
                    break;
                case 99:
                    this.logger.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩后质量低于已配置最低质量`;
                    break;
                case 127:
                    this.logger.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩引擎没有执行权限`;
                    break;
                default:
                    this.logger.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：code ${error.code}`;
                    break;
            }
        }
    }
    /**@description 开始压缩资源 */
    async startCompress(dir, isCompress, isAutoCompress = true) {
        console.log(LOG_NAME, "准备压缩 PNG 资源...");
        let pngquant = this.pngquantPath;
        if (pngquant == null) {
            console.error(LOG_NAME, "压缩引擎不支持当前系统平台！");
            return;
        }
        console.log(LOG_NAME, `压缩工具路径:${pngquant}`);
        // 设置压缩命令
        const qualityParam = `--quality ${this.config.minQuality}-${this.config.maxQuality}`;
        const speedParam = `--speed ${this.config.speed}`;
        const skipParam = '--skip-if-larger';
        const outputParam = '--ext=.png';
        const writeParam = '--force';
        const compressOptions = `${qualityParam} ${speedParam} ${skipParam} ${outputParam} ${writeParam}`;
        //日志重置
        this.logger = {
            succeedCount: 0,
            failedCount: 0,
            successInfo: "",
            failedInfo: ""
        };
        //开始压缩
        console.warn(LOG_NAME, "开始压缩 PNG 资源，请勿进行其他操作！");
        // 初始化队列
        this.compressTasks = [];
        //遍历项目资源
        if (fs_1.existsSync(dir)) {
            console.log(LOG_NAME, `压缩资源路径:${dir}`);
            this.compress(dir, compressOptions, isCompress, isAutoCompress);
        }
        //开始压缩并等待压缩完成
        await Promise.all(this.compressTasks);
        //清空队列
        this.compressTasks = [];
        //打印压缩结果 
        this.printResults();
    }
    async onAfterBuild(dest) {
        if (this.config.enabled) {
            console.log(LOG_NAME, `构建输出目录:${dest}`);
            const resPath = path_1.default.join(dest, "assets/assets");
            this.startCompress(resPath, (filePath) => {
                // 排除非 png 资源和内置资源
                if (path_1.default.extname(filePath) !== '.png' || filePath.includes(this.enginPath)) {
                    return false;
                }
                return true;
            }, true);
        }
    }
    /**@description 对项目资源目录进度图片压缩 */
    onStartCompress(sourceAssetsDir) {
        // 需要排除的文件夹
        let excludeFolders = this.config.excludeFolders.split(",").map(value => value.trim());
        //去除空的
        let i = excludeFolders.length;
        while (i--) {
            if (!!!excludeFolders[i]) {
                excludeFolders.splice(i);
            }
        }
        excludeFolders = excludeFolders.map(value => path_1.normalize(value));
        // 需要排除的文件
        let excludeFiles = this.config.excludeFiles.split(",").map(value => value.trim());
        //去除空的
        i = excludeFiles.length;
        while (i--) {
            if (!!!excludeFiles[i]) {
                excludeFiles.splice(i);
            }
        }
        excludeFiles = excludeFiles.map(value => path_1.normalize(value));
        if (excludeFolders.length > 0) {
            console.log(`需要排除目录:`, excludeFolders);
        }
        if (excludeFiles.length > 0) {
            console.log(`需要排除文件:`, excludeFiles);
        }
        this.startCompress(sourceAssetsDir, (filePath) => {
            // 排除非 png 资源和内置资源
            if (path_1.default.extname(filePath) !== '.png' || filePath.includes(this.enginPath)) {
                return false;
            }
            //排除指定
            for (let i = 0; i < excludeFolders.length; i++) {
                let tempPath = path_1.join(sourceAssetsDir, excludeFolders[i]);
                if (filePath.startsWith(tempPath)) {
                    // console.log(`需要排除目录:${excludeFolders[i]}`);
                    return false;
                }
            }
            //排除指定文件
            for (let i = 0; i < excludeFiles.length; i++) {
                let tempPath = path_1.join(sourceAssetsDir, excludeFiles[i]);
                if (filePath.startsWith(tempPath)) {
                    // console.log(`需要排除文件:${excludeFiles[i]}`);
                    return false;
                }
            }
            return true;
        }, false);
    }
}
exports.helper = new Helper();
