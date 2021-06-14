import { Component, SpriteFrame, _decorator ,Animation, Vec3, Tween, tween, UIOpacity, Sprite} from "cc";
import { ANITIME, CELL_SIZE, CELL_STATUS } from "../data/EliminateDefines";
import EliminateCellModel from "../model/EliminateCellModel";

//格子
const { ccclass, property } = _decorator;

@ccclass
export default class EliminateCellView extends Component {

    model: EliminateCellModel = null!;

    private isSelect = false;
    @property(SpriteFrame)
    defaultFrame: SpriteFrame = null!;

    private curPosition = new Vec3();
    private curOpacity : UIOpacity = null!;

    initWithModel(model: EliminateCellModel) {
        this.model = model;
        let startX = model.startX;
        let startY = model.startY;
        //cell锚点在中
        this.node.setPosition(new Vec3(CELL_SIZE * (startX - 0.5),CELL_SIZE * (startY - 0.5)));
        let animation = this.node.getComponent(Animation);
        if (model.status == CELL_STATUS.COMMON) {
            animation?.stop();
        } else {
            animation?.play(model.status);
        }
    }


    /**@description 执行动作 */
    updateView() {
        let cmd = this.model.cmd;
        if (cmd.length <= 0) {
            return;
        }
        let actionArray : Tween<any>[] = [];
        let curTime = 0;
        for (let i in cmd) {
            if (cmd[i].playTime > curTime) {
                actionArray.push(tween().target(this.node).delay(cmd[i].playTime - curTime));
            }
            if (cmd[i].action == "moveTo") {
                let pos = cmd[i].pos;
                if( pos ){
                    let x = (pos.x - 0.5) * CELL_SIZE;
                    let y = (pos.y - 0.5) * CELL_SIZE;
                    this.curPosition.set(this.node.position);
                    let action = tween(this.curPosition).to(ANITIME.TOUCH_MOVE,{x : x,y:y},{onUpdate:(target)=>{
                        this.node?.setPosition(target as Vec3);
                    }});

                    actionArray.push(tween().call(()=>{
                        action.start();
                    }).delay(ANITIME.TOUCH_MOVE));
                }
                
            } else if (cmd[i].action == "toDie") {
                actionArray.push( tween().target(this.node).removeSelf());
            } else if (cmd[i].action == "setVisible") {
                let isVisible = cmd[i].isVisible;
                if(isVisible ){
                    actionArray.push(tween().show());
                }else{
                    actionArray.push(tween().hide());
                }
            } else if (cmd[i].action == "toShake") {
                let action = tween(this.node).by(0.06,{angle:30}).by(0.12,{angle:-60}).by(0.06,{angle:30}).repeat(2);
                actionArray.push(action);
            }
            curTime = cmd[i].playTime + cmd[i].keepTime;
        }
        
        //这里添加一个动作，防止只有一个动作时，出错
        actionArray.push(tween().call(()=>{
            // log("动作执行结束");
        }))
        tween(this.node).sequence(...actionArray).start();
    }


    setSelect(flag: boolean) {
        var animation = this.node.getComponent(Animation);
        if( !animation) return;
        var bg = this.node.getChildByName("select");
        if (flag == false && this.isSelect && this.model.status == CELL_STATUS.COMMON) {
            animation.stop();
            let sp = this.node.getComponent(Sprite);
            if( sp ){
                sp.spriteFrame = this.defaultFrame;
            }
        }
        else if (flag && this.model.status == CELL_STATUS.COMMON) {
            animation.play(CELL_STATUS.CLICK);
        }
        else if (flag && this.model.status == CELL_STATUS.BIRD) {
            animation.play(CELL_STATUS.CLICK);
        }
        if( bg ) bg.active = flag;
        this.isSelect = flag;
    }
}
