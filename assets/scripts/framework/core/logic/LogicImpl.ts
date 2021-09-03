import EventComponent from "../../componects/EventComponent";
import { Resource } from "../asset/Resource";
import ResourceLoader from "../asset/ResourceLoader";
import { Logic } from "./Logic";

/**
 * @description 逻辑控制器
*/

export class LogicImpl extends EventComponent {

    protected logTag = `[Logic]`;
    protected _loader: ResourceLoader = null!;

    protected logicType : Logic.Type = Logic.Type.UNKNOWN;
    protected language : Language.DataSourceDelegate = null!;

    constructor() {
        super();

        this._loader = new ResourceLoader();

        //绑定加载器获取资源的回调
        this._loader.getLoadResources = this.getLoadResources.bind(this);
        //绑定加载器加载资源完成回调
        this._loader.onLoadComplete = this.onLoadResourceComplete.bind(this);
        this._loader.onLoadProgress = this.onLoadResourceProgress.bind(this);
    }

    protected get bundle( ) : string{
        cc.error(`请子类重写protected get bundle,返回游戏的包名,即 asset bundle name`);
        return "";
    }

    /**@description 进入各模块完成回调 */
    public onEnterComplete(data: Logic.EventData){

    }

    public init( data : cc.Node ){
        if ( this.logicType == Logic.Type.UNKNOWN ){
            cc.error(`未对正确的对logicType赋值`);
        }
        this.node = data;
    }

    public onLoad() {
        this.bundle;
        super.onLoad();
    }

    public onDestroy() {
        super.onDestroy();
    }

    /**@description 获取需要加载的资源 */
    protected getLoadResources(): Resource.Data[] {
        return [];
    }

    /**@description 资源加载完成 */
    protected onLoadResourceComplete( err : Resource.LoaderError ) {
    }

    /**@description 资源加载中 */
    protected onLoadResourceProgress( loadedCount : number , total : number , data : Resource.CacheData ){
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