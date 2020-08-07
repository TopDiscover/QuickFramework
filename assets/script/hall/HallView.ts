import UIView from "../framework/ui/UIView";
import { dispatchEnterComplete, LogicType } from "../common/event/LogicEvent";
import { gameManager } from "../common/manager/GameManager";
import { GameConfig } from "../common/base/HotUpdate";
import { HallEvent } from "./HallEvent";
import { language } from "../framework/base/Language";
import { i18n } from "../common/language/LanguageImpl";
import { LobbyService } from "../common/net/LobbyService";
import { injectService } from "../framework/decorator/Decorators";
import { IController } from "../framework/controller/Controller";
import { UpdateMoney } from "./HallMessage";

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

    onLoad() {
        super.onLoad();

        let nodeGames = cc.find("games",this.node);
        let item = cc.find("gameItem",this.node);

        let notice = cc.find("hall_msg_bg/label",this.node).getComponent(cc.Label);
        for( let i = 1 ; i <= 6 ; i++ ){
            let game = cc.instantiate(item);
            game.name = `game_${i}`;
            game.active = true;
            cc.find("Background/label",game).getComponent(cc.Label).language = [`i18n.hall_view_game_name.${i-1}`];
            nodeGames.addChild(game);
            if ( i -1 < this.games.length ){
                game.on(cc.Node.EventType.TOUCH_END,()=>{
                    gameManager().enterGame(this.games[i-1]);
                });
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
                    let ret = this._count % 2;
                    ret = Math.floor(ret);
                    notice.language = "i18n.hall_view_broadcast_content";
                    //notice.language = ["i18n.test",this._count,100,200,300];
                    //notice.language = null;
                    //notice.string = i18n.test;

                    if ( ret == 0 ){
                        language().change("zh");
                    }else{
                        language().change("en");
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
         this.registerEvent(HallEvent.DOWNLOAD_PROGRESS,this.onDownloadProgess);
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
