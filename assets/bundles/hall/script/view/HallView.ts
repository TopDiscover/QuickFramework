import UIView from "../../../../script/framework/ui/UIView";
import { BundleConfig } from "../../../../script/common/base/HotUpdate";
import { dispatchEnterComplete, LogicType, LogicEvent } from "../../../../script/common/event/LogicEvent";
import { CommonEvent } from "../../../../script/common/event/CommonEvent";
import { Manager } from "../../../../script/common/manager/Manager";
import { HallData } from "../data/HallData";
import { ProtoMessageHeader } from "../../../../script/framework/net/ProtoMessage";
import { LobbyService } from "../../../../script/common/net/LobbyService";
import { HeartbeatProto } from "../../../../script/common/protocol/HeartbetProto";
import { GameService } from "../../../../script/common/net/GameService";
import ReconnectController from "../../../../script/common/net/ReconnectController";
import { ChatService } from "../../../../script/common/net/ChatService";
import { Config } from "../../../../script/common/config/Config";


const { ccclass, property } = cc._decorator;

@ccclass
export default class HallView extends UIView {
    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    private onClick(ev: cc.Event.EventTouch) {
        Manager.bundleManager.enterBundle(this.bundles[ev.target.userData]);
    }

    private _bundles: BundleConfig[] = [];
    private get bundles() {
        if (this._bundles.length <= 0) {
            this._bundles = [
                new BundleConfig(Manager.getLanguage("hall_view_game_name.0", HallData.bundle), "gameOne", 1),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.1", HallData.bundle), "gameTwo", 2),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.2", HallData.bundle), "tankBattle", 3),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.3", HallData.bundle), "game2048", 4),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.4", HallData.bundle), "NetTest", 5)
            ];
        }
        return this._bundles;
    }

    onLoad() {
        super.onLoad();
        let nodeGames = cc.find("games", this.node);
        let item = cc.find("gameItem", this.node);
        for (let i = 1; i <= this.bundles.length; i++) {
            let game = cc.instantiate(item);
            game.name = `game_${i}`;
            game.active = true;
            game.userData = i - 1
            cc.find("Background/label", game).getComponent(cc.Label).language = Manager.makeLanguage(`hall_view_game_name.${i - 1}`, this.bundle);
            nodeGames.addChild(game);
            game.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
        }

        let bottom_op = cc.find("bottom_op", this.node);
        let setting = cc.find("setting", bottom_op);
        setting.on(cc.Node.EventType.TOUCH_END, () => {
            Manager.alert.show({
                immediatelyCallback: true,
                text: `您确定要退出游戏？`,
                confirmCb: (isOk) => {
                    if (isOk) {
                        dispatch(LogicEvent.ENTER_LOGIN);
                    }
                },
            });
        });

        dispatchEnterComplete({ type: LogicType.HALL, views: [this] });

        //根据自己的需要，连接网络

        //proto
        LobbyService.instance.messageHeader = ProtoMessageHeader;
        LobbyService.instance.heartbeat = HeartbeatProto;

        //json
        // LobbyService.instance.messageHeader = JsonMessageHeader;
        // LobbyService.instance.heartbeat = HeartbeatJson;

        //binaryStream
        // LobbyService.instance.messageHeader = BinaryStreamMessageHeader;
        // LobbyService.instance.heartbeat = HeartbeatBinary;

        LobbyService.instance.connect();

        let node = new cc.Node();
        this.node.addChild(node);
        let reconnect = node.addComponent(ReconnectController);
        reconnect.service = LobbyService.instance;
        LobbyService.instance.maxEnterBackgroundTime = Config.MIN_INBACKGROUND_TIME;

        GameService.instance.messageHeader = ProtoMessageHeader;
        GameService.instance.heartbeat = HeartbeatProto;
        GameService.instance.connect();
        node = new cc.Node();
        this.node.addChild(node);
        reconnect = node.addComponent(ReconnectController);
        reconnect.service = GameService.instance;

        ChatService.instance.messageHeader = ProtoMessageHeader;
        ChatService.instance.heartbeat = HeartbeatProto;
        ChatService.instance.connect();
        node = new cc.Node();
        this.node.addChild(node);
        reconnect = node.addComponent(ReconnectController);
        reconnect.service = ChatService.instance;
    }

    bindingEvents() {
        super.bindingEvents();
        this.registerEvent(CommonEvent.DOWNLOAD_PROGRESS, this.onDownloadProgess);
    }

    private onDownloadProgess(data: { progress: number, config: BundleConfig }) {

        let progressBar: cc.ProgressBar = cc.find(`games/game_${data.config.index}/Background/progressBar`, this.node).getComponent(cc.ProgressBar);
        let progressLabel: cc.Label = cc.find(`games/game_${data.config.index}/Background/progressBar/progress`, this.node).getComponent(cc.Label);
        if (data.progress == -1) {
            progressBar.node.active = false;
        } else if (data.progress < 1) {
            progressBar.node.active = true;
            progressBar.progress = data.progress;
            progressLabel.string = "" + Math.floor(data.progress * 100) + "%";
        } else {
            progressBar.node.active = false;
        }
    }
}
