import { join, parse } from "path"

import Helper from "./impl/Helper";
import { FixEngineConfig } from "./core/Defines";
const PACKAGE_NAME = "fix_engine";
export class HelperImpl extends Helper {

    get creatorVerion() {
        return Editor.App.version
    }

    /**@description creator 安所路径 */
    private _path: string | null = null;
    get creatorPath() {
        if (this._path) {
            return this._path;
        }
        this._path = Editor.App.path;
        //D:\Creator\Creator\3.1.0\resources\app.asar
        //window : D:\CocosCreator\2.1.2\CocosCreator.exe --path
        //mac : Applications/CocosCreator/Creator/2.4.3/CocosCreator.app/Contents/MacOS --path
        let parser = parse(this._path);
        this._path = parser.dir;
        return this._path;
    }

    constructor() {
        super();
        this.userVersion = this.creatorVerion;
    }

    private userVersion: string = "2.4.7";

    protected get customEnginePath() {
        return join(this.projPath, `engine/${this.userVersion}/customEngine`);
    }

    async syncCustomToEngine() {
        try {
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
                this.userVersion = this.creatorVerion;
                // 保存引擎的md5到自定义
            } else {
                Editor.error(`不支持的引擎版本:${this.creatorVerion}`);
            }
        } catch (error) {
            this.logger.error(error);
            this.userVersion = this.creatorVerion;
        }
    }
}
const helper = new HelperImpl();
helper.logger = Editor;
export default helper;


function onBuildStart(options: BuildOptions, callback: Function) {
    if (helper.isSupportUpdate(options.platform)) {
        Editor.error(`请先执行【项目工具】->【引擎修正】->【同步自定义引擎】同步对引擎的修改，再构建，保证热更新部分能正常运行`);
    }
    callback();
}

function onBuildFinished(options: BuildOptions, callback: Function) {
    callback();
}


export function load() {
    Editor.Builder.on('build-start', onBuildStart);
    Editor.Builder.on('build-finished', onBuildFinished);
}

export function unload() {
    Editor.Builder.removeListener('build-start', onBuildStart);
    Editor.Builder.removeListener('build-finished', onBuildFinished);
}

export const messages = {
    open_panel: () => {
        Editor.Panel.open("fix_engine")
    },
    creatorVersion: (ev: any) => {
        try {
            ev.reply(null, helper.creatorVerion);
        } catch (error) {
            helper.logger.error(error);
        }
    },
    supportVersion: (ev: any) => {
        try {
            ev.reply(null, helper.supportVersions.join(" | "));
        } catch (error) {
            helper.logger.error(error);
        }
    },
    creatorPath: (ev: any) => {
        try {
            ev.reply(null, helper.creatorPath);
        } catch (error) {
            helper.logger.error(error);
        }
    },
    getConfig: (ev: any) => {
        try {
            helper.read(true);
            ev.reply(null, helper.data);
        } catch (error) {
            helper.logger.error(error);
        }
    },
    saveConfig: (ev: any, data: FixEngineConfig) => {
        try {
            helper.data = data;
            helper.save();
            // ev.reply(null);
        } catch (error) {
            helper.logger.error(error);
        }
    },
    restoreDefault: (ev: any) => {
        try {
            helper.data = helper.defaultData;
            helper.save();
            ev.reply(null, helper.data);
        } catch (error) {
            helper.logger.error(error);
        }
    },
    onEngineBackup: async (ev: any) => {
        try {
            await helper.backupEngine();
            ev.reply(null, true);
        } catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
    onEngineRestore: async (ev: any) => {
        try {
            await helper.restoreEngine();
            ev.reply(null, true);
        } catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
    onSyncEngineToCustom: async (ev: any) => {
        try {
            await helper.syncEngineToCustom();
            ev.reply(null, true);
        } catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
    onSyncCustomToEngine: async (ev: any) => {
        try {
            await helper.syncCustomToEngine();
            ev.reply(null, true);
        } catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
    checkBackupEngine: (ev: any) => {
        try {
            const isBackup = helper.checkBackupEngine();
            ev.reply(null, isBackup);
        } catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    }
}