
import TipsDelegate from "../../framework/ui/TipsDelegate";

export default class Tips extends TipsDelegate {

    private static _instance: Tips = null;
    public static Instance() { return this._instance || (this._instance = new Tips()); }

    public show( msg : string ){
        cc.log(msg)
    }
}
