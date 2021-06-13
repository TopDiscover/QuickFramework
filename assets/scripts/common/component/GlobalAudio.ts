import { AudioClip, AudioSource, _decorator } from "cc";
import AudioComponent, { AudioInfo } from "../../framework/base/AudioComponent";
import { BUNDLE_TYPE, BUNDLE_RESOURCES } from "../../framework/base/Defines";
import { Config } from "../config/Config";
import { Manager } from "../manager/Manager";

/**
 * @description 全局音频播放组棒
 */

const {ccclass, property,menu} = _decorator;

@ccclass
@menu("common/component/GlobalAudio")
export default class GlobalAudio extends AudioComponent {
    playDialogOpen() {
        this.playEffect(Config.audioPath.dialog,BUNDLE_RESOURCES,false);   
    }

    playButtonClick() {
        this.playEffect(Config.audioPath.button,BUNDLE_RESOURCES,false);
    }

    public playMusic(url: string, bundle: BUNDLE_TYPE, loop: boolean = true) {
        let me = this;
        return new Promise<boolean>((resolve) => {
            if( bundle != BUNDLE_RESOURCES ){
                error(`${url} 不在 ${BUNDLE_RESOURCES} 全局播放的声音发现存放到${BUNDLE_RESOURCES}`)
                resolve(false);
                return;
            }
            this.audioData.curMusicUrl = url;
            this.audioData.curBundle = bundle;
            if (this.audioData.isMusicOn) {
                let key = this.makeKey(url,bundle);
                let audioInfo = this.musicInfos.get(key);
                if( !audioInfo ){
                    audioInfo = new AudioInfo();
                    audioInfo.url = url;
                    audioInfo.bundle = bundle;
                    audioInfo.source = this.node.addComponent(AudioSource);
                    audioInfo.source.playOnAwake = false;
                    audioInfo.source.name = key;
                    this.musicInfos.set(key,audioInfo);
                }
                Manager.cacheManager.getCacheByAsync(url, AudioClip,bundle).then((data) => {
                    if (data) {
                        Manager.assetManager.addPersistAsset(url,data,bundle);
                        me.stopMusic();
                        if( audioInfo && audioInfo.source ){
                            audioInfo.source.clip = data;
                            audioInfo.source.loop = loop;
                            audioInfo.play();
                        }
                        this.isPlaying = true;
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            }
        });

    }

    public playEffect(url: string, bundle:BUNDLE_TYPE, loop: boolean = false) {
        return new Promise<boolean>((resolve) => {
            if( bundle != BUNDLE_RESOURCES ){
                error(`${url} 不在 ${BUNDLE_RESOURCES} 全局播放的声音发现存放到${BUNDLE_RESOURCES}`)
                resolve(false);
                return;
            }
            if (this.audioData.isEffectOn) {
                let key = this.makeKey(url,bundle);
                let audioInfo = this.effectInfos.get(key);
                if( !audioInfo ){
                    audioInfo = new AudioInfo;
                    audioInfo.url = url;
                    audioInfo.bundle = bundle;
                    audioInfo.source = this.node.addComponent(AudioSource);
                    audioInfo.source.name = key;
                    this.effectInfos.set(key,audioInfo);
                }
                Manager.cacheManager.getCacheByAsync(url, AudioClip,bundle).then((data) => {
                    if (data) {
                        Manager.assetManager.addPersistAsset(url,data,bundle);
                        if( audioInfo && audioInfo.source ){
                            audioInfo.source.clip = data;
                            audioInfo.source.loop = loop;
                            audioInfo.play();
                        }
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(false);
            }
        });
    }

    onLoad(){
        this.effectVolume = this.audioData.effectVolume;
        this.musicVolume = this.audioData.musicVolume;
    }
}
