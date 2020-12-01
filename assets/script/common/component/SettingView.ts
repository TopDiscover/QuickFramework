import UIView from "../../framework/ui/UIView";
import { LogicEvent } from "../event/LogicEvent";
import { i18n } from "../language/LanguageImpl";
import { Manager } from "../manager/Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingView extends UIView {

    public static getPrefabUrl() {
        return "common/prefabs/SettingView";
    }

    private musicStatus: cc.Toggle = null;
    private effectStatus: cc.Toggle = null;
    private musicVolume: cc.Slider = null;
    private effectVolume: cc.Slider = null;

    onLoad() {
        super.onLoad();

        this.content = cc.find("content", this.node);
        let close = this.find("close");
        close.on(cc.Node.EventType.TOUCH_END, this.onClose, this);

        let quit = this.find("background/quit");
        quit.on(cc.Node.EventType.TOUCH_END, this.onQuit, this);

        let music = this.find("background/musicVolume");
        music.on("slide", this.onMusicVolumeChange, this);

        let effect = this.find("background/effectVolume");
        effect.on('slide', this.onEffectVolumeChange, this);
        this.musicVolume = music.getComponent(cc.Slider);
        this.effectVolume = effect.getComponent(cc.Slider);
        this.musicVolume.progress = Manager.globalAudio.musicVolume;
        this.effectVolume.progress = Manager.globalAudio.effectVolume;
        this.onMusicVolumeChange(this.musicVolume);
        this.onEffectVolumeChange(this.effectVolume);

        let musicStatusNode = this.find("background/musicStatus");
        this.musicStatus = musicStatusNode.getComponent(cc.Toggle);
        let effectStatusNode = this.find("background/effectStatus");
        this.effectStatus = effectStatusNode.getComponent(cc.Toggle);
        musicStatusNode.on("toggle", this.onMusicStatusChange, this);
        effectStatusNode.on("toggle", this.onEffectStatusChange, this);
        this.musicStatus.isChecked = Manager.globalAudio.isMusicOn;
        this.effectStatus.isChecked = Manager.globalAudio.isEffectOn;
        this.onMusicStatusChange(this.musicStatus);
        this.onEffectStatusChange(this.effectStatus);

        this.showWithAction();
    }

    private onClose() {
        this.closeWithAction();
    }

    private onQuit() {
        this.closeWithAction();
        Manager.alert.show({
            immediatelyCallback: true,
            text: i18n.quitGame,
            confirmCb: (isOk) => {
                if (isOk) {
                    dispatch(LogicEvent.ENTER_LOGIN);
                }
            },
        });
    }

    private onMusicVolumeChange(target: cc.Slider) {
        Manager.globalAudio.musicVolume = target.progress;
        target.node.getComponent(cc.ProgressBar).progress = target.progress;
    }

    private onEffectVolumeChange(target: cc.Slider) {
        Manager.globalAudio.effectVolume = target.progress;
        target.node.getComponent(cc.ProgressBar).progress = target.progress;
    }

    private onMusicStatusChange(target: cc.Toggle) {
        target.node.getChildByName("off").active = !target.isChecked;
        Manager.globalAudio.isMusicOn = target.isChecked;
    }

    private onEffectStatusChange(target: cc.Toggle) {
        target.node.getChildByName("off").active = !target.isChecked;
        Manager.globalAudio.isEffectOn = target.isChecked;
    }
}
