import AudioComponent from "../../framework/componects/AudioComponent";
import { Macro } from "../../framework/defines/Macros";

/**
 * @description 全局音频播放组棒
 */

const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("Quick公共组件/GlobalAudio")
export default class GlobalAudio extends AudioComponent {

    /**@description 播放全局音乐 */
    public playGlobalMusic(url:string,loop:boolean = true){
        return this.playMusic(url,Macro.BUNDLE_RESOURCES,loop);
    }
    
    /**@description 播放全局音效 */
    public playGlobalEffect(url:string,loop:boolean = false){
        return this.playEffect(url,Macro.BUNDLE_RESOURCES,loop);
    }

    /**@deprecated 请使用 playGlobalMusic 替换 */
    public playMusic(url: string, bundle: BUNDLE_TYPE, loop: boolean = true) {
        let me = this;
        return new Promise<{ url: string, isSuccess: boolean }>((resolve) => {
            if( bundle != Macro.BUNDLE_RESOURCES ){
                Log.e(`${url} 不在 ${Macro.BUNDLE_RESOURCES} 全局播放的声音请存放到${Macro.BUNDLE_RESOURCES}`)
                resolve({ url:url,isSuccess:false});
                return;
            }
            this.audioData.curMusicUrl = url;
            this.audioData.curBundle = bundle;
            if (this.audioData.isMusicOn) {
                App.cache.getCacheByAsync(url, cc.AudioClip,bundle).then(([cache,data]) => {
                    if (data) {
                        App.asset.addPersistAsset(cache);
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

    /**@deprecated 请使用 playGlobalEffect 替换 */
    public playEffect(url: string, bundle:BUNDLE_TYPE, loop: boolean = false) {
        return new Promise<number>((resolve) => {
            if( bundle != Macro.BUNDLE_RESOURCES ){
                Log.e(`${url} 不在 ${Macro.BUNDLE_RESOURCES} 全局播放的声音请存放到${Macro.BUNDLE_RESOURCES}`)
                resolve(-1);
                return;
            }
            if (this.audioData.isEffectOn) {
                App.cache.getCacheByAsync(url, cc.AudioClip,bundle).then(([cache,data]) => {
                    if (data) {
                        App.asset.addPersistAsset(cache);
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
