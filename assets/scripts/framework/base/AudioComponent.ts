import UIView from "../ui/UIView";
import { ResourceInfo, BUNDLE_TYPE, BUNDLE_RESOURCES } from "./Defines";
import { Manager } from "../Framework";
import EventComponent from "./EventComponent";
import { AudioClip, AudioSource, Tween, tween, Vec2, _decorator } from "cc";
import { DEBUG } from "cc/env";

/**
 * @description 声音组件
 */
const { ccclass, property, menu } = _decorator;

export class AudioInfo {
    url: string = "";
    bundle: BUNDLE_TYPE = BUNDLE_RESOURCES;
    source: AudioSource | null = null;
    owner: UIView | null = null;
    action = new Vec2();

    play(): void {
        if (this.source) {
            this.source.play();
        }
    }

    pause(): void {
        if (this.source) {
            this.source.pause();
        }
    }

    stop(): void {
        if (this.source) {
            this.source.stop();
        }
    }

    resume() {
        if (this.source && this.source.currentTime < this.source.duration) {
            this.source.play();
        }
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
class AudioData {
    private static _instance: AudioData = null!;
    public static get instance() {
        if (this._instance == null) {
            this._instance = new AudioData();
            this._instance.init();
        }
        return this._instance;
    }
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

    private init() {

        //音量开关读取
        this.isMusicOn = Manager.localStorage.getItem(this._storeMusicKey, this.isMusicOn);
        this.isEffectOn = Manager.localStorage.getItem(this._storeEffectKey, this.isEffectOn);

        //音量读取
        this.musicVolume = Manager.localStorage.getItem(this._storeMusicVolumeKey, this.musicVolume);
        this.effectVolume = Manager.localStorage.getItem(this._storeEffectVolumeKey, this.effectVolume);
    }

    /**@description 存储 */
    public save() {
        try {
            Manager.localStorage.setItem(this._storeMusicKey, this.isMusicOn);
            Manager.localStorage.setItem(this._storeMusicVolumeKey, this.musicVolume);

            Manager.localStorage.setItem(this._storeEffectKey, this.isEffectOn);
            Manager.localStorage.setItem(this._storeEffectVolumeKey, this.effectVolume);
        } catch (error) {
        }
    }

    public remove(owner: UIView | null) {
        this.musicInfos.forEach((info, key, source) => {
            if (info.owner && info.owner == owner) {
                Tween.stopAllByTarget(info.action);
                source.delete(key);
            }
        });
        this.effectInfos.forEach((info, key, source) => {
            if (info.owner && info.owner == owner) {
                Tween.stopAllByTarget(info.action);
                source.delete(key);
            }
        })
    }

    public setMusicVolume(volume: number) {
        this.musicInfos.forEach((info, key, source) => {
            info.volume = volume;
        });
    }

    public setEffectVolume(volume: number) {
        this.effectInfos.forEach((info, key, source) => {
            info.volume = volume;
        });
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
        if (this.isEffectOn = isOn) {
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
        return `${Manager.assetManager.getBundleName(bundle)}_${url}`;
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
            info.resume();
        });
        this.effectInfos.forEach((info, key, source) => {
            info.resume();
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

@ccclass
@menu("framework/base/AudioComponent")
export default class AudioComponent extends EventComponent {

    onDestroy() {
        this.audioData.remove(this.owner);
        super.onDestroy();
    }

    protected audioData = AudioData.instance;

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

    /**@description 停止 */
    public stopEffect(url: string, bundle: BUNDLE_TYPE) { this.audioData.stopEffect(url, bundle); }

    public stopAllEffects() { this.audioData.stopAllEffects(); }

    public stopMusic() { this.audioData.stopMusic(); }

    public playMusic(url: string, bundle: BUNDLE_TYPE, loop: boolean = true) {
        return new Promise<boolean>((resolve) => {
            if (DEBUG) {
                if (!this.owner) {
                    error(`必须要指定资源的管理都才能播放`);
                    resolve(false);
                    return;
                }
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
            Manager.cacheManager.getCacheByAsync(url, AudioClip, bundle).then((data) => {
                if (data) {
                    let info = new ResourceInfo;
                    info.url = url;
                    info.type = AudioClip;
                    info.data = data;
                    info.bundle = bundle;
                    if (this.owner) {
                        Manager.uiManager.addLocal(info, this.owner.className);
                    } else {
                        Manager.uiManager.garbage.addLocal(info);
                    }
                    //停掉当前播放音乐
                    this.stopMusic();
                    //播放新的背景音乐
                    if (audioInfo && audioInfo.source) {
                        audioInfo.source.clip = data;
                        audioInfo.source.loop = loop;
                        //如果当前音乐是开的，才播放
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
            if (DEBUG) {
                if (!this.owner) {
                    error(`必须要指定资源的管理都才能播放`);
                    resolve(false);
                    return;
                }
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
            Manager.cacheManager.getCacheByAsync(url, AudioClip, bundle).then((data) => {
                if (data) {
                    let info = new ResourceInfo;
                    info.url = url;
                    info.type = AudioClip;
                    info.data = data;
                    info.bundle = bundle;
                    if (this.owner) {
                        Manager.uiManager.addLocal(info, this.owner.className);
                    } else {
                        Manager.uiManager.garbage.addLocal(info);
                    }
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

    protected play( info : AudioInfo , isMusic : boolean , resolve : (isSuccess : boolean)=>void){
        if( info && info.source ){
            if( isMusic ){
                if( this.isMusicOn ){
                    info.source.play();
                    resolve(true)
                }else{
                    resolve(false);
                }
            }else{
                if( this.isEffectOn ){
                    info.source.play();
                    resolve(true);
                }else{
                    resolve(false);
                }
            }
        }else{
            resolve(false);
        }
    }

    public onEnterBackground() {
        this.audioData.pauseAll();
    }

    public onEnterForgeground(inBackgroundTime: number) {
        this.audioData.resumeAll();
    }
}
