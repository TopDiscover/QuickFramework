/**
 * @description 提示
 */

import { ViewZOrder } from "../config/Config";

class ToastItem extends cc.Component {
    private _content: cc.Node = null;
    init(content: string, time: number) {
        this._content = cc.find("content", this.node);
        if (this._content) {
            this._content.getComponent(cc.Label).string = content;
        }
        this.runTimeOut(time);
    }

    private runTimeOut(time: number) {
        let self = this;
        cc.tween(this._content).delay(time).call(() => {
            Manager.tips.finishShowItem(self.node);
        }).start();
    }

    public fadeOut() {
        let self = this;
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.spawn(
                cc.moveBy(0.5, 0, 50).easing(cc.easeExponentialOut()),
                cc.fadeOut(1)
            ),
            cc.callFunc(() => {
                self.node.removeFromParent();
            })
        ));
    }

    public fadeIn() {
        this.node.stopAllActions();
        this.node.opacity = 0;
        let pos = this.node.position;
        this.node.runAction(cc.spawn(
            cc.fadeIn(0.5),
            cc.moveTo(0.5, pos.x, pos.y + 50).easing(cc.easeExponentialOut())
        ));
    }
}

export default class Tips {

    private static _instance: Tips = null;
    public static Instance() { return this._instance || (this._instance = new Tips()); }

    private get prefab(){
        return Manager.uiManager.getScenePrefab("Tips");
    }

    private _queue: cc.Node[] = [];

    private readonly MAX_NUM = 3; // 最多可以同时显示多少个toast
    private readonly FADE_TIME = 2; // 停留显示2秒。2秒内有可能被顶掉

    /**@description id*/
    private _id: number = 0;

    private _show(msg: string) {
        let node = cc.instantiate(this.prefab);
        if (node) {
            let itemComp = node.addComponent(ToastItem);
            itemComp.init(msg, this.FADE_TIME);
            itemComp.fadeIn();
            node.userData = this._id++;
            node.name = `Tips${node.userData}`;
            Manager.uiManager.addView(node, ViewZOrder.Tips)
            //整体上移
            let length = this._queue.length;
            for (let i = 0; i < length; i++) {
                let item = this._queue[i];
                item.opacity = 255;
                item.stopAllActions();
                item.runAction(cc.moveTo(0.5, 0, 50 + (length - i) * (node.height + 3)).easing(cc.easeExponentialOut()))
            }

            //压入
            this._queue.push(node);

            //删除超出的
            if (this._queue.length > this.MAX_NUM) {
                let item = this._queue.shift();
                item.getComponent(ToastItem).fadeOut();
            }
        }
    }

    public show(msg: string) {
        if (msg == null || msg == undefined || msg == "") {
            return;
        }
        Log.d("Toast.show msg=%s", msg);
        this._show(msg);
    }

    public finishShowItem(item: cc.Node) {
        for (let i = 0; i < this._queue.length; i++) {
            let tempItem = this._queue[i];
            if (tempItem.userData == item.userData) {
                this._queue.splice(i, 1);
                item.getComponent(ToastItem).fadeOut();
                break;
            }
        }
    }

    public clear() {
        let item = null;
        while (item = this._queue.pop()) {
            item.stopAllActions();
            item.removeFromParent();
        }
    }

}