import UIView from "../../../../script/framework/ui/UIView";
import { LogicEvent } from "../../../../script/common/event/LogicEvent";
import { Manager } from "../../../../script/common/manager/Manager";
import { TankBettle } from "../data/TankBattleGameData";
import { injectPresenter } from "../../../../script/framework/decorator/Decorators";
import { IPresenter } from "../../../../script/framework/base/Presenter";

const { ccclass, property } = cc._decorator;

@ccclass
@injectPresenter(TankBettle.TankBettleGameData)
export default class TankBattleStartView extends UIView implements IPresenter<TankBettle.TankBettleGameData>{
    get presenter(): TankBettle.TankBettleGameData{
        return this.presenterAny;
    }

    public static getPrefabUrl() {
        return "prefabs/TankBattleStartView";
    }

    /**@description 选择模式的小坦克 */
    private selectTank: cc.Node = null;
    /**@description 单人 */
    private singlePlayer: cc.Node = null;
    /**@description 多人 */
    private doublePalyers: cc.Node = null;

    protected bindingEvents(){
        super.bindingEvents();
        this.registerEvent(TankBettle.EVENT.SHOW_MAP_LEVEL,this.onChangeStageFinished)
    }

    onLoad() {
        super.onLoad();
        this.content = cc.find("content", this.node);

        cc.find("title", this.content).getComponent(cc.Label).language = Manager.makeLanguage("title", true);
        this.singlePlayer = cc.find("player", this.content);
        this.singlePlayer.getComponent(cc.Label).language = Manager.makeLanguage("player", true);
        this.doublePalyers = cc.find("players", this.content);
        this.doublePalyers.getComponent(cc.Label).language = Manager.makeLanguage("players", true);
        cc.find("tips", this.content).getComponent(cc.Label).language = Manager.makeLanguage("tips", true);
        this.selectTank = cc.find("tank", this.content);
        this.selectTank.y = this.singlePlayer.y;

        this.setEnabledKeyBack(true);
    }

    protected onKeyBack(ev: cc.Event.EventKeyboard) {
        super.onKeyBack(ev);
        dispatch(LogicEvent.ENTER_HALL);
    }

    protected onKeyUp(ev: cc.Event.EventKeyboard) {
        super.onKeyUp(ev);
        if( this.presenter.gameStatus != TankBettle.GAME_STATUS.SELECTED ){
            return;
        }
        if (ev.keyCode == cc.macro.KEY.down || ev.keyCode == cc.macro.KEY.up ) {
            let isSingle = false;
            if (this.selectTank.y == this.singlePlayer.y) {
                this.selectTank.y = this.doublePalyers.y;
            }else{
                this.selectTank.y = this.singlePlayer.y;
                isSingle = true;
            }
            this.presenter.isSingle = isSingle;
        }else if( ev.keyCode == cc.macro.KEY.space || ev.keyCode == cc.macro.KEY.enter ){
            this.presenter.isSingle = this.presenter.isSingle;
            this.presenter.enterGame();
        }
    }

    protected onChangeStageFinished(){
        this.close();
    }
}
