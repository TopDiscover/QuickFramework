import { ScrollView, Toggle, ToggleContainer, _decorator, Node, find, instantiate, Label, EventTouch, widgetManager } from "cc";
import GameView from "../../../../scripts/common/base/GameView";
import { Config } from "../../../../scripts/common/config/Config";
import { CommonEvent } from "../../../../scripts/common/event/CommonEvent";
import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../scripts/common/event/LogicEvent";
import { ChatService } from "../../../../scripts/common/net/ChatService";
import { CommonService } from "../../../../scripts/common/net/CommonService";
import { GameService } from "../../../../scripts/common/net/GameService";
import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { HeartbeatBinary } from "../../../../scripts/common/protocol/HeartbetBinary";
import { HeartbeatJson } from "../../../../scripts/common/protocol/HeartbetJson";
import { HeartbeatProto } from "../../../../scripts/common/protocol/HeartbetProto";
import { BinaryStreamMessageHeader } from "../../../../scripts/framework/net/BinaryStreamMessage";
import { JsonMessageHeader } from "../../../../scripts/framework/net/JsonMessage";
import { ProtoMessageHeader } from "../../../../scripts/framework/net/ProtoMessage";
import { HallNetHelper } from "../../../hall/script/controller/HallNetHelper";
import { INetHelper } from "../controller/INetHelper";
import { TestChatNetHelper } from "../controller/TestChatNetHelper";
import { TestGameNetHelper } from "../controller/TestGameNetHelper";
import { NetTest } from "../data/NetTestData";


const { ccclass, property } = _decorator;

@ccclass
export default class NetTestView extends GameView {

    public static getPrefabUrl() {
        return "prefabs/NetTestView";
    }

    private reconnects: Toggle[] = [];
    private sends: Toggle[] = [];

    private logScorllView: ScrollView = null!;
    private logItem: Node = null!;
    private connects: Toggle[] = [];
    private enabledServices: Toggle[] = [];
    private netTypes: Toggle[] = [];

    private netType: NetTest.NetType = NetTest.NetType.JSON;

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(CommonEvent.LOBBY_SERVICE_CONNECTED, this.onNetConnected);
        this.registerEvent(CommonEvent.LOBBY_SERVICE_CLOSE, this.onNetClose);

        this.registerEvent(CommonEvent.GAME_SERVICE_CONNECTED, this.onNetConnected);
        this.registerEvent(CommonEvent.GAME_SERVICE_CLOSE, this.onNetClose);

        this.registerEvent(CommonEvent.CHAT_SERVICE_CONNECTED, this.onNetConnected);
        this.registerEvent(CommonEvent.CHAT_SERVICE_CLOSE, this.onNetClose);

