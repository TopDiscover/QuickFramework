import { sys } from "cc";

export let LanguageZH = {
    language: sys.Language.LANGUAGE_CHINESE,
    alert_title: "温馨提示",
    alert_confirm: "确 定",
    alert_cancel: "取 消",
    updating: "正在更新...",
    updateFaild: "更新{0}失败",
    updatingtips: [
      "人家正在努力加载中噢~",
      "对局中牌的顺序都是随机的，不用担心被人猜中！",
      "听说下雨天更适合打牌哟~~~",
      "三五好友，一起相约来“斗地主”~"
    ],
    newVersion: "检测到有新的版本，是否更新?",
    noFindManifest:"找不到版本文件!!!",
    downloadFailManifest:"下载版本文件失败!",
    manifestError : "版本文件解析错误!",
    checkingUpdate : "检测更新中...",
    newVersionForBundle : "检测到{0}有新的版本，是否更新?",
    alreadyRemoteVersion : "{0}已升级到最新",
    hall : "大厅",
    reconnect : "正在重连...",
    warningReconnect : "{0}网络已断开，是否重新连接？",
    tryReconnect : "{0}网络:正在尝试第{1}次连接...",
    quitGame : "您确定要退出游戏？",
    loading_game_resources : "正在加载游戏资源...",
  }