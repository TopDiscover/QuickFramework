import { Config } from "../../../../scripts/common/config/Config";
import UIView from "../../../../scripts/framework/core/ui/UIView";
import { TankBettle } from "../data/TankBattleConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBattleStartView extends UIView {
    public static getPrefabUrl() {
        return "prefabs/TankBattleStartView";
    }

    /**@description 选择模式的小坦克 */
    private selectTank: cc.Node = null;
    /**@description 单人 */
    private singlePlayer: cc.Node = null;
    /**@description 多人 */
    private doublePalyers: cc.Node = null;
    private logic : TankBattleLogic = null!;

    onLoad() {
        super.onLoad();
        if ( this.args && this.args.length > 0 ){
            this.logic = this.args[0];
         }
        this.content = cc.find("content", this.node);

        cc.find("title", this.content).getComponent(cc.Label).language = Manager.makeLanguage("title", this.bundle);
        this.singlePlayer = cc.find("player", this.content);
        this.singlePlayer.getComponent(cc.Label).language = Manager.makeLanguage("player", this.bundle);
        this.doublePalyers = cc.find("players", this.content);
        this.doublePalyers.getComponent(cc.Label).language = Manager.makeLanguage("players", this.bundle);
        cc.find("tips", this.content).getComponent(cc.Label).language = Manager.makeLanguage("tips", this.bundle);
        this.selectTank = cc.find("tank", this.content);
        this.selectTank.y = this.singlePlayer.y;

        this.enabledKeyUp = true;
    }

    protected onKeyBackUp(ev: cc.Event.EventKeyboard) {
        super.onKeyBackUp(ev);
        Manager.entryManager.enterBundle(Config.BUNDLE_HALL);
    }

    protected onKeyUp(ev: cc.Event.EventKeyboard) {
        super.onKeyUp(ev);
        if ( this.logic ){
            this.logic.onKeyUp(ev,TankBettle.ViewType.START_VIEW,this);
        }
    }

    isSingle(){
        return this.selectTank.position.y == this.singlePlayer.position.y;
    }

    updateSelectTank( isSingle : boolean){
        if ( isSingle ){
            this.selectTank.setPosition(new cc.Vec3(this.selectTank.position.x,this.singlePlayer.position.y,this.selectTank.position.z));
        }else{
            this.selectTank.setPosition(new cc.Vec3(this.selectTank.position.x,this.doublePalyers.position.y,this.selectTank.position.z));
        }
    }
}
