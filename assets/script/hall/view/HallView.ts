import UIView from "../../framework/ui/UIView";
import { injectService } from "../../framework/decorator/Decorators";
import { LobbyService } from "../../common/net/LobbyService";
import { IController } from "../../framework/controller/Controller";
import { GameConfig } from "../../common/base/HotUpdate";
import { i18n } from "../../common/language/LanguageImpl";
import { UpdateMoney } from "../protocol/HallMessage";
import { dispatchEnterComplete, LogicType } from "../../common/event/LogicEvent";
import { Manager } from "../../common/manager/Manager";
import { CommonEvent } from "../../common/event/CommonEvent";

const { ccclass, property } = cc._decorator;

@ccclass
@injectService(LobbyService.instance)
export default class HallView extends UIView implements IController<LobbyService>{

    public static getPrefabUrl() {
        return "hall/prefabs/HallView";
    }

    service : LobbyService = null;

    public _count = 10;

    private readonly games = [
        new GameConfig(i18n.hall_view_game_name[0],"gameOne",1),
        new GameConfig(i18n.hall_view_game_name[1],"gameTwo",2),
        new GameConfig(i18n.hall_view_game_name[2],"tankBattle",3)
    ];

    private onClick( ev : cc.Event.EventTouch ){
        Manager.gameManager.enterGame(this.games[ev.target.userData]);
    }

    onLoad() {
        super.onLoad();

        let nodeGames = cc.find("games",this.node);
        let item = cc.find("gameItem",this.node);

        let notice = cc.find("hall_msg_bg/label",this.node).getComponent(cc.Label);
        for( let i = 1 ; i <= 6 ; i++ ){
            let game = cc.instantiate(item);
            game.name = `game_${i}`;
            game.active = true;
            game.userData = i-1
            cc.find("Background/label",game).getComponent(cc.Label).language = Manager.makeLanguage(`hall_view_game_name.${i-1}`);
            nodeGames.addChild(game);
            if ( i -1 < this.games.length ){
                game.on(cc.Node.EventType.TOUCH_END,this.onClick,this);
                //删除
                //game.off(cc.Node.EventType.TOUCH_END,this.onClick,this)
            }else if( i == 6 ){
                game.on(cc.Node.EventType.TOUCH_END,()=>{
                    //websocket测试
                    let msg = new UpdateMoney();
                    this.service.send(msg);
                });
            }
            else{
                game.on(cc.Node.EventType.TOUCH_END,()=>{
                    this._count ++;
                    //notice.language = "i18n.hall_view_broadcast_content";
                    notice.language = Manager.makeLanguage(["test",this._count,100,200,300]);
                    //notice.language = null;
                    //notice.string = i18n.test;

                    if ( Manager.language.getLanguage() == cc.sys.LANGUAGE_ENGLISH ){
                        Manager.language.change(cc.sys.LANGUAGE_CHINESE);
                    }else{
                        Manager.language.change(cc.sys.LANGUAGE_ENGLISH);
                    }
                });
            }
        }
        dispatchEnterComplete({ type: LogicType.HALL, views: [this] });

        //根据自己的需要，连接网络
        LobbyService.instance.connect("echo.websocket.org");
    }

     bindingEvents(){
         super.bindingEvents();
         this.registerEvent(CommonEvent.DOWNLOAD_PROGRESS,this.onDownloadProgess);
     }
     
     private onDownloadProgess( data : { progress: number, config: GameConfig }){

        let progressBar : cc.ProgressBar = cc.find(`games/game_${data.config.index}/Background/progressBar`,this.node).getComponent(cc.ProgressBar);
        let progressLabel : cc.Label = cc.find(`games/game_${data.config.index}/Background/progressBar/progress`,this.node).getComponent(cc.Label);
        if ( data.progress == -1 ){
            progressBar.node.active = false;
        }else if ( data.progress < 1 ){
            progressBar.node.active = true;
            progressBar.progress = data.progress;
            progressLabel.string = "" + Math.floor(data.progress * 100) + "%";
        }else{
            progressBar.node.active = false;
        }
     }
}
