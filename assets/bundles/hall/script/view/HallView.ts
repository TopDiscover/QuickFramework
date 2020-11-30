import UIView from "../../../../script/framework/ui/UIView";
import { BundleConfig } from "../../../../script/common/base/HotUpdate";
import { dispatchEnterComplete, LogicType, LogicEvent } from "../../../../script/common/event/LogicEvent";
import { CommonEvent } from "../../../../script/common/event/CommonEvent";
import { Manager } from "../../../../script/common/manager/Manager";
import { HallData } from "../data/HallData";
import { i18n } from "../../../../script/common/language/LanguageImpl";
import { LobbyService } from "../../../../script/common/net/LobbyService";
import { GameService } from "../../../../script/common/net/GameService";
import { ChatService } from "../../../../script/common/net/ChatService";


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
                new BundleConfig(Manager.getLanguage("hall_view_game_name.3", HallData.bundle), "LoadTest", 4),
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
                text: i18n.quitGame,
                confirmCb: (isOk) => {
                    if (isOk) {
                        dispatch(LogicEvent.ENTER_LOGIN);
                    }
                },
            });
        });

        LobbyService.instance.enabled = false;
        GameService.instance.enabled = false;
        ChatService.instance.enabled = false;

        dispatchEnterComplete({ type: LogicType.HALL, views: [this] });
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
