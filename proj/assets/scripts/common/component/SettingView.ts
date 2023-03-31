import { find, ProgressBar, Slider, Toggle, _decorator , Node, Input } from "cc";
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
        close.on(Input.EventType.TOUCH_END, this.onClose, this);

        let quit = find("background/quit",this.content) as Node;
        quit.on(Input.EventType.TOUCH_END, this.onQuit, this);

        let music = find("background/musicVolume",this.content) as Node;
        music.on("slide", this.onMusicVolumeChange, this);

        let effect = find("background/effectVolume",this.content) as Node;
        effect.on('slide', this.onEffectVolumeChange, this);
        this.musicVolume = music.getComponent(Slider) as Slider;
        this.effectVolume = effect.getComponent(Slider) as Slider;
        this.musicVolume.progress = App.globalAudio.musicVolume;
        this.effectVolume.progress = App.globalAudio.effectVolume;
        this.onMusicVolumeChange(this.musicVolume);
        this.onEffectVolumeChange(this.effectVolume);

        let musicStatusNode = find("background/musicStatus",this.content) as Node;
        this.musicStatus = musicStatusNode.getComponent(Toggle) as Toggle;
        let effectStatusNode = find("background/effectStatus",this.content) as Node;
        this.effectStatus = effectStatusNode.getComponent(Toggle) as Toggle;
        musicStatusNode.on("toggle", this.onMusicStatusChange, this);
        effectStatusNode.on("toggle", this.onEffectStatusChange, this);
        this.musicStatus.isChecked = App.globalAudio.isMusicOn;
        this.effectStatus.isChecked = App.globalAudio.isEffectOn;
        this.onMusicStatusChange(this.musicStatus, false);
        this.onEffectStatusChange(this.effectStatus, false);

        this.show(this.args);
    }

    protected get showAction(){
        return ( complete : ()=>void )=>{
            App.utils.showView(this.content,complete);
        }
    }

    protected get closeAction(){
        return ( complete : ()=>void )=>{
            App.utils.hideView(this.content,complete);
        };
    }

    private onClose() {
        this.close();
    }

    private onQuit() {
        this.close();
        App.alert.show({
            immediatelyCallback: true,
            text: App.getLanguage("quitGame"),
            confirmCb: (isOk) => {
                if (isOk) {
                    App.entryManager.enterBundle(Macro.BUNDLE_RESOURCES);
                }
            },
        });
    }

    private onMusicVolumeChange(target: Slider) {
        App.globalAudio.musicVolume = target.progress;
        (target.node.getComponent(ProgressBar) as ProgressBar).progress = target.progress;
    }

    private onEffectVolumeChange(target: Slider) {
        App.globalAudio.effectVolume = target.progress;
        (target.node.getComponent(ProgressBar) as ProgressBar).progress = target.progress;
    }

    private onMusicStatusChange(target: Toggle, isPlay: boolean) {
        if( isPlay == undefined ) App.globalAudio.playButtonClick();
        (target.node.getChildByName("off") as Node).active = !target.isChecked;
        App.globalAudio.isMusicOn = target.isChecked;
    }

    private onEffectStatusChange(target: Toggle, isPlay: boolean) {
        if( isPlay == undefined ) App.globalAudio.playButtonClick();
        (target.node.getChildByName("off") as Node).active = !target.isChecked;
        App.globalAudio.isEffectOn = target.isChecked;
    }
}
