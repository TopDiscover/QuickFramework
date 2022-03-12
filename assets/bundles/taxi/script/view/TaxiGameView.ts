
import { _decorator, Component, Node, find, Label } from 'cc';
import GameView from '../../../../scripts/framework/core/ui/GameView';
import { Macro } from '../../../../scripts/framework/defines/Macros';
import { TaxiConstants } from '../data/TaxiConstants';
import { TaxiLogic } from '../game/TaxiLogic';
const { ccclass, property } = _decorator;
 
@ccclass('TaxiGameView')
export class TaxiGameView extends GameView {

    static logicType = TaxiLogic;
    static getPrefabUrl(){
        return "prefabs/ui/TaxiGameView";
    }

    /**@description 提示 */
    private game : Node = null!;

    /**@description 主界面 */
    private main : Node = null!;

    /**@description 结算 */
    private result : Node = null!;

    /**@description 加载 */
    private loading : Node = null!;

    private progress : Label = null!;

    protected get logic(){
        return this._logic as TaxiLogic;
    }

    /**@description 主界面显示的金钱数量 */
    private money : Label = null!;

    init(){

        this.game = find("game",this.node) as Node;
        this.main = find("main",this.node) as Node;
        this.result = find("result",this.node) as Node;
        this.loading = find("loading",this.node) as Node;
        this.audioHelper.playMusic(TaxiConstants.AudioSource.BACKGROUND,this.bundle)

        this.showLoading();

        this.progress = find("content/progress",this.loading)?.getComponent(Label) as Label;

        this.money = find("gold/txt",this.main)?.getComponent(Label) as Label;

        this.node.on(Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(Node.EventType.TOUCH_END,this.onTouchEnd,this);

        this.main.on(Node.EventType.TOUCH_END,this.onGameStart,this);

        find("goback",this.node)?.on(Node.EventType.TOUCH_END,this.onGoback,this);

        this.updateMoney(this.logic.data.money);
    }

    showLoading(){
        this.game.active = false;
        this.result.active = false;
        this.main.active = false;
        this.loading.active = true;
    }

    updateLoadingProgress( finish : number , total:number ){
        let percent =  (finish / total) * 100;
        let str = percent.toFixed(2) + "%";
        this.progress.string = str;
    }

    showMain(){
        this.game.active = false;
        this.result.active = false;
        this.main.active = true;
        this.loading.active = false;
    }

    private onTouchStart(){
        this.logic.onTouchStart();
    }

    private onTouchEnd(){
        this.logic.onTouchEnd();
    }

    private onGameStart(){
        this.showGameUI();
    }

    private showGameUI(){
        this.main.active = false;
        this.game.active = true;
    }

    private onGoback(){
        this.enterBundle(Macro.BUNDLE_HALL);
    }

    updateMoney( v : number ){
        this.money.string = String(v);
    }
}