        this.registerEvent(CommonEvent.TEST_BINARY_MSG, this.onMessage);
        this.registerEvent(CommonEvent.TEST_JSON_MSG, this.onMessage);
        this.registerEvent(CommonEvent.TEST_PROTO_MSG, this.onMessage);
    }
    private onMessage(hello: string) {
        this.log(`收到：${hello}`);
    }

    private onNetClose(service: CommonService) {
        let isConnected = false;
        if (service == LobbyService.instance) {
            this.connects[NetTest.ServiceType.Lobby].isChecked = isConnected;
        } else if (service == GameService.instance) {
            this.connects[NetTest.ServiceType.Game].isChecked = isConnected;
        } else if (service == ChatService.instance) {
            this.connects[NetTest.ServiceType.Chat].isChecked = isConnected;
        }
        this.log(`${service.serviceName} 断开连接!`);
    }
    private onNetConnected(service: CommonService) {
        let isConnected = true;
        if (service == LobbyService.instance) {
            this.connects[NetTest.ServiceType.Lobby].isChecked = isConnected;
        } else if (service == GameService.instance) {
            this.connects[NetTest.ServiceType.Game].isChecked = isConnected;
        } else if (service == ChatService.instance) {
            this.connects[NetTest.ServiceType.Chat].isChecked = isConnected;
        }
        this.log(`${service.serviceName} 连接成功!`);
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
            dispatch(LogicEvent.ENTER_HALL);
        });

        //重连
        this.initToggleNode(find("reconnet", this.node), this.reconnects);

        //连接网络
        this.initToggleNode(find("connet", this.node), this.connects);

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

        dispatchEnterComplete({ type: LogicType.GAME, views: [this] });
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
            this.connects[i].node.userData = i;
            this.connects[i].node.on('toggle', this.onConnect, this);
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
            this.log(`${service.serviceName} 使用Json方式`);
            service.messageHeader = JsonMessageHeader;
            service.heartbeat = HeartbeatJson;
            service.maxEnterBackgroundTime = Config.MIN_INBACKGROUND_TIME;
        } else if (type == NetTest.NetType.PROTO) {
            this.log(`${service.serviceName} 使用Proto方式`);
            service.messageHeader = ProtoMessageHeader;
            service.heartbeat = HeartbeatProto;
            service.maxEnterBackgroundTime = Config.MAX_INBACKGROUND_TIME;
        } else if (type == NetTest.NetType.BINARY) {
            this.log(`${service.serviceName} 使用Binary方式`);
            service.messageHeader = BinaryStreamMessageHeader;
            service.heartbeat = HeartbeatBinary;
            service.maxEnterBackgroundTime = Config.MAX_INBACKGROUND_TIME;
        } else {
            error(`未知网络类型`);
        }
        this.netType = type;
    }

    private changeNetType(type: NetTest.NetType) {
        this._changeNetType(type, LobbyService.instance);
        this._changeNetType(type, GameService.instance);
        this._changeNetType(type, ChatService.instance);
    }

    private enabledReconnect(service: CommonService, enabled: boolean) {
        service.reconnect.enabled = enabled;
        if (enabled) {
            this.log(`${service.serviceName} 启用重连组件`);
        } else {
            this.log(`${service.serviceName} 禁用重连组件`);
        }
    }
    private onReconnectToggle(toggle: Toggle) {
        if (toggle.node.userData == NetTest.ServiceType.Lobby) {
            this.enabledReconnect(LobbyService.instance, toggle.isChecked);
        } else if (toggle.node.userData == NetTest.ServiceType.Game) {
            this.enabledReconnect(GameService.instance, toggle.isChecked);
        } else if (toggle.node.userData == NetTest.ServiceType.Chat) {
            this.enabledReconnect(ChatService.instance, toggle.isChecked);
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
            this.log(`${service.serviceName} 断开连接中...`);
            service.close();
            return;
        }
        this.log(`${service.serviceName} 连接中...`);
        service.connect();
    }
    private onConnect(toggle: Toggle) {
        let target: Node = toggle.node;
        if (target.userData == NetTest.ServiceType.Lobby) {
            this._connect(LobbyService.instance);
        } else if (target.userData == NetTest.ServiceType.Game) {
            this._connect(GameService.instance);
        } else if (target.userData == NetTest.ServiceType.Chat) {
            this._connect(ChatService.instance);
        }
    }

    private send(helper: INetHelper) {
        let msg = "";
        if (this.netType == NetTest.NetType.JSON) {
            msg = "您好，我是Json消息";
            helper.sendJsonMessage(msg);
        } else if (this.netType == NetTest.NetType.PROTO) {
            msg = "您好，我是Proto消息";
            helper.sendProtoMessage(msg);
        } else if (this.netType == NetTest.NetType.BINARY) {
            msg = "您好，我是Binary消息";
            helper.sendBinaryMessage(msg);
        }
        this.log(`发送消息: ${msg}`);
    }
    private onSend(toggle: Toggle) {
        let target = toggle.node;
        if (target.userData == NetTest.ServiceType.Lobby) {
            this.send(HallNetHelper);
        } else if (target.userData == NetTest.ServiceType.Game) {
            this.send(TestGameNetHelper);
        } else if (target.userData == NetTest.ServiceType.Chat) {
            this.send(TestChatNetHelper);
        }
    }

    private onEnableService(toggle: Toggle) {
        if (toggle.node.userData == NetTest.ServiceType.Lobby) {
            LobbyService.instance.enabled = toggle.isChecked;
        } else if (toggle.node.userData == NetTest.ServiceType.Game) {
            GameService.instance.enabled = toggle.isChecked;
        } else if (toggle.node.userData == NetTest.ServiceType.Chat) {
            ChatService.instance.enabled = toggle.isChecked;
        }
    }
}
