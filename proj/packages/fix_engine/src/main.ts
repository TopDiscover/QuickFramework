import { parse } from "path"

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
}
const helper = new HelperImpl();
helper.logger = Editor;
export default helper;


function onBuildStart(options: BuildOptions, callback: Function) {
    // if (helper.isUpdate) {
    //     Editor.error(`请先执行【项目工具】->【引擎修正】同步对引擎的修改，再构建!!!`);
    // }
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
    onEngineBackup: (ev: any) => {
        try {
            helper.backupEngine();
            ev.reply(null, true);
        } catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
    onEngineRestore: (ev: any) => {
        try {
            helper.restoreEngine();
            ev.reply(null, true);
        } catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
    onSyncEngineToCustom: (ev: any) => {
        try {
            helper.syncEngineToCustom();
            ev.reply(null, true);
        } catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
    onSyncCustomToEngine: (ev: any) => {
        try {
            helper.syncCustomToEngine();
            ev.reply(null, true);
        } catch (error) {
            helper.logger.error(error);
            ev.reply(null, false);
        }
    },
}