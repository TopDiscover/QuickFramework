import archiver from "archiver";
import { createHash } from "crypto";
import { cp, createReadStream, createWriteStream, existsSync, lstatSync, mkdirSync, PathLike, readdirSync, readFileSync, statSync, symlink, symlinkSync, unlinkSync } from "fs";
import { copyFile, rm } from "fs/promises";
import { basename, dirname, join, parse, relative } from "path";
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
    symlinkSync(target: PathLike, path: PathLike, type?: symlink.Type | null) {
        if (existsSync(path)) {
            const stat = lstatSync(path);
            if ( stat.isSymbolicLink() ){
                unlinkSync(path);
            }
        }
        if (!existsSync(target)) {
            this.logger.error(`不存在 : ${target}`);
            return;
        }

        let stat = statSync(target);
        if ( stat.isDirectory() ){
            let root = parse(path as string);
            if( !existsSync(root.dir) ) {
                this.createDir(root.dir);
            }
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
    private _getFiles(path: string, root: string, result: FileResult[], isInclude?: (info: FileResult) => boolean, isCurrentDirFiles = false) {
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
    getFiles(path: string, isInclude?: (info: FileResult) => boolean, root?: string, isCurrentDirFiles = false) {
        let out: FileResult[] = [];
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
    getCurFiles(path: string) {
        let result: FileResult[] = [];
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
                let info = { relative: relative(path, fullPath), path: fullPath, name: file, size: stat.size }
                result.push(info);
            }
        }

        return result;
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
            this.createDir(dirname(dest));
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
    async archive(path: string | string[], outPath: string, root: string, append?: FileResult[]) {
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
            if (append) {
                files = files.concat(append);
            }
            this.formatPaths(files);
            
            const arch = archiver("zip", {
                zlib: { level: 9 }
            });
            const output = createWriteStream(outPath);
            
            arch.pipe(output);

            // 使用队列处理文件添加
            const addFileToArchive = async (fileInfos: FileResult[]) => {
                const batchSize = 50; // 每批处理的文件数
                for (let i = 0; i < fileInfos.length; i += batchSize) {
                    const batch = fileInfos.slice(i, Math.min(i + batchSize, fileInfos.length));
                    await Promise.all(batch.map(v => {
                        return new Promise<void>((resolveFile) => {
                            const stream = createReadStream(v.path);
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
                this.logger.log(`${this.module}打包关闭${basename(outPath)}`);
            });

            arch.once("end", () => {
                this.logger.log(`${this.module}打包完成${basename(outPath)}`);
                resolve(true);
            });

            arch.once("error", (err) => {
                this.logger.error(`${this.module}打包错误${basename(outPath)}`, err);
                resolve(false);
            });

            this.logger.log(`${this.module}开始打包${basename(outPath)}`);
            addFileToArchive(files).then(() => arch.finalize());
        });
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
     * @description 对文件内容进行md5计算，支持大文件
     */
    async md5File(filePath: PathLike): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = createHash('md5');
            const stream = createReadStream(filePath);
            
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

    md5(content: string | Buffer) {
        return createHash("md5").update(content).digest("hex");
    }

    /**
     * @description 对目录下所有文件做md5，使用并发限制
     */
    async md5Dir(path: string, assets: Asset, root: string, MainJS?: string) {
        let isCurrentDirFiles = MainJS != undefined;
        const files = FileUtils.instance.getFiles(path, (info)=>{
            if ( MainJS ){
                return info.name == MainJS
            }
            return true;
        }, root, isCurrentDirFiles);
        const concurrentLimit = 50; // 同时处理的最大文件数
        
        // 将文件列表分成多个批次
        for (let i = 0; i < files.length; i += concurrentLimit) {
            const batch = files.slice(i, i + concurrentLimit);
            
            try {
                // 并发处理当前批次的文件
                const results = await Promise.all(
                    batch.map(async (v) => {
                        try {
                            const md5 = await this.md5File(v.path);
                            return {
                                relative: this.formatPath(v.relative),
                                size: v.size,
                                md5
                            };
                        } catch (error) {
                            this.logger.error(`计算文件MD5失败: ${v.path}`, error);
                            return null;
                        }
                    })
                );

                // 更新assets对象
                results.forEach(result => {
                    if (result) {
                        assets[result.relative] = {
                            size: result.size,
                            md5: result.md5
                        };
                    }
                });
            } catch (error) {
                this.logger.error('批次处理失败:', error);
            }
        }
    }


    /**
     * @description 创建目录
     * @param dir 
     */
    createDir(dir: string) {
        // 判断如果是文件，先取出目录，再创建
        if (!existsSync(dir)) {
            // console.log(`创建目录 : ${dir}`);
            let dirs = dir.replace(/\\/g, "/").split("/")
            for (let i = 0; i < dirs.length; i++) {
                let dir = dirs.slice(0, i + 1).join("/");
                if (!existsSync(dir)) {
                    mkdirSync(dir);
                }
            }
        }
    }

    private createCopyDatas(source: string, dest: string, datas: CopyData) {
        let stat = statSync(source);
        if (!stat.isDirectory()) {
            return;
        }
        this.createDir(dest);
        let from = "";
        let to = "";
        let create = (source: string, dest: string) => {
            let readdir = readdirSync(source);
            readdir.forEach(v => {
                from = join(source, v);
                to = join(dest, v);
                if (statSync(from).isDirectory()) {
                    this.createDir(to);
                    create(from, to);
                } else {
                    datas.push({ from: from, to: to });
                }
            })
        }
        create(source, dest);
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
            if (!existsSync(source)) {
                resolve(false);
                return;
            }
            await this.delDir(dest);
            if (Environment.isCommand && cp) {
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
            } else {
                //creator node版本只有16.0.1,需要使用老式处理方式
                let datas: CopyData = [];
                this.createCopyDatas(source, dest, datas);
                for (let i = 0; i < datas.length; i++) {
                    let info = datas[i];
                    await this.copyFile(info.from, info.to);
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
    async delDir(path: PathLike) {
        if (existsSync(path)) {
            await rm(path, { recursive: true });
        }
    }
}