import { createReadStream, createWriteStream, exists, existsSync, mkdir, mkdirSync, readdir, readdirSync, readFileSync, ReadStream, rmdirSync, stat, statSync, unlinkSync, WriteStream } from "fs";
import path, { join, normalize } from "path";

class _Tools {

    /**@description 等待复制文件 <from,to>*/
    private copys : {from : string , to : string}[] = [];
    /**@description 最大允许复制数量 */
    private maxCopy = 50;
    /**@description 当前正常复制的数量 */
    private curCopy : number = 0;
    /**@description 当前已经复制的文件数量 */
    alreadyCopy : number = 0;

    /**@description 获取目录下文件个数 */
    getDirFileCount(dir: string) {
        let count = 0;
        let counter = (dir: string) => {
            let readdir = readdirSync(dir);
            for (let i in readdir) {
                let fullPath = path.join(dir, readdir[i]);
                if (statSync(fullPath).isDirectory()){
                    counter(fullPath)
                }else{
                    count++;
                }
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

    getZipName( bundle : string , md5 ?: string ){
        return `${bundle}_${md5}.zip`;
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
        let total = bundles.length + 1;//+1主包的进度也要包含到里面
        let packZipName = this.getZipName("main",config.versions["main"].md5);
        let packZipRootPath = Editor.Project.path + "/PackageVersion";
        packZipRootPath = normalize(packZipRootPath);
        let packVersionZipPath = path.join(packZipRootPath, packZipName);
        this.delDir(packZipRootPath);
        this.mkdirSync(packZipRootPath);
        config.log(`打包路径: ${packZipRootPath}`);
        jszip.generateNodeStream({
            type: "nodebuffer",
            streamFiles: !0
        }).pipe(createWriteStream(packVersionZipPath)).once("error", (e: Error) => {
            config.log("[打包] 打包失败:" + e.message)
            count++;
            config.handler(count == total);
        }).once("finish", () => {
            config.log("[打包] 打包成功: " + packZipName)
        }).once("close",()=>{
            // config.log("[打包] 打包关闭: " + packZipName)
            count++;
            config.handler(count == total);
        })

        //打包子版本

        for (let index = 0; index < bundles.length; index++) {
            const element = config.bundles[bundles[index]];
            let packZipName = this.getZipName(element.dir,config.versions[element.dir].md5);
            let packVersionZipPath = path.join(packZipRootPath, packZipName);
            let jszip = new JSZIP();
            let fullPath = path.join(config.buildDir, `assets/${element.dir}`);
            this.zipDir(fullPath, jszip.folder(`assets/${element.dir}`));
            config.log(`[打包] ${element.name} ${element.dir} ...`);
            let data = jszip.generateNodeStream({
                type: "nodebuffer",
                streamFiles: !0
            }).pipe(createWriteStream(packVersionZipPath)).once("error", (e: Error) => {
                config.log("[打包] 打包失败:" + e.message)
                count++;
                config.handler(count == total);
            }).once("finish", () => {
                config.log("[打包] 打包成功: " + packZipName)
            }).once("close",()=>{
                // config.log("[打包] 打包关闭: " + packZipName)
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

    private createDir(dir:string){
        if (!existsSync(dir)){
            // console.log(`创建目录 : ${dir}`);
            mkdirSync(dir);
        }
    }

    private createCopyDatas(source: string, dest: string){

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
                    this.copys.push({from : from, to : to});
                }
            })
        }
        create(source,dest);
    }

    resetCopy(){
        this.copys = [];
        this.curCopy = 0;
        this.alreadyCopy = 0;
    }
    /**
     * @description 复制整个目录
     * @param source 源
     * @param dest 目标
     * @param onComplete 复制文件完成回调 
     */
    copySourceDirToDesDir(source: string, dest: string, onComplete?: Function) {
        this.createCopyDatas(source,dest);
        this.copyFile(onComplete);
    }

    private copyFile(onComplete?:Function){
        // console.log(`复制文总数 : ${this.alreadyCopy}`);
        if ( this.curCopy > this.maxCopy ){
            console.log("复制文件总数已经达到上限，等待其它文件复制完成，再进行复制");
            return;
        }

        while(this.curCopy < this.maxCopy && this.copys.length > 0 ){
            let data = this.copys.shift();
            if ( data ){
                this.curCopy++;
                let readStream = createReadStream(data.from);
                let writeStram = createWriteStream(data.to);
                readStream.pipe(writeStram).once("finish",()=>{
        
                }).once("close",()=>{
                    this.alreadyCopy++;
                    // console.log(`复制文件 : ${first?.from} - > ${first?.to}`);
                    if( onComplete ) onComplete();
                    this.curCopy--;
                    this.copyFile(onComplete);
                })
            }
        }
    }

    updateZipSize(source: VersionDatas) {
        let keys = Object.keys(source);
        keys.forEach(bundle => {
            let data = source[bundle];
            let packZipRootPath = Editor.Project.path + "/PackageVersion";
            packZipRootPath = normalize(packZipRootPath);
            let zipName = this.getZipName(bundle,data.md5);
            let packVersionZipPath = path.join(packZipRootPath, zipName);
            if ( existsSync(packVersionZipPath) ){
                let stat = statSync(packVersionZipPath);
                data.project.size = stat.size;
                console.log(`${zipName} 文件大小 : ${stat.size}`);
            }else{
                console.error(`不存在 : ${packVersionZipPath}`);
            }
        })
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
                // creator >= 3.4.2 , md5 变化问题引擎组已经修复
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