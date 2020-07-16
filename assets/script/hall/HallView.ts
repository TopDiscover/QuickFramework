import UIView from "../framework/ui/UIView";
import { HALL } from "../common/base/ResPath";
import { dispatchEnterComplete, LogicType } from "../common/event/LogicEvent";
import { gameManager } from "../common/manager/GameManager";
import { GameConfig } from "../common/base/HotUpdate";
import { HallEvent } from "./HallEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallView extends UIView {

    public static getPrefabUrl() {
        return HALL("prefabs/HallView")
    }

    private readonly games = [
        new GameConfig("游戏1","gameOne",1),
        new GameConfig("游戏2","gameTwo",2),
    ];

    onLoad() {
        super.onLoad();
        let nodeGames = cc.find("games",this.node);
        let notice = cc.find("hall_msg_bg/content",this.node).getComponent(cc.Label);
        for( let i = 1 ; i <= 6 ; i++ ){
            let game = cc.find(`game_${i}`,nodeGames);
            if ( i -1 < this.games.length ){
                game.on(cc.Node.EventType.TOUCH_END,()=>{
                    gameManager().enterGame(this.games[i-1]);
                });
            }else{
                game.on(cc.Node.EventType.TOUCH_END,()=>{
                    let title = cc.find("Background/name",game).getComponent(cc.Label);
                    notice.string = `【${title.string}】未实现，更多功能，敬请期待!!!`;
                });
            }
        }
        dispatchEnterComplete({ type: LogicType.HALL, views: [this] });
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
