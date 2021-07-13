#coding:utf-8
#! usr/bin/python #coding=utf-8

import pubfunc
import os
import json
import io
import sys
import shutil
import hashlib

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

    #获取文件md5值
    def md5(self,file):
        m = hashlib.md5()
        with open(file,"rb") as f:
            for line in f:
                m.update(line)
        md5code = m.hexdigest()
        return md5code

    #读取目录
    def readDir(self , dir , obj , source ) :
        # print(dir,obj,source)
        if os.path.isdir(dir) == False :
            return
        dirLen = len(self.buildDir)
        assetsObj = {}
        for root,dirs,files in os.walk(dir):
            # print(files)
            for fileName in files:
                srcFilePath = os.path.join(root,fileName)
                pathValue = srcFilePath[dirLen+1:len(srcFilePath)]
                pathValue = pathValue.replace("\\","/")
                # print(srcFilePath)
                md5Value = self.md5(srcFilePath)
                sizeValue = os.path.getsize(srcFilePath)
                singleObj = {
                    pathValue:{
                        "size" : sizeValue,
                        "md5" : md5Value
                    }
                }
                assetsObj.update(singleObj)
        obj.update(assetsObj)

    #写Manifest文件
    def writeManifest(self,filePath,contentObj):
        jsonFile = open(filePath,"w")
        jsonFile.write(json.dumps(contentObj,sort_keys=True))
        jsonFile.close()

    #获取bundle远程地址
    def getBundleManifestUrl(self,packageUrl,bundleDir,fileName):
        return packageUrl + "/" + pubfunc.manifestDirName + "/" + bundleDir + "_" + fileName

    def run(self):
        print(self.toGBK("开始生成Manifest文件..."))
        print(self.toGBK("当前主包版本号 : " + self.version))
        print(self.toGBK("构建目录 : " + self.buildDir ))
        print(self.toGBK("构建目录下的Manifest目录 : " + self.BuildManifestDir))
        print(self.toGBK("热更新地址 : " + self.packageUrl))
        # print(self.toGBK("所有Bundles : "))
        # print(self.bundles)
        manifest = self.manifestFormat(self.version,self.packageUrl)
        manifest["remoteManifestUrl"] = self.getProjectManifestUrl()
        manifest["remoteVersionUrl"] = self.getVersionManifestUrl()
        print(manifest)
        

        print(self.toGBK("删除旧的Manifest目录") + self.BuildManifestDir)
        self.removeDir(self.BuildManifestDir)
        self.mkdir(self.BuildManifestDir)
        mainIncludes = self.getMainBundleIncludes()
        for path in mainIncludes:
            # print("========================" + path + "===========================")
            self.readDir(os.path.join(self.buildDir,path),manifest["assets"],self.buildDir)
        # 生成project.mainfest
        projectManifestPath = os.path.join(self.BuildManifestDir,pubfunc.projectFileName)
        versionManifestPath = os.path.join(self.BuildManifestDir,pubfunc.versionFileName)
        self.writeManifest(projectManifestPath,manifest)
        print(self.toGBK("生成成功") + projectManifestPath)   
        del manifest["assets"]
        del manifest["searchPaths"]
        self.writeManifest(versionManifestPath,manifest)
        print(self.toGBK("生成成功") + versionManifestPath)   

        #生成各bundles版本文件
        for bundle in self.bundles:
            print(self.toGBK("正在生成:") + self.toGBK(bundle["name"]) + self.toGBK("(" + bundle["dir"] + ")"))
            manifest = self.manifestFormat(bundle["version"],self.packageUrl)
            manifest["remoteManifestUrl"] = self.getBundleManifestUrl(self.packageUrl,bundle["dir"],pubfunc.projectFileName)
            manifest["remoteVersionUrl"] = self.getBundleManifestUrl(self.packageUrl,bundle["dir"],pubfunc.versionFileName)
            # print(manifest)
            self.readDir(os.path.join(self.buildDir,"assets/" + bundle["dir"]),manifest["assets"],self.buildDir)
            projectManifestPath = os.path.join(self.BuildManifestDir,bundle["dir"] + "_" + pubfunc.projectFileName)
            versionManifestPath = os.path.join(self.BuildManifestDir,bundle["dir"] + "_" + pubfunc.versionFileName)
            self.writeManifest(projectManifestPath,manifest)
            print(self.toGBK("生成成功") + self.toGBK(projectManifestPath))   
            del manifest["assets"]
            del manifest["searchPaths"]
            self.writeManifest(versionManifestPath,manifest)
            print(self.toGBK("生成成功") + self.toGBK(versionManifestPath))  


if __name__ == "__main__":
    generateVersion = GenerateVersion()
    generateVersion.run()