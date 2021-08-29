import EventComponent from "./EventComponent";
import ResourceLoader from "../assetManager/ResourceLoader";

/**
 * @description 逻辑控制器
*/

export class Logic extends EventComponent {

    protected logTag = `[Logic]`;
    protected _loader: ResourceLoader = null!;

    protected logicType : td.Logic.Type = td.Logic.Type.UNKNOWN;
    protected language : td.Language.DataSourceDelegate = null;

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
    public onEnterComplete(data: td.Logic.EventData){

    }

    public init( data : cc.Node ){
        if ( this.logicType == td.Logic.Type.UNKNOWN ){
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
        this.node = null;
    }

    /**@description 获取需要加载的资源 */
    protected getLoadResources(): td.Resource.Data[] {
        return [];
    }

    /**@description 资源加载完成 */
    protected onLoadResourceComplete( err : td.Resource.LoaderError ) {
    }

    /**@description 资源加载中 */
    protected onLoadResourceProgress( loadedCount : number , total : number , data : td.Resource.CacheData ){
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