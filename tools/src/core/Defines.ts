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

export enum CmdType{
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
}

/**@description 命令行执行结果 */
export interface ResultCmd {
    data: any;
    isSuccess: boolean;
}

/**@description 文件结果 */
export interface FileResult{
    /**@description 文件名 */
    name : string,
    /**@description 相对路径 */
    relative : string,
    /**@description 文件的绝对路径 */
    path : string,
}

export enum Extensions{
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
}

export interface GulpConfig{
    platform : string,
    dest : string
}