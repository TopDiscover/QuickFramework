import JSZip from "jszip";

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
    historySelectedUrl: string,
    /**@description 构建项目目录 */
    buildDir: string,

    /**@description 各bundle的版本配置 */
    bundles: { [key: string]: BundleInfo },

    /**@description 远程服务器地址 */
    remoteUrl: string,
    /**@description 远程各bundle的版本配置 */
    remoteBundleUrls: any,
    /**@description 远程服务器所在目录 */
    remoteDir: string,
}

/**
 * @description 热火更新配置
 */
export interface HotUpdateConfig {
    packageUrl: string;
    forceIncludeAllGameToApk: boolean;
    version: string;
    description: string;
    bundles: BundleInfo[];
}

export interface Manifest {
    assets?: any;
    bundle?: string;
    md5?: string;
    version?: string;
}

export interface ITools {
    /**@description 获取目录下文件个数 */
    getDirFileCount(dir: string): number;

    /**@description 压缩文件到zip */
    zipDir(dir: string, jszip: JSZip | null): void;

    /**
     * @description 打包版本文件
     */
    zipVersions(config: ZipVersionsConfig): void;

    /**@description 创建目录 */
    mkdirSync(dir: string): void;

    /**
     * @description 删除目录
     * @param sourceDir 源目录
     * @param isRemoveSourceDir 是否删除源目录本身，默认不删除
     */
    delDir(sourceDir: string, isRemoveSourceDir?: boolean): void
    /**
     * @description 删除文件
     * @param filePath 
     * @returns 
     */
    delFile(filePath: string): boolean;
    /**
     * @description 复制整个目录
     * @param source 源
     * @param dest 目标
     * @param copyFileCb 复制文件完成回调 
     */
    copySourceDirToDesDir(source: string, dest: string, copyFileCb?: Function): void;

    /**
     * @description 读取目录下的所有文件的md5及大小信息到obj
     * @param dir 读取目录
     * @param obj 输出对象
     * @param source 
     * @returns 
     */
    readDir(dir: string, obj: any, source: string): void;
}