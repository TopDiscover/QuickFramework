import { ScrollView, Toggle, _decorator, Node, find, instantiate, Label, EventTouch } from "cc";
import GameView from "../../../../scripts/framework/core/ui/GameView";
import { CommonEvent } from "../../../../scripts/common/event/CommonEvent";
import { ChatService } from "../../../../scripts/common/net/ChatService";
import { CommonService } from "../../../../scripts/common/net/CommonService";
import { GameService } from "../../../../scripts/common/net/GameService";
import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { HeartbeatBinary } from "../../../../scripts/common/protocol/HeartbetBinary";
import { HeartbeatJson } from "../../../../scripts/common/protocol/HeartbetJson";
import { HeartbeatProto } from "../../../../scripts/common/protocol/HeartbetProto";
import { HallSender } from "../../../hall/script/net/HallSender";
import { ChatSender } from "../net/ChatSender";
import { GameSender } from "../net/GameSender";
import { NetTest } from "../data/NetTestData";
import { Config } from "../../../../scripts/common/config/Config";


const { ccclass, property } = _decorator;

@ccclass
export default class NetTestView extends GameView {

    public static getPrefabUrl() {
        return "prefabs/NetTestView";
    }

    private get lobbyService(){
        return Manager.serviceManager.get(LobbyService) as LobbyService;
    }
    private get gameService(){
        return Manager.serviceManager.get(GameService) as GameService;
    }
    private get chatService(){
        return Manager.serviceManager.get(ChatService) as ChatService;
    }

    private reconnects: Toggle[] = [];
    private sends: Toggle[] = [];

    private logScorllView: ScrollView = null!;
    private logItem: Node = null!;
    private connects: Node[] = [];
    private enabledServices: Toggle[] = [];
    private netTypes: Toggle[] = [];

    protected addEvents() {
        super.addEvents();
        this.addEvent(CommonEvent.LOBBY_SERVICE_CONNECTED, this.onNetConnected);
        this.addEvent(CommonEvent.LOBBY_SERVICE_CLOSE, this.onNetClose);

        this.addEvent(CommonEvent.GAME_SERVICE_CONNECTED, this.onNetConnected);
        this.addEvent(CommonEvent.GAME_SERVICE_CLOSE, this.onNetClose);

        this.addEvent(CommonEvent.CHAT_SERVICE_CONNECTED, this.onNetConnected);
        this.addEvent(CommonEvent.CHAT_SERVICE_CLOSE, this.onNetClose);

        this.addEvent(CommonEvent.TEST_BINARY_MSG, this.onMessage);
        this.addEvent(CommonEvent.TEST_JSON_MSG, this.onMessage);
        this.addEvent(CommonEvent.TEST_PROTO_MSG, this.onMessage);
    }
    private onMessage(hello: string) {
        this.log(`收到：${hello}`);
    }

    private setConnected( isConnected : boolean , node : Node ){
        if( node ){
            let mark = node.getChildByName("checkmark");
            if( mark ){
                mark.active = isConnected;
            }
        }
    }
    private onNetClose(service: CommonService) {
        let isConnected = false;
        if (service == this.lobbyService) {
            this.setConnected(isConnected,this.connects[NetTest.ServiceType.Lobby])
        } else if (service == this.gameService) {
            this.setConnected(isConnected,this.connects[NetTest.ServiceType.Game])
        } else if (service == this.chatService) {
            this.setConnected(isConnected,this.connects[NetTest.ServiceType.Chat])
        }
        this.log(`${service.module} 断开连接!`);
    }
    private onNetConnected(service: CommonService) {
        let isConnected = true;
        if (service == this.lobbyService) {
            this.setConnected(isConnected,this.connects[NetTest.ServiceType.Lobby])
        } else if (service == this.gameService) {
            this.setConnected(isConnected,this.connects[NetTest.ServiceType.Game])
        } else if (service == this.chatService) {
            this.setConnected(isConnected,this.connects[NetTest.ServiceType.Chat])
        }
        this.log(`${service.module} 连接成功!`);
    }

    onDestroy() {
        this.logItem.destroy();
        super.onDestroy();
    }

    private initToggleNode(node: Node | null, out: Toggle[]) {
        if (!node) return;
        for (let i = 0; i < 3; i++) {
            let toggle = find(`type${i}`, node)?.getComponent(Toggle);
            if (toggle) {
                out.push(toggle);
            }
        }
    }

    onLoad() {
        super.onLoad();

        //返回
        find("goback", this.node)?.on(Node.EventType.TOUCH_END, () => {
            this.enterBundle(Config.BUNDLE_HALL);
        });

        //重连
        this.initToggleNode(find("reconnet", this.node), this.reconnects);

        //连接网络
        let connet = find("connet", this.node);
        if( connet ){
            for (let i = 0; i < 3; i++) {
                let node = find(`type${i}`, connet);
                if (node) {
                    this.connects.push(node);
                }
            }
        }

        //发送消息
        this.initToggleNode(find("send", this.node), this.sends);

        //是否启用该网络
        this.initToggleNode(find("enabled", this.node), this.enabledServices);

        //网络类型
        this.initToggleNode(find("netType", this.node), this.netTypes);

        this.logScorllView = find(`log`, this.node)?.getComponent(ScrollView) as ScrollView;
        this.logItem = this.logScorllView.content?.getChildByName("item") as Node;
        this.logItem.removeFromParent();

        this.init();
    }

