"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const archiver_1 = __importDefault(require("archiver"));
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const Environment_1 = require("./Environment");
const Handler_1 = require("./Handler");
class FileUtils extends Handler_1.Handler {
    constructor() {
        super(...arguments);
        this.module = "【FileUtils】";
    }
    static get instance() {
        return this._instance || (this._instance = new FileUtils);
    }
    /**
     * @description 链接文件 将已经存在的 target 链接到 path
     * @param target
     * @param path
     * @param type
     */
    async symlinkSync(target, path, type) {
        if ((0, fs_1.existsSync)(path)) {
            let stat = (0, fs_1.statSync)(path);
            if (stat.isDirectory()) {
                // console.log(`删除目录:${path}`);
                await this.delDir(path);
            }
            else {
                // console.log(`删除文件:${path}`);
                (0, fs_1.unlinkSync)(path);
            }
        }
        if (!(0, fs_1.existsSync)(target)) {
            this.logger.error(`不存在 : ${target}`);
            return;
        }
        let stat = (0, fs_1.statSync)(target);
        if (stat.isDirectory()) {
            let root = (0, path_1.parse)(path);
            if (!(0, fs_1.existsSync)(root.dir)) {
                this.createDir(root.dir);
            }
        }
        (0, fs_1.symlinkSync)(target, path, type);
        this.logger.log(`创建链接 ${target} -> ${path}`);
    }
    /**
     * @description
     * @param path
     * @param root
     * @param result
     * @param isInclude
     * @param isCurrentDirFiles 是否只读取当前目录的文件
     * @returns
     */
    _getFiles(path, root, result, isInclude, isCurrentDirFiles = false) {
        if (!(0, fs_1.existsSync)(path)) {
            return result;
        }
        let readDir = (0, fs_1.readdirSync)(path);
        for (let i = 0; i < readDir.length; i++) {
            let file = readDir[i];
            let fullPath = (0, path_1.join)(path, file);
            if (fullPath[0] === '.') {
                continue;
            }
            let stat = (0, fs_1.statSync)(fullPath);
            if (stat.isFile()) {
                let info = { relative: (0, path_1.relative)(root, fullPath), path: fullPath, name: file, size: stat.size };
                if (isInclude) {
                    if (isInclude(info)) {
                        result.push(info);
                    }
                }
                else {
                    result.push(info);
                }
            }
            else {
                if (!isCurrentDirFiles) {
                    stat.isDirectory() && this._getFiles(fullPath, root, result, isInclude);
                }
            }
        }
    }
    /**
     * @description 获取目录下所有文件
     * @param path
     * @param isInclude 是否包含该文件
     * @returns
     */
    getFiles(path, isInclude, root, isCurrentDirFiles = false) {
        let out = [];
        if (!root) {
            root = path;
        }
        this._getFiles(path, root, out, isInclude, isCurrentDirFiles);
        return out;
    }
    /**
     * @description 获取当前目前下所有文件
     * @param path
     */
    getCurFiles(path) {
        let result = [];
        if (!(0, fs_1.existsSync)(path)) {
            return result;
        }
        let readDir = (0, fs_1.readdirSync)(path);
        for (let i = 0; i < readDir.length; i++) {
            let file = readDir[i];
            let fullPath = (0, path_1.join)(path, file);
            if (fullPath[0] === '.') {
                continue;
            }
            let stat = (0, fs_1.statSync)(fullPath);
            if (stat.isFile()) {
                let info = { relative: (0, path_1.relative)(path, fullPath), path: fullPath, name: file, size: stat.size };
                result.push(info);
            }
        }
        return result;
    }
    /**
     * @description 获取path下的所有目录
     * @param path
     */
    getDirs(path) {
        let result = [];
        if (!(0, fs_1.existsSync)(path)) {
            return [];
        }
        let readDir = (0, fs_1.readdirSync)(path);
        for (let i = 0; i < readDir.length; i++) {
            let file = readDir[i];
            let fullPath = (0, path_1.join)(path, file);
            if (fullPath[0] === '.') {
                continue;
            }
            let stat = (0, fs_1.statSync)(fullPath);
            if (stat.isDirectory()) {
                result.push({ relative: (0, path_1.relative)(path, fullPath), path: fullPath, name: file });
            }
        }
        return result;
    }
    /**
     * @description 复制文件
     * @param src
     * @param dest
     * @param isForceCopy 如果之前有，会删除掉之前的dest文件
     */
    async copyFile(src, dest, isForceCopy = false) {
        try {
            if (isForceCopy) {
                this.delFile(dest);
            }
            await (0, promises_1.copyFile)(src, dest);
        }
        catch (error) {
            this.logger.error(error);
        }
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
    /**
     * @description 获取目录下文件个数
     */
    fileCount(path) {
        let count = 0;
        let counter = (path) => {
            let readdir = (0, fs_1.readdirSync)(path);
            for (let i in readdir) {
                let fullPath = (0, path_1.join)(path, readdir[i]);
                if ((0, fs_1.statSync)(fullPath).isDirectory()) {
                    counter(fullPath);
                }
                else {
                    count++;
                }
            }
        };
        counter(path);
        return count;
    }
    /**
     * @description 压缩文件到zip
     * @param path 打包路径
     * @param outPath 输出zip目录全路径
     */
    archive(path, outPath, root, append) {
        return new Promise((resolve) => {
            let files = [];
            if (typeof path == "string") {
                files = this.getFiles(path, undefined, root);
            }
            else {
                for (let i = 0; i < path.length; i++) {
                    let temp = this.getFiles(path[i], undefined, root);
                    files = files.concat(temp);
                }
            }
            if (append) {
                files = files.concat(append);
            }
            this.formatPaths(files);
            let arch = (0, archiver_1.default)("zip", {
                zlib: { level: 9 }
            });
            let output = (0, fs_1.createWriteStream)(outPath);
            //绑定流
            arch.pipe(output);
            //向zip中添加文件
            let v = null;
            for (let i = 0; i < files.length; i++) {
                v = files[i];
                arch.append((0, fs_1.createReadStream)(v.path), { name: v.relative });
            }
            arch.once("close", () => {
            });
            arch.once("end", () => {
                this.logger.log(`${this.module}打包完成${(0, path_1.basename)(outPath)}`);
                resolve(true);
            });
            arch.once("error", (err) => {
                this.logger.log(`${this.module}打包错误${(0, path_1.basename)(outPath)}`);
                this.logger.error(err);
                resolve(false);
            });
            //打包
            this.logger.log(`${this.module}开始打包${(0, path_1.basename)(outPath)}`);
            arch.finalize();
        });
    }
    /**
     * @description 格式代文件路径
     */
    formatPath(path) {
        path = path.replace(/\\/g, "/");
        path = encodeURI(path);
        return path;
    }
    formatPaths(files) {
        for (let i = 0; i < files.length; i++) {
            files[i].relative = this.formatPath(files[i].relative);
        }
    }
    /**
     * @description 对目录下所有文件做md5
     * @param path
     * @param assets
     */
    md5Dir(path, assets, root, isCurrentDirFiles = false) {
        let files = FileUtils.instance.getFiles(path, undefined, root, isCurrentDirFiles);
        files.forEach(v => {
            let md5 = this.md5((0, fs_1.readFileSync)(v.path));
            let relative = this.formatPath(v.relative);
            assets[relative] = {
                size: v.size,
                md5: md5
            };
        });
    }
    md5(content) {
        let md5 = (0, crypto_1.createHash)("md5").update(content).digest("hex");
        return md5;
    }
    /**
     * @description 创建目录
     * @param dir
     */
    createDir(dir) {
        if (!(0, fs_1.existsSync)(dir)) {
            // console.log(`创建目录 : ${dir}`);
            (0, fs_1.mkdirSync)(dir);
        }
    }
    createCopyDatas(source, dest, datas) {
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
                    datas.push({ from: from, to: to });
                }
            });
        };
        create(source, dest);
    }
    /**
     * @description 复制 source 到 dest 去 这里需要做一个兼容问题，creator的版本是16.0.1的node,cp 方法是16.7之后版本才有的
     * @param source
     * @param dest
     * @param maxCopyCount 同时最大复制文件的数据
     * @param onProgress 复制文件进度
     */
    copyDir(source, dest) {
        return new Promise(async (resolve) => {
            this.logger.log(`准备复制 : ${source}->${dest}`);
            if (!(0, fs_1.existsSync)(source)) {
                resolve(false);
                return;
            }
            await this.delDir(dest);
            if (Environment_1.Environment.isCommand && fs_1.cp) {
                (0, fs_1.cp)(source, dest, {
                    recursive: true
                }, (err) => {
                    if (err) {
                        this.logger.error(err);
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                    this.logger.log(`复制完成 : ${source}->${dest}`);
                });
            }
            else {
                //creator node版本只有16.0.1,需要使用老式处理方式
                let datas = [];
                this.createCopyDatas(source, dest, datas);
                for (let i = 0; i < datas.length; i++) {
                    let info = datas[i];
                    await this.copyFile(info.from, info.to);
                }
                resolve(true);
            }
        });
    }
    /**
     * @description 删除目录
     * @param path
     * @param isRemove 是否删除源目录本身，默认不删除
     */
    async delDir(path) {
        if ((0, fs_1.existsSync)(path)) {
            await (0, promises_1.rm)(path, { recursive: true });
        }
    }
}
FileUtils._instance = null;
exports.default = FileUtils;
