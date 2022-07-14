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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
const fs_1 = require("fs");
const path_1 = __importStar(require("path"));
class _Tools {
    constructor() {
        /**@description 等待复制文件 <from,to>*/
        this.copys = [];
        /**@description 最大允许复制数量 */
        this.maxCopy = 50;
        /**@description 当前正常复制的数量 */
        this.curCopy = 0;
        /**@description 当前已经复制的文件数量 */
        this.alreadyCopy = 0;
    }
    /**@description 获取目录下文件个数 */
    getDirFileCount(dir) {
        let count = 0;
        let counter = (dir) => {
            let readdir = (0, fs_1.readdirSync)(dir);
            for (let i in readdir) {
                let fullPath = path_1.default.join(dir, readdir[i]);
                if ((0, fs_1.statSync)(fullPath).isDirectory()) {
                    counter(fullPath);
                }
                else {
                    count++;
                }
            }
        };
        counter(dir);
        return count;
    }
    /**@description 压缩文件到zip */
    zipDir(dir, jszip) {
        if (!(0, fs_1.existsSync)(dir) || !jszip) {
            return;
        }
        let readDirs = (0, fs_1.readdirSync)(dir);
        for (let i = 0; i < readDirs.length; i++) {
            let file = readDirs[i];
            let fullPath = path_1.default.join(dir, file);
            let stat = (0, fs_1.statSync)(fullPath);
            if (stat.isFile()) {
                jszip.file(file, (0, fs_1.readFileSync)(fullPath));
            }
            else {
                stat.isDirectory() && this.zipDir(fullPath, jszip.folder(file));
            }
        }
    }
    getZipName(bundle, md5) {
        return `${bundle}_${md5}.zip`;
    }
    /**
     * @description 打包版本文件
     */
    zipVersions(config) {
        let JSZIP = require("jszip");
        let jszip = new JSZIP();
        for (let index = 0; index < config.mainIncludes.length; index++) {
            const element = config.mainIncludes[index];
            let fullPath = path_1.default.join(config.buildDir, element);
            fullPath = (0, path_1.normalize)(fullPath);
            this.zipDir(fullPath, jszip.folder(element));
        }
        let bundles = Object.keys(config.bundles);
        let count = 0;
        let total = bundles.length + 1; //+1主包的进度也要包含到里面
        let packZipName = this.getZipName("main", config.versions["main"].md5);
        let packZipRootPath = Editor.Project.path + "/PackageVersion";
        packZipRootPath = (0, path_1.normalize)(packZipRootPath);
        let packVersionZipPath = path_1.default.join(packZipRootPath, packZipName);
        this.delDir(packZipRootPath);
        this.mkdirSync(packZipRootPath);
        config.log(`打包路径: ${packZipRootPath}`);
        jszip.generateNodeStream({
            type: "nodebuffer",
            streamFiles: !0
        }).pipe((0, fs_1.createWriteStream)(packVersionZipPath)).once("error", (e) => {
            config.log("[打包] 打包失败:" + e.message);
            count++;
            config.handler(count == total);
        }).once("finish", () => {
            config.log("[打包] 打包成功: " + packZipName);
        }).once("close", () => {
            // config.log("[打包] 打包关闭: " + packZipName)
            count++;
            config.handler(count == total);
        });
        //打包子版本
        for (let index = 0; index < bundles.length; index++) {
            const element = config.bundles[bundles[index]];
            let packZipName = this.getZipName(element.dir, config.versions[element.dir].md5);
            let packVersionZipPath = path_1.default.join(packZipRootPath, packZipName);
            let jszip = new JSZIP();
            let fullPath = path_1.default.join(config.buildDir, `assets/${element.dir}`);
            this.zipDir(fullPath, jszip.folder(`assets/${element.dir}`));
            config.log(`[打包] ${element.name} ${element.dir} ...`);
            let data = jszip.generateNodeStream({
                type: "nodebuffer",
                streamFiles: !0
            }).pipe((0, fs_1.createWriteStream)(packVersionZipPath)).once("error", (e) => {
                config.log("[打包] 打包失败:" + e.message);
                count++;
                config.handler(count == total);
            }).once("finish", () => {
                config.log("[打包] 打包成功: " + packZipName);
            }).once("close", () => {
                // config.log("[打包] 打包关闭: " + packZipName)
                count++;
                config.handler(count == total);
            });
        }
    }
    /**@description 创建目录 */
    mkdirSync(dir) {
        try {
            dir = (0, path_1.normalize)(dir);
            (0, fs_1.mkdirSync)(dir);
        }
        catch (e) {
            if ("EEXIST" !== e.code)
                throw e;
        }
    }
    /**
     * @description 删除目录
     * @param sourceDir 源目录
     * @param isRemoveSourceDir 是否删除源目录本身，默认不删除
     */
    delDir(sourceDir, isRemoveSourceDir = false) {
        let delFile = (dir) => {
            if (!(0, fs_1.existsSync)(dir))
                return;
            let readDir = (0, fs_1.readdirSync)(dir);
            for (let i in readDir) {
                let fullPath = path_1.default.join(dir, readDir[i]);
                (0, fs_1.statSync)(fullPath).isDirectory() ? delFile(fullPath) : (0, fs_1.unlinkSync)(fullPath);
            }
        };
        let delDir = (dir) => {
            if (!(0, fs_1.existsSync)(dir))
                return;
            let readDir = (0, fs_1.readdirSync)(dir);
            if (readDir.length > 0) {
                for (let i in readDir) {
                    let fullPath = path_1.default.join(dir, readDir[i]);
                    delDir(fullPath);
                }
                (dir !== sourceDir || isRemoveSourceDir) && (0, fs_1.rmdirSync)(dir);
            }
            else {
                (dir !== sourceDir || isRemoveSourceDir) && (0, fs_1.rmdirSync)(dir);
            }
        };
        delFile(sourceDir);
        delDir(sourceDir);
    }
    /**
     * @description 删除文件
     * @param filePath
     * @returns
     */
    delFile(filePath) {
        if ((0, fs_1.existsSync)(filePath)) {
            (0, fs_1.unlinkSync)(filePath);
            return true;
        }
        return false;
    }
    createDir(dir) {
        if (!(0, fs_1.existsSync)(dir)) {
            // console.log(`创建目录 : ${dir}`);
            (0, fs_1.mkdirSync)(dir);
        }
    }
    createCopyDatas(source, dest) {
        let stat = (0, fs_1.statSync)(source);
        if (!stat.isDirectory()) {
            return;
        }
        this.createDir(dest);
        let from = "";
        let to = "";
        let create = (source, dest) => {
            let readdir = (0, fs_1.readdirSync)(source);
            readdir.forEach(v => {
                from = (0, path_1.join)(source, v);
                to = (0, path_1.join)(dest, v);
                if ((0, fs_1.statSync)(from).isDirectory()) {
                    this.createDir(to);
                    create(from, to);
                }
                else {
                    this.copys.push({ from: from, to: to });
                }
            });
        };
        create(source, dest);
    }
    resetCopy() {
        this.copys = [];
        this.curCopy = 0;
        this.alreadyCopy = 0;
    }
    /**
     * @description 复制整个目录
     * @param source 源
     * @param dest 目标
     * @param onComplete 复制文件完成回调
     */
    copySourceDirToDesDir(source, dest, onComplete) {
        this.createCopyDatas(source, dest);
        this.copyFile(onComplete);
    }
    copyFile(onComplete) {
        // console.log(`复制文总数 : ${this.alreadyCopy}`);
        if (this.curCopy > this.maxCopy) {
            console.log("复制文件总数已经达到上限，等待其它文件复制完成，再进行复制");
            return;
        }
        while (this.curCopy < this.maxCopy && this.copys.length > 0) {
            let data = this.copys.shift();
            if (data) {
                this.curCopy++;
                let readStream = (0, fs_1.createReadStream)(data.from);
                let writeStram = (0, fs_1.createWriteStream)(data.to);
                readStream.pipe(writeStram).once("finish", () => {
                }).once("close", () => {
                    this.alreadyCopy++;
                    // console.log(`复制文件 : ${first?.from} - > ${first?.to}`);
                    if (onComplete)
                        onComplete();
                    this.curCopy--;
                    this.copyFile(onComplete);
                });
            }
        }
    }
    updateZipSize(source) {
        let keys = Object.keys(source);
        keys.forEach(bundle => {
            let data = source[bundle];
            let packZipRootPath = Editor.Project.path + "/PackageVersion";
            packZipRootPath = (0, path_1.normalize)(packZipRootPath);
            let zipName = this.getZipName(bundle, data.md5);
            let packVersionZipPath = path_1.default.join(packZipRootPath, zipName);
            if ((0, fs_1.existsSync)(packVersionZipPath)) {
                let stat = (0, fs_1.statSync)(packVersionZipPath);
                data.project.size = stat.size;
                console.log(`${zipName} 文件大小 : ${stat.size}`);
            }
            else {
                console.error(`不存在 : ${packVersionZipPath}`);
            }
        });
    }
    /**
     * @description 读取目录下的所有文件的md5及大小信息到obj
     * @param dir 读取目录
     * @param obj 输出对象
     * @param source
     * @returns
     */
    readDir(dir, obj, source) {
        var stat = (0, fs_1.statSync)(dir);
        if (!stat.isDirectory()) {
            return;
        }
        var subpaths = (0, fs_1.readdirSync)(dir), subpath, size, md5, compressed, relative;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path_1.default.join(dir, subpaths[i]);
            stat = (0, fs_1.statSync)(subpath);
            if (stat.isDirectory()) {
                this.readDir(subpath, obj, source);
            }
            else if (stat.isFile()) {
                // Size in Bytes
                size = stat['size'];
                // creator >= 3.4.2 , md5 变化问题引擎组已经修复
                md5 = require("crypto").createHash('md5').update((0, fs_1.readFileSync)(subpath)).digest('hex');
                compressed = path_1.default.extname(subpath).toLowerCase() === '.zip';
                relative = path_1.default.relative(source, subpath);
                relative = relative.replace(/\\/g, '/');
                relative = encodeURI(relative);
                obj[relative] = {
                    'size': size,
                    'md5': md5
                };
                if (compressed) {
                    obj[relative].compressed = true;
                }
            }
        }
    }
    get bundles() {
        let dir = (0, path_1.join)(Editor.Project.path, "assets/bundles");
        let stat = (0, fs_1.statSync)(dir);
        let result = [];
        if (!stat.isDirectory()) {
            return result;
        }
        let subpaths = (0, fs_1.readdirSync)(dir);
        let subpath = "";
        for (let i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path_1.default.join(dir, subpaths[i]);
            stat = (0, fs_1.statSync)(subpath);
            if (stat.isDirectory()) {
                result.push(path_1.default.relative(dir, subpath));
            }
        }
        return result;
    }
}
exports.Tools = new _Tools();
