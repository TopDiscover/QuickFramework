import { AudioClip, AudioSource, _decorator } from "cc";
import AudioComponent, { AudioInfo } from "../../framework/base/AudioComponent";

/**
 * @description 全局音频播放组棒
 */

const { ccclass, property, menu } = _decorator;

@ccclass
@menu("common/component/GlobalAudio")
export default class GlobalAudio extends AudioComponent {
    playDialogOpen() {
        this.playEffect(td.Config.audioPath.dialog, td.Macro.BUNDLE_RESOURCES, false);
    }

    playButtonClick() {
        this.playEffect(td.Config.audioPath.button, td.Macro.BUNDLE_RESOURCES, false);
    }

    public playMusic(url: string, bundle: BUNDLE_TYPE, loop: boolean = true) {
        let me = this;
        return new Promise<boolean>((resolve) => {
            if (bundle != td.Macro.BUNDLE_RESOURCES) {
                error(`${url} 不在 ${td.Macro.BUNDLE_RESOURCES} 全局播放的声音发现存放到${td.Macro.BUNDLE_RESOURCES}`)
                resolve(false);
                return;
            }
            let key = this.audioData.makeKey(url, bundle);
            let audioInfo = this.audioData.musicInfos.get(key);
            if (!audioInfo) {
                audioInfo = new AudioInfo();
                audioInfo.url = url;
                audioInfo.bundle = bundle;
                audioInfo.source = this.node.addComponent(AudioSource);
                audioInfo.source.playOnAwake = true;
                audioInfo.source.name = key;
                this.audioData.musicInfos.set(key, audioInfo);
            }
            this.audioData.curMusic = audioInfo;
            Manager.cacheManager.getCacheByAsync(url, AudioClip, bundle).then((data) => {
                if (data) {
                    Manager.assetManager.addPersistAsset(url, data, bundle);
                    me.stopMusic();
                    if (audioInfo && audioInfo.source) {
                        audioInfo.source.clip = data;
                        audioInfo.source.loop = loop;
                        this.play(audioInfo,true,resolve);
                    }
                } else {
                    resolve(false);
                }
            });
        });

    }

    public playEffect(url: string, bundle: BUNDLE_TYPE, loop: boolean = false) {
        return new Promise<boolean>((resolve) => {
            if (bundle != td.Macro.BUNDLE_RESOURCES) {
                error(`${url} 不在 ${td.Macro.BUNDLE_RESOURCES} 全局播放的声音发现存放到${td.Macro.BUNDLE_RESOURCES}`)
                resolve(false);
                return;
            }

            let key = this.audioData.makeKey(url, bundle);
            let audioInfo = this.audioData.effectInfos.get(key);
            if (!audioInfo) {
                audioInfo = new AudioInfo;
                audioInfo.url = url;
                audioInfo.bundle = bundle;
                audioInfo.source = this.node.addComponent(AudioSource);
                audioInfo.source.name = key;
                this.audioData.effectInfos.set(key, audioInfo);
            }
            Manager.cacheManager.getCacheByAsync(url, AudioClip, bundle).then((data) => {
                if (data) {
                    Manager.assetManager.addPersistAsset(url, data, bundle);
                    if (audioInfo && audioInfo.source) {
                        audioInfo.source.clip = data;
                        audioInfo.source.loop = loop;
                        this.play(audioInfo,false,resolve);
                    }
                } else {
                    resolve(false);
                }
            });
        });
    }
}
