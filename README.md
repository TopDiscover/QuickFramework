CocosCreator 快速开发轻量级棋牌框架
========

项目说明
--------

本项目基于 cocos creator 3.1.0版本

以Asset Bundle为基础的大厅+子游戏示例
提供一个轻量级的棋牌开发框架,让你的开发更加简单

cocos creator 升级
--------
引擎修正插件可直接对 2.4.0 ~ 2.4.3版本，可自行升级

升级步骤

1，升级后使用一次【引擎修正】插件

2，删除build目录

3，重新构建项目

[界面管理器](https://gitee.com/top-discover/QuickFramework/tree/2.4.0/assets/script/framework/base/UIManager.ts)
--------
视图全部以预置体方式，通过管理界面进行打开,所有界面都必须继承自界面视图[UIView](https://gitee.com/top-discover/QuickFramework/tree/2.4.0/assets/script/framework/ui/UIView.ts)

[引擎组件load接口扩展](https://gitee.com/top-discover/QuickFramework/tree/2.4.0/assets/script/framework/extentions/CocosExtention.js)
--------

对cocos引擎 cc.Sprite/cc.Button/cc.Label/cc.ParticleSystem/sp.Skeleton组件添加了loadXX接口，实现动态的加载替换组件相关信息

如需要加载一个网络图片你只需要使用：
```ts
//加载远程资源图片
let sprite = imageNode.getComponent(cc.Sprite);

sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", view : this});
```

当界面关闭时，界面管理器会把当前界面load进入的资源关联的释放，不需要关心资源释放的问题，框架已经处理了这个资源的释放

[子游戏资源引用检测插件](https://gitee.com/top-discover/QuickFramework/tree/2.4.0/packages/check_resources)
---------
主要是检测子游戏的预置体是否引用了其它子游戏的资源，当打包apk/ipa包时，下载子游戏A，但子游戏A中引用了子游戏B的资源，从而导致子游戏A无法运行
当你开发完成子游戏后，要该插件来检测你的资源是否引用正确，如果有错误的引用，请注意查看你的控制台信息，会提示你哪一个资源引用错误

[引擎修正插件](https://gitee.com/top-discover/QuickFramework/tree/2.4.0/packages/fix_engine)
---------
当前是为了实现大厅+子游戏，对引擎的源码进行了修改，修改的内容放到[packages/engine](https://gitee.com/top-discover/QuickFramework/tree/2.4.0/packages/engine)下，当执行完成插件，会对你当前的Cocos Creator进行修正，
即把对引擎的改动替换到你的Cocos Creator中，如果你已经build过，请自己手动对编译出来的文件进行替换，后期会支持对build目录下的源码修正。

[热更新生成工具](https://gitee.com/top-discover/QuickFramework/tree/2.4.0/packages/hot-update-tools)
--------
生成版本控制文件

注意事项
-------
跑热更新示例时，需要修改[TEST_HOT_UPDATE_URL_ROOT](https://gitee.com/top-discover/QuickFramework/blob/2.4.0/assets/script/common/config/Config.ts#L21)为自己的服务器测试地址.
