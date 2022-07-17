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
    _getFiles(path, root, result) {
        if (!(0, fs_1.existsSync)(path)) {
            return result;
        }
        let readDir = (0, fs_1.readdirSync)(path);
        for (let i = 0; i < readDir.length; i++) {
            let file = readDir[i];
            let fullPath = (0, path_1.join)(path, file);
            let stat = (0, fs_1.statSync)(fullPath);
            if (stat.isFile()) {
                result.push({ relative: (0, path_1.relative)(root, fullPath), path: fullPath, name: file });
            }
            else {
                stat.isDirectory() && this._getFiles(fullPath, root, result);
            }
        }
    }
    /**
     * @description 获取目录下所有文件
     * @param path
     * @returns
     */
    getFiles(path) {
        let out = [];
        this._getFiles(path, path, out);
        return out;
    }
}
exports.default = FileUtils;
FileUtils._instance = null;
