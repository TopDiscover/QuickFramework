
import { _decorator, Component, Node, find, Label, Sprite, math,Animation } from 'cc';
import GameView from '../../../../scripts/framework/core/ui/GameView';
import { Macro } from '../../../../scripts/framework/defines/Macros';
import { TaxiConstants } from '../data/TaxiConstants';
import { TaxiLogic } from '../game/TaxiLogic';
const { ccclass, property } = _decorator;

interface GameUI {
    /**@description 根节点 */
    node: Node;
    /**@description 进度节点 */
    progress: {
        node: Node,
        /**@description 当前等级 */
        curLb: Label,
        curSp: Sprite,
        /**@description 目标等级 */
        targetLb: Label,
        targetSp : Sprite,
        progress : Sprite[],
    };
    talk : {
        node : Node,
        txt : Label,
        head : Sprite,
    },
    guide : Node;
}

interface ResultUI{
    node : Node;
    tips : Label;
    money : Label;
}

const FINISH_URL = "textures/UI/fight/fightBox3b";
const UNFINISH_URL = "textures/UI/fight/fightBox3a";

const PRO_FINISH_URL = "textures/UI/fight/fightBox2a";
const PRO_GREETING_URL = "textures/UI/fight/fightBox2b";
const PRO_NONE_URL = "textures/UI/fight/fightBox2c";

@ccclass('TaxiGameView')
export class TaxiGameView extends GameView {

    static logicType = TaxiLogic;
    static getPrefabUrl() {
        return "prefabs/ui/TaxiGameView";
    }

    /**@description 提示 */
    private game: GameUI = {
        node : null!,
        progress : {
            node : null!,
            curLb : null!,
            curSp : null!,
            targetLb : null!,
            targetSp : null!,
            progress : []
        },
        talk : {
            node : null!,
            txt : null!,
            head : null!,
        },
        guide : null!
    };

    /**@description 主界面 */
    private main: { node: Node, money: Label } = {
        node: null!,
        money: null!
    }

    /**@description 结算 */
    private result: ResultUI = {
        node : null!,
        tips : null!,
        money : null!,
    }

    /**@description 加载 */
    private loading: { node: Node, progress: Label , txt : Label } = {
        node: null!,
        progress: null!,
        txt : null!,
    }

    protected get logic() {
        return this._logic as TaxiLogic;
    }

    private isWaitShowResult = false;

    init() {

        this.game.node = find("game", this.node) as Node;

        this.game.progress.node = find("progress", this.game.node) as Node;
        this.game.progress.curSp = find("src",this.game.progress.node)?.getComponent(Sprite) as Sprite;
        this.game.progress.curLb = find("src/txt",this.game.progress.node)?.getComponent(Label) as Label;
        this.game.progress.targetSp = find("target",this.game.progress.node)?.getComponent(Sprite) as Sprite;
        this.game.progress.targetLb = find("target/txt",this.game.progress.node)?.getComponent(Label) as Label;
        for ( let i = 1 ; i <= 3 ; i++ ){
            this.game.progress.progress.push(find(`progres${i}`,this.game.progress.node)?.getComponent(Sprite) as Sprite)
        }

        this.game.talk.node = find("talk",this.game.node) as Node;
        this.game.talk.txt = find("txt",this.game.talk.node)?.getComponent(Label) as Label;
        this.game.talk.head = find("icon/avatar",this.game.talk.node)?.getComponent(Sprite) as Sprite;

        this.game.guide = find("guide",this.game.node) as Node;

        this.main.node = find("main", this.node) as Node;
        this.result.node = find("result", this.node) as Node;

        this.result.money = find("getBtnNormal/txt",this.result.node)?.getComponent(Label) as Label;
        this.result.tips = find("tip",this.result.node)?.getComponent(Label) as Label;
        find("getBtnNormal/btnNormal",this.result.node)?.on(Node.EventType.TOUCH_END,this.onContinue,this);

        this.loading.node = find("loading", this.node) as Node;
        this.audioHelper.playMusic(TaxiConstants.AudioSource.BACKGROUND, this.bundle)



        this.loading.progress = find("content/progress", this.loading.node)?.getComponent(Label) as Label;
        this.loading.txt = find("content/txt",this.loading.node)?.getComponent(Label) as Label;

        this.main.money = find("gold/txt", this.main.node)?.getComponent(Label) as Label;

        this.game.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.game.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this.main.node.on(Node.EventType.TOUCH_END, this.onGameStart, this);

        find("goback", this.node)?.on(Node.EventType.TOUCH_END, this.onGoback, this);

        this.showLoading();
    }

