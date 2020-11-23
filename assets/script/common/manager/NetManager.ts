/**
 * @description 大厅的网络组件管理
 * 当退出回到大厅时，会释放网络组件
 * 其它情况都会常驻，
 * 即除了登录界面之外，
 * 其它地方大厅注册的网络组件都会挂载到当前的Canvas上
 */

 export class NetManager{
    private _logTag = `[ActionManager]`;
    private static _instance: NetManager = null;
    
    private node : cc.Node = null;
    public onLoad( node : cc.Node ){
        this.node = node;
    }
    
    public onDestroy( node : cc.Node ){
        this.removeNetControllers();
        this.node = null;
    }

    public static Instance() {
        if (!this._instance) {
            this._instance = new NetManager();
        }
        return this._instance;
    }

    /**@description 大厅的网络控制器注册 Controller<T>的子类 */
    public register( controllerType : any ){
        for ( let i = 0 ; i < this.types.length ; i++ ){
            if ( this.types[i] == controllerType ){
                cc.error(this._logTag,`重复添加${cc.js.getClassName(controllerType)}`);
                return;
            }
        }
        this.types.push(controllerType);
    }

    /**@description 添加大厅网络控制组件 */
    public addNetControllers( ){
        if( this.node ){
            for ( let i = 0 ; i < this.types.length ; i++ ){
                let controllerType = this.types[i];
                if ( controllerType && !this.node.getComponent(controllerType) ){
                    this.node.addComponent(controllerType);
                }
            }
        }
    }

    /**@description 移除大厅网络控制组件 */
    public removeNetControllers( ){
        if( this.node ){
            for ( let i = 0 ; i < this.types.length ; i++ ){
                let controllerType = this.types[i];
                if ( controllerType ){
                    this.node.removeComponent(controllerType);
                }
            }
        }
    }
    /**@description 大厅注册的网络控制器组件 */
    private types = [];
 }