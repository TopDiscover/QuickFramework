import UIView from "../../../../scripts/framework/core/ui/UIView";
import { TankBettle } from "../data/TankBattleGameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBattleStartView extends UIView {
    get data() {
        return TankBettle.gameData;
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

    protected addEvents() {
        super.addEvents();
        this.addUIEvent(TankBettle.EVENT.SHOW_MAP_LEVEL, this.onChangeStageFinished)
    }

    onLoad() {
        super.onLoad();
        this.content = cc.find("content", this.node);

        cc.find("title", this.content).getComponent(cc.Label).language = Manager.makeLanguage("title", this.bundle);
        this.singlePlayer = cc.find("player", this.content);
        this.singlePlayer.getComponent(cc.Label).language = Manager.makeLanguage("player", this.bundle);
        this.doublePalyers = cc.find("players", this.content);
        this.doublePalyers.getComponent(cc.Label).language = Manager.makeLanguage("players", this.bundle);
        cc.find("tips", this.content).getComponent(cc.Label).language = Manager.makeLanguage("tips", this.bundle);
        this.selectTank = cc.find("tank", this.content);
        this.selectTank.y = this.singlePlayer.y;

        this.setEnabledKeyBack(true);
    }

    onKeyBack(ev: cc.Event.EventKeyboard) {
        super.onKeyBack(ev);
        dispatch(td.Logic.Event.ENTER_HALL);
    }

    onKeyUp(ev: cc.Event.EventKeyboard) {
        super.onKeyUp(ev);
        if (this.data.gameStatus != TankBettle.GAME_STATUS.SELECTED) {
            return;
        }
        if (ev.keyCode == cc.macro.KEY.down || ev.keyCode == cc.macro.KEY.up) {
            let isSingle = false;
            if (this.selectTank.y == this.singlePlayer.y) {
                this.selectTank.y = this.doublePalyers.y;
            } else {
                this.selectTank.y = this.singlePlayer.y;
                isSingle = true;
            }
            this.data.isSingle = isSingle;
        } else if (ev.keyCode == cc.macro.KEY.space || ev.keyCode == cc.macro.KEY.enter) {
            this.data.isSingle = this.data.isSingle;
            this.data.enterGame();
        }
    }

    protected onChangeStageFinished() {
        this.close();
    }
}
