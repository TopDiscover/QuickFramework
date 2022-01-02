import { existsSync, mkdirSync, PathLike, readdirSync, readFileSync, rmdirSync, Stats, statSync, unlinkSync, writeFileSync } from "fs";
import path, { join, normalize } from "path";
import * as os from "os"
import { exec, ExecException } from "child_process";

export interface Config {
    enabledNoFound: boolean;
    enabled: boolean,

    minQuality: number,
    maxQuality: number,
    speed: number,
    colors: number
    excludeFolders: string,
    excludeFiles: string,
    isProcessing: boolean,
}

interface Logger {
    succeedCount: number,
    failedCount: number,
    successInfo: string,
    failedInfo: string,
}

export interface BuilderOptions {
    md5Cache: boolean;
    dest: string;
    platform: string;
    debug: boolean;
}

const PACKAGE_NAME = 'png-compress';
const LOG_NAME = "[图片压缩]:";

export interface MyView {
    isProcessing: boolean;
    progress: number;
    buildAssetsDir: string;
}

type FILE_INFO = { size: number, path: string }

class Helper {
    /** 默认配置 */
    private defaultConfig: Config = {
        enabled: false,
        enabledNoFound: true,

        minQuality: 40,
        maxQuality: 80,
        colors: 256,
        speed: 3,
        isProcessing: false,

        excludeFolders: "",
        excludeFiles: "",
    };

    private _config: Config = null!;
    get config() {
        if (!this._config) {
            this.readConfig();
        }
        return this._config;
    }

    /**@description 配置存储路径 */
    private get configPath() {
        let savePath = `${path.join(Editor.Project.path, "/local/png-compress.json")}`;
        savePath = normalize(savePath);
        return savePath;
    }

    saveConfig() {
        let savePath = this.configPath;
        Editor.log("保存配置如下：")
        Editor.log(JSON.stringify(this._config));
        writeFileSync(savePath, JSON.stringify(this.config), { encoding: "utf-8" });
    }

    readConfig() {
        let tempPath = this.configPath;
        if (existsSync(tempPath)) {
            this._config = JSON.parse(readFileSync(tempPath, { encoding: "utf-8" }));
        } else {
            this._config = this.defaultConfig;
        }
    }

    private get pngquantPath() {
        let outPath = null;
        //获取压缩引擎路径
        switch (os.platform()) {
            case "darwin": { //MacOS
                outPath = path.join(__dirname, "../pngquant/mac/pngquant");
            } break;
            case "win32": { //Windows
                outPath = path.join(__dirname, "../pngquant/windows/pngquant");
            } break;
            default: {

            }
        }
        if (outPath) {
            outPath = normalize(outPath);
        }
        return outPath;
    }

    //日志
    private logger: Logger = null!;

    /**@description 压缩队列 */
    private compressTasks: any[] = [];

    /**
     * @description 压缩
     * @param srcPath 文件路径
     * @param compressOptions 压缩设置
     */
    private compress(srcPath: string, compressOptions: string, isCompress: (filePath: string) => boolean, isAutoCompress: boolean) {
        let files: FILE_INFO[] = [];
        this.readDir(srcPath, files, isCompress);
        let totalCount = files.length;
        let curCount = 0;
        Editor.log(LOG_NAME, `正在压缩,进度信息请打开【项目工具】->【图片压缩】查看`);
        Editor.Ipc.sendToPanel(PACKAGE_NAME, "onStartCompress");
        if (isAutoCompress) {
            Editor.Ipc.sendToPanel(PACKAGE_NAME, "onSetBuildDir", srcPath);
        }
        files.forEach((info) => {
            this.compressTasks.push(new Promise(res => {
                const sizeBefore = info.size;
                const command = `"${this.pngquantPath}" ${compressOptions} -- "${info.path}"`;
                exec(command, (error, stdout, stderr) => {
                    curCount++;
                    let percent = curCount / totalCount;
                    percent *= 100;
                    percent = parseFloat(percent.toFixed(2));
                    if (isAutoCompress) {
                        Editor.Ipc.sendToPanel(PACKAGE_NAME, "onSetBuildDir", srcPath);
                    }
                    Editor.Ipc.sendToPanel(PACKAGE_NAME, "updateProgess", percent)
                    this.recordResult(error, sizeBefore, info.path)
                    res(null);
                })
            }))
        });
    }

    /**@description 引擎内置资源 */
    private enginPath = path.normalize("internal");

