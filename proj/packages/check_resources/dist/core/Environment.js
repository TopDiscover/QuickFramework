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
        this.creatorPath = "D:/Creator/Creator/2.4.7/resources";
        /**@description cocos creator 版本 */
        this.creatorVerion = "2.4.7";
        /**@description 支持版本 */
        this.supportVersions = ["2.4.0", "2.4.1", "2.4.2", "2.4.3", "2.4.4", "2.4.5", "2.4.6", "2.4.7", "2.4.8", "2.4.9"];
        /**@description 扩展插件目录名 */
        this.extensionsName = "packages";
        this.build = {
            platform: "win32",
            dest: "D:/workspace/QuickFramework247/proj/build/jsb-link",
            md5Cache: false,
        };
        /**@description 是否在tools目录下执行命令 */
        this.isCommand = false;
        /**@description 项目插件 */
        this.extensions = [
            Defines_1.Extensions.CheckResources,
            // Extensions.FixEngine,
            // Extensions.Hotupdate,
            // Extensions.PngCompress,
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
        return true;
    }
    /**
     * @description 是否需要 impl
     * @param extensionsName
     */
    isLinkImpl(extensionsName) {
        if (extensionsName == Defines_1.Extensions.CheckResources) {
            return false;
        }
        return true;
    }
}
_Environment._instance = null;
exports.Environment = _Environment.instance;
