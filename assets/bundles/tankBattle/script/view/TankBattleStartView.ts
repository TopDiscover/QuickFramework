import UIView from "../../../../scripts/framework/core/ui/UIView";
import { _decorator,Node, find, Label, Vec3, EventKeyboard, macro } from "cc";
import { Config } from "../../../../scripts/common/config/Config";
import { TankBettle } from "../data/TankBattleConfig";

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
    private logic : TankBattleLogic = null!;

    onLoad() {
        super.onLoad();
        if ( this.args && this.args.length > 0 ){
           this.logic = this.args[0];
        }
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

    onKeyBack(ev: EventKeyboard) {
        super.onKeyBack(ev);
        Manager.entryManager.enterBundle(Config.BUNDLE_HALL);
    }

    onKeyUp(ev: EventKeyboard) {
        super.onKeyUp(ev);
        if(this.logic ){
            this.logic.onKeyUp(ev,TankBettle.ViewType.START_VIEW,this);
        }
    }

    isSingle(){
        return this.selectTank.position.y == this.singlePlayer.position.y;
    }

    updateSelectTank( isSingle : boolean){
        if ( isSingle ){
            this.selectTank.setPosition(new Vec3(this.selectTank.position.x,this.singlePlayer.position.y,this.selectTank.position.z));
        }else{
            this.selectTank.setPosition(new Vec3(this.selectTank.position.x,this.doublePalyers.position.y,this.selectTank.position.z));
        }
    }
}
