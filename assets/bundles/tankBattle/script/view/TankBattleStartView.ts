import UIView from "../../../../scripts/framework/ui/UIView";
import { LogicEvent } from "../../../../scripts/common/event/LogicEvent";
import { TankBettle } from "../data/TankBattleGameData";
import { _decorator,Node, find, Label, Vec3, EventKeyboard, macro } from "cc";
import { Manager } from "../../../../scripts/framework/Framework";

const { ccclass, property } = _decorator;

@ccclass
export default class TankBattleStartView extends UIView{

    public static getPrefabUrl() {
        return "prefabs/TankBattleStartView";
    }

    /**@description 选择模式的小坦克 */
    private selectTank: Node = null!;
    /**@description 单人 */
    private singlePlayer: Node = null!;
    /**@description 多人 */
    private doublePalyers: Node = null!;

    private get data(){
        return TankBettle.gameData;
    }

    protected bindingEvents(){
        super.bindingEvents();
        this.registerEvent(TankBettle.EVENT.SHOW_MAP_LEVEL,this.onChangeStageFinished)
    }

    onLoad() {
        super.onLoad();
        this.content = find("content", this.node) as Node;
        let title = find("title", this.content)?.getComponent(Label) as Label;
        title.language = Manager.makeLanguage("title", this.bundle);
        this.singlePlayer = find("player", this.content) as Node;
        (this.singlePlayer.getComponent(Label) as Label).language = Manager.makeLanguage("player", this.bundle);
        this.doublePalyers = find("players", this.content) as Node;
        (this.doublePalyers.getComponent(Label) as Label).language = Manager.makeLanguage("players", this.bundle);
        let tips = find("tips", this.content)?.getComponent(Label) as Label;
        tips.language = Manager.makeLanguage("tips", this.bundle);
        this.selectTank = find("tank", this.content) as Node;
        this.selectTank.setPosition(new Vec3(this.selectTank.position.x,this.singlePlayer.position.y,this.selectTank.position.z));
        this.setEnabledKeyBack(true);
    }

    protected onKeyBack(ev: EventKeyboard) {
        super.onKeyBack(ev);
        dispatch(LogicEvent.ENTER_HALL);
    }

    protected onKeyUp(ev: EventKeyboard) {
        super.onKeyUp(ev);
        if( this.data.gameStatus != TankBettle.GAME_STATUS.SELECTED ){
            return;
        }
        if (ev.keyCode == macro.KEY.down || ev.keyCode == macro.KEY.up ) {
            let isSingle = false;
            if (this.selectTank.position.y == this.singlePlayer.position.y) {
                this.selectTank.setPosition(new Vec3(this.selectTank.position.x,this.doublePalyers.position.y,this.selectTank.position.z));
            }else{
                this.selectTank.setPosition(new Vec3(this.selectTank.position.x,this.singlePlayer.position.y,this.selectTank.position.z));
                isSingle = true;
            }
            this.data.isSingle = isSingle;
        }else if( ev.keyCode == macro.KEY.space || ev.keyCode == macro.KEY.enter ){
            this.data.isSingle = this.data.isSingle;
            this.data.enterGame();
        }
    }

    protected onChangeStageFinished(){
        this.close();
    }
}
