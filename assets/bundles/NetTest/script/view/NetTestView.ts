import GameView from "../../../../script/common/base/GameView";
import { CommonEvent } from "../../../../script/common/event/CommonEvent";
import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../script/common/event/LogicEvent";
import { ChatService } from "../../../../script/common/net/ChatService";
import { CommonService } from "../../../../script/common/net/CommonService";
import { GameService } from "../../../../script/common/net/GameService";
import { LobbyService } from "../../../../script/common/net/LobbyService";
import ReconnectController from "../../../../script/common/net/ReconnectController";
import { HeartbeatBinary } from "../../../../script/common/protocol/HeartbetBinary";
import { HeartbeatJson } from "../../../../script/common/protocol/HeartbetJson";
import { HeartbeatProto } from "../../../../script/common/protocol/HeartbetProto";
import { BinaryStreamMessageHeader } from "../../../../script/framework/net/BinaryStreamMessage";
import { JsonMessageHeader } from "../../../../script/framework/net/JsonMessage";
import { ProtoMessageHeader } from "../../../../script/framework/net/ProtoMessage";
import { NetTest } from "../data/NetTestData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NetTestView extends GameView {

    public static getPrefabUrl() {
        return "prefabs/NetTestView";
    }

    private netType: cc.ToggleContainer = null;

    private reconnects: cc.Toggle[] = [];

    private logScorllView : cc.ScrollView = null;
    private logItem : cc.Node =null;
    private connects : cc.Toggle[] = [];

    protected bindingEvents(){
        super.bindingEvents();
        this.registerEvent(CommonEvent.LOBBY_SERVICE_CONNECTED,this.onNetConnected);
        this.registerEvent(CommonEvent.LOBBY_SERVICE_CLOSE,this.onNetClose);

        this.registerEvent(CommonEvent.GAME_SERVICE_CONNECTED,this.onNetConnected);
        this.registerEvent(CommonEvent.GAME_SERVICE_CLOSE,this.onNetClose);

        this.registerEvent(CommonEvent.CHAT_SERVICE_CONNECTED,this.onNetConnected);
        this.registerEvent(CommonEvent.CHAT_SERVICE_CLOSE,this.onNetClose);
    }

    private onNetClose(service : CommonService ) {
        this.log(`${service.serviceName} 断开连接!`);
    }
    private onNetConnected(service : CommonService) {
        this.log(`${service.serviceName} 连接成功!`);
    }

    onDestroy(){
        this.logItem.destroy();
        super.onDestroy();
    }
    onLoad() {
        super.onLoad();

        cc.find("goback", this.node).on(cc.Node.EventType.TOUCH_END, () => {
            dispatch(LogicEvent.ENTER_HALL);
        });

        this.netType = cc.find("netType", this.node).getComponent(cc.ToggleContainer);

        let reconnect = cc.find("reconnet", this.node);
        for (let i = 0; i < 3; i++) {
            let toggle = cc.find(`type${i}`, reconnect).getComponent(cc.Toggle);
            this.reconnects.push(toggle);
        }

        this.logScorllView = cc.find(`log`,this.node).getComponent(cc.ScrollView);
        this.logItem = this.logScorllView.content.getChildByName("item");
        this.logItem.removeFromParent(false);

        let connects = cc.find("connet",this.node);
        for( let i = 0 ; i < 3 ; i++){
            let toggle = cc.find(`type${i}/toggle`,connects).getComponent(cc.Toggle);
            this.connects.push(toggle);
            let node = cc.find(`type${i}/title`,connects);
            node.userData = i;
            node.on(cc.Node.EventType.TOUCH_END,this.onConnect,this)
        }

        this.init();

        dispatchEnterComplete({ type: LogicType.GAME, views: [this] });
    }

    private init() {
        //初始化网络类型设置
        for (let i = 0; i < this.netType.toggleItems.length; i++) {
            this.netType.toggleItems[i].node.userData = i;
            if (this.netType.toggleItems[i].isChecked) {
                this.changeNetType(i);
            }
            this.netType.toggleItems[i].node.on("toggle", this.onNetType, this);
        }

        //重连组件挂载
        for (let i = 0; i < this.reconnects.length; i++) {
            this.reconnects[i].node.userData = i;
            this.reconnects[i].node.on("toggle", this.onReconnectToggle, this);
        }

        //连接网络 
        for( let i = 0 ; i < this.connects.length;i++){
            this.connects[i].node.userData = i;
            this.connects[i].node.on('toggle',this.onConnect,this);
        }
    }

    private onNetType( target : cc.Toggle) {
        this.changeNetType(target.node.userData);
    }

    private _changeNetType(type: NetTest.NetType, service: CommonService) {
        if (type == NetTest.NetType.JSON) {
            this.log(`${service.serviceName} 使用Json方式`);
            service.messageHeader = JsonMessageHeader;
            service.heartbeat = HeartbeatJson;
        } else if (type == NetTest.NetType.PROTO) {
            this.log(`${service.serviceName} 使用Proto方式`);
            service.messageHeader = ProtoMessageHeader;
            service.heartbeat = HeartbeatProto;
        } else if (type == NetTest.NetType.BINARY) {
            this.log(`${service.serviceName} 使用Binary方式`);
            service.messageHeader = BinaryStreamMessageHeader;
            service.heartbeat = HeartbeatBinary;
        } else {
            cc.error(`未知网络类型`);
        }
    }

    private changeNetType(type: NetTest.NetType) {
        this._changeNetType(type, LobbyService.instance);
        this._changeNetType(type, GameService.instance);
        this._changeNetType(type, ChatService.instance);
    }

    private onReconnectToggle(toggle : cc.Toggle) {
        if( toggle.isChecked ){
            //挂载
            if( toggle.node.userData == NetTest.ServiceType.Lobby ){
                this.addReconnect(LobbyService.instance);
            }else if( toggle.node.userData == NetTest.ServiceType.Game ){
                this.addReconnect(GameService.instance);
            }else if( toggle.node.userData == NetTest.ServiceType.Chat ){
                this.addReconnect(ChatService.instance);
            }
        }else{
            //卸载
            if( toggle.node.userData == NetTest.ServiceType.Lobby ){
                this.removeReconnect(LobbyService.instance);
            }else if( toggle.node.userData == NetTest.ServiceType.Game ){
                this.removeReconnect(GameService.instance);
            }else if( toggle.node.userData == NetTest.ServiceType.Chat ){
                this.removeReconnect(ChatService.instance);
            }
        }
    }

    private addReconnect( service : CommonService ){
        if( !this.node.getChildByName(service.serviceName) ){
            let node = new cc.Node();
            node.name = service.serviceName;
            this.node.addChild(node);
            let reconnect = node.addComponent(ReconnectController);
            reconnect.service = service;
            this.log(`添加${service.serviceName} 重连组件`)
        }
    }
    private removeReconnect( service : CommonService ){
        let node = this.node.getChildByName(service.serviceName);
        if( node ){
            this.node.removeChild(node);
            this.log(`移除${service.serviceName} 重连组件`)
        }
    }

    private log( data : string ){
        let item = cc.instantiate(this.logItem);
        item.getComponent(cc.Label).string = data;
        this.logScorllView.content.addChild(item);
        this.logScorllView.scrollToBottom(1);
    }

    private _connect( service : CommonService ){
        if( service.isConnected ){
            this.log(`${service.serviceName} 已经连接`);
            return;
        }
        this.log(`${service.serviceName} 连接中...`);
        service.connect();
    }
    private onConnect( ev : cc.Event.EventTouch ){
        let target : cc.Node = ev.target;
        if( target.userData == NetTest.ServiceType.Lobby ){
            this._connect(LobbyService.instance);
        }else if( target.userData == NetTest.ServiceType.Game ){
            this._connect(GameService.instance);
        }else if( target.userData == NetTest.ServiceType.Chat ){
            this._connect(ChatService.instance);
        }
    }
}
