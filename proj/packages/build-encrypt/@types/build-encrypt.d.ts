
declare interface EncryptResourcesConfig {
    /**@description 加密前缀 */
    encriptSign: string,
    /**@description 加密key */
    encriptKey: string,
    /**@description 需要加密的目录路径 */
    srcLabel: string,
    /**@description 构建类型 */
    buildType: number,
}


declare interface TaskConfig {
    /**
     * 构建输出目录的资源目录
     *
     * e.g.
     *
     * /Users/xxx/CocosCreator/CocosGame/build/jsb-link/assets
     */
     buildOutputResDirPath: string,
    /**
     * 插件脚本输出路径
     *
     * e.g.
     *
     * /Users/xxx/CocosCreator/CocosGame/build/jsb-link/src/assets/loaderplugin.js
     */
     buildOutputLoaderPluginJsFilePath:string,
    /**
     * 插件脚本输入路径
     *
     * e.g.
     *
     * ./loaderplugin.js
     */
    inputLoaderPluginJsFilePath: string;
    /**
     * 构建输出目录的 main.js
     *
     * e.g.
     *
     * /Users/xxx/CocosCreator/CocosGame/build/jsb-link/main.js
     */
    buildOutputMainJsFilePath: string;
}

declare interface  ImageObject {
    /**
     * 图片类型
     */
    type: ImageType;

    /**
     * 图片路径
     */
    filePath: string;
};
