import { AssetInfo } from "./core/Defines";
import Helper from "./impl/Helper";
import BuilderHelper from "./core/BuilderHelper"

const PACKAGE_NAME = 'png-compress';
export interface MyView {
    isProcessing: boolean;
    progress: number;
    buildAssetsDir: string;
}

export default class HelperImpl extends Helper{

    set dest(v) {
        this._dest = v;
        BuilderHelper.instance.read();
        BuilderHelper.instance.data!.dest = v;
        BuilderHelper.instance.save();
    }
    get dest(){
        BuilderHelper.instance.read();
        return BuilderHelper.instance.data!.dest;
    }

    set platform(v) {
        this._platform = v;
        BuilderHelper.instance.read();
        BuilderHelper.instance.data!.platform = v;
        BuilderHelper.instance.save();
    }
    get platform(){
        BuilderHelper.instance.read();
        return BuilderHelper.instance.data!.platform;
    }

    protected onStartCompress(){
        Editor.Message.send(PACKAGE_NAME,"onStartCompress");
    }

    protected onSetBuildDir(path:string){
        Editor.Message.send(PACKAGE_NAME, "onSetBuildDir", path);
    }

    protected onUpdateProgess(percent : number){
        Editor.Message.send(PACKAGE_NAME, "updateProgess", percent)
    }

    protected onPngCompressComplete(dest : string , platfrom : string){
        BuilderHelper.instance.read(true);
        BuilderHelper.instance.data!.dest = dest;
        BuilderHelper.instance.data!.platform = platfrom;
        BuilderHelper.instance.save();
        Editor.Message.send("hotupdate","onPngCompressComplete",dest,platfrom);
    }

    protected async getAllAssets() : Promise<AssetInfo[]>{
        return await Editor.Message.request("asset-db", "query-assets") as any;
    }
}

export const helper = new HelperImpl();