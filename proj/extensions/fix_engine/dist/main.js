"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = exports._Helper = void 0;
const path_1 = require("path");
const Helper_1 = __importDefault(require("./impl/Helper"));
const FileUtils_1 = __importDefault(require("./core/FileUtils"));
const PACKAGE_NAME = "fix_engine";
class _Helper extends Helper_1.default {
    get creatorVerion() {
        return Editor.App.version;
    }
    get creatorPath() {
        if (this._path) {
            return this._path;
        }
        this._path = Editor.App.path;
        //windows :  D:\Creator\Creator\3.1.0\resources\app.asar
        //mac : /Applications/CocosCreator/Creator/3.3.1/CocosCreator.app/Contents/Resources/app.asar --path
        let parser = (0, path_1.parse)(this._path);
        this._path = parser.dir;
        return this._path;
    }
    constructor() {
        super();
        this._path = null;
        this.userVersion = "3.7.2";
        this.userVersion = this.creatorVerion;
    }
    get customEnginePath() {
        return (0, path_1.join)(this.projPath, `engine/${this.userVersion}/customEngine`);
    }
    async syncCustomToEngine() {
        try {
            if (this.isSupport(this.creatorVerion)) {
                // 先获取 自定义的md5
                const customMd5 = this.readMd5(false);
                if (!customMd5) {
                    this.logger.error(`自定义引擎不存在，请先同步自定义引擎到引擎`);
                    return;
                }
                if (Object.keys(customMd5).length == 0) {
                    if (this.creatorVerion == "3.7.3") {
                        this.logger.warn(`自定义引擎为空，使用通用版本3.7.2`);
                        this.userVersion = "3.7.2";
                    }
                }
                if (this.creatorVerion == "3.8.4") {
                    // 从3.8.3 版本创建连接
                    // 只有 cc.d.ts 不一样，其它都一样，直接创建一个连接
                    let sourceEngine = (0, path_1.join)(this.projPath, "engine/3.8.3/customEngine/resources/3d/engine/native");
                    let destEngine = (0, path_1.join)(this.projPath, `engine/${this.creatorVerion}/customEngine/resources/3d/engine/native`);
                    FileUtils_1.default.instance.symlinkSync(sourceEngine, destEngine);
                }
                await super.syncCustomToEngine();
                this.userVersion = this.creatorVerion;
                // 保存引擎的md5到自定义
            }
            else {
                this.logger.error(`不支持的引擎版本:${this.creatorVerion}`);
            }
        }
        catch (error) {
            this.logger.error(error);
            this.userVersion = this.creatorVerion;
        }
    }
}
exports._Helper = _Helper;
const helper = new _Helper();
exports.default = helper;
/**
* @en
* @zh 为扩展的主进程的注册方法
*/
exports.methods = {
    open_panel() {
        Editor.Panel.open(PACKAGE_NAME);
    },
    onBeforeBuild(options) {
        if (helper.isSupportUpdate(options.platform)) {
            console.warn(`打包平台为 : ${options.platform}，请确保已经执行过【项目工具】->【引擎修正】->【同步自定义引擎】，保证热更新部分能正常运行`);
        }
    },
};
/**
* @en Hooks triggered after extension loading is complete
* @zh 扩展加载完成后触发的钩子
*/
const load = function () {
    console.log(`加载${PACKAGE_NAME}`);
};
exports.load = load;
/**
* @en Hooks triggered after extension uninstallation is complete
* @zh 扩展卸载完成后触发的钩子
*/
const unload = function () {
    console.log(`卸载${PACKAGE_NAME}`);
};
exports.unload = unload;
