import { parse } from "path"

import Helper from "./impl/Helper";

export class HelperImpl extends Helper {

    protected get creatorVerion() {
        return Editor.versions.CocosCreator;
    }

    /**@description creator 安所路径 */
    private _path: string | null = null;
    protected get creatorPath() {
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


function onBuildStart(options: BuildOptions, callback: Function) {
    if (helper.isUpdate) {
        Editor.error(`请先执行【项目工具】->【引擎修正】同步对引擎的修改，再构建!!!`);
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
    fix_engine: () => {
        helper.run();
    }
}