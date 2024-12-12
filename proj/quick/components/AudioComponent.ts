import UIView from "../core/ui/UIView";
import EventComponent from "./EventComponent";
import { AudioClip, AudioSource, _decorator } from "cc";
import { DEBUG } from "cc/env";
import { Macro } from "../defines/Macros";
import { Singleton } from "../utils/Singleton";
import { Resource } from "../core/asset/Resource";
/**
 * @description 声音组件
 */
const { ccclass, property, menu } = _decorator;

export class AudioInfo {
    url: string = "";
    bundle: BUNDLE_TYPE = Macro.BUNDLE_RESOURCES;
    source: AudioSource | null = null;
    owner: UIView | null = null;
    isPause = false;

    play(): void {
        this.isPause = false;
        if (this.source) {
            this.source.play();
        }
    }

    pause(): void {
        this.isPause = false;
        if (this.source) {
            if (this.source.playing) {
                Log.d(this.url, "isPlaying to pause");
                this.isPause = true;
                this.source.pause();
            }
        }
    }

    stop(): void {
        this.isPause = false;
        if (this.source) {
            this.source.stop();
        }
    }

    resume() {
        if (this.source && this.isPause) {
            Log.d(this.url, "resume play")
            this.source.play();
        }
        this.isPause = false;
    }

    set volume(val: number) {
        if (this.source) {
            this.source.volume = val;
        }
    }
    get volume(): number {
        if (this.source) {
            return this.source.volume;
        }
        return 0;
    }
}

/**@description 框架内部使用，外部请不要调用 */
class AudioData implements ISingleton {
    static module: string = "【音效数据】";
    module: string = null!;
    isResident = true;
    public musicVolume = 1;
    public effectVolume = 1;
    public isEffectOn = true;
    public isMusicOn = true;
    /**@description 保存所有播放的音乐 */
    public musicInfos: Map<string, AudioInfo> = new Map();
    /**@description 保存所有播放的音效 */
    public effectInfos: Map<string, AudioInfo> = new Map();

    /**@description 当前正在播放的音效 */
    public curMusic: AudioInfo | null = null;

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

    public remove(owner: UIView | null) {
        this.musicInfos.forEach((info, key, source) => {
            if (info.owner && info.owner == owner) {
                source.delete(key);
            }
        });
        this.effectInfos.forEach((info, key, source) => {
            if (info.owner && info.owner == owner) {
                source.delete(key);
            }
        })
    }

    public setMusicVolume(volume: number) {
        this.musicInfos.forEach((info, key, source) => {
            info.volume = volume;
        });
        this.musicVolume = volume;
        this.save();
    }

    public setEffectVolume(volume: number) {
        this.effectInfos.forEach((info, key, source) => {
            info.volume = volume;
        });
        this.effectVolume = volume;
        this.save();
    }

    public setMusicStatus(isOn: boolean) {
        if (this.isMusicOn == isOn) {
            return;
        }
        this.isMusicOn = isOn;
        this.save();
        if (isOn) {
            if (this.curMusic) {
                this.curMusic.play();
            }
        } else {
            this.stopMusic();
        }
    }

    public setEffectStatus(isOn: boolean) {
        if (this.isEffectOn == isOn) {
            return;
        }
        this.isEffectOn = isOn;
        this.save();
        if (!isOn) {
            this.stopAllEffects();
        }
    }

    public stopAllEffects() {
        this.effectInfos.forEach((info, key, source) => {
            info.stop();
        });
    }

    public stopMusic() {
        this.musicInfos.forEach((info, key, source) => {
            info.stop();
        });
    }

    public makeKey(url: string, bundle: BUNDLE_TYPE) {
        return `${App.bundleManager.getBundleName(bundle)}_${url}`;
    }

    public stopEffect(url: string, bundle: BUNDLE_TYPE) {
        let key = this.makeKey(url, bundle);
        let info = this.effectInfos.get(key);
        if (info) {
            info.stop();
        }
    }


    public resumeAll() {
        this.musicInfos.forEach((info, key, source) => {
            if (this.isMusicOn) {
                info.resume();
            }
        });
        this.effectInfos.forEach((info, key, source) => {
            if (this.isEffectOn) {
                info.resume();
            }
        });
    }

    public pauseAll() {
        this.musicInfos.forEach((info, key, source) => {
            info.pause();
        });
        this.effectInfos.forEach((info, key, source) => {
            info.pause();
        });
    }
}

@ccclass('AudioComponent')
export default class AudioComponent extends EventComponent {

    onDestroy() {
        this.audioData.remove(this.owner);
        super.onDestroy();
    }

    protected get audioData() {
        return Singleton.get(AudioData)!;
    }

    /**@description 音频控件资源拥有者，该对象由UIManager打开的界面 */
    public owner: UIView | null = null;

    /**@description 背景音乐音量 */
    public get musicVolume() { return this.audioData.musicVolume; }
    public set musicVolume(volume) { this.audioData.setMusicVolume(volume); }
    /**@description 音效音量 */
    public get effectVolume() { return this.audioData.effectVolume; }
    public set effectVolume(volume) { this.audioData.setEffectVolume(volume); }

    /**@description 音效开关 */
    public get isEffectOn() { return this.audioData.isEffectOn; }
    public set isEffectOn(value) { this.audioData.setEffectStatus(value); }

    /**@description 背景音乐开关 */
    public get isMusicOn() { return this.audioData.isMusicOn; }
    /**@description 设置背景音乐开关 */
    public set isMusicOn(isOn: boolean) { this.audioData.setMusicStatus(isOn); }

