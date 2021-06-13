import { _decorator ,Node, find, instantiate, Vec3, randomRangeInt, UITransform} from "cc";
import GameView from "../../../../scripts/common/base/GameView";
import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../scripts/common/event/LogicEvent";
import { Manager } from "../../../../scripts/common/manager/Manager";
import { NodePool, NodePoolManager } from "../../../../scripts/framework/base/NodePoolManager";

const {ccclass, property} = _decorator;

@ccclass
export default class NodePoolView extends GameView {

    static getPrefabUrl(){
        return "prefabs/NodePoolView";
    }

    private pool : NodePool | null = null;
    private star : Node = null!;

    onLoad() {
        super.onLoad();

        find("goback", this.node)?.on(Node.EventType.TOUCH_END, () => {
            dispatch(LogicEvent.ENTER_HALL);
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

        dispatchEnterComplete({ type: LogicType.GAME, views: [this] });
    }

    private onCreate( ){
        this.pool = Manager.nodePoolManager.createPool("Star");
        this.pool.cloneNode = instantiate(this.star);
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
