import { HotUpdate, AssetManagerCode, AssetManagerState, BundleConfig, DownLoadInfo } from "../base/HotUpdate";
import { CommonEvent } from "../event/CommonEvent";
import { i18n } from "../language/LanguageImpl";
import { Config} from "../config/Config";
import { Manager } from "./Manager";
import DownloadLoading from "../component/DownloadLoading";
import { game } from "cc";
import { DEBUG } from "cc/env";
import { ViewZOrder } from "../config/ViewZOrder";

/**
 * @description bundle管理器
 */

export class BundleManager {
   private static _instance: BundleManager = null!;
   public static Instance() { return this._instance || (this._instance = new BundleManager()); }
   private curBundle: BundleConfig = null!;
   private isLoading = false;


   /**@description 已经加载的bundle */
   private loadedBundle: string[] = []

   /**@description 删除已经加载的bundle */
   public removeLoadedBundle() {
      this.loadedBundle.forEach((value, index, origin) => {
         Manager.assetManager.removeBundle(value);
      });
      this.loadedBundle = [];
   }

   /**@description 删除所有加载子游戏的bundle */
   public removeLoadedGamesBundle() {
      let i = this.loadedBundle.length;
      while (i--) {
         if( this.loadedBundle[i] != Config.BUNDLE_HALL ){
            Manager.assetManager.removeBundle(this.loadedBundle[i]);
            this.loadedBundle.splice(i,1);
         }
      }
   }

   /**
    * 外部接口 进入Bundle
    * @param config 配置
    */
   public enterBundle(config: BundleConfig) {
      if (this.isLoading) {
         Manager.tips.show(i18n.updating);
         log("正在更新游戏，请稍等");
         return;
      }
      this.curBundle = config;
      this.isLoading = true;

      if (!HotUpdate.bundlesConfig[this.curBundle.bundle]) {
         HotUpdate.bundlesConfig[this.curBundle.bundle] = config;
      }

      let versionInfo = HotUpdate.bundlesConfig[this.curBundle.bundle];
      this.checkUpdate(versionInfo);
   }

   private onGameReady() {
      if (this.isLoading) {
         this.isLoading = false;
      }
      dispatch(this.curBundle.event, this.curBundle.bundle);
   }

   /**@description 检测子游戏更新 */
   private checkUpdate(versionInfo: BundleConfig) {
      let self = this;
      log(`检测更新信息:${versionInfo.name}(${versionInfo.bundle})`);
      Manager.eventDispatcher.removeEventListener(CommonEvent.HOTUPDATE_DOWNLOAD,this);
      HotUpdate.checkGameUpdate(this.curBundle.bundle, (code, state) => {
         if (code == AssetManagerCode.NEW_VERSION_FOUND) {
            //有新版本
            Manager.eventDispatcher.addEventListener(CommonEvent.HOTUPDATE_DOWNLOAD,this.onDownload,this);
            log(`检测到${versionInfo.name}(${versionInfo.bundle})有新的版本`);
            if( versionInfo.isNeedPrompt ){
               Manager.alert.show({
                  text:String.format(i18n.newVersionForBundle,versionInfo.name),
                  confirmCb:(isOK)=>{
                     if( isOK ){
                        Manager.uiManager.open({type:DownloadLoading,zIndex:ViewZOrder.Loading,args:[state,versionInfo.name]});
                     }else{
                        //不更新
                        //直接关闭掉游戏
                        game.end();
                     }
                  }
               });
            }else{
               HotUpdate.hotUpdate();
            }
         } else if (state == AssetManagerState.TRY_DOWNLOAD_FAILED_ASSETS) {
            //尝试重新下载之前下载失败的文件
            Manager.eventDispatcher.addEventListener(CommonEvent.HOTUPDATE_DOWNLOAD,this.onDownload,this);
            log(`正在尝试重新下载之前下载失败的资源`);
            if( versionInfo.isNeedPrompt ){
               Manager.alert.show({
                  text:String.format(i18n.newVersionForBundle,versionInfo.name),
                  confirmCb:(isOK)=>{
                     if( isOK ){
                        Manager.uiManager.open({type:DownloadLoading,zIndex:ViewZOrder.Loading,args:[state,versionInfo.name]});
                     }else{
                        game.end();
                     }
                  }
               });
            }else{
               HotUpdate.downloadFailedAssets();
            }
         } else if (code == AssetManagerCode.ALREADY_UP_TO_DATE) {
            //已经是最新版本
            //以最新的bundle为准
            self.loadBundle();
         } else if (code == AssetManagerCode.ERROR_DOWNLOAD_MANIFEST ||
            code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST ||
            code == AssetManagerCode.ERROR_PARSE_MANIFEST) {
            //下载manifest文件失败
            this.isLoading = false;
            let content = i18n.downloadFailManifest;
            if (code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST) {
               content = i18n.noFindManifest;
            } else if (code == AssetManagerCode.ERROR_PARSE_MANIFEST) {
               content = i18n.manifestError;
            }
            Manager.tips.show(content);
         } else if (code == AssetManagerCode.CHECKING) {
            //当前正在检测更新
            log(`正在检测更新!!`);
         } else {
            this.isLoading = false;
            log(`检测更新当前状态 code : ${code} state : ${state}`);
         }
      });
   }

