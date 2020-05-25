import UIView from "../ui/UIView";
import { ResourceInfo } from "./Defines";
import { localStorage } from "./LocalStorage";
import { uiManager } from "./UIManager";
import { resCaches } from "../cache/ResCaches";

/**
 * @description 声音组件
 */
const { ccclass, property, menu } = cc._decorator;

/**@description 框架内部使用，外部请不要调用 */
class AudioData {
    private static _instance: AudioData = null;
    public static get instance() {
        if (this._instance == null) {
            this._instance = new AudioData();
            this._instance.init();
        }
        return this._instance;
    }
    public musicVolume = 100;
    public effectVolume = 100;
    public isEffectOn = true;
    public isMusicOn = true;
    public curMusicUrl = "";
    public curEffectId = -1;

    private readonly _storeMusicKey: string = "default_save_music";
    private readonly _storeEffectKey: string = "default_save_effect";
    private readonly _storeMusicVolumeKey: string = "default_save_music_volume_key";
    private readonly _storeEffectVolumeKey: string = "default_save_effect_volume_key";

    private init() {

        //音量开关读取
        this.isMusicOn = localStorage().getItem(this._storeMusicKey, this.isMusicOn);
        this.isEffectOn = localStorage().getItem(this._storeEffectKey, this.isEffectOn);

        //音量读取
        this.musicVolume = localStorage().getItem(this._storeMusicVolumeKey, this.musicVolume);
        this.effectVolume = localStorage().getItem(this._storeEffectVolumeKey, this.effectVolume);
    }

    /**@description 存储 */
    public save() {
        try {
            localStorage().setItem(this._storeMusicKey, this.isMusicOn);
            localStorage().setItem(this._storeMusicVolumeKey, this.musicVolume);

            localStorage().setItem(this._storeEffectKey, this.isEffectOn);
            localStorage().setItem(this._storeEffectVolumeKey, this.effectVolume);
        } catch (error) {
        }
    }
}

@ccclass
@menu("framework/base/AudioComponent")
export default class AudioComponent extends cc.Component {

    protected audioData = AudioData.instance;

    /**@description 音频控件资源拥有者，该对象由UIManager打开的界面 */
    public owner : UIView = null;

    /**@description 背景音乐音量 */
    public get musicVolume() { return this.audioData.musicVolume; }
    public set musicVolume(volume) {
        let value = volume / 100;
        cc.audioEngine.setMusicVolume(value);
        if (volume <= 0) {
            this.stopMusic();
        }
        this.audioData.musicVolume = volume;
    };
    /**@description 音效音量 */
    public get effectVolume() { return this.audioData.effectVolume; }
    public set effectVolume(volume) {
        let value = volume / 100;
        cc.audioEngine.setEffectsVolume(value);
        if (volume <= 0) {
            this.stopEffect();
        }
        this.audioData.effectVolume = volume;
    };

    /**@description 音效开关 */
    public get isEffectOn() { return this.audioData.isEffectOn; }
    public set isEffectOn(value) {
        this.audioData.isEffectOn = value;
        this.save();
        if (!value) {
            this.stopEffect();
        }
    };

    /**@description 背景音乐开关 */
    public get isMusicOn() { return this.audioData.isMusicOn; }
    /**@description 设置背景音乐开关 */
    public setMusicEnabled(isOn: boolean, isPlay: boolean = true) {
        this.audioData.isMusicOn = isOn;
        this.save();
        if (this.audioData.isMusicOn) {
            if (!this.curMusicUrl) {
                return;
            }
            if (isPlay) {
                this.playMusic(this.curMusicUrl, true);
            }
        } else {
            this.stopMusic();
        }
    };
    /**@description 当前播放的背景音乐 */
    public get curMusicUrl() { return this.audioData.curMusicUrl; }
    public set curMusicUrl(value) { this.audioData.curMusicUrl = value };

    /**@description 存储 */
    public save() {
        this.audioData.save();
    }

    /**@description 停止 */
    public stopEffect(effectId: number = null) {
        if (effectId == null) {
            if (this.audioData.curEffectId < 0) {
                return;
            }
            cc.audioEngine.stopEffect(this.audioData.curEffectId);
            this.audioData.curEffectId = -1;
        }
        else {
            cc.audioEngine.stopEffect(effectId);
        }
    }

    public stopAllEffects() {
        cc.audioEngine.stopAllEffects();
    }

    public stopMusic() {
        cc.audioEngine.stopMusic();
    }

    public playMusic(url: string, loop: boolean = true) {
        return new Promise<{ url: string, isSuccess: boolean }>((resolve) => {
            if ( CC_DEBUG ){
                if ( !this.owner ){
                    cc.error(`必须要指定资源的管理都才能播放`);
                    resolve({url:url,isSuccess:false});
                    return;
                }
            }
            this.audioData.curMusicUrl = url;
            if (this.audioData.isMusicOn) {
                resCaches().getCacheByAsync(url, cc.AudioClip).then((data) => {
                    if (data) {
                        let info = new ResourceInfo;
                        info.url = url;
                        info.type = cc.AudioClip;
                        info.data = data;
                        if ( this.owner ){ 
                            uiManager().addLocal(info,this.owner.className);
                        }else{
                            uiManager().garbage.addLocal(info);
                        }
                        //停掉当前播放音乐
                        this.stopMusic();
                        //播放新的背景音乐
                        cc.audioEngine.playMusic(data, loop);
                        resolve({ url: url, isSuccess: true });
                    } else {
                        resolve({ url: url, isSuccess: false });
                    }
                });
            }
        });

    }

    public playEffect(url: string, loop: boolean = false) {
        return new Promise<number>((resolve) => {
            if ( CC_DEBUG ){
                if ( !this.owner ){
                    cc.error(`必须要指定资源的管理都才能播放`);
                    resolve(-1);
                    return;
                }
            }
            if (this.audioData.isEffectOn) {
                resCaches().getCacheByAsync(url, cc.AudioClip).then((data) => {
                    if (data) {
                        let info = new ResourceInfo;
                        info.url = url;
                        info.type = cc.AudioClip;
                        info.data = data;
                        if ( this.owner ) {
                            uiManager().addLocal(info,this.owner.className);
                        }else{
                            uiManager().garbage.addLocal(info);
                        }
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

    public onEnterBackground() {
        cc.audioEngine.pauseMusic();
        cc.audioEngine.pauseAllEffects();
    }

    public onEnterForgeground(inBackgroundTime: number) {
        cc.audioEngine.resumeMusic();
        cc.audioEngine.resumeAllEffects();
    }

}
