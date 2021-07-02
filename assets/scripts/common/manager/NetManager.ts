/**
 * @description 网络控制器管理器
 */

import { js, Node} from "cc";
import { registerTypeManager } from "../../framework/base/RegisterTypeManager";
import { Manager } from "../../framework/Framework";

const MAIN_NET = "netManager";
const HALL_NET = "hallNetManager";

class NetManager {
    private name = "";
    constructor(name : string) {
        this.name = name;
    }

    /**@description 注册的网络控制器组件类型 */
    private types : any[] = [];

    private node: Node | null = null;
    public onLoad(node: Node) {
        this.node = node;
        if( this.name == MAIN_NET ){
            registerTypeManager.netManager = this;
        }else if( this.name == HALL_NET ){
            registerTypeManager.hallNetManager = this;
        }
    }

    public onDestroy(node: Node) {
        this.removeNetControllers();
        this.node = null;
    }

    /**@description 网络控制器注册 Controller<T>的子类 */
    public register(controllerType: any) {
        if( this.types.indexOf(controllerType) != -1){
            error(this.name, `重复添加${js.getClassName(controllerType)}`);
            return;
        }
        this.types.push(controllerType);
    }

    /**@description 添加网络控制组件 */
    public addNetControllers() {
        if (this.node) {
            if( this.name == MAIN_NET ){
                registerTypeManager.netTypes.forEach((value)=>{
                    this.register(value);
                });
                registerTypeManager.netTypes = [];
            }else if ( this.name == HALL_NET ){
                registerTypeManager.hallNetTypes.forEach((value)=>{
                    this.register(value);
                });
                registerTypeManager.hallNetTypes = [];
            }
            for (let i = 0; i < this.types.length; i++) {
                let controllerType = this.types[i];
                if (controllerType && !this.node.getComponent(controllerType)) {
                    this.node.addComponent(controllerType);
                }
            }
        }
    }

    /**@description 移除网络控制组件 */
    public removeNetControllers() {
        if (this.node) {
            for (let i = 0; i < this.types.length; i++) {
                let controllerType = this.types[i];
                if (controllerType) {
                    let comp = this.node.getComponent(controllerType);
                    comp?.destroy();
                }
            }
        }
    }
    
}

export function netManagerInit() {
    log("网络管理器初始化");
    Manager.netManager = new NetManager("netManager");
    Manager.hallNetManager = new NetManager("hallNetManager");
}