"use strict";
/**
 * @description 环境变更配置
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const Defines_1 = require("./Defines");
class _Environment {
    constructor() {
        /**@description cocos creator 安装目录 */
        this.creatorPath = "D:/Creator/Creator/3.7.2/resources";
        /**@description cocos creator 版本 */
        this.creatorVerion = "3.7.2";
        /**@description 支持版本 */
        this.supportVersions = ["3.7.2"];
        /**@description 扩展插件目录名 */
        this.extensionsName = "extensions";
        this.build = {
            platform: "windows",
            dest: "D:/workspace/QuickFramework372/proj/build/windows",
            md5Cache: false,
        };
        /**@description 对外公布示例地址*/
        this.publicBundlesUrl = "https://gitee.com/top-discover/QuickFrameworkBundles.git";
        /**@description 私有代码地址 */
        this.privateBundlesUrl = "https://gitee.com/top-discover/quick-framework-private-bundles.git";
        /**@description 是否启用私有代码 */
        this.isPrivate = false;
        /**@description 是否在tools目录下执行命令 */
        this.isCommand = false;
        /**@description 项目插件 */
        this.extensions = [
            // Extensions.CheckResources,
            // Extensions.ConfirmDelSubgames,
            Defines_1.Extensions.FixEngine,
            Defines_1.Extensions.Hotupdate,
            Defines_1.Extensions.PngCompress,
            Defines_1.Extensions.TestServer,
        ];
        /**@description 是否进行代码混淆 */
        this.isGulpCompex = false;
    }
    static get instance() {
        return this._instance || (this._instance = new _Environment);
    }
    /**
     * @description 是否需要 core
     * @param extensionsName
     */
    isLinkCore(extensionsName) {
        if (extensionsName == Defines_1.Extensions.ConfirmDelSubgames) {
            return false;
        }
        return true;
    }
    /**
     * @description 是否需要 impl
     * @param extensionsName
     */
    isLinkImpl(extensionsName) {
        if (extensionsName == Defines_1.Extensions.CheckResources || extensionsName == Defines_1.Extensions.ConfirmDelSubgames) {
            return false;
        }
        return true;
    }
    /**
     * @description 是否需要 node_modules
     * @param extensionsName
     */
    isLinkNodeModules(extensionsName) {
        if (extensionsName == Defines_1.Extensions.ConfirmDelSubgames) {
            return false;
        }
        return true;
    }
    /**
     * @description 当前是否是3.x 版本Creator
     */
    get isVersion3X() {
        return true;
    }
    get privateProj() {
        return "privateProj";
    }
    get bundleName() {
        return "bundles";
    }
    get privateCode() {
        return [
            { from: this.bundleName, to: `proj/assets/${this.bundleName}`, type: Defines_1.SyncType.Bunldes },
            // { from : "framework/slot" , to : `proj/assets/scripts/framework` , type : SyncType.CUR_DIR_AND_META},
            // { from : "@types" , to : `proj/@types` , type : SyncType.CUR_ALL_FILES},
        ];
    }
}
_Environment._instance = null;
exports.Environment = _Environment.instance;
