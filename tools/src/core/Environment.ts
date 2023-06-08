/**
 * @description 环境变更配置
 */

import { BuilderOptions, Extensions, HotupdateConfig } from "./Defines";

class _Environment {

    private static _instance: _Environment = null!;
    static get instance() {
        return this._instance || (this._instance = new _Environment);
    }

    /**@description cocos creator 安装目录 */
    readonly creatorPath: string = "D:/Creator/Creator/2.4.7/resources";

    /**@description cocos creator 版本 */
    readonly creatorVerion: string = "2.4.7";

    /**@description 支持版本 */
    readonly supportVersions = ["2.4.0", "2.4.1", "2.4.2", "2.4.3", "2.4.4", "2.4.5", "2.4.6", "2.4.7","2.4.8","2.4.9","2.4.10","2.4.11"];

    /**@description 扩展插件目录名 */
    readonly extensionsName = "packages";

    readonly build : BuilderOptions = {
        platform : "win32",
        dest : "D:/workspace/QuickFramework247/proj/build/jsb-link",
        md5Cache: false,
    }

    /**@description 对外公布示例地址*/
    readonly publicBundlesUrl = "https://gitee.com/top-discover/QuickFrameworkBundles.git";

    /**@description 私有代码地址 */
    readonly privateBundlesUrl = "https://gitee.com/top-discover/quick-framework-private-bundles.git";

    /**@description 是否启用私有代码 */
    isPrivate = false;

    /**@description 是否在tools目录下执行命令 */
    isCommand = false;

    /**@description 项目插件 */
    readonly extensions = [
        Extensions.CheckResources,
        Extensions.ConfirmDelSubgames,
        Extensions.FixEngine,
        Extensions.Hotupdate,
        Extensions.PngCompress,
        Extensions.TestServer,
    ];

    /**
     * @description 是否需要 core 
     * @param extensionsName 
     */
    isLinkCore( extensionsName : string ){
        if ( extensionsName == Extensions.ConfirmDelSubgames){
            return false;
        }
        return true;
    }

    /**
     * @description 是否需要 impl
     * @param extensionsName 
     */
     isLinkImpl( extensionsName : string ){
        if ( extensionsName == Extensions.CheckResources || extensionsName == Extensions.ConfirmDelSubgames){
            return false;
        }
        return true;
    }

    /**
     * @description 是否需要 node_modules
     * @param extensionsName 
     */
     isLinkNodeModules( extensionsName : string ){
        if ( extensionsName == Extensions.ConfirmDelSubgames){
            return false;
        }
        return true;
    }

    /**
     * @description 当前是否是3.x 版本Creator
     */
    get isVersion3X(){
        return false;
    }

    /**@description 是否进行代码混淆 */
    readonly isGulpCompex = false;
}

export const Environment = _Environment.instance;
