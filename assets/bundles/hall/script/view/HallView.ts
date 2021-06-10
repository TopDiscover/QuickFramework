import UIView from "../../../../scripts/framework/ui/UIView";
import { BundleConfig } from "../../../../scripts/common/base/HotUpdate";
import { dispatchEnterComplete, LogicType, LogicEvent } from "../../../../scripts/common/event/LogicEvent";
import { CommonEvent } from "../../../../scripts/common/event/CommonEvent";
import { Manager } from "../../../../scripts/common/manager/Manager";
import { HallData } from "../data/HallData";
import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { GameService } from "../../../../scripts/common/net/GameService";
import { ChatService } from "../../../../scripts/common/net/ChatService";
import SettingView from "../../../../scripts/common/component/SettingView";
import { BUNDLE_RESOURCES } from "../../../../scripts/framework/base/Defines";
import { EventTouch, _decorator,Node, PageView, instantiate, find, Label, ProgressBar, sys } from "cc";
import { ViewZOrder } from "../../../../scripts/common/config/ViewZOrder";


const { ccclass, property } = _decorator;

@ccclass
export default class HallView extends UIView {
    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    private onClick(ev: EventTouch) {
        let node : Node = ev.target as Node;
        Manager.bundleManager.enterBundle(this.bundles[node.userData]);
    }

    private gamePage : Node = null!;
    private gameItem : Node = null!;
    private pageView : PageView = null!;
    private readonly PAGE_COUNT = 6;

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

    private createPage(){

        //计算出总页数
        let pageCount = Math.ceil( this.bundles.length / this.PAGE_COUNT );
        for( let i = 0 ;i < pageCount ; i++ ){
            let page = instantiate(this.gamePage);
            page.active = true;
            this.pageView.addPage(page);
        }

        for (let i = 0; i < this.bundles.length; i++) {
            let game = instantiate(this.gameItem);
            game.name = `game_${i + 1}`;
            game.active = true;
            game.userData = i;
            let labelNode = find("Background/label", game);
            if( labelNode ){
                let label = labelNode.getComponent(Label);
                if( label ){
                    label.language = Manager.makeLanguage(`hall_view_game_name.${i}`, this.bundle);
                }
            }
            game.on(Node.EventType.TOUCH_END, this.onClick, this);

            //计算出所有页
            let page = Math.floor(i/this.PAGE_COUNT);
            this.pageView.getPages()[page].addChild(game);
        }
    }

    onLoad() {
        super.onLoad();
        this.gamePage = find("games", this.node) as Node;
        this.gameItem = find("gameItem", this.node) as Node;
        this.pageView = find("pageview",this.node)?.getComponent(PageView) as PageView;
        this.createPage();

        let bottom_op = find("bottom_op", this.node) as Node;
        let setting = find("setting", bottom_op) as Node;
        setting.on(Node.EventType.TOUCH_END, () => {
            Manager.uiManager.open({type:SettingView,bundle:BUNDLE_RESOURCES,zIndex:ViewZOrder.UI,name:"设置界面"});
        });

        let change = find("mial",bottom_op) as Node;
        change.on(Node.EventType.TOUCH_END,()=>{
            let lan = Manager.language.getLanguage();
            if( lan == sys.Language.CHINESE){
                lan = sys.Language.ENGLISH
            }else if( lan == sys.Language.ENGLISH ) {
                lan = sys.Language.CHINESE;
            }
            Manager.language.change(lan);
        });

        LobbyService.instance.enabled = false;
        GameService.instance.enabled = false;
        ChatService.instance.enabled = false;

        // this.audioHelper.playMusic("audio/background",this.bundle)
        
        dispatchEnterComplete({ type: LogicType.HALL, views: [this] });
    }

    bindingEvents() {
        super.bindingEvents();
        this.registerEvent(CommonEvent.DOWNLOAD_PROGRESS, this.onDownloadProgess);
    }

    private onDownloadProgess(data: { progress: number, config: BundleConfig }) {

        let progressBar = find(`games/game_${data.config.index}/Background/progressBar`, this.node)?.getComponent(ProgressBar) as ProgressBar;
        let progressLabel = find(`games/game_${data.config.index}/Background/progressBar/progress`, this.node)?.getComponent(Label) as Label;
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
