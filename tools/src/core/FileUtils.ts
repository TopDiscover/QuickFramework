import archiver from "archiver";
import { createHash } from "crypto";
import { cp, createReadStream, createWriteStream, existsSync, mkdirSync, PathLike, readdirSync, readFileSync, statSync, symlink, symlinkSync, unlinkSync } from "fs";
import { copyFile, rm } from "fs/promises";
import { basename, join, relative } from "path";
import { Asset, CopyData, DirResult, FileResult } from "./Defines";
import { Environment } from "./Environment";
import { Handler } from "./Handler";

export default class FileUtils extends Handler {

    module = "【FileUtils】";

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

    /**
     * @description 
     * @param path 
     * @param root 
     * @param result 
     * @param isInclude 
     * @param isCurrentDirFiles 是否只读取当前目录的文件
     * @returns 
     */
    private _getFiles(path: string, root: string, result: FileResult[], isInclude?: (info: FileResult) => boolean,isCurrentDirFiles = false) {
        if (!existsSync(path)) {
            return result;
        }
        let readDir = readdirSync(path);
        for (let i = 0; i < readDir.length; i++) {
            let file = readDir[i];
            let fullPath = join(path, file);
            if (fullPath[0] === '.') {
                continue;
            }
            let stat = statSync(fullPath);
            if (stat.isFile()) {
                let info = { relative: relative(root, fullPath), path: fullPath, name: file, size: stat.size }
                if (isInclude) {
                    if (isInclude(info)) {
                        result.push(info);
                    }
                } else {
                    result.push(info);
                }
            } else {
                if ( !isCurrentDirFiles ){
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
    getFiles(path: string, isInclude?: (info: FileResult) => boolean, root?: string,isCurrentDirFiles = false) {
        let out: FileResult[] = [];
        if (!root) {
            root = path;
        }
        this._getFiles(path, root, out, isInclude,isCurrentDirFiles);
        return out;
    }

    /**
     * @description 获取path下的所有目录
     * @param path 
     */
    getDirs(path: string) {
        let result: DirResult[] = [];
        if (!existsSync(path)) {
            return [];
        }
        let readDir = readdirSync(path);
        for (let i = 0; i < readDir.length; i++) {
            let file = readDir[i];
            let fullPath = join(path, file);
            if (fullPath[0] === '.') {
                continue;
            }
            let stat = statSync(fullPath);
            if (stat.isDirectory()) {
                result.push({ relative: relative(path, fullPath), path: fullPath, name: file });
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
    async copyFile(src: string, dest: string, isForceCopy = false) {
        try {
            if (isForceCopy) {
                this.delFile(dest);
            }
            await copyFile(src, dest)
        } catch (error) {
            this.logger.error(error);
        }
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

    /**
     * @description 获取目录下文件个数
     */
    fileCount(path: string) {
        let count = 0;
        let counter = (path: string) => {
            let readdir = readdirSync(path);
            for (let i in readdir) {
                let fullPath = join(path, readdir[i]);
                if (statSync(fullPath).isDirectory()) {
                    counter(fullPath)
                } else {
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
    archive(path: string | string[], outPath: string, root: string,append?:FileResult[]) {
        return new Promise<boolean>((resolve) => {
            let files: FileResult[] = [];
            if (typeof path == "string") {
                files = this.getFiles(path, undefined, root);
            } else {
                for (let i = 0; i < path.length; i++) {
                    let temp = this.getFiles(path[i], undefined, root);
                    files = files.concat(temp);
                }
            }
            if ( append ){
                files = files.concat(append);
            }
            this.formatPaths(files);
            let arch = archiver("zip", {
                zlib: { level: 9}
            });
            let output = createWriteStream(outPath);
            //绑定流
            arch.pipe(output)
            //向zip中添加文件
            let v: FileResult = null!;
            for (let i = 0; i < files.length; i++) {
                v = files[i];
                arch.append(createReadStream(v.path), { name: v.relative });
            }

            arch.once("close", () => {

            });
            arch.once("end", () => {
                this.logger.log(`${this.module}打包完成${basename(outPath)}`);
                resolve(true);
            })
            arch.once("error", (err) => {
                this.logger.log(`${this.module}打包错误${basename(outPath)}`);
                this.logger.error(err);
                resolve(false);
            })

            //打包
            this.logger.log(`${this.module}开始打包${basename(outPath)}`);
            arch.finalize();
        })
    }

    /**
     * @description 格式代文件路径
     */
    formatPath(path: string) {
        path = path.replace(/\\/g, "/");
        path = encodeURI(path);
        return path;
    }

    formatPaths(files: FileResult[]) {
        for (let i = 0; i < files.length; i++) {
            files[i].relative = this.formatPath(files[i].relative);
        }
    }

    /**
     * @description 对目录下所有文件做md5
     * @param path 
     * @param assets 
     */
    md5Dir(path: string, assets: Asset, root: string,isCurrentDirFiles = false) {
        let files = FileUtils.instance.getFiles(path, undefined, root,isCurrentDirFiles)
        files.forEach(v => {
            let md5 = this.md5(readFileSync(v.path));
            let relative = this.formatPath(v.relative);
            assets[relative] = {
                size: v.size,
                md5: md5
            }
        })
    }

    md5(content: string | Buffer) {
        let md5 = createHash("md5").update(content).digest("hex");
        return md5;
    }


    /**
     * @description 创建目录
     * @param dir 
     */
    createDir(dir: string) {
        if (!existsSync(dir)) {
            // console.log(`创建目录 : ${dir}`);
            mkdirSync(dir);
        }
    }

    private createCopyDatas(source: string, dest: string,datas : CopyData){
        let stat = statSync(source);
        if ( !stat.isDirectory() ){
            return;
        }
        this.createDir(dest);
        let from = "";
        let to = "";
        let create = (source:string,dest:string)=>{
            let readdir = readdirSync(source);
            readdir.forEach(v=>{
                from = join(source,v);
                to = join(dest,v);
                if( statSync(from).isDirectory() ){
                    this.createDir(to);
                    create(from,to);
                }else{
                    datas.push({from : from, to : to});
                }
            })
        }
        create(source,dest);
    }

    /**
     * @description 复制 source 到 dest 去 这里需要做一个兼容问题，creator的版本是16.0.1的node,cp 方法是16.7之后版本才有的
     * @param source 
     * @param dest 
     * @param maxCopyCount 同时最大复制文件的数据
     * @param onProgress 复制文件进度
     */
    copyDir(source: string, dest: string) {
        return new Promise<boolean>(async resolve => {
            this.logger.log(`准备复制 : ${source}->${dest}`);
            await this.delDir(dest);
            if ( Environment.isCommand ){
                cp(source, dest, {
                    recursive: true
                }, (err) => {
                    if (err) {
                        this.logger.error(err);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                    this.logger.log(`复制完成 : ${source}->${dest}`);
                });
            }else{
                //creator node版本只有16.0.1,需要使用老式处理方式
                let datas : CopyData = [];
                this.createCopyDatas(source,dest,datas);
                for ( let i = 0 ;i < datas.length ; i++){
                    let info = datas[i];
                    await this.copyFile(info.from,info.to);
                }
                resolve(true);
            }
            
        })
    }

    /**
     * @description 删除目录
     * @param path 
     * @param isRemove 是否删除源目录本身，默认不删除
     */
    async delDir(path: string) {
        if (existsSync(path)) {
            await rm(path, { recursive: true });
        }
    }
}