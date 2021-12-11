# CocosCreator 快速开发轻量级游戏框架
# 项目说明
本项目基于 cocos creator 3.3.1版本
以Asset Bundle为基础的大厅+子游戏示例
提供一个轻量级的游戏开发框架,让你的开发更加简单
# cocos creator 升级
引擎修正插件可直接对 3.3.1 ~ 3.3.2版本，可自行升级
项目中示例工程可自行按自己项目进行裁剪

升级步骤

1，升级后使用一次【引擎修正】插件

2，重新构建项目
# 详细文档
更为详细的文档，[请在本项目的doc中查看](https://gitee.com/top-discover/QuickFramework/tree/3.1.0/doc)，由于个人原因，文档会逐步完成中，也同时欢迎进入我们的交流群中讨论，相互学习
同时也希望有更多的人参与，一起让creator的开发更加的简单。


# 关于QuickFramework
- **Q : 为什么使用单场景？**
    - **保证视图在切换场景时正常弹出**
    * 如下情况，如多场景情况下，A场景->B场景，A场景上请求网络数据希望在B场景上弹出，当收到网络返回时
    还需要检查当前是否在B场景中，如果不在则压入到显示队列中，等进入B场景，检查当前是否有显示视图队列
    如果有显示的视图，依次弹出，但如果采用单场景化，无须关心在哪一个场景，收到网络回复直接弹出。
    - **保护界面状态**
    * 还是在多场景下，在切换场景时，必定会先把场景上所有视图关闭，清除数据，但若有需要在A场景下显示的
    界面也希望在B场景下显示，此时场景的过渡，会先关闭界面，进入B场景时显示，但如果场景上有ListView类
    似的控件，也希望在切换场景时，显示之前玩家操作显示的位置，那么必定会花费额外的工作去保存玩家在A场景
    上操作界面的相关信息，再进入B场景时，恢复玩家对界面操作的所有状态，但如果只是单场景，可以模拟一个
    场景的切换动作，直接隐藏掉界面，进入B场景，直接显示，无须保存界面的状态。

- **Q : 项目为什么不推荐使用在预置体中直接挂载脚本？**
    - **方便重构**
    * 如下情况，当你发现目录结构不合理，或者文件名取名有误时，但此时已经在预置上挂载了过多的组件，还有
    些项目的子游戏是在不同的svn版本管理下，在开发时，并不会放入全量的代码进入开发，如果如果此时改名或
    移动目录，可能会造成文件的uuid发生变化，Creator上只会显示该脚本为Misson状态，并不会显示之前挂载
    的是哪一个脚本，若项目足够大，一个脚本的uuid变化，可能会造成大量预置体重新设置挂载脚本，提高了
    维护的成本
- **Q : 为什么项目都采用预置体+UIView组件绑定方式？**
    - 1，统一化管理，工厂式创建，方便实现统一的动画效果，一个公司的界面显示动画，可能大多数情况下是统一风格，如果我们要实现统一定制化
    动画，只需要在UIView中统一处理，直接显示通过UIManager.open()方式调用
    * 2，把内存及资源的管理交到管理器处理，减少开发者对何时释放资源，何时加载资源的烦恼，只关注自己的
    业务逻辑处理，无须关注资源的加载与释放
    * 3，接口统一，方便后期对界面的打开次数统计，以提供数据给运营人员，查看该模块的受欢迎程度
- **Q : 项目主要核心模块为什么都在管理器Manager上？**
    - 提高可读性，新手上手快，拿到代码只能从Manager上直接了解整个项目的结构模块，尽量避免全局变量满天飞的情况
    后面框架的使用者也可直接把全局的通过数据直接挂载到Manager中使用，减少全局变量的污染。
- **Q : 项目为什么推荐万事尽量保留类型？***
    - 个人观点，项目采用VSCode + Creator + typescript 方式进行开发，而typescript VSCode 都是Microsoft 公司
    的产品，Microsoft公司在JavaScript 基础上加上了type,就是为了解决弱语言类型无类型化，可读性差，
    * 1，您可以清楚你的实际来自哪一个类型，跟继承的关系
    * 2，编辑友好加上VSCode的智能代码提示跟静态语法检查，让你在开发时，减少错误
    * 3，代码更严谨，可在传入参数中限制传入的类型，类型的检查交给VSCode处理
    * 4，方便重构，如果当你发现某个文件放置位置不对，可直接在VSCode中拖动到你想要的位置，VSCode会自动的更正你托动
    代码所有引用的位置，或者对API 类名等修改操作，VSCode也会自动更改所有引用此类型的地方，降低重构的成本
    * 5，最后说一句，没有人比VSCode 更懂TypeScript ,TypeScript的重点在Type,无论什么情况，尽量保留类型。
# 框架定位
本框架主要为轻量级游戏打造的一个基础框架雏形，可适用于休闲类，小游戏类，棋牌类，文字游戏类等轻或中度型游戏的开发，
功能还在完善中，后面优化及功能的扩展继续进行中

# 分支说明
## [2.4.3](https://gitee.com/top-discover/QuickFramework/tree/2.4.3)
2.4.3 分支为 creator 版本在>=2.4.3版本以上使用，为2.4.x的对外分支
## [3.3.1](https://gitee.com/top-discover/QuickFramework/tree/3.3.1)
3.3.1 分支为 creator 版本在>=3.3.1版本以上使用，为3.x的对外分支
## 其它分支为开发中的分支，请不要轻易使用

**如果您觉得我们的开源框架对你有所帮助，请扫下方二维码打赏我们一杯咖啡,您的支持是我们最大的动力，同时也欢迎进群讨论**

![输入图片说明](doc/images/zfb.jpg)     ![输入图片说明](doc/images/wx.png)    ![输入图片说明](doc/images/qq.jpg)
