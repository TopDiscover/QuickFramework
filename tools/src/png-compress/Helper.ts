import { basename, extname, join, normalize, parse } from "path";
import Config from "../core/Config";
import { AssetInfo, BuilderOptions, Extensions, FileResult, PngCompressConfig } from "../core/Defines";
import * as os from "os"
import FileUtils from "../core/FileUtils";
import { ExecException } from "child_process";
import { existsSync, statSync, writeFileSync } from "fs";
import { Environment } from "../core/Environment";
import AssetsHelper from "../core/AssetsHelper";

interface Records {
    successCount: number,
    failedCount: number,
    successInfo: string,
    failedInfo: string,
    successAssets: FileResult[],
    failedAssets: FileResult[],
}

/**
 * @description pngquant 图集压缩
 */
export default class Helper extends Config<PngCompressConfig> {

    module = "【图片压缩】";

    readonly defaultData: PngCompressConfig = {
        enabled: false,
        enabledNoFound: true,
        minQuality: 40,
        maxQuality: 80,
        speed: 3,
        isProcessing: false,
        excludeFolders: "",
        excludeFiles: "",
    }

    get path() {
        let out = join(this.configPath, `${Extensions.PngCompress}.json`);
        return out;
    }

    get data() {
        if (!this._data) {
            this.read(true);
        }
        return this._data;
    }

    protected _dest: string = null!;
    get dest() {
        return Environment.build.dest;
    }
    set dest(v) {
        this._dest = v;
    }

    protected _platform: string = null!;
    get platform() {
        return Environment.build.platform;
    }
    set platform(v) {
        this._platform = v;
    }

    get pngquantPath() {
        let path: string | null = null;
        switch (os.platform()) {
            case "darwin": { //MacOS
                path = join(this.extensionsPath, `${Extensions.PngCompress}/pngquant/mac/pngquant`);
            } break;
            case "win32": { //Windows
                path = join(this.extensionsPath, `${Extensions.PngCompress}/pngquant/windows/pngquant`);
            } break;
            default: {

            }
        }
        return path;
    }

    //日志记录
    protected records: Records = null!;

    //压缩队列 
    protected compressTasks: any[] = [];

    /**@description 引擎内置资源 */
    protected readonly enginPath = "main";

    protected _assetsHelper = new AssetsHelper();
    protected get assetsHelper() {
        return this._assetsHelper;
    }

    protected get isWriteLog() {
        return false;
    }

    protected onStartCompress() {
        this.logger.log(`${this.module}压缩开始`)
        // Editor.Message.send(PACKAGE_NAME, "onStartCompress");
    }

    protected onSetBuildDir(path: string) {
        // this.logger.log(`${this.module}设置压缩目录 : ${path}`)
        // Editor.Message.send(PACKAGE_NAME, "onSetBuildDir", path);
    }

    protected onUpdateProgess(percent: number) {
        // this.logger.log(`${this.module}当前压缩进度 : ${percent}`);
        // Editor.Message.send(PACKAGE_NAME, "updateProgess", percent)
    }

    protected onPngCompressComplete(dest: string, platfrom: string) {
        this.logger.log(`${this.module}压缩完成`)
        // Editor.Message.send("hotupdate","onPngCompressComplete",dest,platfrom);
    }

    /**
     * @description 压缩
     * @param srcPath 文件路径
     * @param compressOptions 压缩设置
     */
    private compress(srcPath: string, compressOptions: string, isCompress: (info: FileResult) => boolean, isAutoCompress: boolean) {
        let files = FileUtils.instance.getFiles(srcPath, isCompress);
        let totalCount = files.length;
        let curCount = 0;
        this.logger.log(this.module, `正在压缩,进度信息请打开【项目工具】->【图片压缩】查看`);
        this.onStartCompress();
        if (isAutoCompress) {
            this.onSetBuildDir(srcPath);
        }
        files.forEach((info) => {
            this.compressTasks.push(new Promise(res => {
                const sizeBefore = info.size / 1024;
                const command = `"${this.pngquantPath}" ${compressOptions} -- "${info.path}"`;
                this.exec(command, false).then((result) => {
                    curCount++;
                    let percent = curCount / totalCount;
                    percent *= 100;
                    percent = parseFloat(percent.toFixed(2));
                    if (isAutoCompress) {
                        this.onSetBuildDir(srcPath);
                    }
                    this.onUpdateProgess(percent);
                    let err = result.data;
                    if (result.isSuccess) {
                        err = null;
                    }
                    this.recordResult(err, sizeBefore, info)
                    res(null);
                })
            }))
        });
    }

