import { existsSync, mkdirSync, PathLike, readdirSync, readFileSync, rmdirSync, Stats, statSync, unlinkSync, writeFileSync } from "fs";
import path, { join, normalize } from "path";
import * as os from "os"
import { exec, ExecException } from "child_process";

export interface Config {
    enabled: boolean,

    minQuality: number,
    maxQuality: number,
    speed: number,
    colors: number
    excludeFolders: string,
    excludeFiles: string,
}

interface Logger {
    succeedCount: number,
    failedCount: number,
    successInfo: string,
    failedInfo: string,
}

const PACKAGE_NAME = 'png-auto-compress';
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

        minQuality: 40,
        maxQuality: 80,
        colors: 256,
        speed: 3,

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
        let savePath = `${path.join(Editor.Project.path, "/local/png-auto-compress.json")}`;
        savePath = normalize(savePath);
        return savePath;
    }

    saveConfig() {
        let savePath = this.configPath;
        console.log("保存配置如下：")
        console.log(this.config);
        writeFileSync(savePath, JSON.stringify(this.config), { encoding: "utf-8" });
    }

    private readConfig() {
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
        console.log(LOG_NAME, `正在压缩,进度信息请打开【项目工具】->【自动压缩PNG资源】查看`);
        Editor.Message.send(PACKAGE_NAME, "onStartCompress");
        if (isAutoCompress) {
            Editor.Message.send(PACKAGE_NAME, "onSetBuildDir", srcPath);
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
                        Editor.Message.send(PACKAGE_NAME, "onSetBuildDir", srcPath);
                    }
                    Editor.Message.send(PACKAGE_NAME, "updateProgess", percent)
                    this.recordResult(error, sizeBefore, info.path)
                    res(null);
                })
            }))
        });
    }

    /**@description 引擎内置资源 */
    private enginPath = path.normalize("main");

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
        console.log(LOG_NAME, content);
        const header = `\n # ${'Result'.padEnd(13, ' ')} | ${'Name / Path'.padEnd(50, ' ')} | ${'Size Before'.padEnd(13, ' ')} ->   ${'Size After'.padEnd(13, ' ')} | ${'Saved Size'.padEnd(13, ' ')} | ${'Compressibility'.padEnd(20, ' ')}`;
        content = '压缩日志 >>>' + header + this.logger.successInfo + this.logger.failedInfo;
        console.log(LOG_NAME, content);
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
        console.log(LOG_NAME, "准备压缩 PNG 资源...");
        let pngquant = this.pngquantPath;
        if (pngquant == null) {
            console.error(LOG_NAME, "压缩引擎不支持当前系统平台！");
            return;
        }
        console.log(LOG_NAME, `压缩工具路径:${pngquant}`);

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
        console.warn(LOG_NAME, "开始压缩 PNG 资源，请勿进行其他操作！");

        // 初始化队列
        this.compressTasks = [];
        //遍历项目资源
        if (existsSync(dir)) {
            console.log(LOG_NAME, `压缩资源路径:${dir}`);
            this.compress(dir, compressOptions, isCompress, isAutoCompress);
        }

        //开始压缩并等待压缩完成
        await Promise.all(this.compressTasks);
        //清空队列
        this.compressTasks = [];
        //打印压缩结果 
        this.printResults();
    }

    async onAfterBuild(dest: string) {
        if (this.config.enabled) {
            console.log(LOG_NAME, `构建输出目录:${dest}`);
            const resPath = path.join(dest, "assets/assets");
            this.startCompress(resPath, (filePath) => {
                // 排除非 png 资源和内置资源
                if (path.extname(filePath) !== '.png' || filePath.includes(this.enginPath)) {
                    return false;
                }
                return true
            }, true)
        }
    }

    /**@description 对项目资源目录进度图片压缩 */
    onStartCompress(sourceAssetsDir: any) {

        // 需要排除的文件夹
        let excludeFolders = this.config.excludeFolders.split(",").map(value => value.trim());
        //去除空的
        let i = excludeFolders.length;
        while (i--) {
            if (!!!excludeFolders[i]) {
                excludeFolders.splice(i);
            }
        }
        excludeFolders = excludeFolders.map(value => normalize(value));
        // 需要排除的文件
        let excludeFiles = this.config.excludeFiles.split(",").map(value => value.trim());
        //去除空的
        i = excludeFiles.length;
        while (i--) {
            if (!!!excludeFiles[i]) {
                excludeFiles.splice(i);
            }
        }
        excludeFiles = excludeFiles.map(value => normalize(value));

        if (excludeFolders.length > 0) {
            console.log(`需要排除目录:`, excludeFolders);
        }
        if (excludeFiles.length > 0) {
            console.log(`需要排除文件:`, excludeFiles);
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
                    // console.log(`需要排除目录:${excludeFolders[i]}`);
                    return false;
                }
            }

            //排除指定文件
            for (let i = 0; i < excludeFiles.length; i++) {
                let tempPath = join(sourceAssetsDir, excludeFiles[i]);
                if (filePath.startsWith(tempPath)) {
                    // console.log(`需要排除文件:${excludeFiles[i]}`);
                    return false;
                }
            }

            return true
        }, false);

    }
}

export const helper = new Helper();