import { _decorator ,Node, find, instantiate, Vec3, randomRangeInt, UITransform} from "cc";
import { Config } from "../../../../scripts/common/config/Config";
import { NodePool } from "../../../../scripts/framework/core/nodePool/NodePoolManager";
import GameView from "../../../../scripts/framework/core/ui/GameView";

const {ccclass, property} = _decorator;

@ccclass
export default class NodePoolView extends GameView {

    static getPrefabUrl(){
        return "prefabs/NodePoolView";
    }

    private pool : NodePool|null = null;
    private star : Node = null!;

    onLoad() {
        super.onLoad();

        find("goback", this.node)?.on(Node.EventType.TOUCH_END, () => {
            this.enterBundle(Config.BUNDLE_HALL);
        });

        this.star = find("star",this.node) as Node;
        let op = find("op",this.node) as Node;

        this.content = find("content",this.node) as Node;

        let createNode = find("create",op);
        let deleteNode = find("delete",op);
        let getNode = find("get",op);
        let putNode = find("put",op);
        createNode?.on(Node.EventType.TOUCH_END,this.onCreate,this);
        deleteNode?.on(Node.EventType.TOUCH_END,this.onDelete,this);
        getNode?.on(Node.EventType.TOUCH_END,this.onGet,this);
        putNode?.on(Node.EventType.TOUCH_END,this.onPut,this);

    }

    private onCreate( ){
        this.pool = Manager.nodePoolManager.createPool("Star");
        if ( this.pool) {
            this.pool.cloneNode = instantiate(this.star);
        }
    }

    private onDelete(){
        Manager.nodePoolManager.deletePool(this.pool);
        this.pool = null;
    }

    private onGet(){
        if( this.pool == null ){
            error("未创建对象池")
            return;
        }
        if( !this.content ) return;
        //从对象池中取出一个节点并添加到界面
        let node = this.pool.get();
        if( !node ) return;
        this.content.addChild(node);
        let transform = this.content.getComponent(UITransform) as UITransform;
        node.position = new Vec3(
            randomRangeInt(-transform.width/2,transform.width/2),
            randomRangeInt(-transform.height/2,transform.height/2)
        )
    }

    private onPut(){
        if( this.pool == null ){
            error("未创建对象池")
            return;
        }
        if( !this.content ) return;
        //从界面上取出一个节点，添加到对象池中
        if( this.content.children.length > 0 ){
            this.pool.put(this.content.children[0]);
        }
    }

    onDestroy(){
        this.onDelete();
        super.onDestroy();
    }

}
