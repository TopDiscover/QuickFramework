const Fs = require('fs');
const Path = require('path');

const FileUtil = {

    /**
     * 复制文件/文件夹
     * @param {Fs.PathLike} srcPath 源路径
     * @param {Fs.PathLike} destPath 目标路径
     */
    copy(srcPath, destPath) {
        if (!Fs.existsSync(srcPath)) return;
        const stats = Fs.statSync(srcPath);
        if (stats.isDirectory()) {
            if (!Fs.existsSync(destPath)) Fs.mkdirSync(destPath);
            const names = Fs.readdirSync(srcPath);
            for (const name of names) {
                this.copy(Path.join(srcPath, name), Path.join(destPath, name));
            }
        } else if (stats.isFile()) {
            Fs.writeFileSync(destPath, Fs.readFileSync(srcPath));
        }
    },

    /**
     * 删除文件/文件夹
     * @param {Fs.PathLike} path 路径
     */
    delete(path) {
        if (!Fs.existsSync(path)) return;
        const stats = Fs.statSync(path);
        if (stats.isDirectory()) {
            const names = Fs.readdirSync(path);
            for (const name of names) {
                this.delete(Path.join(path, name));
            }
            Fs.rmdirSync(path);
        } else if (stats.isFile()) {
            Fs.unlinkSync(path);
        }
    },

    /**
     * 遍历文件/文件夹并执行函数
     * @param {Fs.PathLike} path 路径
     * @param {(filePath: Fs.PathLike, stat: Fs.Stats)=>void} handler 处理函数
     */
    map(path, handler) {
        if (!Fs.existsSync(path)) return
        const stats = Fs.statSync(path);
        if (stats.isDirectory()) {
            const names = Fs.readdirSync(path);
            for (const name of names) {
                this.map(Path.join(path, name), handler);
            }
        } else if (stats.isFile()) {
            handler(path, stats);
        }
    }

}

module.exports = FileUtil;