"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Handler_1 = require("./Handler");
class FileUtils extends Handler_1.Handler {
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
            // this.logger.error(`不存在 : ${target}`);
            return;
        }
        (0, fs_1.symlinkSync)(target, path, type);
        this.logger.log(`创建链接 ${target} -> ${path}`);
    }
    _getFiles(path, root, result, isInclude) {
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
                stat.isDirectory() && this._getFiles(fullPath, root, result, isInclude);
            }
        }
    }
    /**
     * @description 获取目录下所有文件
     * @param path
     * @param isInclude 是否包含该文件
     * @returns
     */
    getFiles(path, isInclude) {
        let out = [];
        this._getFiles(path, path, out, isInclude);
        return out;
    }
    /**
     * @description 复制文件
     * @param src
     * @param dest
     * @param isForceCopy 如果之前有，会删除掉之前的dest文件
     * @param callback
     */
    copyFile(src, dest, isForceCopy = false, onComplete) {
        if (isForceCopy) {
            this.delFile(dest);
        }
        let read = (0, fs_1.createReadStream)(src);
        let write = (0, fs_1.createWriteStream)(dest);
        read.pipe(write).once("close", () => {
            onComplete && onComplete();
        });
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
}
exports.default = FileUtils;
FileUtils._instance = null;
