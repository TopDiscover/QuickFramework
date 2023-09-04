import { AudioClip, AudioSource, _decorator } from "cc";
import AudioComponent, { AudioInfo } from "./AudioComponent";
import { Macro } from "../defines/Macros";

/**
 * @description 全局音频播放组棒
 */

const { ccclass, property, menu } = _decorator;

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
        return new Promise<boolean>((resolve) => {
            if (bundle != Macro.BUNDLE_RESOURCES) {
                Log.e(`${url} 不在 ${Macro.BUNDLE_RESOURCES} 全局播放的声音请存放到${Macro.BUNDLE_RESOURCES}`)
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
            App.cache.getCacheByAsync(url, AudioClip, bundle).then(([cache,data]) => {
                if (data) {
                    App.asset.addPersistAsset(cache);
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

    /**@deprecated 请使用 playGlobalEffect 替换 */
    public playEffect(url: string, bundle: BUNDLE_TYPE, loop: boolean = false) {
        return new Promise<boolean>((resolve) => {
            if (bundle != Macro.BUNDLE_RESOURCES) {
                Log.e(`${url} 不在 ${Macro.BUNDLE_RESOURCES} 全局播放的声音请存放到${Macro.BUNDLE_RESOURCES}`)
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
            App.cache.getCacheByAsync(url, AudioClip, bundle).then(([cache,data]) => {
                if (data) {
                    App.asset.addPersistAsset(cache);
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
