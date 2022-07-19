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
    readonly creatorPath: string = "D:/Creator/Creator/3.3.1/resources";

    /**@description cocos creator 版本 */
    readonly creatorVerion: string = "3.3.1";

    /**@description 支持版本 */
    readonly supportVersions = ["3.3.1", "3.3.2", "3.4.0", "3.4.1", "3.4.2"];

    /**@description 扩展插件目录名 */
    readonly extensionsName = "extensions";

    readonly build : BuilderOptions = {
        platform : "windows",
        dest : "D:/workspace/QuickFramework331/proj/build/windows",
        md5Cache: false,
    }

    /**@description 是否在tools目录下执行命令 */
    isCommand = false;

    /**@description 项目插件 */
    readonly extensions = [
        // Extensions.CheckResources,
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

    /**@description 是否进行代码混淆 */
    readonly isGulpCompex = false;
}

export const Environment = _Environment.instance;
