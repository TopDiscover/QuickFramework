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
import { EventTouch, _decorator,Node, PageView, instantiate, find, Label, ProgressBar, sys, PhysicsSystem2D } from "cc";
import { ViewZOrder } from "../../../../scripts/common/config/ViewZOrder";


const { ccclass, property } = _decorator;

@ccclass
export default class HallView extends UIView {
    public static getPrefabUrl() {
        return "prefabs/HallView";
    }

    private onClick(ev: EventTouch) {
        let node : Node = ev.target as Node;
        let config = this.bundles[node.userData];
        if( config ){
            if( config.bundle == "aimLine"){
                //瞄准线，需要使用box2d
                if( !PhysicsSystem2D.PHYSICS_BOX2D ){
                    Manager.tips.show("该功能请把2D物理引擎切换到Box2D");
                    return;
                }
            }else if( config.bundle == "tankBattle" ){
                if( !PhysicsSystem2D.PHYSICS_BUILTIN ){
                    Manager.tips.show("该功能请把2D物理引擎切换到内置");
                    return;
                }
            }
            Manager.bundleManager.enterBundle(config);
        }
    }

    private gamePage : Node = null!;
    private gameItem : Node = null!;
    private pageView : PageView = null!;
    private readonly PAGE_COUNT = 6;

    private _bundleNames = [
        "tankBattle",
        "loadTest",
        "netTest",
        "aimLine",
        "nodePoolTest",
        "eliminate",
        "shaders",
    ];
    private _bundles: BundleConfig[] = [];
    private get bundles() {
        if (this._bundles.length <= 0) {
            let names : string[] = Manager.getLanguage("hall_view_game_name",HallData.bundle);
            for( let i = 0 ; i < this._bundleNames.length ;i++ ){
                this._bundles.push(new BundleConfig(names[i],this._bundleNames[i],i+1));
            }
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

        this.audioHelper.playMusic("audio/background",this.bundle)
        
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
