/**
 * @description 项目扩展声明
 */

/**
 * @description 引擎修正插件数据定义
 */
export interface FixEngineData {
    /**@description 相对于 Editor.App.path 的相对路径 */
    to: string;
    /**@description 相对于 fix_engine/engine 的相对路径 */
    from: string;
    /**@description 修正说明 */
    desc: string;
}

/**@description 引擎修正插件config.json的结构定义 */
export type FixEngineConfig = { [key: string]: FixEngineData };


export interface Logger {
    log(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
}

export enum CmdType {
    /**@description 拉取 Bunldes 代码 */
    GitBundles = "-gitBundles",
    /**@description 链接Bundles代码 */
    Sync = "-sync",
    /**@description 链接扩展插件代码 */
    Extensions = "-extensions",
    /**@description 引擎修改 */
    FixEngine = "-fixEngine",
    /**@description Gulp 压缩 */
    Gulp = "-gulp",
    /**@description 链接 gulpfile.js 到dist */
    LinkGulp = "-linkGulp",
    /**@description 获取工程目录所有资源信息资源 */
    Assets = "-assets",
    /**@description 压缩图片资源 */
    Pngquant = "-pngquant",
    /**@description 热更新 */
    Hotupdate = "-hotupdate",
    /**@description 上帝模式，功能全开 */
    God = "-god",
    /**@description protobufjs */
    ProtobufJS = "-protobufjs",
}

/**@description 命令行执行结果 */
export interface ResultCmd {
    data: any;
    isSuccess: boolean;
}

/**@description 文件结果 */
export interface FileResult {
    /**@description 文件名 */
    name: string,
    /**@description 相对路径 */
    relative: string,
    /**@description 文件的绝对路径 */
    path: string,
    /**@description 文件大小 */
    size: number,
}

export type DirResult = Omit<FileResult,"size">;

export enum Extensions {
    /**@description 资源引用检查，目录只对2.x有效,可能兼容上有问题，后续不再维护 */
    CheckResources = "check_resources",
    /**@description 引擎修正 */
    FixEngine = "fix_engine",
    /**@description Gulp 压缩 */
    GulpCompress = "gulp-compress",
    /**@description 热更新 */
    Hotupdate = "hotupdate",
    /**@description 图个压缩 */
    PngCompress = "png-compress",
    /**@description 测试服务器 */
    TestServer = "test-server",
    /**@description 确定删除bundle */
    ConfirmDelSubgames = "confirm_del_subgames"
}

export interface GulpConfig {
    platform: string,
    dest: string
}

export interface BuilderOptions {
    platform: string,
    dest: string,
    md5Cache: boolean,
    debug?: boolean,
}

export interface PngCompressConfig {
    /**@description 构建完成反向查找不能查找到该资源，是否强行进行压缩,建议开启 */
    enabledNoFound: boolean;
    /**@description 项目构建完成后自动压缩PNG 资源 */
    enabled: boolean,
    /**@description 最低压缩质量 */
    minQuality: number,
    /**@description 最高压缩质量 */
    maxQuality: number,
    /**@description 压缩速度 */
    speed: number,
    /**@description 需要排除的文件夹,多个值之间必须用换行隔开 */
    excludeFolders: string,
    /**@description 需要排除的文件，多个值之间必须用换行隔开 */
    excludeFiles: string,
    /**@description 是否正在压缩 */
    isProcessing: boolean,
}

export interface LibraryMaps {
    [key: string]: string,
    ".png": string,
    ".json": string,
}

export interface AssetInfo {
    /**@description 资源类型 */
    type: string,
    /**@description 资源uuid */
    uuid: string,
    /**@description 3.x 资源工程路径 */
    file?: string,
    /**@description library */
    library?: LibraryMaps,
    /**@description 2.x 资源工程路径 */
    path?:string,
}


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
    md5?: string;
}

export type BunldesConfig = { [key: string]: BundleInfo };

export interface HotupdateConfig {
    /**@description 主包版本号 */
    version: string,
    /**@description 当前服务器地址 */
    serverIP: string,
    /**@description 服务器历史地址 */
    historyIps: string[],
    /**@description 构建项目目录 */
    buildDir: string,
    /**@description 各bundle的版本配置 */
    bundles: BunldesConfig,
    /**@description 远程服务器所在目录 */
    remoteDir: string,
    /**@description 自动创建 */
    autoCreate: boolean;
    /**@description 自动部署 */
    autoDeploy: boolean;
    /**@description 自动生成版本号 */
    isAutoVersion : boolean;
    /**app应用版本号 */
    appVersion : string;
}

export type Asset = {[k:string] :{ size : number , md5 : string}};

export interface Manifest {
    assets?: Asset;
    bundle?: string;
    md5?: string;
    version?: string;
    size?: number;
}

/**
 * @description versions.json 结构
 */
export type VersionInfo = { [key: string]: Manifest };

/**
* @description 版本数据信息
*/
export interface VersionData {
    project: Manifest;
    version: Manifest;
    projectPath: string;
    versionPath: string;
    md5: string;
}

/**
 * @description 版本数据结构
 */
export type VersionDatas = { [key: string]: VersionData };

export type VersionJson = {[key: string]: { md5: string, version: string }};

export type ApkJson = { version: string };

export type CopyData = { from : string , to : string}[];

export enum SyncType{
    /**@description 当前目录及.meta文件 */
    CUR_DIR_AND_META,
    /**@description 当前目录下所有文件 */
    CUR_ALL_FILES,
    /**@description bundles目录 */
    Bunldes,
}