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
export interface ZipVersionsConfig{
    /**@description 主包包含目录 */
    mainIncludes: string[]; 
    /**@description 所有版本信息 */
    versions: any; 
    /**@description 构建目录 */
    buildDir: string;
    /**@description 日志回调 */
    log :(conent:any)=>void;
    /**@description 所有bundle的配置信息 */
    bundles: BundleInfo[];
}