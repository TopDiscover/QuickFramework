import EventComponent from "./EventComponent";
import UIView from "../core/ui/UIView";
import { Singleton } from "../utils/Singleton";
import { Macro } from "../defines/Macros";
import { Resource } from "../core/asset/Resource";

/**
 * @description 声音组件
 */
const { ccclass, property, menu } = cc._decorator;

/**@description 框架内部使用，外部请不要调用 */
class AudioData implements ISingleton {
    static module = "【音效数据】";
    module: string;
    public musicVolume = 1;
    public effectVolume = 1;
    public isEffectOn = true;
    public isMusicOn = true;
    private _curMusicUrl = "";
    public get curMusicUrl() {
        return this._curMusicUrl;
    }
    public set curMusicUrl(v) {
        this.prevMusicUrl = this._curMusicUrl;
        this._curMusicUrl = v;
    }
    public prevMusicUrl = "";
    public curEffectId = -1;
    /**@description 当前背景音乐的Bundle */
    public curBundle: BUNDLE_TYPE = null;
    /**@description 当前背景音乐是否循环播放 */
    public curLoop: boolean = true;
    /**@description 当前背景音乐是否正在播放 */
    public isPlaying: boolean = false;

    private readonly _storeMusicKey: string = "default_save_music";
    private readonly _storeEffectKey: string = "default_save_effect";
    private readonly _storeMusicVolumeKey: string = "default_save_music_volume_key";
    private readonly _storeEffectVolumeKey: string = "default_save_effect_volume_key";

    init() {

        //音量开关读取
        this.isMusicOn = App.storage.getItem(this._storeMusicKey, this.isMusicOn);
        this.isEffectOn = App.storage.getItem(this._storeEffectKey, this.isEffectOn);

        //音量读取
        this.musicVolume = App.storage.getItem(this._storeMusicVolumeKey, this.musicVolume);
        this.effectVolume = App.storage.getItem(this._storeEffectVolumeKey, this.effectVolume);
    }

    /**@description 存储 */
    public save() {
        try {
            App.storage.setItem(this._storeMusicKey, this.isMusicOn);
            App.storage.setItem(this._storeMusicVolumeKey, this.musicVolume);

            App.storage.setItem(this._storeEffectKey, this.isEffectOn);
            App.storage.setItem(this._storeEffectVolumeKey, this.effectVolume);
        } catch (error) {
        }
    }
}

const PLAY_MUSIC = "AudioComponent_PLAY_MUSIC";

@ccclass
@menu("Quick公共组件/AudioComponent")
export default class AudioComponent extends EventComponent {


    addEvents() {
        super.addEvents();
        this.onD(PLAY_MUSIC, this.onPlayMusic);
    }

    private onPlayMusic(data) {
        if (this.curPlayMusicUrl == this.curMusicUrl && !this.isPlaying && this.curMusicUrl && this.curBundle) {
            this.playMusic(this.curMusicUrl, this.curLoop, this.curBundle);
        }
    }

    protected get audioData() {
        return Singleton.get(AudioData);
    }

    /**@description 音频控件资源拥有者，该对象由UIManager打开的界面 */
    public owner: UIView = null;

    /**@description 背景音乐音量 */
    public get musicVolume() { return this.audioData.musicVolume; }
    public set musicVolume(volume) {
        cc.audioEngine.setMusicVolume(volume);
        if (volume <= 0) {
            this.stopMusic();
        }
        this.audioData.musicVolume = volume;
    };
    /**@description 音效音量 */
    public get effectVolume() { return this.audioData.effectVolume; }
    public set effectVolume(volume) {
        cc.audioEngine.setEffectsVolume(volume);
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
    public set isMusicOn(isOn: boolean) {
        this.audioData.isMusicOn = isOn;
        this.save();
        if (this.audioData.isMusicOn) {
            if (!this.curMusicUrl) {
                return;
            }
            //有多个AudioComponent ,通知所有的组件
            dispatch(PLAY_MUSIC, this);
        } else {
            this.stopMusic();
        }
    };
    /**@description 当前播放的背景音乐 */
    public get curMusicUrl() { return this.audioData.curMusicUrl; }
    public set curMusicUrl(value) { this.audioData.curMusicUrl = value };
    public get prevMusiUrl() { return this.audioData.prevMusicUrl }
    public get curBundle() { return this.audioData.curBundle; }
    public set curBundle(value) { this.audioData.curBundle = value; }
    protected get curLoop() { return this.audioData.curLoop; }
    protected set curLoop(value) { this.audioData.curLoop = value };
    protected get isPlaying() { return this.audioData.isPlaying; }
    protected set isPlaying(value) { this.audioData.isPlaying = value };
    /**@description 指向当前组件的播放音乐 */
    protected curPlayMusicUrl: string = null;
    protected curPlayMusicId: number = -1;

    /**@description 是否是全局音频组件 */
    public isGlobal: boolean = false;

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
        this.isPlaying = false;
    }

