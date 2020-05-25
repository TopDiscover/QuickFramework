import { LogicEventData, LogicType } from "../event/LogicEvent";
import ResourceLoader, { ResourceLoaderError } from "../../framework/loader/ResourceLoader";
import EventComponent from "../../framework/base/EventComponect";
import { GamePathDelegate } from "./ResPath";
import { ResourceData, ResourceCacheData } from "../../framework/base/Defines";

/**
 * @description 逻辑控制器 需要实现LogicInterface
*/

export class Logic extends EventComponent {

    protected logTag = `[Logic]`;
    protected _loader: ResourceLoader = null;

    protected logicType : LogicType = LogicType.UNKNOWN;

    /**@description 游戏路径代理，在LogicType为GAME时，根据自己的游戏来设置路径代理 */
    protected gamePahtDelegate : GamePathDelegate = null;

    constructor() {
        super();

        this._loader = new ResourceLoader();

        //绑定加载器获取资源的回调
        this._loader.getLoadResources = this.getLoadResources.bind(this);
        //绑定加载器加载资源完成回调
        this._loader.onLoadComplete = this.onLoadResourceComplete.bind(this);
        this._loader.onLoadProgress = this.onLoadResourceProgress.bind(this);
    }

    protected getGameName( ){
        cc.error(`请子类重写getGameName,返回游戏的包名`);
        return "";
    }

    /**@description 进入各模块完成回调 */
    public onEnterComplete(data: LogicEventData){

    }

    public init( data : cc.Node ){
        if ( this.logicType == LogicType.UNKNOWN ){
            cc.error(`未对正确的对logicType赋值`);
        }
        this.node = data;
    }

    public onLoad() {
        super.onLoad();
    }

    public onDestroy() {
        super.onDestroy();
        this.node = null;
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

    //移除网络组件
    protected removeNetComponent(){
        
    }

    //添加网络组件
    protected addNetComponent(){
       
    }
}