# 自动压缩 PNG 资源

## 介绍

[Cocos Creator 编辑器插件]

**项目构建完成之后自动压缩 PNG 资源。**

- 压缩引擎：[pngquant 2.12.5](https://pngquant.org/)



## 开源

本扩展项目完全开源，仓库地址：[https://gitee.com/ifaswind/ccc-png-auto-compress](https://gitee.com/ifaswind/ccc-png-auto-compress)

如果你觉得这个项目还不错，请不要忘记点 [![star](https://gitee.com/ifaswind/ccc-png-auto-compress/badge/star.svg?theme=dark)](https://gitee.com/ifaswind/ccc-png-auto-compress/stargazers)！

*如有使用上的问题，可以在 Gitee 仓库中提 Issue 或者添加我的微信 `im_chenpipi` 并留言。*



## 截图

![setting-panel](https://gitee.com/ifaswind/image-storage/raw/master/repositories/ccc-png-auto-compress/setting-panel.png)

![screenshot](https://gitee.com/ifaswind/image-storage/raw/master/repositories/ccc-png-auto-compress/screenshot.png)



## 运行环境

平台：Windows、macOS

引擎：Cocos Creator 2.x.x（理论上通用）



## 下载 & 安装

### 扩展商店安装

本扩展已上架扩展商店，点击 Cocos Creator 编辑器顶部菜单栏中的 **[扩展] -> [扩展商店]** 即可打开扩展商店。

在上方搜索栏中输入“**自动压缩 PNG 资源**”并搜索就可以找到本插件，点进去直接安装即可（建议安装到全局）。

![cocos-store](https://gitee.com/ifaswind/image-storage/raw/master/repositories/ccc-png-auto-compress/cocos-store.png)



### 自行下载安装

在[此处](https://gitee.com/ifaswind/ccc-png-auto-compress/releases)或仓库发行版处下载最新的扩展压缩包。

下载完成后将压缩包解压：

- Windows：解压到 `C:\Users\${你的用户名}\.CocosCreator\packages\` 目录下
- macOS：解压到 `~/.CocosCreator/packages/` 目录下

以 Windows 为例，扩展的 `main.js` 文件在我的电脑上的完整目录为 `C:\Users\Shaun\.CocosCreator\packages\ccc-png-auto-compress\main.js`。



## 说明

**该插件默认禁用，需自行启用！**

点击编辑器顶部菜单栏中的 **[扩展] -> [自动压缩 PNG 资源]** 即可打开扩展的配置面板。

配置面板中有以下属性：

- 最低质量
- 最高质量
- 速度
- 需要排除的文件夹
- 需要排除的文件



### 注意

💡 如果 Spine Skeleton 或 DragonBones 的纹理在压缩后出现透明度丢失的情况，可以参考下面两种解决方案（二选一）：

- 自行勾选 Spine Skeleton 或 DragonBones 纹理的 Premultiply Alpha（预乘）属性
- 在配置面板中配置排除 Spine Skeleton 或 DragonBones 的纹理，不进行压缩



---



# 公众号

## 菜鸟小栈

😺我是陈皮皮，一个还在不断学习的游戏开发者，一个热爱分享的 Cocos Star Writer。

🎨这是我的个人公众号，专注但不仅限于游戏开发和前端技术分享。

💖每一篇原创都非常用心，你的关注就是我原创的动力！

> Input and output.

![](https://gitee.com/ifaswind/image-storage/raw/master/weixin/official-account.png)



## 游戏开发交流群

皮皮创建了一个**游戏开发交流群**，供小伙伴们交流开发经验、问题求助等。

感兴趣的小伙伴可以添加我微信 `im_chenpipi` 并留言 `加群`。