import { getSingleton } from "../../framework/base/Singleton";
import { LogicEvent } from "../event/LogicEvent";
import { HotUpdate, AssetManagerCode, AssetManagerState, SubGameUpdateType, GameConfig } from "../base/HotUpdate";
import { HallEvent } from "../../hall/HallEvent";

export function gameManager() {
   return getSingleton(GameManager);
}

class GameManager {
   private static _instance: GameManager = null;
   public static Instance() { return this._instance || (this._instance = new GameManager()); }
   private curGame: GameConfig = null;
   private isLoading = false;

   /**
    * 外部接口 进入游戏
    * @param areaType
    */
   public enterGame(config: GameConfig) {//进入游戏（输入房间号）
      if (this.isLoading) {
         cc.log("正在更新游戏，请稍等");
         return;
      }
      this.curGame = config;
      this.isLoading = true;

      if (!HotUpdate.allGameConfig[this.curGame.subpackageName]) {
         HotUpdate.allGameConfig[this.curGame.subpackageName] = config;
      }

      let versionInfo = HotUpdate.allGameConfig[this.curGame.subpackageName];

      if (CC_PREVIEW) {
         this.onGameReady();
      } else {
         if (HotUpdate.subGameUpdateType == SubGameUpdateType.Normal) {
            if (versionInfo.isLoaded) {
               cc.log(`游戏已经加载过了`);
               this.onGameReady();
            } else {
               //检测游戏版本更新
               this.checkUpdate(versionInfo);
            }
         } else {
            this.checkUpdate(versionInfo);
         }

      }
   }
  
   private onGameReady() {
      if (this.isLoading) {
         this.isLoading = false;
      }
      dispatch(LogicEvent.ENTER_GAME, this.curGame.subpackageName);
   }

   /**@description 检测子游戏更新 */
   private checkUpdate(versionInfo: GameConfig) {
      let self = this;
      cc.log(`检测更新信息:${versionInfo.gameName}(${versionInfo.subpackageName})`);
      HotUpdate.checkGameUpdate(this.curGame.subpackageName, (code, state) => {
         if (code == AssetManagerCode.NEW_VERSION_FOUND) {
            //有新版本
            HotUpdate.onDownload = this.onDownload.bind(this);
            cc.log(`检测到${versionInfo.gameName}(${versionInfo.subpackageName})有新的版本`);
            HotUpdate.hotUpdate();
         } else if (state == AssetManagerState.TRY_DOWNLOAD_FAILED_ASSETS) {
            //尝试重新下载之前下载失败的文件
            HotUpdate.onDownload = this.onDownload.bind(this);
            cc.log(`正在尝试重新下载之前下载失败的资源`);
            HotUpdate.downloadFailedAssets();
         } else if (code == AssetManagerCode.ALREADY_UP_TO_DATE) {
            //已经是最新版本
            if (versionInfo.isLoaded) {
               self.onGameReady();
            } else {
               self.loadSubpackage();
            }
         } else if (code == AssetManagerCode.ERROR_DOWNLOAD_MANIFEST ||
            code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST ||
            code == AssetManagerCode.ERROR_PARSE_MANIFEST) {
            //下载manifest文件失败
            this.isLoading = false;
            let content = "下载版本文件失败!";
            if (code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST) {
               content = "找不到版本文件!";
            } else if (code == AssetManagerCode.ERROR_PARSE_MANIFEST) {
               content = "版本文件解析错误!";
            }
            //Manager.toast.show(content);
         } else if (code == AssetManagerCode.CHECKING) {
            //当前正在检测更新
            cc.log(`正在检测更新!!`);
         } else {
            this.isLoading = false;
            cc.log(`检测更新当前状态 code : ${code} state : ${state}`);
         }
      });
   }

   private loadSubpackage() {
      cc.log(`updateGame : ${this.curGame.subpackageName}`);
      let me = this;
      //加载子包
      let versionInfo = HotUpdate.allGameConfig[this.curGame.subpackageName];
      cc.loader.downloader.loadSubpackage(versionInfo.subpackageName, (err) => {
         me.isLoading = false;
         //Manager.loading.hide();
         if (err) {
            cc.error(`load subpackage : ${versionInfo.subpackageName} fail !!!`);
            //Manager.toast.show(`加载${versionInfo.subpackageName}失败!`);
            versionInfo.isLoaded = false;
         } else {
            cc.log(`load subpackage : ${versionInfo.subpackageName} success !!!`);
            versionInfo.isLoaded = true;
            me.onGameReady();
         }
      });
   }
   private onDownload(
      downloadedBytes: number,
      totalBytes: number,
      downloadedFiles: number,
      totalFiles: number,
      percent: number,
      percentByFile: number,
      code: AssetManagerCode,
      state: AssetManagerState,
      needRestart: boolean) {
      if (CC_DEBUG) cc.log(`
downloadedBytes : ${downloadedBytes}
totalBytes : ${totalBytes}
downloadedFiles : ${downloadedFiles}
totalFiles : ${totalFiles}
percent : ${percent}
percentByFile : ${percentByFile}
code : ${code}
state : ${state}
needRestart : ${needRestart}
`);
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

      let gameName = HotUpdate.getGameLocalName(this.curGame.subpackageName);

      if (code == AssetManagerCode.UPDATE_PROGRESSION) {
         newPercent = percent == Number.NaN ? 0 : percent;
         dispatch(HallEvent.DOWNLOAD_PROGRESS, { progress: newPercent, name: this.curGame.subpackageName });
      } else if (code == AssetManagerCode.ALREADY_UP_TO_DATE) {
         newPercent = 1;
         dispatch(HallEvent.DOWNLOAD_PROGRESS, { progress: newPercent, name: this.curGame.subpackageName });
      } else if (code == AssetManagerCode.UPDATE_FINISHED) {
         newPercent = 1.1;
         cc.log(`更新${gameName}成功`);
         if (!needRestart) {
            //不需要重启//直接加载子游戏进入
            cc.log(`正在加载${gameName}`);
            this.loadSubpackage();
         }
         dispatch(HallEvent.DOWNLOAD_PROGRESS, { progress: newPercent, name: this.curGame.subpackageName });
      } else if (code == AssetManagerCode.UPDATE_FAILED ||
         code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST ||
         code == AssetManagerCode.ERROR_DOWNLOAD_MANIFEST ||
         code == AssetManagerCode.ERROR_PARSE_MANIFEST ||
         code == AssetManagerCode.ERROR_DECOMPRESS) {
         newPercent = -1;
         this.isLoading = false;
         cc.error(`更新${gameName}失败`);
         dispatch(HallEvent.DOWNLOAD_PROGRESS, { progress: newPercent, name: this.curGame.subpackageName });
      }
   }
}
