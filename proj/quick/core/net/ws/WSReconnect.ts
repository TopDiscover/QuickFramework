import { DEBUG } from "cc/env";
import { Macro } from "../../../defines/Macros";
import { tween, Tween } from "cc";
/**
 * @description 网络重连
 */
export class WSReconnect {

    service: WSService = null!;

    constructor(service: WSService) {
        this.service = service;
    }

    private get maxCount() {
        return this.service.options.reconnectTimes;
    }
    readonly connectID = 100;
    /**
     * 是否在等待玩家操作
     */
    isWaiting = false;

    /**
     * 是否正在重连
     */
    isReconnecting = false;

    async start(onConnected: (service: WSService) => void) {
        DEBUG && Log.d(`WSReconnect start`);
        if (this.isWaiting || this.isReconnecting) {
            return;
        }
        this.isReconnecting = true;
        for (let i = 0; i < this.maxCount; i++) {
            App.uiReconnect.show(App.getLanguage("tryReconnect", [this.service.module, i + 1]));
            let delay = i * 1.5;
            if (delay > 3) {
                delay = 3;
            }
            if (await this.reconnect(delay)) {
                App.uiReconnect.hide();
                onConnected(this.service);
                this.isReconnecting = false;
                return;
            }
        }
        this.isReconnecting = false;

        this.isWaiting = true;
        App.uiReconnect.hide();
        App.alert.show({
            tag: Macro.RECONNECT_ALERT_TAG,
            isRepeat: false,
            text: App.getLanguage("warningReconnect", [this.service.module]) as string,
            confirmCb: (isOK) => {
                if (isOK) {
                    Log.d(`${this.service?.module} 重连连接网络`);
                    this.isWaiting = false;
                    this.service.flows.reconnectFlow.exec(this.service);
                } else {
                    this.gotoLogin();
                }
            },
            cancelCb: () => {
                this.gotoLogin();
            }
        });
        return;
    }

    private gotoLogin() {
        this.isWaiting = false;
        Log.d(`${this.service?.module} 玩家网络不好，不重连，退回到登录界面`);
        App.entryManager.enterBundle(Macro.BUNDLE_RESOURCES);
    }

    private async reconnect(delay: number) {

        if (this.service.isConnected) {
            return true;
        }

        return new Promise<boolean>((resolve, reject) => {
            this.delayCall(this.connectID, delay, async () => {
                try {
                    await this.service.stop();
                    resolve(await this.service.start());
                } catch (error) {
                    resolve(false);
                }
            });
        });
    }

    private stopAction(tag: number) {
        Tween.stopAllByTag(tag);
    }

    private delayCall(tag: number, time: number, func: Function) {
        this.stopAction(tag);
        tween(this).tag(tag).delay(time).call(func).start();
    }

    private stopActions() {
        this.stopAction(this.connectID);
    }

    stop() {
        this.stopActions();
    }
}