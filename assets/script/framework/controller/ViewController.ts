
import { EventApi } from "../event/EventApi";
import EventComponent from "../base/EventComponent";

/**
 * @description 控制器基类 , 对service 及 loader 的自动注入
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewController<ServiceType> extends EventComponent {

    /**
     * @description 这个变量会在脚本onLoad时自动赋值，使用者请勿进行修改
     */
    public get service() : ServiceType{
        return <any>(this._service);
    };
    public set service( value : ServiceType ) {
        this._service = <any>value;
    }

    protected bindingEvents(){
        super.bindingEvents();
        this.registerEvent(EventApi.NetEvent.ON_OPEN,this.onNetOpen);
        this.registerEvent(EventApi.NetEvent.ON_CLOSE,this.onNetClose);
        this.registerEvent(EventApi.NetEvent.ON_ERROR,this.onNetError);
    }

    protected onNetOpen() {
        if ( CC_DEBUG ) cc.log(`--ViewController-- onNetOpen---`);
    }
    
    protected onNetClose( ev ) {
        if ( CC_DEBUG ) cc.log(`--ViewController-- onNetClose---`);
    }
    protected onNetError( ev : Event ) {
        if ( CC_DEBUG ) cc.log(`--ViewController-- onNetError---`);
    }

}
