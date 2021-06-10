import TipsDelegate from "../../framework/ui/TipsDelegate";
import { Manager } from "../../framework/Framework";
import { Config} from "../config/Config";
import { BUNDLE_RESOURCES } from "../../framework/base/Defines";
import { Component ,find,instantiate,Label,log,Node, Prefab, Tween, tween, UIOpacity, Vec3} from "cc";
import { ViewZOrder } from "../config/ViewZOrder";
/**
 * @description 提示
 */

class ToastItem extends Component {
    private _content : Node = null!;
    init( content : string , time : number ){
        this._content = find("content",this.node) as Node;
        if ( this._content ){
            (this._content.getComponent(Label) as Label).string = content;
        }
        this.runTimeOut(time);
    }

    private runTimeOut( time : number ){
        let self = this;
        tween(this._content).delay(time).call(()=>{
            Manager.tips.finishShowItem(self.node);
        }).start();
    }

    public fadeOut( ){
        let self = this;
        Tween.stopAllByTarget(this.node);
        let op = this.node.getComponent(UIOpacity) as UIOpacity;
        tween(this.node).sequence(
            tween().parallel(
                tween().target(this.node).by(0.5,{ position : new Vec3(0,50,0)},{ easing : "expoOut"}),
                tween().target(op).by(1,{ opacity : 255})
            ),
            tween().call(()=>{
            self.node.removeFromParent();
        })).start();
        this.node.removeFromParent();
    }

    public fadeIn( ){
        Tween.stopAllByTarget(this.node);
        let op = this.node.getComponent(UIOpacity) as UIOpacity;
        op.opacity = 0;
        tween(this.node).parallel(
            tween().target(this.node).to(0.5,{
                 position : new Vec3(this.node.position.x,this.node.position.y + 50,this.node.position.z)},
                 {easing : "expoOut"}),
            tween().target(op).by(1,{opacity : 255})
        ).start();
    }
 }

 export default class Tips extends TipsDelegate {

    private static _instance: Tips = null!;
    public static Instance() { return this._instance || (this._instance = new Tips()); }

    private _prefab : Prefab = null!;

    private _queue : Node[] = [];

    private readonly  MAX_NUM = 3; // 最多可以同时显示多少个toast
    private readonly FADE_TIME = 2; // 停留显示2秒。2秒内有可能被顶掉

    /**@description id*/
    private _id : number = 0;

    public preloadPrefab() {
        this.loadPrefab();
    }
    private async loadPrefab( ){
        return new Promise<boolean>(( resolve , reject )=>{
            if ( this._prefab ){
                resolve(true);
                return;
            }else{
                Manager.assetManager.load( 
                    BUNDLE_RESOURCES, 
                    Config.CommonPrefabs.tips,
                    Prefab,
                    (finish, total, item)=>{},
                    (data)=>{
                    if ( data && data.data && data.data instanceof Prefab ){
                        Manager.assetManager.addPersistAsset(Config.CommonPrefabs.tips,data.data,BUNDLE_RESOURCES);
                        this._prefab = data.data;
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                });
            }
        });
    }

    private async _show( msg : string ){
        let finish = await this.loadPrefab();
        if ( finish ){
            let node = instantiate(this._prefab);
            if ( node ){
                let itemComp = node.addComponent(ToastItem);
                itemComp.init(msg,this.FADE_TIME);
                itemComp.fadeIn();
                node.userData = this._id++;
                node.setSiblingIndex(ViewZOrder.Tips);
                node.name = `Tips${node.userData}`;
                Manager.uiManager.getCanvas().addChild(node);

                //整体上移
                let length = this._queue.length;
                for ( let i = 0 ; i < length ; i++ ){
                    let item = this._queue[i];
                    item.opacity = 255;
                    Tween.stopAllByTarget(item);
                }

                //压入
                this._queue.push(node);

                //删除超出的
                if ( this._queue.length > this.MAX_NUM ){
                    let item = this._queue.shift() as Node;
                    item.getComponent(ToastItem)?.fadeOut();
                }
            }
        }
    }

    public show( msg : string ){
        if ( msg == null || msg == undefined || msg == ""){
            return;
        }
        log("Toast.show msg=%s",msg);
        this._show(msg);
    }

    public finishShowItem( item : Node ){
        for ( let i = 0 ; i < this._queue.length ; i++ ){
            let tempItem = this._queue[i];
            if ( tempItem.userData == item.userData ){
                this._queue.splice(i,1);
                item.getComponent(ToastItem)?.fadeOut();
                break;
            }
        }
    }

    public clear( ){
        let item : Node = null!;
        while( item = this._queue.pop() as Node ){
            Tween.stopAllByTarget(item);
            item.removeFromParent();
        }
    }

 }