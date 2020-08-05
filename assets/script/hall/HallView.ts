import UIView from "../framework/ui/UIView";
import { HALL } from "../common/base/ResPath";
import { dispatchEnterComplete, LogicType } from "../common/event/LogicEvent";
import { gameManager } from "../common/manager/GameManager";
import { GameConfig } from "../common/base/HotUpdate";
import { HallEvent } from "./HallEvent";
import { language } from "../framework/base/Language";
import { LanguageCN } from "../common/language/LanguageCN";
import { i18n } from "../common/language/LanguageImpl";
import { LobbyService } from "../common/net/LobbyService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallView extends UIView {

    public static getPrefabUrl() {
        return HALL("prefabs/HallView")
    }

    public _count = 10;

    private readonly games = [
        new GameConfig("游戏1","gameOne",1),
        new GameConfig("游戏2","gameTwo",2),
    ];

    onLoad() {
        super.onLoad();

        let nodeGames = cc.find("games",this.node);
        let notice = cc.find("hall_msg_bg/label",this.node).getComponent(cc.Label);
        for( let i = 1 ; i <= 6 ; i++ ){
            let game = cc.find(`game_${i}`,nodeGames);
            if ( i -1 < this.games.length ){
                game.on(cc.Node.EventType.TOUCH_END,()=>{
                    gameManager().enterGame(this.games[i-1]);
                });
            }else{
                game.on(cc.Node.EventType.TOUCH_END,()=>{
                    this._count ++;
                    let ret = this._count % 2;
                    ret = Math.floor(ret);
                    if ( ret == 0 ){
                        language().change("zh");
                    }else{
                        language().change("en");
                    }
                    
                    //notice.string = language().get("test",this._count,100,200,300);
                    notice.string = String.format(i18n.test,this._count,100,200,300);
                });
            }
        }
        dispatchEnterComplete({ type: LogicType.HALL, views: [this] });

        //语言适配
        this.adaptLanguage();

        this.scheduleOnce(() => {
            language().change('en');
            this.adaptLanguage();
        }, 2.5);

        this.scheduleOnce(() => {
            language().change('zh');
            this.adaptLanguage();
        }, 5);

        //根据自己的需要，连接网络
        //LobbyService.instance.connect("www.baidu.com");

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