    private printResults() {
        let content = `压缩完成（${this.records.successCount} 张成功 | ${this.records.failedCount} 张失败）`;
        this.logger.log(this.module, content);
        const header = `\n # ${'Result'.padEnd(13, ' ')} | ${'Name / Path'.padEnd(50, ' ')} | ${'Size Before'.padEnd(13, ' ')} ->   ${'Size After'.padEnd(13, ' ')} | ${'Saved Size'.padEnd(13, ' ')} | ${'Compressibility'.padEnd(20, ' ')}`;
        content = '压缩日志 >>>' + header + this.records.successInfo + this.records.failedInfo;
        this.logger.log(this.module, content);
        // 清空
        this.logger = null as any;
        //写入本地文件
        if (this.isWriteLog) {
            this.records.successAssets.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name == b.name) {
                    return 0;
                }
                else {
                    return -1;
                }
            })

            this.records.failedAssets.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name == b.name) {
                    return 0;
                }
                else {
                    return -1;
                }
            })

            let data = {
                success: this.records.successAssets,
                failed: this.records.failedAssets
            }
            
            let path = join(this.localPath, `${Extensions.PngCompress}${this.date}_cache.json`);
            writeFileSync(path, JSON.stringify(data), "utf-8");
        }

    }

    private recordResult(error: ExecException | null, sizeBefore: number, info: FileResult) {
        if (!error) {
            // 成功
            this.records.successCount++;
            const fileName = basename(info.path);
            const sizeAfter = statSync(info.path).size / 1024;
            const savedSize = sizeBefore - sizeAfter;
            const savedRatio = savedSize / sizeBefore * 100;
            this.records.successAssets.push(info);
            this.records.successInfo += `\n + ${'Successful'.padEnd(13, ' ')} | ${fileName.padEnd(50, ' ')} | ${(sizeBefore.toFixed(2) + ' KB').padEnd(13, ' ')} ->   ${(sizeAfter.toFixed(2) + ' KB').padEnd(13, ' ')} | ${(savedSize.toFixed(2) + ' KB').padEnd(13, ' ')} | ${(savedRatio.toFixed(2) + '%').padEnd(20, ' ')}`;
        } else {
            // 失败
            this.records.failedCount++;
            this.records.failedInfo += `\n - ${'Failed'.padEnd(13, ' ')} | ${info.relative}`;
            switch (error.code) {
                case 98:
                    this.records.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩后体积增大（已经不能再压缩了）`;
                    break;
                case 99:
                    this.records.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩后质量低于已配置最低质量`;
                    break;
                case 127:
                    this.records.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：压缩引擎没有执行权限`;
                    break;
                default:
                    this.records.failedInfo += `\n ${''.padEnd(10, ' ')} - 失败原因：code ${error.code}`;
                    break;
            }
            this.records.failedAssets.push(info);
        }
    }

    /**@description 开始压缩资源 */
    protected async _startCompress(dir: string, isCompress: (info: FileResult) => boolean, isAutoCompress: boolean = true) {
        this.logger.log(this.module, "准备压缩 PNG 资源...");
        let pngquant = this.pngquantPath;
        if (pngquant == null) {
            this.logger.error(this.module, "压缩引擎不支持当前系统平台！");
            return;
        }
        this.logger.log(this.module, `压缩工具路径:${pngquant}`);

        // 设置压缩命令
        const qualityParam = `--quality ${this.data!.minQuality}-${this.data!.maxQuality}`;
        const speedParam = `--speed ${this.data!.speed}`;
        const skipParam = '--skip-if-larger';
        const outputParam = '--ext=.png';
        const writeParam = '--force';
        const compressOptions = `${qualityParam} ${speedParam} ${skipParam} ${outputParam} ${writeParam}`;

        //日志重置
        this.records = {
            successCount: 0,
            failedCount: 0,
            successInfo: "",
            failedInfo: "",
            successAssets: [],
            failedAssets: []
        }

        //开始压缩
        this.logger.warn(this.module, "开始压缩 PNG 资源，请勿进行其他操作！");

        // 初始化队列
        this.compressTasks = [];
        //遍历项目资源
        if (existsSync(dir)) {
            this.logger.log(this.module, `压缩资源路径:${dir}`);
            this.compress(dir, compressOptions, isCompress, isAutoCompress);
        }

        //开始压缩并等待压缩完成
        await Promise.all(this.compressTasks);
        //清空队列
        this.compressTasks = [];
        //打印压缩结果 
        this.printResults();
        this.onPngCompressComplete(this.dest, this.platform);
    }

    private getPlatformAssetDir(platform: string) {
        if (platform == "android" || platform == "windows" || platform == "ios" || platform == "mac") {
            return "assets/assets";
        } else {
            return "assets";
        }
    }

    private getUUID(filePath: string, md5Cache: boolean) {
        let ret = parse(filePath);
        if (md5Cache) {
            //如果加了md5,需要在取一次，才能取到uuid
            ret = parse(ret.name);
            return ret.name;
        } else {
            return ret.name;
        }
    }

    /**@description 需要排除的文件目录 */
    private get excludeFolders() {

        let content = this.data!.excludeFolders.replace(/\n/g, ",")
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
        let content = this.data!.excludeFiles.replace(/\n/g, ",");
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

    /**@description 获取工程目录所有资源信息资源 */
    protected async getAllAssets() {
        return this.assetsHelper.getAssets();
    }

    async onAfterBuild(options: BuilderOptions) {
        this.logger.log(`${this.module} 构建完成后是否自动压缩资源:${this.data!.enabled}`);
        this.logger.log(`${this.module} 构建平台:${options.platform}`)
        this.dest = options.dest;
        this.platform = options.platform;
        if (this.data!.enabled) {
            this.logger.log(this.module, `构建目录:${options.dest}`);
            const resPath = join(options.dest, this.getPlatformAssetDir(options.platform));
            this.logger.log(this.module, `构建资源目录:${resPath}`);

            //先拿到资源
            let allAssets = await this.getAllAssets();

            //找出所有图片
            let allImages: { [key: string]: AssetInfo } = {} as any;

            allAssets.forEach((info) => {
                //排除图片资源 
                if (info.type == "cc.ImageAsset" || info.type == "cc.SpriteAtlas") {
                    allImages[info.uuid] = info;
                }
            });

            // 需要排除的文件夹
            let excludeFolders = this.excludeFolders;
            let excludeFiles = this.excludeFiles;

            if (excludeFolders.length > 0) {
                this.logger.log(`需要排除目录:`, excludeFolders);
            }
            if (excludeFiles.length > 0) {
                this.logger.log(`需要排除文件:`, excludeFiles);
            }
            const sourceAssetsDir = this.assetsDBPath;
            await this._startCompress(resPath, (result) => {
                // 排除非 png 资源和内置资源
                if (extname(result.path) !== '.png' || result.path.includes(this.enginPath)) {
                    return false;
                }
                let uuid = this.getUUID(result.path, options.md5Cache);
                let info = allImages[uuid];
                if (info) {
                    let sourcePath = info.file;
                    if (!sourcePath) {
                        // this.logger.log(`未找到${uuid}的原始文件`);
                        return false;
                    }
                    //排除指定
                    for (let i = 0; i < excludeFolders.length; i++) {
                        let tempPath = join(sourceAssetsDir, excludeFolders[i]);
                        if (sourcePath.startsWith(tempPath)) {
                            // this.logger.log(`需要排除目录:${excludeFolders[i]}`);
                            // this.logger.log(`构建目录文件路径:${result.path}`);
                            // this.logger.log(`源文件路径:${sourcePath}`);
                            return false;
                        }
                    }

                    //排除指定文件
                    for (let i = 0; i < excludeFiles.length; i++) {
                        let tempPath = join(sourceAssetsDir, excludeFiles[i]);
                        if (sourcePath.startsWith(tempPath)) {
                            // this.logger.log(`需要排除文件:${excludeFiles[i]}`);
                            // this.logger.log(`构建目录文件路径:${result.path}`);
                            // this.logger.log(`源文件路径:${sourcePath}`);
                            return false;
                        }
                    }
                } else {
                    if (this.data!.enabledNoFound) {
                        return true;
                    } else {
                        this.logger.warn(`反向查找该文件无法找:${result.path},未开启反向无法找到资源强行压缩，跳过压缩处理`);
                        return false;
                    }

                }

                return true
            }, true)
        } else {
            this.onPngCompressComplete(this.dest, this.platform);
        }
    }

    /**@description 对项目资源目录进度图片压缩 */
    async startCompress(sourceAssetsDir: any) {

        // 需要排除的文件夹
        let excludeFolders = this.excludeFolders;
        // 需要排除的文件
        let excludeFiles = this.excludeFiles;

        if (excludeFolders.length > 0) {
            this.logger.log(`需要排除目录:`, excludeFolders);
        }
        if (excludeFiles.length > 0) {
            this.logger.log(`需要排除文件:`, excludeFiles);
        }

        await this._startCompress(sourceAssetsDir, (info: FileResult) => {
            // 排除非 png 资源和内置资源
            if (extname(info.path) !== '.png' || info.path.includes(this.enginPath)) {
                return false;
            }

            //排除指定
            for (let i = 0; i < excludeFolders.length; i++) {
                let tempPath = join(sourceAssetsDir, excludeFolders[i]);
                if (info.path.startsWith(tempPath)) {
                    // this.logger.log(`需要排除目录:${excludeFolders[i]}`);
                    return false;
                }
            }

            //排除指定文件
            for (let i = 0; i < excludeFiles.length; i++) {
                let tempPath = join(sourceAssetsDir, excludeFiles[i]);
                if (info.path.startsWith(tempPath)) {
                    // this.logger.log(`需要排除文件:${excludeFiles[i]}`);
                    return false;
                }
            }

            return true
        }, false);
    }
}