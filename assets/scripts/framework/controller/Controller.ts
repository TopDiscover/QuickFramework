
import EventComponent from "../base/EventComponent";
import { Service, ServiceEvent } from "../base/Service";
import { Message } from "../net/Message";
import { _decorator } from "cc";
import { DEBUG } from "cc/env";

/**
 * @description 控制器基类 , 对service 的自动注入
 */

const { ccclass, property } = _decorator;

@ccclass
export default class Controller<ServiceType> extends EventComponent {

    /**
     * @description 这个变量会在脚本onLoad时自动赋值，使用者请勿进行修改
     */
    public get service(): ServiceType {
        return <any>(this._service);
    };
    public set service(value: ServiceType) {
        this._service = <any>value;
    }

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(td.Net.Event.ON_OPEN, this.onNetOpen);
        this.registerEvent(td.Net.Event.ON_CLOSE, this.onNetClose);
        this.registerEvent(td.Net.Event.ON_ERROR, this.onNetError);
    }

    protected onNetOpen(event: ServiceEvent) {
        if (this.service as any == event.service) {
            if (DEBUG) log(`${event.service.serviceName}网络 onNetOpen`);
            return true;
        }
        return false;
    }

    protected onNetClose(event: ServiceEvent) {
        if (this.service as any == event.service) {
            if (DEBUG) log(`${event.service.serviceName}网络 onNetClose`);
            return true;
        }
        return false;
    }
    protected onNetError(event: ServiceEvent) {
        if (this.service as any == event.service) {
            if (DEBUG) log(`${event.service.serviceName}网络 onNetError`);
            return true;
        }
        return false;
    }

    /**
     * @description 发送请求
     * @param msg msg
     */
    public send(msg: Message) {
        //发送请求数据
        if (this.service instanceof Service) {
            this.service.send(msg)
        } else {
            error("this.service is null")
        }

    }

    protected get bundle(): string {
        error(`请子类重写protected get bundle,返回游戏的包名,即 asset bundle name`);
        return "";
    }

}
