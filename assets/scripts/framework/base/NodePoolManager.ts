import { Manager } from "../Framework";
import { INodePoolManager, NodePool } from "../interface/INodePoolManager";
import{Node} from "cc"

/**
 * 对象池管理器
 */
class NodePoolManager implements INodePoolManager{

    onLoad(node: Node): void{}
    onDestroy(node:Node): void{}

    private static _instance: NodePoolManager = null!;
    public static Instance() { return this._instance || (this._instance = new NodePoolManager()); }

    private pools: Map<string, NodePool> = new Map();

    /**
     * @description 创建对象池
     * @param type 对象池类型
     */
    createPool(type: string) {
        if (!this.pools.has(type)) {
            this.pools.set(type, new NodePool(type));
        }
        return this.pools.get(type) as NodePool;
    }

    /**
     * @description 删除对象池 
     * @param type 对象池类型
     * */
    deletePool(type: string | NodePool | null) {
        if (typeof (type) == "string") {
            if (this.pools.has(type)) {
                let pool = this.pools.get(type);
                //清除对象池数据
                pool && pool.clear();
                //删除对象池
                this.pools.delete(type);
            }
        } else if (type && type instanceof NodePool) {
            this.deletePool(type.name);
        }
    }

    /**
     * @description 获取对象池
     * @param type 对象池类型 
     * @param isCreate 当找不到该对象池时，会默认创建一个对象池
     * */
    getPool(type: string, isCreate = true) {
        if (this.pools.has(type)) {
            return this.pools.get(type);
        } else {
            if (isCreate) {
                return this.createPool(type);
            } else {
                return null;
            }
        }
    }

}

export function nodePoolManagerInit() {
    log("对象池初始化");
    Manager.nodePoolManager = NodePoolManager.Instance();
}
