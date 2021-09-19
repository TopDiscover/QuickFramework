import { Macro } from "../../defines/Macros";

export class NodePool {
    name: string = Macro.UNKNOWN;
    private pool: Array<cc.Node> = [];
    /**@description 用来克隆的节点 */
    private node: cc.Node = null;
    /**
     * @description 用来克隆的节点，在get时，如果发现对象池中不存在，会直接用此节点进行克隆
     * 注意，设置的克隆对象会从父节点移除，但不会进行cleanup操作
     * 在clear时，对该克隆节点进行释放操作
     * */
    public get cloneNode(){
        return this.node;
    }
    public set cloneNode( node : cc.Node ){
        if(node && cc.isValid(node) ){
            this.node = node;
            this.node.removeFromParent(false);
        }
    }
    

    constructor(name: string) {
        this.name = name;
    }

    /**@description 当前对象池数据大小 */
    get size() {
        return this.pool.length;
    }

    /**@description 销毁对象池中缓存的所有节点 */
    clear() {
        let count = this.pool.length;
        for (let i = 0; i < count; ++i) {
            this.pool[i].destroy();
        }
        this.pool = [];
        if( this.node && cc.isValid(this.node) ){
            this.node.destroy();
        }
        this.node = null;
    }

    /**
     * @description 向缓冲池中存入一个不需要的节点对象
     * 这个函数会自动将目标节点从父节点移除，但不会进行 cleanup 操作
     * 
     */
    put(obj: cc.Node) {
        if (obj && this.pool.indexOf(obj) === -1) {
            //从父节点移除，但不会对进入 cleanup 操作
            obj.removeFromParent(false);
            this.pool.push(obj);
        }
    }

    /**
     * @description 从对象池中取缓冲节点
     * */
    get( ) {
        if (this.pool.length <= 0) {
            if( this.node ){
                let node = cc.instantiate(this.node);
                return node;
            }
            return null;
        }
        let last = this.pool.length - 1;
        let obj = this.pool[last];
        this.pool.length = last;
        return obj;
    }

}

/**
 * 对象池管理器
 */
export class NodePoolManager {

    private static _instance: NodePoolManager = null;
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
        return this.pools.get(type);
    }

    /**
     * @description 删除对象池 
     * @param type 对象池类型
     * */
    deletePool(type: string | NodePool) {
        if( typeof(type) == "string" ){
            if (this.pools.has(type)) {
                let pool = this.pools.get(type);
                //清除对象池数据
                pool.clear();
                //删除对象池
                this.pools.delete(type);
            }
        }else if ( type &&  type instanceof NodePool ){
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

    print( delegate : ManagerPrintDelegate<Map<string, NodePool>>){
        delegate.print(this.pools);
    }

}