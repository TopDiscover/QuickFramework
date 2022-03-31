import { Node, Tween, tween, Vec3 } from "cc";

/**
 * @description 公共工具
 */

const VIEW_ACTION_TAG = 999;

export class Utils {
    private static _instance: Utils = null!;
    public static Instance() { return this._instance || (this._instance = new Utils()); }

    /**@description 显示视图动画 */
    showView(node: Node | null, complete: Function) {
        if (node) {
            Tween.stopAllByTag(VIEW_ACTION_TAG);
            tween(node).tag(VIEW_ACTION_TAG)
                .set({ scale: new Vec3(0.2, 0.2, 0.2) })
                .to(0.2, { scale: new Vec3(1.15, 1.15, 1.15) })
                .delay(0.05)
                .to(0.1, { scale: new Vec3(1, 1, 1) })
                .call(() => {
                    if (complete) complete();
                })
                .start();
        }
    }

    /**@description 隐藏/关闭视图统一动画 */
    hideView(node: Node | null, complete: Function) {
        if (node) {
            Tween.stopAllByTag(VIEW_ACTION_TAG);
            tween(node).tag(VIEW_ACTION_TAG)
                .to(0.2, { scale: new Vec3(1.15, 1.15, 1.15) })
                .to(0.1, { scale: new Vec3(0.3, 0.3, 0.3) })
                .call(() => {
                    if (complete) complete();
                })
                .start();
        }
    }
}