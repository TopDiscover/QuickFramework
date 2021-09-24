import { Node, Tween, tween, Vec3 } from "cc";

/**
 * @description 公共工具
 */

const VIEW_ACTION_TAG = 999;

export class Utils {
    private static _instance: Utils = null!;
    public static Instance() { return this._instance || (this._instance = new Utils()); }

    /**@description 显示视图动画 */
    private _showView(node: Node | null, completeCallback: Function) {
        if (node) {
            Tween.stopAllByTag(VIEW_ACTION_TAG);
            tween(node).tag(VIEW_ACTION_TAG)
                .set({ scale: new Vec3(0.2, 0.2, 0.2) })
                .to(0.2, { scale: new Vec3(1.15, 1.15, 1.15) })
                .delay(0.05)
                .to(0.1, { scale: new Vec3(1, 1, 1) })
                .call(() => {
                    if (completeCallback) completeCallback();
                })
                .start();
        }
    }

    /**@description 隐藏/关闭视图统一动画 */
    private _hideView(node: Node | null, completeCallback: Function) {
        if (node) {
            Tween.stopAllByTag(VIEW_ACTION_TAG);
            tween(node).tag(VIEW_ACTION_TAG)
                .to(0.2, { scale: new Vec3(1.15, 1.15, 1.15) })
                .to(0.1, { scale: new Vec3(0.3, 0.3, 0.3) })
                .call(() => {
                    if (completeCallback) completeCallback();
                })
                .start();
        }
    }

    showView(view: UIView, node: Node | null) {
        if ( !view || !node ) return;
        view.show({
            isAction: true,
            do: new Promise<void>((resolove) => {
                this._showView(node, resolove);
            }),
        })
    }

    hideView(view: UIView, node: Node | null) {
        if ( !view || !node ) return;
        view.hide({
            isAction: true,
            do: new Promise<void>((resolove) => {
                this._hideView(node, resolove);
            }),
        })
    }

    closeView(view: UIView, node: Node | null) {
        if ( !view || !node ) return;
        view.close({
            isAction: true,
            do: new Promise<void>((resolove) => {
                this._hideView(node, resolove);
            })
        })
    }
}