/**
 * @description 全局的网络组件管理
 * 指常驻监听网络消息的组件，不需要动态的添加或移除
 */

 export class NetManager{
    private _logTag = `[ActionManager]`;
    private static _instance: NetManager = null;
    public static Instance() {
        if (!this._instance) {
            this._instance = new NetManager();
        }
        return this._instance;
    }

    /**@description 网络控制器添加 */
    public push( controller : any ){
        for ( let i = 0 ; i < this.controllers.length ; i++ ){
            if ( this.controllers[i] == controller ){
                cc.error(this._logTag,`重复添加${cc.js.getClassName(controller)}`);
                return;
            }
        }
        this.controllers.push(controller);
    }

    public addNetControllers( node : cc.Node ){
        for ( let i = 0 ; i < this.controllers.length ; i++ ){
            let controller = this.controllers[i];
            if ( controller ){
                node.addComponent(controller);
            }
        }
    }

    public removeNetControllers( node : cc.Node ){
        for ( let i = 0 ; i < this.controllers.length ; i++ ){
            let controller = this.controllers[i];
            if ( controller ){
                node.removeComponent(controller);
            }
        }
    }
    private controllers = [];
 }