import { join, parse } from "path";
import Helper from "./impl/Helper";
import { FixEngineConfig } from "./core/Defines";

const PACKAGE_NAME = "fix_engine"

export class _Helper extends Helper {

    get creatorVerion(){
        return Editor.App.version;
    }

    private _path: string | null = null;
    get creatorPath(){
        if (this._path) {
            return this._path;
        }
        this._path = Editor.App.path;
        //windows :  D:\Creator\Creator\3.1.0\resources\app.asar
        //mac : /Applications/CocosCreator/Creator/3.3.1/CocosCreator.app/Contents/Resources/app.asar --path
        let parser = parse(this._path);
        this._path = parser.dir;
        return this._path;
    }

    private userVersion: string = "3.7.2";

    protected get customEnginePath() {
        return join(this.projPath, `engine/${this.userVersion}/customEngine`);
    }

    async syncCustomToEngine() {
        try {
            this.userVersion = this.creatorVerion;
            if (this.isSupport(this.creatorVerion)) {
                // 先获取 自定义的md5
                const customMd5 = this.readMd5(false);
                if (!customMd5) {
                    this.logger.error(`自定义引擎不存在，请先同步自定义引擎到引擎`);
                    return;
                }
                if (Object.keys(customMd5).length == 0) {
                    this.logger.warn(`自定义引擎为空，使用通用版本2.4.7`);
                    this.userVersion = "2.4.7";
                }
                await super.syncCustomToEngine();
                // 保存引擎的md5到自定义
            } else {
                this.logger.error(`不支持的引擎版本:${this.creatorVerion}`);
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
}
const helper = new _Helper();
export default helper;

/**
* @en 
* @zh 为扩展的主进程的注册方法
*/
export const methods = {
    open_panel() {
        Editor.Panel.open(PACKAGE_NAME);
    },
    onBeforeBuild() {
        // if (Impl.isUpdate) {
        //     console.error(`请先执行【项目工具】->【引擎修正】同步对引擎的修改，再构建!!!`);
        // }
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
};

/**
* @en Hooks triggered after extension loading is complete
* @zh 扩展加载完成后触发的钩子
*/
export const load = function () {
    console.log(`加载${PACKAGE_NAME}`);
};

/**
* @en Hooks triggered after extension uninstallation is complete
* @zh 扩展卸载完成后触发的钩子
*/
export const unload = function () {
    console.log(`卸载${PACKAGE_NAME}`);
};