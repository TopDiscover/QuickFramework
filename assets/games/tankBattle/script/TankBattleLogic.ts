import { Logic } from "../../../script/common/base/Logic";
import { LogicType, LogicEvent, LogicEventData } from "../../../script/common/event/LogicEvent";
import TankBattleGameView from "./TankBattleGameView";
import { TANK_BUNDLE } from "./TankConfig";
import { ResourceData } from "../../../script/framework/base/Defines";
import { LobbyService } from "../../../script/common/net/LobbyService";
import { ResourceLoaderError } from "../../../script/framework/assetManager/ResourceLoader";
import { TANK_LAN_ZH } from "./TankLanguageZH";
import { TANK_LAN_EN } from "./TankLanguageEN";
import { i18n } from "../../../script/common/language/LanguageImpl";
import { Manager } from "../../../script/common/manager/Manager";

class GameTwoLogic extends Logic {

    logicType: LogicType = LogicType.GAME;

    onLoad() {
        super.onLoad();
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(LogicEvent.ENTER_GAME, this.onEnterGame);
        this.registerEvent(LogicEvent.ENTER_ROOM_LIST,this.onEnterRoomList);
    }

    protected getGameName() {
        return TANK_BUNDLE;
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

    private onEnterRoomList(){

    }

    protected onLoadResourceComplete( err : ResourceLoaderError ){
        if ( err == ResourceLoaderError.LOADING ){
            return;
        }
        cc.log(`${TANK_BUNDLE}资源加载完成!!!`);
        super.onLoadResourceComplete(err);
        //加载完成，恢复网络
        LobbyService.instance.resumeMessageQueue();
        Manager.uiManager.open({ type: TankBattleGameView ,bundle:this.getGameName()});
    }

    private onEnterGame(data) {
        if (data == this.getGameName()) {

            //子游戏语言包初始化
            if ( Manager.language.getLanguage())

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
        return [{ preloadView: TankBattleGameView , bundle : this.getGameName()}];
    }

    protected onLanguageChange(){
        let lan = TANK_LAN_ZH;
        if ( Manager.language.getLanguage() == TANK_LAN_EN.language ){
            lan = TANK_LAN_EN;
        }
        i18n[`${this.getGameName()}`] = {};
        i18n[`${this.getGameName()}`] = lan.data;
    }
}

Manager.logicManager.push(GameTwoLogic);