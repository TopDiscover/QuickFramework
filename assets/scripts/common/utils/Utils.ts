/**
 * @description 公共工具
 */

const VIEW_ACTION_TAG = 999;

export class Utils {
    private static _instance: Utils = null!;
    public static Instance() { return this._instance || (this._instance = new Utils()); }

    /**@description 显示视图动画 */
    showView(node: cc.Node | null, completeCallback: Function) {
        if (node) {
            cc.Tween.stopAllByTag(VIEW_ACTION_TAG);
            cc.tween(node).tag(VIEW_ACTION_TAG)
                .set({ scale: 0.2 })
                .to(0.2, { scale: 1.15 })
                .delay(0.05)
                .to(0.1, { scale: 1 })
                .call(() => {
                    if (completeCallback) completeCallback();
                })
                .start();
        }
    }

    /**@description 隐藏/关闭视图统一动画 */
    hideView(node: cc.Node | null, completeCallback: Function) {
        if (node) {
            cc.Tween.stopAllByTag(VIEW_ACTION_TAG);
            cc.tween(node).tag(VIEW_ACTION_TAG)
                .to(0.2, { scale: 1.15 })
                .to(0.1, { scale: 0.3 })
                .call(() => {
                    if (completeCallback) completeCallback();
                })
                .start();
        }
    }
}