    protected addEvents() {
        super.addEvents();
        this.addEvent(TaxiConstants.EventName.GREETING, this.onGreeting);
        this.addEvent(TaxiConstants.EventName.GOODBYE, this.onGoodbye);
        this.addEvent(TaxiConstants.EventName.SHOW_TALK, this.onTalking);
        this.addEvent(TaxiConstants.EventName.SHOW_GUIDE, this.onShowGuide);
    }

    private onGreeting() {
        this.game.progress.progress[this.logic.data.curProgress].loadImage({
            url : PRO_GREETING_URL,
            view:this
        })
    }

    private onGoodbye() {
        this.game.progress.progress[this.logic.data.curProgress - 1].loadImage({
            url : PRO_FINISH_URL,
            view : this
        });
        if ( this.logic.data.maxProgress == this.logic.data.curProgress ){
            this.game.progress.targetSp.loadImage({
                url : FINISH_URL,
                view : this
            })
        }
    }

    private onTalking(customerID:number) {
        const table = Manager.getLanguage("tips",this.bundle)
        const index = Math.floor(Math.random() * table.length);
        const str = table[index];
        this.game.talk.txt.string = str;
        this.game.talk.node.active = true;
        const path = `textures/UI/head/head${customerID + 1}`;
        this.game.talk.head.loadImage({
            url : path,
            view : this
        })
        this.scheduleOnce(()=>{
            this.onTalkingEnd();
        },3)
    }

    private onTalkingEnd(){
        this.game.talk.node.active = false;
        if ( this.isWaitShowResult ){
            this._showResult();
        }
    }

    private onShowGuide(isShow : boolean) {
        this.game.guide.active = isShow;
        if ( isShow ){
            const comp = this.game.guide.getComponent(Animation);
            if ( comp ){
                comp.play("showGuide");
            }
        }
    }

    showLoading() {
        this.game.node.active = false;
        this.result.node.active = false;
        this.main.node.active = false;
        this.loading.node.active = true;
    }

    updateLoadingText( txt : string ){
        this.loading.txt.string = txt;
    }
    updateLoadingProgress(finish: number, total: number) {
        let percent = (finish / total) * 100;
        let str = percent.toFixed(2) + "%";
        this.loading.progress.string = str;
    }

    showMain() {
        this.game.node.active = false;
        this.result.node.active = false;
        this.main.node.active = true;
        this.loading.node.active = false;
    }

    private onTouchStart() {
        // Log.d("onTouchStart")
        this.logic.onTouchStart();
    }

    private onTouchEnd() {
        // Log.d("onTouchEnd")
        this.logic.onTouchEnd();
    }

    private onGameStart() {
        dispatch(TaxiConstants.EventName.GAME_START);
    }

    showGameUI() {
        this.main.node.active = false;
        this.game.node.active = true;
    }

    private onGoback() {
        this.enterBundle(Macro.BUNDLE_HALL);
    }

    updateMoney(v: number) {
        this.main.money.string = String(v);
    }


    private updateGameUI(){
        let curLevel = this.logic.data.level;
        this.game.progress.curLb.string = `${curLevel}`;
        this.game.progress.targetLb.string = `${curLevel + 1}`;
        this.game.progress.curSp.loadImage({
            url : FINISH_URL,
            view: this,
        });
        this.game.progress.targetSp.loadImage({
            url : UNFINISH_URL,
            view : this
        });

        for( let i = 0 ; i < this.game.progress.progress.length ; i++){
            const progress = this.game.progress.progress[i];
            if ( i >= this.logic.data.maxProgress ){
                progress.node.active = false;
            }else{
                progress.node.active = true;
                progress.loadImage({
                    url : PRO_NONE_URL,
                    view : this
                })
            }
        }

    }

    updateData(){
        this.updateMoney(this.logic.data.money);
        this.updateGameUI();
    }

    showResult(){
        this.isWaitShowResult = false;
        if ( this.game.node.active && this.game.talk.node.active ){
           this.isWaitShowResult = true;
        }else{
            this._showResult();
        }
        
    }
    private _showResult(){
        this.result.tips.string = `您完成了${this.logic.data.curProgress}个订单`;
        this.result.money.string = `${this.logic.data.curMoney}`
        this.result.node.active = true;
    }

    hideResult(){
        this.result.node.active = false;
    }

    private onContinue(){
        if ( this.logic.data.curProgress == this.logic.data.maxProgress ){
            this.logic.data.passLevel(this.logic.data.curMoney);
        }
        this.updateMoney(this.logic.data.money);
        dispatch(TaxiConstants.EventName.NEW_LEVEL);
    }
}
