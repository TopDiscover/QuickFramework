import { EliminateData } from "../data/EliminateData";
import { CELL_SIZE, EliminateEffect, GRID_HEIGHT, GRID_PIXEL_HEIGHT, GRID_PIXEL_WIDTH, GRID_WIDTH } from "../data/EliminateDefines";
import EliminateCellModel from "../model/EliminateCellModel";
import EliminateCellView from "./EliminateCellView";
import EliminateGameView from "./EliminateGameView";

const { ccclass, property } = cc._decorator;
//游戏操作网络视图
@ccclass
export default class EliminateGridView extends cc.Component {

    view: EliminateGameView = null;

    /**@description 当前所有cell视图显示节点 */
    cellViews: cc.Node[][] = null;
    /**@description 当前是否在播放动画中 */
    private isPlayAni = false;
    private isCanMove = true;

    initWithCellModels(cells: EliminateCellModel[][]) {
        this.cellViews = [];
        let me = this;
        for (let i = 1; i <= GRID_HEIGHT; i++) {
            this.cellViews[i] = [];
            for (let j = 1; j <= GRID_WIDTH; j++) {
                let prefabUrl = cells[i][j].prefabUrl;
                createPrefab({
                    url: prefabUrl,
                    view: this.view,
                    completeCallback: (node) => {
                        if (node) {
                            me.node.addChild(node);
                            //这里面后面优化用对象池，暂时这样子处理
                            let cellView = node.getComponent(EliminateCellView);
                            cellView.initWithModel(cells[i][j]);
                            me.cellViews[i][j] = node;
                        }
                    }
                });
            }
        }
    }

    onLoad() {
        //启用事件监听
        this.initListener();
        this.isCanMove = true;
        this.isPlayAni = false;
    }

    private initListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    private onTouchStart(event: cc.Event.EventTouch) {
        if (this.isPlayAni) {
            return true;
        }
        let touchPos = event.getLocation();
        let cellPos = this.convertTouchPositionToCellPosition(touchPos);
        if (cellPos) {
            let changeModels = this.selectCell(cellPos);
            this.isCanMove = changeModels.length < 3;
        } else {
            this.isCanMove = false;
        }
        return true;
    }
    private onTouchMove(event: cc.Event.EventTouch) {
        if (this.isCanMove) {
            let start = event.getStartLocation();
            let startCellPos = this.convertTouchPositionToCellPosition(start);
            let touchPos = event.getLocation();
            let cellPos = this.convertTouchPositionToCellPosition(touchPos);
            if (cellPos && startCellPos && (startCellPos.x != cellPos.x || startCellPos.y != cellPos.y)) {
                this.isCanMove = false;
                this.selectCell(cellPos);
            }
        }
    }

    private convertTouchPositionToCellPosition(touchPos: cc.Vec2): cc.Vec2 {
        let result = this.node.convertToNodeSpaceAR(touchPos);
        if (result.x < 0 || result.x >= GRID_PIXEL_WIDTH || result.y < 0 || result.y >= GRID_PIXEL_HEIGHT) {
            return null;
        } else {
            result.x = Math.floor(result.x / CELL_SIZE) + 1;
            result.y = Math.floor(result.y / CELL_SIZE) + 1;
            return result;
        }
    }

    updateView(changeModels: EliminateCellModel[]) {
        let newCellViewInfo: { model: EliminateCellModel, view: cc.Node }[] = [];
        for (let i in changeModels) {
            let model = changeModels[i];
            let viewInfo = this.findViewByModel(model);
            let view: cc.Node = null;
            //如果原来的cell不存在，创建
            if (!viewInfo) {
                let prefabUrl = model.prefabUrl;
                // cc.log(`create prefabUrl : ${prefabUrl}`);
                let cache = Manager.cacheManager.get(this.view.bundle, prefabUrl);
                let node = cc.instantiate(<cc.Prefab>cache.data)
                this.node.addChild(node);
                //这里面后面优化用对象池，暂时这样子处理
                let cellView = node.getComponent(EliminateCellView);
                cellView.initWithModel(model);
                view = node;
            } else {
                view = viewInfo.view;
                this.cellViews[viewInfo.y][viewInfo.x] = null;
            }

            view.getComponent(EliminateCellView).updateView();//执行移动动作
            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                })
            }
        }
        //重新标记this.cellviews的信息
        newCellViewInfo.forEach((ele) => {
            let model = ele.model;
            this.cellViews[model.y][model.x] = ele.view;
        });

        return null;
    }
    /**
     * @description 根据cell的model返回对应的view
     * @param model 
     */
    private findViewByModel(model: EliminateCellModel) {
        for (let i = 1; i <= GRID_HEIGHT; i++) {
            for (let j = 1; j <= GRID_WIDTH; j++) {
                if (this.cellViews[i][j] && this.cellViews[i][j].getComponent(EliminateCellView).model == model) {
                    return { view: this.cellViews[i][j], x: j, y: i };
                }
            }
        }
        return null;
    }

    private selectCell(cellPos: cc.Vec2) {
        //model数据处理
        let result = EliminateData.gameModel.selectCell(cellPos);
        let changeModels = result.models;
        let effectsQueue = result.effects;
        this.playEffect(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
        this.updateView(changeModels);
        EliminateData.gameModel.cleanCmd();
        if (changeModels.length >= 2) {
            this.updateSelect(cc.v2(-1, -1));
            this.view.playSwap();
        } else {
            this.updateSelect(cellPos);
            this.view.playClick();
        }
        return changeModels;
    }

    private playEffect(effects: EliminateEffect[]) {
        this.view.playEffect(effects);
    }

    /**
     * @description 显示选中的格子背景
     * @param pos 
     */
    private updateSelect(pos: cc.Vec2) {
        for (let i = 1; i <= GRID_HEIGHT; i++) {
            for (let j = 1; j <= GRID_WIDTH; j++) {
                if (this.cellViews[i][j]) {
                    this.cellViews[i][j].getComponent(EliminateCellView).setSelect((pos.x == j && pos.y == i))
                }
            }
        }
    }

    private disableTouch(time: number, step: number) {
        if (time <= 0) {
            return;
        }
        cc.log(`disableTouch time : ${time} step : ${step}`);
        this.isPlayAni = true;
        this.node.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(() => {
            this.isPlayAni = false;
            this.view.playContinuousMatch(step);
        })));
    }

    private getPlayAniTime(changeModels: EliminateCellModel[]) {
        if (!changeModels) {
            return 0;
        }
        let maxTime = 0;
        changeModels.forEach((ele) => {
            ele.cmd.forEach((cmd) => {
                if (maxTime < cmd.playTime + cmd.keepTime) {
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            });
        });
        return maxTime;
    }

    /**@description 获得爆炸次数， 同一个时间算一个 */
    private getStep(effects: EliminateEffect[]) {
        if (!effects) {
            return 0;
        }
        return effects.reduce((maxValue, cmd) => {
            return Math.max(maxValue, cmd.step || 0);
        }, 0)
    }
}
