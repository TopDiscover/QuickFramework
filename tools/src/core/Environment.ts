/**
 * @description 环境变更配置
 */

import { BuilderOptions, Extensions, HotupdateConfig, SyncType } from "./Defines";

class _Environment {

    private static _instance: _Environment = null!;
    static get instance() {
        return this._instance || (this._instance = new _Environment);
    }

    /**@description cocos creator 安装目录 */
    readonly creatorPath: string = "D:/Creator/Creator/3.7.2/resources";

    /**@description cocos creator 版本 */
    readonly creatorVerion: string = "3.7.2";

    /**@description 支持版本 */
    readonly supportVersions = ["3.7.2","3.7.3","3.8.0"];

    /**@description 扩展插件目录名 */
    readonly extensionsName = "extensions";

    readonly build : BuilderOptions = {
        platform : "windows",
        dest : "D:/workspace/QuickFramework372/proj/build/windows",
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
        // Extensions.CheckResources,
        // Extensions.ConfirmDelSubgames,
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
        return true;
    }

    get privateProj(){
        return "privateProj";
    }

    get bundleName(){
        return "bundles";
    }

    get privateCode(){
        return [
            { from : this.bundleName , to : `proj/assets/${this.bundleName}` , type : SyncType.Bunldes},
            // { from : "framework/slot" , to : `proj/assets/scripts/framework` , type : SyncType.CUR_DIR_AND_META},
            // { from : "@types" , to : `proj/@types` , type : SyncType.CUR_ALL_FILES},
        ]
    }

    /**@description 是否进行代码混淆 */
    readonly isGulpCompex = false;
}

export const Environment = _Environment.instance;
