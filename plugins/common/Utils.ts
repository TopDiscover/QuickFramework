/**
 * @description 公共工具类
 */
import * as fs from "fs";
import JSZip from "jszip";
import * as path from "path";
import { ZipVersionsConfig } from "./Defines";

class _Utils {

    /**@description 获取目录下文件个数 */
    getDirFileCount(dir: string) {
        let count = 0;
        let counter = (dir: string) => {
            let readdir = fs.readdirSync(dir);
            for (let i in readdir) {
                count++;
                let fullPath = path.join(dir, readdir[i]);
                fs.statSync(fullPath).isDirectory() && counter(fullPath)
            }
        };
        counter(dir);
        return count;
    }

    /**@description 压缩文件到zip */
    zipDir(dir: string, jszip: JSZip | null) {
        if (!fs.existsSync(dir) || !jszip) {
            return
        }
        let readDirs = fs.readdirSync(dir);
        for (let i = 0; i < readDirs.length; i++) {
            let file = readDirs[i];
            let fullPath = path.join(dir, file);
            let stat = fs.statSync(fullPath);
            if (stat.isFile()) {
                jszip.file(file, fs.readFileSync(fullPath))
            } else {
                stat.isDirectory() && this.zipDir(fullPath, jszip.folder(file))
            }
        }
    }

    /**
     * @description 打包版本文件
     */
    zipVersions( config : ZipVersionsConfig ) {
        let JSZIP : JSZip = require("jszip");
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
        jszip.generateNodeStream({
            type: "nodebuffer",
            streamFiles: !0
        }).pipe(fs.createWriteStream(packVersionZipPath)).on("finish", () => {
            config.log("[打包] 打包成功: " + packVersionZipPath)
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
            }).pipe(fs.createWriteStream(packVersionZipPath)).on("finish", () => {
                config.log("[打包] 打包成功: " + packVersionZipPath)
            }).on("error", (e: Error) => {
                config.log("[打包] 打包失败:" + e.message)
            })
        }
    }

    /**@description 创建目录 */
    mkdirSync(dir: string) {
        try {
            fs.mkdirSync(dir)
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
            if (!fs.existsSync(dir)) return;
            let readDir = fs.readdirSync(dir);
            for (let i in readDir) {
                let fullPath = path.join(dir, readDir[i]);
                fs.statSync(fullPath).isDirectory() ? delFile(fullPath) : fs.unlinkSync(fullPath)
            }
        };
        let delDir = (dir: string) => {
            if (!fs.existsSync(dir)) return;
            let readDir = fs.readdirSync(dir);
            if (readDir.length > 0) {
                for (let i in readDir) {
                    let fullPath = path.join(dir, readDir[i]);
                    delDir(fullPath)
                }
                (dir !== sourceDir || isRemoveSourceDir) && fs.rmdirSync(dir)
            } else {
                (dir !== sourceDir || isRemoveSourceDir) && fs.rmdirSync(dir)
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
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    }
}
export let Utils = new _Utils();