    private init() {
        //初始化网络类型设置
        for (let i = 0; i < this.netTypes.length; i++) {
            let item = this.netTypes[i];
            if (item) {
                item.node.userData = i;
                if (item.isChecked) {
                    this.changeNetType(i);
                }
                item.node.on("toggle", this.onNetType, this);
            }
        }


        //重连组件挂载
        for (let i = 0; i < this.reconnects.length; i++) {
            this.reconnects[i].node.userData = i;
            this.reconnects[i].node.on("toggle", this.onReconnectToggle, this);
            this.onReconnectToggle(this.reconnects[i]);
        }

        //连接网络 
        for (let i = 0; i < this.connects.length; i++) {
            this.connects[i].userData = i;
            this.connects[i].on( Node.EventType.TOUCH_END, this.onConnect, this);
        }

        //发送消息
        for (let i = 0; i < this.sends.length; i++) {
            this.sends[i].node.userData = i;
            this.sends[i].node.on("toggle", this.onSend, this);
        }

        //是否启用网络
        for (let i = 0; i < this.enabledServices.length; i++) {
            this.enabledServices[i].node.userData = i;
            this.enabledServices[i].node.on("toggle", this.onEnableService, this);
            this.onEnableService(this.enabledServices[i]);
        }
    }

    private onNetType(target: Toggle) {
        this.changeNetType(target.node.userData);
    }

    private _changeNetType(type: NetTest.NetType, service: CommonService) {
        if (type == NetTest.NetType.JSON) {
            this.log(`${service.module} 使用Json方式`);
            service.heartbeat = HeartbeatJson;
            service.maxEnterBackgroundTime = Config.MIN_INBACKGROUND_TIME;
        } else if (type == NetTest.NetType.PROTO) {
            this.log(`${service.module} 使用Proto方式`);
            service.heartbeat = HeartbeatProto;
            service.maxEnterBackgroundTime = Config.MAX_INBACKGROUND_TIME;
        } else if (type == NetTest.NetType.BINARY) {
            this.log(`${service.module} 使用Binary方式`);
            service.heartbeat = HeartbeatBinary;
            service.maxEnterBackgroundTime = Config.MAX_INBACKGROUND_TIME;
        } else {
            Log.e(`未知网络类型`);
        }
    }

    private changeNetType(type: NetTest.NetType) {
        this._changeNetType(type, this.lobbyService);
        this._changeNetType(type, this.gameService);
        this._changeNetType(type, this.chatService);
    }

    private enabledReconnect(service: CommonService, enabled: boolean) {
        if ( service.reconnectHandler ){
            service.reconnectHandler.enabled = enabled;
        }
        if (enabled) {
            this.log(`${service.module} 启用重连组件`);
        } else {
            this.log(`${service.module} 禁用重连组件`);
        }
    }
    private onReconnectToggle(toggle: Toggle) {
        if (toggle.node.userData == NetTest.ServiceType.Lobby) {
            this.enabledReconnect(this.lobbyService, toggle.isChecked);
        } else if (toggle.node.userData == NetTest.ServiceType.Game) {
            this.enabledReconnect(this.gameService, toggle.isChecked);
        } else if (toggle.node.userData == NetTest.ServiceType.Chat) {
            this.enabledReconnect(this.chatService, toggle.isChecked);
        }
    }

    private log(data: string) {
        let item = instantiate(this.logItem);
        if (item) {
            let lb = item.getComponent(Label);
            if (lb) {
                lb.string = data;
            }
            if( this.logScorllView.content ){
                this.logScorllView.content.addChild(item);
            }
            
            this.logScorllView.scrollToBottom(1);
        }
    }

    private _connect(service: CommonService) {
        if (service.isConnected) {
            //断开连接
            this.log(`${service.module} 断开连接中...`);
            service.close();
            return;
        }
        this.log(`${service.module} 连接中...`);
        service.connect();
    }
    private onConnect(ev: EventTouch) {
        let target = ev.target as Node;
        if (target.userData == NetTest.ServiceType.Lobby) {
            this._connect(this.lobbyService);
        } else if (target.userData == NetTest.ServiceType.Game) {
            this._connect(this.gameService);
        } else if (target.userData == NetTest.ServiceType.Chat) {
            this._connect(this.chatService);
        }
    }

    private onSend(toggle: Toggle) {
        let target = toggle.node;
        if (target.userData == NetTest.ServiceType.Lobby) {
            let sender = Manager.netHelper.getSender(HallSender);
            if ( sender ){
                sender.sendEx();
            }
        } else if (target.userData == NetTest.ServiceType.Game) {
            let sender = Manager.netHelper.getSender(GameSender);
            if ( sender ){
                sender.sendEx();
            }
        } else if (target.userData == NetTest.ServiceType.Chat) {
            let sender = Manager.netHelper.getSender(ChatSender);
            if ( sender ){
                sender.sendEx();
            }
        }
    }

    private onEnableService(toggle: Toggle) {
        if (toggle.node.userData == NetTest.ServiceType.Lobby) {
            this.lobbyService.enabled = toggle.isChecked;
        } else if (toggle.node.userData == NetTest.ServiceType.Game) {
            this.gameService.enabled = toggle.isChecked;
        } else if (toggle.node.userData == NetTest.ServiceType.Chat) {
            this.chatService.enabled = toggle.isChecked;
        }
    }
}
