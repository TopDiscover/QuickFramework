import { find, ProgressBar, Slider, Toggle, _decorator , Node, SystemEvent } from "cc";
import UIView from "../../framework/core/ui/UIView";
import { Macro } from "../../framework/defines/Macros";

const { ccclass } = _decorator;
@ccclass
export default class SettingView extends UIView {

    public static getPrefabUrl() {
        return "common/prefabs/SettingView";
    }

    private musicStatus: Toggle = null!;
    private effectStatus: Toggle = null!;
    private musicVolume: Slider = null!;
    private effectVolume: Slider = null!;

    onLoad() {
        super.onLoad();

        this.content = find("content", this.node) as Node;
        let close = find("close",this.content) as Node;
        close.on(SystemEvent.EventType.TOUCH_END, this.onClose, this);

        let quit = find("background/quit",this.content) as Node;
        quit.on(SystemEvent.EventType.TOUCH_END, this.onQuit, this);

        let music = find("background/musicVolume",this.content) as Node;
        music.on("slide", this.onMusicVolumeChange, this);

        let effect = find("background/effectVolume",this.content) as Node;
        effect.on('slide', this.onEffectVolumeChange, this);
        this.musicVolume = music.getComponent(Slider) as Slider;
        this.effectVolume = effect.getComponent(Slider) as Slider;
        this.musicVolume.progress = Manager.globalAudio.musicVolume;
        this.effectVolume.progress = Manager.globalAudio.effectVolume;
        this.onMusicVolumeChange(this.musicVolume);
        this.onEffectVolumeChange(this.effectVolume);

        let musicStatusNode = find("background/musicStatus",this.content) as Node;
        this.musicStatus = musicStatusNode.getComponent(Toggle) as Toggle;
        let effectStatusNode = find("background/effectStatus",this.content) as Node;
        this.effectStatus = effectStatusNode.getComponent(Toggle) as Toggle;
        musicStatusNode.on("toggle", this.onMusicStatusChange, this);
        effectStatusNode.on("toggle", this.onEffectStatusChange, this);
        this.musicStatus.isChecked = Manager.globalAudio.isMusicOn;
        this.effectStatus.isChecked = Manager.globalAudio.isEffectOn;
        this.onMusicStatusChange(this.musicStatus, false);
        this.onEffectStatusChange(this.effectStatus, false);

        this.show(this.args);
    }

    protected get showAction(){
        return ( complete : ()=>void )=>{
            Manager.utils.showView(this.content,complete);
        }
    }

    protected get closeAction(){
        return ( complete : ()=>void )=>{
            Manager.utils.hideView(this.content,complete);
        };
    }

    private onClose() {
        this.close();
    }

    private onQuit() {
        this.close();
        Manager.alert.show({
            immediatelyCallback: true,
            text: Manager.getLanguage("quitGame"),
            confirmCb: (isOk) => {
                if (isOk) {
                    Manager.entryManager.enterBundle(Macro.BUNDLE_RESOURCES);
                }
            },
        });
    }

    private onMusicVolumeChange(target: Slider) {
        Manager.globalAudio.musicVolume = target.progress;
        (target.node.getComponent(ProgressBar) as ProgressBar).progress = target.progress;
    }

    private onEffectVolumeChange(target: Slider) {
        Manager.globalAudio.effectVolume = target.progress;
        (target.node.getComponent(ProgressBar) as ProgressBar).progress = target.progress;
    }

    private onMusicStatusChange(target: Toggle, isPlay: boolean) {
        if( isPlay == undefined ) Manager.globalAudio.playButtonClick();
        (target.node.getChildByName("off") as Node).active = !target.isChecked;
        Manager.globalAudio.isMusicOn = target.isChecked;
    }

    private onEffectStatusChange(target: Toggle, isPlay: boolean) {
        if( isPlay == undefined ) Manager.globalAudio.playButtonClick();
        (target.node.getChildByName("off") as Node).active = !target.isChecked;
        Manager.globalAudio.isEffectOn = target.isChecked;
    }
}
