import { HallData } from "../data/HallData";
import SettingView from "../../../../scripts/common/component/SettingView";
import { EventTouch, _decorator, Node, PageView, instantiate, find, Label, ProgressBar, sys, PhysicsSystem2D } from "cc";
import { Update } from "../../../../scripts/framework/core/update/Update";
import { ViewZOrder } from "../../../../scripts/common/config/Config";
import { Macro } from "../../../../scripts/framework/defines/Macros";
import GameView from "../../../../scripts/framework/core/ui/GameView";

const { ccclass, property } = _decorator;

@ccclass
export default class HallView extends GameView {
    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    private onClick(ev: EventTouch) {
        let node: Node = ev.target as Node;
        let config = this.bundles[node.userData];
        if (config) {
            if (config.bundle == "aimLine") {
                //瞄准线，需要使用box2d
                if (!PhysicsSystem2D.PHYSICS_BOX2D) {
                    Manager.tips.show("该功能请把2D物理引擎切换到Box2D");
                    return;
                }
            } else if (config.bundle == "tankBattle") {
                if (!PhysicsSystem2D.PHYSICS_BUILTIN) {
                    Manager.tips.show("该功能请把2D物理引擎切换到内置");
                    return;
                }
            }
            this.enterBundle((ev.target as Node).userData);
        }
    }

    private gamePage: Node = null!;
    private gameItem: Node = null!;
    private pageView: PageView = null!;
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
            let page = instantiate(this.gamePage);
            page.active = true;
            this.pageView.addPage(page);
        }

        for (let i = 0; i < keys.length; i++) {
            let game = instantiate(this.gameItem);
            game.name = `game_${this.bundles[keys[i]].bundle}`;
            game.active = true;
            game.userData = this.bundles[keys[i]].bundle;
            let labelNode = find("Background/label", game);
            if (labelNode) {
                let label = labelNode.getComponent(Label);
                if (label) {
                    label.language = Manager.makeLanguage(`hall_view_game_name.${i}`, this.bundle);
                }
            }
            game.on(Node.EventType.TOUCH_END, this.onClick, this);
            this.updateGameItemStatus(game);
            //计算出所有页
            let page = Math.floor(i / this.PAGE_COUNT);
            this.pageView.getPages()[page].addChild(game);
        }
    }

    onLoad() {
        super.onLoad();
        this.gamePage = find("games", this.node) as Node;
        this.gameItem = find("gameItem", this.node) as Node;
        this.pageView = find("pageview", this.node)?.getComponent(PageView) as PageView;
        this.createPage();

        let bottom_op = find("bottom_op", this.node) as Node;
        let setting = find("setting", bottom_op) as Node;
        setting.on(Node.EventType.TOUCH_END, () => {
            Manager.uiManager.open({ type: SettingView, bundle: Macro.BUNDLE_RESOURCES, zIndex: ViewZOrder.UI, name: "设置界面" });
        });

        let change = find("mial", bottom_op) as Node;
        change.on(Node.EventType.TOUCH_END, () => {
            let lan = Manager.language.getLanguage();
            if (lan == sys.Language.CHINESE) {
                lan = sys.Language.ENGLISH
            } else if (lan == sys.Language.ENGLISH) {
                lan = sys.Language.CHINESE;
            }
            // Manager.language.change(lan);
            // dispatch(HotUpdate.Event.DOWNLOAD_PROGRESS, { progress: this.count, config: {bundle:"aimLine"} });
        });

        this.audioHelper.playMusic("audio/background", this.bundle)
    }

    protected addEvents() {
        super.addEvents();
        this.addEvent(Update.Event.DOWNLOAD_PROGRESS, this.onDownloadProgess);
    }

    private getGameItem(config: Update.Config) {
        let pages = this.pageView.getPages();
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            let item = find(`game_${config.bundle}`, page);
            if (item) {
                return item;
            }
        }
        return null;
    }

    private updateGameItemStatus(item: Node) {
        let bundle = item.userData;
        let status = Manager.updateManager.getStatus(bundle);
        let updateNode = find("Background/update", item);
        if (!updateNode) return;
        if (status == Update.Status.UP_TO_DATE) {
            updateNode.active = false;
            return;
        } else {
            updateNode.active = true;
        }
        let downloading = find("downloading", updateNode);
        let down = find("down", updateNode);
        let update = find("update", updateNode);
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

    private onDownloadProgess(data: { progress: number, config: Update.Config }) {

        let node = this.getGameItem(data.config);
        if (node) {
            let updateNode = find("Background/update", node);
            if (!updateNode) return;

            let downloading = find("downloading", updateNode);
            let down = find("down", updateNode);
            let update = find("update", updateNode);
            if (downloading && down && update) {
                updateNode.active = true;
                let progressBar = find(`downloading`, updateNode)?.getComponent(ProgressBar);
                let progressLabel = find(`downloading/progress`, updateNode)?.getComponent(Label);
                down.active = false;
                update.active = false;

                if (progressBar && progressLabel) {
                    if (data.progress == -1) {
                        updateNode.active = false;
                    } else if (data.progress < 1) {
                        updateNode.active = true;
                        downloading.active = true;
                        progressBar.progress = data.progress;
                        progressLabel.string = "" + Math.floor(data.progress * 100) + "%";
                    } else {
                        updateNode.active = false;
                    }
                }
            }
        }
    }

    show(args ?: any[] | any){
        super.show(args)
        let version = find("version",this.node)?.getComponent(Label);
        if ( version ){
            version.string = Manager.updateManager.getVersion(this.bundle);
        }
    }
}
