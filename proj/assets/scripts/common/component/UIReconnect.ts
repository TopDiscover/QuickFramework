import Loading from "./Loading";

/**
 * @description 重连专用提示UI
 */
export class UIReconnect  extends Loading implements ISingleton{
    static module: string = "【重连提示】";
    module: string = null!;
    isResident = true;
    protected startTimeOutTimer(timeout: number){
        //do nothing
    }

    protected stopTimeOutTimer(){
        //do nothing
    }

}