    /**
     * @description 读取目录下的所有文件的md5及大小信息到obj
     * @param dir 读取目录
     * @param outFiles 输出对象
     * @returns 
     */
    private readDir(dir: string, outFiles: FILE_INFO[], isCompress: (filePath: string) => boolean) {
        let stat = statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        var subpaths = readdirSync(dir);
        let subpath = "";
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path.join(dir, subpaths[i]);
            stat = statSync(subpath);
            if (stat.isDirectory()) {
                this.readDir(subpath, outFiles, isCompress);
            } else if (stat.isFile()) {
                if (isCompress(subpath)) {
                    outFiles.push({ size: stat.size / 1024, path: subpath });
                }
            }
        }
    }

    private printResults() {
        let content = `压缩完成（${this.logger.succeedCount} 张成功 | ${this.logger.failedCount} 张失败）`;
        Editor.log(LOG_NAME, content);
        const header = `\n # ${'Result'.padEnd(13, ' ')} | ${'Name / Path'.padEnd(50, ' ')} | ${'Size Before'.padEnd(13, ' ')} ->   ${'Size After'.padEnd(13, ' ')} | ${'Saved Size'.padEnd(13, ' ')} | ${'Compressibility'.padEnd(20, ' ')}`;
        content = '压缩日志 >>>' + header + this.logger.successInfo + this.logger.failedInfo;
        Editor.log(LOG_NAME, content);
        // 清空
        this.logger = null as any;
    }

    private recordResult(error: ExecException | null, sizeBefore: number, filePath: string) {
        if (!error) {
            // 成功
            this.logger.succeedCount++;
            const fileName = path.basename(filePath);
            const sizeAfter = statSync(filePath).size / 1024;
            const savedSize = sizeBefore - sizeAfter;
            const savedRatio = savedSize / sizeBefore * 100;
            this.logger.successInfo += `\n + ${'Successful'.padEnd(13, ' ')} | ${fileName.padEnd(50, ' ')} | ${(sizeBefore.toFixed(2) + ' KB').padEnd(13, ' ')} ->   ${(sizeAfter.toFixed(2) + ' KB').padEnd(13, ' ')} | ${(savedSize.toFixed(2) + ' KB').padEnd(13, ' ')} | ${(savedRatio.toFixed(2) + '%').padEnd(20, ' ')}`;
        } else {
            // 失败
            this.logger.failedCount++;
            this.logger.failedInfo += `\n - ${'Failed'.padEnd(13, ' ')} | ${filePath.replace(Editor.Project.path, '')}`;
            switch (error.code) {
                case 98:
                    this.logger.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩后体积增大（已经不能再压缩了）`;
                    break;
                case 99:
                    this.logger.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩后质量低于已配置最低质量`;
                    break;
                case 127:
                    this.logger.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩引擎没有执行权限`;
                    break;
                default:
                    this.logger.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：code ${error.code}`;
                    break;
            }
        }
    }

    /**@description 开始压缩资源 */
    private async startCompress(dir: string, isCompress: (filePath: string) => boolean, isAutoCompress: boolean = true) {
        Editor.log(LOG_NAME, "准备压缩 PNG 资源...");
        let pngquant = this.pngquantPath;
        if (pngquant == null) {
            Editor.error(LOG_NAME, "压缩引擎不支持当前系统平台！");
            return;
        }
        Editor.log(LOG_NAME, `压缩工具路径:${pngquant}`);

        // 设置压缩命令
        const qualityParam = `--quality ${this.config.minQuality}-${this.config.maxQuality}`;
        const speedParam = `--speed ${this.config.speed}`;
        const skipParam = '--skip-if-larger';
        const outputParam = '--ext=.png';
        const writeParam = '--force';
        const compressOptions = `${qualityParam} ${speedParam} ${skipParam} ${outputParam} ${writeParam}`;

        //日志重置
        this.logger = {
            succeedCount: 0,
            failedCount: 0,
            successInfo: "",
            failedInfo: ""
        }

        //开始压缩
        Editor.warn(LOG_NAME, "开始压缩 PNG 资源，请勿进行其他操作！");

        // 初始化队列
        this.compressTasks = [];
        //遍历项目资源
        if (existsSync(dir)) {
            Editor.log(LOG_NAME, `压缩资源路径:${dir}`);
            this.compress(dir, compressOptions, isCompress, isAutoCompress);
        }

        //开始压缩并等待压缩完成
        await Promise.all(this.compressTasks);
        //清空队列
        this.compressTasks = [];
        //打印压缩结果 
        this.printResults();
    }

    private getPlatformAssetDir(platform: string) {
        return "assets";
    }

    private getUUID(filePath: string, md5Cache: boolean) {
        let ret = path.parse(filePath);
        if (md5Cache) {
            //如果加了md5,需要在取一次，才能取到uuid
            ret = path.parse(ret.name);
            return ret.name;
        } else {
            return ret.name;
        }
    }

    /**@description 需要排除的文件目录 */
    private get excludeFolders() {

        let content = this.config.excludeFolders.replace(/\n/g, ",")
        // 需要排除的文件夹
        let excludeFolders = content.split(",").map(value => value.trim());
        //去除空的
        let i = excludeFolders.length;
        while (i--) {
            if (!!!excludeFolders[i]) {
                excludeFolders.splice(i);
            }
        }
        excludeFolders = excludeFolders.map(value => normalize(value));
        return excludeFolders;
    }

    /**@description 需要排除的文件 */
    private get excludeFiles() {
        let content = this.config.excludeFiles.replace(/\n/g, ",");
        // 需要排除的文件
        let excludeFiles = content.split(",").map(value => value.trim());
        //去除空的
        let i = excludeFiles.length;
        while (i--) {
            if (!!!excludeFiles[i]) {
                excludeFiles.splice(i);
            }
        }
        excludeFiles = excludeFiles.map(value => normalize(value));
        return excludeFiles;
    }

    private getAssets() {
        return new Promise<{[key:string]:AssetInfo}>((reslove) => {
            let allRes : {[key:string]:AssetInfo} = {};
            Editor.assetdb.queryAssets(`db://**/*`, [], (err, results) => {
                results.forEach((info: AssetInfo) => {
                    if ( info.type == "texture" && info.uuid ){
                        allRes[info.uuid ] = info;
                    }
                })
                reslove(allRes);
            });
        })
    }

    async onAfterBuild(options: BuilderOptions) {
        Editor.log(`${LOG_NAME} 构建完成后是否自动压缩资源:${this.config.enabled}`);
        Editor.log(`${LOG_NAME} 构建平台:${options.platform}`)
        if (this.config.enabled) {
            Editor.log(LOG_NAME, `构建目录:${options.dest}`);
            const resPath = path.join(options.dest, this.getPlatformAssetDir(options.platform));
            Editor.log(LOG_NAME, `构建资源目录:${resPath}`);

            //找出所有图片
            let allImages = await this.getAssets();

            // 需要排除的文件夹
            let excludeFolders = this.excludeFolders;
            let excludeFiles = this.excludeFiles;

            if (excludeFolders.length > 0) {
                Editor.log(`需要排除目录:`, excludeFolders);
            }
            if (excludeFiles.length > 0) {
                Editor.log(`需要排除文件:`, excludeFiles);
            }
            let sourceAssetsDir = join(Editor.Project.path, "assets");
            this.startCompress(resPath, (filePath) => {
                // 排除非 png 资源和内置资源
                if (path.extname(filePath) !== '.png' || filePath.includes(this.enginPath)) {
                    return false;
                }
                let uuid = this.getUUID(filePath, options.md5Cache);
                let info = allImages[uuid];
                if (info) {
                    let sourcePath = info.path as any;
                    //排除指定
                    for (let i = 0; i < excludeFolders.length; i++) {
                        let tempPath = join(sourceAssetsDir, excludeFolders[i]);
                        if (sourcePath.startsWith(tempPath)) {
                            // Editor.log(`需要排除目录:${excludeFolders[i]}`);
                            // Editor.log(`构建目录文件路径:${filePath}`);
                            // Editor.log(`源文件路径:${sourcePath}`);
                            return false;
                        }
                    }

                    //排除指定文件
                    for (let i = 0; i < excludeFiles.length; i++) {
                        let tempPath = join(sourceAssetsDir, excludeFiles[i]);
                        if (sourcePath.startsWith(tempPath)) {
                            // Editor.log(`需要排除文件:${excludeFiles[i]}`);
                            // Editor.log(`构建目录文件路径:${filePath}`);
                            // Editor.log(`源文件路径:${sourcePath}`);
                            return false;
                        }
                    }
                } else {
                    if (this.config.enabledNoFound) {
                        return true;
                    } else {
                        Editor.warn(`反向查找该文件无法找:${filePath},未开启反向无法找到资源强行压缩，路过压缩处理`);
                        return false;
                    }

                }

                return true
            }, true)
        }
    }

    /**@description 对项目资源目录进度图片压缩 */
    onStartCompress(sourceAssetsDir: any) {
        // 需要排除的文件夹
        let excludeFolders = this.excludeFolders;
        // 需要排除的文件
        let excludeFiles = this.excludeFiles;

        if (excludeFolders.length > 0) {
            Editor.log(`需要排除目录:`, excludeFolders);
        }
        if (excludeFiles.length > 0) {
            Editor.log(`需要排除文件:`, excludeFiles);
        }

        this.startCompress(sourceAssetsDir, (filePath: string) => {
            // 排除非 png 资源和内置资源
            if (path.extname(filePath) !== '.png' || filePath.includes(this.enginPath)) {
                return false;
            }

            //排除指定
            for (let i = 0; i < excludeFolders.length; i++) {
                let tempPath = join(sourceAssetsDir, excludeFolders[i]);
                if (filePath.startsWith(tempPath)) {
                    // Editor.log(`需要排除目录:${excludeFolders[i]},排除文件:${filePath}`);
                    return false;
                }
            }

            //排除指定文件
            for (let i = 0; i < excludeFiles.length; i++) {
                let tempPath = join(sourceAssetsDir, excludeFiles[i]);
                if (filePath.startsWith(tempPath)) {
                    // Editor.log(`需要排除文件:${excludeFiles[i]},排除文件:${filePath}`);
                    return false;
                }
            }

            return true
        }, false);

    }
}

export const helper = new Helper();