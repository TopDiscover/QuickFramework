import { SpriteFrame } from "cc";
import { Logic } from "../../../scripts/common/base/Logic";
import { LogicType, LogicEvent, LogicEventData } from "../../../scripts/common/event/LogicEvent";
import { ResourceLoaderError } from "../../../scripts/framework/assetManager/ResourceLoader";
import { ResourceData } from "../../../scripts/framework/base/Defines";
import { registerTypeManager } from "../../../scripts/framework/base/RegisterTypeManager";
import { Manager } from "../../../scripts/framework/Framework";
import LoadTestView from "./view/LoadTestView";

class LoadTestLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
    }

    protected get bundle() {
        return "loadTest";
    }

    private onEnterGame(data:any) {
        if (data == this.bundle) {
            //游戏数据初始化
            //加载资源
            this._loader.loadResources();
        }else{
           
            //卸载资源
            this._loader.unLoadResources();
        }
    }

    /**@description 进入的模块只要不是自己的模块，需要把自己加载的资源卸载 */
    onEnterComplete(data: LogicEventData) {
        super.onEnterComplete(data);
        //关闭房间列表
        if ( data.type == this.logicType ){
            
        }
        else{
            //移除网络组件 
            //this.removeNetComponent();
            //卸载资源
            this._loader.unLoadResources();
        }
    }

    protected onLoadResourceComplete( err : ResourceLoaderError ){
        if ( err == ResourceLoaderError.LOADING ){
            return;
        }
        log(`${this.bundle}资源加载完成!!!`);
        super.onLoadResourceComplete(err);
        Manager.uiManager.open({ type: LoadTestView ,bundle:this.bundle});
    }

    protected getLoadResources():ResourceData[]{
        // return [];
        return [{ dir: "texture/sheep" , bundle : this.bundle,type : SpriteFrame}];
    }
}

registerTypeManager.registerLogicType(LoadTestLogic);