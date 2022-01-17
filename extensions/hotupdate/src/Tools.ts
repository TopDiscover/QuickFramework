import { createReadStream, createWriteStream, exists, existsSync, mkdir, mkdirSync, readdir, readdirSync, readFileSync, rmdirSync, stat, statSync, unlinkSync } from "fs";
import path, { join, normalize } from "path";

class _Tools {

    /**@description 获取目录下文件个数 */
    getDirFileCount(dir: string) {
        let count = 0;
        let counter = (dir: string) => {
            let readdir = readdirSync(dir);
            for (let i in readdir) {
                count++;
                let fullPath = path.join(dir, readdir[i]);
                statSync(fullPath).isDirectory() && counter(fullPath)
            }
        };
        counter(dir);
        return count;
    }

    /**@description 压缩文件到zip */
    zipDir(dir: string, jszip: any) {
        if (!existsSync(dir) || !jszip) {
            return
        }
        let readDirs = readdirSync(dir);
        for (let i = 0; i < readDirs.length; i++) {
            let file = readDirs[i];
            let fullPath = path.join(dir, file);
            let stat = statSync(fullPath);
            if (stat.isFile()) {
                jszip.file(file, readFileSync(fullPath))
            } else {
                stat.isDirectory() && this.zipDir(fullPath, jszip.folder(file))
            }
        }
    }

    /**
     * @description 打包版本文件
     */
    zipVersions(config: ZipVersionsConfig) {
        let JSZIP = require("jszip");
        let jszip = new JSZIP();
        for (let index = 0; index < config.mainIncludes.length; index++) {
            const element = config.mainIncludes[index];
            let fullPath = path.join(config.buildDir, element);
            fullPath = normalize(fullPath);
            this.zipDir(fullPath, jszip.folder(element));
        }
        let bundles = Object.keys(config.bundles)
        let count = 0;
        let total = bundles.length;
        let packZipName = `main_${config.versions["main"].md5}.zip`;
        let packZipRootPath = Editor.Project.path + "/PackageVersion";
        packZipRootPath = normalize(packZipRootPath);
        let packVersionZipPath = path.join(packZipRootPath, packZipName);
        this.delDir(packZipRootPath);
        this.mkdirSync(packZipRootPath);
        config.log(`打包路径: ${packZipRootPath}`);
        jszip.generateNodeStream({
            type: "nodebuffer",
            streamFiles: !0
        }).pipe(createWriteStream(packVersionZipPath)).on("finish", () => {
            config.log("[打包] 打包成功: " + packZipName)
            count++;
            config.handler(count == total);
        }).on("error", (e: Error) => {
            config.log("[打包] 打包失败:" + e.message)
            count++;
            config.handler(count == total);
        })

        //打包子版本

        for (let index = 0; index < bundles.length; index++) {
            const element = config.bundles[bundles[index]];
            let packZipName = `${element.dir}_${config.versions[element.dir].md5}.zip`;
            let packVersionZipPath = path.join(packZipRootPath, packZipName);
            let jszip = new JSZIP();
            let fullPath = path.join(config.buildDir, `assets/${element.dir}`);
            this.zipDir(fullPath, jszip.folder(`assets/${element.dir}`));
            config.log(`[打包] ${element.name} ${element.dir} ...`);
            jszip.generateNodeStream({
                type: "nodebuffer",
                streamFiles: !0
            }).pipe(createWriteStream(packVersionZipPath)).on("finish", () => {
                config.log("[打包] 打包成功: " + packZipName)
                count++;
                config.handler(count == total);
            }).on("error", (e: Error) => {
                config.log("[打包] 打包失败:" + e.message)
                count++;
                config.handler(count == total);
            })
        }
    }

    /**@description 创建目录 */
    mkdirSync(dir: string) {
        try {
            dir = normalize(dir);
            mkdirSync(dir)
        } catch (e: any) {
            if ("EEXIST" !== e.code) throw e
        }
    }

