import UIView from "../ui/UIView";
import { ResourceInfo, BUNDLE_TYPE, BUNDLE_RESOURCES } from "./Defines";
import { Manager } from "../Framework";
import EventComponent from "./EventComponent";
import { AudioClip, AudioSource, _decorator } from "cc";
import { DEBUG } from "cc/env";

/**
 * @description 声音组件
 */
const { ccclass, property, menu } = _decorator;

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
    public curMusicUrl = "";
    /**@description 当前背景音乐的Bundle */
    public curBundle: BUNDLE_TYPE | null = null;
    /**@description 当前背景音乐是否循环播放 */
    public curLoop: boolean = true;
    /**@description 当前背景音乐是否正在播放 */
    public isPlaying: boolean = false;

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
}

export class AudioInfo{
    url : string = "";
    bundle : BUNDLE_TYPE = BUNDLE_RESOURCES;
    source : AudioSource | null = null;

     play(): void{
         if( this.source ){
             this.source.play();
         }
     }
     
     pause(): void{
         if( this.source ){
            this.source.play();
         }
     }
     
     stop(): void{
        if( this.source ){
            this.source.play();
        }
     }

    set volume(val: number){
        if( this.source ){
            this.source.volume = val;
        }
    }
    get volume(): number{
        if( this.source ){
            return this.source.volume;
        }
        return 0;
    }
}

const PLAY_MUSIC = "AudioComponent_PLAY_MUSIC";

@ccclass
@menu("framework/base/AudioComponent")
export default class AudioComponent extends EventComponent {


    /**@description 保存所有播放的音乐 */
    protected musicInfos : Map<string,AudioInfo> = new Map();
    /**@description 保存所有播放的音效 */
    protected effectInfos : Map<string,AudioInfo> = new Map();

    protected bindingEvents() {
        super.bindingEvents();
        this.registerEvent(PLAY_MUSIC, this.onPlayMusic);
    }

    private onPlayMusic(data: any) {
        if (this.curPlayMusicUrl == this.curMusicUrl && !this.isPlaying && this.curMusicUrl && this.curBundle) {
            this.playMusic(this.curMusicUrl, this.curBundle, this.curLoop);
        }
    }

    protected audioData = AudioData.instance;

    /**@description 音频控件资源拥有者，该对象由UIManager打开的界面 */
    public owner: UIView | null = null;

    /**@description 背景音乐音量 */
    public get musicVolume() { return this.audioData.musicVolume; }
    public set musicVolume(volume) {
        this._setMusicVolume(volume);
        if (volume <= 0) {
            this.stopMusic();
        }
        this.audioData.musicVolume = volume;
    };
    /**@description 音效音量 */
    public get effectVolume() { return this.audioData.effectVolume; }
    public set effectVolume(volume) {
        this._setEffectVolume(volume);
        if (volume <= 0) {
            this.stopAllEffects();
        }
        this.audioData.effectVolume = volume;
    };

    /**@description 音效开关 */
    public get isEffectOn() { return this.audioData.isEffectOn; }
    public set isEffectOn(value) {
        this.audioData.isEffectOn = value;
        this.save();
        if (!value) {
            this.stopAllEffects();
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
    public get curBundle() { return this.audioData.curBundle; }
    public set curBundle(value) { this.audioData.curBundle = value; }
    protected get curLoop() { return this.audioData.curLoop; }
    protected set curLoop(value) { this.audioData.curLoop = value };
    protected get isPlaying() { return this.audioData.isPlaying; }
    protected set isPlaying(value) { this.audioData.isPlaying = value };
    /**@description 指向当前组件的播放音乐 */
    protected curPlayMusicUrl: string | null = null;

    /**@description 存储 */
    public save() {
        this.audioData.save();
    }

    /**@description 停止 */
    public stopEffect(url : string , bundle : BUNDLE_TYPE) {
        let key = this.makeKey(url,bundle);
        let info = this.effectInfos.get(key);
        if( info ){
            info.stop();
        }
    }

    public stopAllEffects() {
        this.effectInfos.forEach((info,key,source)=>{
            if( info.source && info.source.clip ){
                info.source.stop();
            }
        });
    }

    public stopMusic() {
        this.musicInfos.forEach((info,key,source)=>{
            info.stop();
        });
        this.isPlaying = false;
    }

    public playMusic(url: string, bundle: BUNDLE_TYPE, loop: boolean = true) {
        return new Promise<boolean>((resolve) => {
            if (DEBUG) {
                if (!this.owner) {
                    error(`必须要指定资源的管理都才能播放`);
                    resolve(false);
                    return;
                }
            }
            this.curPlayMusicUrl = url;
            this.curMusicUrl = url;
            this.curBundle = bundle;
            this.curLoop = loop;
            if (this.audioData.isMusicOn) {
                let key = this.makeKey(url,bundle);
                let audioInfo = this.musicInfos.get(key);
                if( !audioInfo ){
                    audioInfo = new AudioInfo;
                    audioInfo.url = url;
                    audioInfo.bundle = bundle;
                    audioInfo.source = this.node.addComponent(AudioSource);
                    audioInfo.source.playOnAwake = false;
                    this.musicInfos.set(key,audioInfo);
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
                        //停掉当前播放音乐
                        this.stopMusic();
                        //播放新的背景音乐
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

    public playEffect(url: string, bundle: BUNDLE_TYPE, loop: boolean = false) {
        return new Promise<boolean>((resolve) => {
            if (DEBUG) {
                if (!this.owner) {
                    error(`必须要指定资源的管理都才能播放`);
                    resolve(false);
                    return;
                }
            }
            if (this.audioData.isEffectOn) {
                //检查是否已经加载过
                let key = this.makeKey(url,bundle);
                let audioInfo =this.effectInfos.get(key);
                if( !audioInfo ){
                    audioInfo = new AudioInfo();
                    audioInfo.url = url;
                    audioInfo.bundle = bundle;
                    audioInfo.source = this.node.addComponent(AudioSource);
                    audioInfo.source.playOnAwake = false;
                    this.effectInfos.set(key,audioInfo);
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

    protected makeKey( url : string , bundle : BUNDLE_TYPE ){
        return `${Manager.assetManager.getBundleName(bundle)}_${url}`;
    }

    public onEnterBackground() {
        this._pauseAudios();
    }

    public onEnterForgeground(inBackgroundTime: number) {
        this._resumeAudios();
    }


    /**@description 统一设置音乐的声音大小 */
    protected _setMusicVolume( value : number ){
        this.musicInfos.forEach((info,key,source)=>{
            info.volume = value;
        });
    }

    /**@description 统一设置音效的声音大小 */
    private _setEffectVolume( value : number ){
        this.effectInfos.forEach((info,key,source)=>{
            info.volume = value;
        });
    }

    private _pauseAudios(){
       this.musicInfos.forEach((info,key,source)=>{
           info.pause();
       });
       this.effectInfos.forEach((info,key,source)=>{
           info.pause();
       });
    }

    private _resumeAudios(){
        this.musicInfos.forEach((info,key,source)=>{
            info.play();
        });
        this.effectInfos.forEach((info,key,source)=>{
            info.play();
        });
    }

}
