import { Service } from "../service/Service";

export abstract class ICommonService extends Service implements GameEventInterface {

    /**@description 连接服务器 */
    public abstract connect(): void;

    /**
     * @description 发送心跳
     */
    protected abstract sendHeartbeat():void ;
    /**
     * @description 是否为心跳消息
     */
    protected abstract isHeartBeat(data: Message): boolean

    /**@description 进入后台网络处理 */
    abstract onEnterBackground() : void;

    /**
     * @description 进入前台网络处理
     * @param inBackgroundTime 进入后面总时间
     **/
    abstract onEnterForgeground(inBackgroundTime: number) : void;
}
