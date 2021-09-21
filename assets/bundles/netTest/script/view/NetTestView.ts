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


const { ccclass, property } = cc._decorator;

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
    private netToggleContainer: cc.ToggleContainer = null;

    private reconnects: cc.Toggle[] = [];

    private logScorllView: cc.ScrollView = null;
    private logItem: cc.Node = null;
    private connects: cc.Toggle[] = [];
    private enabledServices: cc.Toggle[] = [];

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

    private onNetClose(service: CommonService) {
        let isConnected = false;
        if (service == this.lobbyService) {
            this.connects[NetTest.ServiceType.Lobby].isChecked = isConnected;
        } else if (service == this.gameService) {
            this.connects[NetTest.ServiceType.Game].isChecked = isConnected;
        } else if (service == this.chatService) {
            this.connects[NetTest.ServiceType.Chat].isChecked = isConnected;
        }
        this.log(`${service.module} 断开连接!`);
    }
    private onNetConnected(service: CommonService) {
        let isConnected = true;
        if (service == this.lobbyService) {
            this.connects[NetTest.ServiceType.Lobby].isChecked = isConnected;
        } else if (service == this.gameService) {
            this.connects[NetTest.ServiceType.Game].isChecked = isConnected;
        } else if (service == this.chatService) {
            this.connects[NetTest.ServiceType.Chat].isChecked = isConnected;
        }
        this.log(`${service.module} 连接成功!`);
    }

    onDestroy() {
        this.logItem.destroy();
        super.onDestroy();
    }
    onLoad() {
        super.onLoad();

        cc.find("goback", this.node).on(cc.Node.EventType.TOUCH_END, () => {
            this.enterBundle(Config.BUNDLE_HALL);
        });

        this.netToggleContainer = cc.find("netType", this.node).getComponent(cc.ToggleContainer);

        let reconnect = cc.find("reconnet", this.node);
        for (let i = 0; i < 3; i++) {
            let toggle = cc.find(`type${i}`, reconnect).getComponent(cc.Toggle);
            this.reconnects.push(toggle);
        }

        this.logScorllView = cc.find(`log`, this.node).getComponent(cc.ScrollView);
        this.logItem = this.logScorllView.content.getChildByName("item");
        this.logItem.removeFromParent(false);

        let connects = cc.find("connet", this.node);
        for (let i = 0; i < 3; i++) {
            let toggle = cc.find(`type${i}/toggle`, connects).getComponent(cc.Toggle);
            this.connects.push(toggle);
            let node = cc.find(`type${i}/title`, connects);
            node.userData = i;
            node.on(cc.Node.EventType.TOUCH_END, this.onConnect, this)
        }

        let send = cc.find("send", this.node);
        for (let i = 0; i < 3; i++) {
            let node = cc.find(`type${i}/title`, send);
            node.userData = i;
            node.on(cc.Node.EventType.TOUCH_END, this.onSend, this);
        }

        let enabled = cc.find("enabled", this.node);
        for (let i = 0; i < 3; i++) {
            let toggle = cc.find(`type${i}`, enabled).getComponent(cc.Toggle);
            this.enabledServices.push(toggle);
        }

        this.init();
    }

    private init() {
        //初始化网络类型设置
        for (let i = 0; i < this.netToggleContainer.toggleItems.length; i++) {
            this.netToggleContainer.toggleItems[i].node.userData = i;
            if (this.netToggleContainer.toggleItems[i].isChecked) {
                this.changeNetType(i);
            }
            this.netToggleContainer.toggleItems[i].node.on("toggle", this.onNetType, this);
        }

        //重连组件挂载
        for (let i = 0; i < this.reconnects.length; i++) {
            this.reconnects[i].node.userData = i;
            this.reconnects[i].node.on("toggle", this.onReconnectToggle, this);
            this.onReconnectToggle(this.reconnects[i]);
        }

        //连接网络 
        for (let i = 0; i < this.connects.length; i++) {
            this.connects[i].node.userData = i;
            this.connects[i].node.on('toggle', this.onConnect, this);
        }

        //是否启用网络
        for (let i = 0; i < this.enabledServices.length; i++) {
            this.enabledServices[i].node.userData = i;
            this.enabledServices[i].node.on("toggle", this.onEnableService, this);
            this.onEnableService(this.enabledServices[i]);
        }
    }

    private onNetType(target: cc.Toggle) {
        this.changeNetType(target.node.userData);
    }

    private _changeNetType(type: NetTest.NetType, service: CommonService) {
        if (type == NetTest.NetType.JSON) {
            this.log(`${service.module} 使用Json方式`);
            // service.messageHeader = JsonMessageHeader;
            service.heartbeat = HeartbeatJson;
            service.maxEnterBackgroundTime = Config.MIN_INBACKGROUND_TIME;
        } else if (type == NetTest.NetType.PROTO) {
            this.log(`${service.module} 使用Proto方式`);
            // service.messageHeader = ProtoMessageHeader;
            service.heartbeat = HeartbeatProto;
            service.maxEnterBackgroundTime = Config.MAX_INBACKGROUND_TIME;
        } else if (type == NetTest.NetType.BINARY) {
            this.log(`${service.module} 使用Binary方式`);
            // service.messageHeader = BinaryStreamMessageHeader;
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
    private onReconnectToggle(toggle: cc.Toggle) {
        if (toggle.node.userData == NetTest.ServiceType.Lobby) {
            this.enabledReconnect(this.lobbyService, toggle.isChecked);
        } else if (toggle.node.userData == NetTest.ServiceType.Game) {
            this.enabledReconnect(this.gameService, toggle.isChecked);
        } else if (toggle.node.userData == NetTest.ServiceType.Chat) {
            this.enabledReconnect(this.chatService, toggle.isChecked);
        }
    }

    private log(data: string) {
        let item = cc.instantiate(this.logItem);
        item.getComponent(cc.Label).string = data;
        this.logScorllView.content.addChild(item);
        this.logScorllView.scrollToBottom(1);
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
    private onConnect(ev: cc.Event.EventTouch) {
        let target: cc.Node = ev.target;
        if (target.userData == NetTest.ServiceType.Lobby) {
            this._connect(this.lobbyService);
        } else if (target.userData == NetTest.ServiceType.Game) {
            this._connect(this.gameService);
        } else if (target.userData == NetTest.ServiceType.Chat) {
            this._connect(this.chatService);
        }
    }

    private onSend(ev: cc.Event.EventTouch) {
        let target: cc.Node = ev.target;
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

    private onEnableService(toggle: cc.Toggle) {
        if (toggle.node.userData == NetTest.ServiceType.Lobby) {
            this.lobbyService.enabled = toggle.isChecked;
        } else if (toggle.node.userData == NetTest.ServiceType.Game) {
            this.gameService.enabled = toggle.isChecked;
        } else if (toggle.node.userData == NetTest.ServiceType.Chat) {
            this.chatService.enabled = toggle.isChecked;
        }
    }
}