    /**
     * @description 删除目录
     * @param sourceDir 源目录
     * @param isRemoveSourceDir 是否删除源目录本身，默认不删除
     */
    delDir(sourceDir: string, isRemoveSourceDir = false) {
        let delFile = (dir: string) => {
            if (!existsSync(dir)) return;
            let readDir = readdirSync(dir);
            for (let i in readDir) {
                let fullPath = path.join(dir, readDir[i]);
                statSync(fullPath).isDirectory() ? delFile(fullPath) : unlinkSync(fullPath)
            }
        };
        let delDir = (dir: string) => {
            if (!existsSync(dir)) return;
            let readDir = readdirSync(dir);
            if (readDir.length > 0) {
                for (let i in readDir) {
                    let fullPath = path.join(dir, readDir[i]);
                    delDir(fullPath)
                }
                (dir !== sourceDir || isRemoveSourceDir) && rmdirSync(dir)
            } else {
                (dir !== sourceDir || isRemoveSourceDir) && rmdirSync(dir)
            }
        };
        delFile(sourceDir);
        delDir(sourceDir)
    }
    /**
     * @description 删除文件
     * @param filePath 
     * @returns 
     */
    delFile(filePath: string) {
        if (existsSync(filePath)) {
            unlinkSync(filePath);
            return true;
        }
        return false;
    }
    /**
     * @description 复制整个目录
     * @param source 源
     * @param dest 目标
     * @param copyFileCb 复制文件完成回调 
     */
    copySourceDirToDesDir(source: string, dest: string, copyFileCb?: Function) {
        let self = this;
        let makeDir = (_source: string, _dest: string, _copyFileCb: (source: string, dest: string) => void) => {
            exists(_dest, function (isExist) {
                isExist ? _copyFileCb(_source, _dest) : mkdir(_dest, function () {
                    if (copyFileCb) copyFileCb(), _copyFileCb(_source, _dest)
                })
            })
        };
        let copyFile = (_source: string, _dest: string) => {
            readdir(_source, function (err, files) {
                if (err) throw err;
                files.forEach(function (filename) {
                    let readStream;
                    let writeStram;
                    let sourcePath = _source + "/" + filename;
                    let destPath = _dest + "/" + filename;
                    stat(sourcePath, function (err, stats) {
                        if (err) throw err;
                        if (stats.isFile()) {
                            readStream = createReadStream(sourcePath);
                            writeStram = createWriteStream(destPath);
                            readStream.pipe(writeStram);
                            if (copyFileCb) copyFileCb()
                        } else {
                            stats.isDirectory() && makeDir(sourcePath, destPath, copyFile)
                        }
                    })
                })
            })
        };
        makeDir(source, dest, copyFile)
    }

    /**
     * @description 读取目录下的所有文件的md5及大小信息到obj
     * @param dir 读取目录
     * @param obj 输出对象
     * @param source 
     * @returns 
     */
    readDir(dir: string, obj: any, source: string) {
        var stat = statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        var subpaths = readdirSync(dir),
            subpath, size, md5, compressed, relative;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path.join(dir, subpaths[i]);
            stat = statSync(subpath);
            if (stat.isDirectory()) {
                this.readDir(subpath, obj, source);
            } else if (stat.isFile()) {
                // Size in Bytes
                size = stat['size'];
                //这里需要处理下,在只修改主包或都其它bundle时，会引起md5的变更config.json
                if (subpath.includes("config.json")) {
                    try {
                        let content = readFileSync(subpath, "utf-8");
                        let config = JSON.parse(content);
                        if (config && config.uuids && Array.isArray(config.uuids)) {
                            delete config.redirect;
                            config.uuids.sort();
                            md5 = require("crypto").createHash('md5').update(JSON.stringify(config)).digest('hex');
                        }else{
                            console.warn(`${subpath}找不到uuids字段`);
                            md5 = require("crypto").createHash('md5').update(readFileSync(subpath)).digest('hex');
                        }
                    } catch (err) {
                        console.error(err);
                        md5 = require("crypto").createHash('md5').update(readFileSync(subpath)).digest('hex');
                    }
                } else {
                    md5 = require("crypto").createHash('md5').update(readFileSync(subpath)).digest('hex');
                    compressed = path.extname(subpath).toLowerCase() === '.zip';
                }
                relative = path.relative(source, subpath);
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
        let dir = join(Editor.Project.path, "assets/bundles");
        let stat = statSync(dir);
        let result: string[] = [];
        if (!stat.isDirectory()) {
            return result;
        }
        let subpaths = readdirSync(dir);
        let subpath = "";
        for (let i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path.join(dir, subpaths[i]);
            stat = statSync(subpath);
            if (stat.isDirectory()) {
                result.push(path.relative(dir, subpath));
            }
        }
        return result;
    }
}
export let Tools = new _Tools();