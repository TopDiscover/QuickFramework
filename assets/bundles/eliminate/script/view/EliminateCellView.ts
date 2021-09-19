import { ANITIME, CELL_SIZE, CELL_STATUS } from "../data/EliminateDefines";
import EliminateCellModel from "../model/EliminateCellModel";

//格子
const { ccclass, property } = cc._decorator;

@ccclass
export default class EliminateCellView extends cc.Component {

    model: EliminateCellModel = null;

    private isSelect = false;
    @property(cc.SpriteFrame)
    defaultFrame: cc.SpriteFrame = null;

    initWithModel(model: EliminateCellModel) {
        this.model = model;
        let startX = model.startX;
        let startY = model.startY;
        //cell锚点在中
        this.node.x = CELL_SIZE * (startX - 0.5);
        this.node.y = CELL_SIZE * (startY - 0.5);
        let animation = this.node.getComponent(cc.Animation);
        if (model.status == CELL_STATUS.COMMON) {
            animation.stop();
        } else {
            animation.play(model.status);
        }
    }

    /**@description 执行动作 */
    updateView() {
        let cmd = this.model.cmd;
        if (cmd.length <= 0) {
            return;
        }
        let actionArray = [];
        let curTime = 0;
        for (let i in cmd) {
            if (cmd[i].playTime > curTime) {
                let delay = cc.delayTime(cmd[i].playTime - curTime);
                actionArray.push(delay);
            }
            if (cmd[i].action == "moveTo") {
                let x = (cmd[i].pos.x - 0.5) * CELL_SIZE;
                let y = (cmd[i].pos.y - 0.5) * CELL_SIZE;
                let move = cc.moveTo(ANITIME.TOUCH_MOVE, cc.v2(x, y));
                actionArray.push(move);
            } else if (cmd[i].action == "toDie") {
                actionArray.push(cc.callFunc(() => {
                    this.node.destroy();
                }));
            } else if (cmd[i].action == "setVisible") {
                let isVisible = cmd[i].isVisible;
                actionArray.push(cc.callFunc(() => {
                    if (isVisible) {
                        this.node.opacity = 255;
                    } else {
                        this.node.opacity = 0;
                    }
                }));
            } else if (cmd[i].action == "toShake") {
                let rotateRight = cc.rotateBy(0.06, 30);
                let rotateLeft = cc.rotateBy(0.12, -60);
                actionArray.push(cc.repeat(cc.sequence(rotateRight, rotateLeft, rotateRight), 2));
            }
            curTime = cmd[i].playTime + cmd[i].keepTime;
        }

        if (actionArray.length == 1) {
            this.node.runAction(actionArray[0]);
        } else {
            this.node.runAction(cc.sequence(actionArray));
        }
    }


    setSelect(flag: boolean) {
        var animation = this.node.getComponent(cc.Animation);
        var bg = this.node.getChildByName("select");
        if (flag == false && this.isSelect && this.model.status == CELL_STATUS.COMMON) {
            animation.stop();
            this.node.getComponent(cc.Sprite).spriteFrame = this.defaultFrame;
        }
        else if (flag && this.model.status == CELL_STATUS.COMMON) {
            animation.play(CELL_STATUS.CLICK);
        }
        else if (flag && this.model.status == CELL_STATUS.BIRD) {
            animation.play(CELL_STATUS.CLICK);
        }
        bg.active = flag;
        this.isSelect = flag;
    }
}