    /**@description 是否是全局音频组件 */
    public isGlobal: boolean = false;

    public save(): void { this.audioData.save(); }

    /**@description 停止 */
    public stopEffect(url: string, bundle: BUNDLE_TYPE) { this.audioData.stopEffect(url, bundle); }

    public stopAllEffects() { this.audioData.stopAllEffects(); }

    public stopMusic() { this.audioData.stopMusic(); }

    /**
     * @description 播放背景音乐
     * @param url 音乐地址
     * @param loop 是否循环
     * @param bundle 资源包 如果未指定，则使用owner的bundle，如果owner为null，则使用Macro.BUNDLE_RESOURCES
     * @param onComplete 播放完成回调
     * @returns 
     */
    public playMusic(url: string, loop: boolean = true, bundle?: BUNDLE_TYPE, onComplete?: (info: AudioInfo) => void) {
        if (DEBUG) {
            if (!this.owner && !this.isGlobal) {
                DEBUG && Log.e(`必须要指定资源的管理都才能播放`);
                onComplete && onComplete(null!);
                return;
            }
        }
        bundle = this.fixBundle(bundle);
        if (this.isGlobal && bundle != Macro.BUNDLE_RESOURCES) {
            DEBUG && Log.e(`全局音频组件不能指定资源包`);
            onComplete && onComplete(null!);
            return;
        }

        let key = this.audioData.makeKey(url, bundle);
        let audioInfo = this.audioData.musicInfos.get(key);
        if (!audioInfo) {
            audioInfo = new AudioInfo;
            audioInfo.url = url;
            audioInfo.bundle = bundle;
            audioInfo.source = this.node.addComponent(AudioSource);
            audioInfo.owner = this.owner;
            audioInfo.source.name = key;
            audioInfo.source.playOnAwake = true;
            this.audioData.musicInfos.set(key, audioInfo);
        }
        this.audioData.curMusic = audioInfo;
        App.cache.getCacheByAsync(url, AudioClip, bundle, (data) => {
            if (data.asset) {
                this.addLocal(data.cache);
                //停掉当前播放音乐
                this.stopMusic();
                //播放新的背景音乐
                if (audioInfo && audioInfo.source) {
                    audioInfo.source.clip = data.asset as AudioClip;
                    audioInfo.source.loop = loop;
                    audioInfo.volume = this.musicVolume;
                    //如果当前音乐是开的，才播放
                    this.play(audioInfo, true, (isSuccess) => {
                        if (isSuccess) {
                            onComplete && onComplete(audioInfo);
                        } else {
                            onComplete && onComplete(null!);
                        }
                    });
                }
            } else {
                onComplete && onComplete(null!);
            }
        });
    }

    /**
     * @description 播放音效
     * @param url 音效地址
     * @param loop 是否循环
     * @param bundle 资源包 如果未指定，则使用owner的bundle，如果owner为null，则使用Macro.BUNDLE_RESOURCES
     * @param onComplete 播放完成回调
     * @returns 
     */
    public playEffect(url: string, loop: boolean = false, bundle?: BUNDLE_TYPE, onComplete?: (info: AudioInfo) => void) {
        if (DEBUG) {
            if (!this.owner && !this.isGlobal) {
                DEBUG && Log.e(`必须要指定资源的管理都才能播放`);
                onComplete && onComplete(null!);
                return;
            }
        }
        bundle = this.fixBundle(bundle);
        if (this.isGlobal && bundle != Macro.BUNDLE_RESOURCES) {
            DEBUG && Log.e(`全局音频组件不能指定资源包`);
            onComplete && onComplete(null!);
            return;
        }
        //检查是否已经加载过
        let key = this.audioData.makeKey(url, bundle);
        let audioInfo = this.audioData.effectInfos.get(key);
        if (!audioInfo) {
            audioInfo = new AudioInfo();
            audioInfo.url = url;
            audioInfo.bundle = bundle;
            audioInfo.source = this.node.addComponent(AudioSource);
            audioInfo.owner = this.owner;
            audioInfo.source.name = key;
            audioInfo.source.playOnAwake = true;
            this.audioData.effectInfos.set(key, audioInfo);
        }
        App.cache.getCacheByAsync(url, AudioClip, bundle, (data) => {
            if (data.asset) {
                this.addLocal(data.cache);
                if (audioInfo && audioInfo.source) {
                    audioInfo.source.clip = data.asset as AudioClip;
                    audioInfo.source.loop = loop;
                    audioInfo.source.volume = this.effectVolume;
                    this.play(audioInfo, false, (isSuccess) => {
                        if (isSuccess) {
                            onComplete && onComplete(audioInfo);
                        } else {
                            onComplete && onComplete(null!);
                        }
                    });
                }
            } else {
                onComplete && onComplete(null!);
            }
        });
    }

    protected play(info: AudioInfo, isMusic: boolean, resolve: (isSuccess: boolean) => void) {
        if (info && info.source) {
            if (isMusic) {
                if (this.isMusicOn) {
                    info.source.play();
                    resolve(true)
                } else {
                    resolve(false);
                }
            } else {
                if (this.isEffectOn) {
                    info.source.play();
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        } else {
            resolve(false);
        }
    }

    public onEnterBackground() {
        this.audioData.pauseAll();
    }

    public onEnterForgeground(inBackgroundTime: number) {
        this.audioData.resumeAll();
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
}
