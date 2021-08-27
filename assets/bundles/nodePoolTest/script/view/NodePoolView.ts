import { UIView } from "../../../../scripts/framework/ui/UIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NodePoolView extends UIView {

    static getPrefabUrl(){
        return "prefabs/NodePoolView";
    }

    private pool : td.NodePool = null;
    private star : cc.Node = null;

    onLoad() {
        super.onLoad();

        cc.find("goback", this.node).on(cc.Node.EventType.TOUCH_END, () => {
            dispatch(td.Logic.Event.ENTER_HALL);
        });

        this.star = cc.find("star",this.node);
        let op = cc.find("op",this.node);

        this.content = cc.find("content",this.node);

        let createNode = cc.find("create",op);
        let deleteNode = cc.find("delete",op);
        let getNode = cc.find("get",op);
        let putNode = cc.find("put",op);
        createNode.on(cc.Node.EventType.TOUCH_END,this.onCreate,this);
        deleteNode.on(cc.Node.EventType.TOUCH_END,this.onDelete,this);
        getNode.on(cc.Node.EventType.TOUCH_END,this.onGet,this);
        putNode.on(cc.Node.EventType.TOUCH_END,this.onPut,this);

        dispatchEnterComplete({ type: td.Logic.Type.GAME, views: [this] });
    }

    private onCreate( ){
        this.pool = Manager.nodePoolManager.createPool("Star");
        this.pool.cloneNode = cc.instantiate(this.star);
    }

    private onDelete(){
        Manager.nodePoolManager.deletePool(this.pool);
        this.pool = null;
    }

    private onGet(){
        if( this.pool == null ){
            cc.error("未创建对象池")
            return;
        }
        //从对象池中取出一个节点并添加到界面
        let node = this.pool.get();
        this.content.addChild(node);
        node.position = cc.v3(
            cc.randomRangeInt(-this.content.width/2,this.content.width/2),
            cc.randomRangeInt(-this.content.height/2,this.content.height/2)
        )
    }

    private onPut(){
        if( this.pool == null ){
            cc.error("未创建对象池")
            return;
        }
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