   private loadBundle() {
      // Manager.assetManager.removeBundle(this.curGame.bundle);
      log(`updateGame : ${this.curBundle.bundle}`);
      let me = this;
      //加载子包
      let versionInfo = HotUpdate.bundlesConfig[this.curBundle.bundle];
      Manager.assetManager.loadBundle(versionInfo.bundle, (err, bundle) => {
         me.isLoading = false;
         if (err) {
            error(`load bundle : ${versionInfo.bundle} fail !!!`);
            Manager.tips.show(String.format(i18n.updateFaild, versionInfo.name));
         } else {
            log(`load bundle : ${versionInfo.bundle} success !!!`);
            this.loadedBundle.push(versionInfo.bundle);
            me.onGameReady();
         }
      });
   }
   private onDownload( info : DownLoadInfo ) {
      if (DEBUG) log(JSON.stringify(info));
      let newPercent = 0;
      /**
       *  @description 找不到本地mainfest文件
    ERROR_NO_LOCAL_MANIFEST,
    @description 下载manifest文件错误 
    ERROR_DOWNLOAD_MANIFEST,
    /**@description 解析manifest文件错误 
    ERROR_PARSE_MANIFEST,
    /**@description 找到新版本 
    NEW_VERSION_FOUND,
    /**@description 当前已经是最新版本 
    ALREADY_UP_TO_DATE,
    /**@description 更新下载进度中 
    UPDATE_PROGRESSION,
    /**@description 资源更新中 
    ASSET_UPDATED,
    /**@description 更新错误 
    ERROR_UPDATING,
    /**@description 更新完成 
    UPDATE_FINISHED,
    /**@description 更新失败 
    UPDATE_FAILED,
    /**@description 解压资源失败 
    ERROR_DECOMPRESS,
       */

      let config = HotUpdate.getBundleName(this.curBundle.bundle);

      if (info.code == AssetManagerCode.UPDATE_PROGRESSION) {
         newPercent = info.percent == Number.NaN ? 0 : info.percent;
         dispatch(CommonEvent.DOWNLOAD_PROGRESS, { progress: newPercent, config: config });
      } else if (info.code == AssetManagerCode.ALREADY_UP_TO_DATE) {
         newPercent = 1;
         dispatch(CommonEvent.DOWNLOAD_PROGRESS, { progress: newPercent, config: config });
      } else if (info.code == AssetManagerCode.UPDATE_FINISHED) {
         newPercent = 1.1;
         log(`更新${config.name}成功`);
         log(`正在加载${config.name}`);
         this.loadBundle();
         dispatch(CommonEvent.DOWNLOAD_PROGRESS, { progress: newPercent, config: config });
      } else if (info.code == AssetManagerCode.UPDATE_FAILED ||
         info.code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST ||
         info.code == AssetManagerCode.ERROR_DOWNLOAD_MANIFEST ||
         info.code == AssetManagerCode.ERROR_PARSE_MANIFEST ||
         info.code == AssetManagerCode.ERROR_DECOMPRESS) {
         newPercent = -1;
         this.isLoading = false;
         error(`更新${config.name}失败`);
         dispatch(CommonEvent.DOWNLOAD_PROGRESS, { progress: newPercent, config: config });
      }
   }
}