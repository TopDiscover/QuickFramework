import { _decorator,find ,Node, Label} from "cc";
import GameView from "../../../../scripts/framework/core/ui/GameView";
import { Macro } from "../../../../scripts/framework/defines/Macros";
import { EliminateData } from "../data/EliminateData";
import { EliminateEffect } from "../data/EliminateDefines";
import EliminateEffectsView from "./EliminateEffectsView";
import EliminateGridView from "./EliminateGridView";

//主游戏视图
const { ccclass, property } = _decorator;

@ccclass
export default class EliminateGameView extends GameView {

    static getPrefabUrl() {
        return "prefabs/EliminateGameView";
    }

    private effectsView : EliminateEffectsView = null!;

    onLoad() {
        super.onLoad();

        let goback = find("goBack", this.node);
        goback?.on(Node.EventType.TOUCH_END, this.onGoBack, this);

        //初始化游戏数据模型
        let data = Manager.dataCenter.get(EliminateData) as EliminateData;
        data.initGameModel();
        let gridView = find("GridView", this.node);
        if (gridView) {
            let view = gridView.addComponent(EliminateGridView);
            view.view = this;
            view.initWithCellModels(data.gameModel.getCells());
        }

        let effectsView = find("EffectsView",this.node);
        if( effectsView ){
            let view = effectsView.addComponent(EliminateEffectsView);
            view.view = this;
            this.effectsView = view;
        }

        let version = find("version",this.node)?.getComponent(Label);
        if ( version ){
            version.string = Manager.updateManager.getVersion(this.bundle);
        }

        this.audioHelper.playMusic("audios/gamescenebgm",this.bundle);
    }

    private onGoBack() {
        this.enterBundle(Macro.BUNDLE_HALL);
    }

    playClick() {
        Log.d(`playClick : audios/click.bubble`);
        this.audioHelper.playEffect("audios/click.bubble",this.bundle);
    }

    playSwap() {
        Log.d(`playSwap : audios/swap`);
        this.audioHelper.playEffect("audios/swap",this.bundle);
    }

    playEliminate(step: number) {
        if( step < 1 ){
            step = 1;
        }
        step = Math.min(8,step);
        Log.d(`playEliminate : audios/eliminate${step}`);
        this.audioHelper.playEffect(`audios/eliminate${step}`,this.bundle);
    }

    playContinuousMatch(step: number) {
        Log.d(`playContinuousMatch : step ${step}`);
        step = Math.min(step,11);
        if( step < 2 ){
            return;
        }
        let arr = [3,5,7,9,11];
        let index = Math.floor(step/2) -1;
        let url = `audios/contnuousMatch${arr[index]}`;
        Log.d(`playContinuousMatch : ${url}`);
        this.audioHelper.playEffect(url,this.bundle);
    }

    playEffect(effects: EliminateEffect[]){
        if( this.effectsView ){
            this.effectsView.playEffect(effects);
        }
    }
}
