import { sys } from "cc";

export let LanguageEN = {

    language: sys.Language.ENGLISH,
    alert_title: "Tips",
    alert_confirm: "Confirm",
    alert_cancel: "Cancel",
    updating: "Updating",
    updateFaild: "Update {0} Faild",
    updatingtips: [
        "人家正在努力加载中噢~",
        "对局中牌的顺序都是随机的，不用担心被人猜中！",
        "听说下雨天更适合打牌哟~~~",
        "三五好友，一起相约来“斗地主”~"
    ],
    newVersion: "A new version is detected, do you want to update?",
    noFindManifest : "No find Manifest!!!",
    downloadFailManifest:"Download Fail Manifest!!!",
    manifestError : "Manifest decode error!!!",
    checkingUpdate : "Checking update...",
    newVersionForBundle : "检测到{0}有新的版本，是否更新?",
    alreadyRemoteVersion : "{0}已升级到最新",
    hall : "hall",
    reconnect : "Reconnect ... ",
    warningReconnect : "{0}网络已断开，是否重新连接？",
    tryReconnect : "{0}网络:正在尝试第{1}次连接...",
    quitGame : "您确定要退出游戏？",
    loading_game_resources : "正在加载游戏资源...",
}