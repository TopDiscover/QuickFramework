# CocosCreator 快速开发轻量级游戏框架
# 项目说明
本项目基于 cocos creator 3.3.1版本
以Asset Bundle为基础的大厅+子游戏示例
提供一个轻量级的游戏开发框架,让你的开发更加简单
# cocos creator 升级
引擎修正插件可直接对 2.3.1 ~ 3.3.2版本，可自行升级
项目中示例工程可自行按自己项目进行裁剪

升级步骤

1，升级后使用一次【引擎修正】插件

2，删除build目录

3，重新构建项目
# 详细文档
更为详细的文档，[请在本项目的doc中查看](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/doc)，由于个人原因，文档会逐步完成中，也同时欢迎进入我们的交流群中讨论，相互学习
同时也希望有更多的人参与，一起让creator的开发更加的简单。

# 项目框架结构
## [公共组件](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/componects)
公共组件基类，声音管理组件，事件组件
## [框架核心](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core)
### 1,[适配器](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/adaptor)
屏幕适配相关
### 2,[资源管理](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/asset)
资源的管理，如加载释放等相关资源管理
### 3,[事件管理](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/event)
### 4,[热更新模块](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/hotupdate)
### 5,[多语言模块](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/language)
### 6,[日志](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/log)
### 7,[逻辑处理](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/logic)
该模块为主流程控制模块，可以理解为管理每个Bundle的入口流程逻辑控制
### 8,[网络](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/net)
该网络部分已经集成了相关的网络，对网络数据的收发等操作，目前支持市面上主流的几种数据流格式，
1,json 数据格式
2,proto 数据格式
3,BinaryStream 数据格式 (即二进制数据流)
### 9,[对象池](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/nodePool)
### 10,[本地存储](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/storage)
### 11,[UI管理](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/core/ui)
该模块为整个框架最为核心部分，所有界面通过预置跟界面UIView绑定，通过UIManager工厂创建及显示视图
并关联界面视图的动态加载资源，通知到资源管理器，
当界面打开时，管理器会拿到绑定预置的预置，加载预置并显示界面
当界面关闭时，会自动清除，释放UIView中动态加载的所有资源，及UIView本身绑定
的预置资源的释放工作
## [框架扩展](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/plugin)
1，对引擎的接口扩展
对cocos引擎 cc.Sprite/cc.Button/cc.Label/cc.ParticleSystem/sp.Skeleton组件添加了loadXX接口，实现动态的加载替换组件相关信息

如需要加载一个网络图片你只需要使用：
```ts
//加载远程资源图片
let sprite = imageNode.getComponent(cc.Sprite);

sprite.loadRemoteImage({url :"http://tools.itharbors.com/res/logo.png", view : this});
```
2，全局扩展函数
如对String的格式化扩展
```ts
declare interface StringConstructor {
	/**
	 * @description 格式化字符串
	 * @example
	 * String.format("{0}-->{1}-->{2}","one","two","three") | String.format("{0}-->{1}-->{2}",["one","two","three"])
	 * => "one-->two-->three"
	 * */
	format(...args: any[]): string;
}
```
## [数据](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/data)
数据中心，完善中
## [框架类型及常量](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/assets/scripts/framework/defines)
1,常用检举
2,常用宏定义

# 强大的插件
## 1,[热更新插件](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/packages/hot-update-tools)
项目自己定制了热更新模块，目前还在完善中，并不完美，但基础的热更新逻辑已经实现
可支持热更新地址动态设置，不同Bundle资源分别放置到不同服务器部署
## 2,[引擎修正插件](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/packages/fix_engine)
项目对引擎源码扩展，都放到了这个修正插件上，再你使用本框架时，请务必执行到少一次的热更新插件，如果有新插件版本升级，也需要重新执行插件

# 分支说明
## [2.4.3](https://gitee.com/top-discover/QuickFramework/tree/2.4.3)
2.4.3 分支为 creator 版本在>=2.4.3版本以上使用，为2.4.x的对外分支
## [3.1.0](https://gitee.com/top-discover/QuickFramework/tree/3.1.0)
3.1.0 分支为 creator 版本在>=3.1.0版本以上使用，为3.x的对外分支
## 其它分支为开发中的分支，请不要轻易使用

![欢迎大家进群讨论](https://images.gitee.com/uploads/images/2021/0704/233403_8c07fe63_393413.jpeg "qrcode_1625412690446.jpg")
