import AudioComponent from "../../framework/componects/AudioComponent";
import { Macro } from "../../framework/defines/Macros";
import { Config } from "../config/Config";

/**
 * @description 全局音频播放组棒
 */

const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("Quick公共组件/GlobalAudio")
export default class GlobalAudio extends AudioComponent {
    playDialogOpen() {
        this.playEffect(Config.audioPath.dialog,Macro.BUNDLE_RESOURCES,false);   
    }

    playButtonClick() {
        this.playEffect(Config.audioPath.button,Macro.BUNDLE_RESOURCES,false);
    }

    public playMusic(url: string, bundle: BUNDLE_TYPE, loop: boolean = true) {
        let me = this;
        return new Promise<{ url: string, isSuccess: boolean }>((resolve) => {
            if( bundle != Macro.BUNDLE_RESOURCES ){
                Log.e(`${url} 不在 ${Macro.BUNDLE_RESOURCES} 全局播放的声音发现存放到${Macro.BUNDLE_RESOURCES}`)
                resolve({ url:url,isSuccess:false});
                return;
            }
            this.audioData.curMusicUrl = url;
            this.audioData.curBundle = bundle;
            if (this.audioData.isMusicOn) {
                Manager.cache.getCacheByAsync(url, cc.AudioClip,bundle).then((data) => {
                    if (data) {
                        Manager.asset.addPersistAsset(url,data,bundle);
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
            if( bundle != Macro.BUNDLE_RESOURCES ){
                Log.e(`${url} 不在 ${Macro.BUNDLE_RESOURCES} 全局播放的声音发现存放到${Macro.BUNDLE_RESOURCES}`)
                resolve(-1);
                return;
            }
            if (this.audioData.isEffectOn) {
                Manager.cache.getCacheByAsync(url, cc.AudioClip,bundle).then((data) => {
                    if (data) {
                        Manager.asset.addPersistAsset(url,data,bundle);
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
