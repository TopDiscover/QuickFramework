"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.HelperImpl = void 0;
exports.load = load;
exports.unload = unload;
const path_1 = require("path");
const Helper_1 = __importDefault(require("./impl/Helper"));
const PACKAGE_NAME = "fix_engine";
class HelperImpl extends Helper_1.default {
    constructor() {
        super(...arguments);
        /**@description creator 安所路径 */
        this._path = null;
        this.userVersion = "2.4.7";
    }
    get creatorVerion() {
        return Editor.App.version;
    }
    get creatorPath() {
        if (this._path) {
            return this._path;
        }
        this._path = Editor.App.path;
        //D:\Creator\Creator\3.1.0\resources\app.asar
        //window : D:\CocosCreator\2.1.2\CocosCreator.exe --path
        //mac : Applications/CocosCreator/Creator/2.4.3/CocosCreator.app/Contents/MacOS --path
        let parser = (0, path_1.parse)(this._path);
        this._path = parser.dir;
        return this._path;
    }
    get customEnginePath() {
        return (0, path_1.join)(this.projPath, `engine/${this.userVersion}/customEngine`);
    }
    async syncCustomToEngine() {
        try {
            this.userVersion = this.creatorVerion;
            if (this.isSupport(this.creatorVerion)) {
                // 先获取 自定义的md5
                const customMd5 = this.readMd5(false);
                if (!customMd5) {
                    Editor.error(`自定义引擎不存在，请先同步自定义引擎到引擎`);
                    return;
                }
                if (Object.keys(customMd5).length == 0) {
                    Editor.warn(`自定义引擎为空，使用通用版本2.4.7`);
                    this.userVersion = "2.4.7";
                }
                await super.syncCustomToEngine();
                // 保存引擎的md5到自定义
            }
            else {
                Editor.error(`不支持的引擎版本:${this.creatorVerion}`);
            }
        }
        catch (error) {
            this.logger.error(error);
        }
    }
}
exports.HelperImpl = HelperImpl;
const helper = new HelperImpl();
helper.logger = Editor;
exports.default = helper;
function onBuildStart(options, callback) {
    // if (helper.isUpdate) {
    //     Editor.error(`请先执行【项目工具】->【引擎修正】同步对引擎的修改，再构建!!!`);
    // }
    callback();
}
function onBuildFinished(options, callback) {
    callback();
}
function load() {
    Editor.Builder.on('build-start', onBuildStart);
    Editor.Builder.on('build-finished', onBuildFinished);
}
function unload() {
    Editor.Builder.removeListener('build-start', onBuildStart);
    Editor.Builder.removeListener('build-finished', onBuildFinished);
}
exports.messages = {
    open_panel: () => {
        Editor.Panel.open("fix_engine");
    },
    creatorVersion: (ev) => {
        try {
            ev.reply(null, helper.creatorVerion);
        }
        catch (error) {
            helper.logger.error(error);
        }
    },
    creatorPath: (ev) => {
        try {
            ev.reply(null, helper.creatorPath);
        }
        catch (error) {
            helper.logger.error(error);
        }
    },
    getConfig: (ev) => {
        try {
            helper.read(true);
            ev.reply(null, helper.data);
        }
        catch (error) {
            helper.logger.error(error);
        }
    },
    saveConfig: (ev, data) => {
        try {
            helper.data = data;
            helper.save();
            // ev.reply(null);
        }
        catch (error) {
            helper.logger.error(error);
        }
    },
    restoreDefault: (ev) => {
        try {
            helper.data = helper.defaultData;
            helper.save();
            ev.reply(null, helper.data);
        }
        catch (error) {
            helper.logger.error(error);
        }
    },
    onEngineBackup: async (ev) => {
        try {
            await helper.backupEngine();
            ev.reply(null, true);
        }
        catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
    onEngineRestore: async (ev) => {
        try {
            await helper.restoreEngine();
            ev.reply(null, true);
        }
        catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
    onSyncEngineToCustom: async (ev) => {
        try {
            await helper.syncEngineToCustom();
            ev.reply(null, true);
        }
        catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
    onSyncCustomToEngine: async (ev) => {
        try {
            await helper.syncCustomToEngine();
            ev.reply(null, true);
        }
        catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
};
