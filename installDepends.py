#coding=utf-8

import os
import sys
import subprocess
import re
reload(sys)
sys.setdefaultencoding("utf-8")


class Install :
    def __init__(self):
        # 当前项目路径
        self.curPath = os.getcwd()
        print(u"当前位置:".encode("gbk") + self.curPath)
        # 当前项目路径
        self.projPath = os.getcwd()
        print(u"当前工程位置:".encode("gbk") + self.projPath)
        # 需要安装目录记录
        # self.extensions = ["fix_engine","gulp-compress","hotupdate","png-compress"]
        self.extensions = ["fix_engine","hotupdate","png-compress","test-server"]

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

    def run(self):
        # 进度proj
        os.chdir(self.projPath)

        cmd = "npm install"

        #安装外层依赖库
        print(u"安装项目依赖库".encode("gbk"))
        self.runCommand(cmd,True)

        #安装扩展插件依赖 //["fix_engine","hotupdate","png-compress"]
        for v in self.extensions :
            temp = "extensions/" + v
            fullpath = os.path.join(self.projPath,temp)
            print(u"安装插件依赖库:".encode("gbk") + temp)
            os.chdir(fullpath)
            print(u"当前目录:" + os.getcwd())
            self.runCommand(cmd,True)

        # 安装tsrpc
        fullpath = os.path.join(self.projPath,"tsrpc")
        print(u"安装依赖库:".encode("gbk") + "tsrpc")
        os.chdir(fullpath)
        print(u"当前目录:" + os.getcwd())
        self.runCommand(cmd,True)


impl = Install()
impl.run()
