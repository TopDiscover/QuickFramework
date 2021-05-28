import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../script/common/event/LogicEvent";
import UIView from "../../../../script/framework/ui/UIView";
import { EliminateData } from "../data/EliminateData";
import EliminateGridView from "./EliminateGridView";

//主游戏视图
const { ccclass, property } = cc._decorator;

@ccclass
export default class EliminateGameView extends UIView {

    static getPrefabUrl() {
        return "prefabs/EliminateGameView";
    }

    onLoad() {
        super.onLoad();

        let goback = cc.find("goBack", this.node);
        goback.on(cc.Node.EventType.TOUCH_END, this.onGoBack, this);

        //初始化游戏数据模型
        EliminateData.initGameModel();
        let gridView = cc.find("GridView", this.node);
        if (gridView) {
            let view = gridView.addComponent(EliminateGridView);
            view.view = this;
            view.initWithCellModels(EliminateData.gameModel.getCells());
        }

        //通知进入bundle完成
        dispatchEnterComplete({ type: LogicType.GAME, views: [this] });
    }

    private onGoBack() {
        dispatch(LogicEvent.ENTER_HALL);
    }

    playClick() {

    }

    playSwap() {

    }

    playEliminate(step: number) {

    }

    playContinuousMatch(step: number) {

    }
}
