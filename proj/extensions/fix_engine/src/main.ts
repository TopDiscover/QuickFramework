import { parse } from "path";
import Helper from "./impl/Helper";

export class _Helper extends Helper {

    protected get creatorVerion(){
        return Editor.App.version;
    }

    private _path: string | null = null;
    protected get creatorPath(){
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
}
const Impl = new _Helper();

/**
* @en 
* @zh 为扩展的主进程的注册方法
*/
export const methods = {
    fixEngine() {
        Impl.run();
    },
    onBeforeBuild() {
        if (Impl.isUpdate) {
            console.error(`请先执行【项目工具】->【引擎修正】同步对引擎的修改，再构建!!!`);
        }
    }
};

/**
* @en Hooks triggered after extension loading is complete
* @zh 扩展加载完成后触发的钩子
*/
export const load = function () {
    console.log("加载fix_engine");
};

/**
* @en Hooks triggered after extension uninstallation is complete
* @zh 扩展卸载完成后触发的钩子
*/
export const unload = function () {
    console.log("卸载fix_engine");
};