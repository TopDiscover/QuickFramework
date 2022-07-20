import Helper from "./impl/Helper";
import BuilderHelper from "./core/BuilderHelper";
import { AssetInfo } from "./core/Defines";
const PACKAGE_NAME = 'png-compress';
export interface MyView {
    isProcessing: boolean;
    progress: number;
    buildAssetsDir: string;
}

class HelperImpl extends Helper{

    constructor(){
        super()
        this.logger = Editor;
    }
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
        Editor.Ipc.sendToPanel(PACKAGE_NAME, "onStartCompress");
    }

    protected onSetBuildDir(path:string){
        Editor.Ipc.sendToPanel(PACKAGE_NAME, "onSetBuildDir", path);
    }

    protected onUpdateProgess(percent : number){
        Editor.Ipc.sendToPanel(PACKAGE_NAME, "updateProgess", percent)
    }

    protected onPngCompressComplete(dest : string , platfrom : string){
        BuilderHelper.instance.read(true);
        BuilderHelper.instance.data!.dest = dest;
        BuilderHelper.instance.data!.platform = platfrom;
        BuilderHelper.instance.save();
        Editor.Ipc.sendToPanel("hotupdate","onPngCompressComplete",{dest:this.dest,platform: this.platform});
    }

    protected async getAllAssets() : Promise<AssetInfo[]>{
        return new Promise<AssetInfo[]>((reslove) => {
            let allRes : AssetInfo[] = [];
            Editor.assetdb.queryAssets(`db://**/*`, [], (err, results) => {
                results.forEach((info: AssetInfo) => {
                    if ( info.type == "texture" && info.uuid ){
                        allRes.push(info);
                    }
                })
                reslove(allRes);
            });
        });
    }
}

export const helper = new HelperImpl();