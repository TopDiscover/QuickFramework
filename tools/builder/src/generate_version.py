#coding:utf-8
#! usr/bin/python #coding=utf-8

import pubfunc
import os
import json
import io
import sys
import shutil

reload(sys)
sys.setdefaultencoding("utf-8")

class GenerateVersion :
    # 读取bundles配置
    def readBundes(self):
        configPath = pubfunc.bundlesConfigPath
        jsonFile = io.open(configPath,encoding="utf-8")
        self.bundlesConfig = json.load(jsonFile)
        jsonFile.close()

    # 对需要的成员进行初始化
    def init(self):
        self.version = self.bundlesConfig["version"]
        self.packageUrl = self.bundlesConfig["packageUrl"]
        self.isIncludeAll = self.bundlesConfig["forceIncludeAllGameToApk"]
        self.bundles = self.bundlesConfig["bundles"]
        self.buildDir = pubfunc.buildDefaultOutputDir
        self.BuildManifestDir = pubfunc.buildManifestDir

    def removeDir(self,dir):
        if ( os.path.exists(dir) ) :
            shutil.rmtree(dir)
    def mkdir(self,dir):
        if ( not os.path.exists(dir) ):
            os.mkdir(dir)

    def __init__(self):
        #bundles 配置
        self.bundlesConfig = {}
        #所有bundles配置
        self.bundles = {}
        #当前主包牌号
        self.version = ""
        #当前主包远程地址
        self.packageUrl = ""
        #是否强制apk包包含所有bundles
        self.isIncludeAll = False
        #构建目录
        self.buildDir = ""
        #构建目录的Manifest目录
        self.BuildManifestDir = ""
        self.readBundes()
        self.init()

    #返回需要添加到主包版本的文件目录
    def getMainBundleIncludes(self):
        return [
            "src",
            "assets/internal",
            "assets/main",
            "assets/resources",
        ]

    def toGBK(self,inputStr):
        return pubfunc.toGBK(inputStr)

    #获取manifest的格式
    def manifestFormat(self,version,packageUrl):
        return {
            "version" : version,
            "packageUrl" : packageUrl,
            "remoteManifestUrl" : "",
            "remoteVersionUrl" : "",
            "assets" : {},
            "searchPaths" : [],
        }

    #获取Manifest路径
    def getVersionManifestUrl(self,bundleName = ""):
        result = ""
        if bundleName == "" :
            result = os.path.join(self.packageUrl,pubfunc.versionFileName)
        else:
            result = os.path.join(self.packageUrl, bundleName + "_" + pubfunc.versionFileName)
        result = result.replace("\\","/")
        return result

    #获取Manifest路径
    def getProjectManifestUrl(self,bundleName = ""):
        result = ""
        if bundleName == "" :
            result = os.path.join(self.packageUrl,pubfunc.projectFileName)
        else:
            result = os.path.join(self.packageUrl, bundleName + "_" + pubfunc.projectFileName)
        result = result.replace("\\","/")
        return result

    def run(self):
        print(self.toGBK("开始生成Manifest文件..."))
        print(self.toGBK("当前主包版本号 : " + self.version))
        print(self.toGBK("构建目录 : " + self.buildDir ))
        print(self.toGBK("构建目录下的Manifest目录 : " + self.BuildManifestDir))
        print(self.toGBK("热更新地址 : " + self.packageUrl))
        # print(self.toGBK("所有Bundles : "))
        # print(self.bundles)
        manifestFormat = self.manifestFormat(self.version,self.packageUrl)
        manifestFormat["remoteManifestUrl"] = self.getProjectManifestUrl()
        manifestFormat["remoteVersionUrl"] = self.getVersionManifestUrl()
        print(manifestFormat)
        

        
        self.removeDir(self.BuildManifestDir)
        self.mkdir(self.BuildManifestDir)



if __name__ == "__main__":
    generateVersion = GenerateVersion()
    generateVersion.run()