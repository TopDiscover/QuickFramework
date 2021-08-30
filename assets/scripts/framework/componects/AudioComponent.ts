import EventComponent from "./EventComponent";
import { UIView } from "../core/ui/UIView";

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
    public musicVolume = 1;
    public effectVolume = 1;
    public isEffectOn = true;
    public isMusicOn = true;
    public curMusicUrl = "";
    public curEffectId = -1;
    /**@description 当前背景音乐的Bundle */
    public curBundle : BUNDLE_TYPE = null;
    /**@description 当前背景音乐是否循环播放 */
    public curLoop : boolean = true;
    /**@description 当前背景音乐是否正在播放 */
    public isPlaying : boolean = false;

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

const PLAY_MUSIC = "AudioComponent_PLAY_MUSIC";

@ccclass
@menu("framework/base/AudioComponent")
export default class AudioComponent extends EventComponent {


    protected bindingEvents(){
        super.bindingEvents();
        this.registerEvent(PLAY_MUSIC,this.onPlayMusic);
    }

    private onPlayMusic( data ){
        if( this.curPlayMusicUrl == this.curMusicUrl && !this.isPlaying && this.curMusicUrl && this.curBundle ){
            this.playMusic(this.curMusicUrl,this.curBundle,this.curLoop);
        }
    }

    protected audioData = AudioData.instance;

    /**@description 音频控件资源拥有者，该对象由UIManager打开的界面 */
    public owner : UIView = null;

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
            dispatch(PLAY_MUSIC,this);
        } else {
            this.stopMusic();
        }
    };
    /**@description 当前播放的背景音乐 */
    public get curMusicUrl() { return this.audioData.curMusicUrl; }
    public set curMusicUrl(value) { this.audioData.curMusicUrl = value };
    public get curBundle(){ return this.audioData.curBundle;}
    public set curBundle(value){ this.audioData.curBundle = value;}
    protected get curLoop(){ return this.audioData.curLoop;}
    protected set curLoop(value) { this.audioData.curLoop = value};
    protected get isPlaying(){ return this.audioData.isPlaying;}
    protected set isPlaying(value){ this.audioData.isPlaying = value};
    /**@description 指向当前组件的播放音乐 */
    protected curPlayMusicUrl : string = null;

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

    public playMusic(url: string, bundle : BUNDLE_TYPE , loop: boolean = true) {
        return new Promise<{ url: string, isSuccess: boolean }>((resolve) => {
            if ( CC_DEBUG ){
                if ( !this.owner ){
                    cc.error(`必须要指定资源的管理都才能播放`);
                    resolve({url:url,isSuccess:false});
                    return;
                }
            }
            this.curPlayMusicUrl = url;
            this.curMusicUrl = url;
            this.curBundle = bundle;
            this.curLoop = loop;
            if (this.audioData.isMusicOn) {
                Manager.cacheManager.getCacheByAsync(url,cc.AudioClip,bundle).then((data) => {
                    if (data) {
                        let info = new td.Resource.Info;
                        info.url = url;
                        info.type = cc.AudioClip;
                        info.data = data;
                        info.bundle = bundle;
                        if ( this.owner ){ 
                            Manager.uiManager.addLocal(info,this.owner.className);
                        }else{
                            Manager.uiManager.garbage.addLocal(info);
                        }
                        //停掉当前播放音乐
                        this.stopMusic();
                        //播放新的背景音乐
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

    public playEffect(url: string, bundle:BUNDLE_TYPE ,loop: boolean = false) {
        return new Promise<number>((resolve) => {
            if ( CC_DEBUG ){
                if ( !this.owner ){
                    cc.error(`必须要指定资源的管理都才能播放`);
                    resolve(-1);
                    return;
                }
            }
            if (this.audioData.isEffectOn) {
                Manager.cacheManager.getCacheByAsync(url,cc.AudioClip,bundle).then((data) => {
                    if (data) {
                        let info = new td.Resource.Info;
                        info.url = url;
                        info.type = cc.AudioClip;
                        info.data = data;
                        info.bundle = bundle;
                        if ( this.owner ) {
                            Manager.uiManager.addLocal(info,this.owner.className);
                        }else{
                            Manager.uiManager.garbage.addLocal(info);
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
