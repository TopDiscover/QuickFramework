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
        this.creatorPath = "D:/Creator/Creator/3.3.1/resources";
        /**@description cocos creator 版本 */
        this.creatorVerion = "3.3.1";
        /**@description 支持版本 */
        this.supportVersions = ["3.3.1", "3.3.2", "3.4.0", "3.4.1", "3.4.2"];
        /**@description 扩展插件目录名 */
        this.extensionsName = "extensions";
        /**@description 是否在tools目录下执行命令 */
        this.isTools = false;
        /**@description 项目插件 */
        this.extensions = [
            // Extensions.CheckResources,
            Defines_1.Extensions.FixEngine,
            Defines_1.Extensions.Hotupdate,
            Defines_1.Extensions.PngCompress,
            Defines_1.Extensions.TestServer,
        ];
        /**@description 是否进行代码混淆 */
        this.isGulpCompex = true;
    }
    static get instance() {
        return this._instance || (this._instance = new _Environment);
    }
}
_Environment._instance = null;
exports.Environment = _Environment.instance;
