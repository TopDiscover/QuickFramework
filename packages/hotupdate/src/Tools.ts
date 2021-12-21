import { createReadStream, createWriteStream, exists, existsSync, mkdir, mkdirSync, readdir, readdirSync, readFileSync, rmdirSync, stat, statSync, unlinkSync } from "fs";
import path from "path";


/**@description bundle信息 */
export interface BundleInfo {
    /**@description bundle名，如大厅 */
    name: string;
    /**@description bundle对应目录 */
    dir: string;
    /**@description bundle版本号 */
    version: string;
    /**@description 是否包含在主包内 */
    includeApk: boolean;
    md5?:string;
}

/**
 * @description 压缩版本文件配置
 */
 export interface ZipVersionsConfig {
    /**@description 主包包含目录 */
    mainIncludes: string[];
    /**@description 所有版本信息 */
    versions: { [key: string]: { md5: string, version: string } };
    /**@description 构建目录 */
    buildDir: string;
    /**@description 日志回调 */
    log: (conent: any) => void;
    /**@description 所有bundle的配置信息 */
    bundles: BundleInfo[];
}

export interface UserCache {
    /**@description 主包版本号 */
    version: string,
    /**@description 当前服务器地址 */
    serverIP: string,
    /**@description 服务器历史地址 */
    historyIps: string[],
    /**@description 构建项目目录 */
    buildDir: string,

    /**@description 各bundle的版本配置 */
    bundles: { [key: string]: BundleInfo },

    /**@description 远程服务器地址 */
    remoteVersion: string,
    /**@description 远程各bundle的版本配置 */
    remoteBundles: {[key:string]:BundleInfo},
    /**@description 远程服务器所在目录 */
    remoteDir: string,
}

/**
 * @description 热火更新配置
 */
 export interface HotUpdateConfig {
    version: string;
    bundles: BundleInfo[];
}

export interface Manifest {
    assets?: any;
    bundle?: string;
    md5?: string;
    version?: string;
}

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
            this.zipDir(fullPath, jszip.folder(element));
        }

        let packZipName = `main_${config.versions["main"].md5}.zip`;
        let packZipRootPath = Editor.Project.path + "/PackageVersion";
        let packVersionZipPath = path.join(packZipRootPath, packZipName);
        this.delDir(packZipRootPath);
        this.mkdirSync(packZipRootPath);
        config.log(`打包路径: ${packZipRootPath}`);
        jszip.generateNodeStream({
            type: "nodebuffer",
            streamFiles: !0
        }).pipe(createWriteStream(packVersionZipPath)).on("finish", () => {
            config.log("[打包] 打包成功: " + packZipName)
        }).on("error", (e: Error) => {
            config.log("[打包] 打包失败:" + e.message)
        })

        //打包子版本
        let bundles = config.bundles
        for (let index = 0; index < bundles.length; index++) {
            const element = bundles[index];
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
            }).on("error", (e: Error) => {
                config.log("[打包] 打包失败:" + e.message)
            })
        }
    }

    /**@description 创建目录 */
    mkdirSync(dir: string) {
        try {
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
    copySourceDirToDesDir(source: string, dest: string,copyFileCb ?: Function) {
        let self = this;
        let makeDir = (_source: string, _dest: string, _copyFileCb: (source: string, dest: string) => void) => {
            exists(_dest, function (isExist) {
                isExist ? _copyFileCb(_source, _dest) : mkdir(_dest, function () {
                    if(copyFileCb) copyFileCb(), _copyFileCb(_source, _dest)
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
                            if(copyFileCb) copyFileCb()
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
                md5 = require("crypto").createHash('md5').update(readFileSync(subpath)).digest('hex');
                compressed = path.extname(subpath).toLowerCase() === '.zip';
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
}
export let Tools = new _Tools();