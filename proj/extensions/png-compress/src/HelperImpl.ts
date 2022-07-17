import { AssetInfo } from "./core/Defines";
import Helper from "./impl/Helper";

const PACKAGE_NAME = 'png-compress';
export interface MyView {
    isProcessing: boolean;
    progress: number;
    buildAssetsDir: string;
}

export default class HelperImpl extends Helper{
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
        Editor.Message.send("hotupdate","onPngCompressComplete",dest,platfrom);
    }

    protected async getAllAssets() : Promise<AssetInfo[]>{
        return await Editor.Message.request("asset-db", "query-assets") as any;
    }
}

export const helper = new HelperImpl();