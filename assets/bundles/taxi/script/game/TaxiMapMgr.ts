import { _decorator, Component, Node, Prefab, instantiate } from "cc";
import { TaxiMap } from "./TaxiMap";
const { ccclass, property } = _decorator;

@ccclass("TaxiMapMgr")
export class TaxiMapMgr extends Component {
    public currPath: Node[] = [];
    public maxProgress = 0;

    private _currMap: TaxiMap = null!;
    public resetMap(){
        this.currPath = this._currMap.path;
        this.maxProgress = this._currMap.maxProgress;
    }

    public recycle(){
        if ( this._currMap ){
            this._currMap.node.destroy();
            this._currMap = null as any;
        }
    }

    private buildMap( prefab : Prefab ){
        let node = instantiate(prefab);
        Manager.uiManager.root3D.addChild(node);
        this._currMap = node.getComponent(TaxiMap) as TaxiMap;
        this._buildPath();
    }

    private _buildPath(){
        this.resetMap();
    }

    loadMap(id: any,onComplete:(data:Prefab | null)=>void,onProgress:(finish:number,total:number)=>void) {
        loadRes({
            bundle : Manager.gameView?.bundle,
            url : `prefabs/map/map${id}`,
            type : Prefab,
            view : Manager.gameView as UIView,
            onComplete : (data)=>{
                if ( data.data && data.data instanceof Prefab ){
                    this.buildMap(data.data);
                    onComplete(data.data);
                    return;
                }
                onComplete(null);
            },
            onProgress : (finish,total,item)=>{
                onProgress(finish,total);
            }
        })
    }
}
