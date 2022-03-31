/**@description bundle信息 */
declare interface BundleInfo {
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

/**
 * @description 压缩版本文件配置
 */
declare interface ZipVersionsConfig {
    /**@description 主包包含目录 */
    mainIncludes: string[];
    /**@description 所有版本信息 */
    versions: { [key: string]: { md5: string, version: string } };
    /**@description 构建目录 */
    buildDir: string;
    /**@description 日志回调 */
    log: (conent: any) => void;
    /**@description 所有bundle的配置信息 */
    bundles: { [key: string]: BundleInfo };
    handler : Function;
}

declare interface HotupdateConfig {
    /**@description 主包版本号 */
    version: string,
    /**@description 当前服务器地址 */
    serverIP: string,
    /**@description 服务器历史地址 */
    historyIps: string[],
    /**@description 构建项目目录 */
    buildDir: string,
    /**@description 各bundle的版本配置 */
    bundles: { [key: string]: BundleInfo },
    /**@description 远程服务器所在目录 */
    remoteDir: string,
    /**@description 主包包含目录 */
    includes: { [key: string]: { name: string, include: boolean, isLock: boolean } };
    /**@description 自动创建 */
    autoCreate: boolean;
    /**@description 自动部署 */
    autoDeploy: boolean;
}

declare interface Manifest {
    assets?: any;
    bundle?: string;
    md5?: string;
    version?: string;
}