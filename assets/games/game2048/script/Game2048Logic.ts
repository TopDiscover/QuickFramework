import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent, LogicEventData } from "../../../script/common/event/LogicEvent";
import { ResourceData } from "../../../script/framework/base/Defines";
import { LobbyService } from "../../../script/common/net/LobbyService";
import { ResourceLoaderError } from "../../../script/framework/assetManager/ResourceLoader";
import { Manager } from "../../../script/common/manager/Manager";
import { Game2048 } from "./data/Game2048GameData";
import Game2048GameView from "./view/Game2048GameView";

/**
 * @description 2048Logic 
 * 1，处理LogicEvent的事件
 * 2，
 */
class Game2048Logic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
        this.registerEvent(LogicEvent.ENTER_ROOM_LIST,this.onEnterRoomList);
    }

    protected get bundle() {
        return Game2048.gameData.bundle;
    }

    public onEnterComplete( data : LogicEventData ){
        super.onEnterComplete(data);
        if( data.type == this.logicType ){

        }else{
            //移除网络组件
            this.removeNetComponent();
            //卸载资源
            this._loader.unLoadResources();
        }
    }

    private onEnterRoomList(data){
        //打开自己的子游戏房间列表
    }

    protected onLoadResourceComplete( err : ResourceLoaderError ){
        if ( err == ResourceLoaderError.LOADING ){
            return;
        }
        cc.log(`${this.bundle}资源加载完成!!!`);
        super.onLoadResourceComplete(err);
        //加载完成，恢复网络
        LobbyService.instance.resumeMessageQueue();
        Manager.uiManager.open({ type: Game2048GameView ,bundle:this.bundle});
    }

    private onEnterGame(data) {
        if (data == this.bundle) {

            //游戏数据初始化
            Manager.gameData = Game2048.gameData;
            Manager.gameData.clear();

            //子游戏语言包初始化
            this.onLanguageChange();

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
        return [{ preloadView: Game2048GameView , bundle : this.bundle}];
    }
}

Manager.logicManager.push(Game2048Logic);