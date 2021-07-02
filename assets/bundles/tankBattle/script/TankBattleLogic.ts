import { Logic } from "../../../scripts/common/base/Logic";
import { LogicType, LogicEvent, LogicEventData } from "../../../scripts/common/event/LogicEvent";
import { ResourceData } from "../../../scripts/framework/base/Defines";
import { LobbyService } from "../../../scripts/common/net/LobbyService";
import { ResourceLoaderError } from "../../../scripts/framework/assetManager/ResourceLoader";
import TankBattleGameView from "./view/TankBattleGameView";
import { TankBettle } from "./data/TankBattleGameData";
import { TankBattleLanguage } from "./data/TankBattleLanguage";
import { Manager } from "../../../scripts/framework/Framework";
import { registerTypeManager } from "../../../scripts/framework/base/RegisterTypeManager";

/**
 * @description 坦克大战Logic 
 * 1，处理LogicEvent的事件
 * 2，
 */
class TankBattleLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    language = new TankBattleLanguage;
    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
        this.registerEvent(LogicEvent.ENTER_ROOM_LIST,this.onEnterRoomList);
    }

    protected get bundle() {
        return TankBettle.gameData.bundle;
    }

    public onEnterComplete( data : LogicEventData ){
        super.onEnterComplete(data);
        if( data.type == this.logicType ){

        }else{
            //删除子包的语言包
            Manager.language.removeSourceDelegate(this.language);
            //移除网络组件
            this.removeNetComponent();
            //卸载资源
            this._loader.unLoadResources();
        }
    }

    private onEnterRoomList(data:any){
        //打开自己的子游戏房间列表
    }

    protected onLoadResourceComplete( err : ResourceLoaderError ){
        if ( err == ResourceLoaderError.LOADING ){
            return;
        }
        log(`${this.bundle}资源加载完成!!!`);
        super.onLoadResourceComplete(err);
        //加载完成，恢复网络
        LobbyService.instance.resumeMessageQueue();
        Manager.uiManager.open({ type: TankBattleGameView ,bundle:this.bundle});
    }

    private onEnterGame(data:any) {
        if (data == this.bundle) {

            //游戏数据初始化
            Manager.gameData = TankBettle.gameData;
            Manager.gameData.clear();

            //子游戏语言包初始化
            Manager.language.addSourceDelegate(this.language);

            //添加网络组件
            this.addNetComponent();

            //先暂停网络回调处理，等待资源加载完成后，恢复处理
            LobbyService.instance.pauseMessageQueue();
            //加载资源
            this._loader.loadResources();
        }else{

            //移除网络组件
            this.removeNetComponent();
            //卸载资源
            this._loader.unLoadResources();
        }
    }

    protected getLoadResources(): ResourceData[]{
        return [{ preloadView: TankBattleGameView , bundle : this.bundle}];
    }
}

registerTypeManager.registerLogicType(TankBattleLogic);