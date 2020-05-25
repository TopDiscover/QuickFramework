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

    private _oneProgress : cc.ProgressBar;
    private _twoProgress : cc.ProgressBar;

    onLoad() {
        super.onLoad();
        let game = cc.find(`gameOne`, this.node);
        if (game) {
            game.on(cc.Node.EventType.TOUCH_END, () => {
                gameManager().enterGame(new GameConfig("斗地主", "gameOne"));
            })
            this._oneProgress = cc.find("Background/progressBar",game).getComponent(cc.ProgressBar);
        }
        game = cc.find(`gameTwo`, this.node);
        if (game) {
            game.on(cc.Node.EventType.TOUCH_END, () => {
                gameManager().enterGame(new GameConfig("欢乐捕鱼", "gameTwo"));

            })
            this._twoProgress = cc.find("Background/progressBar",game).getComponent(cc.ProgressBar);
        }
        dispatchEnterComplete({ type: LogicType.HALL, views: [this] });
    }

     bindingEvents(){
         super.bindingEvents();
         this.registerEvent(HallEvent.DOWNLOAD_PROGRESS,this.onDownloadProgess);
     }
     
     private onDownloadProgess( data : { progress: number, name: string }){

        let progressBar : cc.ProgressBar = null;
        let progressLabel : cc.Label = null;
        if ( data.name == "gameOne"){
            progressBar = this._oneProgress;
            progressLabel = cc.find("progress",progressBar.node).getComponent(cc.Label);
        }else{
            progressBar = this._twoProgress;
            progressLabel = cc.find("progress",progressBar.node).getComponent(cc.Label);
        }

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
