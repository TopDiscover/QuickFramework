/*
 * @Author: your name
 * @Date: 2020-03-31 16:39:41
 * @LastEditTime: 2020-04-07 15:29:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ddz\packages\fix_engine\main.js
 */
'use strict';
var path = require("fire-path");
var fs = require("fs");

let isMac = false;

function getResourcePath( creatorPath ){
    if (isMac) {
        return `${creatorPath}/Resources`;
    } else {
        return `${creatorPath}/resources`;
    }
}

function _delDir(e) {
    let t = function (e) {
            let i = fs.readdirSync(e);
            for (let s in i) {
                let r = path.join(e, i[s]);
                fs.statSync(r).isDirectory() ? t(r) : fs.unlinkSync(r)
            }
        },
        i = function (t) {
            let s = fs.readdirSync(t);
            if (s.length > 0) {
                for (let e in s) {
                    let r = path.join(t, s[e]);
                    i(r)
                }
                t !== e && fs.rmdirSync(t)
            } else t !== e && fs.rmdirSync(t)
        };
    t(e), i(e)
}

function CopyDirectory(src, dest) {
    if (fs.existsSync(dest) == false) {
        fs.mkdirSync(dest);
    }
    if (fs.existsSync(src) == false) {
        return false;
    }
    // 拷贝新的内容进去
    var dirs = fs.readdirSync(src);
    dirs.forEach(function (item) {
        var item_path = path.join(src, item);
        var temp = fs.statSync(item_path);
        if (temp.isFile()) { // 是文件
            let toPath = path.join(dest, item);
            Editor.log(`copy : ${item_path} to ${toPath} `);
            let readable = fs.createReadStream(item_path); //创建读取流
            let writable = fs.createWriteStream(toPath); //创建写入流
            readable.pipe(writable);
        } else if (temp.isDirectory()) { // 是目录
            CopyDirectory(item_path, path.join(dest, item));
        }
    });
}

function fixEngine(creatorPath) {
    let resourcesPath = getResourcePath(creatorPath);
    resourcesPath = path.normalize(resourcesPath);
    let bin = path.normalize(`${resourcesPath}/engine/bin`);
    if (fs.existsSync(bin) == false) {
        fs.mkdirSync(bin);
    }

    //读取配置文件
    let config = fs.readFileSync(`${Editor.argv.path}/packages/engine/config.json`, "utf-8");

    config = JSON.parse(config);
    let keys = Object.keys(config);
    //Editor.log(keys);
    let isAllExist = true;
    Editor.log(`正在检查修正的引擎文件是否完整`);
    for (let i = 0; i < keys.length; i++) {
        let info = config[keys[i]];
        if( info.name == "delete_dir" ) continue;
        let sourcePath = `${Editor.argv.path}/packages/engine/${info.name}`;
        sourcePath = path.normalize(sourcePath);
        let engineSourcePath = `${resourcesPath}/${info.path}`;
        engineSourcePath = path.normalize(engineSourcePath);
        Editor.log(engineSourcePath);
        if (!fs.existsSync(engineSourcePath) && info.name != "fix_engine_version.json") {
            Editor.error(`不存在 ： ${engineSourcePath}`);
            isAllExist = false;
        }
        if (!fs.existsSync(sourcePath)) {
            Editor.error(`不存在 : ${sourcePath}`);
            isAllExist = false;
        }
    }

    if (isAllExist) {
        Editor.log(`检查完成，文件完整`);
        for (let i = 0; i < keys.length; i++) {
            let info = config[keys[i]];
            if ( info.name == "delete_dir"){
                let engineSourcePath = `${resourcesPath}/${info.path}`;
                engineSourcePath = path.normalize(engineSourcePath);
                if (fs.existsSync(engineSourcePath)) {
                    _delDir(engineSourcePath)
                    fs.rmdirSync(engineSourcePath)
                }
                Editor.log(`${info.desc}${info.path}`);
            }else{
                let sourcePath = `${Editor.argv.path}/packages/engine/${info.name}`;
                sourcePath = path.normalize(sourcePath);
                let source = fs.readFileSync(sourcePath,"utf-8");
                let engineSourcePath = `${resourcesPath}/${info.path}`;
                engineSourcePath = path.normalize(engineSourcePath);
                fs.writeFileSync(engineSourcePath,source,"utf-8");
                Editor.log(info.desc);
            }
        }

        //删除引擎生成的老文件bin，提示重启Creator编译新的引擎代码
        // Editor.log(`删除引擎缓存目录 : ${bin}`);
        // _delDir(bin);
        // Editor.log(`使用新缓存恢复引擎缓存`);
        // CopyDirectory(`${Editor.argv.path}/packages/engine/bin`,bin);
        // Editor.warn(`请检查修复版本文件是否更新:fix_engine_version.json`);
        // Editor.warn(`请手动重启Creator，关闭所有与creator相关的程序，如VSCode webstorm creator`);

    } else {
        Editor.log(`检查完成，文件不完整，无法修正`);
    }
}

module.exports = {
    load() {
        // execute when package loaded
    },

    unload() {
        // execute when package unloaded
    },

    // register your ipc messages here
    messages: {
        'fix_engine'() {

            //自己打包的图集查找，目前项目中加载的图集资源不会释放，查看下目前有多少自己打包的图集
            // Editor.assetdb.queryAssets(`db://assets/**\/*`, ["sprite-atlas"], function (err, results) {
            //     Editor.log(JSON.stringify(results));
            // });
            // return;

            // 读取配置
            let creatorVersion = Editor.versions.CocosCreator;
            //Editor.log(Editor.versions);
            // {
            //     CocosCreator: '2.1.2',
            //     'editor-framework': '0.7.0',
            //     'asset-db': '0.2.3',
            //     cocos2d: '2.1.2'
            // }
            //Editor.log(Editor.App.home);
            if (creatorVersion == "2.3.3") {
                Editor.log("Creator 版本 : " + Editor.versions.CocosCreator);
                Editor.log("Creator cocos2d 版本 : " + Editor.versions.cocos2d);
            }else{
                Editor.error(`该插件只能使用在2.3.3版本的Creator`);
                Editor.log(`请自己手动对比packages/engine目录下对引擎的改动`);
                return;
            }

            //window : D:\CocosCreator\2.1.2\CocosCreator.exe --path
            //mac : Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path
            let editorPath = Editor.argv[`$0`];
            editorPath = editorPath.substr(0, editorPath.length - 7);
            let pos = editorPath.indexOf("MacOS");
            if (pos != -1) {
                isMac = true;
                editorPath = editorPath.substr(0, pos - 1);
            } else {
                editorPath = editorPath.substr(0, editorPath.indexOf("CocosCreator.exe") - 1);
            }
            Editor.log("Creator 安装目录 : " + editorPath);
            Editor.log("当前平台 : " + (isMac ? "Mac" : "Windows"));
            fixEngine(editorPath);
        }
    },
};
