import { UIView } from "../../../../scripts/framework/ui/UIView";
import { BundleConfig } from "../../../../scripts/common/base/HotUpdate";
import { CommonEvent } from "../../../../scripts/common/event/CommonEvent";
import { HallData } from "../data/HallData";
import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { GameService } from "../../../../scripts/common/net/GameService";
import { ChatService } from "../../../../scripts/common/net/ChatService";
import SettingView from "../../../../scripts/common/component/SettingView";


const { ccclass, property } = cc._decorator;

@ccclass
export default class HallView extends UIView {
    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    private onClick(ev: cc.Event.EventTouch) {
        Manager.bundleManager.enterBundle(this.bundles[ev.target.userData]);
    }

    private gamePage: cc.Node = null;
    private gameItem: cc.Node = null;
    private pageView: cc.PageView = null;
    private readonly PAGE_COUNT = 6;
    private testProgress = 0;

    private _bundles: BundleConfig[] = [];
    private get bundles() {
        if (this._bundles.length <= 0) {
            this._bundles = [
                new BundleConfig(Manager.getLanguage("hall_view_game_name.0", HallData.bundle), "gameOne", 1),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.1", HallData.bundle), "gameTwo", 2),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.2", HallData.bundle), "tankBattle", 3),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.3", HallData.bundle), "loadTest", 4),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.4", HallData.bundle), "netTest", 5),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.5", HallData.bundle), "aimLine", 6),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.6", HallData.bundle), "nodePoolTest", 7),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.7", HallData.bundle), "shaders", 8),
                new BundleConfig(Manager.getLanguage("hall_view_game_name.8", HallData.bundle), "eliminate", 9),
            ];
        }
        return this._bundles;
    }

    private createPage() {

        //计算出总页数
        let pageCount = Math.ceil(this.bundles.length / this.PAGE_COUNT);
        for (let i = 0; i < pageCount; i++) {
            let page = cc.instantiate(this.gamePage);
            page.active = true;
            this.pageView.addPage(page);
        }

        for (let i = 0; i < this.bundles.length; i++) {
            let game = cc.instantiate(this.gameItem);
            game.name = `game_${i + 1}`;
            game.active = true;
            game.userData = i
            cc.find("Background/label", game).getComponent(cc.Label).language = Manager.makeLanguage(`hall_view_game_name.${i}`, this.bundle);
            game.on(cc.Node.EventType.TOUCH_END, this.onClick, this);

            //计算出所有页
            let page = Math.floor(i / this.PAGE_COUNT);
            this.pageView.getPages()[page].addChild(game);
        }
    }

    onLoad() {
        super.onLoad();
        this.gamePage = cc.find("games", this.node);
        this.gameItem = cc.find("gameItem", this.node);
        this.pageView = cc.find("pageview", this.node).getComponent(cc.PageView);
        this.createPage();

        let bottom_op = cc.find("bottom_op", this.node);
        let setting = cc.find("setting", bottom_op);
        setting.on(cc.Node.EventType.TOUCH_END, () => {
            Manager.uiManager.open({ type: SettingView, bundle: td.Macro.BUNDLE_RESOURCES, zIndex: td.ViewZOrder.UI, name: "设置界面" });
        });

        LobbyService.instance.enabled = false;
        GameService.instance.enabled = false;
        ChatService.instance.enabled = false;


        let mail = cc.find("mial", bottom_op);
        mail.on(cc.Node.EventType.TOUCH_END, () => {
            let lan = Manager.language.getLanguage();
            if( lan == cc.sys.LANGUAGE_CHINESE){
                lan = cc.sys.LANGUAGE_ENGLISH
            }else if( lan == cc.sys.LANGUAGE_ENGLISH ) {
                lan = cc.sys.LANGUAGE_CHINESE;
            }
            Manager.language.change(lan);
            // dispatch(CommonEvent.DOWNLOAD_PROGRESS, { progress: this.testProgress, config: this.bundles[0] });
            // this.testProgress += 0.1;
            // if (this.testProgress >= 1) {
            //     this.testProgress = 0;
            // }
        });

        // this.audioHelper.playMusic("audio/background",this.bundle)

        dispatchEnterComplete({ type: td.Logic.Type.HALL, views: [this] });
    }

    bindingEvents() {
        super.bindingEvents();
        this.registerEvent(CommonEvent.DOWNLOAD_PROGRESS, this.onDownloadProgess);
    }

    private getGameItem(config: BundleConfig) {
        let pages = this.pageView.getPages();
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            let item = cc.find(`game_${config.index}`, page);
            if (item) {
                return item;
            }
        }
        return null;
    }

    private onDownloadProgess(data: { progress: number, config: BundleConfig }) {

        let node = this.getGameItem(data.config);
        if (node) {
            let progressBar: cc.ProgressBar = cc.find(`Background/progressBar`, node).getComponent(cc.ProgressBar);
            let progressLabel: cc.Label = cc.find(`Background/progressBar/progress`, node).getComponent(cc.Label);
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
}
