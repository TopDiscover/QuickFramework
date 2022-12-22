import { sys } from "cc";

export let LanguageZH = {
  language: sys.Language.CHINESE,
  data: {
    alert_title: "温馨提示",
    alert_confirm: "确 定",
    alert_cancel: "取 消",
    loading: "正在加载...",
    updateFaild: "更新{0}失败",
    updatingtips: [
      "人家正在努力加载中噢~",
      "对局中牌的顺序都是随机的，不用担心被人猜中！",
      "听说下雨天更适合打牌哟~~~",
      "三五好友，一起相约来“斗地主”~"
    ],
    newVersion: "检测到有新的版本，是否更新?",
    noFindManifest: "找不到版本文件!!!",
    downloadFailManifest: "下载版本文件失败!",
    manifestError: "版本文件解析错误!",
    checkingUpdate: "检测更新中...",
    alreadyRemoteVersion: "{0}已升级到最新",
    reconnect: "正在重连...",
    warningReconnect: "{0}网络已断开，是否重新连接？",
    tryReconnect: "{0}网络:正在尝试第{1}次连接...",
    quitGame: "您确定要退出游戏？",
    loading_game_resources: "正在加载游戏资源...",
    mainPackVersionIsTooLow: "版本过低，请更新。",
    loadVersions: "正在加载远程版本信息",
    warnNetBad: "您的网络已断开，请重试!!",
    downloadFailed: "下载文件失败，请重试!!!",
    loadFailed: "{0}加载失败!!",
    loadingProgress: "加载资源中({0}%)...",
    bundles: {
      aimLine: {
        name: "瞄准线",
        sort: 4,
      },
      eliminate: {
        name: "爱消除",
        sort: 3
      },
      loadTest: {
        name: "加载示例",
        sort: 5
      },
      netTest: {
        name: "网络示例",
        sort: 6
      },
      nodePoolTest: {
        name: "对象池示例",
        sort: 7
      },
      tankBattle: {
        name: "坦克大战",
        sort: 2
      },
      taxi: {
        name: "快上车",
        sort: 1
      },
      snapshot: {
        name: "截图",
        sort: 8
      },
      resources : {
        name : "主包",
        sort : 0
      },
      hall: {
        name: "游戏大厅",
        sort: 0
      },
    },


    /**@description 图件多语言配置 */

    pic_background : "common/images/background",
    // pic_background : "common/images/com_bg_start2",

    richtext : "<color=#00ff00>富</c><color=#0fffff>文本</color>",
    pic_atlas : ["common/images/lobby_texture"],
    pic_key : "update_status_hot",
    pic_remote : "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_e835568.png",
    // pic_remote : "https://www.baidu.com/img/flexible/logo/pc/index_gray.png",
  }
}