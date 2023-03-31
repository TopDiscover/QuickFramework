import { Component, find, instantiate, Label, log, Node, Prefab, Tween, tween, UIOpacity, UITransform, Vec2, Vec3 } from "cc";
import { Macro } from "../../framework/defines/Macros";
import { Config, ViewZOrder } from "../config/Config";
/**
 * @description 提示
 */

class ToastItem extends Component {
    private _content: Node = null!;
    private _curPositon = new Vec3;
    private _curOpacity: UIOpacity | null = null;
    private _transform: UITransform = null!;

    stopAllActions() {
        Tween.stopAllByTarget(this._content);
        Tween.stopAllByTarget(this._curPositon);
        if (this.opacity) {
            Tween.stopAllByTarget(this.opacity);
        }
    }

    onDestroy() {
        this.stopAllActions();
    }

    init(content: string, time: number) {
        this._content = find("content", this.node) as Node;
        if (this._content) {
            (this._content.getComponent(Label) as Label).string = content;
        }
        this.runTimeOut(time);
    }

    private get opacity() {
        if (this._curOpacity) {
            return this._curOpacity;
        }
        this._curOpacity = this.node.getComponent(UIOpacity);
        return this._curOpacity;
    }

    private get transform() {
        if (this._transform) {
            return this._transform;
        }
        this._transform = this.node.getComponent(UITransform) as UITransform;
        return this._transform;
    }

    private runTimeOut(time: number) {
        let self = this;
        tween(this._content).delay(time).call(() => {
            App.tips.finishShowItem(self.node);
        }).start();
    }

    public fadeOut() {
        if (!this.opacity) return;
        Tween.stopAllByTarget(this.opacity);
        tween(this.opacity)
            .to(.5, { opacity: 0 })
            .call(() => {
                this.stopAllActions();
                this.node?.removeFromParent();
            })
            .start();
        this.moveTo(0, this.node.position.y + this.transform.height);
    }

    public fadeIn() {
        if (!this.opacity) return;
        Tween.stopAllByTarget(this.opacity);
        this.opacity.opacity = 0;
        tween(this.opacity)
            .to(.5, { opacity: 255 })
            .start();
        this.moveTo(0, this.node.position.y + this.transform.height);
    }

    public moveTo(x: number, y: number) {
        Tween.stopAllByTarget(this._curPositon);
        this._curPositon.set(this.node.position);
        tween(this._curPositon).to(0.5, { x: x, y: y }, {
            onUpdate: (target) => {
                this.node?.setPosition(target as Vec3);
            }, easing: "expoOut"
        }).start();
    }
}

export default class Tips implements ISingleton{
    static module: string = "【Tips】";
    module: string = null!;
    isResident = true;
    private _queue: Node[] = [];

    private readonly MAX_NUM = 3; // 最多可以同时显示多少个toast
    private readonly FADE_TIME = 2; // 停留显示2秒。2秒内有可能被顶掉

    /**@description id*/
    private _id: number = 0;

    /**@description 默认的显示开始位置 */
    public startPosition = new Vec3(0, 100);

    private async _show(msg: string) {
        let node = instantiate(App.uiManager.getScenePrefab("Tips"));
        if (node) {
            let itemComp = node.addComponent(ToastItem);
            itemComp.init(msg, this.FADE_TIME);
            node.setPosition(this.startPosition);
            itemComp.fadeIn();
            node.userData = this._id++;
            node.name = `Tips${node.userData}`;
            App.uiManager.addView(node, ViewZOrder.Tips);

            //整体上移
            let length = this._queue.length;
            for (let i = 0; i < length && i < this.MAX_NUM; i++) {
                let item = this._queue[i];
                let itemComp = item.getComponent(ToastItem);
                let transform = item.getComponent(UITransform);
                if (itemComp && transform) {
                    itemComp.moveTo(0, this.startPosition.y + transform.height + (length - i) * (transform.height + 3))
                }
            }

            //压入
            this._queue.push(node);

            //删除超出的
            if (this._queue.length > this.MAX_NUM) {
                let item = this._queue.shift() as Node;
                item.getComponent(ToastItem)?.fadeOut();
            }
        }
    }

    public show(msg: string) {
        if (msg == null || msg == undefined || msg == "") {
            return;
        }
        log("Toast.show msg=%s", msg);
        this._show(msg);
    }

    public finishShowItem(item: Node) {
        for (let i = 0; i < this._queue.length; i++) {
            let tempItem = this._queue[i];
            if (tempItem.userData == item.userData) {
                this._queue.splice(i, 1);
                item.getComponent(ToastItem)?.fadeOut();
                break;
            }
        }
    }

    public clear() {
        let item: Node = null!;
        while (item = this._queue.pop() as Node) {
            let comp = item.getComponent(ToastItem);
            if (comp) {
                comp.stopAllActions();
            }
            item.removeFromParent();
        }
    }

}