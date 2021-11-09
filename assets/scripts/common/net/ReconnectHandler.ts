
import { Handler } from '../../framework/core/net/service/Handler';
import { Macro } from '../../framework/defines/Macros';
import { Config } from '../config/Config';
import { Global } from '../data/Global';
/**
 * @description 重连Handler
 */
export class ReconnectHandler extends Handler {

    /**@description 绑定Service对象 */
    protected _service: Service = null!;

    get module(){
        return this.service.module;
    }

    constructor(service: Service) {
        super();
        this._service = service;
    }

    protected get service() {
        return this._service;
    }

    protected get data() {
        return Manager.dataCenter.get(Global) as Global;
    }

    protected _enabled = false;
    /**@description 是否启用重连 */
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
    }

    /**@description 当前连接次数 */
    protected _connectCount = 0;
    /**@description 最大重连次数 */
    protected _maxConnectCount = 3;
    /**@description 是否正在连接中 */
    isConnecting = false;
    protected connectID = 0;
    protected connectTimeOutID = 0;
    /**@description 尝试重连 */
    reconnect() {
        if (this.isInvalid) return;
        this.service.close();
        this.stop();
        this.delayConnect();
    }

    /**@description 停止 */
    protected stop(){
        this.stopActions();
        this.isConnecting = false;
        this._connectCount = 0;
        Manager.alert.close(Config.RECONNECT_ALERT_TAG);
    }

    protected delayConnect() {
        if (this.isInvalid) return;
        if (this.isConnecting) {
            Log.w(`${this.service.module} 正在连接中...`);
            return;
        }
        let time = 0.3;
        if (this._connectCount > 0) {
            time = (this._connectCount + 1) * time;
            if (time > 3) { time = 3; }//最多推后3秒进行重连
            Log.d(`${this.service.module}${time}秒后尝试重连`);
        }
        this.stopAction(this.connectID);
        this.connectID = this.delayCall(()=>{
            this.connect()
        }, time,"connect");
    }

    protected connect() {
        if (this.isInvalid) return;
        Manager.alert.close(Config.RECONNECT_ALERT_TAG);
        //说明进入了登录界面
        if (this.data.where == Macro.BUNDLE_RESOURCES) {
            Manager.uiReconnect.hide();
            Log.w(`重连处于登录界面，停止重连`);
            return;
        }
        this._connectCount++;
        if (this._connectCount > this._maxConnectCount) {
            this.showReconnectDialog();
            return;
        }
        Manager.uiReconnect.show(Manager.getLanguage(["tryReconnect", this.service.module, this._connectCount]));
        this.service.connect();

        //启用连接超时处理
        this.stopAction(this.connectTimeOutID);
        this.connectTimeOutID = this.delayCall(()=>{
            this.connectTimeOut()
        }, Config.RECONNECT_TIME_OUT,"connectTimeOut");
    }

    protected connectTimeOut() {
        if (this.isInvalid) return;
        //连接超时了30s，都没有得到服务器的返回，直接提示让玩家确定是否重连连接网络
        this.stopAction(this.connectID);
        this.isConnecting = false;
        //关闭网络
        this.service.close();
        //显示网络弹出提示框
        this.showReconnectDialog();
    }

    protected showReconnectDialog() {
        if (this.isInvalid) return;
        Manager.uiReconnect.hide();
        Log.d(`${this.service.module} 断开`)
        this.stopAction(this.connectTimeOutID);
        Manager.alert.show({
            tag: Config.RECONNECT_ALERT_TAG,
            isRepeat: false,
            text: Manager.getLanguage(["warningReconnect", this.service.module]) as string,
            confirmCb: (isOK) => {
                if (isOK) {
                    Log.d(`${this.service?.module} 重连连接网络`);
                    this.stop();
                    Manager.serviceManager.reconnect(this.service);
                } else {
                    Log.d(`${this.service?.module} 玩家网络不好，不重连，退回到登录界面`);
                    Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES, true);
                }
            },
            cancelCb: () => {
                Log.d(`${this.service?.module} 玩家网络不好，不重连，退回到登录界面`);
                Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES, true);
            }
        });
    }

    /**@description 网络连接成功 */
    onOpen(ev: Event | null) {
        if (this.isInvalid) return;
        this._connectCount = 0;
        this.isConnecting = false;
        this.stop();
        Log.d(`${this.service.module}服务器重连成功`);
    }

    /**@description 网络关闭 */
    onClose(ev: Event) {
        if (this.isInvalid) return;
        this.isConnecting = false;
        this.delayConnect();
    }

    /**@description 网络错误 */
    onError(ev: Event) {
        if (this.isInvalid) return;
        this.service.close();
        this.isConnecting = false;
        this.delayConnect();
    }

    /**@description 是否无效 */
    protected get isInvalid() {
        if (!(this.service && this.enabled && this.data.where != Macro.BUNDLE_RESOURCES)) {
            return true;
        }
        return false;
    }
}
