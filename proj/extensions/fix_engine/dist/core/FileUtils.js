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
    symlinkSync(target, path, type) {
        if ((0, fs_1.existsSync)(path)) {
            (0, fs_1.unlinkSync)(path);
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
            this.createDir((0, path_1.dirname)(dest));
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
    async archive(path, outPath, root, append) {
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
            const arch = (0, archiver_1.default)("zip", {
                zlib: { level: 9 }
            });
            const output = (0, fs_1.createWriteStream)(outPath);
            arch.pipe(output);
            // 使用队列处理文件添加
            const addFileToArchive = async (fileInfos) => {
                const batchSize = 50; // 每批处理的文件数
                for (let i = 0; i < fileInfos.length; i += batchSize) {
                    const batch = fileInfos.slice(i, Math.min(i + batchSize, fileInfos.length));
                    await Promise.all(batch.map(v => {
                        return new Promise((resolveFile) => {
                            const stream = (0, fs_1.createReadStream)(v.path);
                            arch.append(stream, { name: v.relative });
                            stream.on('end', () => {
                                stream.destroy();
                                resolveFile();
                            });
                        });
                    }));
                }
            };
            arch.on("warning", (err) => {
                if (err.code !== "ENOENT") {
                    this.logger.warn(`${this.module}打包警告`, err);
                }
            });
            arch.once("close", () => {
                this.logger.log(`${this.module}打包关闭${(0, path_1.basename)(outPath)}`);
            });
            arch.once("end", () => {
                this.logger.log(`${this.module}打包完成${(0, path_1.basename)(outPath)}`);
                resolve(true);
            });
            arch.once("error", (err) => {
                this.logger.error(`${this.module}打包错误${(0, path_1.basename)(outPath)}`, err);
                resolve(false);
            });
            this.logger.log(`${this.module}开始打包${(0, path_1.basename)(outPath)}`);
            addFileToArchive(files).then(() => arch.finalize());
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
     * @description 对文件内容进行md5计算，支持大文件
     */
    async md5File(filePath) {
        return new Promise((resolve, reject) => {
            const hash = (0, crypto_1.createHash)('md5');
            const stream = (0, fs_1.createReadStream)(filePath);
            stream.on('data', chunk => hash.update(chunk));
            stream.on('end', () => {
                stream.destroy();
                resolve(hash.digest('hex'));
            });
            stream.on('error', error => {
                stream.destroy();
                reject(error);
            });
        });
    }
    md5(content) {
        return (0, crypto_1.createHash)("md5").update(content).digest("hex");
    }
    /**
     * @description 对目录下所有文件做md5，使用并发限制
     */
    async md5Dir(path, assets, root, MainJS) {
        let isCurrentDirFiles = MainJS != undefined;
        const files = FileUtils.instance.getFiles(path, (info) => {
            if (MainJS) {
                return info.name == MainJS;
            }
            return true;
        }, root, isCurrentDirFiles);
        const concurrentLimit = 50; // 同时处理的最大文件数
        // 将文件列表分成多个批次
        for (let i = 0; i < files.length; i += concurrentLimit) {
            const batch = files.slice(i, i + concurrentLimit);
            try {
                // 并发处理当前批次的文件
                const results = await Promise.all(batch.map(async (v) => {
                    try {
                        const md5 = await this.md5File(v.path);
                        return {
                            relative: this.formatPath(v.relative),
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
                        assets[result.relative] = {
                            size: result.size,
                            md5: result.md5
                        };
                    }
                });
            }
            catch (error) {
                this.logger.error('批次处理失败:', error);
            }
        }
    }
    /**
     * @description 创建目录
     * @param dir
     */
    createDir(dir) {
        // 判断如果是文件，先取出目录，再创建
        if (!(0, fs_1.existsSync)(dir)) {
            // console.log(`创建目录 : ${dir}`);
            let dirs = dir.replace(/\\/g, "/").split("/");
            for (let i = 0; i < dirs.length; i++) {
                let dir = dirs.slice(0, i + 1).join("/");
                if (!(0, fs_1.existsSync)(dir)) {
                    (0, fs_1.mkdirSync)(dir);
                }
            }
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
