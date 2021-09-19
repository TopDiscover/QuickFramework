/**
 * @description 网络控制器管理器
 */
export class NetManager {
    private name = "";
    constructor(name: string) {
        this.name = name;
    }

    private node: cc.Node = null;
    public onLoad(node: cc.Node) {
        this.node = node;
    }

    public onDestroy(node: cc.Node) {
        this.removeNetControllers();
        this.node = null;
    }

    /**@description 网络控制器注册 Controller<T>的子类 */
    public register(controllerType: any) {
        for (let i = 0; i < this.types.length; i++) {
            if (this.types[i] == controllerType) {
                Log.e(this.name, `重复添加${cc.js.getClassName(controllerType)}`);
                return;
            }
        }
        this.types.push(controllerType);
    }

    /**@description 添加网络控制组件 */
    public addNetControllers() {
        if (this.node) {
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
                    this.node.removeComponent(controllerType);
                }
            }
        }
    }
    /**@description 注册的网络控制器组件类型 */
    private types : any[] = [];
}