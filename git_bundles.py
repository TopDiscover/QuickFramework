#coding=utf-8

import os
import sys
import subprocess
reload(sys)
sys.setdefaultencoding("utf-8")


class GitBundles :
    def __init__(self):
        # 远程git bundles仓库地址
        self.gitUrl = "https://gitee.com/top-discover/QuickFrameworkBundles"
        # 保存本地后辍名
        self.suffix = "Bundles"
        # 当前分支
        self.curBranch = None
        # 当前项目路径
        self.curProjectDir = None
        # 当前项目保存目录名
        self.curProjectName = None
        # 当前Bundles 保存目录名
        self.bundlesName = None

    # 执行命令
    def runCommand(self,cmd, isNeedLog = False):
        print("[Command] " + cmd)
        if cmd == None:
            return

        if isNeedLog:
            p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
            p.wait()
            return p.stdout.readlines()
        else:
            subprocess.call(cmd, shell=True)

    # 获取当前branch
    def getCurBranch(self) :
        results = self.runCommand("git branch",True)
        for v in results :
            v = v.replace(" ","")
            v = v.replace("\n","")
            if v.startswith("*") :
                v = v[1:]
                msg = u"找到当前分支为:".encode("gbk") + v
                print(msg)
                self.curBranch = v
                return
        
    # 获取当项目保存的名字
    def getCurProjectDirName(self):
        fullpath = os.getcwd()
        self.curProjectDir = os.path.dirname(fullpath)
        self.curProjectName = os.path.basename(fullpath)
        msg = u"当前项目本地存储名为:".encode("gbk") + self.curProjectName
        print(msg)

    # 拉取分支
    def gitBundlesBranch(self):
        cmd = "git checkout {0}".format(self.curBranch)
        self.runCommand(cmd,True)
        print(u"摘取".encode("gbk") + self.curBranch + u"完成".encode("gbk"))

    # 摘取Bundles
    def gitBundles(self ):
        dirname = self.curProjectDir
        basename = self.curProjectName
        # 检测是否已经存在，如果已经存在，直接摘取更新
        self.bundlesName = basename + self.suffix
        bundlesPath = os.path.join(dirname , self.bundlesName) 
        if os.path.exists(bundlesPath) :
            print(u"已经存在:".encode("gbk") + bundlesPath)
            #项目已经存在，更新项目
            os.chdir("..")
            # 进入Bundles分支目录
            os.chdir("./" + self.bundlesName)
            cmd = "git pull".format(bundlesPath)
            print(cmd)
            self.runCommand(cmd,True)
            self.gitBundlesBranch()
        else :
            print(u"不存在:".encode("gbk") + bundlesPath)
            #返回到上一层目录接口bunldes
            os.chdir("..")
            cmd = "git clone {0}.git {1}".format(self.gitUrl,self.bundlesName)
            print(u"执行克隆摘取Bundles代码:".encode("gbk") + cmd)
            self.runCommand(cmd,True)
            # 进入Bundles分支目录
            os.chdir("./" + self.bundlesName)
            self.gitBundlesBranch()

    def run(self):
        # 获取当前项目的路径信息
        self.getCurProjectDirName()

        # 获取当前项目的分支信息
        self.getCurBranch()

        # 拉取Bundles
        self.gitBundles()

        # 进入Bundle目录，拉取跟项目同样分支的代码
        self.gitBundlesBranch()


gitBundles = GitBundles()
gitBundles.run()
