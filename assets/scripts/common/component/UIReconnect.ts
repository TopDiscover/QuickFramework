import Loading from "./Loading";

/**
 * @description 重连专用提示UI
 */
export class UIReconnect  extends Loading{
    protected static _instance: UIReconnect = null!;
    public static Instance() { return this._instance || (this._instance = new UIReconnect()); }
    

    protected startTimeOutTimer(timeout: number){
        //do nothing
    }

    protected stopTimeOutTimer(){
        //do nothing
    }

}
