import AudioComponent from "../../framework/base/AudioComponent";
import { BUNDLE_TYPE, BUNDLE_RESOURCES } from "../../framework/base/Defines";
import { Config } from "../config/Config";
import { Manager } from "../manager/Manager";

/**
 * @description 全局音频播放组棒
 */

const {ccclass, property,menu} = cc._decorator;

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
        return new Promise<{ url: string, isSuccess: boolean }>((resolve) => {
            if( bundle != BUNDLE_RESOURCES ){
                cc.error(`${url} 不在 ${BUNDLE_RESOURCES} 全局播放的声音发现存放到${BUNDLE_RESOURCES}`)
                resolve({ url:url,isSuccess:false});
                return;
            }
            this.audioData.curMusicUrl = url;
            this.audioData.curBundle = bundle;
            if (this.audioData.isMusicOn) {
                Manager.cacheManager.getCacheByAsync(url, cc.AudioClip,bundle).then((data) => {
                    if (data) {
                        Manager.assetManager.addPersistAsset(url,data,bundle);
                        me.stopMusic();
                        cc.audioEngine.playMusic(data, loop);
                        this.isPlaying = true;
                        resolve({ url: url, isSuccess: true });
                    } else {
                        resolve({ url: url, isSuccess: false });
                    }
                });
            }
        });

    }

    public playEffect(url: string, bundle:BUNDLE_TYPE, loop: boolean = false) {
        return new Promise<number>((resolve) => {
            if( bundle != BUNDLE_RESOURCES ){
                cc.error(`${url} 不在 ${BUNDLE_RESOURCES} 全局播放的声音发现存放到${BUNDLE_RESOURCES}`)
                resolve(-1);
                return;
            }
            if (this.audioData.isEffectOn) {
                Manager.cacheManager.getCacheByAsync(url, cc.AudioClip,bundle).then((data) => {
                    if (data) {
                        Manager.assetManager.addPersistAsset(url,data,bundle);
                        this.audioData.curEffectId = cc.audioEngine.playEffect(data, loop);
                        resolve(this.audioData.curEffectId);
                    } else {
                        resolve(this.audioData.curEffectId);
                    }
                });
            } else {
                this.audioData.curEffectId = -1;
                resolve(-1);
            }
        });
    }

    onLoad(){
        this.effectVolume = this.audioData.effectVolume;
        this.musicVolume = this.audioData.musicVolume;
    }
}
