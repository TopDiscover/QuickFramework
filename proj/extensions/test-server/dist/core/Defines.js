"use strict";
/**
 * @description 项目扩展声明
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Extensions = exports.CmdType = void 0;
var CmdType;
(function (CmdType) {
    /**@description 拉取 Bunldes 代码 */
    CmdType["GitBundles"] = "-gitBundles";
    /**@description 安装依赖 */
    CmdType["Depend"] = "-depend";
    /**@description 链接Bundles代码 */
    CmdType["Sync"] = "-sync";
    /**@description 链接扩展插件代码 */
    CmdType["Extensions"] = "-extensions";
    /**@description 引擎修改 */
    CmdType["FixEngine"] = "-fixEngine";
    /**@description Gulp 压缩 */
    CmdType["Gulp"] = "-gulp";
})(CmdType = exports.CmdType || (exports.CmdType = {}));
var Extensions;
(function (Extensions) {
    /**@description 资源引用检查，目录只对2.x有效,可能兼容上有问题，后续不再维护 */
    Extensions["CheckResources"] = "check_resources";
    /**@description 引擎修正 */
    Extensions["FixEngine"] = "fix_engine";
    /**@description Gulp 压缩 */
    Extensions["GulpCompress"] = "gulp-compress";
    /**@description 热更新 */
    Extensions["Hotupdate"] = "hotupdate";
    /**@description 图个压缩 */
    Extensions["PngCompress"] = "png-compress";
    /**@description 测试服务器 */
    Extensions["TestServer"] = "test-server";
})(Extensions = exports.Extensions || (exports.Extensions = {}));
