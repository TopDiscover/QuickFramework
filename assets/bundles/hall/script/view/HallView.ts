import { HallData } from "../data/HallData";
import SettingView from "../../../../scripts/common/component/SettingView";
import { Update } from "../../../../scripts/framework/core/update/Update";
import { ViewZOrder } from "../../../../scripts/common/config/Config";
import { Macro } from "../../../../scripts/framework/defines/Macros";
import GameView from "../../../../scripts/framework/core/ui/GameView";
import { UpdateItem } from "../../../../scripts/framework/core/update/UpdateItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HallView extends GameView {
    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    private onClick(ev: cc.Event.EventTouch) {
        this.enterBundle((ev.target as cc.Node).userData);
    }

    private gamePage: cc.Node = null;
    private gameItem: cc.Node = null;
    private pageView: cc.PageView = null;
    private readonly PAGE_COUNT = 6;

    private get bundles() {
        let data = Manager.dataCenter.get(HallData) as HallData;
        return data.games;
    }

    private createPage() {

        //计算出总页数
        let keys = Object.keys(this.bundles);
        let pageCount = Math.ceil(keys.length / this.PAGE_COUNT);
        for (let i = 0; i < pageCount; i++) {
            let page = cc.instantiate(this.gamePage);
            page.active = true;
            this.pageView.addPage(page);
        }

        for (let i = 0; i < keys.length; i++) {
            let game = cc.instantiate(this.gameItem);
            game.name = `game_${this.bundles[keys[i]].bundle}`;
            game.active = true;
            game.userData = this.bundles[keys[i]].bundle;
            cc.find("Background/label", game).getComponent(cc.Label).language = Manager.makeLanguage(`hall_view_game_name.${i}`, this.bundle);
            game.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
            this.updateGameItemStatus(game);
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
            Manager.uiManager.open({ type: SettingView, bundle: Macro.BUNDLE_RESOURCES, zIndex: ViewZOrder.UI, name: "设置界面" });
        });

        let mail = cc.find("mial", bottom_op);
        mail.on(cc.Node.EventType.TOUCH_END, () => {
            let lan = Manager.language.getLanguage();
            if (lan == cc.sys.LANGUAGE_CHINESE) {
                lan = cc.sys.LANGUAGE_ENGLISH
            } else if (lan == cc.sys.LANGUAGE_ENGLISH) {
                lan = cc.sys.LANGUAGE_CHINESE;
            }
            // Manager.language.change(lan);
            dispatch(Update.Event.DOWNLOAD_PROGRESS,{})
        });

    }

    protected addEvents() {
        super.addEvents();
        this.addEvent(Update.Event.DOWNLOAD_PROGRESS, this.onDownloadProgess);
    }

    private getGameItem(bundle: string) {
        let pages = this.pageView.getPages();
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            let item = cc.find(`game_${bundle}`, page);
            if (item) {
                return item;
            }
        }
        return null;
    }

    private updateGameItemStatus(item: cc.Node) {
        let bundle = item.userData;
        let status = Manager.updateManager.getStatus(bundle);
        let updateNode = cc.find("Background/update", item);
        if (!updateNode) return;
        if (status == Update.Status.UP_TO_DATE) {
            updateNode.active = false;
            return;
        } else {
            updateNode.active = true;
        }
        let downloading = cc.find("downloading", updateNode);
        let down = cc.find("down", updateNode);
        let update = cc.find("update", updateNode);
        if (downloading && down && update) {
            if (status == Update.Status.NEED_DOWNLOAD) {
                downloading.active = false;
                down.active = true;
                update.active = false;
            } else {
                downloading.active = false;
                down.active = false;
                update.active = true;
            }
        }
    }

    onDownloadProgess(info: Update.DownLoadInfo) {

        let node = this.getGameItem(info.bundle);
        if (node) {
            let updateNode = cc.find("Background/update", node);
            if (!updateNode) return;

            let downloading = cc.find("downloading", updateNode);
            let down = cc.find("down", updateNode);
            let update = cc.find("update", updateNode);
            if (downloading && down && update) {
                updateNode.active = true;
                let progressBar = cc.find(`downloading`, updateNode)?.getComponent(cc.ProgressBar);
                let progressLabel = cc.find(`downloading/progress`, updateNode)?.getComponent(cc.Label);
                down.active = false;
                update.active = false;

                if (progressBar && progressLabel) {
                    if (info.progress == -1) {
                        updateNode.active = false;
                    } else if (info.progress < 1) {
                        updateNode.active = true;
                        downloading.active = true;
                        progressBar.progress = info.progress;
                        progressLabel.string = "" + Math.floor(info.progress * 100) + "%";
                    } else {
                        updateNode.active = false;
                    }
                }
            }
        }
    }

    toUpdateStatus(item: UpdateItem) {
        let node = this.getGameItem(item.bundle);
        if ( !node ) return;
        let updateNode = cc.find("Background/update", node);
        if (!updateNode) return;

        let downloading = cc.find("downloading", updateNode);
        let down = cc.find("down", updateNode);
        let update = cc.find("update", updateNode);
        if (downloading && down && update) {
            downloading.active = false;
            down.active = false;
            update.active = true;
        }
    }

    show(args?: any[] | any) {
        super.show(args)
        let version = cc.find("version",this.node)?.getComponent(cc.Label);
        if ( version ){
            version.string = Manager.updateManager.getVersion(this.bundle);
        }
    }
}