    protected fixBundle(bundle?: BUNDLE_TYPE) {
        if (bundle == undefined || bundle == null) {
            if (this.owner) {
                bundle = this.owner.bundle;
            }
            else {
                bundle = Macro.BUNDLE_RESOURCES;
            }
        }
        return bundle;
    }

    public playMusic(url: string, loop: boolean = true, bundle?: BUNDLE_TYPE, onComplete?: (audioID: number) => void) {
        if (CC_DEBUG) {
            if (!this.owner && !this.isGlobal) {
                CC_DEBUG && Log.e(`必须要指定资源的管理都才能播放`);
                this.curPlayMusicId = -1;
                onComplete && onComplete(this.curPlayMusicId);
                return;
            }
        }
        if (this.isGlobal && bundle != Macro.BUNDLE_RESOURCES) {
            CC_DEBUG && Log.e(`全局音频组件不能指定资源包`);
            this.audioData.curEffectId = -1;
            onComplete && onComplete(-1);
            return;
        }
        this.curPlayMusicUrl = url;
        this.curMusicUrl = url;
        this.curBundle = this.fixBundle(bundle);
        this.curLoop = loop;
        if (this.audioData.isMusicOn) {
            App.cache.getCacheByAsync(url, cc.AudioClip, this.curBundle, (data) => {
                if (data.asset) {
                    this.addLocal(data.cache);
                    if (!(this.isPlaying && this.curMusicUrl == this.prevMusiUrl) || (this.isPlaying && loop == false)) {
                        //停掉当前播放音乐
                        this.stopMusic();
                        //播放新的背景音乐
                        this.curPlayMusicId = cc.audioEngine.playMusic(data.asset as cc.AudioClip, loop);
                    }

                    this.isPlaying = true;
                    onComplete && onComplete(this.curPlayMusicId);
                } else {
                    this.curPlayMusicId = -1;
                    onComplete && onComplete(-1);
                }
            });
        } else {
            this.curPlayMusicId = -1;
            onComplete && onComplete(-1);
        }
    }

    public playEffect(url: string, loop: boolean = false, bundle?: BUNDLE_TYPE, onComplete?: (audioID: number) => void) {
        if (CC_DEBUG) {
            if (!this.owner && !this.isGlobal) {
                CC_DEBUG && Log.e(`必须要指定资源的管理都才能播放`);
                this.audioData.curEffectId = -1;
                onComplete && onComplete(-1);
                return;
            }
        }
        if (this.isGlobal && bundle != Macro.BUNDLE_RESOURCES) {
            CC_DEBUG && Log.e(`全局音频组件不能指定资源包`);
            this.audioData.curEffectId = -1;
            onComplete && onComplete(-1);
            return;
        }
        if (this.audioData.isEffectOn) {
            bundle = this.fixBundle(bundle);
            App.cache.getCacheByAsync(url, cc.AudioClip, bundle, (data) => {
                if (data.asset) {
                    this.addLocal(data.cache);
                    this.audioData.curEffectId = cc.audioEngine.playEffect(data.asset as cc.AudioClip, loop);
                    onComplete && onComplete(this.audioData.curEffectId);
                } else {
                    this.audioData.curEffectId = -1;
                    onComplete && onComplete(-1);
                }
            });
        } else {
            this.audioData.curEffectId = -1;
            onComplete && onComplete(-1);
        }
    }

    private addLocal(cache: Resource.Cache) {
        if (this.isGlobal) {
            App.asset.addPersistAsset(cache);
        } else {
            if (this.owner) {
                App.uiManager.addLocal(cache, this.owner.className);
            } else {
                App.uiManager.garbage.addLocal(cache);
            }
        }
    }

    public onEnterBackground() {
        cc.audioEngine.pauseMusic();
        cc.audioEngine.pauseAllEffects();
    }

    public onEnterForgeground(inBackgroundTime: number) {
        cc.audioEngine.resumeMusic();
        cc.audioEngine.resumeAllEffects();
    }

    public onLoad() {
        if (this.isGlobal) {
            this.effectVolume = this.audioData.effectVolume;
            this.musicVolume = this.audioData.musicVolume;
        }
    }

}
