import { LogicEventData, LogicType } from "../event/LogicEvent";
import EventComponent from "../../framework/base/EventComponent";
import { ResourceData, ResourceCacheData, ENABLE_CHANGE_LANGUAGE } from "../../framework/base/Defines";
import ResourceLoader, { ResourceLoaderError } from "../../framework/assetManager/ResourceLoader";
import { EventApi } from "../../framework/event/EventApi";
import { Manager } from "../manager/Manager";
import { Node } from "cc";


/**@description 当前入子游戏时，在Logic.onLoad时初始设置 */
let assetBundle = {};

/**
 * @description 逻辑控制器
*/

export class Logic extends EventComponent {

    protected logTag = `[Logic]`;
    protected _loader: ResourceLoader = null!;

    protected logicType : LogicType = LogicType.UNKNOWN;

    constructor() {
        super();

        this._loader = new ResourceLoader();

        //绑定加载器获取资源的回调
        this._loader.getLoadResources = this.getLoadResources.bind(this);
        //绑定加载器加载资源完成回调
        this._loader.onLoadComplete = this.onLoadResourceComplete.bind(this);
        this._loader.onLoadProgress = this.onLoadResourceProgress.bind(this);
    }

    protected bindingEvents(){
        super.bindingEvents();
        if ( ENABLE_CHANGE_LANGUAGE ){
            this.registerEvent(EventApi.CHANGE_LANGUAGE,this.onLanguageChange);
        }
    }

    protected get bundle( ) : string{
        error(`请子类重写protected get bundle,返回游戏的包名,即 asset bundle name`);
        return "";
    }

    /**@description 进入各模块完成回调 */
    public onEnterComplete(data: LogicEventData){

    }

    protected onLanguageChange(){
        if( Manager.gameData ){
            Manager.gameData.onLanguageChange();
        }
    }

    public init( data : Node ){
        if ( this.logicType == LogicType.UNKNOWN ){
            error(`未对正确的对logicType赋值`);
        }
        this.node = data;
    }

    public onLoad() {
        if ( !!this.bundle ){
            (assetBundle as any)[`${this.bundle}`] = this.bundle;
        }else{
            error(`请子类重写protected get bundle,返回游戏的包名,即 asset bundle name`);
        }
        super.onLoad();
    }

    public onDestroy() {
        super.onDestroy();
        this.node = <any>null;
    }

    /**@description 获取需要加载的资源 */
    protected getLoadResources(): ResourceData[] {
        return [];
    }

    /**@description 资源加载完成 */
    protected onLoadResourceComplete( err : ResourceLoaderError ) {
    }

    /**@description 资源加载中 */
    protected onLoadResourceProgress( loadedCount : number , total : number , data : ResourceCacheData ){
    }


    /**@description 返回当前网络控制器类型Controller子类 */
    protected getNetControllerType() : any {
        return null;
    }

    //移除网络组件
    protected removeNetComponent(){
        let type = this.getNetControllerType()
        if( type ){
            if( this.node.getComponent(type)){
                this.node.removeComponent(type)
                Manager.gameController = null;
            } 
        }
    }

    //添加网络组件
    protected addNetComponent(){
        let type = this.getNetControllerType()
        if( type ){
            let controller = this.node.getComponent(type);
            if ( !controller ){
                controller = this.node.addComponent(type);
            }
            Manager.gameController = controller;
            return controller;
        }
        return null;
    }
}