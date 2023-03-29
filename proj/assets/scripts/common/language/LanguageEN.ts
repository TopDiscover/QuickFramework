import { sys } from "cc";

export let LanguageEN = {

    language: sys.Language.ENGLISH,
    data: {
        alert_title: "Tips",
        alert_confirm: "Confirm",
        alert_cancel: "Cancel",
        loading: "正在加载...",
        updateFaild: "Update {0} Faild",
        updatingtips: [
            "人家正在努力加载中噢~",
            "对局中牌的顺序都是随机的，不用担心被人猜中！",
            "听说下雨天更适合打牌哟~~~",
            "三五好友，一起相约来“斗地主”~"
        ],
        newVersion: "A new version is detected, do you want to update?",
        noFindManifest: "No find Manifest!!!",
        downloadFailManifest: "Download Fail Manifest!!!",
        manifestError: "Manifest decode error!!!",
        checkingUpdate: "Checking update...",
        alreadyRemoteVersion: "{0}已升级到最新",
        reconnect: "Reconnect ... ",
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
                name: "Aim Line",
                sort: 4,
            },
            eliminate: {
                name: "爱消除",
                sort: 3
            },
            loadTest: {
                name: "Load Test",
                sort: 5
            },
            netTest: {
                name: "Net Test",
                sort: 6
            },
            nodePoolTest: {
                name: "Node Pool",
                sort: 7
            },
            tankBattle: {
                name: "BATTLE\nCITY",
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
            chat: {
                name: "聊天室",
                sort: 9
            },
            resources: {
                name: "主包",
                sort: 0
            },
            hall: {
                name: "游戏大厅",
                sort: 0
            },
        },

        capture_save_success: "保存图片成功",
        capture_save_failed: "保存图片失败",
        capture_success: "截图成功",
        capture_failed: "截图成功",
        capture_save_photo_album: "成功保存到设备相册",
        capture_save_local_success1: "成功保存在设备目录并加载成功: {0}",
        capture_save_local_success2: "成功保存在设备目录: {0}",

        /**@description 图件多语言配置 */

        pic_background: "common/images/com_bg_start2",

        richtext: "<color=#00ff00>Rich</c><color=#0fffff>Text</color>",
        pic_atlas: ["common/images/lobby_texture"],
        pic_key: "update_status_new",
        pic_remote: "https://www.baidu.com/img/flexible/logo/pc/index_gray.png",
    }
}