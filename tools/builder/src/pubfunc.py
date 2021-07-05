#coding:utf-8
#! usr/bin/python #coding=utf-8
import os
import sys
import json

reload(sys)
sys.setdefaultencoding('utf-8')

#当前的目录
curDir = os.path.abspath(os.path.dirname(__file__))
#当前项目的根目录
projectPath = os.path.abspath(os.path.join(curDir,"../../../"))
#当前配置根目录
configDir = os.path.join(projectPath,"packages","config")
# bundles配置文件路径
bundlesConfigPath = os.path.join(configDir,"bundles.json")
#当前构建根目录
buildDefaultOutputDir = os.path.join(projectPath,"build","jsb-default")
#当前打包zip 版本控制文件根目录
packVersionOutputDir = os.path.join(projectPath,"PackageVersion")
#当前服务器版本控制文件zip的根目录
serverOutputDir = os.path.join(packVersionOutputDir,"server")
# version文件名
versionFileName = "version.manifest"
# project文件名
projectFileName = "project.manifest"
# 生成manifest文件的目录名
manifestDirName = "manifest"
# 构建目标manifest 
buildManifestDir = os.path.join(buildDefaultOutputDir,manifestDirName)

def toGBK(str):
    return str.decode('utf-8').encode('gbk')