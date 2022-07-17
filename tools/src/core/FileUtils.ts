import { copyFile, createReadStream, createWriteStream, existsSync, NoParamCallback, PathLike, readdirSync, statSync, symlink, symlinkSync, unlinkSync } from "fs";
import { join, relative } from "path";
import { FileResult } from "./Defines";
import { Handler } from "./Handler";

export default class FileUtils extends Handler {

    private static _instance: FileUtils = null!;
    static get instance() {
        return this._instance || (this._instance = new FileUtils);
    }

    /**
     * @description 链接文件 将已经存在的 target 链接到 path
     * @param target 
     * @param path 
     * @param type 
     */
    symlinkSync(target: PathLike, path: PathLike, type?: symlink.Type | null): void {
        if (existsSync(path)) {
            unlinkSync(path);
        }
        if (!existsSync(target)) {
            // this.logger.error(`不存在 : ${target}`);
            return;
        }
        symlinkSync(target, path, type);
        this.logger.log(`创建链接 ${target} -> ${path}`)
    }

    private _getFiles(path: string, root: string, result: FileResult[]) {
        if (!existsSync(path)) {
            return result;
        }
        let readDir = readdirSync(path);
        for (let i = 0; i < readDir.length; i++) {
            let file = readDir[i];
            let fullPath = join(path, file);
            let stat = statSync(fullPath);
            if (stat.isFile()) {
                result.push({ relative: relative(root, fullPath), path: fullPath, name: file });
            } else {
                stat.isDirectory() && this._getFiles(fullPath, root, result);
            }
        }
    }

    /**
     * @description 获取目录下所有文件
     * @param path 
     * @returns 
     */
    getFiles(path: string) {
        let out: FileResult[] = [];
        this._getFiles(path, path, out);
        return out;
    }

    /**
     * @description 复制文件
     * @param src 
     * @param dest 
     * @param isForceCopy 如果之前有，会删除掉之前的dest文件
     * @param callback 
     */
    copyFile(src: string, dest: string, isForceCopy = false, onComplete?:Function) {
        if ( isForceCopy ){
            this.delFile(dest);
        }
        let read = createReadStream(src);
        let write = createWriteStream(dest);
        read.pipe(write).once("close",()=>{
            onComplete && onComplete();
        })
    }

    /**
     * @description 删除文件
     * @param filePath 
     * @returns 
     */
    delFile(filePath: PathLike) {
        if (existsSync(filePath)) {
            unlinkSync(filePath);
            return true;
        }
        return false;
    }
}