import UILoadingDelegate from "../../framework/ui/UILoadingDelegate";

export default class UILoading extends UILoadingDelegate {

    private static _instance: UILoading = null;
    public static Instance() { return this._instance || (this._instance = new UILoading()); }
}
