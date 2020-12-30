window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Alert: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "78052U/SxxKbaWY5cjj8G5p", "Alert");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Manager_1 = require("../manager/Manager");
    var EventApi_1 = require("../../framework/event/EventApi");
    var Config_1 = require("../config/Config");
    var Defines_1 = require("../../framework/base/Defines");
    var LanguageImpl_1 = require("../language/LanguageImpl");
    var AlertDialog = function(_super) {
      __extends(AlertDialog, _super);
      function AlertDialog() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._closeBtn = null;
        _this._content = null;
        _this._textContent = null;
        _this._richTextContent = null;
        _this._title = null;
        _this._confirm = null;
        _this._cancel = null;
        _this._config = null;
        return _this;
      }
      Object.defineProperty(AlertDialog.prototype, "config", {
        get: function() {
          return this._config;
        },
        enumerable: false,
        configurable: true
      });
      AlertDialog.prototype.onLoad = function() {
        this._content = cc.find("content", this.node);
        this._closeBtn = cc.find("close", this._content);
        this._title = cc.find("title", this._content).getComponent(cc.Label);
        this._textContent = cc.find("content", this._content).getComponent(cc.Label);
        this._richTextContent = cc.find("richContent", this._content).getComponent(cc.RichText);
        this._confirm = cc.find("confirm", this._content);
        this._cancel = cc.find("cancel", this._content);
      };
      AlertDialog.prototype.show = function(config) {
        config.title || (config.title = LanguageImpl_1.i18n.alert_title);
        config.confirmString || (config.confirmString = LanguageImpl_1.i18n.alert_confirm);
        config.cancelString || (config.cancelString = LanguageImpl_1.i18n.alert_cancel);
        this._config = config;
        this.writeContent(config);
        this.showButton(config);
        this._show();
      };
      AlertDialog.prototype._show = function() {
        this._content && cc.tween(this._content).set({
          scale: .2
        }).to(.2, {
          scale: 1.1
        }).delay(.05).to(.1, {
          scale: 1
        }).start();
      };
      AlertDialog.prototype.writeContent = function(config) {
        if (config.richText) {
          this._textContent.node.active = false;
          this._richTextContent.node.active = true;
          this._richTextContent.string = config.richText;
        } else {
          this._textContent.node.active = true;
          this._richTextContent.node.active = false;
          if (config.text) this._textContent.string = config.text; else {
            cc.error("\u8bf7\u6307\u5b9a\u63d0\u793a\u5185\u5bb9");
            this._textContent.string = "";
          }
        }
        config.title && (this._title.string = config.title);
        if (config.confirmString) {
          var title = cc.find("Background/Label", this._confirm);
          title && (title.getComponent(cc.Label).string = config.confirmString);
        }
        if (config.cancelString) {
          var title = cc.find("Background/Label", this._cancel);
          title && (title.getComponent(cc.Label).string = config.cancelString);
        }
      };
      AlertDialog.prototype.showButton = function(config) {
        if (this._confirm && this._cancel && this._closeBtn) {
          this._closeBtn.on(cc.Node.EventType.TOUCH_END, this.close.bind(this));
          if (config.confirmCb) {
            this._confirm.active = true;
            this._confirm.on(cc.Node.EventType.TOUCH_END, this.onClick.bind(this, config.confirmCb, true));
            this._closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClick.bind(this, config.confirmCb, false));
          } else this._confirm.active = false;
          if (config.cancelCb) {
            this._cancel.active = true;
            this._cancel.on(cc.Node.EventType.TOUCH_END, this.onClick.bind(this, config.cancelCb, false));
          } else this._cancel.active = false;
          this._confirm.active ? this._cancel.active || (this._confirm.x = 0) : this._cancel.active ? this._cancel.x = 0 : cc.warn("\u63d0\u793a\u6846\u65e0\u6309\u94ae\u663e\u793a");
        }
      };
      AlertDialog.prototype.close = function() {
        this._close(null);
      };
      AlertDialog.prototype._close = function(complete) {
        if (cc.isValid(this._content)) {
          this._content.stopAllActions();
          cc.tween(this._content).to(.2, {
            scale: 1.15
          }).to(.1, {
            scale: .3
          }).call(function() {
            Manager_1.Manager.alert.finishAlert();
            complete && complete();
          }).start();
        }
      };
      AlertDialog.prototype.onClick = function(cb, isOk) {
        if (this._config.immediatelyCallback) {
          cb && cb(isOk);
          this._close(null);
        } else this._close(function() {
          cb && cb(isOk);
        });
      };
      return AlertDialog;
    }(cc.Component);
    var Alert = function() {
      function Alert() {
        this.curPanel = null;
        this.queue = [];
        this.prefab = null;
        this._isLoadingPrefab = false;
        this.finishLoadCb = null;
        Manager_1.Manager.eventDispatcher.addEventListener(EventApi_1.EventApi.AdaptScreenEvent, this.onAdaptScreen, this);
      }
      Alert.Instance = function() {
        return this._instance || (this._instance = new Alert());
      };
      Alert.prototype.preLoadPrefab = function() {
        this.loadPrefab();
      };
      Alert.prototype.onAdaptScreen = function() {
        Manager_1.Manager.resolutionHelper.fullScreenAdapt(this.curPanel);
      };
      Alert.prototype.getConfig = function(config) {
        var result = {};
        config.tag && (result.tag = config.tag);
        config.text && (result.text = config.text);
        config.title && (result.title = config.title);
        config.confirmString && (result.confirmString = config.confirmString);
        config.cancelString && (result.cancelString = config.cancelString);
        config.richText && (result.richText = config.richText);
        config.immediatelyCallback && (result.immediatelyCallback = config.immediatelyCallback);
        config.isRepeat && (result.isRepeat = config.isRepeat);
        return result;
      };
      Alert.prototype.show = function(config) {
        if (config.tag && false === config.isRepeat && this.isRepeat(config.tag)) {
          cc.warn("\u5f39\u51fa\u6846\u5df2\u7ecf\u5b58\u5728 config : " + JSON.stringify(this.getConfig(config)));
          return false;
        }
        this.queue.push(config);
        this._show(config);
        return true;
      };
      Alert.prototype.isCurrentShow = function(tag) {
        if (this.curPanel) {
          var current = this.curPanel.getComponent(AlertDialog).config;
          if (current.tag == tag) return true;
        }
        return false;
      };
      Alert.prototype.currentShow = function(tag) {
        if (this.curPanel) {
          var current = this.curPanel.getComponent(AlertDialog).config;
          if (!tag) return current;
          if (current.tag == tag) return current;
        }
        return null;
      };
      Alert.prototype.isRepeat = function(tag) {
        if (this.curPanel) {
          var current = this.curPanel.getComponent(AlertDialog).config;
          if (current.tag == tag) {
            cc.warn("\u91cd\u590d\u7684\u5f39\u51fa\u6846 config ; " + JSON.stringify(this.getConfig(current)));
            return true;
          }
        } else for (var i = 0; i < this.queue.length; i++) {
          var data = this.queue[i];
          if (data.tag == tag) {
            cc.warn("\u91cd\u590d\u7684\u5f39\u51fa\u6846 config ; " + JSON.stringify(this.getConfig(data)));
            return true;
          }
        }
        return false;
      };
      Alert.prototype.close = function(tag) {
        if (tag) {
          var j = this.queue.length;
          while (j--) this.queue[j].tag == tag && this.queue.splice(j, 1);
          if (this.curPanel) {
            var current = this.curPanel.getComponent(AlertDialog).config;
            current.tag == tag && this.finishAlert();
          }
        } else this.finishAlert();
      };
      Alert.prototype.closeAll = function() {
        this.queue = [];
        this.finishAlert();
      };
      Alert.prototype.finishAlert = function() {
        if (this.curPanel) {
          this.curPanel.removeFromParent();
          this.curPanel = null;
        }
        var config = this.queue.shift();
        if (0 != this.queue.length) {
          this._show(this.queue[0]);
          return this.queue[0];
        }
        return config;
      };
      Alert.prototype._show = function(config) {
        return __awaiter(this, void 0, void 0, function() {
          var finish, dialog, canvas;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.loadPrefab() ];

             case 1:
              finish = _a.sent();
              if (finish && !this.curPanel) {
                this.curPanel = cc.instantiate(this.prefab);
                Manager_1.Manager.resolutionHelper.fullScreenAdapt(this.curPanel);
                dialog = this.curPanel.addComponent(AlertDialog);
                canvas = Manager_1.Manager.uiManager.getCanvas();
                if (canvas) {
                  this.curPanel.parent = canvas;
                  this.curPanel.zIndex = Config_1.ViewZOrder.Alert;
                  dialog.show(config);
                }
              }
              return [ 2 ];
            }
          });
        });
      };
      Alert.prototype.loadPrefab = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve, reject) {
              if (_this._isLoadingPrefab) {
                _this.finishLoadCb = resolve;
                return;
              }
              if (_this.prefab) {
                if (_this.finishLoadCb) {
                  _this.finishLoadCb(true);
                  _this.finishLoadCb = null;
                }
                resolve(true);
              } else {
                _this._isLoadingPrefab = true;
                Manager_1.Manager.assetManager.load(Defines_1.BUNDLE_RESOURCES, Config_1.Config.CommonPrefabs.alert, cc.Prefab, function(finish, total, item) {}, function(data) {
                  _this._isLoadingPrefab = false;
                  if (data && data.data && data.data instanceof cc.Prefab) {
                    _this.prefab = data.data;
                    Manager_1.Manager.assetManager.addPersistAsset(Config_1.Config.CommonPrefabs.alert, data.data, Defines_1.BUNDLE_RESOURCES);
                    if (_this.finishLoadCb) {
                      _this.finishLoadCb(true);
                      _this.finishLoadCb = null;
                    }
                    resolve(true);
                  } else {
                    if (_this.finishLoadCb) {
                      _this.finishLoadCb(false);
                      _this.finishLoadCb = null;
                    }
                    resolve(false);
                  }
                });
              }
            }) ];
          });
        });
      };
      Alert._instance = null;
      return Alert;
    }();
    exports.default = Alert;
    cc._RF.pop();
  }, {
    "../../framework/base/Defines": "Defines",
    "../../framework/event/EventApi": "EventApi",
    "../config/Config": "Config",
    "../language/LanguageImpl": "LanguageImpl",
    "../manager/Manager": "Manager"
  } ],
  Application: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8b46bGdLJ5CLrG33SnmY+DP", "Application");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Manager_1 = require("./common/manager/Manager");
    Manager_1.Manager.init();
    cc._RF.pop();
  }, {
    "./common/manager/Manager": "Manager"
  } ],
  AssetManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4fc1D2m55E+a6Fji/1Ky71", "AssetManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.AssetManager = void 0;
    var Defines_1 = require("../base/Defines");
    var Framework_1 = require("../Framework");
    var RemoteLoader = function() {
      function RemoteLoader() {
        this._logTag = "[RemoteLoader] ";
      }
      RemoteLoader.Instance = function() {
        return this._instance || (this._instance = new RemoteLoader());
      };
      RemoteLoader.prototype.loadImage = function(url, isNeedCache) {
        var _this = this;
        var me = this;
        return new Promise(function(resolve) {
          if (null == url || void 0 == url || url.length <= 0) {
            resolve(null);
            return;
          }
          var spCache = Framework_1.Manager.cacheManager.remoteCaches.getSpriteFrame(url);
          if (spCache && spCache.data) {
            true;
            cc.log(_this._logTag, "\u4ece\u7f13\u5b58\u7cbe\u7075\u5e27\u4e2d\u83b7\u53d6:" + url);
            resolve(spCache.data);
            return;
          }
          me._loadRemoteRes(url, cc.Texture2D, isNeedCache).then(function(data) {
            var cache = Framework_1.Manager.cacheManager.remoteCaches.get(url);
            if (data && cache) {
              true;
              cc.log(_this._logTag + "\u52a0\u8f7d\u56fe\u7247\u5b8c\u6210" + url);
              cache.data = data;
              cache.data.name = url;
              var spriteFrame = Framework_1.Manager.cacheManager.remoteCaches.setSpriteFrame(url, cache.data);
              resolve(spriteFrame);
            } else {
              true;
              cc.warn(_this._logTag + "\u52a0\u8f7d\u56fe\u7247\u9519\u8bef" + url);
              resolve(null);
            }
          });
        });
      };
      RemoteLoader.prototype.loadSkeleton = function(path, name, isNeedCache) {
        var me = this;
        return new Promise(function(resolve) {
          if (path && name) {
            var url_1 = path + "/" + name;
            var spineAtlas_1 = path + "/" + name + ".atlas";
            var spinePng = path + "/" + name + ".png";
            var spineJson_1 = path + "/" + name + ".json";
            var cache_1 = Framework_1.Manager.cacheManager.remoteCaches.get(url_1);
            if (cache_1) cache_1.isLoaded ? resolve(cache_1.data) : cache_1.finishCb.push(resolve); else {
              cache_1 = new Defines_1.ResourceCacheData();
              cache_1.info.resourceType = Defines_1.ResourceType.Remote;
              cache_1.info.type = sp.SkeletonData;
              cache_1.info.bundle = Defines_1.BUNDLE_REMOTE;
              Framework_1.Manager.cacheManager.remoteCaches.set(url_1, cache_1);
              me._loadRemoteRes(spinePng, cc.Texture2D, isNeedCache).then(function(texture) {
                if (texture) me._loadRemoteRes(spineJson_1, cc.JsonAsset, isNeedCache).then(function(json) {
                  if (json) me._loadRemoteRes(spineAtlas_1, cc.JsonAsset, isNeedCache).then(function(atlas) {
                    if (atlas) {
                      var asset = new sp.SkeletonData();
                      asset.skeletonJson = json.json;
                      asset.atlasText = atlas.text;
                      asset.textures = [ texture ];
                      var pngName = name + ".png";
                      asset["textureNames"] = [ pngName ];
                      cache_1.info.url = url_1;
                      asset.name = url_1;
                      cache_1.data = asset;
                      cache_1.isLoaded = true;
                      resolve(cache_1.data);
                      cache_1.doFinish(cache_1.data);
                    } else {
                      resolve(null);
                      cache_1.doFinish(null);
                      Framework_1.Manager.cacheManager.remoteCaches.remove(url_1);
                    }
                  }); else {
                    resolve(null);
                    cache_1.doFinish(null);
                    Framework_1.Manager.cacheManager.remoteCaches.remove(url_1);
                  }
                }); else {
                  resolve(null);
                  cache_1.doFinish(null);
                  Framework_1.Manager.cacheManager.remoteCaches.remove(url_1);
                }
              });
            }
          } else resolve(null);
        });
      };
      RemoteLoader.prototype._loadRemoteRes = function(url, type, isNeedCache) {
        var _this = this;
        return new Promise(function(resolve) {
          var cache = Framework_1.Manager.cacheManager.remoteCaches.get(url);
          if (cache) cache.isLoaded ? resolve(cache.data) : cache.finishCb.push(resolve); else {
            cache = new Defines_1.ResourceCacheData();
            cache.info.resourceType = Defines_1.ResourceType.Remote;
            cache.info.type = type;
            Framework_1.Manager.cacheManager.remoteCaches.set(url, cache);
            cc.assetManager.loadRemote(url, function(error, data) {
              cache.isLoaded = true;
              if (data) {
                cache.data = data;
                cache.data.addRef();
                true;
                cc.log(_this._logTag + "\u52a0\u8f7d\u8fdc\u7a0b\u8d44\u6e90\u5b8c\u6210:" + url);
              } else {
                true;
                cc.warn(_this._logTag + "\u52a0\u8f7d\u672c\u5730\u8d44\u6e90\u5f02\u5e38:" + url);
              }
              cache.doFinish(data);
              resolve(cache.data);
            });
          }
        });
      };
      RemoteLoader.prototype.update = function() {};
      RemoteLoader._instance = null;
      return RemoteLoader;
    }();
    var AssetManager = function() {
      function AssetManager() {
        this.logTag = "[AssetManager]: ";
        this._remote = new RemoteLoader();
      }
      AssetManager.Instance = function() {
        return this._instance || (this._instance = new AssetManager());
      };
      Object.defineProperty(AssetManager.prototype, "remote", {
        get: function() {
          return this._remote;
        },
        enumerable: false,
        configurable: true
      });
      AssetManager.prototype.getBundle = function(bundle) {
        if (bundle) {
          if ("string" == typeof bundle) return cc.assetManager.getBundle(bundle);
          return bundle;
        }
        return null;
      };
      AssetManager.prototype.loadBundle = function(nameOrUrl, onComplete) {
        cc.assetManager.loadBundle(nameOrUrl, onComplete);
      };
      AssetManager.prototype.removeBundle = function(bundle) {
        var result = this.getBundle(bundle);
        if (result) {
          Framework_1.Manager.cacheManager.removeBundle(bundle);
          result.releaseAll();
          cc.assetManager.removeBundle(result);
        }
      };
      AssetManager.prototype.load = function(bundle, path, type, onProgress, onComplete) {
        true;
        cc.log("load bundle : " + bundle + " path : " + path);
        var cache = Framework_1.Manager.cacheManager.get(bundle, path);
        if (cache) {
          if (cache.isLoaded) {
            (true, cache.status == Defines_1.ResourceCacheStatus.WAITTING_FOR_RELEASE) && cc.warn(this.logTag, "\u8d44\u6e90:" + path + " \u7b49\u5f85\u91ca\u653e\uff0c\u4f46\u8d44\u6e90\u5df2\u7ecf\u52a0\u8f7d\u5b8c\u6210\uff0c\u6b64\u65f6\u6709\u4eba\u53c8\u91cd\u65b0\u52a0\u8f7d\uff0c\u4e0d\u8fdb\u884c\u91ca\u653e\u5904\u7406");
            onComplete(cache);
          } else {
            (true, cache.status == Defines_1.ResourceCacheStatus.WAITTING_FOR_RELEASE) && cc.warn(this.logTag, "\u8d44\u6e90:" + path + "\u7b49\u5f85\u91ca\u653e\uff0c\u4f46\u8d44\u6e90\u5904\u7406\u52a0\u8f7d\u8fc7\u7a0b\u4e2d\uff0c\u6b64\u65f6\u6709\u4eba\u53c8\u91cd\u65b0\u52a0\u8f7d\uff0c\u4e0d\u8fdb\u884c\u91ca\u653e\u5904\u7406");
            cache.finishCb.push(onComplete);
          }
          cache.status = Defines_1.ResourceCacheStatus.NONE;
        } else {
          cache = new Defines_1.ResourceCacheData();
          cache.info.url = path;
          cache.info.type = type;
          cache.info.bundle = bundle;
          Framework_1.Manager.cacheManager.set(bundle, path, cache);
          cc.time("\u52a0\u8f7d\u8d44\u6e90 : " + cache.info.url);
          var _bundle = this.getBundle(bundle);
          if (!_bundle) {
            var error = new Error(this.logTag + " " + bundle + " \u6ca1\u6709\u52a0\u8f7d\uff0c\u8bf7\u5148\u52a0\u8f7d");
            this._onLoadComplete(cache, onComplete, error, null);
            return;
          }
          var res = _bundle.get(path, type);
          res ? this._onLoadComplete(cache, onComplete, null, res) : onProgress ? _bundle.load(path, type, onProgress, this._onLoadComplete.bind(this, cache, onComplete)) : _bundle.load(path, type, this._onLoadComplete.bind(this, cache, onComplete));
        }
      };
      AssetManager.prototype._onLoadComplete = function(cache, completeCallback, err, data) {
        cache.isLoaded = true;
        var tempCache = cache;
        if (err) {
          cc.error(this.logTag + "\u52a0\u8f7d\u8d44\u6e90\u5931\u8d25:" + cache.info.url + " \u539f\u56e0:" + (err.message ? err.message : "\u672a\u77e5"));
          cache.data = null;
          tempCache.data = null;
          Framework_1.Manager.cacheManager.remove(cache.info.bundle, cache.info.url);
          completeCallback(cache);
        } else {
          true;
          cc.log(this.logTag + "\u52a0\u8f7d\u8d44\u6e90\u6210\u529f:" + cache.info.url);
          cache.data = data;
          tempCache.data = data;
          completeCallback(cache);
        }
        cache.doFinish(tempCache);
        cache.doGet(tempCache.data);
        if (cache.status == Defines_1.ResourceCacheStatus.WAITTING_FOR_RELEASE) {
          true;
          cc.warn(this.logTag, "\u8d44\u6e90:" + cache.info.url + "\u52a0\u8f7d\u5b8c\u6210\uff0c\u4f46\u7f13\u5b58\u72b6\u6001\u4e3a\u7b49\u5f85\u9500\u6bc1\uff0c\u9500\u6bc1\u8d44\u6e90");
          if (cache.data) {
            cache.status = Defines_1.ResourceCacheStatus.NONE;
            var info = new Defines_1.ResourceInfo();
            info.url = cache.info.url;
            info.type = cache.info.type;
            info.data = cache.data;
            info.bundle = cache.info.bundle;
            this.releaseAsset(info);
          }
        }
        cc.timeEnd("\u52a0\u8f7d\u8d44\u6e90 : " + cache.info.url);
      };
      AssetManager.prototype.releaseAsset = function(info) {
        if (info && info.bundle) {
          var cache = Framework_1.Manager.cacheManager.get(info.bundle, info.url, false);
          if (!cache) return;
          if (cache.isInvalid) {
            true;
            cc.warn("\u8d44\u6e90\u5df2\u7ecf\u91ca\u653e url : " + info.url);
            return;
          }
          if (cache.isLoaded) {
            if (cache.info.retain) {
              true;
              cc.log("\u5e38\u9a7b\u8d44\u6e90 url : " + cache.info.url);
              return;
            }
            true;
            cc.log("\u91ca\u653e\u8d44\u6e90 : " + info.bundle + "." + info.url);
            if (Framework_1.Manager.cacheManager.removeWithInfo(info)) {
              var bundle = this.getBundle(info.bundle);
              if (bundle) {
                bundle.release(info.url, info.type);
                true;
                cc.log("\u6210\u529f\u91ca\u653e\u8d44\u6e90 : " + info.bundle + "." + info.url);
              } else cc.error(info.bundle + " no found");
            } else {
              true;
              cc.warn("\u8d44\u6e90bundle : " + info.bundle + " url : " + info.url + " \u88ab\u5176\u5b83\u754c\u9762\u5f15\u7528 refCount : " + info.data.refCount);
            }
          } else {
            cache.status = Defines_1.ResourceCacheStatus.WAITTING_FOR_RELEASE;
            true;
            cc.warn(cache.info.url + " \u6b63\u5728\u52a0\u8f7d\uff0c\u7b49\u5f85\u52a0\u8f7d\u5b8c\u6210\u540e\u8fdb\u884c\u91ca\u653e");
          }
        }
      };
      AssetManager.prototype.retainAsset = function(info) {
        if (info) {
          var cache = Framework_1.Manager.cacheManager.get(info.bundle, info.url);
          if (cache) {
            true;
            info.data != cache.data && cc.error("\u9519\u8bef\u7684retainAsset :" + info.url);
            cache.info.retain || (cache.info.retain = info.retain);
            cache.data && cache.data.addRef();
          } else {
            true;
            cc.error("retainAsset cache.data is null");
          }
        } else {
          true;
          cc.error("retainAsset info is null");
        }
      };
      AssetManager.prototype.addPersistAsset = function(url, data, bundle) {
        var info = new Defines_1.ResourceInfo();
        info.url = url;
        info.data = data;
        info.bundle = bundle;
        info.retain = true;
        this.retainAsset(info);
      };
      AssetManager._instance = null;
      return AssetManager;
    }();
    exports.AssetManager = AssetManager;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "../base/Defines": "Defines"
  } ],
  AudioComponent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6451cIgDeNA9o01kVKFNVnI", "AudioComponent");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Defines_1 = require("./Defines");
    var Framework_1 = require("../Framework");
    var EventComponent_1 = require("./EventComponent");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var AudioData = function() {
      function AudioData() {
        this.musicVolume = 1;
        this.effectVolume = 1;
        this.isEffectOn = true;
        this.isMusicOn = true;
        this.curMusicUrl = "";
        this.curEffectId = -1;
        this.curBundle = null;
        this.curLoop = true;
        this.isPlaying = false;
        this._storeMusicKey = "default_save_music";
        this._storeEffectKey = "default_save_effect";
        this._storeMusicVolumeKey = "default_save_music_volume_key";
        this._storeEffectVolumeKey = "default_save_effect_volume_key";
      }
      Object.defineProperty(AudioData, "instance", {
        get: function() {
          if (null == this._instance) {
            this._instance = new AudioData();
            this._instance.init();
          }
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      AudioData.prototype.init = function() {
        this.isMusicOn = Framework_1.Manager.localStorage.getItem(this._storeMusicKey, this.isMusicOn);
        this.isEffectOn = Framework_1.Manager.localStorage.getItem(this._storeEffectKey, this.isEffectOn);
        this.musicVolume = Framework_1.Manager.localStorage.getItem(this._storeMusicVolumeKey, this.musicVolume);
        this.effectVolume = Framework_1.Manager.localStorage.getItem(this._storeEffectVolumeKey, this.effectVolume);
      };
      AudioData.prototype.save = function() {
        try {
          Framework_1.Manager.localStorage.setItem(this._storeMusicKey, this.isMusicOn);
          Framework_1.Manager.localStorage.setItem(this._storeMusicVolumeKey, this.musicVolume);
          Framework_1.Manager.localStorage.setItem(this._storeEffectKey, this.isEffectOn);
          Framework_1.Manager.localStorage.setItem(this._storeEffectVolumeKey, this.effectVolume);
        } catch (error) {}
      };
      AudioData._instance = null;
      return AudioData;
    }();
    var PLAY_MUSIC = "AudioComponent_PLAY_MUSIC";
    var AudioComponent = function(_super) {
      __extends(AudioComponent, _super);
      function AudioComponent() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.audioData = AudioData.instance;
        _this.owner = null;
        _this.curPlayMusicUrl = null;
        return _this;
      }
      AudioComponent.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(PLAY_MUSIC, this.onPlayMusic);
      };
      AudioComponent.prototype.onPlayMusic = function(data) {
        this.curPlayMusicUrl == this.curMusicUrl && !this.isPlaying && this.curMusicUrl && this.curBundle && this.playMusic(this.curMusicUrl, this.curBundle, this.curLoop);
      };
      Object.defineProperty(AudioComponent.prototype, "musicVolume", {
        get: function() {
          return this.audioData.musicVolume;
        },
        set: function(volume) {
          cc.audioEngine.setMusicVolume(volume);
          volume <= 0 && this.stopMusic();
          this.audioData.musicVolume = volume;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(AudioComponent.prototype, "effectVolume", {
        get: function() {
          return this.audioData.effectVolume;
        },
        set: function(volume) {
          cc.audioEngine.setEffectsVolume(volume);
          volume <= 0 && this.stopEffect();
          this.audioData.effectVolume = volume;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(AudioComponent.prototype, "isEffectOn", {
        get: function() {
          return this.audioData.isEffectOn;
        },
        set: function(value) {
          this.audioData.isEffectOn = value;
          this.save();
          value || this.stopEffect();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(AudioComponent.prototype, "isMusicOn", {
        get: function() {
          return this.audioData.isMusicOn;
        },
        set: function(isOn) {
          this.audioData.isMusicOn = isOn;
          this.save();
          if (this.audioData.isMusicOn) {
            if (!this.curMusicUrl) return;
            dispatch(PLAY_MUSIC, this);
          } else this.stopMusic();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(AudioComponent.prototype, "curMusicUrl", {
        get: function() {
          return this.audioData.curMusicUrl;
        },
        set: function(value) {
          this.audioData.curMusicUrl = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(AudioComponent.prototype, "curBundle", {
        get: function() {
          return this.audioData.curBundle;
        },
        set: function(value) {
          this.audioData.curBundle = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(AudioComponent.prototype, "curLoop", {
        get: function() {
          return this.audioData.curLoop;
        },
        set: function(value) {
          this.audioData.curLoop = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(AudioComponent.prototype, "isPlaying", {
        get: function() {
          return this.audioData.isPlaying;
        },
        set: function(value) {
          this.audioData.isPlaying = value;
        },
        enumerable: false,
        configurable: true
      });
      AudioComponent.prototype.save = function() {
        this.audioData.save();
      };
      AudioComponent.prototype.stopEffect = function(effectId) {
        void 0 === effectId && (effectId = null);
        if (null == effectId) {
          if (this.audioData.curEffectId < 0) return;
          cc.audioEngine.stopEffect(this.audioData.curEffectId);
          this.audioData.curEffectId = -1;
        } else cc.audioEngine.stopEffect(effectId);
      };
      AudioComponent.prototype.stopAllEffects = function() {
        cc.audioEngine.stopAllEffects();
      };
      AudioComponent.prototype.stopMusic = function() {
        cc.audioEngine.stopMusic();
        this.isPlaying = false;
      };
      AudioComponent.prototype.playMusic = function(url, bundle, loop) {
        var _this = this;
        void 0 === loop && (loop = true);
        return new Promise(function(resolve) {
          true;
          if (!_this.owner) {
            cc.error("\u5fc5\u987b\u8981\u6307\u5b9a\u8d44\u6e90\u7684\u7ba1\u7406\u90fd\u624d\u80fd\u64ad\u653e");
            resolve({
              url: url,
              isSuccess: false
            });
            return;
          }
          _this.curPlayMusicUrl = url;
          _this.curMusicUrl = url;
          _this.curBundle = bundle;
          _this.curLoop = loop;
          _this.audioData.isMusicOn && Framework_1.Manager.cacheManager.getCacheByAsync(url, cc.AudioClip, bundle).then(function(data) {
            if (data) {
              var info = new Defines_1.ResourceInfo();
              info.url = url;
              info.type = cc.AudioClip;
              info.data = data;
              info.bundle = bundle;
              _this.owner ? Framework_1.Manager.uiManager.addLocal(info, _this.owner.className) : Framework_1.Manager.uiManager.garbage.addLocal(info);
              _this.stopMusic();
              cc.audioEngine.playMusic(data, loop);
              _this.isPlaying = true;
              resolve({
                url: url,
                isSuccess: true
              });
            } else resolve({
              url: url,
              isSuccess: false
            });
          });
        });
      };
      AudioComponent.prototype.playEffect = function(url, bundle, loop) {
        var _this = this;
        void 0 === loop && (loop = false);
        return new Promise(function(resolve) {
          true;
          if (!_this.owner) {
            cc.error("\u5fc5\u987b\u8981\u6307\u5b9a\u8d44\u6e90\u7684\u7ba1\u7406\u90fd\u624d\u80fd\u64ad\u653e");
            resolve(-1);
            return;
          }
          if (_this.audioData.isEffectOn) Framework_1.Manager.cacheManager.getCacheByAsync(url, cc.AudioClip, bundle).then(function(data) {
            if (data) {
              var info = new Defines_1.ResourceInfo();
              info.url = url;
              info.type = cc.AudioClip;
              info.data = data;
              info.bundle = bundle;
              _this.owner ? Framework_1.Manager.uiManager.addLocal(info, _this.owner.className) : Framework_1.Manager.uiManager.garbage.addLocal(info);
              _this.audioData.curEffectId = cc.audioEngine.playEffect(data, loop);
              resolve(_this.audioData.curEffectId);
            } else resolve(_this.audioData.curEffectId);
          }); else {
            _this.audioData.curEffectId = -1;
            resolve(-1);
          }
        });
      };
      AudioComponent.prototype.onEnterBackground = function() {
        cc.audioEngine.pauseMusic();
        cc.audioEngine.pauseAllEffects();
      };
      AudioComponent.prototype.onEnterForgeground = function(inBackgroundTime) {
        cc.audioEngine.resumeMusic();
        cc.audioEngine.resumeAllEffects();
      };
      AudioComponent = __decorate([ ccclass, menu("framework/base/AudioComponent") ], AudioComponent);
      return AudioComponent;
    }(EventComponent_1.default);
    exports.default = AudioComponent;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "./Defines": "Defines",
    "./EventComponent": "EventComponent"
  } ],
  BinaryStreamMessage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9c863pCnu9FrJZvlAK2zhn5", "BinaryStreamMessage");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BinaryStreamMessageHeader = exports.BinaryStreamMessage = exports.BinaryStream = exports.Uint32Value = exports.Uint16Value = exports.Uint8Value = exports.Int32Value = exports.Int16Value = exports.Int8Value = exports.Float64Value = exports.Float32Value = exports.StringArrayValue = exports.StringValue = exports.serialize = void 0;
    var Message_1 = require("./Message");
    var Defines_1 = require("../base/Defines");
    function serialize(key, type, arrTypeOrMapKeyType, mapValueType) {
      return function(target, memberName) {
        if (void 0 === Reflect.getOwnPropertyDescriptor(target, "__serialize__")) {
          var selfSerializeInfo = {};
          if (Reflect.getPrototypeOf(target)["__serialize__"] && void 0 === Reflect.getOwnPropertyDescriptor(target, "__serialize__")) {
            var parentSerializeInfo = Reflect.getPrototypeOf(target)["__serialize__"];
            var serializeKeyList = Object.keys(parentSerializeInfo);
            for (var len = serializeKeyList.length, i = 0; i < len; i++) selfSerializeInfo[serializeKeyList[i]] = parentSerializeInfo[serializeKeyList[i]].slice(0);
          }
          Reflect.defineProperty(target, "__serialize__", {
            value: selfSerializeInfo
          });
        }
        if (target["__serialize__"][key]) throw "SerializeKey has already been declared:" + key;
        target["__serialize__"][key] = [ memberName, type, arrTypeOrMapKeyType, mapValueType ];
      };
    }
    exports.serialize = serialize;
    var StreamValue = function() {
      function StreamValue() {
        this.data = null;
      }
      StreamValue.prototype.read = function(dataView, offset) {
        return 0;
      };
      StreamValue.prototype.write = function(dataView, offset) {
        return 0;
      };
      StreamValue.prototype.size = function() {
        return 0;
      };
      Object.defineProperty(StreamValue.prototype, "littleEndian", {
        get: function() {
          return Defines_1.USING_LITTLE_ENDIAN;
        },
        enumerable: false,
        configurable: true
      });
      return StreamValue;
    }();
    var NumberStreamValue = function(_super) {
      __extends(NumberStreamValue, _super);
      function NumberStreamValue() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.data = 0;
        return _this;
      }
      return NumberStreamValue;
    }(StreamValue);
    var StringStreamValue = function(_super) {
      __extends(StringStreamValue, _super);
      function StringStreamValue() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.data = "";
        return _this;
      }
      return StringStreamValue;
    }(StreamValue);
    var Buffer = require("buffer").Buffer;
    var StringValue = function(_super) {
      __extends(StringValue, _super);
      function StringValue() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      StringValue.prototype.size = function() {
        var byteSize = Uint32Array.BYTES_PER_ELEMENT;
        var buffer = new Buffer(this.data);
        byteSize += buffer.length;
        return byteSize;
      };
      StringValue.prototype.read = function(dataView, offset) {
        var readLen = 0;
        var length = dataView.getUint32(offset, this.littleEndian);
        readLen = Uint32Array.BYTES_PER_ELEMENT;
        offset += readLen;
        var arr = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
          arr[i] = dataView.getUint8(offset);
          offset += Uint8Array.BYTES_PER_ELEMENT;
          readLen += Uint8Array.BYTES_PER_ELEMENT;
        }
        this.data = Message_1.Utf8ArrayToStr(arr);
        return readLen;
      };
      StringValue.prototype.write = function(dataView, offset) {
        var writeLen = 0;
        var buffer = new Buffer(this.data);
        var byteLenght = buffer.length;
        dataView.setUint32(offset, byteLenght, this.littleEndian);
        writeLen += Uint32Array.BYTES_PER_ELEMENT;
        offset += writeLen;
        for (var i = 0; i < buffer.length; i++) {
          dataView.setUint8(offset, buffer[i]);
          offset += Uint8Array.BYTES_PER_ELEMENT;
          writeLen += Uint8Array.BYTES_PER_ELEMENT;
        }
        return writeLen;
      };
      return StringValue;
    }(StringStreamValue);
    exports.StringValue = StringValue;
    var StringArrayValue = function(_super) {
      __extends(StringArrayValue, _super);
      function StringArrayValue() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.dataLength = 0;
        return _this;
      }
      return StringArrayValue;
    }(StringValue);
    exports.StringArrayValue = StringArrayValue;
    var Float32Value = function(_super) {
      __extends(Float32Value, _super);
      function Float32Value() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Float32Value.prototype.size = function() {
        return Float32Array.BYTES_PER_ELEMENT;
      };
      Float32Value.prototype.read = function(dataView, offset) {
        this.data = dataView.getFloat32(offset, this.littleEndian);
        return this.size();
      };
      Float32Value.prototype.write = function(dataView, offset) {
        dataView.setFloat32(offset, this.data, this.littleEndian);
        return this.size();
      };
      return Float32Value;
    }(NumberStreamValue);
    exports.Float32Value = Float32Value;
    var Float64Value = function(_super) {
      __extends(Float64Value, _super);
      function Float64Value() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Float64Value.prototype.size = function() {
        return Float64Array.BYTES_PER_ELEMENT;
      };
      Float64Value.prototype.read = function(dataView, offset) {
        this.data = dataView.getFloat64(offset, this.littleEndian);
        return this.size();
      };
      Float64Value.prototype.write = function(dataView, offset) {
        dataView.setFloat64(offset, this.data, this.littleEndian);
        return this.size();
      };
      return Float64Value;
    }(NumberStreamValue);
    exports.Float64Value = Float64Value;
    var Int8Value = function(_super) {
      __extends(Int8Value, _super);
      function Int8Value() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Int8Value.prototype.size = function() {
        return Int8Array.BYTES_PER_ELEMENT;
      };
      Int8Value.prototype.read = function(dataView, offset) {
        this.data = dataView.getInt8(offset);
        return this.size();
      };
      Int8Value.prototype.write = function(dataView, offset) {
        dataView.setInt8(offset, this.data);
        return this.size();
      };
      return Int8Value;
    }(NumberStreamValue);
    exports.Int8Value = Int8Value;
    var Int16Value = function(_super) {
      __extends(Int16Value, _super);
      function Int16Value() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Int16Value.prototype.size = function() {
        return Int16Array.BYTES_PER_ELEMENT;
      };
      Int16Value.prototype.read = function(dataView, offset) {
        this.data = dataView.getInt16(offset, this.littleEndian);
        return this.size();
      };
      Int16Value.prototype.write = function(dataView, offset) {
        dataView.setInt16(offset, this.data, this.littleEndian);
        return this.size();
      };
      return Int16Value;
    }(NumberStreamValue);
    exports.Int16Value = Int16Value;
    var Int32Value = function(_super) {
      __extends(Int32Value, _super);
      function Int32Value() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Int32Value.prototype.size = function() {
        return Int32Array.BYTES_PER_ELEMENT;
      };
      Int32Value.prototype.read = function(dataView, offset) {
        this.data = dataView.getInt32(offset, this.littleEndian);
        return this.size();
      };
      Int32Value.prototype.write = function(dataView, offset) {
        dataView.setInt32(offset, this.data, this.littleEndian);
        return this.size();
      };
      return Int32Value;
    }(NumberStreamValue);
    exports.Int32Value = Int32Value;
    var Uint8Value = function(_super) {
      __extends(Uint8Value, _super);
      function Uint8Value() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Uint8Value.prototype.size = function() {
        return Uint8Array.BYTES_PER_ELEMENT;
      };
      Uint8Value.prototype.read = function(dataView, offset) {
        this.data = dataView.getUint8(offset);
        return this.size();
      };
      Uint8Value.prototype.write = function(dataView, offset) {
        dataView.setUint8(offset, this.data);
        return this.size();
      };
      return Uint8Value;
    }(NumberStreamValue);
    exports.Uint8Value = Uint8Value;
    var Uint16Value = function(_super) {
      __extends(Uint16Value, _super);
      function Uint16Value() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Uint16Value.prototype.size = function() {
        return Uint16Array.BYTES_PER_ELEMENT;
      };
      Uint16Value.prototype.read = function(dataView, offset) {
        this.data = dataView.getUint16(offset, this.littleEndian);
        return this.size();
      };
      Uint16Value.prototype.write = function(dataView, offset) {
        dataView.setUint16(offset, this.data, this.littleEndian);
        return this.size();
      };
      return Uint16Value;
    }(NumberStreamValue);
    exports.Uint16Value = Uint16Value;
    var Uint32Value = function(_super) {
      __extends(Uint32Value, _super);
      function Uint32Value() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Uint32Value.prototype.size = function() {
        return Uint32Array.BYTES_PER_ELEMENT;
      };
      Uint32Value.prototype.read = function(dataView, offset) {
        this.data = dataView.getUint32(offset, this.littleEndian);
        return this.size();
      };
      Uint32Value.prototype.write = function(dataView, offset) {
        dataView.setUint32(offset, this.data, this.littleEndian);
        return this.size();
      };
      return Uint32Value;
    }(NumberStreamValue);
    exports.Uint32Value = Uint32Value;
    var BinaryStream = function(_super) {
      __extends(BinaryStream, _super);
      function BinaryStream() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._dataView = null;
        _this._byteOffset = 0;
        return _this;
      }
      BinaryStream.prototype.encode = function() {
        var size = this.size();
        var buffer = new ArrayBuffer(size);
        this._dataView = new DataView(buffer);
        this._byteOffset = 0;
        this.serialize();
        this.buffer = new Uint8Array(this._dataView.buffer);
        var success = this._byteOffset == this._dataView.byteLength;
        success || cc.error("encode \u5f53\u524d\u8bfb\u53d6\u5927\u5c0f\u4e3a : " + this._byteOffset + " \u6570\u636e\u5927\u5c0f\u4e3a : " + this._dataView.byteLength);
        return success;
      };
      BinaryStream.prototype.isNumberValue = function(valueType) {
        return valueType == Float32Value || valueType == Float64Value || valueType == Int8Value || valueType == Int16Value || valueType == Int32Value || valueType == Uint8Value || valueType == Uint16Value || valueType == Uint32Value;
      };
      BinaryStream.prototype.isStringValue = function(valueType) {
        return valueType == StringValue || valueType == StringArrayValue;
      };
      BinaryStream.prototype.size = function() {
        var byteSize = 0;
        var __serialize__ = Reflect.getPrototypeOf(this)["__serialize__"];
        if (!__serialize__) return null;
        var serializeKeyList = Object.keys(__serialize__);
        for (var len = serializeKeyList.length, i = 0; i < len; i++) {
          var serializeKey = serializeKeyList[i];
          var _a = __serialize__[serializeKey], memberName = _a[0], type = _a[1], arrTypeOrMapKeyType = _a[2], mapValueType = _a[3];
          var memberSize = this.memberSize(this[memberName], type, arrTypeOrMapKeyType, mapValueType);
          null === memberSize && cc.warn("Invalid serialize member size : " + memberName);
          byteSize += memberSize;
        }
        return byteSize;
      };
      BinaryStream.prototype.memberSize = function(value, valueType, arrTypeOrMapKeyType, mapValueType) {
        if (this.isNumberValue(valueType)) return this.memberNumberSize(value, valueType);
        if (this.isStringValue(valueType)) return this.memberStringSize(value, valueType);
        if (value instanceof Array) return this.memberArraySize(value, valueType, arrTypeOrMapKeyType, mapValueType);
        if (value instanceof Map) return this.memberMapSize(value, valueType, arrTypeOrMapKeyType, mapValueType);
        if (value instanceof BinaryStream) return value.size();
        if (valueType == Number) return this.memberNumberSize(value, Uint32Value);
        if (valueType == String) return this.memberStringSize(value, StringValue);
        cc.warn("Invalid serialize value : " + value);
        return 0;
      };
      BinaryStream.prototype.memberNumberSize = function(value, valueType) {
        var type = new valueType();
        return type.size();
      };
      BinaryStream.prototype.memberStringSize = function(value, valueType) {
        var type = new valueType();
        type.data = value;
        return type.size();
      };
      BinaryStream.prototype.memberArraySize = function(value, valueType, arrTypeOrMapKeyType, mapValueType) {
        var typeSize = Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < value.length; i++) typeSize += this.memberSize(value[i], arrTypeOrMapKeyType, null, null);
        return typeSize;
      };
      BinaryStream.prototype.memberMapSize = function(value, valueType, arrTypeOrMapKeyType, mapValueType) {
        var _this = this;
        var typeSize = Uint32Array.BYTES_PER_ELEMENT;
        value.forEach(function(dataValue, key) {
          typeSize += _this.memberSize(key, arrTypeOrMapKeyType, null, null);
          typeSize += _this.memberSize(dataValue, mapValueType, null, null);
        });
        return typeSize;
      };
      BinaryStream.prototype.serialize = function() {
        var __serialize__ = Reflect.getPrototypeOf(this)["__serialize__"];
        if (!__serialize__) return null;
        var serializeKeyList = Object.keys(__serialize__);
        for (var len = serializeKeyList.length, i = 0; i < len; i++) {
          var serializeKey = serializeKeyList[i];
          var _a = __serialize__[serializeKey], memberName = _a[0], type = _a[1], arrTypeOrMapKeyType = _a[2], mapValueType = _a[3];
          this.serializeMember(this[memberName], memberName, type, arrTypeOrMapKeyType, mapValueType);
        }
      };
      BinaryStream.prototype.serializeMember = function(value, memberName, valueType, arrTypeOrMapKeyType, mapValueType) {
        if (this.isNumberValue(valueType)) this.serializeNumberStreamValue(value, valueType); else if (this.isStringValue(valueType)) this.serializeStringStreamValue(value, valueType, arrTypeOrMapKeyType); else if (value instanceof Array) this.serializeArray(value, memberName, valueType, arrTypeOrMapKeyType, mapValueType); else if (value instanceof Map) this.serializeMap(value, memberName, valueType, arrTypeOrMapKeyType, mapValueType); else if (value instanceof BinaryStream) {
          value._dataView = this._dataView;
          value._byteOffset = this._byteOffset;
          value.serialize();
          this._byteOffset = value._byteOffset;
        } else cc.error("\u5e8f\u5217\u5316\u6210\u5458 : " + memberName + " \u51fa\u9519!!");
      };
      BinaryStream.prototype.serializeNumberStreamValue = function(value, valueType) {
        var type = new valueType();
        type.data = void 0 === value || null === value || value == Number.NaN ? 0 : value;
        this._byteOffset += type.write(this._dataView, this._byteOffset);
      };
      BinaryStream.prototype.serializeStringStreamValue = function(value, valueType, size) {
        var type = new valueType();
        type.data = void 0 === value || null === value ? "" : value;
        this._byteOffset += type.write(this._dataView, this._byteOffset);
      };
      BinaryStream.prototype.serializeArray = function(value, memberName, valueType, arrTypeOrMapKeyType, mapValueType) {
        this._dataView.setUint32(this._byteOffset, value.length, Defines_1.USING_LITTLE_ENDIAN);
        this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < value.length; i++) this.serializeMember(value[i], memberName + "[" + i + "]", arrTypeOrMapKeyType, null, null);
      };
      BinaryStream.prototype.serializeMap = function(value, memberName, valueType, arrTypeOrMapKeyType, mapValueType) {
        var _this = this;
        this._dataView.setUint32(this._byteOffset, value.size, Defines_1.USING_LITTLE_ENDIAN);
        this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
        value.forEach(function(dataValue, dataKey) {
          if (arrTypeOrMapKeyType == String) {
            var keyValue = new StringValue();
            keyValue.data = dataKey;
            _this._byteOffset += keyValue.write(_this._dataView, _this._byteOffset);
          } else {
            _this._dataView.setUint32(_this._byteOffset, dataKey, Defines_1.USING_LITTLE_ENDIAN);
            _this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
          }
          _this.serializeMember(dataValue, memberName + "." + dataKey, mapValueType, null, null);
        });
      };
      BinaryStream.prototype.decode = function(data) {
        this.buffer = data;
        this._dataView = new DataView(data.buffer);
        this._byteOffset = 0;
        this.deserialize();
        var success = this._dataView.byteLength == this._byteOffset;
        success || cc.error("decode \u5f53\u524d\u8bfb\u53d6\u5927\u5c0f\u4e3a : " + this._byteOffset + " \u6570\u636e\u5927\u5c0f\u4e3a : " + this._dataView.byteLength);
        return success;
      };
      BinaryStream.prototype.deserialize = function() {
        var __serializeInfo = Reflect.getPrototypeOf(this)["__serialize__"];
        if (!__serializeInfo) return true;
        var serializeKeyList = Object.keys(__serializeInfo);
        for (var len = serializeKeyList.length, i = 0; i < len; i++) {
          var serializeKey = serializeKeyList[i];
          var _a = __serializeInfo[serializeKey], memberName = _a[0], type = _a[1], arrTypeOrMapKeyType = _a[2], mapValueType = _a[3];
          this.deserializeMember(memberName, type, arrTypeOrMapKeyType, mapValueType);
        }
      };
      BinaryStream.prototype.deserializeMember = function(memberName, memberType, arrTypeOrMapKeyType, mapValueType) {
        try {
          var originValue = this[memberName];
          if (this.isNumberValue(memberType)) this[memberName] = this.deserializeNumberStreamValue(memberName, memberType); else if (this.isStringValue(memberType)) this[memberName] = this.deserializeStringStreamValue(memberName, memberType, arrTypeOrMapKeyType); else if (originValue instanceof Array) this.deserializeArray(memberName, memberType, arrTypeOrMapKeyType, mapValueType); else if (originValue instanceof Map) this.deserializeMap(memberName, memberType, arrTypeOrMapKeyType, mapValueType); else if (originValue instanceof BinaryStream) {
            originValue._dataView = this._dataView;
            originValue._byteOffset = this._byteOffset;
            originValue.deserialize();
            this._byteOffset = originValue._byteOffset;
          } else cc.error("deserializeMember " + memberName + " error!!!");
        } catch (error) {
          cc.warn(error.message);
          cc.error("deserializeMember " + memberName + " error!!!");
        }
      };
      BinaryStream.prototype.deserializeNumberStreamValue = function(memberName, memberType) {
        var value = new memberType();
        this._byteOffset += value.read(this._dataView, this._byteOffset);
        return value.data;
      };
      BinaryStream.prototype.deserializeStringStreamValue = function(memberName, memberType, arrTypeOrMapKeyType) {
        var value = new memberType();
        this._byteOffset += value.read(this._dataView, this._byteOffset);
        return value.data;
      };
      BinaryStream.prototype.deserializeArray = function(memberName, memberType, arrTypeOrMapKeyType, mapValueType) {
        this[memberName] = [];
        var size = this._dataView.getUint32(this._byteOffset, Defines_1.USING_LITTLE_ENDIAN);
        this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < size; i++) {
          var type = new arrTypeOrMapKeyType();
          if (type instanceof BinaryStream) this[memberName][i] = type.deserialize(); else {
            this._byteOffset += type.read(this._dataView, this._byteOffset);
            this[memberName][i] = type.data;
          }
        }
      };
      BinaryStream.prototype.deserializeMap = function(memberName, memberType, arrTypeOrMapKeyType, mapValueType) {
        this[memberName] = new Map();
        var size = this._dataView.getUint32(this._byteOffset, Defines_1.USING_LITTLE_ENDIAN);
        this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
        for (var i = 0; i < size; i++) {
          var key = null;
          if (arrTypeOrMapKeyType == String) {
            var keyValue = new StringValue();
            this._byteOffset += keyValue.read(this._dataView, this._byteOffset);
            key = keyValue.data;
          } else {
            key = this._dataView.getUint32(this._byteOffset, Defines_1.USING_LITTLE_ENDIAN);
            this._byteOffset += Uint32Array.BYTES_PER_ELEMENT;
          }
          var data = new mapValueType();
          if (mapValueType instanceof BinaryStream) data.deserialize(); else {
            this._byteOffset += data.read(this._dataView, this._byteOffset);
            data = data.data;
          }
          this[memberName].set(key, data);
        }
      };
      return BinaryStream;
    }(Message_1.Message);
    exports.BinaryStream = BinaryStream;
    var BinaryStreamMessage = function(_super) {
      __extends(BinaryStreamMessage, _super);
      function BinaryStreamMessage() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      return BinaryStreamMessage;
    }(BinaryStream);
    exports.BinaryStreamMessage = BinaryStreamMessage;
    var BinaryStreamMessageHeader = function(_super) {
      __extends(BinaryStreamMessageHeader, _super);
      function BinaryStreamMessageHeader() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      return BinaryStreamMessageHeader;
    }(Message_1.MessageHeader);
    exports.BinaryStreamMessageHeader = BinaryStreamMessageHeader;
    cc._RF.pop();
  }, {
    "../base/Defines": "Defines",
    "./Message": "Message",
    buffer: 2
  } ],
  BitEncrypt: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "714809p2/BN/rqgBK9MkiIN", "BitEncrypt");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BitEncrypt = void 0;
    var _BitEncrypt = function() {
      function _BitEncrypt() {
        this.logTag = "[BitEncrypt]:";
        this._encryptKey = "EskKbMvzZBILhcTv";
      }
      Object.defineProperty(_BitEncrypt.prototype, "encryptKey", {
        get: function() {
          return this._encryptKey;
        },
        set: function(value) {
          this._encryptKey = value;
        },
        enumerable: false,
        configurable: true
      });
      _BitEncrypt.prototype.decode = function(content, key) {
        return this._code(content, key);
      };
      _BitEncrypt.prototype.encode = function(content, key) {
        return this._code(content, key);
      };
      _BitEncrypt.prototype._code = function(content, key) {
        var result = this._check(content, key);
        if (result.isOK) {
          var contentCharCode = [];
          for (var i = 0; i < content.length; i++) contentCharCode.push(content.charCodeAt(i));
          var index = 0;
          var ch = "";
          var regex = /[\w\d_-`~#!$%^&*(){}=+;:'"<,>,/?|\\\u4e00-\u9fa5]/g;
          for (var i = 0; i < contentCharCode.length; i++) {
            var matchs = content[i].match(regex);
            if (matchs && matchs.length > 0) {
              contentCharCode[i] ^= result.key.charCodeAt(index);
              ch = String.fromCharCode(contentCharCode[i]);
              matchs = ch.match(regex);
              matchs && matchs.length || (contentCharCode[i] ^= result.key.charCodeAt(index));
              index++;
              index >= result.key.length && (index = 0);
            }
          }
          var newContent = "";
          for (var i = 0; i < contentCharCode.length; i++) newContent += String.fromCharCode(contentCharCode[i]);
          return newContent;
        }
        true;
        cc.error(exports.BitEncrypt.logTag, "encode/decode error content : " + content + " key : " + key);
        return content;
      };
      _BitEncrypt.prototype._check = function(content, key) {
        return content && content.length > 0 ? key && key.length > 0 ? {
          isOK: true,
          key: key
        } : this.encryptKey && this.encryptKey.length > 0 ? {
          isOK: true,
          key: this.encryptKey
        } : {
          isOK: false,
          key: key
        } : {
          isOK: false,
          key: key
        };
      };
      return _BitEncrypt;
    }();
    exports.BitEncrypt = new _BitEncrypt();
    cc._RF.pop();
  }, {} ],
  BundleManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0f1756Lr+VDj6Y+gmnLwmYB", "BundleManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BundleManager = void 0;
    var HotUpdate_1 = require("../base/HotUpdate");
    var CommonEvent_1 = require("../event/CommonEvent");
    var LanguageImpl_1 = require("../language/LanguageImpl");
    var Config_1 = require("../config/Config");
    var Manager_1 = require("./Manager");
    var DownloadLoading_1 = require("../component/DownloadLoading");
    var BundleManager = function() {
      function BundleManager() {
        this.curBundle = null;
        this.isLoading = false;
        this.loadedBundle = [];
      }
      BundleManager.Instance = function() {
        return this._instance || (this._instance = new BundleManager());
      };
      BundleManager.prototype.removeLoadedBundle = function() {
        this.loadedBundle.forEach(function(value, index, origin) {
          Manager_1.Manager.assetManager.removeBundle(value);
        });
        this.loadedBundle = [];
      };
      BundleManager.prototype.removeLoadedGamesBundle = function() {
        var i = this.loadedBundle.length;
        while (i--) if (this.loadedBundle[i] != Config_1.Config.BUNDLE_HALL) {
          Manager_1.Manager.assetManager.removeBundle(this.loadedBundle[i]);
          this.loadedBundle.splice(i, 1);
        }
      };
      BundleManager.prototype.enterBundle = function(config) {
        if (this.isLoading) {
          Manager_1.Manager.tips.show(LanguageImpl_1.i18n.updating);
          cc.log("\u6b63\u5728\u66f4\u65b0\u6e38\u620f\uff0c\u8bf7\u7a0d\u7b49");
          return;
        }
        this.curBundle = config;
        this.isLoading = true;
        HotUpdate_1.HotUpdate.bundlesConfig[this.curBundle.bundle] || (HotUpdate_1.HotUpdate.bundlesConfig[this.curBundle.bundle] = config);
        var versionInfo = HotUpdate_1.HotUpdate.bundlesConfig[this.curBundle.bundle];
        this.checkUpdate(versionInfo);
      };
      BundleManager.prototype.onGameReady = function() {
        this.isLoading && (this.isLoading = false);
        dispatch(this.curBundle.event, this.curBundle.bundle);
      };
      BundleManager.prototype.checkUpdate = function(versionInfo) {
        var _this = this;
        var self = this;
        cc.log("\u68c0\u6d4b\u66f4\u65b0\u4fe1\u606f:" + versionInfo.name + "(" + versionInfo.bundle + ")");
        Manager_1.Manager.eventDispatcher.removeEventListener(CommonEvent_1.CommonEvent.HOTUPDATE_DOWNLOAD, this);
        HotUpdate_1.HotUpdate.checkGameUpdate(this.curBundle.bundle, function(code, state) {
          if (code == HotUpdate_1.AssetManagerCode.NEW_VERSION_FOUND) {
            Manager_1.Manager.eventDispatcher.addEventListener(CommonEvent_1.CommonEvent.HOTUPDATE_DOWNLOAD, _this.onDownload, _this);
            cc.log("\u68c0\u6d4b\u5230" + versionInfo.name + "(" + versionInfo.bundle + ")\u6709\u65b0\u7684\u7248\u672c");
            versionInfo.isNeedPrompt ? Manager_1.Manager.alert.show({
              text: String.format(LanguageImpl_1.i18n.newVersionForBundle, versionInfo.name),
              confirmCb: function(isOK) {
                isOK ? Manager_1.Manager.uiManager.open({
                  type: DownloadLoading_1.default,
                  zIndex: Config_1.ViewZOrder.Loading,
                  args: [ state, versionInfo.name ]
                }) : cc.game.end();
              }
            }) : HotUpdate_1.HotUpdate.hotUpdate();
          } else if (state == HotUpdate_1.AssetManagerState.TRY_DOWNLOAD_FAILED_ASSETS) {
            Manager_1.Manager.eventDispatcher.addEventListener(CommonEvent_1.CommonEvent.HOTUPDATE_DOWNLOAD, _this.onDownload, _this);
            cc.log("\u6b63\u5728\u5c1d\u8bd5\u91cd\u65b0\u4e0b\u8f7d\u4e4b\u524d\u4e0b\u8f7d\u5931\u8d25\u7684\u8d44\u6e90");
            versionInfo.isNeedPrompt ? Manager_1.Manager.alert.show({
              text: String.format(LanguageImpl_1.i18n.newVersionForBundle, versionInfo.name),
              confirmCb: function(isOK) {
                isOK ? Manager_1.Manager.uiManager.open({
                  type: DownloadLoading_1.default,
                  zIndex: Config_1.ViewZOrder.Loading,
                  args: [ state, versionInfo.name ]
                }) : cc.game.end();
              }
            }) : HotUpdate_1.HotUpdate.downloadFailedAssets();
          } else if (code == HotUpdate_1.AssetManagerCode.ALREADY_UP_TO_DATE) self.loadBundle(); else if (code == HotUpdate_1.AssetManagerCode.ERROR_DOWNLOAD_MANIFEST || code == HotUpdate_1.AssetManagerCode.ERROR_NO_LOCAL_MANIFEST || code == HotUpdate_1.AssetManagerCode.ERROR_PARSE_MANIFEST) {
            _this.isLoading = false;
            var content = LanguageImpl_1.i18n.downloadFailManifest;
            code == HotUpdate_1.AssetManagerCode.ERROR_NO_LOCAL_MANIFEST ? content = LanguageImpl_1.i18n.noFindManifest : code == HotUpdate_1.AssetManagerCode.ERROR_PARSE_MANIFEST && (content = LanguageImpl_1.i18n.manifestError);
            Manager_1.Manager.tips.show(content);
          } else if (code == HotUpdate_1.AssetManagerCode.CHECKING) cc.log("\u6b63\u5728\u68c0\u6d4b\u66f4\u65b0!!"); else {
            _this.isLoading = false;
            cc.log("\u68c0\u6d4b\u66f4\u65b0\u5f53\u524d\u72b6\u6001 code : " + code + " state : " + state);
          }
        });
      };
      BundleManager.prototype.loadBundle = function() {
        var _this = this;
        cc.log("updateGame : " + this.curBundle.bundle);
        var me = this;
        var versionInfo = HotUpdate_1.HotUpdate.bundlesConfig[this.curBundle.bundle];
        Manager_1.Manager.assetManager.loadBundle(versionInfo.bundle, function(err, bundle) {
          me.isLoading = false;
          if (err) {
            cc.error("load bundle : " + versionInfo.bundle + " fail !!!");
            Manager_1.Manager.tips.show(String.format(LanguageImpl_1.i18n.updateFaild, versionInfo.name));
          } else {
            cc.log("load bundle : " + versionInfo.bundle + " success !!!");
            _this.loadedBundle.push(versionInfo.bundle);
            me.onGameReady();
          }
        });
      };
      BundleManager.prototype.onDownload = function(info) {
        true;
        cc.log(JSON.stringify(info));
        var newPercent = 0;
        var config = HotUpdate_1.HotUpdate.getBundleName(this.curBundle.bundle);
        if (info.code == HotUpdate_1.AssetManagerCode.UPDATE_PROGRESSION) {
          newPercent = info.percent == Number.NaN ? 0 : info.percent;
          dispatch(CommonEvent_1.CommonEvent.DOWNLOAD_PROGRESS, {
            progress: newPercent,
            config: config
          });
        } else if (info.code == HotUpdate_1.AssetManagerCode.ALREADY_UP_TO_DATE) {
          newPercent = 1;
          dispatch(CommonEvent_1.CommonEvent.DOWNLOAD_PROGRESS, {
            progress: newPercent,
            config: config
          });
        } else if (info.code == HotUpdate_1.AssetManagerCode.UPDATE_FINISHED) {
          newPercent = 1.1;
          cc.log("\u66f4\u65b0" + config.name + "\u6210\u529f");
          cc.log("\u6b63\u5728\u52a0\u8f7d" + config.name);
          this.loadBundle();
          dispatch(CommonEvent_1.CommonEvent.DOWNLOAD_PROGRESS, {
            progress: newPercent,
            config: config
          });
        } else if (info.code == HotUpdate_1.AssetManagerCode.UPDATE_FAILED || info.code == HotUpdate_1.AssetManagerCode.ERROR_NO_LOCAL_MANIFEST || info.code == HotUpdate_1.AssetManagerCode.ERROR_DOWNLOAD_MANIFEST || info.code == HotUpdate_1.AssetManagerCode.ERROR_PARSE_MANIFEST || info.code == HotUpdate_1.AssetManagerCode.ERROR_DECOMPRESS) {
          newPercent = -1;
          this.isLoading = false;
          cc.error("\u66f4\u65b0" + config.name + "\u5931\u8d25");
          dispatch(CommonEvent_1.CommonEvent.DOWNLOAD_PROGRESS, {
            progress: newPercent,
            config: config
          });
        }
      };
      BundleManager._instance = null;
      return BundleManager;
    }();
    exports.BundleManager = BundleManager;
    cc._RF.pop();
  }, {
    "../base/HotUpdate": "HotUpdate",
    "../component/DownloadLoading": "DownloadLoading",
    "../config/Config": "Config",
    "../event/CommonEvent": "CommonEvent",
    "../language/LanguageImpl": "LanguageImpl",
    "./Manager": "Manager"
  } ],
  1: [ function(require, module, exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = "undefined" !== typeof Uint8Array ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len = b64.length;
      if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var validLen = b64.indexOf("=");
      -1 === validLen && (validLen = len);
      var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
      return [ validLen, placeHoldersLen ];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i;
      for (i = 0; i < len; i += 4) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      if (2 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = 255 & tmp;
      }
      if (1 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[63 & num];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (255 & uint8[i + 2]);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
      if (1 === extraBytes) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
      } else if (2 === extraBytes) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
      }
      return parts.join("");
    }
  }, {} ],
  2: [ function(require, module, exports) {
    (function(global) {
      "use strict";
      var base64 = require("base64-js");
      var ieee754 = require("ieee754");
      var isArray = require("isarray");
      exports.Buffer = Buffer;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      Buffer.TYPED_ARRAY_SUPPORT = void 0 !== global.TYPED_ARRAY_SUPPORT ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
      exports.kMaxLength = kMaxLength();
      function typedArraySupport() {
        try {
          var arr = new Uint8Array(1);
          arr.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function() {
              return 42;
            }
          };
          return 42 === arr.foo() && "function" === typeof arr.subarray && 0 === arr.subarray(1, 1).byteLength;
        } catch (e) {
          return false;
        }
      }
      function kMaxLength() {
        return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
      }
      function createBuffer(that, length) {
        if (kMaxLength() < length) throw new RangeError("Invalid typed array length");
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = new Uint8Array(length);
          that.__proto__ = Buffer.prototype;
        } else {
          null === that && (that = new Buffer(length));
          that.length = length;
        }
        return that;
      }
      function Buffer(arg, encodingOrOffset, length) {
        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) return new Buffer(arg, encodingOrOffset, length);
        if ("number" === typeof arg) {
          if ("string" === typeof encodingOrOffset) throw new Error("If encoding is specified then the first argument must be a string");
          return allocUnsafe(this, arg);
        }
        return from(this, arg, encodingOrOffset, length);
      }
      Buffer.poolSize = 8192;
      Buffer._augment = function(arr) {
        arr.__proto__ = Buffer.prototype;
        return arr;
      };
      function from(that, value, encodingOrOffset, length) {
        if ("number" === typeof value) throw new TypeError('"value" argument must not be a number');
        if ("undefined" !== typeof ArrayBuffer && value instanceof ArrayBuffer) return fromArrayBuffer(that, value, encodingOrOffset, length);
        if ("string" === typeof value) return fromString(that, value, encodingOrOffset);
        return fromObject(that, value);
      }
      Buffer.from = function(value, encodingOrOffset, length) {
        return from(null, value, encodingOrOffset, length);
      };
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype;
        Buffer.__proto__ = Uint8Array;
        "undefined" !== typeof Symbol && Symbol.species && Buffer[Symbol.species] === Buffer && Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true
        });
      }
      function assertSize(size) {
        if ("number" !== typeof size) throw new TypeError('"size" argument must be a number');
        if (size < 0) throw new RangeError('"size" argument must not be negative');
      }
      function alloc(that, size, fill, encoding) {
        assertSize(size);
        if (size <= 0) return createBuffer(that, size);
        if (void 0 !== fill) return "string" === typeof encoding ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
        return createBuffer(that, size);
      }
      Buffer.alloc = function(size, fill, encoding) {
        return alloc(null, size, fill, encoding);
      };
      function allocUnsafe(that, size) {
        assertSize(size);
        that = createBuffer(that, size < 0 ? 0 : 0 | checked(size));
        if (!Buffer.TYPED_ARRAY_SUPPORT) for (var i = 0; i < size; ++i) that[i] = 0;
        return that;
      }
      Buffer.allocUnsafe = function(size) {
        return allocUnsafe(null, size);
      };
      Buffer.allocUnsafeSlow = function(size) {
        return allocUnsafe(null, size);
      };
      function fromString(that, string, encoding) {
        "string" === typeof encoding && "" !== encoding || (encoding = "utf8");
        if (!Buffer.isEncoding(encoding)) throw new TypeError('"encoding" must be a valid string encoding');
        var length = 0 | byteLength(string, encoding);
        that = createBuffer(that, length);
        var actual = that.write(string, encoding);
        actual !== length && (that = that.slice(0, actual));
        return that;
      }
      function fromArrayLike(that, array) {
        var length = array.length < 0 ? 0 : 0 | checked(array.length);
        that = createBuffer(that, length);
        for (var i = 0; i < length; i += 1) that[i] = 255 & array[i];
        return that;
      }
      function fromArrayBuffer(that, array, byteOffset, length) {
        array.byteLength;
        if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError("'offset' is out of bounds");
        if (array.byteLength < byteOffset + (length || 0)) throw new RangeError("'length' is out of bounds");
        array = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = array;
          that.__proto__ = Buffer.prototype;
        } else that = fromArrayLike(that, array);
        return that;
      }
      function fromObject(that, obj) {
        if (Buffer.isBuffer(obj)) {
          var len = 0 | checked(obj.length);
          that = createBuffer(that, len);
          if (0 === that.length) return that;
          obj.copy(that, 0, 0, len);
          return that;
        }
        if (obj) {
          if ("undefined" !== typeof ArrayBuffer && obj.buffer instanceof ArrayBuffer || "length" in obj) {
            if ("number" !== typeof obj.length || isnan(obj.length)) return createBuffer(that, 0);
            return fromArrayLike(that, obj);
          }
          if ("Buffer" === obj.type && isArray(obj.data)) return fromArrayLike(that, obj.data);
        }
        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }
      function checked(length) {
        if (length >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
        return 0 | length;
      }
      function SlowBuffer(length) {
        +length != length && (length = 0);
        return Buffer.alloc(+length);
      }
      Buffer.isBuffer = function isBuffer(b) {
        return !!(null != b && b._isBuffer);
      };
      Buffer.compare = function compare(a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError("Arguments must be Buffers");
        if (a === b) return 0;
        var x = a.length;
        var y = b.length;
        for (var i = 0, len = Math.min(x, y); i < len; ++i) if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
         case "hex":
         case "utf8":
         case "utf-8":
         case "ascii":
         case "latin1":
         case "binary":
         case "base64":
         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return true;

         default:
          return false;
        }
      };
      Buffer.concat = function concat(list, length) {
        if (!isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (0 === list.length) return Buffer.alloc(0);
        var i;
        if (void 0 === length) {
          length = 0;
          for (i = 0; i < list.length; ++i) length += list[i].length;
        }
        var buffer = Buffer.allocUnsafe(length);
        var pos = 0;
        for (i = 0; i < list.length; ++i) {
          var buf = list[i];
          if (!Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
          buf.copy(buffer, pos);
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) return string.length;
        if ("undefined" !== typeof ArrayBuffer && "function" === typeof ArrayBuffer.isView && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) return string.byteLength;
        "string" !== typeof string && (string = "" + string);
        var len = string.length;
        if (0 === len) return 0;
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "ascii":
         case "latin1":
         case "binary":
          return len;

         case "utf8":
         case "utf-8":
         case void 0:
          return utf8ToBytes(string).length;

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return 2 * len;

         case "hex":
          return len >>> 1;

         case "base64":
          return base64ToBytes(string).length;

         default:
          if (loweredCase) return utf8ToBytes(string).length;
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        var loweredCase = false;
        (void 0 === start || start < 0) && (start = 0);
        if (start > this.length) return "";
        (void 0 === end || end > this.length) && (end = this.length);
        if (end <= 0) return "";
        end >>>= 0;
        start >>>= 0;
        if (end <= start) return "";
        encoding || (encoding = "utf8");
        while (true) switch (encoding) {
         case "hex":
          return hexSlice(this, start, end);

         case "utf8":
         case "utf-8":
          return utf8Slice(this, start, end);

         case "ascii":
          return asciiSlice(this, start, end);

         case "latin1":
         case "binary":
          return latin1Slice(this, start, end);

         case "base64":
          return base64Slice(this, start, end);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return utf16leSlice(this, start, end);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.prototype._isBuffer = true;
      function swap(b, n, m) {
        var i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer.prototype.swap16 = function swap16() {
        var len = this.length;
        if (len % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (var i = 0; i < len; i += 2) swap(this, i, i + 1);
        return this;
      };
      Buffer.prototype.swap32 = function swap32() {
        var len = this.length;
        if (len % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer.prototype.swap64 = function swap64() {
        var len = this.length;
        if (len % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer.prototype.toString = function toString() {
        var length = 0 | this.length;
        if (0 === length) return "";
        if (0 === arguments.length) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return 0 === Buffer.compare(this, b);
      };
      Buffer.prototype.inspect = function inspect() {
        var str = "";
        var max = exports.INSPECT_MAX_BYTES;
        if (this.length > 0) {
          str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
          this.length > max && (str += " ... ");
        }
        return "<Buffer " + str + ">";
      };
      Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) throw new TypeError("Argument must be a Buffer");
        void 0 === start && (start = 0);
        void 0 === end && (end = target ? target.length : 0);
        void 0 === thisStart && (thisStart = 0);
        void 0 === thisEnd && (thisEnd = this.length);
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
        if (thisStart >= thisEnd && start >= end) return 0;
        if (thisStart >= thisEnd) return -1;
        if (start >= end) return 1;
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        var x = thisEnd - thisStart;
        var y = end - start;
        var len = Math.min(x, y);
        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);
        for (var i = 0; i < len; ++i) if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (0 === buffer.length) return -1;
        if ("string" === typeof byteOffset) {
          encoding = byteOffset;
          byteOffset = 0;
        } else byteOffset > 2147483647 ? byteOffset = 2147483647 : byteOffset < -2147483648 && (byteOffset = -2147483648);
        byteOffset = +byteOffset;
        isNaN(byteOffset) && (byteOffset = dir ? 0 : buffer.length - 1);
        byteOffset < 0 && (byteOffset = buffer.length + byteOffset);
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (!dir) return -1;
          byteOffset = 0;
        }
        "string" === typeof val && (val = Buffer.from(val, encoding));
        if (Buffer.isBuffer(val)) {
          if (0 === val.length) return -1;
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        }
        if ("number" === typeof val) {
          val &= 255;
          if (Buffer.TYPED_ARRAY_SUPPORT && "function" === typeof Uint8Array.prototype.indexOf) return dir ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset) : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;
        if (void 0 !== encoding) {
          encoding = String(encoding).toLowerCase();
          if ("ucs2" === encoding || "ucs-2" === encoding || "utf16le" === encoding || "utf-16le" === encoding) {
            if (arr.length < 2 || val.length < 2) return -1;
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i) {
          return 1 === indexSize ? buf[i] : buf.readUInt16BE(i * indexSize);
        }
        var i;
        if (dir) {
          var foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
            -1 === foundIndex && (foundIndex = i);
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            -1 !== foundIndex && (i -= i - foundIndex);
            foundIndex = -1;
          }
        } else {
          byteOffset + valLength > arrLength && (byteOffset = arrLength - valLength);
          for (i = byteOffset; i >= 0; i--) {
            var found = true;
            for (var j = 0; j < valLength; j++) if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return -1 !== this.indexOf(val, byteOffset, encoding);
      };
      Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;
        if (length) {
          length = Number(length);
          length > remaining && (length = remaining);
        } else length = remaining;
        var strLen = string.length;
        if (strLen % 2 !== 0) throw new TypeError("Invalid hex string");
        length > strLen / 2 && (length = strLen / 2);
        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(2 * i, 2), 16);
          if (isNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function latin1Write(buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer.prototype.write = function write(string, offset, length, encoding) {
        if (void 0 === offset) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (void 0 === length && "string" === typeof offset) {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else {
          if (!isFinite(offset)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
          offset |= 0;
          if (isFinite(length)) {
            length |= 0;
            void 0 === encoding && (encoding = "utf8");
          } else {
            encoding = length;
            length = void 0;
          }
        }
        var remaining = this.length - offset;
        (void 0 === length || length > remaining) && (length = remaining);
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        encoding || (encoding = "utf8");
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "hex":
          return hexWrite(this, string, offset, length);

         case "utf8":
         case "utf-8":
          return utf8Write(this, string, offset, length);

         case "ascii":
          return asciiWrite(this, string, offset, length);

         case "latin1":
         case "binary":
          return latin1Write(this, string, offset, length);

         case "base64":
          return base64Write(this, string, offset, length);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return ucs2Write(this, string, offset, length);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      };
      Buffer.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        return 0 === start && end === buf.length ? base64.fromByteArray(buf) : base64.fromByteArray(buf.slice(start, end));
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];
        var i = start;
        while (i < end) {
          var firstByte = buf[i];
          var codePoint = null;
          var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
             case 1:
              firstByte < 128 && (codePoint = firstByte);
              break;

             case 2:
              secondByte = buf[i + 1];
              if (128 === (192 & secondByte)) {
                tempCodePoint = (31 & firstByte) << 6 | 63 & secondByte;
                tempCodePoint > 127 && (codePoint = tempCodePoint);
              }
              break;

             case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte)) {
                tempCodePoint = (15 & firstByte) << 12 | (63 & secondByte) << 6 | 63 & thirdByte;
                tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343) && (codePoint = tempCodePoint);
              }
              break;

             case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte) && 128 === (192 & fourthByte)) {
                tempCodePoint = (15 & firstByte) << 18 | (63 & secondByte) << 12 | (63 & thirdByte) << 6 | 63 & fourthByte;
                tempCodePoint > 65535 && tempCodePoint < 1114112 && (codePoint = tempCodePoint);
              }
            }
          }
          if (null === codePoint) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | 1023 & codePoint;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        var len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
        var res = "";
        var i = 0;
        while (i < len) res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
        return res;
      }
      function asciiSlice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(127 & buf[i]);
        return ret;
      }
      function latin1Slice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(buf[i]);
        return ret;
      }
      function hexSlice(buf, start, end) {
        var len = buf.length;
        (!start || start < 0) && (start = 0);
        (!end || end < 0 || end > len) && (end = len);
        var out = "";
        for (var i = start; i < end; ++i) out += toHex(buf[i]);
        return out;
      }
      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = "";
        for (var i = 0; i < bytes.length; i += 2) res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
        return res;
      }
      Buffer.prototype.slice = function slice(start, end) {
        var len = this.length;
        start = ~~start;
        end = void 0 === end ? len : ~~end;
        if (start < 0) {
          start += len;
          start < 0 && (start = 0);
        } else start > len && (start = len);
        if (end < 0) {
          end += len;
          end < 0 && (end = 0);
        } else end > len && (end = len);
        end < start && (end = start);
        var newBuf;
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          newBuf = this.subarray(start, end);
          newBuf.__proto__ = Buffer.prototype;
        } else {
          var sliceLen = end - start;
          newBuf = new Buffer(sliceLen, void 0);
          for (var i = 0; i < sliceLen; ++i) newBuf[i] = this[i + start];
        }
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        return val;
      };
      Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset + --byteLength];
        var mul = 1;
        while (byteLength > 0 && (mul *= 256)) val += this[offset + --byteLength] * mul;
        return val;
      };
      Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 16777216 * this[offset + 3];
      };
      Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return 16777216 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var i = byteLength;
        var mul = 1;
        var val = this[offset + --i];
        while (i > 0 && (mul *= 256)) val += this[offset + --i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        if (!(128 & this[offset])) return this[offset];
        return -1 * (255 - this[offset] + 1);
      };
      Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var mul = 1;
        var i = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var i = byteLength - 1;
        var mul = 1;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 255, 0);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        this[offset] = 255 & value;
        return offset + 1;
      };
      function objectWriteUInt16(buf, value, offset, littleEndian) {
        value < 0 && (value = 65535 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> 8 * (littleEndian ? i : 1 - i);
      }
      Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      function objectWriteUInt32(buf, value, offset, littleEndian) {
        value < 0 && (value = 4294967295 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) buf[offset + i] = value >>> 8 * (littleEndian ? i : 3 - i) & 255;
      }
      Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset + 3] = value >>> 24;
          this[offset + 2] = value >>> 16;
          this[offset + 1] = value >>> 8;
          this[offset] = 255 & value;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i - 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = byteLength - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i + 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 127, -128);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        value < 0 && (value = 255 + value + 1);
        this[offset] = 255 & value;
        return offset + 1;
      };
      Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
          this[offset + 2] = value >>> 16;
          this[offset + 3] = value >>> 24;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        value < 0 && (value = 4294967295 + value + 1);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 4, 3.4028234663852886e38, -3.4028234663852886e38);
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 8, 1.7976931348623157e308, -1.7976931348623157e308);
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        start || (start = 0);
        end || 0 === end || (end = this.length);
        targetStart >= target.length && (targetStart = target.length);
        targetStart || (targetStart = 0);
        end > 0 && end < start && (end = start);
        if (end === start) return 0;
        if (0 === target.length || 0 === this.length) return 0;
        if (targetStart < 0) throw new RangeError("targetStart out of bounds");
        if (start < 0 || start >= this.length) throw new RangeError("sourceStart out of bounds");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        end > this.length && (end = this.length);
        target.length - targetStart < end - start && (end = target.length - targetStart + start);
        var len = end - start;
        var i;
        if (this === target && start < targetStart && targetStart < end) for (i = len - 1; i >= 0; --i) target[i + targetStart] = this[i + start]; else if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) for (i = 0; i < len; ++i) target[i + targetStart] = this[i + start]; else Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
        return len;
      };
      Buffer.prototype.fill = function fill(val, start, end, encoding) {
        if ("string" === typeof val) {
          if ("string" === typeof start) {
            encoding = start;
            start = 0;
            end = this.length;
          } else if ("string" === typeof end) {
            encoding = end;
            end = this.length;
          }
          if (1 === val.length) {
            var code = val.charCodeAt(0);
            code < 256 && (val = code);
          }
          if (void 0 !== encoding && "string" !== typeof encoding) throw new TypeError("encoding must be a string");
          if ("string" === typeof encoding && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
        } else "number" === typeof val && (val &= 255);
        if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
        if (end <= start) return this;
        start >>>= 0;
        end = void 0 === end ? this.length : end >>> 0;
        val || (val = 0);
        var i;
        if ("number" === typeof val) for (i = start; i < end; ++i) this[i] = val; else {
          var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
          var len = bytes.length;
          for (i = 0; i < end - start; ++i) this[i + start] = bytes[i % len];
        }
        return this;
      };
      var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = stringtrim(str).replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) str += "=";
        return str;
      }
      function stringtrim(str) {
        if (str.trim) return str.trim();
        return str.replace(/^\s+|\s+$/g, "");
      }
      function toHex(n) {
        if (n < 16) return "0" + n.toString(16);
        return n.toString(16);
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];
        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              if (i + 1 === length) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              (units -= 3) > -1 && bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = 65536 + (leadSurrogate - 55296 << 10 | codePoint - 56320);
          } else leadSurrogate && (units -= 3) > -1 && bytes.push(239, 191, 189);
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 6 | 192, 63 & codePoint | 128);
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          } else {
            if (!(codePoint < 1114112)) throw new Error("Invalid code point");
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) byteArray.push(255 & str.charCodeAt(i));
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        var c, hi, lo;
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isnan(val) {
        return val !== val;
      }
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "base64-js": 1,
    ieee754: 4,
    isarray: 3
  } ],
  3: [ function(require, module, exports) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return "[object Array]" == toString.call(arr);
    };
  }, {} ],
  4: [ function(require, module, exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (;nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8) ;
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (;nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8) ;
      if (0 === e) e = 1 - eBias; else {
        if (e === eMax) return m ? NaN : Infinity * (s ? -1 : 1);
        m += Math.pow(2, mLen);
        e -= eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || Infinity === value) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias);
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e += eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (;mLen >= 8; buffer[offset + i] = 255 & m, i += d, m /= 256, mLen -= 8) ;
      e = e << mLen | m;
      eLen += mLen;
      for (;eLen > 0; buffer[offset + i] = 255 & e, i += d, e /= 256, eLen -= 8) ;
      buffer[offset + i - d] |= 128 * s;
    };
  }, {} ],
  CacheManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4bfajBspdK6rFm4JM2XHck", "CacheManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CacheManager = void 0;
    var Defines_1 = require("../base/Defines");
    var Framework_1 = require("../Framework");
    var ResourceCache = function() {
      function ResourceCache(name) {
        this._caches = new Map();
        this.name = "unknown";
        this.name = name;
      }
      ResourceCache.prototype.print = function() {
        var content = [];
        var invalidContent = [];
        this._caches.forEach(function(data, key, source) {
          var itemContent = {
            url: data.info.url,
            isLoaded: data.isLoaded,
            isValid: cc.isValid(data.data),
            assetType: cc.js.getClassName(data.info.type),
            data: data.data ? cc.js.getClassName(data.data) : null,
            status: data.status
          };
          var item = {
            url: key,
            data: itemContent
          };
          data.isLoaded && data.data && !cc.isValid(data.data) ? invalidContent.push(item) : content.push(item);
        });
        if (content.length > 0) {
          cc.log("----------- Current valid caches -----------");
          cc.log(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
          cc.log("----------- Current invalid caches -----------");
          cc.log(JSON.stringify(invalidContent));
        }
      };
      ResourceCache.prototype.get = function(path, isCheck) {
        if (this._caches.has(path)) {
          var cache = this._caches.get(path);
          if (isCheck && cache.isInvalid) {
            cc.warn("\u8d44\u6e90\u52a0\u8f7d\u5b8c\u6210\uff0c\u4f46\u5df2\u7ecf\u88ab\u91ca\u653e , \u91cd\u65b0\u52a0\u8f7d\u8d44\u6e90 : " + path);
            this.remove(path);
            return null;
          }
          return this._caches.get(path);
        }
        return null;
      };
      ResourceCache.prototype.set = function(path, data) {
        this._caches.set(path, data);
      };
      ResourceCache.prototype.remove = function(path) {
        return this._caches.delete(path);
      };
      ResourceCache.prototype.removeUnuseCaches = function() {
        var _this = this;
        this._caches.forEach(function(value, key, origin) {
          if (value.data && 0 == value.data.refCount) {
            _this._caches.delete(key);
            true;
            cc.log("\u5220\u9664\u4e0d\u4f7f\u7528\u7684\u8d44\u6e90 bundle : " + _this.name + " url : " + key);
          }
        });
      };
      Object.defineProperty(ResourceCache.prototype, "size", {
        get: function() {
          return this._caches.size;
        },
        enumerable: false,
        configurable: true
      });
      return ResourceCache;
    }();
    var CacheInfo = function() {
      function CacheInfo() {
        this.refCount = 0;
        this.url = "";
        this.retain = false;
      }
      return CacheInfo;
    }();
    var RemoteCaches = function() {
      function RemoteCaches() {
        this._caches = new Map();
        this._spriteFrameCaches = new Map();
        this._resMap = new Map();
      }
      RemoteCaches.prototype.get = function(url) {
        if (this._caches.has(url)) return this._caches.get(url);
        return null;
      };
      RemoteCaches.prototype.getSpriteFrame = function(url) {
        if (this._spriteFrameCaches.has(url)) {
          var cache = this._spriteFrameCaches.get(url);
          var texture2D = this.get(url);
          if (texture2D) return cache;
          this.remove(url);
          return null;
        }
        return null;
      };
      RemoteCaches.prototype.setSpriteFrame = function(url, data) {
        if (data && data instanceof cc.Texture2D) {
          var spriteFrame = this.getSpriteFrame(url);
          if (spriteFrame) return spriteFrame.data;
          var cache = new Defines_1.ResourceCacheData();
          cache.data = new cc.SpriteFrame(data);
          cache.isLoaded = true;
          cache.info.url = url;
          this._spriteFrameCaches.set(url, cache);
          return cache.data;
        }
        return null;
      };
      RemoteCaches.prototype.set = function(url, data) {
        data.info.url = url;
        this._caches.set(url, data);
      };
      RemoteCaches.prototype._getCacheInfo = function(info, isNoFoundCreate) {
        void 0 === isNoFoundCreate && (isNoFoundCreate = true);
        if (info && info.url && info.url.length > 0) {
          if (!this._resMap.has(info.url)) {
            if (!isNoFoundCreate) return null;
            var cache = new CacheInfo();
            cache.url = info.url;
            this._resMap.set(info.url, cache);
          }
          return this._resMap.get(info.url);
        }
        return null;
      };
      RemoteCaches.prototype.retainAsset = function(info) {
        if (info && info.data) {
          var cache = this._getCacheInfo(info);
          if (cache) {
            if (cache.retain) {
              if (!info.retain) {
                true;
                cc.warn("\u8d44\u6e90 : " + info.url + " \u5df2\u7ecf\u88ab\u8bbe\u7f6e\u6210\u5e38\u9a7b\u8d44\u6e90\uff0c\u4e0d\u80fd\u6539\u53d8\u5176\u5c5e\u6027");
              }
            } else cache.retain = info.retain;
            info.data.addRef();
            cache.refCount++;
            cache.retain && (cache.refCount = 999999);
          }
        }
      };
      RemoteCaches.prototype.releaseAsset = function(info) {
        if (info && info.data) {
          var cache = this._getCacheInfo(info, false);
          if (cache) {
            if (cache.retain) return;
            cache.refCount--;
            cache.refCount <= 0 && this.remove(cache.url);
          }
        }
      };
      RemoteCaches.prototype.remove = function(url) {
        this._resMap.delete(url);
        if (this._spriteFrameCaches.has(url)) {
          this._spriteFrameCaches.get(url).data.decRef();
          this._spriteFrameCaches.delete(url);
          true;
          cc.log("remove remote sprite frames resource url : " + url);
        }
        var cache = this._caches.has(url) ? this._caches.get(url) : null;
        if (cache && cache.data instanceof sp.SkeletonData) {
          this.remove(cache.info.url + ".atlas");
          this.remove(cache.info.url + ".png");
          this.remove(cache.info.url + ".json");
        }
        if (cache && cache.data instanceof cc.Asset) {
          true;
          cc.log("\u91ca\u653e\u52a0\u8f7d\u7684\u672c\u5730\u8fdc\u7a0b\u8d44\u6e90:" + cache.info.url);
          cache.data.decRef();
          cc.assetManager.releaseAsset(cache.data);
        }
        true;
        cc.log("remove remote cache url : " + url);
        return this._caches.delete(url);
      };
      RemoteCaches.prototype.showCaches = function() {
        cc.log("---- [RemoteCaches] showCaches ----");
        var content = [];
        var invalidContent = [];
        this._spriteFrameCaches.forEach(function(data, key, source) {
          var itemContent = {
            url: data.info.url,
            isLoaded: data.isLoaded,
            isValid: cc.isValid(data.data),
            assetType: cc.js.getClassName(data.info.type),
            data: data.data ? cc.js.getClassName(data.data) : null,
            status: data.status
          };
          var item = {
            url: key,
            data: itemContent
          };
          data.isLoaded && (data.data && !cc.isValid(data.data) || !data.data) ? invalidContent.push(item) : content.push(item);
        });
        if (content.length > 0) {
          cc.log("----------------Current valid spriteFrame Caches------------------");
          cc.log(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
          cc.log("----------------Current invalid spriteFrame Caches------------------");
          cc.log(JSON.stringify(invalidContent));
        }
        content = [];
        invalidContent = [];
        this._caches.forEach(function(data, key, source) {
          var itemContent = {
            url: data.info.url,
            isLoaded: data.isLoaded,
            isValid: cc.isValid(data.data),
            assetType: cc.js.getClassName(data.info.type),
            data: data.data ? cc.js.getClassName(data.data) : null,
            status: data.status
          };
          var item = {
            url: key,
            data: itemContent
          };
          data.isLoaded && data.data && !cc.isValid(data.data) ? invalidContent.push(item) : content.push(item);
        });
        if (content.length > 0) {
          cc.log("----------------Current valid Caches------------------");
          cc.log(JSON.stringify(content));
        }
        if (invalidContent.length > 0) {
          cc.log("----------------Current invalid Caches------------------");
          cc.log(JSON.stringify(invalidContent));
        }
        if (this._resMap.size > 0) {
          cc.log("----------------Current resource reference Caches------------------");
          content = [];
          this._resMap.forEach(function(value, key) {
            var item = {
              url: key,
              data: {
                refCount: value.refCount,
                url: value.url,
                retain: value.retain
              }
            };
            content.push(item);
          });
          cc.log(JSON.stringify(content));
        }
      };
      return RemoteCaches;
    }();
    var CacheManager = function() {
      function CacheManager() {
        this.logTag = "[CacheManager]: ";
        this._bundles = new Map();
        this._remoteCaches = new RemoteCaches();
      }
      CacheManager.Instance = function() {
        return this._instance || (this._instance = new CacheManager());
      };
      Object.defineProperty(CacheManager.prototype, "remoteCaches", {
        get: function() {
          return this._remoteCaches;
        },
        enumerable: false,
        configurable: true
      });
      CacheManager.prototype.getBundleName = function(bundle) {
        return "string" == typeof bundle ? bundle : bundle ? bundle.name : null;
      };
      CacheManager.prototype.get = function(bundle, path, isCheck) {
        void 0 === isCheck && (isCheck = true);
        var bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) return this._bundles.get(bundleName).get(path, isCheck);
        return null;
      };
      CacheManager.prototype.set = function(bundle, path, data) {
        var bundleName = this.getBundleName(bundle);
        if (bundleName) if (this._bundles.has(bundleName)) this._bundles.get(bundleName).set(path, data); else {
          var cache = new ResourceCache(bundleName);
          cache.set(path, data);
          this._bundles.set(bundleName, cache);
        }
      };
      CacheManager.prototype.remove = function(bundle, path) {
        var bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) return this._bundles.get(bundleName).remove(path);
        return false;
      };
      CacheManager.prototype.removeWithInfo = function(info) {
        if (info) if (info.data) {
          info.data.decRef();
          if (0 == info.data.refCount) {
            this.remove(info.bundle, info.url);
            return true;
          }
        } else cc.error("info.data is null , bundle : " + info.bundle + " url : " + info.url); else cc.error("info is null");
        return false;
      };
      CacheManager.prototype.removeBundle = function(bundle) {
        var bundleName = this.getBundleName(bundle);
        if (bundleName && this._bundles.has(bundleName)) {
          true;
          cc.log("\u79fb\u9664bundle cache : " + bundleName);
          var data = this._bundles.get(bundleName);
          this._removeUnuseCaches();
          data.size > 0 && cc.error("\u79fb\u9664bundle " + bundleName + " \u8fd8\u6709\u672a\u91ca\u653e\u7684\u7f13\u5b58");
          this._bundles.delete(bundleName);
        }
      };
      CacheManager.prototype._removeUnuseCaches = function() {
        this._bundles.forEach(function(value, key, origin) {
          value && value.removeUnuseCaches();
        });
      };
      CacheManager.prototype._getGetCacheByAsyncArgs = function() {
        if (arguments.length < 3) {
          true;
          cc.error(this.logTag + "\u53c2\u6570\u4f20\u5165\u6709\u8bef\uff0c\u5fc5\u987b\u4e24\u4e2a\u53c2\u6570");
          return null;
        }
        if ("string" != typeof arguments[0]) {
          true;
          cc.error(this.logTag + "\u4f20\u5165\u7b2c\u4e00\u4e2a\u53c2\u6570\u6709\u8bef,\u5fc5\u987b\u662fstring");
          return null;
        }
        if (!cc.js.isChildClassOf(arguments[1], cc.Asset)) {
          true;
          cc.error(this.logTag + "\u4f20\u5165\u7684\u7b2c\u4e8c\u4e2a\u53c2\u6570\u6709\u8bef,\u5fc5\u987b\u662fcc.Asset\u7684\u5b50\u7c7b");
          return null;
        }
        return {
          url: arguments[0],
          type: arguments[1],
          bundle: arguments[2]
        };
      };
      CacheManager.prototype.getCache = function() {
        var _this = this;
        var args = arguments;
        var me = this;
        return new Promise(function(resolve) {
          var _args = me._getGetCacheByAsyncArgs.apply(me, args);
          if (!_args) {
            resolve(null);
            return;
          }
          var cache = me.get(_args.bundle, _args.url);
          if (cache) if (cache.isLoaded) if (_args.type) if (cache.data instanceof _args.type) resolve(cache.data); else {
            true;
            cc.error(_this.logTag + "\u4f20\u5165\u7c7b\u578b:" + cc.js.getClassName(_args.type) + "\u4e0e\u8d44\u6e90\u5b9e\u9645\u7c7b\u578b: " + cc.js.getClassName(cache.data) + "\u4e0d\u540c url : " + cache.info.url);
            resolve(null);
          } else resolve(cache.data); else cache.getCb.push(resolve); else resolve(null);
        });
      };
      CacheManager.prototype.getCacheByAsync = function() {
        var _this = this;
        var me = this;
        var args = this._getGetCacheByAsyncArgs.apply(this, arguments);
        return new Promise(function(resolve) {
          if (!args) {
            resolve(null);
            return;
          }
          me.getCache(args.url, args.type, args.bundle).then(function(data) {
            data && data instanceof args.type ? resolve(data) : Framework_1.Manager.assetManager.load(args.bundle, args.url, args.type, null, function(cache) {
              if (cache && cache.data && cache.data instanceof args.type) resolve(cache.data); else {
                cc.error(_this.logTag + "\u52a0\u8f7d\u5931\u8d25 : " + args.url);
                resolve(null);
              }
            });
          });
        });
      };
      CacheManager.prototype.getSpriteFrameByAsync = function(urls, key, view, addExtraLoadResource, bundle) {
        var me = this;
        return new Promise(function(resolve) {
          var nIndex = 0;
          var getFun = function(url) {
            me.getCacheByAsync(url, cc.SpriteAtlas, bundle).then(function(atlas) {
              var info = new Defines_1.ResourceInfo();
              info.url = url;
              info.type = cc.SpriteAtlas;
              info.data = atlas;
              info.bundle = bundle;
              addExtraLoadResource(view, info);
              if (atlas) {
                var spriteFrame = atlas.getSpriteFrame(key);
                if (spriteFrame) if (cc.isValid(spriteFrame)) resolve({
                  url: url,
                  spriteFrame: spriteFrame
                }); else {
                  cc.error("\u7cbe\u7075\u5e27\u88ab\u91ca\u653e\uff0c\u91ca\u653e\u5f53\u524d\u65e0\u6cd5\u7684\u56fe\u96c6\u8d44\u6e90 url \uff1a" + url + " key : " + key);
                  Framework_1.Manager.assetManager.releaseAsset(info);
                  resolve({
                    url: url,
                    spriteFrame: null,
                    isTryReload: true
                  });
                } else {
                  nIndex++;
                  nIndex >= urls.length ? resolve({
                    url: url,
                    spriteFrame: null
                  }) : getFun(urls[nIndex]);
                }
              } else resolve({
                url: url,
                spriteFrame: null
              });
            });
          };
          getFun(urls[nIndex]);
        });
      };
      CacheManager.prototype.printCaches = function() {
        this._bundles.forEach(function(value, key, originMap) {
          true;
          cc.log("----------------Bundle " + key + " caches begin----------------");
          value.print();
          true;
          cc.log("----------------Bundle " + key + " caches end----------------");
        });
        this.remoteCaches.showCaches();
      };
      CacheManager._instance = null;
      return CacheManager;
    }();
    exports.CacheManager = CacheManager;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "../base/Defines": "Defines"
  } ],
  ChatService: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5ae8f4bnXJANb/2lHlyZsqb", "ChatService");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ChatService = void 0;
    var CommonService_1 = require("./CommonService");
    var ChatService = function(_super) {
      __extends(ChatService, _super);
      function ChatService() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.serviceName = "\u804a\u5929";
        _this.ip = "echo.websocket.org";
        return _this;
      }
      Object.defineProperty(ChatService, "instance", {
        get: function() {
          return this._instance || (this._instance = new ChatService());
        },
        enumerable: false,
        configurable: true
      });
      return ChatService;
    }(CommonService_1.CommonService);
    exports.ChatService = ChatService;
    cc._RF.pop();
  }, {
    "./CommonService": "CommonService"
  } ],
  CmdDefines: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b06838e7phP8ryXKzNFC0BC", "CmdDefines");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SUB_CMD_SYS = exports.MainCmd = void 0;
    exports.MainCmd = {
      CMD_SYS: 1,
      CMD_GAME: 2,
      CMD_LOBBY: 3,
      CMD_PAY: 4,
      CMD_CHAT: 5
    };
    exports.SUB_CMD_SYS = {
      CMD_SYS_HEART: 1
    };
    cc._RF.pop();
  }, {} ],
  CocosExtention: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d04cfrIH9pOMoFQB4kwLaeF", "CocosExtention");
    "use strict";
    exports.__esModule = true;
    exports.CocosExtentionInit = CocosExtentionInit;
    var _WebEditBoxImpl = _interopRequireDefault(require("./WebEditBoxImpl"));
    var _Defines = require("../base/Defines");
    var _Utils = require("./Utils");
    var _EventApi = require("../event/EventApi");
    var _Framework = require("../Framework");
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    "object" == typeof Reflect ? Reflect.defineProperty(cc.Node.prototype, "userData", {
      value: null,
      writable: true
    }) : cc.Node.prototype.userData = null;
    cc.Sprite.prototype.loadRemoteImage = function(config) {
      var me = this;
      void 0 != config.isNeedCache && null != config.isNeedCache || (config.isNeedCache = true);
      var isRetain = false;
      config.retain && (isRetain = true);
      var defaultBundle = (0, _Utils.getBundle)({
        bundle: config.defaultBundle,
        view: config.view
      });
      _Framework.Manager.assetManager.remote.loadImage(config.url, config.isNeedCache).then(function(data) {
        if (data) (0, _Utils.setSpriteSpriteFrame)(config.view, config.url, me, data, config.completeCallback, _Defines.BUNDLE_REMOTE, _Defines.ResourceType.Remote, isRetain); else {
          config.defaultSpriteFrame && "string" == typeof config.defaultSpriteFrame && _Framework.Manager.cacheManager.getCacheByAsync(config.defaultSpriteFrame, cc.SpriteFrame, defaultBundle).then(function(spriteFrame) {
            (0, _Utils.setSpriteSpriteFrame)(config.view, config.defaultSpriteFrame, me, spriteFrame, config.completeCallback, defaultBundle);
          });
          config.completeCallback && cc.isValid(me) && config.completeCallback(data);
        }
      });
    };
    cc.Sprite.prototype.loadImage = function(config) {
      var me = this;
      var view = config.view;
      var url = config.url;
      var completeCallback = config.completeCallback;
      var bundle = (0, _Utils.getBundle)(config);
      "string" == typeof url ? _Framework.Manager.cacheManager.getCacheByAsync(url, cc.SpriteFrame, bundle).then(function(spriteFrame) {
        (0, _Utils.setSpriteSpriteFrame)(view, url, me, spriteFrame, completeCallback, bundle);
      }) : _Framework.Manager.cacheManager.getSpriteFrameByAsync(url.urls, url.key, view, _Utils.addExtraLoadResource, bundle).then(function(data) {
        data && data.isTryReload || (0, _Utils.setSpriteSpriteFrame)(view, data.url, me, data.spriteFrame, completeCallback, bundle, _Defines.ResourceType.Local, false, true);
      });
    };
    cc.createPrefab = function(config) {
      var url = config.url;
      var bundle = (0, _Utils.getBundle)(config);
      _Framework.Manager.cacheManager.getCacheByAsync(url, cc.Prefab, bundle).then(function(data) {
        (0, _Utils.createNodeWithPrefab)(config, data);
      });
    };
    sp.Skeleton.prototype.loadRemoteSkeleton = function(config) {
      var me = this;
      void 0 != config.isNeedCache && null != config.isNeedCache || (config.isNeedCache = true);
      _Framework.Manager.assetManager.remote.loadSkeleton(config.path, config.name, config.isNeedCache).then(function(data) {
        (0, _Utils.setSkeletonSkeletonData)(me, config, data, _Defines.ResourceType.Remote);
      });
    };
    sp.Skeleton.prototype.loadSkeleton = function(config) {
      var me = this;
      var url = config.url;
      var bundle = (0, _Utils.getBundle)(config);
      _Framework.Manager.cacheManager.getCacheByAsync(url, sp.SkeletonData, bundle).then(function(data) {
        (0, _Utils.setSkeletonSkeletonData)(me, config, data);
      });
    };
    cc.Button.prototype.loadButton = function(config) {
      (0, _Utils.setButtonSpriteFrame)(this, config);
    };
    cc.Label.prototype.loadFont = function(config) {
      var font = config.font;
      var me = this;
      var bundle = (0, _Utils.getBundle)(config);
      _Framework.Manager.cacheManager.getCacheByAsync(font, cc.Font, bundle).then(function(data) {
        (0, _Utils.setLabelFont)(me, config, data);
      });
    };
    cc.Label.prototype.forceDoLayout = function() {
      this._forceUpdateRenderData ? this._forceUpdateRenderData() : this._updateRenderData && this._updateRenderData(true);
    };
    cc.ParticleSystem.prototype.loadFile = function(config) {
      var me = this;
      var url = config.url;
      var bundle = (0, _Utils.getBundle)(config);
      _Framework.Manager.cacheManager.getCacheByAsync(url, cc.ParticleAsset, bundle).then(function(data) {
        (0, _Utils.setParticleSystemFile)(me, config, data);
      });
    };
    cc.updateAlignment = function(node) {
      if (node) {
        var backcc = cc;
        if (backcc._widgetManager) backcc._widgetManager.updateAlignment(node); else {
          true;
          cc.error(this._logTag, "\u5f15\u64ce\u53d8\u5316,\u539f\u59cb\u5f15\u64ce\u7248\u672c2.1.2\uff0c\u627e\u4e0d\u5230cc._widgetManager");
        }
      }
    };
    cc.randomRangeInt || (cc.randomRangeInt = function(min, max) {
      var value = (max - min) * Math.random() + min;
      var result = Math.floor(value);
      return result;
    });
    cc.randomRange || (cc.randomRange = function(min, max) {
      var value = (max - min) * Math.random() + min;
      return value;
    });
    true;
    if (_Framework.Manager.resolutionHelper.isBrowser && cc.sys.os != cc.sys.OS_WINDOWS) {
      true;
      cc.log("\u6d4f\u89c8\u5668");
      cc.EditBox._ImplClass = _WebEditBoxImpl["default"];
    }
    function CocosExtentionInit() {}
    Reflect.defineProperty(cc.Label.prototype, "language", {
      get: function get() {
        return this._language;
      },
      set: function set(v) {
        var self = this;
        var updateLanguage = function updateLanguage(v, cb) {
          if (v && (Array.isArray(v) && v.length > 0 || !!v)) {
            var value = null;
            value = Array.isArray(v) ? v : [ v ];
            cb && cb(true);
            self._language = [].concat(value);
            self.string = _Framework.Manager.language.get(value);
          } else {
            cb && cb(false);
            self._language = null;
            self.string = "";
          }
        };
        _Defines.ENABLE_CHANGE_LANGUAGE ? updateLanguage(v, function(isUsing) {
          if (isUsing) {
            if (!!!self._isUsinglanguage) {
              self._isUsinglanguage = true;
              _Framework.Manager.eventDispatcher.addEventListener(_EventApi.EventApi.CHANGE_LANGUAGE, self._onChangeLanguage, self);
            }
          } else self._language && _Framework.Manager.eventDispatcher.removeEventListener(_EventApi.EventApi.CHANGE_LANGUAGE, self);
        }) : updateLanguage(v, null);
      }
    });
    if (true, _Defines.ENABLE_CHANGE_LANGUAGE) {
      cc.Label.prototype._onChangeLanguage = function() {
        this.language = this.language;
      };
      var __label_onDestroy__ = cc.Label.prototype.onDestroy;
      cc.Label.prototype.onDestroy = function() {
        this._isUsinglanguage && _Framework.Manager.eventDispatcher.removeEventListener(_EventApi.EventApi.CHANGE_LANGUAGE, this);
        __label_onDestroy__ && __label_onDestroy__.call(this);
      };
      var __label_onLoad__ = cc.Label.prototype.onLoad;
      cc.Label.prototype.onLoad = function() {
        this.string.indexOf(_Defines.USING_LAN_KEY) > -1 && (this.language = [ this.string ]);
        __label_onLoad__ && __label_onLoad__.call(this);
      };
    }
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "../base/Defines": "Defines",
    "../event/EventApi": "EventApi",
    "./Utils": "Utils",
    "./WebEditBoxImpl": "WebEditBoxImpl"
  } ],
  CommonEvent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a70e5fyz7RGvoGeXvoRT8o/", "CommonEvent");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CommonEvent = void 0;
    var CommonEvent;
    (function(CommonEvent) {
      CommonEvent["HOTUPDATE_DOWNLOAD"] = "HOTUPDATE_DOWNLOAD";
      CommonEvent["DOWNLOAD_PROGRESS"] = "DOWNLOAD_PROGRESS";
      CommonEvent["TEST_PROTO_MSG"] = "TEST_PROTO_MSG";
      CommonEvent["TEST_BINARY_MSG"] = "TEST_BINARY_MSG";
      CommonEvent["TEST_JSON_MSG"] = "TEST_JSON_MSG";
      CommonEvent["LOBBY_SERVICE_CONNECTED"] = "LOBBY_SERVICE_CONNECTED";
      CommonEvent["LOBBY_SERVICE_CLOSE"] = "LOBBY_SERVICE_CLOSE";
      CommonEvent["GAME_SERVICE_CONNECTED"] = "GAME_SERVICE_CONNECTED";
      CommonEvent["GAME_SERVICE_CLOSE"] = "GAME_SERVICE_CLOSE";
      CommonEvent["CHAT_SERVICE_CONNECTED"] = "CHAT_SERVICE_CONNECTED";
      CommonEvent["CHAT_SERVICE_CLOSE"] = "CHAT_SERVICE_CLOSE";
    })(CommonEvent = exports.CommonEvent || (exports.CommonEvent = {}));
    cc._RF.pop();
  }, {} ],
  CommonService: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cdac79M5PhBeIG696a7Pj9/", "CommonService");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CommonService = void 0;
    var Service_1 = require("../../framework/base/Service");
    var CmdDefines_1 = require("../protocol/CmdDefines");
    var Reconnect_1 = require("./Reconnect");
    var Config_1 = require("../config/Config");
    var Manager_1 = require("../manager/Manager");
    var EventApi_1 = require("../../framework/event/EventApi");
    var CommonService = function(_super) {
      __extends(CommonService, _super);
      function CommonService() {
        var _this = _super.call(this) || this;
        _this.ip = "";
        _this.port = null;
        _this.protocol = "wss";
        _this._maxEnterBackgroundTime = Config_1.Config.MAX_INBACKGROUND_TIME;
        _this._backgroundTimeOutId = -1;
        _this.reconnect = null;
        _this.reconnect = new Reconnect_1.Reconnect(_this);
        return _this;
      }
      Object.defineProperty(CommonService, "instance", {
        get: function() {
          return this._instance || (this._instance = new CommonService());
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(CommonService.prototype, "maxEnterBackgroundTime", {
        get: function() {
          return this._maxEnterBackgroundTime;
        },
        set: function(value) {
          (value < Config_1.Config.MIN_INBACKGROUND_TIME || value > Config_1.Config.MAX_INBACKGROUND_TIME) && (value = Config_1.Config.MIN_INBACKGROUND_TIME);
          cc.log(this.serviceName, "maxEnterBackgroundTime " + value);
          this._maxEnterBackgroundTime = value;
        },
        enumerable: false,
        configurable: true
      });
      CommonService.prototype.connect = function() {
        _super.prototype.connect.call(this, this.ip, this.port, this.protocol);
      };
      CommonService.prototype.sendHeartbeat = function() {
        this.heartbeat ? this.send(new this.heartbeat()) : cc.error("\u8bf7\u5148\u8bbe\u7f6e\u5fc3\u8df3\u89e3\u6790\u7c7b\u578b");
      };
      CommonService.prototype.getMaxHeartbeatTimeOut = function() {
        return _super.prototype.getMaxHeartbeatTimeOut.call(this);
      };
      CommonService.prototype.getHeartbeatInterval = function() {
        return _super.prototype.getHeartbeatInterval.call(this);
      };
      CommonService.prototype.onHeartbeatTimeOut = function() {
        _super.prototype.onHeartbeatTimeOut.call(this);
        cc.warn(this.serviceName + " \u5fc3\u8df3\u8d85\u65f6\uff0c\u60a8\u5df2\u7ecf\u65ad\u5f00\u7f51\u7edc");
        this.close();
        Manager_1.Manager.serviceManager.tryReconnect(this, true);
      };
      CommonService.prototype.isHeartBeat = function(data) {
        return data.mainCmd == CmdDefines_1.MainCmd.CMD_SYS && data.subCmd == CmdDefines_1.SUB_CMD_SYS.CMD_SYS_HEART;
      };
      CommonService.prototype.onEnterBackground = function() {
        var me = this;
        Manager_1.Manager.uiManager.getView("LoginView").then(function(view) {
          me._backgroundTimeOutId = setTimeout(function() {
            cc.log("\u8fdb\u5165\u540e\u53f0\u65f6\u95f4\u8fc7\u957f\uff0c\u4e3b\u52a8\u5173\u95ed\u7f51\u7edc\uff0c\u7b49\u73a9\u5bb6\u5207\u56de\u524d\u53f0\u91cd\u65b0\u8fde\u63a5\u7f51\u7edc");
            me.close();
          }, 1e3 * me.maxEnterBackgroundTime);
        });
      };
      CommonService.prototype.onEnterForgeground = function(inBackgroundTime) {
        if (-1 != this._backgroundTimeOutId) {
          cc.log("\u6e05\u9664\u8fdb\u5165\u540e\u53f0\u7684\u8d85\u65f6\u5173\u95ed\u7f51\u7edc\u5b9a\u65f6\u5668");
          clearTimeout(this._backgroundTimeOutId);
          var self_1 = this;
          Manager_1.Manager.uiManager.getView("LoginView").then(function(view) {
            cc.log("\u5728\u540e\u53f0\u65f6\u95f4" + inBackgroundTime + " , \u6700\u5927\u65f6\u95f4\u4e3a: " + self_1.maxEnterBackgroundTime);
            if (view) return;
            if (inBackgroundTime > self_1.maxEnterBackgroundTime) {
              cc.log("\u4ece\u56de\u53f0\u5207\u6362\uff0c\u663e\u793a\u91cd\u65b0\u8fde\u63a5\u7f51\u7edc");
              self_1.close();
              Manager_1.Manager.serviceManager.tryReconnect(self_1);
            }
          });
        }
      };
      CommonService.prototype.onError = function(ev) {
        var _this = this;
        _super.prototype.onError.call(this, ev);
        Manager_1.Manager.uiManager.getView("LoginView").then(function(view) {
          if (view) return;
          Manager_1.Manager.serviceManager.tryReconnect(_this);
        });
      };
      CommonService.prototype.onClose = function(ev) {
        var _this = this;
        _super.prototype.onClose.call(this, ev);
        if (ev.type == EventApi_1.CustomNetEventType.CLOSE) {
          cc.log(this.serviceName + " \u5e94\u7528\u5c42\u4e3b\u52a8\u5173\u95edSocket");
          return;
        }
        Manager_1.Manager.uiManager.getView("LoginView").then(function(view) {
          if (view) return;
          Manager_1.Manager.serviceManager.tryReconnect(_this);
        });
      };
      CommonService._instance = null;
      return CommonService;
    }(Service_1.Service);
    exports.CommonService = CommonService;
    cc._RF.pop();
  }, {
    "../../framework/base/Service": "Service",
    "../../framework/event/EventApi": "EventApi",
    "../config/Config": "Config",
    "../manager/Manager": "Manager",
    "../protocol/CmdDefines": "CmdDefines",
    "./Reconnect": "Reconnect"
  } ],
  Config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "df6483YRVVPlodAQqnkAnjN", "Config");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ViewZOrder = exports.Config = void 0;
    var Config;
    (function(Config) {
      Config.isShowDebugButton = true;
      Config.assetBundle = {};
      Config.CommonPrefabs = {
        tips: "common/prefabs/Tips",
        uiLoading: "common/prefabs/UILoading",
        loading: "common/prefabs/Loading",
        alert: "common/prefabs/Alert"
      };
      Config.audioPath = {
        dialog: "common/audio/dlg_open",
        button: "common/audio/btn_click"
      };
      Config.isSkipCheckUpdate = false;
      Config.TEST_HOT_UPDATE_URL_ROOT = "http://127.0.0.1:5500/hotupdate";
      Config.LOADING_TIME_OUT = 30;
      Config.LOADING_CONTENT_CHANGE_INTERVAL = 3;
      Config.LOAD_VIEW_TIME_OUT = 20;
      Config.LOAD_VIEW_DELAY = .1;
      Config.BUNDLE_HALL = "hall";
      Config.RECONNECT_TIME_OUT = 30;
      Config.MAX_INBACKGROUND_TIME = 60;
      Config.MIN_INBACKGROUND_TIME = 5;
      Config.RECONNECT_ALERT_TAG = 100;
    })(Config = exports.Config || (exports.Config = {}));
    var ViewZOrder;
    (function(ViewZOrder) {
      ViewZOrder.zero = 0;
      ViewZOrder.Horn = 10;
      ViewZOrder.UI = 100;
      ViewZOrder.Tips = 300;
      ViewZOrder.Alert = 299;
      ViewZOrder.Loading = 600;
      ViewZOrder.UILoading = 700;
    })(ViewZOrder = exports.ViewZOrder || (exports.ViewZOrder = {}));
    cc._RF.pop();
  }, {} ],
  Controller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5d639ZnlvBGGphwAhPfsbs/", "Controller");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventApi_1 = require("../event/EventApi");
    var EventComponent_1 = require("../base/EventComponent");
    var Service_1 = require("../base/Service");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Controller = function(_super) {
      __extends(Controller, _super);
      function Controller() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(Controller.prototype, "service", {
        get: function() {
          return this._service;
        },
        set: function(value) {
          this._service = value;
        },
        enumerable: false,
        configurable: true
      });
      Controller.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(EventApi_1.EventApi.NetEvent.ON_OPEN, this.onNetOpen);
        this.registerEvent(EventApi_1.EventApi.NetEvent.ON_CLOSE, this.onNetClose);
        this.registerEvent(EventApi_1.EventApi.NetEvent.ON_ERROR, this.onNetError);
      };
      Controller.prototype.onNetOpen = function(event) {
        if (this.service == event.service) {
          true;
          cc.log(event.service.serviceName + "\u7f51\u7edc onNetOpen");
          return true;
        }
        return false;
      };
      Controller.prototype.onNetClose = function(event) {
        if (this.service == event.service) {
          true;
          cc.log(event.service.serviceName + "\u7f51\u7edc onNetClose");
          return true;
        }
        return false;
      };
      Controller.prototype.onNetError = function(event) {
        if (this.service == event.service) {
          true;
          cc.log(event.service.serviceName + "\u7f51\u7edc onNetError");
          return true;
        }
        return false;
      };
      Controller.prototype.send = function(msg) {
        this.service instanceof Service_1.Service ? this.service.send(msg) : cc.error("this.service is null");
      };
      Object.defineProperty(Controller.prototype, "bundle", {
        get: function() {
          cc.error("\u8bf7\u5b50\u7c7b\u91cd\u5199protected get bundle,\u8fd4\u56de\u6e38\u620f\u7684\u5305\u540d,\u5373 asset bundle name");
          return "";
        },
        enumerable: false,
        configurable: true
      });
      Controller = __decorate([ ccclass ], Controller);
      return Controller;
    }(EventComponent_1.default);
    exports.default = Controller;
    cc._RF.pop();
  }, {
    "../base/EventComponent": "EventComponent",
    "../base/Service": "Service",
    "../event/EventApi": "EventApi"
  } ],
  Decorators: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a73a3gqxuBG4azywFSxJslZ", "Decorators");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.injectPresenter = exports.makeKey = exports.injectService = void 0;
    function injectService(service) {
      return function(target) {
        var __load = target.prototype.onLoad;
        target.prototype.onLoad = function() {
          true;
          cc.log("[injectService] " + cc.js.getClassName(this) + " ---onLoad----");
          this.service = service;
          __load && __load.call(this);
        };
      };
    }
    exports.injectService = injectService;
    function makeKey(mainCmd, subCmd) {
      var key = "[" + mainCmd + "]:[" + subCmd + "]";
      return key;
    }
    exports.makeKey = makeKey;
    function injectPresenter(presenter) {
      return function(target) {
        target.prototype.__presenter_type__ = presenter;
      };
    }
    exports.injectPresenter = injectPresenter;
    cc._RF.pop();
  }, {} ],
  Defines: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "67315ILTptCJ6ugLWRGRR1Y", "Defines");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.USING_LITTLE_ENDIAN = exports.USING_LAN_KEY = exports.ENABLE_CHANGE_LANGUAGE = exports.BUNDLE_REMOTE = exports.BUNDLE_RESOURCES = exports.ViewStatus = exports.ResourceCacheData = exports.ResourceInfo = exports.ResourceType = exports.ResourceCacheStatus = void 0;
    var ResourceCacheStatus;
    (function(ResourceCacheStatus) {
      ResourceCacheStatus[ResourceCacheStatus["NONE"] = 0] = "NONE";
      ResourceCacheStatus[ResourceCacheStatus["WAITTING_FOR_RELEASE"] = 1] = "WAITTING_FOR_RELEASE";
    })(ResourceCacheStatus = exports.ResourceCacheStatus || (exports.ResourceCacheStatus = {}));
    var ResourceType;
    (function(ResourceType) {
      ResourceType[ResourceType["Local"] = 0] = "Local";
      ResourceType[ResourceType["Remote"] = 1] = "Remote";
    })(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
    var ResourceInfo = function() {
      function ResourceInfo() {
        this.url = "";
        this.type = null;
        this.data = null;
        this.assetUrl = "";
        this.retain = false;
        this.bundle = null;
        this.resourceType = ResourceType.Local;
      }
      return ResourceInfo;
    }();
    exports.ResourceInfo = ResourceInfo;
    var ResourceCacheData = function() {
      function ResourceCacheData() {
        this.isLoaded = false;
        this.data = null;
        this.info = new ResourceInfo();
        this.status = ResourceCacheStatus.NONE;
        this.getCb = [];
        this.finishCb = [];
      }
      ResourceCacheData.prototype.doGet = function(data) {
        for (var i = 0; i < this.getCb.length; i++) this.getCb[i] && this.getCb[i](data);
        this.getCb = [];
      };
      ResourceCacheData.prototype.doFinish = function(data) {
        for (var i = 0; i < this.finishCb.length; i++) this.finishCb[i] && this.finishCb[i](data);
        this.finishCb = [];
      };
      Object.defineProperty(ResourceCacheData.prototype, "isInvalid", {
        get: function() {
          return this.isLoaded && this.data && !cc.isValid(this.data);
        },
        enumerable: false,
        configurable: true
      });
      return ResourceCacheData;
    }();
    exports.ResourceCacheData = ResourceCacheData;
    var ViewStatus;
    (function(ViewStatus) {
      ViewStatus[ViewStatus["WAITTING_CLOSE"] = 0] = "WAITTING_CLOSE";
      ViewStatus[ViewStatus["WATITING_HIDE"] = 1] = "WATITING_HIDE";
      ViewStatus[ViewStatus["WAITTING_NONE"] = 2] = "WAITTING_NONE";
    })(ViewStatus = exports.ViewStatus || (exports.ViewStatus = {}));
    exports.BUNDLE_RESOURCES = "resources";
    exports.BUNDLE_REMOTE = "__Remote__Caches__";
    exports.ENABLE_CHANGE_LANGUAGE = true;
    exports.USING_LAN_KEY = "i18n.";
    exports.USING_LITTLE_ENDIAN = false;
    cc._RF.pop();
  }, {} ],
  DownloadLoading: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0744b1s4EFPyLobmHRH0Y7s", "DownloadLoading");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UIView_1 = require("../../framework/ui/UIView");
    var LanguageImpl_1 = require("../language/LanguageImpl");
    var HotUpdate_1 = require("../base/HotUpdate");
    var Manager_1 = require("../manager/Manager");
    var CommonEvent_1 = require("../event/CommonEvent");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DownloadLoading = function(_super) {
      __extends(DownloadLoading, _super);
      function DownloadLoading() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.progress = null;
        _this.tipsLabel = null;
        _this.tipsIndex = 0;
        _this.state = null;
        _this.updateName = "";
        return _this;
      }
      DownloadLoading.getPrefabUrl = function() {
        return "common/prefabs/DownloadLoading";
      };
      Object.defineProperty(DownloadLoading.prototype, "tips", {
        get: function() {
          return LanguageImpl_1.i18n.updatingtips;
        },
        enumerable: false,
        configurable: true
      });
      DownloadLoading.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(CommonEvent_1.CommonEvent.HOTUPDATE_DOWNLOAD, this.onDownload);
      };
      DownloadLoading.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.state = this.args[0];
        this.updateName = this.args[1];
        this.tipsLabel = cc.find("tips", this.node).getComponent(cc.Label);
        this.progress = cc.find("progressBar", this.node).getComponent(cc.ProgressBar);
        this.startTips();
        this.scheduleOnce(this.doUpdate, 1.5);
      };
      DownloadLoading.prototype.doUpdate = function() {
        this.state == HotUpdate_1.AssetManagerState.TRY_DOWNLOAD_FAILED_ASSETS ? HotUpdate_1.HotUpdate.downloadFailedAssets() : HotUpdate_1.HotUpdate.hotUpdate();
      };
      DownloadLoading.prototype.startTips = function() {
        var _this = this;
        cc.tween(this.tipsLabel.node).call(function() {
          _this.tipsLabel.string = _this.tips[_this.tipsIndex];
        }).delay(2).call(function() {
          _this.tipsIndex++;
          _this.tipsIndex >= _this.tips.length && (_this.tipsIndex = 0);
          _this.startTips();
        }).start();
      };
      DownloadLoading.prototype.onDownload = function(info) {
        true;
        cc.log(JSON.stringify(info));
        if (info.code == HotUpdate_1.AssetManagerCode.UPDATE_PROGRESSION) this.progress.progress = info.percent == Number.NaN ? 0 : info.percent; else if (info.code == HotUpdate_1.AssetManagerCode.ALREADY_UP_TO_DATE) this.progress.progress = 1; else if (info.code == HotUpdate_1.AssetManagerCode.UPDATE_FINISHED) {
          Manager_1.Manager.tips.show(String.format(LanguageImpl_1.i18n.alreadyRemoteVersion, this.updateName));
          this.close();
        } else if (info.code == HotUpdate_1.AssetManagerCode.UPDATE_FAILED || info.code == HotUpdate_1.AssetManagerCode.ERROR_NO_LOCAL_MANIFEST || info.code == HotUpdate_1.AssetManagerCode.ERROR_DOWNLOAD_MANIFEST || info.code == HotUpdate_1.AssetManagerCode.ERROR_PARSE_MANIFEST || info.code == HotUpdate_1.AssetManagerCode.ERROR_UPDATING || info.code == HotUpdate_1.AssetManagerCode.ERROR_DECOMPRESS) {
          Manager_1.Manager.tips.show(String.format(LanguageImpl_1.i18n.updateFaild, this.updateName));
          this.close();
        }
      };
      DownloadLoading = __decorate([ ccclass ], DownloadLoading);
      return DownloadLoading;
    }(UIView_1.default);
    exports.default = DownloadLoading;
    cc._RF.pop();
  }, {
    "../../framework/ui/UIView": "UIView",
    "../base/HotUpdate": "HotUpdate",
    "../event/CommonEvent": "CommonEvent",
    "../language/LanguageImpl": "LanguageImpl",
    "../manager/Manager": "Manager"
  } ],
  EventApi: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2ca11E9NLZEiqnYgIoSjr0s", "EventApi");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CustomNetEventType = exports.EventApi = void 0;
    var TAG = {
      NetEvent: "NetEvent_"
    };
    exports.EventApi = {
      NetEvent: {
        ON_OPEN: TAG.NetEvent + "ON_OPEN",
        ON_CLOSE: TAG.NetEvent + "ON_CLOSE",
        ON_ERROR: TAG.NetEvent + "ON_ERROR"
      },
      AdaptScreenEvent: "AdaptScreenEvent",
      CHANGE_LANGUAGE: "CHANGE_LANGUAGE"
    };
    var CustomNetEventType;
    (function(CustomNetEventType) {
      CustomNetEventType["CLOSE"] = "CustomClose";
    })(CustomNetEventType = exports.CustomNetEventType || (exports.CustomNetEventType = {}));
    cc._RF.pop();
  }, {} ],
  EventComponent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5af0eqpInZAY4eyx1jKB3jI", "EventComponent");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Framework_1 = require("../Framework");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var addListeners = Symbol("addListeners");
    var removeEventListeners = Symbol("removeEventListeners");
    var EventComponent = function(_super) {
      __extends(EventComponent, _super);
      function EventComponent() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._service = null;
        _this.logTag = "[EventComponent]";
        _this._events = [];
        return _this;
      }
      EventComponent.prototype._getEventArgs = function() {
        if (arguments.length < 2) {
          true;
          cc.error("\u6ce8\u518c\u4e8b\u4ef6\u53c2\u6570\u9519\u8bef");
          return null;
        }
        var args = {};
        if ("string" == typeof arguments[0]) {
          args.name = arguments[0];
          args.func = arguments[1];
        } else {
          args.mainCmd = arguments[0];
          args.subCmd = arguments[1];
          args.handleType = null;
          args.isQueue = true;
          arguments.length >= 3 && (args.func = arguments[2]);
          arguments.length >= 4 && (args.handleType = arguments[3]);
          arguments.length >= 5 && (args.isQueue = arguments[4]);
        }
        return args;
      };
      EventComponent.prototype.registerEvent = function() {
        var args = this._getEventArgs.apply(this, arguments);
        args && this._events.push(args);
      };
      EventComponent.prototype.addEvent = function() {
        var event = this._getEventArgs.apply(this, arguments);
        if (event) {
          this._events.push(event);
          event.name ? Framework_1.Manager.eventDispatcher.addEventListener(event.name, event.func, this) : this._service && (event.mainCmd && event.subCmd ? this._service.addListener(event.mainCmd, event.subCmd, event.handleType, event.func, event.isQueue, this) : cc.error(this.logTag, "\u6ce8\u518c\u7684\u7f51\u7edc\u56de\u8c03\u6709\u8bef class : " + cc.js.getClassName(this) + " manCmd : " + event.mainCmd + " subCmd : " + event.subCmd));
        }
      };
      EventComponent.prototype.removeEvent = function() {
        if (arguments.length < 1) {
          true;
          cc.error("\u53c2\u6570\u6709\u8bef");
          return;
        }
        if (1 == arguments.length) {
          Framework_1.Manager.eventDispatcher.removeEventListener(arguments[0], this);
          var i = this._events.length;
          while (i--) this._events[i].name == arguments[0] && this._events.splice(i, 1);
        } else {
          var mainCmd = arguments[0];
          var subCmd = arguments[1];
          this._service && "number" == typeof mainCmd && "number" == typeof subCmd && this._service.removeListeners(this, mainCmd, subCmd);
          var i = this._events.length;
          while (i--) this._events[i].mainCmd == mainCmd && this._events[i].subCmd == subCmd && this._events.splice(i, 1);
        }
      };
      EventComponent.prototype.bindingEvents = function() {};
      EventComponent.prototype.onLoad = function() {
        this.bindingEvents();
        this[addListeners]();
      };
      EventComponent.prototype.onDestroy = function() {
        this[removeEventListeners]();
      };
      EventComponent.prototype[addListeners] = function() {
        for (var i = 0; i < this._events.length; i++) {
          var event = this._events[i];
          event.name ? Framework_1.Manager.eventDispatcher.addEventListener(event.name, event.func, this) : this._service && (event.mainCmd && event.subCmd ? this._service.addListener(event.mainCmd, event.subCmd, event.handleType, event.func, event.isQueue, this) : cc.error(this.logTag, "\u6ce8\u518c\u7684\u7f51\u7edc\u56de\u8c03\u6709\u8bef class : " + cc.js.getClassName(this) + " manCmd : " + event.mainCmd + " subCmd : " + event.subCmd));
        }
      };
      EventComponent.prototype[removeEventListeners] = function() {
        for (var i = 0; i < this._events.length; i++) {
          var event = this._events[i];
          event.name && Framework_1.Manager.eventDispatcher.removeEventListener(event.name, this);
        }
        if (this._service) {
          this._service.removeListeners(this);
          this._service = null;
        }
      };
      EventComponent = __decorate([ ccclass ], EventComponent);
      return EventComponent;
    }(cc.Component);
    exports.default = EventComponent;
    cc._RF.pop();
  }, {
    "../Framework": "Framework"
  } ],
  EventDispatcher: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "76e60J3VtFFtpDVPb7EZx5v", "EventDispatcher");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.EventDispatcher = void 0;
    var EventDispatcher = function() {
      function EventDispatcher() {
        this.logTag = "[EventDispatcher] ";
        this._eventCaches = null;
        this._eventCaches = {};
      }
      EventDispatcher.Instance = function() {
        return this._instance || (this._instance = new EventDispatcher());
      };
      EventDispatcher.prototype.addEventListener = function(type, callback, target) {
        if (!type || !callback || !target) return;
        var eventCaches = this._eventCaches[type] || [];
        var hasSame = false;
        for (var i = 0; i < eventCaches.length; i++) if (eventCaches[i].target === target) {
          hasSame = true;
          break;
        }
        if (hasSame) return;
        var newEvent = {
          type: type,
          callback: callback,
          target: target
        };
        eventCaches.push(newEvent);
        this._eventCaches[type] = eventCaches;
      };
      EventDispatcher.prototype.removeEventListener = function(type, target) {
        if (!type || !target) return;
        var eventCaches = this._eventCaches[type];
        if (!eventCaches) return;
        for (var i = 0; i < eventCaches.length; i++) if (eventCaches[i].target === target) {
          eventCaches.splice(i, 1);
          break;
        }
        0 == eventCaches.length && delete this._eventCaches[type];
      };
      EventDispatcher.prototype.dispatchEvent = function(type, data) {
        if (!type) return;
        var eventCaches = this._eventCaches[type];
        if (!eventCaches) return;
        for (var i = 0; i < eventCaches.length; i++) {
          var event = eventCaches[i];
          try {
            if ("object" == typeof Reflect) if ("string" == typeof event.callback) {
              var func = Reflect.get(event.target, event.callback);
              if (func) {
                true;
                cc.log(this.logTag + " apply string func : " + event.callback + " class : " + cc.js.getClassName(event.target));
                Reflect.apply(func.bind(event.target), event.target, [ data ]);
              } else {
                true;
                cc.error(this.logTag + " class : " + cc.js.getClassName(event.target) + " no func : " + event.callback);
              }
            } else Reflect.apply(event.callback, event.target, [ data ]); else if ("string" == typeof event.callback) if (event.target && event.callback) {
              var func = event.target[event.callback];
              if (func && "function" == typeof func) func.apply(event.target, [ data ]); else {
                true;
                cc.error(event.callback + " is not function");
              }
            } else {
              true;
              cc.error("target or callback is null");
            } else if (event.callback && event.target) event.callback.apply(event.target, [ data ]); else {
              true;
              cc.error("callback is null");
            }
          } catch (error) {
            cc.error(error);
          }
        }
      };
      EventDispatcher._instance = null;
      return EventDispatcher;
    }();
    exports.EventDispatcher = EventDispatcher;
    window.dispatch = function(name, data) {
      true, true;
      cc.log("[dispatch] " + name + " data : " + data);
      EventDispatcher.Instance().dispatchEvent(name, data);
    };
    cc._RF.pop();
  }, {} ],
  Extentions: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2ee709OI+pEX7Wqmoa02FAO", "Extentions");
    "use strict";
    exports.__esModule = true;
    exports.extentionsInit = extentionsInit;
    window.md5 = function md5(data) {
      return this.CryptoJS.MD5(data);
    };
    Date.prototype.format = function(format) {
      var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
      };
      /(y+)/i.test(format) && (format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (var k in date) new RegExp("(" + k + ")").test(format) && (format = format.replace(RegExp.$1, 1 == RegExp.$1.length ? date[k] : ("00" + date[k]).substr(("" + date[k]).length)));
      return format;
    };
    Date.timeNow = function() {
      return Math.floor(Date.timeNowMillisecons() / 1e3);
    };
    Date.timeNowMillisecons = function() {
      var now = new Date();
      return now.getTime();
    };
    String.format = function() {
      var param = [];
      for (var i = 0, l = arguments.length; i < l; i++) param.push(arguments[i]);
      var statment = param[0];
      if ("string" != typeof statment) {
        true;
        cc.error("String.format error,first param is not a string");
        return "";
      }
      param.shift();
      Array.isArray(param[0]) && 1 == param.length && (param = param[0]);
      return statment.replace(/\{(\d+)\}/g, function(m, n) {
        return param[n];
      });
    };
    function extentionsInit() {}
    cc._RF.pop();
  }, {} ],
  Framework: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "62e5c5yqsdAGI6fxoZ3NCIO", "Framework");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Manager = exports._FramewokManager = void 0;
    var Language_1 = require("./base/Language");
    var EventDispatcher_1 = require("./event/EventDispatcher");
    var UIManager_1 = require("./base/UIManager");
    var LocalStorage_1 = require("./base/LocalStorage");
    var AssetManager_1 = require("./assetManager/AssetManager");
    var CacheManager_1 = require("./assetManager/CacheManager");
    var ResolutionHelper_1 = require("./adaptor/ResolutionHelper");
    var Singleton_1 = require("./base/Singleton");
    var _FramewokManager = function() {
      function _FramewokManager() {
        this._tips = null;
        this._uiLoading = null;
        this._wssCacertUrl = null;
      }
      Object.defineProperty(_FramewokManager.prototype, "retainMemory", {
        get: function() {
          return this.uiManager.retainMemory;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_FramewokManager.prototype, "language", {
        get: function() {
          return Singleton_1.getSingleton(Language_1.Language);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_FramewokManager.prototype, "eventDispatcher", {
        get: function() {
          return Singleton_1.getSingleton(EventDispatcher_1.EventDispatcher);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_FramewokManager.prototype, "uiManager", {
        get: function() {
          return Singleton_1.getSingleton(UIManager_1.UIManager);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_FramewokManager.prototype, "localStorage", {
        get: function() {
          return Singleton_1.getSingleton(LocalStorage_1.LocalStorage);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_FramewokManager.prototype, "assetManager", {
        get: function() {
          return Singleton_1.getSingleton(AssetManager_1.AssetManager);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_FramewokManager.prototype, "cacheManager", {
        get: function() {
          return Singleton_1.getSingleton(CacheManager_1.CacheManager);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_FramewokManager.prototype, "resolutionHelper", {
        get: function() {
          return Singleton_1.getSingleton(ResolutionHelper_1.ResolutionHelper);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_FramewokManager.prototype, "tips", {
        get: function() {
          return this._tips;
        },
        set: function(value) {
          this._tips = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_FramewokManager.prototype, "uiLoading", {
        get: function() {
          return this._uiLoading;
        },
        set: function(value) {
          this._uiLoading = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_FramewokManager.prototype, "wssCacertUrl", {
        get: function() {
          return this._wssCacertUrl;
        },
        set: function(value) {
          this._wssCacertUrl = value;
        },
        enumerable: false,
        configurable: true
      });
      return _FramewokManager;
    }();
    exports._FramewokManager = _FramewokManager;
    exports.Manager = new _FramewokManager();
    cc._RF.pop();
  }, {
    "./adaptor/ResolutionHelper": "ResolutionHelper",
    "./assetManager/AssetManager": "AssetManager",
    "./assetManager/CacheManager": "CacheManager",
    "./base/Language": "Language",
    "./base/LocalStorage": "LocalStorage",
    "./base/Singleton": "Singleton",
    "./base/UIManager": "UIManager",
    "./event/EventDispatcher": "EventDispatcher"
  } ],
  GameData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ae8cfivGvhC0Jggi9zclct/", "GameData");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameData = void 0;
    var Presenter_1 = require("../../framework/base/Presenter");
    var GameData = function(_super) {
      __extends(GameData, _super);
      function GameData() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(GameData.prototype, "bundle", {
        get: function() {
          return "";
        },
        enumerable: false,
        configurable: true
      });
      GameData.prototype.clear = function() {};
      GameData.prototype.gameType = function() {
        return -1;
      };
      GameData.prototype.onLanguageChange = function() {};
      return GameData;
    }(Presenter_1.Presenter);
    exports.GameData = GameData;
    cc._RF.pop();
  }, {
    "../../framework/base/Presenter": "Presenter"
  } ],
  GameEventInterface: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9d7388eazNLcIIuXMBOD91H", "GameEventInterface");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  GameService: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d6c33czRRRKAJsyyZzeZ+Dh", "GameService");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameService = void 0;
    var CommonService_1 = require("./CommonService");
    var GameService = function(_super) {
      __extends(GameService, _super);
      function GameService() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.ip = "echo.websocket.org";
        _this.serviceName = "\u6e38\u620f";
        return _this;
      }
      Object.defineProperty(GameService, "instance", {
        get: function() {
          return this._instance || (this._instance = new GameService());
        },
        enumerable: false,
        configurable: true
      });
      return GameService;
    }(CommonService_1.CommonService);
    exports.GameService = GameService;
    cc._RF.pop();
  }, {
    "./CommonService": "CommonService"
  } ],
  GameView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6615fp4kFJCp59X9P6X+odj", "GameView");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UIView_1 = require("../../framework/ui/UIView");
    var Manager_1 = require("../manager/Manager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameView = function(_super) {
      __extends(GameView, _super);
      function GameView() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      GameView.prototype.onLoad = function() {
        Manager_1.Manager.gameView = this;
        _super.prototype.onLoad.call(this);
      };
      GameView.prototype.onDestroy = function() {
        this.audioHelper && this.audioHelper.stopAllEffects();
        Manager_1.Manager.gameView = null;
        _super.prototype.onDestroy.call(this);
      };
      GameView = __decorate([ ccclass ], GameView);
      return GameView;
    }(UIView_1.default);
    exports.default = GameView;
    cc._RF.pop();
  }, {
    "../../framework/ui/UIView": "UIView",
    "../manager/Manager": "Manager"
  } ],
  GlobalAudio: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1facfFsEXlCYKgKMntC7Wla", "GlobalAudio");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AudioComponent_1 = require("../../framework/base/AudioComponent");
    var Defines_1 = require("../../framework/base/Defines");
    var Config_1 = require("../config/Config");
    var Manager_1 = require("../manager/Manager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var GlobalAudio = function(_super) {
      __extends(GlobalAudio, _super);
      function GlobalAudio() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      GlobalAudio.prototype.playDialogOpen = function() {
        this.playEffect(Config_1.Config.audioPath.dialog, Defines_1.BUNDLE_RESOURCES, false);
      };
      GlobalAudio.prototype.playButtonClick = function() {
        this.playEffect(Config_1.Config.audioPath.button, Defines_1.BUNDLE_RESOURCES, false);
      };
      GlobalAudio.prototype.playMusic = function(url, bundle, loop) {
        var _this = this;
        void 0 === loop && (loop = true);
        var me = this;
        return new Promise(function(resolve) {
          if (bundle != Defines_1.BUNDLE_RESOURCES) {
            cc.error(url + " \u4e0d\u5728 " + Defines_1.BUNDLE_RESOURCES + " \u5168\u5c40\u64ad\u653e\u7684\u58f0\u97f3\u53d1\u73b0\u5b58\u653e\u5230" + Defines_1.BUNDLE_RESOURCES);
            resolve({
              url: url,
              isSuccess: false
            });
            return;
          }
          _this.audioData.curMusicUrl = url;
          _this.audioData.curBundle = bundle;
          _this.audioData.isMusicOn && Manager_1.Manager.cacheManager.getCacheByAsync(url, cc.AudioClip, bundle).then(function(data) {
            if (data) {
              Manager_1.Manager.assetManager.addPersistAsset(url, data, bundle);
              me.stopMusic();
              cc.audioEngine.playMusic(data, loop);
              _this.isPlaying = true;
              resolve({
                url: url,
                isSuccess: true
              });
            } else resolve({
              url: url,
              isSuccess: false
            });
          });
        });
      };
      GlobalAudio.prototype.playEffect = function(url, bundle, loop) {
        var _this = this;
        void 0 === loop && (loop = false);
        return new Promise(function(resolve) {
          if (bundle != Defines_1.BUNDLE_RESOURCES) {
            cc.error(url + " \u4e0d\u5728 " + Defines_1.BUNDLE_RESOURCES + " \u5168\u5c40\u64ad\u653e\u7684\u58f0\u97f3\u53d1\u73b0\u5b58\u653e\u5230" + Defines_1.BUNDLE_RESOURCES);
            resolve(-1);
            return;
          }
          if (_this.audioData.isEffectOn) Manager_1.Manager.cacheManager.getCacheByAsync(url, cc.AudioClip, bundle).then(function(data) {
            if (data) {
              Manager_1.Manager.assetManager.addPersistAsset(url, data, bundle);
              _this.audioData.curEffectId = cc.audioEngine.playEffect(data, loop);
              resolve(_this.audioData.curEffectId);
            } else resolve(_this.audioData.curEffectId);
          }); else {
            _this.audioData.curEffectId = -1;
            resolve(-1);
          }
        });
      };
      GlobalAudio.prototype.onLoad = function() {
        this.effectVolume = this.audioData.effectVolume;
        this.musicVolume = this.audioData.musicVolume;
      };
      GlobalAudio = __decorate([ ccclass, menu("common/component/GlobalAudio") ], GlobalAudio);
      return GlobalAudio;
    }(AudioComponent_1.default);
    exports.default = GlobalAudio;
    cc._RF.pop();
  }, {
    "../../framework/base/AudioComponent": "AudioComponent",
    "../../framework/base/Defines": "Defines",
    "../config/Config": "Config",
    "../manager/Manager": "Manager"
  } ],
  HeartbetBinary: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bf220LgtiJKeLKEgU1DKwY0", "HeartbetBinary");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HeartbeatBinary = void 0;
    var BinaryStreamMessage_1 = require("../../framework/net/BinaryStreamMessage");
    var CmdDefines_1 = require("./CmdDefines");
    var HeartbeatBinary = function(_super) {
      __extends(HeartbeatBinary, _super);
      function HeartbeatBinary() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.mainCmd = CmdDefines_1.MainCmd.CMD_SYS;
        _this.subCmd = CmdDefines_1.SUB_CMD_SYS.CMD_SYS_HEART;
        return _this;
      }
      return HeartbeatBinary;
    }(BinaryStreamMessage_1.BinaryStreamMessage);
    exports.HeartbeatBinary = HeartbeatBinary;
    cc._RF.pop();
  }, {
    "../../framework/net/BinaryStreamMessage": "BinaryStreamMessage",
    "./CmdDefines": "CmdDefines"
  } ],
  HeartbetJson: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "00f876AKTBPv6NpQhhPlXW0", "HeartbetJson");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HeartbeatJson = void 0;
    var JsonMessage_1 = require("../../framework/net/JsonMessage");
    var CmdDefines_1 = require("./CmdDefines");
    var HeartbeatJson = function(_super) {
      __extends(HeartbeatJson, _super);
      function HeartbeatJson() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.mainCmd = CmdDefines_1.MainCmd.CMD_SYS;
        _this.subCmd = CmdDefines_1.SUB_CMD_SYS.CMD_SYS_HEART;
        return _this;
      }
      return HeartbeatJson;
    }(JsonMessage_1.JsonMessage);
    exports.HeartbeatJson = HeartbeatJson;
    cc._RF.pop();
  }, {
    "../../framework/net/JsonMessage": "JsonMessage",
    "./CmdDefines": "CmdDefines"
  } ],
  HeartbetProto: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "72088siMjhKdbpChJoDxG9R", "HeartbetProto");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HeartbeatProto = void 0;
    var CmdDefines_1 = require("./CmdDefines");
    var Message_1 = require("../../framework/net/Message");
    var HeartbeatProto = function(_super) {
      __extends(HeartbeatProto, _super);
      function HeartbeatProto() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.mainCmd = CmdDefines_1.MainCmd.CMD_SYS;
        _this.subCmd = CmdDefines_1.SUB_CMD_SYS.CMD_SYS_HEART;
        return _this;
      }
      return HeartbeatProto;
    }(Message_1.Message);
    exports.HeartbeatProto = HeartbeatProto;
    cc._RF.pop();
  }, {
    "../../framework/net/Message": "Message",
    "./CmdDefines": "CmdDefines"
  } ],
  HotUpdate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "62ade2ht0dPYbWnakcMpNfx", "HotUpdate");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HotUpdate = exports.BundleConfig = exports.AssetManagerState = exports.AssetManagerCode = void 0;
    var Config_1 = require("../config/Config");
    var CommonEvent_1 = require("../event/CommonEvent");
    var LogicEvent_1 = require("../event/LogicEvent");
    var AssetsManager = function() {
      function AssetsManager(name) {
        this.code = -1;
        this.name = "";
        this.manager = null;
        this.name = name;
      }
      return AssetsManager;
    }();
    var AssetManagerCode;
    (function(AssetManagerCode) {
      AssetManagerCode[AssetManagerCode["ERROR_NO_LOCAL_MANIFEST"] = 0] = "ERROR_NO_LOCAL_MANIFEST";
      AssetManagerCode[AssetManagerCode["ERROR_DOWNLOAD_MANIFEST"] = 1] = "ERROR_DOWNLOAD_MANIFEST";
      AssetManagerCode[AssetManagerCode["ERROR_PARSE_MANIFEST"] = 2] = "ERROR_PARSE_MANIFEST";
      AssetManagerCode[AssetManagerCode["NEW_VERSION_FOUND"] = 3] = "NEW_VERSION_FOUND";
      AssetManagerCode[AssetManagerCode["ALREADY_UP_TO_DATE"] = 4] = "ALREADY_UP_TO_DATE";
      AssetManagerCode[AssetManagerCode["UPDATE_PROGRESSION"] = 5] = "UPDATE_PROGRESSION";
      AssetManagerCode[AssetManagerCode["ASSET_UPDATED"] = 6] = "ASSET_UPDATED";
      AssetManagerCode[AssetManagerCode["ERROR_UPDATING"] = 7] = "ERROR_UPDATING";
      AssetManagerCode[AssetManagerCode["UPDATE_FINISHED"] = 8] = "UPDATE_FINISHED";
      AssetManagerCode[AssetManagerCode["UPDATE_FAILED"] = 9] = "UPDATE_FAILED";
      AssetManagerCode[AssetManagerCode["ERROR_DECOMPRESS"] = 10] = "ERROR_DECOMPRESS";
      AssetManagerCode[AssetManagerCode["CHECKING"] = 11] = "CHECKING";
    })(AssetManagerCode = exports.AssetManagerCode || (exports.AssetManagerCode = {}));
    var AssetManagerState;
    (function(AssetManagerState) {
      AssetManagerState[AssetManagerState["UNINITED"] = 0] = "UNINITED";
      AssetManagerState[AssetManagerState["UNCHECKED"] = 1] = "UNCHECKED";
      AssetManagerState[AssetManagerState["PREDOWNLOAD_VERSION"] = 2] = "PREDOWNLOAD_VERSION";
      AssetManagerState[AssetManagerState["DOWNLOADING_VERSION"] = 3] = "DOWNLOADING_VERSION";
      AssetManagerState[AssetManagerState["VERSION_LOADED"] = 4] = "VERSION_LOADED";
      AssetManagerState[AssetManagerState["PREDOWNLOAD_MANIFEST"] = 5] = "PREDOWNLOAD_MANIFEST";
      AssetManagerState[AssetManagerState["DOWNLOADING_MANIFEST"] = 6] = "DOWNLOADING_MANIFEST";
      AssetManagerState[AssetManagerState["MANIFEST_LOADED"] = 7] = "MANIFEST_LOADED";
      AssetManagerState[AssetManagerState["NEED_UPDATE"] = 8] = "NEED_UPDATE";
      AssetManagerState[AssetManagerState["READY_TO_UPDATE"] = 9] = "READY_TO_UPDATE";
      AssetManagerState[AssetManagerState["UPDATING"] = 10] = "UPDATING";
      AssetManagerState[AssetManagerState["UNZIPPING"] = 11] = "UNZIPPING";
      AssetManagerState[AssetManagerState["UP_TO_DATE"] = 12] = "UP_TO_DATE";
      AssetManagerState[AssetManagerState["FAIL_TO_UPDATE"] = 13] = "FAIL_TO_UPDATE";
      AssetManagerState[AssetManagerState["TRY_DOWNLOAD_FAILED_ASSETS"] = 14] = "TRY_DOWNLOAD_FAILED_ASSETS";
    })(AssetManagerState = exports.AssetManagerState || (exports.AssetManagerState = {}));
    var BundleConfig = function() {
      function BundleConfig(name, bundle, index, event, isNeedPrompt) {
        void 0 === isNeedPrompt && (isNeedPrompt = false);
        this.bundle = "";
        this.name = "";
        this.index = 0;
        this.event = LogicEvent_1.LogicEvent.ENTER_GAME;
        this.isNeedPrompt = false;
        this.name = name;
        this.bundle = bundle;
        this.index = index;
        this.isNeedPrompt = isNeedPrompt;
        event && (this.event = event);
      }
      return BundleConfig;
    }();
    exports.BundleConfig = BundleConfig;
    var HALL_ASSETS_MANAGER_NAME = "HALL";
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var _HotUpdate = function() {
      function _HotUpdate() {
        this.manifestRoot = "manifest/";
        this.storagePath = "";
        this.updating = false;
        this._commonHotUpdateUrl = Config_1.Config.TEST_HOT_UPDATE_URL_ROOT;
        this._projectManifest = null;
        this.checkCallback = null;
        this.bundlesConfig = {};
        this.assetsManagers = {};
        this._hotUpdateUrls = {};
        this.currentAssetsManager = null;
      }
      Object.defineProperty(_HotUpdate.prototype, "commonHotUpdateUrl", {
        get: function() {
          return this._commonHotUpdateUrl.length > 0 ? this._commonHotUpdateUrl : this.projectManifest.packageUrl;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_HotUpdate.prototype, "projectManifest", {
        get: function() {
          if (true, !this._projectManifest) {
            var content = jsb.fileUtils.getStringFromFile(this.hallProjectMainfest);
            try {
              this._projectManifest = JSON.parse(content);
            } catch (error) {
              this._projectManifest = null;
              cc.error("\u8bfb\u53d6" + this.hallProjectMainfest + "\u5931\u8d25");
            }
          }
          return this._projectManifest;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_HotUpdate.prototype, "hallProjectMainfest", {
        get: function() {
          return this.manifestRoot + "project.manifest";
        },
        enumerable: false,
        configurable: true
      });
      _HotUpdate.prototype.getHotUpdateUrl = function(moduleName) {
        true;
        var config = {
          gameOne: this._commonHotUpdateUrl,
          gameTwo: this._commonHotUpdateUrl
        };
        return config[moduleName] ? config[moduleName] : this.commonHotUpdateUrl;
      };
      _HotUpdate.prototype.getBundleName = function(gameName) {
        return this.bundlesConfig[gameName];
      };
      _HotUpdate.prototype.destroyAssetsManager = function(name) {
        void 0 === name && (name = HALL_ASSETS_MANAGER_NAME);
        if (this.assetsManagers[name]) {
          cc.log("destroyAssetsManager : " + name);
          this.currentAssetsManager = null;
          delete this.assetsManagers[name];
        }
      };
      _HotUpdate.prototype.getAssetsManager = function(name) {
        void 0 === name && (name = HALL_ASSETS_MANAGER_NAME);
        if (this.assetsManagers[name]) return this.assetsManagers[name];
        true;
        this.storagePath = jsb.fileUtils.getWritablePath();
        cc.log("Storage path for remote asset : " + this.storagePath);
        this.assetsManagers[name] = new AssetsManager(name);
        this.assetsManagers[name].manager = new jsb.AssetsManager(name == HALL_ASSETS_MANAGER_NAME ? "type.hall" : "type." + name + "_", this.storagePath, this.versionCompareHanle.bind(this));
        this.assetsManagers[name].manager.setMaxConcurrentTask(8);
        this.assetsManagers[name].manager.setHotUpdateUrl(this.getHotUpdateUrl(name));
        this.assetsManagers[name].manager.setVerifyCallback(function(path, asset) {
          var compressed = asset.compressed;
          var expectedMD5 = asset.md5;
          var relativePath = asset.path;
          var size = asset.size;
          if (compressed) {
            cc.log("Verification passed : " + relativePath);
            return true;
          }
          cc.log("Verification passed : " + relativePath + " ( " + expectedMD5 + " )");
          return true;
        });
        cc.log("Hot update is ready , please check or directly update.");
        return this.assetsManagers[name];
      };
      _HotUpdate.prototype.isTryDownloadFailedAssets = function() {
        if (this.currentAssetsManager && this.currentAssetsManager.manager.getState() == AssetManagerState.FAIL_TO_UPDATE && this.currentAssetsManager.code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST && this.currentAssetsManager.code == AssetManagerCode.ERROR_DOWNLOAD_MANIFEST && this.currentAssetsManager.code == AssetManagerCode.ERROR_PARSE_MANIFEST) return true;
        return false;
      };
      Object.defineProperty(_HotUpdate.prototype, "isBrowser", {
        get: function() {
          return cc.sys.platform == cc.sys.WECHAT_GAME || cc.sys.isBrowser;
        },
        enumerable: false,
        configurable: true
      });
      _HotUpdate.prototype.isNeedUpdate = function(callback) {
        if (this.isBrowser) {
          this.updating = false;
          callback(AssetManagerCode.ALREADY_UP_TO_DATE, AssetManagerState.UP_TO_DATE);
          return false;
        }
        if (Config_1.Config.isSkipCheckUpdate) {
          cc.log("\u8df3\u8fc7\u70ed\u66f4\u65b0\uff0c\u76f4\u63a5\u4f7f\u7528\u672c\u5730\u8d44\u6e90\u4ee3\u7801");
          this.updating = false;
          callback(AssetManagerCode.ALREADY_UP_TO_DATE, AssetManagerState.UP_TO_DATE);
        }
        return !Config_1.Config.isSkipCheckUpdate;
      };
      _HotUpdate.prototype.checkUpdate = function(callback) {
        if (this.isNeedUpdate(callback)) {
          cc.log("--checkUpdate--");
          if (this.updating) {
            cc.log("Checking or updating...");
            callback(AssetManagerCode.CHECKING, AssetManagerState.PREDOWNLOAD_VERSION);
            return;
          }
          if (!this.currentAssetsManager.manager.getLocalManifest() || !this.currentAssetsManager.manager.getLocalManifest().isLoaded()) {
            cc.log("Failed to load local manifest ....");
            callback(AssetManagerCode.ERROR_DOWNLOAD_MANIFEST, AssetManagerState.FAIL_TO_UPDATE);
            return;
          }
          if (this.isTryDownloadFailedAssets()) {
            cc.log("\u4e4b\u524d\u4e0b\u8f7d\u8d44\u6e90\u672a\u5b8c\u5168\u4e0b\u8f7d\u5b8c\u6210\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u4e0b\u8f7d");
            callback(AssetManagerCode.UPDATE_FAILED, AssetManagerState.TRY_DOWNLOAD_FAILED_ASSETS);
          } else {
            this.updating = true;
            this.checkCallback = callback;
            this.currentAssetsManager.manager.setEventCallback(this.checkCb.bind(this));
            this.currentAssetsManager.manager.checkUpdate();
          }
        }
      };
      _HotUpdate.prototype.downloadFailedAssets = function() {
        this.currentAssetsManager && this.currentAssetsManager.manager.downloadFailedAssets();
      };
      _HotUpdate.prototype.checkHallUpdate = function(callback) {
        if (this.isNeedUpdate(callback)) {
          this.currentAssetsManager = this.getAssetsManager();
          this.currentAssetsManager.manager.loadLocalManifest(this.hallProjectMainfest);
          this.checkUpdate(callback);
        }
      };
      _HotUpdate.prototype.getGameManifest = function(gameName) {
        return "" + this.manifestRoot + gameName + "_project.manifest";
      };
      _HotUpdate.prototype.checkGameUpdate = function(gameName, callback) {
        if (this.isNeedUpdate(callback)) {
          this.currentAssetsManager = this.getAssetsManager(gameName);
          var manifestUrl = this.getGameManifest(gameName);
          if (jsb.fileUtils.isFileExist(manifestUrl)) {
            var content = jsb.fileUtils.getStringFromFile(manifestUrl);
            var jsbGameManifest = new jsb.Manifest(content, this.storagePath, this.getHotUpdateUrl(this.currentAssetsManager.name));
            cc.log("--\u5b58\u5728\u672c\u5730\u7248\u672c\u63a7\u5236\u6587\u4ef6checkUpdate--");
            cc.log("mainifestUrl : " + manifestUrl);
            this.currentAssetsManager.manager.loadLocalManifest(jsbGameManifest, "");
            this.checkUpdate(callback);
          } else {
            if (this.updating) {
              cc.log("Checking or updating...");
              callback(AssetManagerCode.CHECKING, AssetManagerState.PREDOWNLOAD_VERSION);
              return;
            }
            var packageUrl = this.getHotUpdateUrl(gameName);
            var gameManifest = {
              version: "0",
              packageUrl: packageUrl,
              remoteManifestUrl: packageUrl + "/" + manifestUrl,
              remoteVersionUrl: packageUrl + "/" + this.manifestRoot + gameName + "_version.manifest",
              assets: {},
              searchPaths: []
            };
            var gameManifestContent = JSON.stringify(gameManifest);
            var jsbGameManifest = new jsb.Manifest(gameManifestContent, this.storagePath, this.getHotUpdateUrl(this.currentAssetsManager.name));
            cc.log("--checkUpdate--");
            cc.log("mainifest content : " + gameManifestContent);
            this.currentAssetsManager.manager.loadLocalManifest(jsbGameManifest, "");
            this.checkUpdate(callback);
          }
        }
      };
      _HotUpdate.prototype.checkCb = function(event) {
        this.currentAssetsManager.code = event.getEventCode();
        cc.log("checkCb event code : " + event.getEventCode() + " state : " + this.currentAssetsManager.manager.getState());
        switch (event.getEventCode()) {
         case AssetManagerCode.ERROR_NO_LOCAL_MANIFEST:
          cc.log("No local manifest file found, hot update skipped.");
          break;

         case AssetManagerCode.ERROR_DOWNLOAD_MANIFEST:
         case AssetManagerCode.ERROR_PARSE_MANIFEST:
          cc.log("Fail to download manifest file, hot update skipped.");
          break;

         case AssetManagerCode.ALREADY_UP_TO_DATE:
          cc.log("Already up to date with the latest remote version.");
          break;

         case AssetManagerCode.NEW_VERSION_FOUND:
          cc.log("New version found, please try to update.");
          break;

         default:
          return;
        }
        this.updating = false;
        if (this.checkCallback && this.currentAssetsManager.manager.getState() != AssetManagerState.DOWNLOADING_VERSION) {
          this.checkCallback(event.getEventCode(), this.currentAssetsManager.manager.getState());
          this.checkCallback = null;
        }
      };
      _HotUpdate.prototype.hotUpdate = function() {
        if (!this.currentAssetsManager) {
          cc.error("\u70ed\u66f4\u65b0\u7ba1\u7406\u5668\u672a\u521d\u59cb\u5316");
          return;
        }
        cc.log("\u5373\u5c06\u70ed\u66f4\u65b0\u6a21\u5757\u4e3a:" + this.currentAssetsManager.name + " , updating : " + this.updating);
        if (!this.updating) {
          cc.log("\u6267\u884c\u66f4\u65b0 " + this.currentAssetsManager.name + " ");
          this.currentAssetsManager.manager.setEventCallback(this.updateCb.bind(this));
          this.currentAssetsManager.manager.update();
        }
      };
      _HotUpdate.prototype.updateCb = function(event) {
        var isUpdateFinished = false;
        var failed = false;
        cc.log("--update cb code : " + event.getEventCode() + " state : " + this.currentAssetsManager.manager.getState());
        this.currentAssetsManager.code = event.getEventCode();
        switch (event.getEventCode()) {
         case AssetManagerCode.ERROR_NO_LOCAL_MANIFEST:
          cc.log("No local manifest file found, hot update skipped.");
          failed = true;
          break;

         case AssetManagerCode.UPDATE_PROGRESSION:
          cc.log(event.getDownloadedBytes() + " / " + event.getTotalBytes());
          cc.log(event.getDownloadedFiles() + " / " + event.getTotalFiles());
          cc.log("percent : " + event.getPercent());
          cc.log("percent by file : " + event.getPercentByFile());
          var msg = event.getMessage();
          msg && cc.log("Updated file: " + msg);
          break;

         case AssetManagerCode.ERROR_DOWNLOAD_MANIFEST:
         case AssetManagerCode.ERROR_PARSE_MANIFEST:
          cc.log("Fail to download manifest file, hot update skipped.");
          failed = true;
          break;

         case AssetManagerCode.ALREADY_UP_TO_DATE:
          cc.log("Already up to date with the latest remote version.");
          failed = true;
          break;

         case AssetManagerCode.UPDATE_FINISHED:
          cc.log("Update finished. " + event.getMessage());
          isUpdateFinished = true;
          break;

         case AssetManagerCode.UPDATE_FAILED:
          cc.log("Update failed. " + event.getMessage());
          this.updating = false;
          break;

         case AssetManagerCode.ERROR_UPDATING:
          cc.log("Asset update error: " + event.getAssetId() + " , " + event.getMessage());
          break;

         case AssetManagerCode.ERROR_DECOMPRESS:
          cc.log("" + event.getMessage());
        }
        if (failed) {
          this.currentAssetsManager.manager.setEventCallback(null);
          this.updating = false;
        }
        if (isUpdateFinished) {
          var searchPaths = jsb.fileUtils.getSearchPaths();
          var newPaths = this.currentAssetsManager.manager.getLocalManifest().getSearchPaths();
          cc.log(JSON.stringify(newPaths));
          Array.prototype.unshift.apply(searchPaths, newPaths);
          var obj = {};
          for (var i = 0; i < searchPaths.length; i++) obj[searchPaths[i]] = true;
          searchPaths = Object.keys(obj);
          cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(searchPaths));
          jsb.fileUtils.setSearchPaths(searchPaths);
        }
        var state = this.currentAssetsManager.manager.getState();
        if (this.currentAssetsManager.name == HALL_ASSETS_MANAGER_NAME) {
          if (isUpdateFinished) {
            this.currentAssetsManager.manager.setEventCallback(null);
            event.getDownloadedFiles() > 0 && cc.game.restart();
            this.destroyAssetsManager(this.currentAssetsManager.name);
          }
        } else if (isUpdateFinished) {
          cc.log(this.currentAssetsManager.name + " \u4e0b\u8f7d\u8d44\u6e90\u6570 : " + event.getDownloadedFiles());
          this.destroyAssetsManager(this.currentAssetsManager.name);
        }
        var info = {
          downloadedBytes: event.getDownloadedBytes(),
          totalBytes: event.getTotalBytes(),
          downloadedFiles: event.getDownloadedFiles(),
          totalFiles: event.getTotalFiles(),
          percent: event.getPercent(),
          percentByFile: event.getPercentByFile(),
          code: event.getEventCode(),
          state: state,
          needRestart: isUpdateFinished
        };
        dispatch(CommonEvent_1.CommonEvent.HOTUPDATE_DOWNLOAD, info);
        cc.log("update cb  failed : " + failed + "  , need restart : " + isUpdateFinished + " , updating : " + this.updating);
      };
      _HotUpdate.prototype.versionCompareHanle = function(versionA, versionB) {
        cc.log("JS Custom Version Compare : version A is " + versionA + " , version B is " + versionB);
        var vA = versionA.split(".");
        var vB = versionB.split(".");
        cc.log("version A " + vA + " , version B " + vB);
        for (var i = 0; i < vA.length && i < vB.length; ++i) {
          var a = parseInt(vA[i]);
          var b = parseInt(vB[i]);
          if (a === b) continue;
          return a - b;
        }
        if (vB.length > vA.length) return -1;
        return 0;
      };
      _HotUpdate = __decorate([ ccclass ], _HotUpdate);
      return _HotUpdate;
    }();
    exports.HotUpdate = new _HotUpdate();
    cc._RF.pop();
  }, {
    "../config/Config": "Config",
    "../event/CommonEvent": "CommonEvent",
    "../event/LogicEvent": "LogicEvent"
  } ],
  HttpClient: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9440fYu/95D5orBXWIAUqJ9", "HttpClient");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HttpPackage = exports.HttpRequestType = exports.HttpErrorType = void 0;
    var HttpErrorType;
    (function(HttpErrorType) {
      HttpErrorType[HttpErrorType["UrlError"] = 0] = "UrlError";
      HttpErrorType[HttpErrorType["TimeOut"] = 1] = "TimeOut";
      HttpErrorType[HttpErrorType["RequestError"] = 2] = "RequestError";
    })(HttpErrorType = exports.HttpErrorType || (exports.HttpErrorType = {}));
    var HttpRequestType;
    (function(HttpRequestType) {
      HttpRequestType["POST"] = "POST";
      HttpRequestType["GET"] = "GET";
    })(HttpRequestType = exports.HttpRequestType || (exports.HttpRequestType = {}));
    var HttpPackageData = function() {
      function HttpPackageData() {
        this.data = null;
        this.url = null;
        this.timeout = 1e4;
        this.type = HttpRequestType.GET;
        this.requestHeader = null;
        this.isAutoAttachCurrentTime = false;
        this._responseType = "";
      }
      Object.defineProperty(HttpPackageData.prototype, "responseType", {
        get: function() {
          true;
          "" == this._responseType && (this._responseType = "text");
          return this._responseType;
        },
        set: function(type) {
          this._responseType = type;
        },
        enumerable: false,
        configurable: true
      });
      return HttpPackageData;
    }();
    var HttpPackage = function() {
      function HttpPackage() {
        this._data = new HttpPackageData();
        this._params = null;
      }
      Object.defineProperty(HttpPackage.prototype, "data", {
        get: function() {
          return this._data;
        },
        set: function(data) {
          this._data = data;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HttpPackage.prototype, "params", {
        get: function() {
          return this._params;
        },
        set: function(value) {
          this._params = value;
        },
        enumerable: false,
        configurable: true
      });
      HttpPackage.prototype.send = function(cb, errorcb) {
        HttpClient.request(this, cb, errorcb);
      };
      HttpPackage.crossProxy = {};
      HttpPackage.location = {
        host: "",
        pathname: "",
        protocol: ""
      };
      return HttpPackage;
    }();
    exports.HttpPackage = HttpPackage;
    var HttpClient = function() {
      function HttpClient() {}
      HttpClient.crossProxy = function(url) {
        if (cc.sys.isBrowser && HttpPackage.crossProxy) {
          var config = HttpPackage.crossProxy;
          var location = HttpPackage.location;
          var keys = Object.keys(config);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = config[key];
            if (url.indexOf(key) > -1 && value.protocol && value.api) {
              location.protocol != value.protocol && (url = url.replace(value.protocol, location.protocol));
              return url.replace(key, location.host + "/" + value.api);
            }
          }
          return url;
        }
        return url;
      };
      HttpClient.convertParams = function(url, params) {
        if (null == params || void 0 == params) return url;
        var result = "&";
        url.indexOf("?") < 0 && (result = "?");
        var keys = Object.keys(params);
        for (var i = 0; i < keys.length; i++) result += 0 == i ? keys[i] + "=" + params[keys[i]] : "&" + keys[i] + "=" + params[keys[i]];
        result = url + result;
        return result;
      };
      HttpClient.request = function(httpPackage, cb, errorcb) {
        var url = httpPackage.data.url;
        if (!url) {
          true;
          cc.error("reuqest url error");
          errorcb && errorcb({
            type: HttpErrorType.UrlError,
            reason: "\u9519\u8bef\u7684Url\u5730\u5740"
          });
          return;
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (4 === xhr.readyState) if (xhr.status >= 200 && xhr.status < 300) if ("arraybuffer" == xhr.responseType || "blob" == xhr.responseType) cb && cb(xhr.response); else {
            true;
            cc.log("htpp res(" + xhr.responseText + ")");
            cb && cb(xhr.responseText);
          } else {
            var reason = "\u8bf7\u6c42\u9519\u8bef,\u9519\u8bef\u72b6\u6001:" + xhr.status;
            cc.error("request error status : " + xhr.status + " url : " + url + " ");
            errorcb && errorcb({
              type: HttpErrorType.RequestError,
              reason: reason
            });
          }
        };
        xhr.responseType = httpPackage.data.responseType;
        xhr.timeout = httpPackage.data.timeout;
        xhr.ontimeout = function() {
          xhr.abort();
          true;
          cc.warn("request timeout : " + url);
          errorcb && errorcb({
            type: HttpErrorType.TimeOut,
            reason: "\u8fde\u63a5\u8d85\u65f6"
          });
        };
        xhr.onerror = function() {
          cc.error("request error : " + url + " ");
          errorcb && errorcb({
            type: HttpErrorType.RequestError,
            reason: "\u8bf7\u6c42\u9519\u8bef"
          });
        };
        true;
        cc.log("[send http request] url : " + url + " request type : " + httpPackage.data.type + " , responseType : " + xhr.responseType);
        url = this.crossProxy(url);
        url = this.convertParams(url, httpPackage.params);
        cc.sys.isBrowser && httpPackage.data.isAutoAttachCurrentTime && (url = url.indexOf("?") >= 0 ? url + "&cur_loc_t=" + Date.timeNow() : url + "?cur_loc_t=" + Date.timeNow());
        if (cc.sys.isBrowser && true) {
          true;
          cc.log("[send http request] corss prox url : " + url + " request type : " + httpPackage.data.type + " , responseType : " + xhr.responseType);
        }
        if (httpPackage.data.type === HttpRequestType.POST) {
          xhr.open(HttpRequestType.POST, url);
          if (httpPackage.data.requestHeader) if (httpPackage.data.requestHeader instanceof Array) httpPackage.data.requestHeader.forEach(function(header) {
            xhr.setRequestHeader(header.name, header.value);
          }); else {
            var header = httpPackage.data.requestHeader;
            xhr.setRequestHeader(header.name, header.value);
          } else xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
          xhr.send(httpPackage.data.data);
        } else {
          xhr.open(HttpRequestType.GET, url, true);
          if (httpPackage.data.requestHeader) if (httpPackage.data.requestHeader instanceof Array) httpPackage.data.requestHeader.forEach(function(header) {
            xhr.setRequestHeader(header.name, header.value);
          }); else {
            var header = httpPackage.data.requestHeader;
            xhr.setRequestHeader(header.name, header.value);
          }
          xhr.send();
        }
      };
      return HttpClient;
    }();
    cc._RF.pop();
  }, {} ],
  JsonMessage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "765cbLoNc5HRY+HAc3KtQVO", "JsonMessage");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.JsonMessageHeader = exports.JsonMessage = exports.serialize = void 0;
    var Message_1 = require("./Message");
    function serialize(key, type, arrTypeOrMapKeyType, mapValueType) {
      return function(target, memberName) {
        if (void 0 === Reflect.getOwnPropertyDescriptor(target, "__serialize__")) {
          var selfSerializeInfo = {};
          if (Reflect.getPrototypeOf(target)["__serialize__"] && void 0 === Reflect.getOwnPropertyDescriptor(target, "__serialize__")) {
            var parentSerializeInfo = Reflect.getPrototypeOf(target)["__serialize__"];
            var serializeKeyList = Object.keys(parentSerializeInfo);
            for (var len = serializeKeyList.length, i = 0; i < len; i++) selfSerializeInfo[serializeKeyList[i]] = parentSerializeInfo[serializeKeyList[i]].slice(0);
          }
          Reflect.defineProperty(target, "__serialize__", {
            value: selfSerializeInfo
          });
        }
        if (target["__serialize__"][key]) throw "SerializeKey has already been declared:" + key;
        target["__serialize__"][key] = [ memberName, type, arrTypeOrMapKeyType, mapValueType ];
      };
    }
    exports.serialize = serialize;
    var Buffer = require("buffer").Buffer;
    var JsonMessage = function(_super) {
      __extends(JsonMessage, _super);
      function JsonMessage() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.data = null;
        return _this;
      }
      JsonMessage.prototype.encode = function() {
        this.data = this.serialize();
        var result = JSON.stringify(this.data);
        this.buffer = new Buffer(result);
        return true;
      };
      JsonMessage.prototype.serialize = function() {
        var result = {};
        var __serialize__ = Reflect.getPrototypeOf(this)["__serialize__"];
        if (!__serialize__) return result;
        var serializeKeyList = Object.keys(__serialize__);
        for (var len = serializeKeyList.length, i = 0; i < len; i++) {
          var serializeKey = serializeKeyList[i];
          var memberName = __serialize__[serializeKey][0];
          var serializeObj = this.serializeMember(this[memberName]);
          null === serializeObj && cc.warn("Invalid serialize member : " + memberName);
          result[serializeKey] = serializeObj;
        }
        return result;
      };
      JsonMessage.prototype.serializeMember = function(value) {
        if ("number" == typeof value) return this.serializeNumber(value);
        if ("string" == typeof value) return this.serializeString(value);
        if (value instanceof Array) return this.serializeArray(value);
        if (value instanceof Map) return this.serializeMap(value);
        if (value instanceof JsonMessage) return value.serialize();
        cc.warn("Invalid serialize value : " + value);
        return null;
      };
      JsonMessage.prototype.serializeNumber = function(value) {
        return void 0 === value || null === value ? "0" : value.toString();
      };
      JsonMessage.prototype.serializeString = function(value) {
        return void 0 === value || null === value ? "" : value.toString();
      };
      JsonMessage.prototype.serializeArray = function(value) {
        var _this = this;
        var result = [];
        value.forEach(function(element) {
          result.push(_this.serializeMember(element));
        });
        return result;
      };
      JsonMessage.prototype.serializeMap = function(value) {
        var result = [];
        var self = this;
        value.forEach(function(value, key) {
          var serVal = {
            k: self.serializeMember(key),
            v: self.serializeMember(value)
          };
          if (null === serVal.k) {
            cc.warn("Invalid map key!");
            serVal.k = "";
          }
          if (null === serVal.v) {
            cc.warn("Invalid map value");
            serVal.v = "";
          }
          result.push(serVal);
        });
        return result;
      };
      JsonMessage.prototype.decode = function(data) {
        if (data) {
          this.buffer = data;
          var result = Message_1.Utf8ArrayToStr(data);
          if (result.length > 0) try {
            this.data = JSON.parse(result);
          } catch (error) {
            return false;
          }
          return this.deserialize(this.data);
        }
        return false;
      };
      JsonMessage.prototype.deserialize = function(data) {
        var __serializeInfo = Reflect.getPrototypeOf(this)["__serialize__"];
        if (!__serializeInfo) return true;
        var serializeKeyList = Object.keys(__serializeInfo);
        for (var len = serializeKeyList.length, i = 0; i < len; i++) {
          var serializeKey = serializeKeyList[i];
          var _a = __serializeInfo[serializeKey], memberName = _a[0], memberType = _a[1], arrOrmapKeyType = _a[2], mapValType = _a[3];
          var iscomplete = this.deserializeMember(memberName, memberType, arrOrmapKeyType, mapValType, data[serializeKey]);
          if (!iscomplete) {
            cc.warn("Invalid deserialize member :" + memberName);
            return false;
          }
        }
        return true;
      };
      JsonMessage.prototype.deserializeMember = function(memberName, memberType, arrOrmapKeyType, mapValType, value) {
        try {
          var originValue = this[memberName];
          if ("number" === typeof originValue) this[memberName] = this.deserializeNumber(memberName, value); else if ("string" === typeof originValue) this[memberName] = this.deserializeString(memberName, value); else if (originValue instanceof Array) this.deserializeArray(memberName, arrOrmapKeyType, value); else if (originValue instanceof Map) this.deserializeMap(memberName, arrOrmapKeyType, mapValType, value); else if (originValue instanceof JsonMessage) originValue.deserialize(value); else {
            if (null !== originValue) {
              cc.warn("Invalid deserialize member : " + memberName + " value:" + originValue);
              return false;
            }
            switch (memberType) {
             case Number:
              this[memberName] = this.deserializeNumber(memberName, value);
              break;

             case String:
              this[memberName] = this.deserializeString(memberName, value);
              break;

             case Array:
              this[memberName] = [];
              break;

             case Map:
              this[memberName] = new Map();
              break;

             default:
              this[memberName] = new memberType();
              if (!(this[memberName] instanceof JsonMessage)) {
                cc.warn("Invalid deserialize member :" + memberName + " value:" + originValue);
                return false;
              }
              this[memberName].deserialize(value);
            }
          }
          return true;
        } catch (error) {
          cc.warn(error.message);
          this[memberName] = error.data || null;
          return false;
        }
      };
      JsonMessage.prototype.deserializeNumber = function(memberName, value) {
        if (null === value || void 0 === value || NaN === value) throw {
          message: "Invalid deserializeNumber member : " + memberName + " value : " + value,
          data: 0
        };
        return Number(value);
      };
      JsonMessage.prototype.deserializeString = function(memberName, value) {
        if (null === value || void 0 === value) throw {
          message: "Invalid deserializeString member : " + memberName + " value : " + value,
          data: ""
        };
        return value;
      };
      JsonMessage.prototype.deserializeArray = function(memberName, valueType, value) {
        var _this = this;
        if (!(value instanceof Array)) throw {
          message: "Invalid deserializeArray member : " + memberName + " value : " + value,
          data: []
        };
        this[memberName] = [];
        value.forEach(function(element, i) {
          if (valueType === Number) _this[memberName].push(_this.deserializeNumber(memberName + "[" + i + "]", element)); else if (valueType === String) _this[memberName].push(_this.deserializeString(memberName + "[" + i + "]", element)); else {
            if (valueType === Array) throw {
              message: "Invalid deserializeArray member : " + memberName + " array value type is Array"
            };
            if (valueType instanceof Map) throw {
              message: "Invalid deserializeArray member : " + memberName + " array value type is Map"
            };
            if (_this[memberName] instanceof JsonMessage) _this[memberName].deserialize(element); else {
              var elementObj = new valueType();
              if (!(elementObj instanceof JsonMessage)) throw {
                message: "Invalid deserializeArray member : " + memberName + " array value type is " + valueType
              };
              elementObj.deserialize(element);
              _this[memberName].push(elementObj);
            }
          }
        });
      };
      JsonMessage.prototype.deserializeMap = function(memberName, keyType, valueType, value) {
        var _this = this;
        if (!(value instanceof Array)) throw {
          message: "Invalid deserializeMap member : " + memberName + " value : " + value,
          data: new Map()
        };
        this[memberName].clear();
        value.forEach(function(element, i) {
          if (null === element || void 0 === element.k || null === element.k || void 0 === element.v || null === element.v) throw {
            message: "Invalid deserializeMap member : " + memberName + " invalid element : " + element
          };
          var elementKey;
          if (keyType === Number) elementKey = _this.deserializeNumber(memberName + "[" + i + "]:key", element.k); else {
            if (keyType !== String) throw {
              message: "Invalid deserializeMap member : " + memberName + " invalid key type : " + keyType
            };
            elementKey = _this.deserializeString(memberName + "[" + i + "]:key", element.k);
          }
          var elementValue;
          if (valueType === Number) elementValue = _this.deserializeNumber(memberName + "[" + i + "]:value", element.v); else if (valueType === String) elementValue = _this.deserializeString(memberName + "[" + i + "]:value", element.v); else {
            if (valueType === Array) throw {
              message: "Invalid deserializeMap member : " + memberName + " invalid value type : Array"
            };
            if (valueType instanceof Map) throw {
              message: "Invalid deserializeMap member : " + memberName + " invalid value type : Map"
            };
            elementValue = new valueType();
            if (!(elementValue instanceof JsonMessage)) throw {
              message: "Invalid deserializeMap member : " + memberName + " invalid value type : " + valueType
            };
            elementValue.deserialize(element.v);
          }
          _this[memberName].set(elementKey, elementValue);
        });
      };
      return JsonMessage;
    }(Message_1.Message);
    exports.JsonMessage = JsonMessage;
    var JsonMessageHeader = function(_super) {
      __extends(JsonMessageHeader, _super);
      function JsonMessageHeader() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      return JsonMessageHeader;
    }(Message_1.MessageHeader);
    exports.JsonMessageHeader = JsonMessageHeader;
    cc._RF.pop();
  }, {
    "./Message": "Message",
    buffer: 2
  } ],
  LanguageEN: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68bedXgXqhAR6OQN4AqyK+p", "LanguageEN");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LanguageEN = void 0;
    exports.LanguageEN = {
      language: cc.sys.LANGUAGE_ENGLISH,
      alert_title: "Tips",
      alert_confirm: "Confirm",
      alert_cancel: "Cancel",
      updating: "Updating",
      updateFaild: "Update {0} Faild",
      updatingtips: [ "\u4eba\u5bb6\u6b63\u5728\u52aa\u529b\u52a0\u8f7d\u4e2d\u5662~", "\u5bf9\u5c40\u4e2d\u724c\u7684\u987a\u5e8f\u90fd\u662f\u968f\u673a\u7684\uff0c\u4e0d\u7528\u62c5\u5fc3\u88ab\u4eba\u731c\u4e2d\uff01", "\u542c\u8bf4\u4e0b\u96e8\u5929\u66f4\u9002\u5408\u6253\u724c\u54df~~~", "\u4e09\u4e94\u597d\u53cb\uff0c\u4e00\u8d77\u76f8\u7ea6\u6765\u201c\u6597\u5730\u4e3b\u201d~" ],
      newVersion: "A new version is detected, do you want to update?",
      noFindManifest: "No find Manifest!!!",
      downloadFailManifest: "Download Fail Manifest!!!",
      manifestError: "Manifest decode error!!!",
      checkingUpdate: "Checking update...",
      newVersionForBundle: "\u68c0\u6d4b\u5230{0}\u6709\u65b0\u7684\u7248\u672c\uff0c\u662f\u5426\u66f4\u65b0?",
      alreadyRemoteVersion: "{0}\u5df2\u5347\u7ea7\u5230\u6700\u65b0",
      hall: "hall",
      reconnect: "Reconnect ... ",
      warningReconnect: "{0}\u7f51\u7edc\u5df2\u65ad\u5f00\uff0c\u662f\u5426\u91cd\u65b0\u8fde\u63a5\uff1f",
      tryReconnect: "{0}\u7f51\u7edc:\u6b63\u5728\u5c1d\u8bd5\u7b2c{1}\u6b21\u8fde\u63a5...",
      quitGame: "\u60a8\u786e\u5b9a\u8981\u9000\u51fa\u6e38\u620f\uff1f"
    };
    cc._RF.pop();
  }, {} ],
  LanguageImpl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d4760sSVC1OF61w5itElGvR", "LanguageImpl");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LanguageImpl = exports.i18n = void 0;
    var LanguageZH_1 = require("./LanguageZH");
    var LanguageEN_1 = require("./LanguageEN");
    exports.i18n = LanguageZH_1.LanguageZH;
    var LanguageImpl = function() {
      function LanguageImpl() {}
      LanguageImpl.Instance = function() {
        return this._instance || (this._instance = new LanguageImpl());
      };
      LanguageImpl.prototype.data = function(language) {
        exports.i18n = LanguageZH_1.LanguageZH;
        language && language == LanguageEN_1.LanguageEN.language && (exports.i18n = LanguageEN_1.LanguageEN);
        return exports.i18n;
      };
      LanguageImpl._instance = null;
      return LanguageImpl;
    }();
    exports.LanguageImpl = LanguageImpl;
    cc._RF.pop();
  }, {
    "./LanguageEN": "LanguageEN",
    "./LanguageZH": "LanguageZH"
  } ],
  LanguageZH: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "17894YfmvRGcaBN7+o1yulR", "LanguageZH");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LanguageZH = void 0;
    exports.LanguageZH = {
      language: cc.sys.LANGUAGE_CHINESE,
      alert_title: "\u6e29\u99a8\u63d0\u793a",
      alert_confirm: "\u786e \u5b9a",
      alert_cancel: "\u53d6 \u6d88",
      updating: "\u6b63\u5728\u66f4\u65b0...",
      updateFaild: "\u66f4\u65b0{0}\u5931\u8d25",
      updatingtips: [ "\u4eba\u5bb6\u6b63\u5728\u52aa\u529b\u52a0\u8f7d\u4e2d\u5662~", "\u5bf9\u5c40\u4e2d\u724c\u7684\u987a\u5e8f\u90fd\u662f\u968f\u673a\u7684\uff0c\u4e0d\u7528\u62c5\u5fc3\u88ab\u4eba\u731c\u4e2d\uff01", "\u542c\u8bf4\u4e0b\u96e8\u5929\u66f4\u9002\u5408\u6253\u724c\u54df~~~", "\u4e09\u4e94\u597d\u53cb\uff0c\u4e00\u8d77\u76f8\u7ea6\u6765\u201c\u6597\u5730\u4e3b\u201d~" ],
      newVersion: "\u68c0\u6d4b\u5230\u6709\u65b0\u7684\u7248\u672c\uff0c\u662f\u5426\u66f4\u65b0?",
      noFindManifest: "\u627e\u4e0d\u5230\u7248\u672c\u6587\u4ef6!!!",
      downloadFailManifest: "\u4e0b\u8f7d\u7248\u672c\u6587\u4ef6\u5931\u8d25!",
      manifestError: "\u7248\u672c\u6587\u4ef6\u89e3\u6790\u9519\u8bef!",
      checkingUpdate: "\u68c0\u6d4b\u66f4\u65b0\u4e2d...",
      newVersionForBundle: "\u68c0\u6d4b\u5230{0}\u6709\u65b0\u7684\u7248\u672c\uff0c\u662f\u5426\u66f4\u65b0?",
      alreadyRemoteVersion: "{0}\u5df2\u5347\u7ea7\u5230\u6700\u65b0",
      hall: "\u5927\u5385",
      reconnect: "\u6b63\u5728\u91cd\u8fde...",
      warningReconnect: "{0}\u7f51\u7edc\u5df2\u65ad\u5f00\uff0c\u662f\u5426\u91cd\u65b0\u8fde\u63a5\uff1f",
      tryReconnect: "{0}\u7f51\u7edc:\u6b63\u5728\u5c1d\u8bd5\u7b2c{1}\u6b21\u8fde\u63a5...",
      quitGame: "\u60a8\u786e\u5b9a\u8981\u9000\u51fa\u6e38\u620f\uff1f"
    };
    cc._RF.pop();
  }, {} ],
  Language: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9dd04SnyLlDxaxIql2b+JXA", "Language");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Language = void 0;
    var EventApi_1 = require("../event/EventApi");
    var Defines_1 = require("./Defines");
    var Framework_1 = require("../Framework");
    var LANG_KEY = "using_language";
    var Language = function() {
      function Language() {
        this._data = {
          language: "unknown"
        };
      }
      Language.Instance = function() {
        return this._instance || (this._instance = new Language());
      };
      Object.defineProperty(Language.prototype, "delegate", {
        get: function() {
          return this._delegate;
        },
        set: function(value) {
          this._delegate = value;
          this.change(this.getLanguage());
        },
        enumerable: false,
        configurable: true
      });
      Language.prototype.change = function(language) {
        if (!this.delegate) return;
        if (this._data && this._data.language == language) return;
        if (Defines_1.ENABLE_CHANGE_LANGUAGE) {
          this._data = this.delegate.data(language);
          dispatch(EventApi_1.EventApi.CHANGE_LANGUAGE, language);
        } else this._data = this.delegate.data(this.getLanguage());
        Framework_1.Manager.localStorage.setItem(LANG_KEY, this._data.language);
      };
      Language.prototype.get = function(args) {
        var result = "";
        do {
          if (!!!args) break;
          if (args.length < 1) break;
          var keyString = args[0];
          if ("string" != typeof keyString) {
            cc.error("key error");
            break;
          }
          if (!(keyString.indexOf(Defines_1.USING_LAN_KEY) > -1)) {
            keyString = args.shift();
            return String.format(keyString, args);
          }
          var keys = keyString.split(".");
          if (keys.length < 2) {
            cc.error("key error");
            break;
          }
          keys.shift();
          args.shift();
          result = this._data[keys[0]];
          if (!result) {
            cc.error("\u8bed\u8a00\u5305\u4e0d\u5b58\u5728 : " + keyString);
            break;
          }
          var i = 1;
          for (;i < keys.length; i++) {
            if (void 0 == result[keys[i]]) break;
            result = result[keys[i]];
          }
          i != keys.length && cc.error("\u8bed\u8a00\u5305\u4e0d\u5b58\u5728 : " + keyString);
          result = String.format(result, args);
        } while (0);
        return result;
      };
      Language.prototype.getLanguage = function() {
        return Framework_1.Manager.localStorage.getItem(LANG_KEY, cc.sys.LANGUAGE_CHINESE);
      };
      Language._instance = null;
      return Language;
    }();
    exports.Language = Language;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "../event/EventApi": "EventApi",
    "./Defines": "Defines"
  } ],
  Loading: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bb305D9F5lGI6TgHkSWfCvt", "Loading");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Manager_1 = require("../manager/Manager");
    var EventApi_1 = require("../../framework/event/EventApi");
    var Config_1 = require("../config/Config");
    var Defines_1 = require("../../framework/base/Defines");
    var Loading = function() {
      function Loading() {
        this._node = null;
        this._isWaitingHide = false;
        this._isLoadingPrefab = false;
        this._timeOutCb = null;
        this._content = [];
        this._showContentIndex = 0;
        this._timerId = -1;
        this._text = null;
        Manager_1.Manager.eventDispatcher.addEventListener(EventApi_1.EventApi.AdaptScreenEvent, this.onAdaptScreen, this);
      }
      Loading.Instance = function() {
        return this._instance || (this._instance = new Loading());
      };
      Loading.prototype.onAdaptScreen = function() {
        Manager_1.Manager.resolutionHelper.fullScreenAdapt(this._node);
      };
      Object.defineProperty(Loading.prototype, "timeOutCb", {
        get: function() {
          return this._timeOutCb;
        },
        set: function(value) {
          this._timeOutCb = value;
        },
        enumerable: false,
        configurable: true
      });
      Loading.prototype.preLoadPrefab = function() {
        this.loadPrefab();
      };
      Loading.prototype.show = function(content, timeOutCb, timeout) {
        void 0 === timeout && (timeout = Config_1.Config.LOADING_TIME_OUT);
        this._timeOutCb = timeOutCb;
        if (Array.isArray(content)) this._content = content; else {
          this._content = [];
          this._content.push(content);
        }
        this._show(timeout);
        return this;
      };
      Loading.prototype._show = function(timeout) {
        return __awaiter(this, void 0, void 0, function() {
          var finish;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this._isWaitingHide = false;
              return [ 4, this.loadPrefab() ];

             case 1:
              finish = _a.sent();
              if (finish) {
                Manager_1.Manager.resolutionHelper.fullScreenAdapt(this._node);
                this._node.removeFromParent();
                this._node.parent = Manager_1.Manager.uiManager.getCanvas();
                this._node.zIndex = Config_1.ViewZOrder.Loading;
                this._node.position = cc.Vec3.ZERO;
                this._text = cc.find("content/text", this._node).getComponent(cc.Label);
                this._showContentIndex = 0;
                this.startShowContent();
                if (this._isWaitingHide) {
                  this._isWaitingHide = false;
                  this._node.active = false;
                  return [ 2 ];
                }
                this.startTimeOutTimer(timeout);
                this._node.active = true;
              }
              return [ 2 ];
            }
          });
        });
      };
      Loading.prototype.startShowContent = function() {
        var _this = this;
        if (1 == this._content.length) this._text.string = this._content[0]; else {
          this._text.node.stopAllActions();
          cc.tween(this._text.node).call(function() {
            _this._text.string = _this._content[_this._showContentIndex];
          }).delay(Config_1.Config.LOADING_CONTENT_CHANGE_INTERVAL).call(function() {
            _this._showContentIndex++;
            _this._showContentIndex >= _this._content.length && (_this._showContentIndex = 0);
            _this.startShowContent();
          }).start();
        }
      };
      Loading.prototype.stopShowContent = function() {
        this._text && this._text.node.stopAllActions();
      };
      Loading.prototype.startTimeOutTimer = function(timeout) {
        var _this = this;
        timeout > 0 && (this._timerId = setTimeout(function() {
          _this._timeOutCb && _this._timeOutCb();
          _this.hide();
          _this._isWaitingHide = false;
        }, 1e3 * timeout));
      };
      Loading.prototype.stopTimeOutTimer = function() {
        this._timeOutCb = null;
        clearTimeout(this._timerId);
        this._timerId = -1;
      };
      Loading.prototype.loadPrefab = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolove, reject) {
              if (_this._isLoadingPrefab) {
                cc.warn("\u6b63\u5728\u52a0\u8f7dLoading\u9884\u7f6e\u4f53");
                return;
              }
              if (_this._node) {
                resolove(true);
                return;
              }
              _this._isLoadingPrefab = true;
              Manager_1.Manager.assetManager.load(Defines_1.BUNDLE_RESOURCES, Config_1.Config.CommonPrefabs.loading, cc.Prefab, function(finish, total, item) {}, function(data) {
                _this._isLoadingPrefab = false;
                if (data && data.data && data.data instanceof cc.Prefab) {
                  Manager_1.Manager.assetManager.addPersistAsset(Config_1.Config.CommonPrefabs.loading, data.data, Defines_1.BUNDLE_RESOURCES);
                  _this._node = cc.instantiate(data.data);
                  resolove(true);
                } else resolove(false);
              });
            }) ];
          });
        });
      };
      Loading.prototype.hide = function() {
        this.stopShowContent();
        this.stopTimeOutTimer();
        if (this._node) {
          this._isWaitingHide = true;
          this._node.active = false;
        } else this._isWaitingHide = true;
      };
      Loading._instance = null;
      return Loading;
    }();
    exports.default = Loading;
    cc._RF.pop();
  }, {
    "../../framework/base/Defines": "Defines",
    "../../framework/event/EventApi": "EventApi",
    "../config/Config": "Config",
    "../manager/Manager": "Manager"
  } ],
  LobbyService: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a70853uQHdFyq17JF74OVGc", "LobbyService");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LobbyService = void 0;
    var CommonService_1 = require("./CommonService");
    var LobbyService = function(_super) {
      __extends(LobbyService, _super);
      function LobbyService() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.serviceName = "\u5927\u5385";
        _this.ip = "echo.websocket.org";
        return _this;
      }
      Object.defineProperty(LobbyService, "instance", {
        get: function() {
          return this._instance || (this._instance = new LobbyService());
        },
        enumerable: false,
        configurable: true
      });
      return LobbyService;
    }(CommonService_1.CommonService);
    exports.LobbyService = LobbyService;
    cc._RF.pop();
  }, {
    "./CommonService": "CommonService"
  } ],
  LocalStorage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6b21dZgaiRM4Icrn82GhezL", "LocalStorage");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LocalStorage = void 0;
    var BitEncrypt_1 = require("../extentions/BitEncrypt");
    var LocalStorage = function() {
      function LocalStorage() {
        this.key = "VuxiAKihQ0VR9WRe";
      }
      LocalStorage.Instance = function() {
        return this._instance || (this._instance = new LocalStorage());
      };
      LocalStorage.prototype.encrypt = function(obj) {
        return BitEncrypt_1.BitEncrypt.encode(JSON.stringify(obj), this.key);
      };
      LocalStorage.prototype.decryption = function(word) {
        return BitEncrypt_1.BitEncrypt.decode(word, this.key);
      };
      LocalStorage.prototype.getItem = function(key, defaultValue) {
        void 0 === defaultValue && (defaultValue = null);
        var value = cc.sys.localStorage.getItem(key);
        if (!value) return defaultValue;
        try {
          var data = this.decryption(value);
          var result = JSON.parse(data);
          return result.type ? result.value : value;
        } catch (error) {
          return value;
        }
      };
      LocalStorage.prototype.setItem = function(key, value) {
        var type = typeof value;
        if ("number" == type || "string" == type || "boolean" == type || "object" == type) {
          var saveObj = {
            type: type,
            value: value
          };
          try {
            var data = this.encrypt(saveObj);
            cc.sys.localStorage.setItem(key, data);
          } catch (error) {
            true;
            cc.error(error);
          }
        } else {
          true;
          cc.error("\u5b58\u50a8\u6570\u636e\u7c7b\u578b\u4e0d\u652f\u6301 \u5f53\u524d\u7684\u5b58\u50a8\u7c7b\u578b: " + type);
        }
      };
      LocalStorage.prototype.removeItem = function(key) {
        cc.sys.localStorage.removeItem(key);
      };
      LocalStorage._instance = null;
      return LocalStorage;
    }();
    exports.LocalStorage = LocalStorage;
    cc._RF.pop();
  }, {
    "../extentions/BitEncrypt": "BitEncrypt"
  } ],
  LogicEvent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb2abAqji1KJZFoYBz4KmuA", "LogicEvent");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LogicEvent = exports.dispatchEnterComplete = exports.LogicType = void 0;
    var LogicType;
    (function(LogicType) {
      LogicType["UNKNOWN"] = "UNKNOWN";
      LogicType["HALL"] = "HALL";
      LogicType["GAME"] = "GAME";
      LogicType["LOGIN"] = "LOGIN";
      LogicType["ROOM_LIST"] = "ROOM_LIST";
    })(LogicType = exports.LogicType || (exports.LogicType = {}));
    function dispatchEnterComplete(data) {
      dispatch(exports.LogicEvent.ENTER_COMPLETE, data);
    }
    exports.dispatchEnterComplete = dispatchEnterComplete;
    exports.LogicEvent = {
      ENTER_COMPLETE: "ENTER_COMPLETE",
      ENTER_HALL: "ENTER_HALL",
      ENTER_GAME: "ENTER_GAME",
      ENTER_LOGIN: "ENTER_LOGIN",
      ENTER_ROOM_LIST: "ENTER_ROOM_LIST"
    };
    cc._RF.pop();
  }, {} ],
  LogicManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dc2c0079ExICL2e4HMg+a06", "LogicManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LogicManager = void 0;
    var LogicEvent_1 = require("../event/LogicEvent");
    var Manager_1 = require("./Manager");
    var LogicManager = function() {
      function LogicManager() {
        this._logTag = "[LogicManager]";
        this._logics = [];
        this._logicTypes = [];
        this.node = null;
      }
      LogicManager.Instance = function() {
        return this._instance || (this._instance = new LogicManager());
      };
      LogicManager.prototype.push = function(logicType) {
        for (var i = 0; i < this._logicTypes.length; i++) if (this._logicTypes[i] == logicType) {
          cc.error(this._logTag, "\u91cd\u590d\u6dfb\u52a0" + cc.js.getClassName(logicType));
          return;
        }
        if (this.node) {
          var logic = new logicType();
          logic.init(this.node);
          this._logics.push(logic);
          logic.onLoad();
        } else this._logicTypes.push(logicType);
      };
      LogicManager.prototype.onLoad = function(node) {
        this.node = node;
        Manager_1.Manager.eventDispatcher.addEventListener(LogicEvent_1.LogicEvent.ENTER_COMPLETE, this.onEnterComplete, this);
        if (0 == this._logics.length) for (var i = 0; i < this._logicTypes.length; i++) {
          var type = this._logicTypes[i];
          cc.log(this._logTag, "\u6dfb\u52a0Logic : " + cc.js.getClassName(type));
          var logic = new type();
          logic.init(node);
          this._logics.push(logic);
        }
        this._logics.forEach(function(data) {
          data.onLoad();
        });
      };
      LogicManager.prototype.onDestroy = function(node) {
        Manager_1.Manager.eventDispatcher.removeEventListener(LogicEvent_1.LogicEvent.ENTER_COMPLETE, this);
        this._logics.forEach(function(data) {
          data.onDestroy();
        });
      };
      LogicManager.prototype.onEnterComplete = function(data) {
        if (data.type != LogicEvent_1.LogicType.ROOM_LIST) {
          data && data.views && data.views.length > 0 && Manager_1.Manager.uiManager.closeExcept(data.views);
          for (var i = 0; i < this._logics.length; i++) {
            var logic = this._logics[i];
            logic && logic.onEnterComplete(data);
          }
          data.type == LogicEvent_1.LogicType.HALL ? Manager_1.Manager.bundleManager.removeLoadedGamesBundle() : data.type == LogicEvent_1.LogicType.LOGIN && Manager_1.Manager.bundleManager.removeLoadedBundle();
        }
      };
      LogicManager._instance = null;
      return LogicManager;
    }();
    exports.LogicManager = LogicManager;
    cc._RF.pop();
  }, {
    "../event/LogicEvent": "LogicEvent",
    "./Manager": "Manager"
  } ],
  Logic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aef19i0aeFBvY497I6IWj/K", "Logic");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Logic = void 0;
    var LogicEvent_1 = require("../event/LogicEvent");
    var EventComponent_1 = require("../../framework/base/EventComponent");
    var Defines_1 = require("../../framework/base/Defines");
    var ResourceLoader_1 = require("../../framework/assetManager/ResourceLoader");
    var EventApi_1 = require("../../framework/event/EventApi");
    var Config_1 = require("../config/Config");
    var Manager_1 = require("../manager/Manager");
    var Logic = function(_super) {
      __extends(Logic, _super);
      function Logic() {
        var _this = _super.call(this) || this;
        _this.logTag = "[Logic]";
        _this._loader = null;
        _this.logicType = LogicEvent_1.LogicType.UNKNOWN;
        _this._loader = new ResourceLoader_1.default();
        _this._loader.getLoadResources = _this.getLoadResources.bind(_this);
        _this._loader.onLoadComplete = _this.onLoadResourceComplete.bind(_this);
        _this._loader.onLoadProgress = _this.onLoadResourceProgress.bind(_this);
        return _this;
      }
      Logic.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        Defines_1.ENABLE_CHANGE_LANGUAGE && this.registerEvent(EventApi_1.EventApi.CHANGE_LANGUAGE, this.onLanguageChange);
      };
      Object.defineProperty(Logic.prototype, "bundle", {
        get: function() {
          cc.error("\u8bf7\u5b50\u7c7b\u91cd\u5199protected get bundle,\u8fd4\u56de\u6e38\u620f\u7684\u5305\u540d,\u5373 asset bundle name");
          return "";
        },
        enumerable: false,
        configurable: true
      });
      Logic.prototype.onEnterComplete = function(data) {};
      Logic.prototype.onLanguageChange = function() {
        Manager_1.Manager.gameData && Manager_1.Manager.gameData.onLanguageChange();
      };
      Logic.prototype.init = function(data) {
        this.logicType == LogicEvent_1.LogicType.UNKNOWN && cc.error("\u672a\u5bf9\u6b63\u786e\u7684\u5bf9logicType\u8d4b\u503c");
        this.node = data;
      };
      Logic.prototype.onLoad = function() {
        this.bundle ? Config_1.Config.assetBundle["" + this.bundle] = this.bundle : cc.error("\u8bf7\u5b50\u7c7b\u91cd\u5199protected get bundle,\u8fd4\u56de\u6e38\u620f\u7684\u5305\u540d,\u5373 asset bundle name");
        _super.prototype.onLoad.call(this);
      };
      Logic.prototype.onDestroy = function() {
        _super.prototype.onDestroy.call(this);
        this.node = null;
      };
      Logic.prototype.getLoadResources = function() {
        return [];
      };
      Logic.prototype.onLoadResourceComplete = function(err) {};
      Logic.prototype.onLoadResourceProgress = function(loadedCount, total, data) {};
      Logic.prototype.getNetControllerType = function() {
        return null;
      };
      Logic.prototype.removeNetComponent = function() {
        var type = this.getNetControllerType();
        if (type && this.node.getComponent(type)) {
          this.node.removeComponent(type);
          Manager_1.Manager.gameController = null;
        }
      };
      Logic.prototype.addNetComponent = function() {
        var type = this.getNetControllerType();
        if (type) {
          var controller = this.node.getComponent(type);
          controller || (controller = this.node.addComponent(type));
          Manager_1.Manager.gameController = controller;
          return controller;
        }
        return null;
      };
      return Logic;
    }(EventComponent_1.default);
    exports.Logic = Logic;
    cc._RF.pop();
  }, {
    "../../framework/assetManager/ResourceLoader": "ResourceLoader",
    "../../framework/base/Defines": "Defines",
    "../../framework/base/EventComponent": "EventComponent",
    "../../framework/event/EventApi": "EventApi",
    "../config/Config": "Config",
    "../event/LogicEvent": "LogicEvent",
    "../manager/Manager": "Manager"
  } ],
  LoginLogic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eec4335VctGoaU79hCdomOI", "LoginLogic");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Logic_1 = require("../common/base/Logic");
    var LogicEvent_1 = require("../common/event/LogicEvent");
    var Config_1 = require("../common/config/Config");
    var Manager_1 = require("../common/manager/Manager");
    var LoginView_1 = require("./view/LoginView");
    var Defines_1 = require("../framework/base/Defines");
    var HotUpdate_1 = require("../common/base/HotUpdate");
    var DownloadLoading_1 = require("../common/component/DownloadLoading");
    var LanguageImpl_1 = require("../common/language/LanguageImpl");
    var LoginLogic = function(_super) {
      __extends(LoginLogic, _super);
      function LoginLogic() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.logicType = LogicEvent_1.LogicType.LOGIN;
        return _this;
      }
      LoginLogic.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(LogicEvent_1.LogicEvent.ENTER_LOGIN, this.onEnterLogin);
      };
      Object.defineProperty(LoginLogic.prototype, "bundle", {
        get: function() {
          return Defines_1.BUNDLE_RESOURCES;
        },
        enumerable: false,
        configurable: true
      });
      LoginLogic.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.onEnterLogin();
      };
      LoginLogic.prototype.onEnterLogin = function(data) {
        cc.log("--------------onEnterLogin--------------");
        Manager_1.Manager.loading.show(LanguageImpl_1.i18n.checkingUpdate);
        HotUpdate_1.HotUpdate.checkHallUpdate(function(code, state) {
          if (code == HotUpdate_1.AssetManagerCode.NEW_VERSION_FOUND || state == HotUpdate_1.AssetManagerState.TRY_DOWNLOAD_FAILED_ASSETS) {
            cc.log("\u63d0\u793a\u66f4\u65b0");
            Manager_1.Manager.loading.hide();
            Manager_1.Manager.alert.show({
              text: LanguageImpl_1.i18n.newVersion,
              confirmCb: function(isOK) {
                isOK ? Manager_1.Manager.uiManager.open({
                  type: DownloadLoading_1.default,
                  zIndex: Config_1.ViewZOrder.UI,
                  args: [ state, LanguageImpl_1.i18n.hall ]
                }) : cc.game.end();
              }
            });
          } else if (code == HotUpdate_1.AssetManagerCode.ALREADY_UP_TO_DATE) {
            cc.log("\u5df2\u7ecf\u662f\u6700\u65b0\u7248\u672c");
            Manager_1.Manager.loading.hide();
          } else if (code == HotUpdate_1.AssetManagerCode.ERROR_DOWNLOAD_MANIFEST || code == HotUpdate_1.AssetManagerCode.ERROR_NO_LOCAL_MANIFEST || code == HotUpdate_1.AssetManagerCode.ERROR_PARSE_MANIFEST) {
            Manager_1.Manager.loading.hide();
            var content = LanguageImpl_1.i18n.downloadFailManifest;
            code == HotUpdate_1.AssetManagerCode.ERROR_NO_LOCAL_MANIFEST ? content = LanguageImpl_1.i18n.noFindManifest : code == HotUpdate_1.AssetManagerCode.ERROR_PARSE_MANIFEST && (content = LanguageImpl_1.i18n.manifestError);
            Manager_1.Manager.tips.show(content);
          } else code == HotUpdate_1.AssetManagerCode.CHECKING ? cc.log("\u6b63\u5728\u68c0\u6d4b\u66f4\u65b0!!") : cc.log("\u68c0\u6d4b\u66f4\u65b0\u5f53\u524d\u72b6\u6001 code : " + code + " state : " + state);
        });
        Manager_1.Manager.uiManager.open({
          type: LoginView_1.default,
          zIndex: Config_1.ViewZOrder.zero,
          bundle: this.bundle
        });
      };
      LoginLogic.prototype.onEnterComplete = function(data) {
        _super.prototype.onEnterComplete.call(this, data);
        data.type == this.logicType && Manager_1.Manager.serviceManager.close();
      };
      return LoginLogic;
    }(Logic_1.Logic);
    Manager_1.Manager.logicManager.push(LoginLogic);
    cc._RF.pop();
  }, {
    "../common/base/HotUpdate": "HotUpdate",
    "../common/base/Logic": "Logic",
    "../common/component/DownloadLoading": "DownloadLoading",
    "../common/config/Config": "Config",
    "../common/event/LogicEvent": "LogicEvent",
    "../common/language/LanguageImpl": "LanguageImpl",
    "../common/manager/Manager": "Manager",
    "../framework/base/Defines": "Defines",
    "./view/LoginView": "LoginView"
  } ],
  LoginView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "70f72G0TFhBn7yKDYJo+teY", "LoginView");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UIView_1 = require("../../framework/ui/UIView");
    var Manager_1 = require("../../common/manager/Manager");
    var HotUpdate_1 = require("../../common/base/HotUpdate");
    var LogicEvent_1 = require("../../common/event/LogicEvent");
    var Config_1 = require("../../common/config/Config");
    var DownloadLoading_1 = require("../../common/component/DownloadLoading");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LoginView = function(_super) {
      __extends(LoginView, _super);
      function LoginView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._login = null;
        return _this;
      }
      LoginView.getPrefabUrl = function() {
        return "login/prefabs/LoginView";
      };
      LoginView.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this._login = cc.find("login", this.node);
        this._login.on(cc.Node.EventType.TOUCH_END, function() {
          Manager_1.Manager.bundleManager.enterBundle(new HotUpdate_1.BundleConfig("\u5927\u5385", Config_1.Config.BUNDLE_HALL, 0, LogicEvent_1.LogicEvent.ENTER_HALL, true));
        });
        LogicEvent_1.dispatchEnterComplete({
          type: LogicEvent_1.LogicType.LOGIN,
          views: [ this, DownloadLoading_1.default ]
        });
      };
      LoginView = __decorate([ ccclass ], LoginView);
      return LoginView;
    }(UIView_1.default);
    exports.default = LoginView;
    cc._RF.pop();
  }, {
    "../../common/base/HotUpdate": "HotUpdate",
    "../../common/component/DownloadLoading": "DownloadLoading",
    "../../common/config/Config": "Config",
    "../../common/event/LogicEvent": "LogicEvent",
    "../../common/manager/Manager": "Manager",
    "../../framework/ui/UIView": "UIView"
  } ],
  Log: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b2666lmhPFG6rCsrUUmDtv5", "Log");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Log = exports.LogLevel = void 0;
    var LogLevel;
    (function(LogLevel) {
      LogLevel[LogLevel["LOG"] = 1] = "LOG";
      LogLevel[LogLevel["DUMP"] = 16] = "DUMP";
      LogLevel[LogLevel["WARN"] = 256] = "WARN";
      LogLevel[LogLevel["ERROR"] = 4096] = "ERROR";
      LogLevel[LogLevel["ALL"] = 4369] = "ALL";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    var _Log = function() {
      function _Log() {
        this._level = LogLevel.ALL;
        this._forceNativeLog = false;
      }
      Object.defineProperty(_Log.prototype, "logLevel", {
        get: function() {
          return this._level;
        },
        set: function(value) {
          this._level = value;
          this.bindLogHandler();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Log.prototype, "forceNativeLog", {
        get: function() {
          return this._forceNativeLog;
        },
        set: function(value) {
          this._forceNativeLog = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Log.prototype, "isUsingConsole", {
        get: function() {
          var win = window;
          if (win.vConsole) return true;
          return false;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Log.prototype, "isDebug", {
        get: function() {
          if (this.isUsingConsole) return true;
          if (cc.sys.isNative && this.forceNativeLog) return true;
          return true;
        },
        enumerable: false,
        configurable: true
      });
      _Log.prototype._bindLogHanler = function(usingCustom) {
        if (usingCustom) {
          console.log("--------using custom log--------");
          var backupcc = window["cc"];
          backupcc.dump || (window["cc"].dump = this.dump.bind(this));
          cc.log = this.log.bind(this);
          cc.warn = this.warn.bind(this);
          cc.error = this.error.bind(this);
          if (this.logLevel & LogLevel.LOG && this.isDebug) {
            window["cc"].time = console.time;
            window["cc"].timeEnd = console.timeEnd;
          } else {
            window["cc"].time = this.doNothing.bind(this);
            window["cc"].timeEnd = this.doNothing.bind(this);
          }
        } else {
          console.log("--------using default log--------");
          if (this.logLevel & LogLevel.DUMP) {
            var backupcc = window["cc"];
            backupcc.dump || (window["cc"].dump = this.dump.bind(this));
          } else cc.dump = this.doNothing.bind(this);
          this.logLevel & LogLevel.WARN || (cc.warn = this.doNothing.bind(this));
          if (this.logLevel & LogLevel.LOG && this.isDebug) {
            window["cc"].time = console.time;
            window["cc"].timeEnd = console.timeEnd;
          } else {
            window["cc"].time = this.doNothing.bind(this);
            window["cc"].timeEnd = this.doNothing.bind(this);
          }
        }
      };
      _Log.prototype.bindLogHandler = function() {
        if (this.isUsingConsole) this._bindLogHanler(true); else if (cc.sys.isMobile) {
          console.log("--------isMobile-----------");
          this._bindLogHanler(true);
        } else {
          console.log("--------other------os-----" + cc.sys.os);
          console.log("isdebug : true");
          this._bindLogHanler(false);
        }
      };
      _Log.prototype.log = function() {
        if (this.logLevel & LogLevel.LOG) {
          if (!this.isDebug) return;
          var backupLog = console.log || cc.log || window["log"];
          backupLog.call(_Log, this.getDateString() + " INFO : " + cc.js.formatStr.apply(cc, arguments), this.stack());
        }
      };
      _Log.prototype.dump = function() {
        if (this.logLevel & LogLevel.DUMP) {
          if (!this.isDebug) return;
          var ret = this._dump(arguments[0], arguments[1], arguments[2], arguments[4]);
          var backupLog = console.info || cc.log || window["info"];
          backupLog.call(_Log, this.getDateString() + " DUMP : " + cc.js.formatStr.apply(cc, [ ret ]), this.stack());
        }
      };
      _Log.prototype.warn = function() {
        if (this.logLevel & LogLevel.WARN) {
          if (!this.isDebug) return;
          var backupLog = console.warn || cc.warn || window["warn"];
          backupLog.call(_Log, this.getDateString() + " WARN : " + cc.js.formatStr.apply(cc, arguments), this.stack());
        }
      };
      _Log.prototype.error = function() {
        if (this.logLevel & LogLevel.ERROR) {
          if (!this.isDebug) return;
          if (cc.sys.isNative) try {
            var backupLog = console.log || cc.log || window["log"];
            backupLog.call(_Log, this.getDateString() + " ERROR : " + cc.js.formatStr.apply(cc, arguments), this.stack());
          } catch (error) {
            console.log("---error---");
            console.error(error);
          } else {
            var backupLog = console.error || cc.error || window["error"];
            backupLog.call(_Log, this.getDateString() + " ERROR : " + cc.js.formatStr.apply(cc, arguments), this.stack());
          }
        }
      };
      _Log.prototype.getDateString = function() {
        var d = new Date();
        var str = d.getHours() + "";
        var timeStr = "";
        timeStr += (1 === str.length ? "0" + str : str) + ":";
        str = d.getMinutes() + "";
        timeStr += (1 === str.length ? "0" + str : str) + ":";
        str = d.getSeconds() + "";
        timeStr += (1 === str.length ? "0" + str : str) + ".";
        str = d.getMilliseconds() + "";
        1 === str.length && (str = "00" + str);
        2 === str.length && (str = "0" + str);
        timeStr += str;
        timeStr = "[" + timeStr + "]";
        return timeStr;
      };
      _Log.prototype.stack = function() {
        var e = new Error();
        var lines = e.stack.split("\n");
        lines.shift();
        var result = [];
        lines.forEach(function(line) {
          var _a;
          line = line.substring(7);
          var lineBreak = line.split(" ");
          lineBreak.length < 2 ? result.push(lineBreak[0]) : result.push((_a = {}, _a[lineBreak[0]] = lineBreak[1], 
          _a));
        });
        if (result.length > 2) {
          var temp = "\n" + JSON.stringify(result[2]);
          return temp;
        }
        var temp = "";
        return temp;
      };
      _Log.prototype._dump = function(var_value, var_name, level, indent_by) {
        void 0 === var_name && (var_name = "unkown_dump_name");
        void 0 === level && (level = 2);
        void 0 === indent_by && (indent_by = 0);
        if (level < 0) return "...";
        indent_by += 3;
        var self = this;
        var do_boolean = function(v) {
          return "Boolean(1) " + (v ? "TRUE" : "FALSE");
        };
        var do_number = function(v) {
          return v;
        };
        var do_string = function(v) {
          return '"' + v + '"';
        };
        var do_object = function(v) {
          if (null === v) return "NULL(0)";
          var out = "";
          var num_elem = 0;
          var indent = "";
          if (v instanceof Array) {
            num_elem = v.length;
            for (var d = 0; d < indent_by; ++d) indent += " ";
            out = "Array(" + num_elem + ") " + (0 === indent.length, "") + "[";
            for (var i = 0; i < num_elem; ++i) out += "\n" + (0 === indent.length ? "" : "" + indent) + "   [" + i + "] = " + self._dump(v[i], "", level, indent_by);
            out += "\n" + (0 === indent.length ? "" : "" + indent) + "]";
            return out;
          }
          if (v instanceof Object) {
            for (var d = 0; d < indent_by; ++d) indent += " ";
            out = "{";
            for (var p in v) out += "\n" + (0 === indent.length ? "" : "" + indent) + "   [" + p + "] = " + self._dump(v[p], "", level, indent_by);
            out += "\n" + (0 === indent.length ? "" : "" + indent) + "}";
            return out;
          }
          return "Unknown Object Type!";
        };
        var_name = "undefined" === typeof var_name ? "" : var_name;
        var out = "";
        var v_name = "";
        switch (typeof var_value) {
         case "boolean":
          v_name = var_name.length > 0 ? var_name + " = " : "";
          out += v_name + do_boolean(var_value);
          break;

         case "number":
          v_name = var_name.length > 0 ? var_name + " = " : "";
          out += v_name + do_number(var_value);
          break;

         case "string":
          v_name = var_name.length > 0 ? var_name + " = " : "";
          out += v_name + do_string(var_value);
          break;

         case "object":
          v_name = var_name.length > 0 ? var_name + " => " : "";
          out += v_name + do_object(var_value);
          break;

         case "function":
          v_name = var_name.length > 0 ? var_name + " = " : "";
          out += v_name + "Function";
          break;

         case "undefined":
          v_name = var_name.length > 0 ? var_name + " = " : "";
          out += v_name + "Undefined";
          break;

         default:
          out += v_name + " is unknown type!";
        }
        return out;
      };
      _Log.prototype.doNothing = function() {};
      return _Log;
    }();
    exports.Log = new _Log();
    cc._RF.pop();
  }, {} ],
  MainController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dde8d/ge2NAnZGuIw9sPRZx", "MainController");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../config/Config");
    var Reconnect_1 = require("../net/Reconnect");
    var Manager_1 = require("./Manager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var MainController = function(_super) {
      __extends(MainController, _super);
      function MainController() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._enterBackgroundTime = 0;
        _this.wssCacert = null;
        return _this;
      }
      MainController.prototype.onLoad = function() {
        this.wssCacert && (Manager_1.Manager.wssCacertUrl = this.wssCacert.nativeUrl);
        Manager_1.Manager.resolutionHelper.onLoad(this.node);
        Manager_1.Manager.netManager.onLoad(this.node);
        Manager_1.Manager.hallNetManager.onLoad(this.node);
        Manager_1.Manager.tips.preloadPrefab();
        Manager_1.Manager.uiLoading.preloadPrefab();
        Manager_1.Manager.loading.preLoadPrefab();
        Manager_1.Manager.alert.preLoadPrefab();
        Reconnect_1.Reconnect.preLoadPrefab();
        var showUI = cc.find("showUI", this.node);
        var showNode = cc.find("showNode", this.node);
        var showRes = cc.find("showRes", this.node);
        var showComp = cc.find("showComponent", this.node);
        if (showUI && showNode && showRes && showComp) {
          showUI.zIndex = 9999;
          showNode.zIndex = 9999;
          showRes.zIndex = 9999;
          showComp.zIndex = 9999;
          var isShow = false;
          if (Config_1.Config.isShowDebugButton) {
            isShow = true;
            showUI.on(cc.Node.EventType.TOUCH_END, function() {
              Manager_1.Manager.uiManager.printViews();
            });
            showNode.on(cc.Node.EventType.TOUCH_END, function() {
              Manager_1.Manager.uiManager.printCanvasChildren();
            });
            showRes.on(cc.Node.EventType.TOUCH_END, function() {
              Manager_1.Manager.cacheManager.printCaches();
            });
            showComp.on(cc.Node.EventType.TOUCH_END, function() {
              Manager_1.Manager.uiManager.printComponent();
            });
          }
          showUI.active = isShow;
          showNode.active = isShow;
          showRes.active = isShow;
          showComp.active = isShow;
        }
        cc.game.on(cc.game.EVENT_HIDE, this.onEnterBackground, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onEnterForgeground, this);
        Manager_1.Manager.serviceManager.onLoad();
        Manager_1.Manager.logicManager.onLoad(this.node);
      };
      MainController.prototype.update = function() {
        Manager_1.Manager.serviceManager.update();
        Manager_1.Manager.assetManager.remote.update();
      };
      MainController.prototype.onDestroy = function() {
        Manager_1.Manager.resolutionHelper.onDestroy();
        Manager_1.Manager.netManager.onDestroy(this.node);
        Manager_1.Manager.hallNetManager.onDestroy(this.node);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);
        cc.game.off(cc.game.EVENT_HIDE);
        cc.game.off(cc.game.EVENT_SHOW);
        Manager_1.Manager.serviceManager.onDestroy();
        Manager_1.Manager.logicManager.onDestroy(this.node);
      };
      MainController.prototype.onEnterBackground = function() {
        this._enterBackgroundTime = Date.timeNow();
        cc.log("[MainController]", "onEnterBackground " + this._enterBackgroundTime);
        Manager_1.Manager.globalAudio.onEnterBackground();
        Manager_1.Manager.serviceManager.onEnterBackground();
      };
      MainController.prototype.onEnterForgeground = function() {
        var now = Date.timeNow();
        var inBackgroundTime = now - this._enterBackgroundTime;
        cc.log("[MainController]", "onEnterForgeground " + now + " background total time : " + inBackgroundTime);
        Manager_1.Manager.globalAudio.onEnterForgeground(inBackgroundTime);
        Manager_1.Manager.serviceManager.onEnterForgeground(inBackgroundTime);
      };
      __decorate([ property(cc.Asset) ], MainController.prototype, "wssCacert", void 0);
      MainController = __decorate([ ccclass, menu("manager/MainController") ], MainController);
      return MainController;
    }(cc.Component);
    exports.default = MainController;
    cc._RF.pop();
  }, {
    "../config/Config": "Config",
    "../net/Reconnect": "Reconnect",
    "./Manager": "Manager"
  } ],
  Manager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b461aTzwptH0o6X2ZMDgv+z", "Manager");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Manager = void 0;
    var Framework = require("../../framework/Framework");
    var NetManager_1 = require("./NetManager");
    var LogicManager_1 = require("./LogicManager");
    var GlobalAudio_1 = require("../component/GlobalAudio");
    var Log_1 = require("../../framework/log/Log");
    var Extentions_1 = require("../../framework/extentions/Extentions");
    var CocosExtention_1 = require("../../framework/extentions/CocosExtention");
    var LanguageImpl_1 = require("../language/LanguageImpl");
    var Singleton_1 = require("../../framework/base/Singleton");
    var Defines_1 = require("../../framework/base/Defines");
    var BundleManager_1 = require("./BundleManager");
    var Tips_1 = require("../component/Tips");
    var UILoading_1 = require("../component/UILoading");
    var Alert_1 = require("../component/Alert");
    var Loading_1 = require("../component/Loading");
    var ServiceManager_1 = require("./ServiceManager");
    var _Manager = function(_super) {
      __extends(_Manager, _super);
      function _Manager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._netManager = null;
        _this._hallNetManager = null;
        _this._globalAudio = null;
        _this.gameView = null;
        _this.gameData = null;
        _this.gameController = null;
        return _this;
      }
      Object.defineProperty(_Manager.prototype, "netManager", {
        get: function() {
          this._netManager || (this._netManager = new NetManager_1.NetManager("netManager"));
          return this._netManager;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Manager.prototype, "hallNetManager", {
        get: function() {
          this._hallNetManager || (this._hallNetManager = new NetManager_1.NetManager("hallNetManager"));
          return this._hallNetManager;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Manager.prototype, "serviceManager", {
        get: function() {
          return Singleton_1.getSingleton(ServiceManager_1.ServiceManager);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Manager.prototype, "logicManager", {
        get: function() {
          return Singleton_1.getSingleton(LogicManager_1.LogicManager);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Manager.prototype, "bundleManager", {
        get: function() {
          return Singleton_1.getSingleton(BundleManager_1.BundleManager);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Manager.prototype, "alert", {
        get: function() {
          return Singleton_1.getSingleton(Alert_1.default);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Manager.prototype, "loading", {
        get: function() {
          return Singleton_1.getSingleton(Loading_1.default);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Manager.prototype, "wssCacertUrl", {
        set: function(value) {
          this._wssCacertUrl = value;
          Framework.Manager.wssCacertUrl = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(_Manager.prototype, "globalAudio", {
        get: function() {
          if (this._globalAudio) return this._globalAudio;
          this._globalAudio = this.uiManager.getCanvas().getComponent(GlobalAudio_1.default);
          return this._globalAudio;
        },
        enumerable: false,
        configurable: true
      });
      _Manager.prototype.makeLanguage = function(param, bundle) {
        void 0 === bundle && (bundle = Defines_1.BUNDLE_RESOURCES);
        if ("string" == typeof param) {
          if (bundle) return "" + Defines_1.USING_LAN_KEY + bundle + "." + param;
          return "" + Defines_1.USING_LAN_KEY + param;
        }
        "string" == typeof param[0] && param instanceof Array && (param[0] = bundle ? "" + Defines_1.USING_LAN_KEY + bundle + "." + param[0] : "" + Defines_1.USING_LAN_KEY + param[0]);
        return param;
      };
      _Manager.prototype.getLanguage = function(param, bundle) {
        void 0 === bundle && (bundle = null);
        var key = "";
        if ("string" == typeof param) {
          key = bundle ? "" + Defines_1.USING_LAN_KEY + bundle + "." + param : "" + Defines_1.USING_LAN_KEY + param;
          return this.language.get([ key ]);
        }
        if ("string" == typeof param[0] && param instanceof Array) {
          param[0] = bundle ? "" + Defines_1.USING_LAN_KEY + bundle + "." + param[0] : "" + Defines_1.USING_LAN_KEY + param[0];
          return this.language.get(param);
        }
        cc.error("\u4f20\u5165\u53c2\u6570\u6709\u8bef");
        return "";
      };
      _Manager.prototype.init = function() {
        Log_1.Log.logLevel = Log_1.LogLevel.ERROR | Log_1.LogLevel.LOG | Log_1.LogLevel.WARN | Log_1.LogLevel.DUMP;
        Framework.Manager.tips = Singleton_1.getSingleton(Tips_1.default);
        this.tips = Framework.Manager.tips;
        Framework.Manager.uiLoading = Singleton_1.getSingleton(UILoading_1.default);
        this.uiLoading = Framework.Manager.uiLoading;
        this.resolutionHelper.initBrowserAdaptor();
        Extentions_1.extentionsInit();
        CocosExtention_1.CocosExtentionInit();
        this.language.delegate = Singleton_1.getSingleton(LanguageImpl_1.LanguageImpl);
      };
      return _Manager;
    }(Framework._FramewokManager);
    exports.Manager = new _Manager();
    cc._RF.pop();
  }, {
    "../../framework/Framework": "Framework",
    "../../framework/base/Defines": "Defines",
    "../../framework/base/Singleton": "Singleton",
    "../../framework/extentions/CocosExtention": "CocosExtention",
    "../../framework/extentions/Extentions": "Extentions",
    "../../framework/log/Log": "Log",
    "../component/Alert": "Alert",
    "../component/GlobalAudio": "GlobalAudio",
    "../component/Loading": "Loading",
    "../component/Tips": "Tips",
    "../component/UILoading": "UILoading",
    "../language/LanguageImpl": "LanguageImpl",
    "./BundleManager": "BundleManager",
    "./LogicManager": "LogicManager",
    "./NetManager": "NetManager",
    "./ServiceManager": "ServiceManager"
  } ],
  Message: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5f20bKU7h1JJY2VL032FxV0", "Message");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.MessageHeader = exports.Message = exports.Utf8ArrayToStr = exports.str2ab = exports.ab2str = void 0;
    var Defines_1 = require("../base/Defines");
    var Buffer = require("buffer").Buffer;
    function ab2str(buffer) {
      return new Promise(function(resolve) {
        var b = new Blob([ buffer ]);
        var r = new FileReader();
        r.readAsText(b, "utf-8");
        r.onload = function() {
          resolve(r.result);
        };
      });
    }
    exports.ab2str = ab2str;
    function str2ab(str) {
      return new Promise(function(resolve) {
        var b = new Blob([ str ], {
          type: "text/plain"
        });
        var r = new FileReader();
        r.readAsArrayBuffer(b);
        r.onload = function() {
          resolve(r.result);
        };
      });
    }
    exports.str2ab = str2ab;
    function Utf8ArrayToStr(array) {
      var out, i, len, c;
      var char2, char3;
      out = "";
      len = array.length;
      i = 0;
      while (i < len) {
        c = array[i++];
        switch (c >> 4) {
         case 0:
         case 1:
         case 2:
         case 3:
         case 4:
         case 5:
         case 6:
         case 7:
          out += String.fromCharCode(c);
          break;

         case 12:
         case 13:
          char2 = array[i++];
          out += String.fromCharCode((31 & c) << 6 | 63 & char2);
          break;

         case 14:
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode((15 & c) << 12 | (63 & char2) << 6 | (63 & char3) << 0);
        }
      }
      return out;
    }
    exports.Utf8ArrayToStr = Utf8ArrayToStr;
    var Message = function() {
      function Message() {
        this.mainCmd = 0;
        this.subCmd = 0;
        this.buffer = null;
      }
      Message.prototype.encode = function() {
        return true;
      };
      Message.prototype.decode = function(data) {
        return true;
      };
      return Message;
    }();
    exports.Message = Message;
    var MessageHeader = function() {
      function MessageHeader() {
        this.mainCmd = 0;
        this.subCmd = 0;
        this.buffer = null;
        this._dataSize = 0;
      }
      MessageHeader.prototype.encode = function(msg) {
        this.mainCmd = msg.mainCmd;
        this.subCmd = msg.subCmd;
        this._dataSize = 0;
        var offset = 0;
        var data = null;
        if (msg.buffer) {
          data = Buffer.from(msg.buffer);
          this._dataSize = msg.buffer.length;
        }
        var buffer = new Buffer(this.size);
        if (Defines_1.USING_LITTLE_ENDIAN) {
          buffer.writeUInt32LE(this.mainCmd, offset);
          offset += Uint32Array.BYTES_PER_ELEMENT;
          buffer.writeUInt32LE(this.subCmd, offset);
          offset += Uint32Array.BYTES_PER_ELEMENT;
          buffer.writeUInt32LE(this._dataSize, offset);
          offset += Uint32Array.BYTES_PER_ELEMENT;
        } else {
          buffer.writeUInt32BE(this.mainCmd, offset);
          offset += Uint32Array.BYTES_PER_ELEMENT;
          buffer.writeUInt32BE(this.subCmd, offset);
          offset += Uint32Array.BYTES_PER_ELEMENT;
          buffer.writeUInt32BE(this._dataSize, offset);
          offset += Uint32Array.BYTES_PER_ELEMENT;
        }
        data && data.copy(buffer, this.headerSize);
        var result = buffer;
        this.buffer = result;
        return true;
      };
      MessageHeader.prototype.decode = function(data) {
        var dataView = new DataView(data.buffer);
        var offset = 0;
        this.mainCmd = dataView.getUint32(offset, Defines_1.USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        this.subCmd = dataView.getUint32(offset, Defines_1.USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        this._dataSize = dataView.getUint32(offset, Defines_1.USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        var buffer = dataView.buffer.slice(offset, dataView.buffer.byteLength);
        this.buffer = new Uint8Array(buffer);
        return this._dataSize == this.buffer.length;
      };
      Object.defineProperty(MessageHeader.prototype, "size", {
        get: function() {
          return this._dataSize + this.headerSize;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MessageHeader.prototype, "dataSize", {
        get: function() {
          return this._dataSize;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MessageHeader.prototype, "headerSize", {
        get: function() {
          return 3 * Uint32Array.BYTES_PER_ELEMENT;
        },
        enumerable: false,
        configurable: true
      });
      return MessageHeader;
    }();
    exports.MessageHeader = MessageHeader;
    cc._RF.pop();
  }, {
    "../base/Defines": "Defines",
    buffer: 2
  } ],
  NetHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "602c6tt4jZEtIvDpJlhsfaQ", "NetHelper");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var NetHelper = function() {
      function NetHelper(service) {
        this._service = null;
        this._service = service;
      }
      Object.defineProperty(NetHelper.prototype, "service", {
        get: function() {
          return this._service;
        },
        enumerable: false,
        configurable: true
      });
      return NetHelper;
    }();
    exports.default = NetHelper;
    cc._RF.pop();
  }, {} ],
  NetManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "66c69HMa7REJ56z+Yr2Gqpk", "NetManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.NetManager = void 0;
    var NetManager = function() {
      function NetManager(name) {
        this.name = "";
        this.node = null;
        this.types = [];
        this.name = name;
      }
      NetManager.prototype.onLoad = function(node) {
        this.node = node;
      };
      NetManager.prototype.onDestroy = function(node) {
        this.removeNetControllers();
        this.node = null;
      };
      NetManager.prototype.register = function(controllerType) {
        for (var i = 0; i < this.types.length; i++) if (this.types[i] == controllerType) {
          cc.error(this.name, "\u91cd\u590d\u6dfb\u52a0" + cc.js.getClassName(controllerType));
          return;
        }
        this.types.push(controllerType);
      };
      NetManager.prototype.addNetControllers = function() {
        if (this.node) for (var i = 0; i < this.types.length; i++) {
          var controllerType = this.types[i];
          controllerType && !this.node.getComponent(controllerType) && this.node.addComponent(controllerType);
        }
      };
      NetManager.prototype.removeNetControllers = function() {
        if (this.node) for (var i = 0; i < this.types.length; i++) {
          var controllerType = this.types[i];
          controllerType && this.node.removeComponent(controllerType);
        }
      };
      return NetManager;
    }();
    exports.NetManager = NetManager;
    cc._RF.pop();
  }, {} ],
  Presenter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "48de7tXr/FONYkr7pGrphfq", "Presenter");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Presenter = void 0;
    var Presenter = function() {
      function Presenter() {}
      return Presenter;
    }();
    exports.Presenter = Presenter;
    cc._RF.pop();
  }, {} ],
  ProtoMessage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3e67f1m1qZHcYGmfmN3aQ5S", "ProtoMessage");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ProtoMessageHeader = exports.ProtoMessage = void 0;
    var Message_1 = require("./Message");
    var ProtoMessage = function(_super) {
      __extends(ProtoMessage, _super);
      function ProtoMessage(protoType) {
        var _this = _super.call(this) || this;
        _this.buffer = null;
        _this.type = null;
        _this.data = null;
        if (protoType) {
          _this.type = protoType;
          _this.data = new protoType();
        } else cc.error("\u6ca1\u6709\u6307\u5b9aproto\u6570\u636e\u7c7b\u578b");
        return _this;
      }
      ProtoMessage.prototype.encode = function() {
        this.buffer = this.type.encode(this.data).finish();
        if (this.buffer) return true;
        return false;
      };
      ProtoMessage.prototype.decode = function(data) {
        if (data) {
          this.buffer = data;
          this.data = this.type.decode(this.buffer);
          return true;
        }
        return false;
      };
      return ProtoMessage;
    }(Message_1.Message);
    exports.ProtoMessage = ProtoMessage;
    var ProtoMessageHeader = function(_super) {
      __extends(ProtoMessageHeader, _super);
      function ProtoMessageHeader() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      return ProtoMessageHeader;
    }(Message_1.MessageHeader);
    exports.ProtoMessageHeader = ProtoMessageHeader;
    cc._RF.pop();
  }, {
    "./Message": "Message"
  } ],
  ReconnectComponent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3b185oGQCFMK6rGwKzYZVCz", "ReconnectComponent");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Controller_1 = require("../../framework/controller/Controller");
    var EventApi_1 = require("../../framework/event/EventApi");
    var Config_1 = require("../config/Config");
    var LogicEvent_1 = require("../event/LogicEvent");
    var Manager_1 = require("../manager/Manager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ReconnectComponent = function(_super) {
      __extends(ReconnectComponent, _super);
      function ReconnectComponent() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._connectCount = 0;
        _this._maxConnectCount = 3;
        _this._isDoConnect = false;
        return _this;
      }
      Object.defineProperty(ReconnectComponent.prototype, "logName", {
        get: function() {
          return "[" + cc.js.getClassName(this.service) + "]." + this.logTag;
        },
        enumerable: false,
        configurable: true
      });
      ReconnectComponent.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(LogicEvent_1.LogicEvent.ENTER_COMPLETE, this.enterComplete);
      };
      ReconnectComponent.prototype.enterComplete = function(data) {
        data.type == LogicEvent_1.LogicType.LOGIN && this.service && this.service.reconnect.hide();
      };
      ReconnectComponent.prototype.start = function() {
        cc.log(this.logName + " start");
        this.tryReconnect();
      };
      ReconnectComponent.prototype.tryReconnect = function() {
        this.service && this.service.close();
        this._isDoConnect = true;
        this.delayConnect();
      };
      ReconnectComponent.prototype.delayConnect = function() {
        if (this._isDoConnect) {
          var time = .3;
          if (this._connectCount > 0) {
            time = (this._connectCount + 1) * time;
            time > 3 && (time = 3);
            cc.log("" + this.logName + time + "\u79d2\u540e\u5c1d\u8bd5\u91cd\u65b0\u8fde\u63a5");
          }
          this.scheduleOnce(this.connect, time);
          this._isDoConnect = false;
          this.unschedule(this.connectTimeOut);
          this.scheduleOnce(this.connectTimeOut, Config_1.Config.RECONNECT_TIME_OUT);
        }
      };
      ReconnectComponent.prototype.connect = function() {
        return __awaiter(this, void 0, void 0, function() {
          var loginView;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, Manager_1.Manager.uiManager.getView("LoginView") ];

             case 1:
              loginView = _a.sent();
              if (loginView) {
                this.service.reconnect.hide();
                cc.warn(this.logName + " \u91cd\u8fde\u5904\u4e8e\u767b\u5f55\u754c\u9762\uff0c\u505c\u6b62\u91cd\u8fde");
                return [ 2 ];
              }
              this._isDoConnect = true;
              this._connectCount++;
              if (this._connectCount > this._maxConnectCount) {
                this.showReconnectDialog();
                return [ 2 ];
              }
              this.service.reconnect.showNode(Manager_1.Manager.getLanguage([ "tryReconnect", this.service.serviceName, this._connectCount ]));
              this.service.connect();
              return [ 2 ];
            }
          });
        });
      };
      ReconnectComponent.prototype.connectTimeOut = function() {
        this._isDoConnect = false;
        this.unschedule(this.connect);
        this.service && this.service.close();
        this.showReconnectDialog();
      };
      ReconnectComponent.prototype.showReconnectDialog = function() {
        var _this = this;
        this.service && this.service.reconnect.hideNode();
        cc.log(this.logName + " " + this.service.serviceName + " \u65ad\u5f00");
        Manager_1.Manager.alert.show({
          tag: Config_1.Config.RECONNECT_ALERT_TAG,
          isRepeat: false,
          text: Manager_1.Manager.getLanguage([ "warningReconnect", this.service.serviceName ]),
          confirmCb: function(isOK) {
            if (isOK) {
              cc.log(_this.logName + " \u91cd\u8fde\u8fde\u63a5\u7f51\u7edc");
              _this._connectCount = 0;
              _this.connect();
            } else {
              cc.log(_this.logName + " \u73a9\u5bb6\u7f51\u7edc\u4e0d\u597d\uff0c\u4e0d\u91cd\u8fde\uff0c\u9000\u56de\u5230\u767b\u5f55\u754c\u9762");
              dispatch(LogicEvent_1.LogicEvent.ENTER_LOGIN, true);
            }
          },
          cancelCb: function() {
            cc.log(_this.logName + " \u73a9\u5bb6\u7f51\u7edc\u4e0d\u597d\uff0c\u4e0d\u91cd\u8fde\uff0c\u9000\u56de\u5230\u767b\u5f55\u754c\u9762");
            dispatch(LogicEvent_1.LogicEvent.ENTER_LOGIN, true);
          }
        });
      };
      ReconnectComponent.prototype.onNetOpen = function(event) {
        var result = _super.prototype.onNetOpen.call(this, event);
        if (result) {
          this.service.reconnect.hide();
          this._connectCount = 0;
          Manager_1.Manager.alert.close(Config_1.Config.RECONNECT_ALERT_TAG);
          Manager_1.Manager.serviceManager.onReconnectSuccess(this.service);
          cc.log(this.logName + " " + this.service.serviceName + "\u670d\u52a1\u5668\u91cd\u8fde\u6210\u529f");
        }
        return result;
      };
      ReconnectComponent.prototype.onNetError = function(event) {
        var result = _super.prototype.onNetError.call(this, event);
        if (result) {
          Manager_1.Manager.loading.hide();
          this.service.close();
          this.delayConnect();
        }
        return result;
      };
      ReconnectComponent.prototype.onNetClose = function(event) {
        var result = _super.prototype.onNetClose.call(this, event);
        if (result) {
          if (event.event.type == EventApi_1.CustomNetEventType.CLOSE) {
            cc.log(this.logName + " \u5e94\u7528\u5c42\u4e3b\u52a8\u5173\u95edsocket");
            return;
          }
          Manager_1.Manager.loading.hide();
          this.delayConnect();
        }
        return result;
      };
      ReconnectComponent = __decorate([ ccclass ], ReconnectComponent);
      return ReconnectComponent;
    }(Controller_1.default);
    exports.default = ReconnectComponent;
    cc._RF.pop();
  }, {
    "../../framework/controller/Controller": "Controller",
    "../../framework/event/EventApi": "EventApi",
    "../config/Config": "Config",
    "../event/LogicEvent": "LogicEvent",
    "../manager/Manager": "Manager"
  } ],
  Reconnect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "65b60jmWfJGxqFRtFBIG0ob", "Reconnect");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Reconnect = void 0;
    var Defines_1 = require("../../framework/base/Defines");
    var EventApi_1 = require("../../framework/event/EventApi");
    var Config_1 = require("../config/Config");
    var LanguageImpl_1 = require("../language/LanguageImpl");
    var Manager_1 = require("../manager/Manager");
    var ReconnectComponent_1 = require("./ReconnectComponent");
    var Reconnect = function() {
      function Reconnect(service) {
        this.node = null;
        this.isWaitingHide = false;
        this.service = null;
        this._enabled = true;
        this.service = service;
        Manager_1.Manager.eventDispatcher.addEventListener(EventApi_1.EventApi.AdaptScreenEvent, this.onAdaptScreen, this);
      }
      Reconnect.preLoadPrefab = function() {
        this.loadPrefab();
      };
      Reconnect.loadPrefab = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolove, reject) {
              if (_this.isLoadingPrefab) {
                cc.warn("\u6b63\u5728\u52a0\u8f7dReconnect\u9884\u7f6e\u4f53");
                return;
              }
              if (_this.prefab) {
                resolove(true);
                return;
              }
              _this.isLoadingPrefab = true;
              Manager_1.Manager.assetManager.load(Defines_1.BUNDLE_RESOURCES, Config_1.Config.CommonPrefabs.loading, cc.Prefab, function(finish, total, item) {}, function(data) {
                _this.isLoadingPrefab = false;
                if (data && data.data && data.data instanceof cc.Prefab) {
                  Manager_1.Manager.assetManager.addPersistAsset(Config_1.Config.CommonPrefabs.loading, data.data, Defines_1.BUNDLE_RESOURCES);
                  _this.prefab = data.data;
                  resolove(true);
                } else resolove(false);
              });
            }) ];
          });
        });
      };
      Object.defineProperty(Reconnect.prototype, "enabled", {
        get: function() {
          return this._enabled;
        },
        set: function(value) {
          this._enabled = value;
        },
        enumerable: false,
        configurable: true
      });
      Reconnect.prototype.onAdaptScreen = function() {
        Manager_1.Manager.resolutionHelper.fullScreenAdapt(this.node);
      };
      Reconnect.prototype.show = function(content) {
        void 0 === content && (content = LanguageImpl_1.i18n.reconnect);
        return __awaiter(this, void 0, void 0, function() {
          var finish, label;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              true;
              cc.log(this.service.serviceName + " \u663e\u793a\u91cd\u8fde");
              if (this.isExistReconnectComponent()) return [ 2 ];
              this.isWaitingHide = false;
              return [ 4, Reconnect.loadPrefab() ];

             case 1:
              finish = _a.sent();
              if (finish) {
                this.node || (this.node = cc.instantiate(Reconnect.prefab));
                Manager_1.Manager.resolutionHelper.fullScreenAdapt(this.node);
                this.node.name = "Reconnect";
                this.node.removeFromParent();
                this.node.parent = Manager_1.Manager.uiManager.getCanvas();
                this.node.zIndex = Config_1.ViewZOrder.Loading;
                this.node.position = cc.v3(0, 0, 0);
                if (this.isWaitingHide) {
                  this.isWaitingHide = false;
                  this.setActive(false);
                  return [ 2 ];
                }
                if (content) {
                  label = cc.find("content/text", this.node);
                  label && (label.getComponent(cc.Label).string = content);
                }
                this.setActive(true);
              }
              return [ 2 ];
            }
          });
        });
      };
      Reconnect.prototype.isExistReconnectComponent = function() {
        if (this.node && this.node.getComponent(ReconnectComponent_1.default)) return true;
        return false;
      };
      Reconnect.prototype.setActive = function(active) {
        if (this.node) {
          var controller = this.node.getComponent(ReconnectComponent_1.default);
          if (active) {
            if (!controller) {
              controller = this.node.addComponent(ReconnectComponent_1.default);
              controller.service = this.service;
            }
          } else this.node.removeComponent(ReconnectComponent_1.default);
          this.node.active = active;
        }
      };
      Reconnect.prototype.hide = function() {
        cc.log("Reconnect hide");
        if (this.node) {
          this.isWaitingHide = true;
          this.setActive(false);
        } else this.isWaitingHide = true;
      };
      Reconnect.prototype.hideNode = function() {
        cc.log("Reconnect hideNode");
        if (this.node) {
          this.isWaitingHide = true;
          this.node.active = false;
        } else this.isWaitingHide = true;
      };
      Reconnect.prototype.showNode = function(content) {
        cc.log("Reconnect showNode");
        if (this.node) {
          this.node.active = true;
          if (content) {
            var label = cc.find("content/text", this.node);
            label && (label.getComponent(cc.Label).string = content);
          }
        }
      };
      Reconnect.prefab = null;
      Reconnect.isLoadingPrefab = false;
      return Reconnect;
    }();
    exports.Reconnect = Reconnect;
    cc._RF.pop();
  }, {
    "../../framework/base/Defines": "Defines",
    "../../framework/event/EventApi": "EventApi",
    "../config/Config": "Config",
    "../language/LanguageImpl": "LanguageImpl",
    "../manager/Manager": "Manager",
    "./ReconnectComponent": "ReconnectComponent"
  } ],
  ResolutionHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c6c30QpRf5ECpm9VWVrASkv", "ResolutionHelper");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ResolutionHelper = exports.ScreenAdaptType = void 0;
    var EventApi_1 = require("../event/EventApi");
    var Framework_1 = require("../Framework");
    var Singleton_1 = require("../base/Singleton");
    var ScreenAdaptType;
    (function(ScreenAdaptType) {
      ScreenAdaptType[ScreenAdaptType["None"] = 0] = "None";
      ScreenAdaptType[ScreenAdaptType["Increase"] = 1] = "Increase";
      ScreenAdaptType[ScreenAdaptType["Decrease"] = 2] = "Decrease";
      ScreenAdaptType[ScreenAdaptType["Max"] = 3] = "Max";
    })(ScreenAdaptType = exports.ScreenAdaptType || (exports.ScreenAdaptType = {}));
    function instance() {
      return Singleton_1.getSingleton(ResolutionHelper);
    }
    var ResolutionHelper = function() {
      function ResolutionHelper() {
        this._logTag = "[ResolutionHelper]";
        this.canvas = null;
        this.screenAdaptType = ScreenAdaptType.None;
        this.node = null;
        this.MAX_RATE = 2.4;
        this.designResolution = null;
        this.landscapeHeight = 0;
        this.protraitHeight = 0;
        this.waitScorllY = null;
        this.isFirstResize = true;
        this._isShowKeyboard = false;
        this._keybordChangeTimerId = -1;
        this._maxLandscapeHeight = 0;
      }
      ResolutionHelper.Instance = function() {
        return this._instance || (this._instance = new ResolutionHelper());
      };
      Object.defineProperty(ResolutionHelper.prototype, "isShowKeyboard", {
        get: function() {
          return instance()._isShowKeyboard;
        },
        set: function(value) {
          var me = instance();
          me._isShowKeyboard = value;
          value || me._onResize(true);
        },
        enumerable: false,
        configurable: true
      });
      ResolutionHelper.prototype.fullScreenAdapt = function(node) {
        var me = instance();
        if (node && me.isNeedAdapt) {
          node.setContentSize(cc.winSize);
          me.updateAlignment(node);
        }
      };
      Object.defineProperty(ResolutionHelper.prototype, "isNeedAdapt", {
        get: function() {
          var me = instance();
          if (me.screenAdaptType != ScreenAdaptType.None) return true;
          return false;
        },
        enumerable: false,
        configurable: true
      });
      ResolutionHelper.prototype.updateAlignment = function(node) {
        var me = instance();
        var ch = node.children;
        for (var i = 0; i < ch.length; i++) {
          var child = ch[i];
          cc.updateAlignment(child);
          me.updateAlignment(child);
        }
      };
      ResolutionHelper.prototype.onLoad = function(node) {
        var me = instance();
        me.node = node;
        me.canvas = node.getComponent(cc.Canvas);
        me.designResolution = me.canvas.designResolution.clone();
        me.onResize();
      };
      ResolutionHelper.prototype.onDestroy = function() {
        var me = instance();
        me.node = null;
        me.isFirstResize = false;
      };
      ResolutionHelper.prototype.doChangeResolution = function() {
        var me = instance();
        if (me.screenAdaptType == ScreenAdaptType.Increase) {
          var winsize = me.getWinsize();
          me.canvas.designResolution = winsize;
        } else if (me.screenAdaptType == ScreenAdaptType.Max) {
          var winsize = me.getMaxWinsize();
          true;
          cc.log("max winsize : " + winsize.width + " * " + winsize.height);
          me.canvas.designResolution = winsize;
        } else me.canvas.designResolution = me.designResolution;
        if (me.isNeedAdapt) {
          dispatch(EventApi_1.EventApi.AdaptScreenEvent);
          Framework_1.Manager.uiManager.fullScreenAdapt();
        }
      };
      ResolutionHelper.prototype.initBrowserAdaptor = function() {
        var me = instance();
        if (me.isBrowser && true) {
          cc.view.resizeWithBrowserSize(true);
          false, cc.sys.platform == cc.sys.WECHAT_GAME ? me.recordHeight() : window.addEventListener("load", function() {
            me.recordHeight();
            window.addEventListener("resize", me.onResize, false);
            window.addEventListener("orientationchange", me.onOrientationChange, false);
          }, false);
        }
      };
      Object.defineProperty(ResolutionHelper.prototype, "isBrowser", {
        get: function() {
          if (cc.sys.isBrowser) return true;
          return false;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ResolutionHelper.prototype, "isSafari", {
        get: function() {
          var me = instance();
          if (me.isBrowser && cc.sys.OS_IOS == cc.sys.os && cc.sys.browserType == cc.sys.BROWSER_TYPE_SAFARI) return true;
          return false;
        },
        enumerable: false,
        configurable: true
      });
      ResolutionHelper.prototype.onOrientationChange = function() {
        var me = instance();
        me.recordHeight();
        me.isFirstResize = false;
      };
      ResolutionHelper.prototype.onResize = function() {
        var me = instance();
        me._onResize(false);
      };
      ResolutionHelper.prototype._onResize = function(isHideKeyboard) {
        var me = instance();
        if (me.node) if (false, cc.sys.platform == cc.sys.WECHAT_GAME) {
          me.recordHeight();
          me.doAdapt();
        } else {
          if (me.isShowKeyboard) {
            me.recordHeight();
            return;
          }
          if ("Landscape" == me.dviceDirection) {
            var height = me.landscapeHeight;
            var offsetY = 0;
            me.recordHeight();
            if (0 != me.landscapeHeight) {
              offsetY = me.landscapeHeight - height;
              if (me.isFirstResize) {
                true;
                cc.log(me._logTag, "\u5728\u6709\u5bfc\u884c\u6761\u60c5\u51b5\u4e0b\u8fdb\u884c\u5237\u65b0\u64cd\u4f5c");
                me.waitScorllY = offsetY;
                me.doAdapt();
                me.isFirstResize = false;
                return;
              }
            }
          }
          isHideKeyboard && "Landscape" == me.dviceDirection && (me.waitScorllY = Math.abs(me._maxLandscapeHeight - me.landscapeHeight));
          me.isFirstResize = false;
          me.doAdapt();
          setTimeout(function() {
            if (me.isShowKeyboard) return;
            if ("Landscape" == me.dviceDirection) {
              me.recordHeight();
              cc.log("cur scrolly : " + window.scrollY);
              if (window.scrollY > 0 || me.isSafari) {
                true;
                cc.log(me._logTag, me.dviceDirection);
                me.isSafari ? me.waitScorllY = window.scrollY > 0 ? -window.scrollY : -50 : me.waitScorllY = -window.scrollY;
                true;
                cc.log(me._logTag, "scrollY : " + me.waitScorllY);
                me.doAdapt();
              } else me.doAdapt();
            } else if ("Portrait" == me.dviceDirection) {
              me.protraitHeight > window.innerHeight && (me.waitScorllY = me.protraitHeight - window.innerHeight);
              me.recordHeight();
              me.doAdapt();
            }
          }, 505);
        }
      };
      ResolutionHelper.prototype.doAdapt = function() {
        var me = instance();
        if (me.canvas) {
          if (null != me.waitScorllY) {
            var top = me.waitScorllY;
            true;
            cc.log(me._logTag, "scroll top : " + top);
            window.scrollTo && window.scrollTo(0, top);
            me.waitScorllY = null;
          }
          me.calculateNeedFullScreenAdapt();
          me.doChangeResolution();
        } else {
          true;
          cc.log(me._logTag, "\u7b49\u5f85\u573a\u666f\u52a0\u8f7d\u5b8c\u6210\u505a\u9002\u914d");
        }
      };
      ResolutionHelper.prototype.recordHeight = function() {
        if (window.innerWidth && window.innerHeight) {
          var me = instance();
          if ("Landscape" == me.dviceDirection) {
            me.landscapeHeight = window.innerHeight;
            me._maxLandscapeHeight = Math.max(me._maxLandscapeHeight, me.landscapeHeight);
          } else "Portrait" == me.dviceDirection && (me.protraitHeight = Math.max(window.innerWidth, window.innerHeight));
        }
      };
      ResolutionHelper.prototype.getWinsize = function() {
        var me = instance();
        var frameSize = me.getFrameSize();
        var width = frameSize.width * me.designResolution.height / frameSize.height;
        var height = me.designResolution.height;
        return cc.size(width, height);
      };
      ResolutionHelper.prototype.getMaxWinsize = function() {
        var me = instance();
        var height = me.designResolution.height;
        var width = height * me.MAX_RATE;
        return cc.size(width, height);
      };
      ResolutionHelper.prototype.getFrameSize = function() {
        var me = instance();
        var frameSize = cc.view.getFrameSize();
        var innerSize = me.windowInnerSize;
        var size = frameSize.clone();
        false;
        return size;
      };
      ResolutionHelper.prototype.calculateNeedFullScreenAdapt = function() {
        var me = instance();
        var design = me.designResolution.width / me.designResolution.height;
        var frameSize = me.getFrameSize();
        var rate = frameSize.width / frameSize.height;
        if ("Portrait" == me.dviceDirection || "" == me.dviceDirection && design < 1) {
          design = 1 / design;
          rate = 1 / rate;
        }
        true;
        cc.log(me._logTag, "design : " + design + " real : " + rate);
        me.screenAdaptType = ScreenAdaptType.None;
        if (design == rate) {
          true;
          cc.log(me._logTag, "\u76f8\u7b49\u6bd4\u7387");
        } else if (rate < design) {
          me.screenAdaptType = ScreenAdaptType.Decrease;
          true;
          cc.log(me._logTag, "\u5f53\u524d\u8bbe\u8ba1\u6bd4\u7387\u5927\u4e8e\u5b9e\u9645\u6bd4\u7387\uff0c\u6309\u5bbd\u8fdb\u884c\u9002\u914d\uff0c\u4e0a\u4e0b\u6709\u9ed1\u8fb9");
        } else {
          true;
          cc.log(me._logTag, "\u5f53\u524d\u8bbe\u8ba1\u6bd4\u7387\u5c0f\u4e8e\u5b9e\u9645\u6bd4\u7387\uff0c\u5c06\u4f1a\u5bf9\u652f\u6301\u5168\u5c4f\u7684\u754c\u9762\u8fdb\u884c\u91cd\u91cd\u5e03\u5c40");
          if (rate >= me.MAX_RATE) {
            true;
            cc.log(me._logTag, "\u8d85\u8fc7\u4e0a\u9650\u6bd4\u7387\uff0c\u6309\u6700\u5927\u503c\u6765");
            me.screenAdaptType = ScreenAdaptType.Max;
          } else me.screenAdaptType = ScreenAdaptType.Increase;
        }
      };
      Object.defineProperty(ResolutionHelper.prototype, "dviceDirection", {
        get: function() {
          if ((void 0 != window.orientation || null != window.orientation) && (90 == window.orientation || -90 == window.orientation)) return "Landscape";
          if ((void 0 != window.orientation || null != window.orientation) && (0 == window.orientation || 180 == window.orientation)) return "Portrait";
          return "";
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ResolutionHelper.prototype, "windowInnerSize", {
        get: function() {
          var size = cc.Size.ZERO.clone();
          if (window.innerHeight && window.innerWidth) {
            var w = window.innerWidth;
            var h = window.innerHeight;
            var isLandscape = w >= h;
            if (!cc.sys.isMobile || isLandscape) {
              size.width = w;
              size.height = h;
            } else {
              size.width = h;
              size.height = w;
            }
          }
          return size;
        },
        enumerable: false,
        configurable: true
      });
      ResolutionHelper._instance = null;
      return ResolutionHelper;
    }();
    exports.ResolutionHelper = ResolutionHelper;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "../base/Singleton": "Singleton",
    "../event/EventApi": "EventApi"
  } ],
  ResourceLoader: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c2732/K5T1ACJsHnXRUvfbR", "ResourceLoader");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ResourceLoaderError = void 0;
    var Defines_1 = require("../base/Defines");
    var Framework_1 = require("../Framework");
    var ResourceLoaderError;
    (function(ResourceLoaderError) {
      ResourceLoaderError[ResourceLoaderError["LOADING"] = 0] = "LOADING";
      ResourceLoaderError[ResourceLoaderError["NO_FOUND_LOAD_RESOURCE"] = 1] = "NO_FOUND_LOAD_RESOURCE";
      ResourceLoaderError[ResourceLoaderError["SUCCESS"] = 2] = "SUCCESS";
    })(ResourceLoaderError = exports.ResourceLoaderError || (exports.ResourceLoaderError = {}));
    var ResourceLoader = function() {
      function ResourceLoader() {
        this._resources = new Map();
        this._loadedCount = 0;
        this._loadedResource = new Map();
        this._isLoading = false;
        this._tag = null;
        this._onLoadComplete = null;
        this._getLoadResource = null;
      }
      Object.defineProperty(ResourceLoader.prototype, "tag", {
        get: function() {
          return this._tag;
        },
        set: function(tag) {
          this._tag = tag;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ResourceLoader.prototype, "onLoadComplete", {
        get: function() {
          return this._onLoadComplete;
        },
        set: function(cb) {
          this._onLoadComplete = cb;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ResourceLoader.prototype, "onLoadProgress", {
        get: function() {
          return this._onLoadProgress;
        },
        set: function(value) {
          this._onLoadProgress = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ResourceLoader.prototype, "getLoadResources", {
        get: function() {
          return this._getLoadResource;
        },
        set: function(func) {
          this._getLoadResource = func;
        },
        enumerable: false,
        configurable: true
      });
      ResourceLoader.prototype.loadResources = function() {
        var _this = this;
        if (!this.getLoadResources) {
          true;
          cc.error("\u672a\u6307\u5b9a getLoadResources \u51fd\u6570");
          this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.NO_FOUND_LOAD_RESOURCE);
          return;
        }
        var res = this.getLoadResources();
        if (!res) {
          true;
          cc.error("\u672a\u6307\u5b9a\u52a0\u8f7d\u8d44\u6e90");
          this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.NO_FOUND_LOAD_RESOURCE);
          return;
        }
        if (res.length <= 0) {
          true;
          cc.warn("\u52a0\u8f7d\u7684\u8d44\u6e90\u4e3a\u7a7a");
          this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.NO_FOUND_LOAD_RESOURCE);
          return;
        }
        if (this._isLoading) {
          true;
          cc.warn("\u8d44\u6e90\u52a0\u8f7d\u4e2d\uff0c\u672a\u5b8c\u6210\u52a0\u8f7d");
          this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.LOADING);
          return;
        }
        if (this._resources.size > 0 && this.isLoadComplete()) {
          true;
          cc.warn("\u8d44\u6e90\u5df2\u7ecf\u52a0\u8f7d\u5b8c\u6210\uff0c\u4f7f\u7528\u5df2\u7ecf\u52a0\u8f7d\u5b8c\u6210\u7684\u8d44\u6e90");
          this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.SUCCESS);
          this.onLoadResourceComplete();
          return;
        }
        this._isLoading = true;
        res.forEach(function(value, index) {
          value.url ? _this._resources.set(value.url, value) : value.preloadView && _this._resources.set(value.preloadView.getPrefabUrl(), value);
        });
        this._loadedCount = 0;
        this._resources.forEach(function(value, key, source) {
          value.preloadView ? Framework_1.Manager.uiManager.preload(value.preloadView, value.bundle).then(function(view) {
            var cache = new Defines_1.ResourceCacheData();
            cache.isLoaded = true;
            cache.data = view;
            cache.info.url = value.preloadView.getPrefabUrl();
            cache.info.bundle = value.bundle;
            _this._onLoadResourceComplete(cache);
          }) : Framework_1.Manager.assetManager.load(value.bundle, value.url, value.type, null, _this._onLoadResourceComplete.bind(_this));
        });
      };
      ResourceLoader.prototype.unLoadResources = function() {
        this._unLoadResources();
      };
      ResourceLoader.prototype._unLoadResources = function() {
        var _this = this;
        if (this._isLoading || this._resources.size <= 0) {
          this._isLoading && cc.log("resources is loading , waiting for unload!!!");
          return;
        }
        this._resources.size > 0 && this._resources.forEach(function(value) {
          if (value.url && _this._loadedResource.has(value.url)) {
            var data = _this._loadedResource.get(value.url);
            data && Framework_1.Manager.assetManager.releaseAsset(data);
            _this._loadedResource.delete(value.url);
          }
        });
        this._isLoading = false;
        this._loadedCount = 0;
        this._resources.clear();
      };
      ResourceLoader.prototype._onLoadResourceComplete = function(data) {
        this._loadedCount++;
        if (this._onLoadProgress) {
          this._loadedCount > this._resources.size && (this._loadedCount = this._resources.size);
          this._onLoadProgress(this._loadedCount, this._resources.size, data);
        }
        if (data && data.data instanceof cc.Asset) {
          var info = new Defines_1.ResourceInfo();
          info.url = data.info.url;
          info.type = data.info.type;
          info.data = data.data;
          info.bundle = data.info.bundle;
          Framework_1.Manager.assetManager.retainAsset(info);
          this._loadedResource.set(info.url, info);
        }
        this.checkLoadResourceComplete();
      };
      ResourceLoader.prototype.checkLoadResourceComplete = function() {
        if (this.isLoadComplete()) {
          this._isLoading = false;
          this.onLoadComplete && this.onLoadComplete(ResourceLoaderError.SUCCESS);
          this.onLoadResourceComplete();
        }
      };
      ResourceLoader.prototype.onLoadResourceComplete = function() {};
      ResourceLoader.prototype.isLoadComplete = function() {
        return this._loadedCount >= this._resources.size;
      };
      return ResourceLoader;
    }();
    exports.default = ResourceLoader;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "../base/Defines": "Defines"
  } ],
  RoomListView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c5777JU1OtBuqnwbTd0ZN7i", "RoomListView");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var RoomListView = function(_super) {
      __extends(RoomListView, _super);
      function RoomListView() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      RoomListView = __decorate([ ccclass ], RoomListView);
      return RoomListView;
    }(cc.Component);
    exports.default = RoomListView;
    cc._RF.pop();
  }, {} ],
  ServerConnector: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ab4429aUZpJfoTpYOpkh3ZI", "ServerConnector");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ServerConnector = void 0;
    var WebSocketClient_1 = require("./WebSocketClient");
    var ServerConnector = function() {
      function ServerConnector() {
        this._wsClient = null;
        this._sendHartId = -1;
        this._curRecvHartTimeOutCount = 0;
        this._enabled = true;
        this._wsClient = new WebSocketClient_1.default();
        this._wsClient.onClose = this.onClose.bind(this);
        this._wsClient.onError = this.onError.bind(this);
        this._wsClient.onMessage = this.onMessage.bind(this);
        this._wsClient.onOpen = this.onOpen.bind(this);
      }
      ServerConnector.prototype.sendHeartbeat = function() {
        true;
        cc.error("\u8bf7\u91cd\u5199sendHeartbeat");
      };
      ServerConnector.prototype.getMaxHeartbeatTimeOut = function() {
        return 5;
      };
      ServerConnector.prototype.getHeartbeatInterval = function() {
        return 5e3;
      };
      ServerConnector.prototype.onHeartbeatTimeOut = function() {};
      ServerConnector.prototype.isHeartBeat = function(data) {
        return false;
      };
      ServerConnector.prototype.onOpen = function() {
        this._curRecvHartTimeOutCount = 0;
        this.stopSendHartSchedule();
        this.sendHeartbeat();
        this.startSendHartSchedule();
      };
      ServerConnector.prototype.onClose = function(ev) {
        this.stopSendHartSchedule();
      };
      ServerConnector.prototype.onError = function(ev) {
        this.stopSendHartSchedule();
      };
      ServerConnector.prototype.onMessage = function(data) {
        this.recvHeartbeat();
      };
      ServerConnector.prototype.recvHeartbeat = function() {
        this._curRecvHartTimeOutCount = 0;
      };
      Object.defineProperty(ServerConnector.prototype, "enabled", {
        get: function() {
          return this._enabled;
        },
        set: function(value) {
          this._enabled = value;
          false == value && this.close();
        },
        enumerable: false,
        configurable: true
      });
      ServerConnector.prototype.connect = function(ip, port, protocol) {
        void 0 === port && (port = null);
        void 0 === protocol && (protocol = "wss");
        if (!this.enabled) {
          true;
          cc.warn("\u8bf7\u6c42\u5148\u542f\u7528");
          return;
        }
        port ? "string" == typeof port && port.length > 0 ? this._wsClient && this._wsClient.initWebSocket(ip, port, protocol) : "number" == typeof port && port > 0 ? this._wsClient && this._wsClient.initWebSocket(ip, port.toString(), protocol) : this._wsClient && this._wsClient.initWebSocket(ip, null, protocol) : this._wsClient && this._wsClient.initWebSocket(ip, null, protocol);
      };
      ServerConnector.prototype.stopSendHartSchedule = function() {
        if (-1 != this._sendHartId) {
          clearInterval(this._sendHartId);
          this._sendHartId = -1;
        }
      };
      ServerConnector.prototype.startSendHartSchedule = function() {
        var self = this;
        this._sendHartId = setInterval(function() {
          self._curRecvHartTimeOutCount = self._curRecvHartTimeOutCount + 1;
          if (self._curRecvHartTimeOutCount > self.getMaxHeartbeatTimeOut()) {
            self.stopSendHartSchedule();
            self.onHeartbeatTimeOut();
            return;
          }
          self.sendHeartbeat();
        }, self.getHeartbeatInterval());
      };
      ServerConnector.prototype.sendBuffer = function(buffer) {
        this._wsClient && this._wsClient.send(buffer);
      };
      ServerConnector.prototype.close = function(isEnd) {
        void 0 === isEnd && (isEnd = false);
        this.stopSendHartSchedule();
        this._wsClient && this._wsClient.close(isEnd);
      };
      Object.defineProperty(ServerConnector.prototype, "isConnected", {
        get: function() {
          if (this._wsClient) return this._wsClient.isConnected;
          return false;
        },
        enumerable: false,
        configurable: true
      });
      return ServerConnector;
    }();
    exports.ServerConnector = ServerConnector;
    cc._RF.pop();
  }, {
    "./WebSocketClient": "WebSocketClient"
  } ],
  ServiceManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c990aZqzJ9E5INwxkLBs3jq", "ServiceManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ServiceManager = void 0;
    var Config_1 = require("../config/Config");
    var LogicEvent_1 = require("../event/LogicEvent");
    var ChatService_1 = require("../net/ChatService");
    var GameService_1 = require("../net/GameService");
    var LobbyService_1 = require("../net/LobbyService");
    var Manager_1 = require("./Manager");
    var ServiceManager = function() {
      function ServiceManager() {
        this.services = [];
      }
      ServiceManager.Instance = function() {
        return this._instance || (this._instance = new ServiceManager());
      };
      ServiceManager.prototype.onLoad = function() {
        this.services.push(LobbyService_1.LobbyService.instance);
        this.services.push(GameService_1.GameService.instance);
        this.services.push(ChatService_1.ChatService.instance);
        LobbyService_1.LobbyService.instance.priority = 3;
        GameService_1.GameService.instance.priority = 2;
        ChatService_1.ChatService.instance.priority = 1;
      };
      ServiceManager.prototype.update = function() {
        this.services.forEach(function(value) {
          value && value.handMessage();
        });
      };
      ServiceManager.prototype.onDestroy = function() {
        this.services.forEach(function(value) {
          value && value.close(true);
        });
      };
      ServiceManager.prototype.close = function() {
        this.services.forEach(function(value) {
          value && value.close();
        });
      };
      ServiceManager.prototype.onEnterBackground = function() {
        this.services.forEach(function(value) {
          value && value.onEnterBackground();
        });
      };
      ServiceManager.prototype.onEnterForgeground = function(inBackgroundTime) {
        this.services.forEach(function(value) {
          value && value.onEnterForgeground(inBackgroundTime);
        });
      };
      ServiceManager.prototype.tryReconnect = function(service, isShowTips) {
        void 0 === isShowTips && (isShowTips = false);
        if (!service) {
          cc.error("service is null");
          return;
        }
        if (!service.enabled || !service.reconnect.enabled) return;
        if (isShowTips) Manager_1.Manager.uiManager.getView("LoginView").then(function(view) {
          if (view) return;
          service.reconnect.hide();
          cc.log(service.serviceName + " \u65ad\u5f00");
          var current = Manager_1.Manager.alert.currentShow(Config_1.Config.RECONNECT_ALERT_TAG);
          if (current) {
            var showService = current.userData;
            if (service.priority > showService.priority) {
              cc.log("\u663e\u793a\u66f4\u65b0\u4f18\u5148\u7ea7\u91cd\u8fde\u5f39\u51fa\u6846 : " + service.serviceName);
              Manager_1.Manager.alert.close(Config_1.Config.RECONNECT_ALERT_TAG);
            }
          }
          Manager_1.Manager.alert.show({
            tag: Config_1.Config.RECONNECT_ALERT_TAG,
            isRepeat: false,
            userData: service,
            text: Manager_1.Manager.getLanguage([ "warningReconnect", service.serviceName ]),
            confirmCb: function(isOK) {
              if (isOK) service.reconnect.show(); else {
                cc.log(service.serviceName + " \u73a9\u5bb6\u7f51\u7edc\u4e0d\u597d\uff0c\u4e0d\u91cd\u8fde\uff0c\u9000\u56de\u5230\u767b\u5f55\u754c\u9762");
                dispatch(LogicEvent_1.LogicEvent.ENTER_LOGIN, true);
              }
            },
            cancelCb: function() {
              cc.log(service.serviceName + " \u73a9\u5bb6\u7f51\u7edc\u4e0d\u597d\uff0c\u4e0d\u91cd\u8fde\uff0c\u9000\u56de\u5230\u767b\u5f55\u754c\u9762");
              dispatch(LogicEvent_1.LogicEvent.ENTER_LOGIN, true);
            }
          });
        }); else {
          if (Manager_1.Manager.alert.isCurrentShow(Config_1.Config.RECONNECT_ALERT_TAG)) {
            true;
            cc.warn("\u6709\u4e00\u4e2a\u91cd\u8fde\u63d0\u793a\u6846\u663e\u793a\uff0c\u7b49\u5f85\u73a9\u5bb6\u64cd\u4f5c");
            return;
          }
          var prev = null;
          var cur = null;
          for (var i = 1; i < this.services.length; i++) {
            prev = this.services[i - 1];
            cur = this.services[i];
            if (!prev.enabled || !prev.reconnect.enabled) continue;
            if (!prev.isConnected) {
              prev == service ? service.reconnect.show() : prev.reconnect.show();
              return;
            }
          }
          cur == service && service.reconnect.show();
        }
      };
      ServiceManager.prototype.onReconnectSuccess = function(service) {
        for (var i = 0; i < this.services.length; i++) {
          if (!this.services[i].enabled || !this.services[i].reconnect.enabled) continue;
          if (!this.services[i].isConnected) {
            this.services[i].reconnect.show();
            break;
          }
        }
      };
      ServiceManager._instance = null;
      return ServiceManager;
    }();
    exports.ServiceManager = ServiceManager;
    cc._RF.pop();
  }, {
    "../config/Config": "Config",
    "../event/LogicEvent": "LogicEvent",
    "../net/ChatService": "ChatService",
    "../net/GameService": "GameService",
    "../net/LobbyService": "LobbyService",
    "./Manager": "Manager"
  } ],
  Service: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "04660opGZBJ3JOIgugJWjAl", "Service");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Service = void 0;
    var ServerConnector_1 = require("../net/ServerConnector");
    var EventApi_1 = require("../event/EventApi");
    var Decorators_1 = require("../decorator/Decorators");
    var Message_1 = require("../net/Message");
    var Framework_1 = require("../Framework");
    var Service = function(_super) {
      __extends(Service, _super);
      function Service() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._messageHeader = Message_1.MessageHeader;
        _this._Heartbeat = null;
        _this.serviceName = "CommonService";
        _this.priority = 0;
        _this._listeners = {};
        _this._masseageQueue = new Array();
        _this._isDoingMessage = false;
        _this._isPause = false;
        return _this;
      }
      Object.defineProperty(Service.prototype, "messageHeader", {
        set: function(value) {
          this._messageHeader = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Service.prototype, "heartbeat", {
        get: function() {
          return this._Heartbeat;
        },
        set: function(value) {
          this._Heartbeat = value;
        },
        enumerable: false,
        configurable: true
      });
      Service.prototype.sendHeartbeat = function() {
        _super.prototype.sendHeartbeat.call(this);
      };
      Service.prototype.getMaxHeartbeatTimeOut = function() {
        return _super.prototype.getMaxHeartbeatTimeOut.call(this);
      };
      Service.prototype.onHeartbeatTimeOut = function() {
        _super.prototype.onHeartbeatTimeOut.call(this);
      };
      Service.prototype.isHeartBeat = function(data) {
        return _super.prototype.isHeartBeat.call(this, data);
      };
      Service.prototype.onOpen = function() {
        _super.prototype.onOpen.call(this);
        dispatch(EventApi_1.EventApi.NetEvent.ON_OPEN, {
          service: this,
          event: null
        });
      };
      Service.prototype.onClose = function(ev) {
        _super.prototype.onClose.call(this, ev);
        dispatch(EventApi_1.EventApi.NetEvent.ON_CLOSE, {
          service: this,
          event: ev
        });
      };
      Service.prototype.onError = function(ev) {
        _super.prototype.onError.call(this, ev);
        dispatch(EventApi_1.EventApi.NetEvent.ON_ERROR, {
          service: this,
          event: ev
        });
      };
      Service.prototype.onMessage = function(data) {
        var header = new this._messageHeader();
        if (!header.decode(data)) {
          cc.error("decode header error");
          return;
        }
        _super.prototype.onMessage.call(this, data);
        if (this.isHeartBeat(header)) return;
        cc.log("recv data main cmd : " + header.mainCmd + " sub cmd : " + header.subCmd + " buffer length : " + header.size);
        var key = Decorators_1.makeKey(header.mainCmd, header.subCmd);
        if (!this._listeners[key]) {
          cc.warn("no find listener data main cmd : " + header.mainCmd + " sub cmd : " + header.subCmd);
          return;
        }
        if (this._listeners[key].length <= 0) return;
        var listenerDatas = this._listeners[key];
        var queueDatas = [];
        for (var i = 0; i < listenerDatas.length; i++) {
          var obj = null;
          if (listenerDatas[i].type) {
            obj = new listenerDatas[i].type();
            obj.decode(header.buffer);
          } else obj = header.buffer;
          if (listenerDatas[i].isQueue) queueDatas.push(this.copyListenerData(listenerDatas[i], obj)); else try {
            listenerDatas[i].func && listenerDatas[i].func.call(listenerDatas[i].target, obj);
          } catch (error) {
            cc.error(error);
          }
        }
        queueDatas.length > 0 && this._masseageQueue.push(queueDatas);
      };
      Service.prototype.pauseMessageQueue = function() {
        this._isPause = true;
      };
      Service.prototype.resumeMessageQueue = function() {
        this._isPause = false;
      };
      Service.prototype.addListener = function(mainCmd, subCmd, handleType, handleFunc, isQueue, target) {
        var key = Decorators_1.makeKey(mainCmd, subCmd);
        if (this._listeners[key]) {
          var hasSame = false;
          for (var i = 0; i < this._listeners[key].length; i++) if (this._listeners[key][i].target === target) {
            hasSame = true;
            break;
          }
          if (hasSame) return;
          this._listeners[key].push({
            mainCmd: mainCmd,
            subCmd: subCmd,
            func: handleFunc,
            type: handleType,
            isQueue: isQueue,
            target: target
          });
        } else {
          this._listeners[key] = [];
          this._listeners[key].push({
            mainCmd: mainCmd,
            subCmd: subCmd,
            func: handleFunc,
            type: handleType,
            isQueue: isQueue,
            target: target
          });
        }
      };
      Service.prototype.removeListeners = function(target, mainCmd, subCmd) {
        if (mainCmd && subCmd) {
          var self_1 = this;
          Object.keys(this._listeners).forEach(function(value) {
            var datas = self_1._listeners[value];
            var i = datas.length;
            while (i--) datas[i].target == target && datas[i].mainCmd == mainCmd && datas[i].subCmd == subCmd && datas.splice(i, 1);
            0 == datas.length && delete self_1._listeners[value];
          });
          var i = this._masseageQueue.length;
          while (i--) {
            var datas = this._masseageQueue[i];
            var j = datas.length;
            while (j--) datas[j].target == target && datas[j].mainCmd == mainCmd && datas[j].subCmd == subCmd && datas.splice(j, 1);
            0 == datas.length && this._masseageQueue.splice(i, 1);
          }
        } else {
          var self_2 = this;
          Object.keys(this._listeners).forEach(function(value, index, arr) {
            var datas = self_2._listeners[value];
            var i = datas.length;
            while (i--) datas[i].target == target && datas.splice(i, 1);
            0 == datas.length && delete self_2._listeners[value];
          });
          var i = this._masseageQueue.length;
          while (i--) {
            var datas = this._masseageQueue[i];
            var j = datas.length;
            while (j--) datas[j].target == target && datas.splice(j, 1);
            0 == datas.length && this._masseageQueue.splice(i, 1);
          }
        }
      };
      Service.prototype.send = function(msg) {
        if (this._messageHeader) if (msg.encode()) {
          var header = new this._messageHeader();
          header.encode(msg);
          if (this.isHeartBeat(msg)) {
            true;
            cc.log("send request main cmd : " + msg.mainCmd + " , sub cmd : " + msg.subCmd + " ");
          } else cc.log("send request main cmd : " + msg.mainCmd + " , sub cmd : " + msg.subCmd + " ");
          this.sendBuffer(header.buffer);
        } else cc.error("encode error"); else cc.error("\u8bf7\u6c42\u6307\u5b9a\u6570\u636e\u5305\u5934\u5904\u7406\u7c7b\u578b");
      };
      Service.prototype.copyListenerData = function(input, data) {
        return {
          mainCmd: input.mainCmd,
          subCmd: input.subCmd,
          type: input.type,
          func: input.func,
          isQueue: input.isQueue,
          data: data,
          target: input.target
        };
      };
      Service.prototype.handMessage = function() {
        var _this = this;
        if (this._isPause) return;
        if (this._isDoingMessage) return;
        if (0 == this._masseageQueue.length) return;
        var datas = this._masseageQueue.shift();
        if (void 0 == datas) return;
        if (0 == datas.length) return;
        this._isDoingMessage = true;
        var handleTime = 0;
        true;
        cc.log("---handMessage---");
        for (var i = 0; i < datas.length; i++) {
          var data = datas[i];
          if (data.func instanceof Function) try {
            var tempTime = data.func.call(data.target, data.data);
            "number" == typeof tempTime && (handleTime = Math.max(handleTime, tempTime));
          } catch (error) {
            cc.error(error);
          }
        }
        0 == handleTime ? this._isDoingMessage = false : Framework_1.Manager.uiManager.getCanvasComponent().scheduleOnce(function() {
          _this._isDoingMessage = false;
        }, handleTime);
      };
      Service.prototype.reset = function() {
        this._isDoingMessage = false;
        this._listeners = {};
        this._masseageQueue = [];
        this.resumeMessageQueue();
      };
      Service.prototype.close = function(isEnd) {
        void 0 === isEnd && (isEnd = false);
        this._masseageQueue = [];
        this._isDoingMessage = false;
        _super.prototype.close.call(this, isEnd);
      };
      return Service;
    }(ServerConnector_1.ServerConnector);
    exports.Service = Service;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "../decorator/Decorators": "Decorators",
    "../event/EventApi": "EventApi",
    "../net/Message": "Message",
    "../net/ServerConnector": "ServerConnector"
  } ],
  SettingView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1c97891uUpO9aaSIwGsLBIH", "SettingView");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UIView_1 = require("../../framework/ui/UIView");
    var LogicEvent_1 = require("../event/LogicEvent");
    var LanguageImpl_1 = require("../language/LanguageImpl");
    var Manager_1 = require("../manager/Manager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SettingView = function(_super) {
      __extends(SettingView, _super);
      function SettingView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.musicStatus = null;
        _this.effectStatus = null;
        _this.musicVolume = null;
        _this.effectVolume = null;
        return _this;
      }
      SettingView.getPrefabUrl = function() {
        return "common/prefabs/SettingView";
      };
      SettingView.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.content = cc.find("content", this.node);
        var close = this.find("close");
        close.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
        var quit = this.find("background/quit");
        quit.on(cc.Node.EventType.TOUCH_END, this.onQuit, this);
        var music = this.find("background/musicVolume");
        music.on("slide", this.onMusicVolumeChange, this);
        var effect = this.find("background/effectVolume");
        effect.on("slide", this.onEffectVolumeChange, this);
        this.musicVolume = music.getComponent(cc.Slider);
        this.effectVolume = effect.getComponent(cc.Slider);
        this.musicVolume.progress = Manager_1.Manager.globalAudio.musicVolume;
        this.effectVolume.progress = Manager_1.Manager.globalAudio.effectVolume;
        this.onMusicVolumeChange(this.musicVolume);
        this.onEffectVolumeChange(this.effectVolume);
        var musicStatusNode = this.find("background/musicStatus");
        this.musicStatus = musicStatusNode.getComponent(cc.Toggle);
        var effectStatusNode = this.find("background/effectStatus");
        this.effectStatus = effectStatusNode.getComponent(cc.Toggle);
        musicStatusNode.on("toggle", this.onMusicStatusChange, this);
        effectStatusNode.on("toggle", this.onEffectStatusChange, this);
        this.musicStatus.isChecked = Manager_1.Manager.globalAudio.isMusicOn;
        this.effectStatus.isChecked = Manager_1.Manager.globalAudio.isEffectOn;
        this.onMusicStatusChange(this.musicStatus, false);
        this.onEffectStatusChange(this.effectStatus, false);
        this.showWithAction();
      };
      SettingView.prototype.onClose = function() {
        this.closeWithAction();
      };
      SettingView.prototype.onQuit = function() {
        this.closeWithAction();
        Manager_1.Manager.alert.show({
          immediatelyCallback: true,
          text: LanguageImpl_1.i18n.quitGame,
          confirmCb: function(isOk) {
            isOk && dispatch(LogicEvent_1.LogicEvent.ENTER_LOGIN);
          }
        });
      };
      SettingView.prototype.onMusicVolumeChange = function(target) {
        Manager_1.Manager.globalAudio.musicVolume = target.progress;
        target.node.getComponent(cc.ProgressBar).progress = target.progress;
      };
      SettingView.prototype.onEffectVolumeChange = function(target) {
        Manager_1.Manager.globalAudio.effectVolume = target.progress;
        target.node.getComponent(cc.ProgressBar).progress = target.progress;
      };
      SettingView.prototype.onMusicStatusChange = function(target, isPlay) {
        void 0 == isPlay && Manager_1.Manager.globalAudio.playButtonClick();
        target.node.getChildByName("off").active = !target.isChecked;
        Manager_1.Manager.globalAudio.isMusicOn = target.isChecked;
      };
      SettingView.prototype.onEffectStatusChange = function(target, isPlay) {
        void 0 == isPlay && Manager_1.Manager.globalAudio.playButtonClick();
        target.node.getChildByName("off").active = !target.isChecked;
        Manager_1.Manager.globalAudio.isEffectOn = target.isChecked;
      };
      SettingView = __decorate([ ccclass ], SettingView);
      return SettingView;
    }(UIView_1.default);
    exports.default = SettingView;
    cc._RF.pop();
  }, {
    "../../framework/ui/UIView": "UIView",
    "../event/LogicEvent": "LogicEvent",
    "../language/LanguageImpl": "LanguageImpl",
    "../manager/Manager": "Manager"
  } ],
  Singleton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3c1e2cvYbZBz7B3hGxIdjG+", "Singleton");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getSingleton = void 0;
    function getSingleton(SingletonClass) {
      return SingletonClass.Instance();
    }
    exports.getSingleton = getSingleton;
    cc._RF.pop();
  }, {} ],
  TipsDelegate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cadb3GTNrdGmIsJFrNkQpVQ", "TipsDelegate");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TipsDelegate = function() {
      function TipsDelegate() {}
      TipsDelegate.prototype.show = function(msg) {};
      TipsDelegate.prototype.preloadPrefab = function() {};
      TipsDelegate.prototype.finishShowItem = function(node) {};
      return TipsDelegate;
    }();
    exports.default = TipsDelegate;
    cc._RF.pop();
  }, {} ],
  Tips: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71bdbJWugtIoaZ6duSr5kIe", "Tips");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TipsDelegate_1 = require("../../framework/ui/TipsDelegate");
    var Framework_1 = require("../../framework/Framework");
    var Config_1 = require("../config/Config");
    var Defines_1 = require("../../framework/base/Defines");
    var ToastItem = function(_super) {
      __extends(ToastItem, _super);
      function ToastItem() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._content = null;
        return _this;
      }
      ToastItem.prototype.init = function(content, time) {
        this._content = cc.find("content", this.node);
        this._content && (this._content.getComponent(cc.Label).string = content);
        this.runTimeOut(time);
      };
      ToastItem.prototype.runTimeOut = function(time) {
        var self = this;
        cc.tween(this._content).delay(time).call(function() {
          Framework_1.Manager.tips.finishShowItem(self.node);
        }).start();
      };
      ToastItem.prototype.fadeOut = function() {
        var self = this;
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.spawn(cc.moveBy(.5, 0, 50).easing(cc.easeExponentialOut()), cc.fadeOut(1)), cc.callFunc(function() {
          self.node.removeFromParent();
        })));
      };
      ToastItem.prototype.fadeIn = function() {
        this.node.stopAllActions();
        this.node.opacity = 0;
        var pos = this.node.position;
        this.node.runAction(cc.spawn(cc.fadeIn(.5), cc.moveTo(.5, pos.x, pos.y + 50).easing(cc.easeExponentialOut())));
      };
      return ToastItem;
    }(cc.Component);
    var Tips = function(_super) {
      __extends(Tips, _super);
      function Tips() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._prefab = null;
        _this._queue = [];
        _this.MAX_NUM = 3;
        _this.FADE_TIME = 2;
        _this._id = 0;
        return _this;
      }
      Tips.Instance = function() {
        return this._instance || (this._instance = new Tips());
      };
      Tips.prototype.preLoadPrefab = function() {
        this.loadPrefab();
      };
      Tips.prototype.loadPrefab = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolve, reject) {
              if (_this._prefab) {
                resolve(true);
                return;
              }
              Framework_1.Manager.assetManager.load(Defines_1.BUNDLE_RESOURCES, Config_1.Config.CommonPrefabs.tips, cc.Prefab, function(finish, total, item) {}, function(data) {
                if (data && data.data && data.data instanceof cc.Prefab) {
                  Framework_1.Manager.assetManager.addPersistAsset(Config_1.Config.CommonPrefabs.tips, data.data, Defines_1.BUNDLE_RESOURCES);
                  _this._prefab = data.data;
                  resolve(true);
                } else resolve(false);
              });
            }) ];
          });
        });
      };
      Tips.prototype._show = function(msg) {
        return __awaiter(this, void 0, void 0, function() {
          var finish, node, itemComp, length, i, item, item;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.loadPrefab() ];

             case 1:
              finish = _a.sent();
              if (finish) {
                node = cc.instantiate(this._prefab);
                if (node) {
                  itemComp = node.addComponent(ToastItem);
                  itemComp.init(msg, this.FADE_TIME);
                  itemComp.fadeIn();
                  node.userData = this._id++;
                  Framework_1.Manager.uiManager.getCanvas().addChild(node, Config_1.ViewZOrder.Tips, "Tips" + node.userData);
                  length = this._queue.length;
                  for (i = 0; i < length; i++) {
                    item = this._queue[i];
                    item.opacity = 255;
                    item.stopAllActions();
                    item.runAction(cc.moveTo(.5, 0, 50 + (length - i) * (node.height + 3)).easing(cc.easeExponentialOut()));
                  }
                  this._queue.push(node);
                  if (this._queue.length > this.MAX_NUM) {
                    item = this._queue.shift();
                    item.getComponent(ToastItem).fadeOut();
                  }
                }
              }
              return [ 2 ];
            }
          });
        });
      };
      Tips.prototype.show = function(msg) {
        if (null == msg || void 0 == msg || "" == msg) return;
        cc.log("Toast.show msg=%s", msg);
        this._show(msg);
      };
      Tips.prototype.finishShowItem = function(item) {
        for (var i = 0; i < this._queue.length; i++) {
          var tempItem = this._queue[i];
          if (tempItem.userData == item.userData) {
            this._queue.splice(i, 1);
            item.getComponent(ToastItem).fadeOut();
            break;
          }
        }
      };
      Tips.prototype.clear = function() {
        var item = null;
        while (item = this._queue.pop()) {
          item.stopAllActions();
          item.removeFromParent();
        }
      };
      Tips._instance = null;
      return Tips;
    }(TipsDelegate_1.default);
    exports.default = Tips;
    cc._RF.pop();
  }, {
    "../../framework/Framework": "Framework",
    "../../framework/base/Defines": "Defines",
    "../../framework/ui/TipsDelegate": "TipsDelegate",
    "../config/Config": "Config"
  } ],
  UILoadingDelegate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d1fe84twrZPRK91L4UW5/Qg", "UILoadingDelegate");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UILoadingDelegate = function() {
      function UILoadingDelegate() {}
      UILoadingDelegate.prototype.show = function(delay, name) {};
      UILoadingDelegate.prototype.updateProgress = function(progress) {};
      UILoadingDelegate.prototype.hide = function() {};
      UILoadingDelegate.prototype.preloadPrefab = function() {};
      return UILoadingDelegate;
    }();
    exports.default = UILoadingDelegate;
    cc._RF.pop();
  }, {} ],
  UILoading: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e9477pH+RpF+LErGtlVrhBu", "UILoading");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UILoadingDelegate_1 = require("../../framework/ui/UILoadingDelegate");
    var Manager_1 = require("../manager/Manager");
    var EventApi_1 = require("../../framework/event/EventApi");
    var Config_1 = require("../config/Config");
    var Defines_1 = require("../../framework/base/Defines");
    var UILoading = function(_super) {
      __extends(UILoading, _super);
      function UILoading() {
        var _this = _super.call(this) || this;
        _this._node = null;
        _this._isWaitingHide = false;
        _this.delay = null;
        _this.content = null;
        _this.text = null;
        _this._isLoadingPrefab = false;
        _this.finishLoadCb = null;
        _this._uiName = null;
        _this._timerId = -1;
        Manager_1.Manager.eventDispatcher.addEventListener(EventApi_1.EventApi.AdaptScreenEvent, _this.onAdaptScreen, _this);
        return _this;
      }
      UILoading.Instance = function() {
        return this._instance || (this._instance = new UILoading());
      };
      UILoading.prototype.onAdaptScreen = function() {
        Manager_1.Manager.resolutionHelper.fullScreenAdapt(this._node);
      };
      UILoading.prototype.preLoadPrefab = function() {
        this.loadPrefab();
      };
      UILoading.prototype.show = function(delay, name) {
        this.delay = void 0 == delay || null == delay || delay < 0 ? Config_1.Config.LOAD_VIEW_DELAY : delay;
        this._uiName = name;
        this._show();
      };
      UILoading.prototype._show = function() {
        return __awaiter(this, void 0, void 0, function() {
          var finish;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this._isWaitingHide = false;
              return [ 4, this.loadPrefab() ];

             case 1:
              finish = _a.sent();
              if (finish) {
                Manager_1.Manager.resolutionHelper.fullScreenAdapt(this._node);
                this._node.removeFromParent();
                this._node.parent = Manager_1.Manager.uiManager.getCanvas();
                this._node.zIndex = Config_1.ViewZOrder.UILoading;
                this._node.position = cc.Vec3.ZERO;
                this.content = cc.find("content", this._node);
                this.content.stopAllActions();
                this.text = cc.find("text", this.content).getComponent(cc.Label);
                this.text.string = "0%";
                this.content.opacity = 0;
                this.delay > 0 && cc.tween(this.content).delay(this.delay).set({
                  opacity: 255
                }).start();
                if (this._isWaitingHide) {
                  this._isWaitingHide = false;
                  this._node.active = false;
                  return [ 2 ];
                }
                this.startTimeOutTimer(Config_1.Config.LOAD_VIEW_TIME_OUT);
                this._node.active = true;
              }
              return [ 2 ];
            }
          });
        });
      };
      UILoading.prototype.startTimeOutTimer = function(timeout) {
        var _this = this;
        this.stopTimeOutTimer();
        timeout && (this._timerId = setTimeout(function() {
          Manager_1.Manager.tips.show("\u52a0\u8f7d\u754c\u9762" + (_this._uiName ? _this._uiName : "") + "\u8d85\u65f6\uff0c\u8bf7\u91cd\u8bd5");
          _this.hide();
          _this._isWaitingHide = false;
        }, 1e3 * timeout));
      };
      UILoading.prototype.stopTimeOutTimer = function() {
        clearTimeout(this._timerId);
        this._timerId = -1;
      };
      UILoading.prototype.loadPrefab = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            return [ 2, new Promise(function(resolove, reject) {
              if (_this._isLoadingPrefab) {
                cc.warn("\u6b63\u5728\u52a0\u8f7dLoading\u9884\u7f6e\u4f53");
                _this.finishLoadCb = resolove;
                return;
              }
              if (_this._node) {
                if (_this.finishLoadCb) {
                  _this.finishLoadCb(true);
                  _this.finishLoadCb = null;
                }
                resolove(true);
                return;
              }
              _this._isLoadingPrefab = true;
              Manager_1.Manager.assetManager.load(Defines_1.BUNDLE_RESOURCES, Config_1.Config.CommonPrefabs.uiLoading, cc.Prefab, function(finish, total, item) {}, function(data) {
                _this._isLoadingPrefab = false;
                if (data && data.data && data.data instanceof cc.Prefab) {
                  Manager_1.Manager.assetManager.addPersistAsset(Config_1.Config.CommonPrefabs.uiLoading, data.data, Defines_1.BUNDLE_RESOURCES);
                  _this._node = cc.instantiate(data.data);
                  if (_this.finishLoadCb) {
                    _this.finishLoadCb(true);
                    _this.finishLoadCb = null;
                  }
                  resolove(true);
                } else {
                  if (_this.finishLoadCb) {
                    _this.finishLoadCb(false);
                    _this.finishLoadCb = null;
                  }
                  resolove(false);
                }
              });
            }) ];
          });
        });
      };
      UILoading.prototype.hide = function() {
        this.stopTimeOutTimer();
        if (this._node) {
          this.content && this.content.stopAllActions();
          this._isWaitingHide = true;
          this._node.active = false;
        } else this._isWaitingHide = true;
      };
      UILoading.prototype.updateProgress = function(progress) {
        if (this.text) {
          if (void 0 == progress || null == progress || Number.isNaN(progress)) {
            this.hide();
            return;
          }
          progress >= 0 && progress <= 100 && (this.text.string = progress + "%");
        }
      };
      UILoading._instance = null;
      return UILoading;
    }(UILoadingDelegate_1.default);
    exports.default = UILoading;
    cc._RF.pop();
  }, {
    "../../framework/base/Defines": "Defines",
    "../../framework/event/EventApi": "EventApi",
    "../../framework/ui/UILoadingDelegate": "UILoadingDelegate",
    "../config/Config": "Config",
    "../manager/Manager": "Manager"
  } ],
  UIManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "28677ZXSZ1Au4QNZRC+wUw8", "UIManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.UIManager = void 0;
    var Defines_1 = require("./Defines");
    var Framework_1 = require("../Framework");
    var DYNAMIC_LOAD_GARBAGE = "DYNAMIC_LOAD_GARBAGE";
    var DYNAMIC_LOAD_RETAIN_MEMORY = "DYNAMIC_LOAD_RETAIN_MEMORY";
    var ViewDynamicLoadData = function() {
      function ViewDynamicLoadData(name) {
        void 0 === name && (name = null);
        this.local = new Map();
        this.remote = new Map();
        this.name = name;
      }
      ViewDynamicLoadData.prototype.addLocal = function(info, className) {
        void 0 === className && (className = null);
        if (info && info.url) {
          this.name == DYNAMIC_LOAD_GARBAGE && cc.error("\u627e\u4e0d\u5230\u8d44\u6e90\u6301\u6709\u8005: " + info.url);
          true;
          Framework_1.Manager.uiManager.checkView(info.url, className);
          if (!this.local.has(info.url)) {
            Framework_1.Manager.assetManager.retainAsset(info);
            this.local.set(info.url, info);
          }
        }
      };
      ViewDynamicLoadData.prototype.addRemote = function(info, className) {
        void 0 === className && (className = null);
        if (info && info.data && !this.remote.has(info.url)) {
          this.name == DYNAMIC_LOAD_GARBAGE && cc.error("\u627e\u4e0d\u5230\u8d44\u6e90\u6301\u6709\u8005 : " + info.url);
          true;
          Framework_1.Manager.uiManager.checkView(info.url, className);
          Framework_1.Manager.cacheManager.remoteCaches.retainAsset(info);
          this.remote.set(info.url, info);
        }
      };
      ViewDynamicLoadData.prototype.clear = function() {
        if (this.name == DYNAMIC_LOAD_GARBAGE) {
          var isShow = this.local.size > 0 || this.remote.size > 0;
          isShow && cc.error("\u5f53\u524d\u672a\u80fd\u91ca\u653e\u8d44\u6e90\u5982\u4e0b:");
          if (this.local && this.local.size > 0) {
            cc.error("-----------local-----------");
            this.local && this.local.forEach(function(info) {
              cc.error(info.url);
            });
          }
          if (this.remote && this.remote.size > 0) {
            cc.error("-----------remote-----------");
            this.remote && this.remote.forEach(function(info, url) {
              cc.error(info.url);
            });
          }
        } else {
          if (this.local) {
            this.local.forEach(function(info) {
              Framework_1.Manager.assetManager.releaseAsset(info);
            });
            this.local.clear();
          }
          if (this.remote) {
            this.remote.forEach(function(info, url) {
              Framework_1.Manager.cacheManager.remoteCaches.releaseAsset(info);
            });
            this.remote.clear();
          }
        }
      };
      return ViewDynamicLoadData;
    }();
    var ViewData = function() {
      function ViewData() {
        this.isLoaded = false;
        this.status = Defines_1.ViewStatus.WAITTING_NONE;
        this.view = null;
        this.finishCb = [];
        this.getViewCb = [];
        this.isPreload = false;
        this.info = null;
        this.loadData = new ViewDynamicLoadData();
        this.node = null;
      }
      ViewData.prototype.doGet = function(view, className, msg) {
        for (var i = 0; i < this.getViewCb.length; i++) {
          var cb = this.getViewCb[i];
          if (cb) {
            cb(view);
            true;
            cc.warn("ViewData do get view : " + className + " msg : " + msg);
          }
        }
        this.getViewCb = [];
      };
      ViewData.prototype.doFinish = function(view, className, msg) {
        for (var i = 0; i < this.finishCb.length; i++) {
          var cb = this.finishCb[i];
          if (cb) {
            cb(view);
            true;
            cc.warn("ViewData do finish view : " + className + " msg : " + msg);
          }
        }
        this.finishCb = [];
      };
      ViewData.prototype.doCallback = function(view, className, msg) {
        this.doFinish(view, className, msg);
        this.doGet(view, className, msg);
      };
      return ViewData;
    }();
    var UIManager = function() {
      function UIManager() {
        this._logTag = "[UIManager]";
        this._viewDatas = new Map();
        this.garbage = new ViewDynamicLoadData(DYNAMIC_LOAD_GARBAGE);
        this.retainMemory = new ViewDynamicLoadData(DYNAMIC_LOAD_RETAIN_MEMORY);
      }
      UIManager.Instance = function() {
        return this._instance || (this._instance = new UIManager());
      };
      UIManager.prototype.getViewData = function(data) {
        var className = this.getClassName(data);
        if (!className) return null;
        var viewData = this._viewDatas.has(className) ? this._viewDatas.get(className) : null;
        return viewData;
      };
      UIManager.prototype.getClassName = function(data) {
        if (!data) return null;
        var className = null;
        className = "string" == typeof data ? data : cc.js.getClassName(data);
        return className;
      };
      UIManager.prototype.preload = function(uiClass, bundle) {
        return this._open(uiClass, bundle, 0, true, null, null);
      };
      UIManager.prototype.open = function(config) {
        return this._open(config.type, config.bundle, config.zIndex ? config.zIndex : 0, false, config.args, config.delay, config.name);
      };
      UIManager.prototype._open = function(uiClass, bundle, zOrder, isPreload, args, delay, name) {
        var _this = this;
        void 0 === zOrder && (zOrder = 0);
        return new Promise(function(reslove, reject) {
          if (!uiClass) {
            true;
            cc.log(_this._logTag + "open ui class error");
            reslove(null);
            return;
          }
          var className = cc.js.getClassName(uiClass);
          var canvas = _this.getCanvas();
          if (!canvas) {
            true;
            cc.error(_this._logTag + "\u627e\u4e0d\u5230\u573a\u666f\u7684Canvas\u8282\u70b9");
            reslove(null);
            return;
          }
          var viewData = _this.getViewData(uiClass);
          if (viewData) {
            viewData.isPreload = isPreload;
            if (viewData.isLoaded) {
              viewData.status = Defines_1.ViewStatus.WAITTING_NONE;
              if (!isPreload && viewData.view && cc.isValid(viewData.node)) {
                viewData.node.zIndex = zOrder;
                viewData.node.parent || (viewData.node.parent = _this.getCanvas());
                Framework_1.Manager.resolutionHelper.fullScreenAdapt(viewData.node);
                viewData.view.show(args);
              }
              reslove(viewData.view);
              return;
            }
            viewData.status = Defines_1.ViewStatus.WAITTING_NONE;
            isPreload || Framework_1.Manager.uiLoading.show(delay, name);
            true;
            cc.warn("" + _this._logTag + className + " \u6b63\u5728\u52a0\u8f7d\u4e2d...");
            viewData.finishCb.push(reslove);
            return;
          }
          viewData = new ViewData();
          viewData.loadData.name = className;
          var prefabUrl_1 = uiClass.getPrefabUrl();
          viewData.isPreload = isPreload;
          _this._viewDatas.set(className, viewData);
          var progressCallback = null;
          if (!isPreload) {
            Framework_1.Manager.uiLoading.show(delay, name);
            progressCallback = function(completedCount, totalCount, item) {
              var progress = Math.ceil(completedCount / totalCount * 100);
              Framework_1.Manager.uiLoading.updateProgress(progress);
            };
          }
          _this.loadPrefab(bundle, prefabUrl_1, progressCallback).then(function(prefab) {
            viewData.info = new Defines_1.ResourceInfo();
            viewData.info.url = prefabUrl_1;
            viewData.info.type = cc.Prefab;
            viewData.info.data = prefab;
            viewData.info.bundle = bundle;
            Framework_1.Manager.assetManager.retainAsset(viewData.info);
            _this.createNode(className, uiClass, reslove, prefab, args, zOrder, bundle);
            Framework_1.Manager.uiLoading.hide();
          }).catch(function(reason) {
            viewData.isLoaded = true;
            cc.error(reason);
            _this.close(uiClass);
            viewData.doCallback(null, className, "\u6253\u5f00\u754c\u9762\u5f02\u5e38");
            reslove(null);
            var uiName = "";
            true;
            uiName = className;
            name && (uiName = name);
            Framework_1.Manager.tips.show("\u52a0\u8f7d\u754c\u9762" + uiName + "\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5");
            Framework_1.Manager.uiLoading.hide();
          });
        });
      };
      UIManager.prototype._addComponent = function(uiNode, uiClass, viewData, className, zOrder, args, bundle) {
        if (uiNode) {
          var view = uiNode.getComponent(uiClass);
          if (!view) {
            view = uiNode.addComponent(uiClass);
            if (!view) {
              true;
              cc.error(this._logTag + "\u6302\u8f7d\u811a\u672c\u5931\u8d25 : " + className);
              return null;
            }
            true;
            cc.log(this._logTag + "\u6302\u8f7d\u811a\u672c : " + className);
          }
          Framework_1.Manager.resolutionHelper.fullScreenAdapt(uiNode);
          view.className = className;
          view.bundle = bundle;
          viewData.view = view;
          view._args = args;
          var widget = view.getComponent(cc.Widget);
          if (widget) {
            true;
            cc.warn(this._logTag + "\u4f60\u5df2\u7ecf\u6dfb\u52a0\u4e86cc.Widget\u7ec4\u4ef6\uff0c\u5c06\u4f1a\u66f4\u6539\u6210\u5c45\u4e2d\u6a21\u5757");
            widget.isAlignHorizontalCenter = true;
            widget.horizontalCenter = 0;
            widget.isAlignVerticalCenter = true;
            widget.verticalCenter = 0;
          } else {
            widget = view.addComponent(cc.Widget);
            widget.isAlignHorizontalCenter = true;
            widget.horizontalCenter = 0;
            widget.isAlignVerticalCenter = true;
            widget.verticalCenter = 0;
          }
          if (!viewData.isPreload) {
            uiNode.parent = this.getCanvas();
            uiNode.zIndex = zOrder;
          }
          return view;
        }
        return null;
      };
      UIManager.prototype.createNode = function(className, uiClass, reslove, data, args, zOrder, bundle) {
        var viewData = this._viewDatas.get(className);
        viewData.isLoaded = true;
        if (viewData.status == Defines_1.ViewStatus.WAITTING_CLOSE) {
          reslove(null);
          true;
          cc.warn("" + this._logTag + className + "\u6b63\u7b49\u5f85\u5173\u95ed");
          viewData.doCallback(null, className, "\u83b7\u53d6\u754c\u5185\u5df2\u7ecf\u5173\u95ed");
          return;
        }
        var uiNode = cc.instantiate(data);
        viewData.node = uiNode;
        var view = this._addComponent(uiNode, uiClass, viewData, className, zOrder, args, bundle);
        if (!view) {
          reslove(null);
          return;
        }
        if (viewData.status == Defines_1.ViewStatus.WATITING_HIDE) {
          view.hide();
          true;
          cc.warn(this._logTag + "\u52a0\u8f7d\u8fc7\u7a0b\u9690\u85cf\u4e86\u754c\u9762" + className);
          reslove(view);
          viewData.doCallback(view, className, "\u52a0\u8f7d\u5b8c\u6210\uff0c\u4f46\u52a0\u8f7d\u8fc7\u7a0b\u4e2d\u88ab\u9690\u85cf");
        } else {
          true;
          cc.log(this._logTag + "open view : " + className);
          viewData.isPreload || view.show(args);
          reslove(view);
          viewData.doCallback(view, className, "\u52a0\u8f7d\u5b8c\u6210\uff0c\u56de\u8c03\u4e4b\u524d\u52a0\u8f7d\u4e2d\u7684\u754c\u9762");
        }
      };
      UIManager.prototype.loadPrefab = function(bundle, url, progressCallback) {
        return new Promise(function(resolove, reject) {
          void 0 != bundle && "" != bundle && null != bundle || (bundle = Defines_1.BUNDLE_RESOURCES);
          Framework_1.Manager.assetManager.load(bundle, url, cc.Prefab, progressCallback, function(data) {
            data && data.data && data.data instanceof cc.Prefab ? resolove(data.data) : reject("\u52a0\u8f7dprefab : " + url + " \u5931\u8d25");
          });
        });
      };
      UIManager.prototype.getCanvas = function() {
        var rootScene = cc.director.getScene();
        if (!rootScene) {
          true;
          cc.error(this._logTag + "\u5f53\u524d\u573a\u666f\u4e3a\u7a7a \uff1a " + cc.director.getScene().name);
          return null;
        }
        var root = rootScene.getChildByName("Canvas");
        if (!root) {
          true;
          cc.error(this._logTag + "\u5f53\u524d\u573a\u666f\u4e0a\u627e\u4e0d\u5230 Canvas \u8282\u70b9");
          return null;
        }
        return root;
      };
      UIManager.prototype.addLocal = function(info, className) {
        if (info) {
          var viewData = this.getViewData(className);
          viewData && viewData.loadData.addLocal(info, className);
        }
      };
      UIManager.prototype.addRemote = function(info, className) {
        if (info) {
          var viewData = this.getViewData(className);
          viewData && viewData.loadData.addRemote(info, className);
        }
      };
      UIManager.prototype.close = function(data) {
        var viewData = this.getViewData(data);
        if (viewData) {
          viewData.status = Defines_1.ViewStatus.WAITTING_CLOSE;
          if (viewData.view && cc.isValid(viewData.node)) {
            viewData.node.removeFromParent(true);
            viewData.node.destroy();
          }
          viewData.loadData.clear();
          var className = this.getClassName(data);
          Framework_1.Manager.assetManager.releaseAsset(viewData.info);
          this._viewDatas.delete(className);
          cc.log(this._logTag + " close view : " + className);
        }
      };
      UIManager.prototype.closeExcept = function(views) {
        var self = this;
        if (void 0 == views || null == views || 0 == views.length) {
          true;
          cc.error("\u8bf7\u68c0\u67e5\u53c2\u6570\uff0c\u81f3\u5c11\u9700\u8981\u4fdd\u7559\u4e00\u4e2a\u754c\u9762\uff0c\u4e0d\u7136\u5c31\u9ed1\u5c4f\u4e86\uff0c\u5927\u5144\u5f1f");
          this._viewDatas.forEach(function(viewData, key) {
            self.close(key);
          });
          return;
        }
        var viewClassNames = new Set();
        for (var i = 0; i < views.length; i++) viewClassNames.add(this.getClassName(views[i]));
        this._viewDatas.forEach(function(viewData, key) {
          if (viewClassNames.has(key)) return;
          self.close(key);
        });
        this.printViews();
      };
      UIManager.prototype.hide = function(data) {
        var viewData = this.getViewData(data);
        if (viewData) if (viewData.isLoaded) {
          viewData.view && cc.isValid(viewData.view.node) && viewData.view.hide();
          true;
          cc.log(this._logTag + "hide view : " + viewData.loadData.name);
        } else viewData.status = Defines_1.ViewStatus.WATITING_HIDE;
      };
      UIManager.prototype.getView = function(data) {
        var _this = this;
        return new Promise(function(resolove, reject) {
          if (void 0 == data || null == data) {
            resolove(null);
            return;
          }
          var viewData = _this.getViewData(data);
          viewData ? viewData.isPreload ? resolove(null) : viewData.isLoaded ? resolove(viewData.view) : viewData.getViewCb.push(resolove) : resolove(null);
        });
      };
      UIManager.prototype.checkView = function(url, className) {
        var _this = this;
        (true, className) && this.getView(className).then(function(view) {
          if (!view) {
            var viewData = _this.getViewData(className);
            viewData && viewData.isPreload || cc.error("\u8d44\u6e90 : " + url + " \u7684\u6301\u6709\u8005\u5fc5\u987b\u7531UIManager.open\u65b9\u5f0f\u6253\u5f00");
          }
        });
      };
      UIManager.prototype.isShow = function(data) {
        var viewData = this.getViewData(data);
        if (!viewData) return false;
        if (viewData.isLoaded && viewData.status == Defines_1.ViewStatus.WAITTING_NONE && viewData.view) return viewData.view.node.active;
        return false;
      };
      UIManager.prototype.fullScreenAdapt = function() {
        this._viewDatas.forEach(function(data) {
          data.isLoaded && data.view && Framework_1.Manager.resolutionHelper.fullScreenAdapt(data.view.node);
        });
      };
      UIManager.prototype.getCanvasComponent = function() {
        return this.getCanvas().getComponent("MainController");
      };
      UIManager.prototype.addComponent = function(data) {
        var canvas = this.getCanvas();
        if (canvas) {
          var component = canvas.getComponent(data);
          if (component) {
            if ("string" == typeof data) {
              true;
              cc.warn(this._logTag + "\u5df2\u7ecf\u5b58\u5728 Component " + component);
            } else {
              true;
              cc.warn(this._logTag + "\u5df2\u7ecf\u5b58\u5728 Component " + cc.js.getClassName(data));
            }
            return component;
          }
          return canvas.addComponent(data);
        }
        return null;
      };
      UIManager.prototype.removeComponent = function(component) {
        var canvas = this.getCanvas();
        canvas && canvas.removeComponent(component);
      };
      UIManager.prototype.printViews = function() {
        cc.log(this._logTag + "---------views----start-----");
        this._viewDatas.forEach(function(value, key) {
          cc.log("[" + key + "] isLoaded : " + value.isLoaded + " status : " + value.status + " view : " + value.view + " active : " + (!(!value.view || !value.view.node) && value.view.node.active));
        });
        cc.log(this._logTag + "---------views----end-----");
      };
      UIManager.prototype.printCanvasChildren = function() {
        cc.log(this._logTag + "-----------printCanvasChildren--start-----------");
        var canvas = this.getCanvas();
        if (canvas) {
          var children = canvas.children;
          for (var i = 0; i < children.length; i++) cc.log(children[i].name + " active : " + children[i].active);
        }
        cc.log(this._logTag + "-----------printCanvasChildren--end-----------");
      };
      UIManager.prototype.printComponent = function() {
        var canvas = this.getCanvas();
        if (canvas) {
          var comps = canvas._components;
          cc.log(this._logTag + " -------------- print component start --------------");
          for (var i = 0; i < comps.length; i++) cc.log(cc.js.getClassName(comps[i]));
          cc.log(this._logTag + " -------------- print component end --------------");
        }
      };
      UIManager._instance = null;
      return UIManager;
    }();
    exports.UIManager = UIManager;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "./Defines": "Defines"
  } ],
  UIView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3ab94+tF5hMG5+UXd1Yf5M5", "UIView");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventComponent_1 = require("../base/EventComponent");
    var AudioComponent_1 = require("../base/AudioComponent");
    var Framework_1 = require("../Framework");
    var Singleton_1 = require("../base/Singleton");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var UIView = function(_super) {
      __extends(UIView, _super);
      function UIView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._isEnableKey = false;
        _this._args = null;
        _this._presenterAny = null;
        _this._content = null;
        _this._className = "unknow";
        _this._bundle = null;
        _this.audioHelper = null;
        _this._enterBackgroundTime = 0;
        _this._enableFrontAndBackgroundSwitch = false;
        return _this;
      }
      UIView.getPrefabUrl = function() {
        true;
        cc.error("\u8bf7\u6c42\u5b9e\u73b0public static getPrefabUrl");
        return "unknown";
      };
      Object.defineProperty(UIView.prototype, "args", {
        get: function() {
          return this._args;
        },
        enumerable: false,
        configurable: true
      });
      UIView.prototype.find = function(path, referenceNode) {
        return referenceNode ? cc.find(path, referenceNode) : this.content ? cc.find(path, this.content) : cc.find(path, referenceNode);
      };
      Object.defineProperty(UIView.prototype, "presenterAny", {
        get: function() {
          var __presenter_type__ = Reflect.getPrototypeOf(this)["__presenter_type__"];
          if (__presenter_type__) {
            if (__presenter_type__.Instance) return Singleton_1.getSingleton(__presenter_type__);
            if (this._presenterAny) return this._presenterAny;
            this._presenterAny = new __presenter_type__();
            return this._presenterAny;
          }
          true;
          cc.error("\u8bf7\u5148\u4f7f\u7528injectPresenter\u6ce8\u5165Presenter");
          return null;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(UIView.prototype, "content", {
        get: function() {
          return this._content;
        },
        set: function(value) {
          this._content = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(UIView.prototype, "className", {
        get: function() {
          return this._className;
        },
        set: function(value) {
          this._className = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(UIView.prototype, "bundle", {
        get: function() {
          return this._bundle;
        },
        set: function(value) {
          this._bundle = value;
        },
        enumerable: false,
        configurable: true
      });
      UIView.prototype.close = function() {
        Framework_1.Manager.uiManager.close(this.className);
      };
      UIView.prototype.show = function(args) {
        this._args = args;
        this.node && (this.node.active = true);
      };
      UIView.prototype.hide = function() {
        this.node && this.node.removeFromParent(false);
      };
      UIView.prototype.showWithAction = function(isOverrideShow, completeCallback) {
        void 0 === isOverrideShow && (isOverrideShow = false);
        if (this.content) {
          isOverrideShow || this.show(this.args);
          this.content.stopAllActions();
          cc.tween(this.content).set({
            scale: .2
          }).to(.2, {
            scale: 1.15
          }).delay(.05).to(.1, {
            scale: 1
          }).call(function() {
            completeCallback && completeCallback();
          }).start();
        }
      };
      UIView.prototype.hideWithAction = function(completeCallback) {
        var _this = this;
        if (this.content) {
          this.content.stopAllActions();
          cc.tween(this.content).to(.2, {
            scale: 1.15
          }).to(.1, {
            scale: .3
          }).call(function() {
            _this.hide();
            _this.content.scale = 1;
            completeCallback && completeCallback();
          }).start();
        }
      };
      UIView.prototype.closeWithAction = function(completeCallback) {
        var _this = this;
        if (this.content) {
          this.content.stopAllActions();
          cc.tween(this.content).to(.2, {
            scale: 1.15
          }).to(.1, {
            scale: .3
          }).call(function() {
            completeCallback && completeCallback();
            _this.close();
          }).start();
        }
      };
      UIView.prototype.setEnabledKeyBack = function(isEnabled) {
        if (isEnabled) {
          cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        } else cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this._isEnableKey = isEnabled;
      };
      UIView.prototype.isEnabledKeyBack = function() {
        return this._isEnableKey;
      };
      UIView.prototype.onKeyUp = function(ev) {
        true;
        cc.log("[" + cc.js.getClassName(this) + "] onKeyUp keyCode : " + ev.keyCode);
        ev.keyCode == cc.macro.KEY.escape ? this.onKeyBack(ev) : ev.stopPropagation();
      };
      UIView.prototype.onKeyBack = function(ev) {
        ev.stopPropagation();
      };
      UIView.prototype.onLoad = function() {
        this.audioHelper = this.addComponent(AudioComponent_1.default);
        this.audioHelper.owner = this;
        _super.prototype.onLoad.call(this);
      };
      UIView.prototype.onDestroy = function() {
        this.setEnabledKeyBack(false);
        this.enableFrontAndBackgroundSwitch = false;
        this._presenterAny = null;
        _super.prototype.onDestroy.call(this);
      };
      Object.defineProperty(UIView.prototype, "enableFrontAndBackgroundSwitch", {
        get: function() {
          return this._enableFrontAndBackgroundSwitch;
        },
        set: function(value) {
          this._enableFrontAndBackgroundSwitch = value;
          if (value) {
            cc.game.on(cc.game.EVENT_SHOW, this._onEnterForgeGround, this);
            cc.game.on(cc.game.EVENT_HIDE, this._onEnterBackground, this);
          } else {
            cc.game.off(cc.game.EVENT_SHOW, this._onEnterForgeGround, this);
            cc.game.off(cc.game.EVENT_HIDE, this._onEnterBackground, this);
          }
        },
        enumerable: false,
        configurable: true
      });
      UIView.prototype._onEnterBackground = function() {
        this._enterBackgroundTime = Date.timeNow();
        this.onEnterBackground();
      };
      UIView.prototype._onEnterForgeGround = function() {
        var now = Date.timeNow();
        var inBackgroundTime = now - this._enterBackgroundTime;
        this.onEnterForgeground(inBackgroundTime);
      };
      UIView.prototype.onEnterForgeground = function(inBackgroundTime) {};
      UIView.prototype.onEnterBackground = function() {};
      UIView = __decorate([ ccclass ], UIView);
      return UIView;
    }(EventComponent_1.default);
    exports.default = UIView;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "../base/AudioComponent": "AudioComponent",
    "../base/EventComponent": "EventComponent",
    "../base/Singleton": "Singleton"
  } ],
  Utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4b839bYlRdMVqgOZ6FF4A6j", "Utils");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.createNodeWithPrefab = exports.setSkeletonSkeletonData = exports.setLabelFont = exports.setParticleSystemFile = exports.setButtonSpriteFrame = exports.ButtonSpriteMemberName = exports.setSpriteSpriteFrame = exports.getBundle = exports.addRemoteLoadResource = exports.addExtraLoadResource = void 0;
    var UIView_1 = require("../ui/UIView");
    var Defines_1 = require("../base/Defines");
    var Framework_1 = require("../Framework");
    function addExtraLoadResource(view, info) {
      var uiManager = Framework_1.Manager.uiManager;
      view == uiManager.retainMemory ? uiManager.retainMemory.addLocal(info) : view && view instanceof UIView_1.default ? uiManager.addLocal(info, view.className) : uiManager.garbage.addLocal(info);
    }
    exports.addExtraLoadResource = addExtraLoadResource;
    function addRemoteLoadResource(view, info) {
      var uiManager = Framework_1.Manager.uiManager;
      view == uiManager.retainMemory ? uiManager.retainMemory.addRemote(info) : view && view instanceof UIView_1.default ? uiManager.addRemote(info, view.className) : uiManager.garbage.addRemote(info);
    }
    exports.addRemoteLoadResource = addRemoteLoadResource;
    function getBundle(config) {
      var bundle = config.bundle;
      if (void 0 == config.bundle || null == config.bundle) {
        bundle = Defines_1.BUNDLE_RESOURCES;
        config.view && (bundle = config.view.bundle);
      }
      return bundle;
    }
    exports.getBundle = getBundle;
    function isValidComponent(component) {
      if (cc.isValid(component) && component.node && cc.isValid(component.node)) return true;
      return false;
    }
    function setSpriteSpriteFrame(view, url, sprite, spriteFrame, completeCallback, bundle, resourceType, retain, isAtlas) {
      void 0 === resourceType && (resourceType = Defines_1.ResourceType.Local);
      void 0 === retain && (retain = false);
      void 0 === isAtlas && (isAtlas = false);
      if (!isAtlas) {
        var info = new Defines_1.ResourceInfo();
        info.url = url;
        info.type = cc.SpriteFrame;
        info.data = spriteFrame;
        info.retain = retain;
        info.bundle = bundle;
        resourceType == Defines_1.ResourceType.Remote ? addRemoteLoadResource(view, info) : addExtraLoadResource(view, info);
      }
      if (spriteFrame && isValidComponent(sprite)) {
        var oldSpriteFrame = sprite.spriteFrame;
        var replaceData = cc.isValid(spriteFrame) ? spriteFrame : null;
        try {
          replaceData && (sprite.spriteFrame = replaceData);
          completeCallback && completeCallback(replaceData);
        } catch (error) {
          var temp = cc.isValid(oldSpriteFrame) ? oldSpriteFrame : null;
          sprite.spriteFrame = temp;
          completeCallback && completeCallback(null);
          cc.error(url + " : " + (error || "replace spriteframe error"));
        }
      } else completeCallback && isValidComponent(sprite) && completeCallback(spriteFrame);
    }
    exports.setSpriteSpriteFrame = setSpriteSpriteFrame;
    var ButtonSpriteMemberName;
    (function(ButtonSpriteMemberName) {
      ButtonSpriteMemberName["Norml"] = "normalSprite";
      ButtonSpriteMemberName["Pressed"] = "pressedSprite";
      ButtonSpriteMemberName["Hover"] = "hoverSprite";
      ButtonSpriteMemberName["Disable"] = "disabledSprite";
    })(ButtonSpriteMemberName = exports.ButtonSpriteMemberName || (exports.ButtonSpriteMemberName = {}));
    function _setSpriteFrame(view, url, button, spriteFrame, memberName, completeCallback, isAtlas, bundle) {
      if (!isAtlas) {
        var info = new Defines_1.ResourceInfo();
        info.url = url;
        info.type = cc.SpriteFrame;
        info.data = spriteFrame;
        info.bundle = bundle;
        addExtraLoadResource(view, info);
      }
      if (spriteFrame && isValidComponent(button)) {
        var oldSpriteFrame = button[memberName];
        try {
          var replaceData = cc.isValid(spriteFrame) ? spriteFrame : null;
          replaceData && (button[memberName] = replaceData);
          completeCallback && completeCallback(memberName, replaceData);
        } catch (error) {
          var temp = cc.isValid(oldSpriteFrame) ? oldSpriteFrame : null;
          button[memberName] = temp;
          completeCallback && completeCallback(memberName, null);
          cc.error(url + " : " + (error || "replace spriteframe error"));
        }
      } else completeCallback && isValidComponent(button) && completeCallback(memberName, spriteFrame);
    }
    function _setButtonSpriteFrame(button, memberName, view, url, spriteFrame, completeCallback, bundle, isAtlas) {
      void 0 === isAtlas && (isAtlas = false);
      spriteFrame && isValidComponent(button) ? _setSpriteFrame(view, url, button, spriteFrame, memberName, completeCallback, isAtlas, bundle) : completeCallback && isValidComponent(button) && completeCallback(memberName, spriteFrame);
    }
    function _setButtonWithType(button, memberName, view, url, completeCallback, bundle) {
      url && ("string" == typeof url ? Framework_1.Manager.cacheManager.getCacheByAsync(url, cc.SpriteFrame, bundle).then(function(spriteFrame) {
        _setButtonSpriteFrame(button, memberName, view, url, spriteFrame, completeCallback, bundle);
      }) : Framework_1.Manager.cacheManager.getSpriteFrameByAsync(url.urls, url.key, view, addExtraLoadResource, bundle).then(function(data) {
        data && data.isTryReload || _setButtonSpriteFrame(button, memberName, view, data.url, data.spriteFrame, completeCallback, bundle, true);
      }));
    }
    function setButtonSpriteFrame(button, config) {
      var bundle = getBundle(config);
      _setButtonWithType(button, ButtonSpriteMemberName.Norml, config.view, config.normalSprite, config.completeCallback, bundle);
      _setButtonWithType(button, ButtonSpriteMemberName.Pressed, config.view, config.pressedSprite, config.completeCallback, bundle);
      _setButtonWithType(button, ButtonSpriteMemberName.Hover, config.view, config.hoverSprite, config.completeCallback, bundle);
      _setButtonWithType(button, ButtonSpriteMemberName.Disable, config.view, config.disabledSprite, config.completeCallback, bundle);
    }
    exports.setButtonSpriteFrame = setButtonSpriteFrame;
    function setParticleSystemFile(component, config, data) {
      var info = new Defines_1.ResourceInfo();
      info.url = config.url;
      info.type = cc.ParticleAsset;
      info.data = data;
      info.bundle = getBundle(config);
      addExtraLoadResource(config.view, info);
      if (data && isValidComponent(component)) {
        var oldFile = component.file;
        try {
          var replaceData = cc.isValid(data) ? data : null;
          replaceData && (component.file = replaceData);
          config.completeCallback && config.completeCallback(replaceData);
        } catch (error) {
          var temp = cc.isValid(oldFile) ? oldFile : null;
          component.file = temp;
          config.completeCallback && config.completeCallback(null);
          cc.error(config.url + " : " + (error || "replace file error"));
        }
      } else config.completeCallback && isValidComponent(component) && config.completeCallback(data);
    }
    exports.setParticleSystemFile = setParticleSystemFile;
    function setLabelFont(component, config, data) {
      var info = new Defines_1.ResourceInfo();
      info.url = config.font;
      info.type = cc.Font;
      info.data = data;
      info.bundle = getBundle(config);
      addExtraLoadResource(config.view, info);
      if (data && isValidComponent(component)) {
        var oldFont = component.font;
        try {
          var replaceData = cc.isValid(data) ? data : null;
          replaceData && (component.font = replaceData);
          config.completeCallback && config.completeCallback(replaceData);
        } catch (error) {
          var temp = cc.isValid(oldFont) ? oldFont : null;
          component.font = temp;
          config.completeCallback && config.completeCallback(null);
          cc.error(config.font + " : " + (error || "replace font error"));
        }
      } else config.completeCallback && isValidComponent(component) && config.completeCallback(data);
    }
    exports.setLabelFont = setLabelFont;
    function setSkeletonSkeletonData(component, config, data, resourceType) {
      void 0 === resourceType && (resourceType = Defines_1.ResourceType.Local);
      var url = "";
      var retain = false;
      if (resourceType == Defines_1.ResourceType.Remote) {
        var realConfig = config;
        url = realConfig.path + "/" + realConfig.name;
        retain = !!realConfig.retain;
      } else {
        var realConfig = config;
        url = realConfig.url;
      }
      var info = new Defines_1.ResourceInfo();
      info.url = url;
      info.type = sp.SkeletonData;
      info.data = data;
      info.retain = retain;
      info.bundle = getBundle(config);
      if (resourceType == Defines_1.ResourceType.Remote) {
        info.bundle = Defines_1.BUNDLE_REMOTE;
        addRemoteLoadResource(config.view, info);
      } else addExtraLoadResource(config.view, info);
      if (data && isValidComponent(component)) {
        var oldSkeletonData = component.skeletonData;
        try {
          var replaceData = cc.isValid(data) ? data : null;
          replaceData && (component.skeletonData = replaceData);
          config.completeCallback && config.completeCallback(replaceData);
        } catch (error) {
          var temp = cc.isValid(oldSkeletonData) ? oldSkeletonData : null;
          component.skeletonData = temp;
          config.completeCallback && config.completeCallback(null);
          cc.error(url + " : " + (error || "replace skeletonData error"));
        }
      } else config.completeCallback && isValidComponent(component) && config.completeCallback(data);
    }
    exports.setSkeletonSkeletonData = setSkeletonSkeletonData;
    function createNodeWithPrefab(config, data) {
      var info = new Defines_1.ResourceInfo();
      info.url = config.url;
      info.type = cc.Prefab;
      info.data = data;
      info.bundle = getBundle(config);
      addExtraLoadResource(config.view, info);
      if (data && isValidComponent(config.view) && config.completeCallback) {
        var node = cc.instantiate(data);
        config.completeCallback(node);
      }
    }
    exports.createNodeWithPrefab = createNodeWithPrefab;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "../base/Defines": "Defines",
    "../ui/UIView": "UIView"
  } ],
  WebEditBoxImpl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6b85ddpujtPSp3HN9JmW+36", "WebEditBoxImpl");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Framework_1 = require("../Framework");
    var WebEditBoxHelper = function() {
      function WebEditBoxHelper() {
        this.input = null;
        this.textarea = null;
        this.div = null;
      }
      Object.defineProperty(WebEditBoxHelper, "instance", {
        get: function() {
          return this._instance || (this._instance = new WebEditBoxHelper());
        },
        enumerable: false,
        configurable: true
      });
      WebEditBoxHelper.prototype.init = function() {
        if (null == this.div) {
          var div = window.document.createElement("div");
          div.style.width = "100%";
          div.style.height = "100%";
          div.style.margin = "0px";
          div.style.position = "absolute";
          div.style.zIndex = "1000";
          div.style.bottom = "0px";
          div.style.left = "0px";
          div.style.backgroundColor = "#000";
          div.style.opacity = "0.5";
          div.style.visibility = "hidden";
          div.id = "input_background";
          cc.game.container.appendChild(div);
          this.div = div;
        }
        if (null == this.input) {
          var input = window.document.createElement("input");
          input.style.zIndex = "1001";
          input.id = "EditBox_Input";
          input.style.visibility = "hidden";
          input.style.width = "98%";
          input.style.height = "30px";
          input.style.border = "2px";
          input.style.borderColor = "blue";
          input.style.position = "absolute";
          input.style.top = "5px";
          input.style.left = "1%";
          input.style.borderRadius = "5px";
          input.style.fontSize = "25px";
          input.style.type = "text";
          input.style["-moz-appearance"] = "textfield";
          cc.game.container.appendChild(input);
          this.input = input;
        }
        if (null == this.textarea) {
          var textarea = window.document.createElement("textarea");
          textarea.style.zIndex = "1001";
          textarea.id = "EditBox_Textarea";
          textarea.style.visibility = "hidden";
          textarea.style.width = "98%";
          textarea.style.height = "50px";
          textarea.style.border = "2px";
          textarea.style.borderColor = "blue";
          textarea.style.position = "absolute";
          textarea.style.top = "5px";
          textarea.style.left = "1%";
          textarea.style.borderRadius = "5px";
          textarea.style.resize = "none";
          textarea.style.fontSize = "25px";
          textarea.style.overflow_y = "scroll";
          textarea.style.overflowY = "scroll";
          cc.game.container.appendChild(textarea);
          this.textarea = textarea;
        }
        window.addEventListener("orientationchange", this.onOrientationChange.bind(this), false);
        this.hideDom();
      };
      WebEditBoxHelper.prototype.onOrientationChange = function() {
        this.input && this.input.blur();
        this.textarea && this.textarea.blur();
      };
      WebEditBoxHelper.prototype.adjust = function(rotate) {
        if (0 == rotate || 180 == rotate) {
          var height = parseInt(cc.game.container.style.height);
          var rate = .9;
          var width = height * rate;
          if (this.input) {
            this.input.style.width = width + "px";
            this.input.style.top = width / 2 + "px";
            this.input.style.transform = "rotate(-90deg)";
            this.input.style.left = "-" + (width / 2 - 30) + "px";
          }
          if (this.textarea) {
            this.textarea.style.width = width + "px";
            this.textarea.style.top = width / 2 + "px";
            this.textarea.style.transform = "rotate(-90deg)";
            this.textarea.style.left = "-" + (width - 50) + "px";
          }
        } else {
          if (this.input) {
            this.input.style.width = "98%";
            this.input.style.top = "5px";
            this.input.style.transform = "rotate(0deg)";
            this.input.style.left = "1%";
          }
          if (this.textarea) {
            this.textarea.style.width = "98%";
            this.textarea.style.top = "5px";
            this.textarea.style.transform = "rotate(0deg)";
            this.textarea.style.left = "1%";
          }
        }
      };
      WebEditBoxHelper.prototype.createTextArea = function() {
        return this.textarea;
      };
      WebEditBoxHelper.prototype.createInput = function() {
        return this.input;
      };
      WebEditBoxHelper.prototype.hideDom = function() {
        this.div && (this.div.style.visibility = "hidden");
        this.input && (this.input.style.visibility = "hidden");
        this.textarea && (this.textarea.style.visibility = "hidden");
      };
      WebEditBoxHelper.prototype.showDom = function(isTextArea) {
        if (this.input && this.textarea) {
          this.div && (this.div.style.visibility = "visible");
          this.input.style.visibility = isTextArea ? "hidden" : "visible";
          this.textarea.style.visibility = isTextArea ? "visible" : "hidden";
          this.adjust(window.orientation);
        }
      };
      WebEditBoxHelper._instance = null;
      return WebEditBoxHelper;
    }();
    var WebEditBoxImpl = function() {
      function WebEditBoxImpl() {
        this._delegate = null;
        this._elem = null;
        this._isTextArea = false;
        this._eventListeners = {};
        this._isFocus = false;
      }
      WebEditBoxImpl.prototype.init = function(delegate) {
        if (!delegate) return;
        this._delegate = delegate;
        WebEditBoxHelper.instance.init();
        delegate.inputMode === cc.EditBox.InputMode.ANY ? this._createTextArea() : this._createInput();
      };
      WebEditBoxImpl.prototype.enable = function() {};
      WebEditBoxImpl.prototype.disable = function() {
        this._isFocus && this._elem.blur();
      };
      WebEditBoxImpl.prototype.clear = function() {
        if (this._isFocus) {
          this._removeEventListeners();
          WebEditBoxHelper.instance.hideDom();
        }
      };
      WebEditBoxImpl.prototype.update = function() {};
      WebEditBoxImpl.prototype.setTabIndex = function(index) {};
      WebEditBoxImpl.prototype.setSize = function(width, height) {};
      WebEditBoxImpl.prototype.setFocus = function(value) {
        value ? this.beginEditing() : this._isFocus = false;
      };
      WebEditBoxImpl.prototype.isFocused = function() {
        return this._isFocus;
      };
      WebEditBoxImpl.prototype.beginEditing = function() {
        this._isFocus = true;
        Framework_1.Manager.resolutionHelper.isShowKeyboard = true;
        this._showDom();
        this._registerEventListeners();
        this._elem.focus();
        this._delegate.editBoxEditingDidBegan();
      };
      WebEditBoxImpl.prototype.endEditing = function() {};
      WebEditBoxImpl.prototype._createTextArea = function() {
        this._isTextArea = true;
        this._elem = WebEditBoxHelper.instance.createTextArea();
      };
      WebEditBoxImpl.prototype._createInput = function() {
        this._isTextArea = false;
        this._elem = WebEditBoxHelper.instance.createInput();
      };
      WebEditBoxImpl.prototype._showDom = function() {
        WebEditBoxHelper.instance.showDom(this._isTextArea);
        this._updateMaxLength();
        this._updateInputType();
        this._updateStyleSheet();
      };
      WebEditBoxImpl.prototype._hideDom = function() {
        this._isFocus && WebEditBoxHelper.instance.hideDom();
      };
      WebEditBoxImpl.prototype._updateInputType = function() {
        var delegate = this._delegate, inputMode = delegate.inputMode, inputFlag = delegate.inputFlag, returnType = delegate.returnType, elem = this._elem;
        if (this._isTextArea) {
          var textTransform_1 = "none";
          inputFlag === cc.EditBox.InputFlag.INITIAL_CAPS_ALL_CHARACTERS ? textTransform_1 = "uppercase" : inputFlag === cc.EditBox.InputFlag.INITIAL_CAPS_WORD && (textTransform_1 = "capitalize");
          elem.style.textTransform = textTransform_1;
          return;
        }
        if (inputFlag === cc.EditBox.InputFlag.PASSWORD) {
          elem.type = "password";
          return;
        }
        var type = elem.type;
        if (inputMode === cc.EditBox.InputMode.EMAIL_ADDR) type = "email"; else if (inputMode === cc.EditBox.InputMode.NUMERIC || inputMode === cc.EditBox.InputMode.DECIMAL) type = "number"; else if (inputMode === cc.EditBox.InputMode.PHONE_NUMBER) {
          type = "number";
          elem.pattern = "[0-9]*";
        } else if (inputMode === cc.EditBox.InputMode.URL) type = "url"; else {
          type = "text";
          returnType === cc.EditBox.KeyboardReturnType.SEARCH && (type = "search");
        }
        elem.type = type;
        var textTransform = "none";
        inputFlag === cc.EditBox.InputFlag.INITIAL_CAPS_ALL_CHARACTERS ? textTransform = "uppercase" : inputFlag === cc.EditBox.InputFlag.INITIAL_CAPS_WORD && (textTransform = "capitalize");
        elem.style.textTransform = textTransform;
      };
      WebEditBoxImpl.prototype._updateMaxLength = function() {
        var maxLength = this._delegate.maxLength;
        maxLength < 0 && (maxLength = 65535);
        this._elem.maxLength = maxLength;
      };
      WebEditBoxImpl.prototype._updateStyleSheet = function() {
        var delegate = this._delegate, elem = this._elem;
        elem.value = delegate.string;
        elem.placeholder = delegate.placeholder;
      };
      WebEditBoxImpl.prototype._registerEventListeners = function() {
        var impl = this, elem = this._elem, inputLock = false, cbs = this._eventListeners;
        cbs.compositionStart = function() {
          inputLock = true;
        };
        cbs.compositionEnd = function() {
          inputLock = false;
          impl._delegate.editBoxTextChanged(elem.value);
        };
        cbs.onInput = function() {
          if (inputLock) return;
          var _elem = elem;
          _elem.value.length > _elem.maxLength && (_elem.value = _elem.value.slice(0, _elem.maxLength));
          impl._delegate.editBoxTextChanged(elem.value);
        };
        cbs.onKeydown = function(e) {
          if (e.keyCode === cc.macro.KEY.enter) {
            e.stopPropagation();
            impl._delegate.editBoxEditingReturn();
            impl._isTextArea || elem.blur();
          } else if (e.keyCode === cc.macro.KEY.tab) {
            e.stopPropagation();
            e.preventDefault();
          }
        };
        cbs.onBlur = function() {
          impl._hideDom();
          impl._isFocus = false;
          Framework_1.Manager.resolutionHelper.isShowKeyboard = false;
          impl._removeEventListeners();
          impl._delegate.editBoxEditingDidEnded();
        };
        elem.addEventListener("compositionstart", cbs.compositionStart);
        elem.addEventListener("compositionend", cbs.compositionEnd);
        elem.addEventListener("input", cbs.onInput);
        elem.addEventListener("keydown", cbs.onKeydown);
        elem.addEventListener("blur", cbs.onBlur);
        elem.addEventListener("touchstart", cbs.onClick);
      };
      WebEditBoxImpl.prototype._removeEventListeners = function() {
        var elem = this._elem, cbs = this._eventListeners;
        var len = Object.keys(cbs).length;
        if (len > 0) {
          elem.removeEventListener("compositionstart", cbs.compositionStart);
          elem.removeEventListener("compositionend", cbs.compositionEnd);
          elem.removeEventListener("input", cbs.onInput);
          elem.removeEventListener("keydown", cbs.onKeydown);
          elem.removeEventListener("blur", cbs.onBlur);
          elem.removeEventListener("touchstart", cbs.onClick);
          cbs.compositionStart = null;
          cbs.compositionEnd = null;
          cbs.onInput = null;
          cbs.onKeydown = null;
          cbs.onBlur = null;
          cbs.onClick = null;
          this._eventListeners = {};
        }
      };
      return WebEditBoxImpl;
    }();
    exports.default = WebEditBoxImpl;
    cc._RF.pop();
  }, {
    "../Framework": "Framework"
  } ],
  WebSocketClient: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "608bdGOEl5HpLe/v5W2tS4u", "WebSocketClient");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventApi_1 = require("../event/EventApi");
    var Framework_1 = require("../Framework");
    var WebSocketClinet = function() {
      function WebSocketClinet() {
        this._tag = "[WebSocketClinet]";
        this._ip = "";
        this._port = null;
        this._protocol = "wss";
        this._dataArr = [];
        this._isWaitingConnect = false;
        this._conTimeOut = 10;
        this._sendTimeOut = 10;
        this._ws = null;
        this._onOpen = null;
        this._onClose = null;
        this._onMessage = null;
        this._onError = null;
        this._closeEvent = null;
      }
      Object.defineProperty(WebSocketClinet.prototype, "connectTimeOut", {
        get: function() {
          return this._conTimeOut;
        },
        set: function(value) {
          this._conTimeOut = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(WebSocketClinet.prototype, "sendTimeOut", {
        get: function() {
          return this._sendTimeOut;
        },
        set: function(value) {
          this._sendTimeOut = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(WebSocketClinet.prototype, "onOpen", {
        get: function() {
          return this._onOpen;
        },
        set: function(value) {
          this._onOpen = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(WebSocketClinet.prototype, "onClose", {
        get: function() {
          return this._onClose;
        },
        set: function(value) {
          this._onClose = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(WebSocketClinet.prototype, "onMessage", {
        get: function() {
          return this._onMessage;
        },
        set: function(value) {
          this._onMessage = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(WebSocketClinet.prototype, "onError", {
        get: function() {
          return this._onError;
        },
        set: function(value) {
          this._onError = value;
        },
        enumerable: false,
        configurable: true
      });
      WebSocketClinet.prototype.init = function(ip, port, protocol) {
        this._ip = ip;
        this._port = port;
        this._protocol = protocol;
        this._dataArr = [];
        this._conTimeOut = 10;
        this._sendTimeOut = 10;
        this._closeEvent = null;
      };
      WebSocketClinet.prototype.connectWebSocket = function(ip, port, protocol) {
        this.init(ip, port, protocol);
        if (!this._ip) return;
        var fullUrl = protocol + "://" + this._ip;
        this._port && (fullUrl = fullUrl + ":" + this._port);
        true;
        cc.log(this._tag, "initWebSocket : " + fullUrl);
        if (true, "wss" == protocol) {
          Framework_1.Manager.wssCacertUrl || cc.error("\u8bf7\u5148\u8bbe\u7f6ewss\u7684\u8bc1\u4e66url,MainController\u811a\u672c\u4e2d\u76f4\u63a5\u6302\u8f7d\u8bc1\u4e66");
          this._ws = new WebSocket(fullUrl, [], Framework_1.Manager.wssCacertUrl);
        } else this._ws = new WebSocket(fullUrl);
        this._ws.binaryType = "arraybuffer";
        this._ws.onopen = this.__onConected.bind(this);
        this._ws.onmessage = this.__onMessage.bind(this);
        this._ws.onclose = this.__onClose.bind(this);
        this._ws.onerror = this.__onError.bind(this);
        this._ws.readyState;
      };
      WebSocketClinet.prototype.initWebSocket = function(ip, port, protocol) {
        if (void 0 == ip || null == ip || ip.length < 0) {
          true;
          cc.error(this._tag, "init websocket error ip : " + ip + " port : " + port);
          return;
        }
        if (this._ws) if (this._ws.readyState == WebSocket.CONNECTING) {
          if (this._ip == ip && this._port == port) return;
          true;
          cc.error(this._tag, "\u5f53\u524d\u6709\u6b63\u5728\u8fde\u63a5\u7684socket??");
        } else if (this._ws.readyState == WebSocket.OPEN) if (this._ip == ip && this._port == port) {
          true;
          cc.warn(this._tag, "\u5f53\u524d\u8fde\u63a5\u5df2\u7ecf\u662f\u6253\u5f00\u7684\uff0c\u4e0d\u91cd\u590d\u8fde\u63a5");
        } else {
          true;
          cc.error(this._tag, "\u5f53\u524d\u5df2\u7ecf\u5b58\u5728\u8fde\u63a5\uff0c\u8bf7\u5148\u5173\u95ed" + this._ip + ":" + this._port + " \u518d\u8fde\u63a5 " + ip + " : " + port);
        } else if (this._ws.readyState == WebSocket.CLOSING) {
          this._isWaitingConnect = true;
          this._ip = ip;
          this._port = port;
          true;
          cc.warn(this._tag, "\u5f53\u524d\u7f51\u7edc\u5173\u95ed\u8fde\u63a5\u4e2d\uff0c\u5173\u95ed\u5b8c\u6210\u540e\u91cd\u65b0\u8fde\u63a5");
        } else {
          this._ws = null;
          this.connectWebSocket(ip, port, protocol);
        } else this.connectWebSocket(ip, port, protocol);
      };
      WebSocketClinet.prototype.__onConected = function(event) {
        if (this._ws) {
          true;
          cc.log(this._tag, "onConected state : " + this._ws.readyState);
        }
        if (this._dataArr.length > 0) {
          for (var i = 0; i < this._dataArr.length; i++) this.send(this._dataArr[i]);
          this._dataArr = [];
        }
        this.onOpen && this.onOpen();
      };
      WebSocketClinet.prototype.__onMessage = function(arraybuffer) {
        var dataArr = new Uint8Array(arraybuffer.data);
        this.onMessage && this.onMessage(dataArr);
      };
      WebSocketClinet.prototype.__onClose = function(event) {
        this._ws = null;
        if (this._closeEvent) {
          event = this._closeEvent;
          this._closeEvent = null;
        }
        if (event) {
          true;
          cc.log(this._tag, "onClose type : " + event.type);
        } else {
          true;
          cc.log(this._tag, "onClose");
        }
        if (this._isWaitingConnect) {
          true;
          cc.log(this._tag, "\u6536\u5230\u8fde\u63a5\u5173\u95ed\uff0c\u6709\u7b49\u5f85\u8fde\u63a5\u7684\u7f51\u7edc\uff0c\u91cd\u8fde\u8fde\u63a5\u7f51\u7edc");
          this._closeEvent = null;
          this.connectWebSocket(this._ip, this._port, this._protocol);
          this._isWaitingConnect = false;
        } else this.onClose && this.onClose(event);
      };
      WebSocketClinet.prototype.__onError = function(event) {
        if (event) {
          true;
          cc.error(this._tag, "onError", event);
        } else {
          true;
          cc.error(this._tag, "onError");
        }
        this.onError && this.onError(event);
      };
      Object.defineProperty(WebSocketClinet.prototype, "isConnected", {
        get: function() {
          if (this._ws && this._ws.readyState === WebSocket.OPEN) return true;
          return false;
        },
        enumerable: false,
        configurable: true
      });
      WebSocketClinet.prototype.send = function(data) {
        if (!this._ws || !data) return;
        if (this._ws.readyState === WebSocket.OPEN) this._ws.send(data); else if (this._ws.readyState == WebSocket.CONNECTING) this._dataArr.push(data); else {
          var content = this._ws.readyState == WebSocket.CLOSING ? "\u7f51\u7edc\u6b63\u5728\u5173\u95ed" : "\u7f51\u7edc\u5df2\u7ecf\u5173\u95ed";
          true;
          cc.warn(this._tag, "\u53d1\u9001\u6d88\u606f\u5931\u8d25: " + content);
        }
      };
      WebSocketClinet.prototype.close = function(isEnd) {
        if (this._ws) {
          this._closeEvent = {
            type: EventApi_1.CustomNetEventType.CLOSE,
            isEnd: isEnd
          };
          this._ws.close();
        }
        this._dataArr = [];
        true;
        cc.log(this._tag, "close websocket");
      };
      return WebSocketClinet;
    }();
    exports.default = WebSocketClinet;
    cc._RF.pop();
  }, {
    "../Framework": "Framework",
    "../event/EventApi": "EventApi"
  } ],
  protobuf: [ function(require, module, exports) {
    (function(global) {
      "use strict";
      cc._RF.push(module, "b8d651DfJFMd6Mqhwhiaq6A", "protobuf");
      "use strict";
      (function(undefined) {
        (function prelude(modules, cache, entries) {
          function $require(name) {
            var $module = cache[name];
            $module || modules[name][0].call($module = cache[name] = {
              exports: {}
            }, $require, $module, $module.exports);
            return $module.exports;
          }
          var protobuf = $require(entries[0]);
          protobuf.util.global.protobuf = protobuf;
          "function" === typeof define && define.amd && define([ "long" ], function(Long) {
            if (Long && Long.isLong) {
              protobuf.util.Long = Long;
              protobuf.configure();
            }
            return protobuf;
          });
          "object" === typeof module && module && module.exports && (module.exports = protobuf);
        })({
          1: [ function(require, module, exports) {
            module.exports = asPromise;
            function asPromise(fn, ctx) {
              var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
              while (index < arguments.length) params[offset++] = arguments[index++];
              return new Promise(function executor(resolve, reject) {
                params[offset] = function callback(err) {
                  if (pending) {
                    pending = false;
                    if (err) reject(err); else {
                      var params = new Array(arguments.length - 1), offset = 0;
                      while (offset < params.length) params[offset++] = arguments[offset];
                      resolve.apply(null, params);
                    }
                  }
                };
                try {
                  fn.apply(ctx || null, params);
                } catch (err) {
                  if (pending) {
                    pending = false;
                    reject(err);
                  }
                }
              });
            }
          }, {} ],
          2: [ function(require, module, exports) {
            var base64 = exports;
            base64.length = function length(string) {
              var p = string.length;
              if (!p) return 0;
              var n = 0;
              while (--p % 4 > 1 && "=" === string.charAt(p)) ++n;
              return Math.ceil(3 * string.length) / 4 - n;
            };
            var b64 = new Array(64);
            var s64 = new Array(123);
            for (var i = 0; i < 64; ) s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
            base64.encode = function encode(buffer, start, end) {
              var parts = null, chunk = [];
              var i = 0, j = 0, t;
              while (start < end) {
                var b = buffer[start++];
                switch (j) {
                 case 0:
                  chunk[i++] = b64[b >> 2];
                  t = (3 & b) << 4;
                  j = 1;
                  break;

                 case 1:
                  chunk[i++] = b64[t | b >> 4];
                  t = (15 & b) << 2;
                  j = 2;
                  break;

                 case 2:
                  chunk[i++] = b64[t | b >> 6];
                  chunk[i++] = b64[63 & b];
                  j = 0;
                }
                if (i > 8191) {
                  (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                  i = 0;
                }
              }
              if (j) {
                chunk[i++] = b64[t];
                chunk[i++] = 61;
                1 === j && (chunk[i++] = 61);
              }
              if (parts) {
                i && parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
                return parts.join("");
              }
              return String.fromCharCode.apply(String, chunk.slice(0, i));
            };
            var invalidEncoding = "invalid encoding";
            base64.decode = function decode(string, buffer, offset) {
              var start = offset;
              var j = 0, t;
              for (var i = 0; i < string.length; ) {
                var c = string.charCodeAt(i++);
                if (61 === c && j > 1) break;
                if ((c = s64[c]) === undefined) throw Error(invalidEncoding);
                switch (j) {
                 case 0:
                  t = c;
                  j = 1;
                  break;

                 case 1:
                  buffer[offset++] = t << 2 | (48 & c) >> 4;
                  t = c;
                  j = 2;
                  break;

                 case 2:
                  buffer[offset++] = (15 & t) << 4 | (60 & c) >> 2;
                  t = c;
                  j = 3;
                  break;

                 case 3:
                  buffer[offset++] = (3 & t) << 6 | c;
                  j = 0;
                }
              }
              if (1 === j) throw Error(invalidEncoding);
              return offset - start;
            };
            base64.test = function test(string) {
              return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
            };
          }, {} ],
          3: [ function(require, module, exports) {
            module.exports = codegen;
            function codegen(functionParams, functionName) {
              if ("string" === typeof functionParams) {
                functionName = functionParams;
                functionParams = undefined;
              }
              var body = [];
              function Codegen(formatStringOrScope) {
                if ("string" !== typeof formatStringOrScope) {
                  var source = toString();
                  codegen.verbose && console.log("codegen: " + source);
                  source = "return " + source;
                  if (formatStringOrScope) {
                    var scopeKeys = Object.keys(formatStringOrScope), scopeParams = new Array(scopeKeys.length + 1), scopeValues = new Array(scopeKeys.length), scopeOffset = 0;
                    while (scopeOffset < scopeKeys.length) {
                      scopeParams[scopeOffset] = scopeKeys[scopeOffset];
                      scopeValues[scopeOffset] = formatStringOrScope[scopeKeys[scopeOffset++]];
                    }
                    scopeParams[scopeOffset] = source;
                    return Function.apply(null, scopeParams).apply(null, scopeValues);
                  }
                  return Function(source)();
                }
                var formatParams = new Array(arguments.length - 1), formatOffset = 0;
                while (formatOffset < formatParams.length) formatParams[formatOffset] = arguments[++formatOffset];
                formatOffset = 0;
                formatStringOrScope = formatStringOrScope.replace(/%([%dfijs])/g, function replace($0, $1) {
                  var value = formatParams[formatOffset++];
                  switch ($1) {
                   case "d":
                   case "f":
                    return String(Number(value));

                   case "i":
                    return String(Math.floor(value));

                   case "j":
                    return JSON.stringify(value);

                   case "s":
                    return String(value);
                  }
                  return "%";
                });
                if (formatOffset !== formatParams.length) throw Error("parameter count mismatch");
                body.push(formatStringOrScope);
                return Codegen;
              }
              function toString(functionNameOverride) {
                return "function " + (functionNameOverride || functionName || "") + "(" + (functionParams && functionParams.join(",") || "") + "){\n  " + body.join("\n  ") + "\n}";
              }
              Codegen.toString = toString;
              return Codegen;
            }
            codegen.verbose = false;
          }, {} ],
          4: [ function(require, module, exports) {
            module.exports = EventEmitter;
            function EventEmitter() {
              this._listeners = {};
            }
            EventEmitter.prototype.on = function on(evt, fn, ctx) {
              (this._listeners[evt] || (this._listeners[evt] = [])).push({
                fn: fn,
                ctx: ctx || this
              });
              return this;
            };
            EventEmitter.prototype.off = function off(evt, fn) {
              if (evt === undefined) this._listeners = {}; else if (fn === undefined) this._listeners[evt] = []; else {
                var listeners = this._listeners[evt];
                for (var i = 0; i < listeners.length; ) listeners[i].fn === fn ? listeners.splice(i, 1) : ++i;
              }
              return this;
            };
            EventEmitter.prototype.emit = function emit(evt) {
              var listeners = this._listeners[evt];
              if (listeners) {
                var args = [], i = 1;
                for (;i < arguments.length; ) args.push(arguments[i++]);
                for (i = 0; i < listeners.length; ) listeners[i].fn.apply(listeners[i++].ctx, args);
              }
              return this;
            };
          }, {} ],
          5: [ function(require, module, exports) {
            module.exports = fetch;
            var asPromise = require(1), inquire = require(7);
            var fs = inquire("fs");
            function fetch(filename, options, callback) {
              if ("function" === typeof options) {
                callback = options;
                options = {};
              } else options || (options = {});
              if (!callback) return asPromise(fetch, this, filename, options);
              if (!options.xhr && fs && fs.readFile) return fs.readFile(filename, function fetchReadFileCallback(err, contents) {
                return err && "undefined" !== typeof XMLHttpRequest ? fetch.xhr(filename, options, callback) : err ? callback(err) : callback(null, options.binary ? contents : contents.toString("utf8"));
              });
              return fetch.xhr(filename, options, callback);
            }
            fetch.xhr = function fetch_xhr(filename, options, callback) {
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function fetchOnReadyStateChange() {
                if (4 !== xhr.readyState) return undefined;
                if (0 !== xhr.status && 200 !== xhr.status) return callback(Error("status " + xhr.status));
                if (options.binary) {
                  var buffer = xhr.response;
                  if (!buffer) {
                    buffer = [];
                    for (var i = 0; i < xhr.responseText.length; ++i) buffer.push(255 & xhr.responseText.charCodeAt(i));
                  }
                  return callback(null, "undefined" !== typeof Uint8Array ? new Uint8Array(buffer) : buffer);
                }
                return callback(null, xhr.responseText);
              };
              if (options.binary) {
                "overrideMimeType" in xhr && xhr.overrideMimeType("text/plain; charset=x-user-defined");
                xhr.responseType = "arraybuffer";
              }
              xhr.open("GET", filename);
              xhr.send();
            };
          }, {
            1: 1,
            7: 7
          } ],
          6: [ function(require, module, exports) {
            module.exports = factory(factory);
            function factory(exports) {
              "undefined" !== typeof Float32Array ? function() {
                var f32 = new Float32Array([ -0 ]), f8b = new Uint8Array(f32.buffer), le = 128 === f8b[3];
                function writeFloat_f32_cpy(val, buf, pos) {
                  f32[0] = val;
                  buf[pos] = f8b[0];
                  buf[pos + 1] = f8b[1];
                  buf[pos + 2] = f8b[2];
                  buf[pos + 3] = f8b[3];
                }
                function writeFloat_f32_rev(val, buf, pos) {
                  f32[0] = val;
                  buf[pos] = f8b[3];
                  buf[pos + 1] = f8b[2];
                  buf[pos + 2] = f8b[1];
                  buf[pos + 3] = f8b[0];
                }
                exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
                exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
                function readFloat_f32_cpy(buf, pos) {
                  f8b[0] = buf[pos];
                  f8b[1] = buf[pos + 1];
                  f8b[2] = buf[pos + 2];
                  f8b[3] = buf[pos + 3];
                  return f32[0];
                }
                function readFloat_f32_rev(buf, pos) {
                  f8b[3] = buf[pos];
                  f8b[2] = buf[pos + 1];
                  f8b[1] = buf[pos + 2];
                  f8b[0] = buf[pos + 3];
                  return f32[0];
                }
                exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
                exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
              }() : function() {
                function writeFloat_ieee754(writeUint, val, buf, pos) {
                  var sign = val < 0 ? 1 : 0;
                  sign && (val = -val);
                  if (0 === val) writeUint(1 / val > 0 ? 0 : 2147483648, buf, pos); else if (isNaN(val)) writeUint(2143289344, buf, pos); else if (val > 3.4028234663852886e38) writeUint((sign << 31 | 2139095040) >>> 0, buf, pos); else if (val < 1.1754943508222875e-38) writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos); else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = 8388607 & Math.round(val * Math.pow(2, -exponent) * 8388608);
                    writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
                  }
                }
                exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
                exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
                function readFloat_ieee754(readUint, buf, pos) {
                  var uint = readUint(buf, pos), sign = 2 * (uint >> 31) + 1, exponent = uint >>> 23 & 255, mantissa = 8388607 & uint;
                  return 255 === exponent ? mantissa ? NaN : Infinity * sign : 0 === exponent ? 1.401298464324817e-45 * sign * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
                }
                exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
                exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
              }();
              "undefined" !== typeof Float64Array ? function() {
                var f64 = new Float64Array([ -0 ]), f8b = new Uint8Array(f64.buffer), le = 128 === f8b[7];
                function writeDouble_f64_cpy(val, buf, pos) {
                  f64[0] = val;
                  buf[pos] = f8b[0];
                  buf[pos + 1] = f8b[1];
                  buf[pos + 2] = f8b[2];
                  buf[pos + 3] = f8b[3];
                  buf[pos + 4] = f8b[4];
                  buf[pos + 5] = f8b[5];
                  buf[pos + 6] = f8b[6];
                  buf[pos + 7] = f8b[7];
                }
                function writeDouble_f64_rev(val, buf, pos) {
                  f64[0] = val;
                  buf[pos] = f8b[7];
                  buf[pos + 1] = f8b[6];
                  buf[pos + 2] = f8b[5];
                  buf[pos + 3] = f8b[4];
                  buf[pos + 4] = f8b[3];
                  buf[pos + 5] = f8b[2];
                  buf[pos + 6] = f8b[1];
                  buf[pos + 7] = f8b[0];
                }
                exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
                exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
                function readDouble_f64_cpy(buf, pos) {
                  f8b[0] = buf[pos];
                  f8b[1] = buf[pos + 1];
                  f8b[2] = buf[pos + 2];
                  f8b[3] = buf[pos + 3];
                  f8b[4] = buf[pos + 4];
                  f8b[5] = buf[pos + 5];
                  f8b[6] = buf[pos + 6];
                  f8b[7] = buf[pos + 7];
                  return f64[0];
                }
                function readDouble_f64_rev(buf, pos) {
                  f8b[7] = buf[pos];
                  f8b[6] = buf[pos + 1];
                  f8b[5] = buf[pos + 2];
                  f8b[4] = buf[pos + 3];
                  f8b[3] = buf[pos + 4];
                  f8b[2] = buf[pos + 5];
                  f8b[1] = buf[pos + 6];
                  f8b[0] = buf[pos + 7];
                  return f64[0];
                }
                exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
                exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
              }() : function() {
                function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
                  var sign = val < 0 ? 1 : 0;
                  sign && (val = -val);
                  if (0 === val) {
                    writeUint(0, buf, pos + off0);
                    writeUint(1 / val > 0 ? 0 : 2147483648, buf, pos + off1);
                  } else if (isNaN(val)) {
                    writeUint(0, buf, pos + off0);
                    writeUint(2146959360, buf, pos + off1);
                  } else if (val > 1.7976931348623157e308) {
                    writeUint(0, buf, pos + off0);
                    writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
                  } else {
                    var mantissa;
                    if (val < 2.2250738585072014e-308) {
                      mantissa = val / 5e-324;
                      writeUint(mantissa >>> 0, buf, pos + off0);
                      writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                    } else {
                      var exponent = Math.floor(Math.log(val) / Math.LN2);
                      1024 === exponent && (exponent = 1023);
                      mantissa = val * Math.pow(2, -exponent);
                      writeUint(4503599627370496 * mantissa >>> 0, buf, pos + off0);
                      writeUint((sign << 31 | exponent + 1023 << 20 | 1048576 * mantissa & 1048575) >>> 0, buf, pos + off1);
                    }
                  }
                }
                exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
                exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
                function readDouble_ieee754(readUint, off0, off1, buf, pos) {
                  var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
                  var sign = 2 * (hi >> 31) + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (1048575 & hi) + lo;
                  return 2047 === exponent ? mantissa ? NaN : Infinity * sign : 0 === exponent ? 5e-324 * sign * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
                }
                exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
                exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
              }();
              return exports;
            }
            function writeUintLE(val, buf, pos) {
              buf[pos] = 255 & val;
              buf[pos + 1] = val >>> 8 & 255;
              buf[pos + 2] = val >>> 16 & 255;
              buf[pos + 3] = val >>> 24;
            }
            function writeUintBE(val, buf, pos) {
              buf[pos] = val >>> 24;
              buf[pos + 1] = val >>> 16 & 255;
              buf[pos + 2] = val >>> 8 & 255;
              buf[pos + 3] = 255 & val;
            }
            function readUintLE(buf, pos) {
              return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
            }
            function readUintBE(buf, pos) {
              return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
            }
          }, {} ],
          7: [ function(require, module, exports) {
            module.exports = inquire;
            function inquire(moduleName) {
              try {
                var mod = eval("quire".replace(/^/, "re"))(moduleName);
                if (mod && (mod.length || Object.keys(mod).length)) return mod;
              } catch (e) {}
              return null;
            }
          }, {} ],
          8: [ function(require, module, exports) {
            var path = exports;
            var isAbsolute = path.isAbsolute = function isAbsolute(path) {
              return /^(?:\/|\w+:)/.test(path);
            };
            var normalize = path.normalize = function normalize(path) {
              path = path.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
              var parts = path.split("/"), absolute = isAbsolute(path), prefix = "";
              absolute && (prefix = parts.shift() + "/");
              for (var i = 0; i < parts.length; ) ".." === parts[i] ? i > 0 && ".." !== parts[i - 1] ? parts.splice(--i, 2) : absolute ? parts.splice(i, 1) : ++i : "." === parts[i] ? parts.splice(i, 1) : ++i;
              return prefix + parts.join("/");
            };
            path.resolve = function resolve(originPath, includePath, alreadyNormalized) {
              alreadyNormalized || (includePath = normalize(includePath));
              if (isAbsolute(includePath)) return includePath;
              alreadyNormalized || (originPath = normalize(originPath));
              return (originPath = originPath.replace(/(?:\/|^)[^/]+$/, "")).length ? normalize(originPath + "/" + includePath) : includePath;
            };
          }, {} ],
          9: [ function(require, module, exports) {
            module.exports = pool;
            function pool(alloc, slice, size) {
              var SIZE = size || 8192;
              var MAX = SIZE >>> 1;
              var slab = null;
              var offset = SIZE;
              return function pool_alloc(size) {
                if (size < 1 || size > MAX) return alloc(size);
                if (offset + size > SIZE) {
                  slab = alloc(SIZE);
                  offset = 0;
                }
                var buf = slice.call(slab, offset, offset += size);
                7 & offset && (offset = 1 + (7 | offset));
                return buf;
              };
            }
          }, {} ],
          10: [ function(require, module, exports) {
            var utf8 = exports;
            utf8.length = function utf8_length(string) {
              var len = 0, c = 0;
              for (var i = 0; i < string.length; ++i) {
                c = string.charCodeAt(i);
                if (c < 128) len += 1; else if (c < 2048) len += 2; else if (55296 === (64512 & c) && 56320 === (64512 & string.charCodeAt(i + 1))) {
                  ++i;
                  len += 4;
                } else len += 3;
              }
              return len;
            };
            utf8.read = function utf8_read(buffer, start, end) {
              var len = end - start;
              if (len < 1) return "";
              var parts = null, chunk = [], i = 0, t;
              while (start < end) {
                t = buffer[start++];
                if (t < 128) chunk[i++] = t; else if (t > 191 && t < 224) chunk[i++] = (31 & t) << 6 | 63 & buffer[start++]; else if (t > 239 && t < 365) {
                  t = ((7 & t) << 18 | (63 & buffer[start++]) << 12 | (63 & buffer[start++]) << 6 | 63 & buffer[start++]) - 65536;
                  chunk[i++] = 55296 + (t >> 10);
                  chunk[i++] = 56320 + (1023 & t);
                } else chunk[i++] = (15 & t) << 12 | (63 & buffer[start++]) << 6 | 63 & buffer[start++];
                if (i > 8191) {
                  (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                  i = 0;
                }
              }
              if (parts) {
                i && parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
                return parts.join("");
              }
              return String.fromCharCode.apply(String, chunk.slice(0, i));
            };
            utf8.write = function utf8_write(string, buffer, offset) {
              var start = offset, c1, c2;
              for (var i = 0; i < string.length; ++i) {
                c1 = string.charCodeAt(i);
                if (c1 < 128) buffer[offset++] = c1; else if (c1 < 2048) {
                  buffer[offset++] = c1 >> 6 | 192;
                  buffer[offset++] = 63 & c1 | 128;
                } else if (55296 === (64512 & c1) && 56320 === (64512 & (c2 = string.charCodeAt(i + 1)))) {
                  c1 = 65536 + ((1023 & c1) << 10) + (1023 & c2);
                  ++i;
                  buffer[offset++] = c1 >> 18 | 240;
                  buffer[offset++] = c1 >> 12 & 63 | 128;
                  buffer[offset++] = c1 >> 6 & 63 | 128;
                  buffer[offset++] = 63 & c1 | 128;
                } else {
                  buffer[offset++] = c1 >> 12 | 224;
                  buffer[offset++] = c1 >> 6 & 63 | 128;
                  buffer[offset++] = 63 & c1 | 128;
                }
              }
              return offset - start;
            };
          }, {} ],
          11: [ function(require, module, exports) {
            module.exports = common;
            var commonRe = /\/|\./;
            function common(name, json) {
              if (!commonRe.test(name)) {
                name = "google/protobuf/" + name + ".proto";
                json = {
                  nested: {
                    google: {
                      nested: {
                        protobuf: {
                          nested: json
                        }
                      }
                    }
                  }
                };
              }
              common[name] = json;
            }
            common("any", {
              Any: {
                fields: {
                  type_url: {
                    type: "string",
                    id: 1
                  },
                  value: {
                    type: "bytes",
                    id: 2
                  }
                }
              }
            });
            var timeType;
            common("duration", {
              Duration: timeType = {
                fields: {
                  seconds: {
                    type: "int64",
                    id: 1
                  },
                  nanos: {
                    type: "int32",
                    id: 2
                  }
                }
              }
            });
            common("timestamp", {
              Timestamp: timeType
            });
            common("empty", {
              Empty: {
                fields: {}
              }
            });
            common("struct", {
              Struct: {
                fields: {
                  fields: {
                    keyType: "string",
                    type: "Value",
                    id: 1
                  }
                }
              },
              Value: {
                oneofs: {
                  kind: {
                    oneof: [ "nullValue", "numberValue", "stringValue", "boolValue", "structValue", "listValue" ]
                  }
                },
                fields: {
                  nullValue: {
                    type: "NullValue",
                    id: 1
                  },
                  numberValue: {
                    type: "double",
                    id: 2
                  },
                  stringValue: {
                    type: "string",
                    id: 3
                  },
                  boolValue: {
                    type: "bool",
                    id: 4
                  },
                  structValue: {
                    type: "Struct",
                    id: 5
                  },
                  listValue: {
                    type: "ListValue",
                    id: 6
                  }
                }
              },
              NullValue: {
                values: {
                  NULL_VALUE: 0
                }
              },
              ListValue: {
                fields: {
                  values: {
                    rule: "repeated",
                    type: "Value",
                    id: 1
                  }
                }
              }
            });
            common("wrappers", {
              DoubleValue: {
                fields: {
                  value: {
                    type: "double",
                    id: 1
                  }
                }
              },
              FloatValue: {
                fields: {
                  value: {
                    type: "float",
                    id: 1
                  }
                }
              },
              Int64Value: {
                fields: {
                  value: {
                    type: "int64",
                    id: 1
                  }
                }
              },
              UInt64Value: {
                fields: {
                  value: {
                    type: "uint64",
                    id: 1
                  }
                }
              },
              Int32Value: {
                fields: {
                  value: {
                    type: "int32",
                    id: 1
                  }
                }
              },
              UInt32Value: {
                fields: {
                  value: {
                    type: "uint32",
                    id: 1
                  }
                }
              },
              BoolValue: {
                fields: {
                  value: {
                    type: "bool",
                    id: 1
                  }
                }
              },
              StringValue: {
                fields: {
                  value: {
                    type: "string",
                    id: 1
                  }
                }
              },
              BytesValue: {
                fields: {
                  value: {
                    type: "bytes",
                    id: 1
                  }
                }
              }
            });
            common("field_mask", {
              FieldMask: {
                fields: {
                  paths: {
                    rule: "repeated",
                    type: "string",
                    id: 1
                  }
                }
              }
            });
            common.get = function get(file) {
              return common[file] || null;
            };
          }, {} ],
          12: [ function(require, module, exports) {
            var converter = exports;
            var Enum = require(15), util = require(37);
            function genValuePartial_fromObject(gen, field, fieldIndex, prop) {
              if (field.resolvedType) if (field.resolvedType instanceof Enum) {
                gen("switch(d%s){", prop);
                for (var values = field.resolvedType.values, keys = Object.keys(values), i = 0; i < keys.length; ++i) {
                  field.repeated && values[keys[i]] === field.typeDefault && gen("default:");
                  gen("case%j:", keys[i])("case %i:", values[keys[i]])("m%s=%j", prop, values[keys[i]])("break");
                }
                gen("}");
              } else gen('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", prop, fieldIndex, prop); else {
                var isUnsigned = false;
                switch (field.type) {
                 case "double":
                 case "float":
                  gen("m%s=Number(d%s)", prop, prop);
                  break;

                 case "uint32":
                 case "fixed32":
                  gen("m%s=d%s>>>0", prop, prop);
                  break;

                 case "int32":
                 case "sint32":
                 case "sfixed32":
                  gen("m%s=d%s|0", prop, prop);
                  break;

                 case "uint64":
                  isUnsigned = true;

                 case "int64":
                 case "sint64":
                 case "fixed64":
                 case "sfixed64":
                  gen("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", prop, prop, isUnsigned)('else if(typeof d%s==="string")', prop)("m%s=parseInt(d%s,10)", prop, prop)('else if(typeof d%s==="number")', prop)("m%s=d%s", prop, prop)('else if(typeof d%s==="object")', prop)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", prop, prop, prop, isUnsigned ? "true" : "");
                  break;

                 case "bytes":
                  gen('if(typeof d%s==="string")', prop)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)("else if(d%s.length)", prop)("m%s=d%s", prop, prop);
                  break;

                 case "string":
                  gen("m%s=String(d%s)", prop, prop);
                  break;

                 case "bool":
                  gen("m%s=Boolean(d%s)", prop, prop);
                }
              }
              return gen;
            }
            converter.fromObject = function fromObject(mtype) {
              var fields = mtype.fieldsArray;
              var gen = util.codegen([ "d" ], mtype.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
              if (!fields.length) return gen("return new this.ctor");
              gen("var m=new this.ctor");
              for (var i = 0; i < fields.length; ++i) {
                var field = fields[i].resolve(), prop = util.safeProp(field.name);
                if (field.map) {
                  gen("if(d%s){", prop)('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s={}", prop)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", prop);
                  genValuePartial_fromObject(gen, field, i, prop + "[ks[i]]")("}")("}");
                } else if (field.repeated) {
                  gen("if(d%s){", prop)("if(!Array.isArray(d%s))", prop)("throw TypeError(%j)", field.fullName + ": array expected")("m%s=[]", prop)("for(var i=0;i<d%s.length;++i){", prop);
                  genValuePartial_fromObject(gen, field, i, prop + "[i]")("}")("}");
                } else {
                  field.resolvedType instanceof Enum || gen("if(d%s!=null){", prop);
                  genValuePartial_fromObject(gen, field, i, prop);
                  field.resolvedType instanceof Enum || gen("}");
                }
              }
              return gen("return m");
            };
            function genValuePartial_toObject(gen, field, fieldIndex, prop) {
              if (field.resolvedType) field.resolvedType instanceof Enum ? gen("d%s=o.enums===String?types[%i].values[m%s]:m%s", prop, fieldIndex, prop, prop) : gen("d%s=types[%i].toObject(m%s,o)", prop, fieldIndex, prop); else {
                var isUnsigned = false;
                switch (field.type) {
                 case "double":
                 case "float":
                  gen("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", prop, prop, prop, prop);
                  break;

                 case "uint64":
                  isUnsigned = true;

                 case "int64":
                 case "sint64":
                 case "fixed64":
                 case "sfixed64":
                  gen('if(typeof m%s==="number")', prop)("d%s=o.longs===String?String(m%s):m%s", prop, prop, prop)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", prop, prop, prop, prop, isUnsigned ? "true" : "", prop);
                  break;

                 case "bytes":
                  gen("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", prop, prop, prop, prop, prop);
                  break;

                 default:
                  gen("d%s=m%s", prop, prop);
                }
              }
              return gen;
            }
            converter.toObject = function toObject(mtype) {
              var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
              if (!fields.length) return util.codegen()("return {}");
              var gen = util.codegen([ "m", "o" ], mtype.name + "$toObject")("if(!o)")("o={}")("var d={}");
              var repeatedFields = [], mapFields = [], normalFields = [], i = 0;
              for (;i < fields.length; ++i) fields[i].partOf || (fields[i].resolve().repeated ? repeatedFields : fields[i].map ? mapFields : normalFields).push(fields[i]);
              if (repeatedFields.length) {
                gen("if(o.arrays||o.defaults){");
                for (i = 0; i < repeatedFields.length; ++i) gen("d%s=[]", util.safeProp(repeatedFields[i].name));
                gen("}");
              }
              if (mapFields.length) {
                gen("if(o.objects||o.defaults){");
                for (i = 0; i < mapFields.length; ++i) gen("d%s={}", util.safeProp(mapFields[i].name));
                gen("}");
              }
              if (normalFields.length) {
                gen("if(o.defaults){");
                for (i = 0; i < normalFields.length; ++i) {
                  var field = normalFields[i], prop = util.safeProp(field.name);
                  if (field.resolvedType instanceof Enum) gen("d%s=o.enums===String?%j:%j", prop, field.resolvedType.valuesById[field.typeDefault], field.typeDefault); else if (field["long"]) gen("if(util.Long){")("var n=new util.Long(%i,%i,%j)", field.typeDefault.low, field.typeDefault.high, field.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", prop)("}else")("d%s=o.longs===String?%j:%i", prop, field.typeDefault.toString(), field.typeDefault.toNumber()); else if (field.bytes) {
                    var arrayDefault = "[" + Array.prototype.slice.call(field.typeDefault).join(",") + "]";
                    gen("if(o.bytes===String)d%s=%j", prop, String.fromCharCode.apply(String, field.typeDefault))("else{")("d%s=%s", prop, arrayDefault)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", prop, prop)("}");
                  } else gen("d%s=%j", prop, field.typeDefault);
                }
                gen("}");
              }
              var hasKs2 = false;
              for (i = 0; i < fields.length; ++i) {
                var field = fields[i], index = mtype._fieldsArray.indexOf(field), prop = util.safeProp(field.name);
                if (field.map) {
                  if (!hasKs2) {
                    hasKs2 = true;
                    gen("var ks2");
                  }
                  gen("if(m%s&&(ks2=Object.keys(m%s)).length){", prop, prop)("d%s={}", prop)("for(var j=0;j<ks2.length;++j){");
                  genValuePartial_toObject(gen, field, index, prop + "[ks2[j]]")("}");
                } else if (field.repeated) {
                  gen("if(m%s&&m%s.length){", prop, prop)("d%s=[]", prop)("for(var j=0;j<m%s.length;++j){", prop);
                  genValuePartial_toObject(gen, field, index, prop + "[j]")("}");
                } else {
                  gen("if(m%s!=null&&m.hasOwnProperty(%j)){", prop, field.name);
                  genValuePartial_toObject(gen, field, index, prop);
                  field.partOf && gen("if(o.oneofs)")("d%s=%j", util.safeProp(field.partOf.name), field.name);
                }
                gen("}");
              }
              return gen("return d");
            };
          }, {
            15: 15,
            37: 37
          } ],
          13: [ function(require, module, exports) {
            module.exports = decoder;
            var Enum = require(15), types = require(36), util = require(37);
            function missing(field) {
              return "missing required '" + field.name + "'";
            }
            function decoder(mtype) {
              var gen = util.codegen([ "r", "l" ], mtype.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (mtype.fieldsArray.filter(function(field) {
                return field.map;
              }).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()");
              mtype.group && gen("if((t&7)===4)")("break");
              gen("switch(t>>>3){");
              var i = 0;
              for (;i < mtype.fieldsArray.length; ++i) {
                var field = mtype._fieldsArray[i].resolve(), type = field.resolvedType instanceof Enum ? "int32" : field.type, ref = "m" + util.safeProp(field.name);
                gen("case %i:", field.id);
                if (field.map) {
                  gen("if(%s===util.emptyObject)", ref)("%s={}", ref)("var c2 = r.uint32()+r.pos");
                  types.defaults[field.keyType] !== undefined ? gen("k=%j", types.defaults[field.keyType]) : gen("k=null");
                  types.defaults[type] !== undefined ? gen("value=%j", types.defaults[type]) : gen("value=null");
                  gen("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", field.keyType)("case 2:");
                  types.basic[type] === undefined ? gen("value=types[%i].decode(r,r.uint32())", i) : gen("value=r.%s()", type);
                  gen("break")("default:")("r.skipType(tag2&7)")("break")("}")("}");
                  types["long"][field.keyType] !== undefined ? gen('%s[typeof k==="object"?util.longToHash(k):k]=value', ref) : gen("%s[k]=value", ref);
                } else if (field.repeated) {
                  gen("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref);
                  types.packed[type] !== undefined && gen("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", ref, type)("}else");
                  types.basic[type] === undefined ? gen(field.resolvedType.group ? "%s.push(types[%i].decode(r))" : "%s.push(types[%i].decode(r,r.uint32()))", ref, i) : gen("%s.push(r.%s())", ref, type);
                } else types.basic[type] === undefined ? gen(field.resolvedType.group ? "%s=types[%i].decode(r)" : "%s=types[%i].decode(r,r.uint32())", ref, i) : gen("%s=r.%s()", ref, type);
                gen("break");
              }
              gen("default:")("r.skipType(t&7)")("break")("}")("}");
              for (i = 0; i < mtype._fieldsArray.length; ++i) {
                var rfield = mtype._fieldsArray[i];
                rfield.required && gen("if(!m.hasOwnProperty(%j))", rfield.name)("throw util.ProtocolError(%j,{instance:m})", missing(rfield));
              }
              return gen("return m");
            }
          }, {
            15: 15,
            36: 36,
            37: 37
          } ],
          14: [ function(require, module, exports) {
            module.exports = encoder;
            var Enum = require(15), types = require(36), util = require(37);
            function genTypePartial(gen, field, fieldIndex, ref) {
              return field.resolvedType.group ? gen("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", fieldIndex, ref, (field.id << 3 | 3) >>> 0, (field.id << 3 | 4) >>> 0) : gen("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", fieldIndex, ref, (field.id << 3 | 2) >>> 0);
            }
            function encoder(mtype) {
              var gen = util.codegen([ "m", "w" ], mtype.name + "$encode")("if(!w)")("w=Writer.create()");
              var i, ref;
              var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
              for (var i = 0; i < fields.length; ++i) {
                var field = fields[i].resolve(), index = mtype._fieldsArray.indexOf(field), type = field.resolvedType instanceof Enum ? "int32" : field.type, wireType = types.basic[type];
                ref = "m" + util.safeProp(field.name);
                if (field.map) {
                  gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field.id << 3 | 2) >>> 0, 8 | types.mapKey[field.keyType], field.keyType);
                  wireType === undefined ? gen("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", index, ref) : gen(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type, ref);
                  gen("}")("}");
                } else if (field.repeated) {
                  gen("if(%s!=null&&%s.length){", ref, ref);
                  if (field.packed && types.packed[type] !== undefined) gen("w.uint32(%i).fork()", (field.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", ref)("w.%s(%s[i])", type, ref)("w.ldelim()"); else {
                    gen("for(var i=0;i<%s.length;++i)", ref);
                    wireType === undefined ? genTypePartial(gen, field, index, ref + "[i]") : gen("w.uint32(%i).%s(%s[i])", (field.id << 3 | wireType) >>> 0, type, ref);
                  }
                  gen("}");
                } else {
                  field.optional && gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", ref, field.name);
                  wireType === undefined ? genTypePartial(gen, field, index, ref) : gen("w.uint32(%i).%s(%s)", (field.id << 3 | wireType) >>> 0, type, ref);
                }
              }
              return gen("return w");
            }
          }, {
            15: 15,
            36: 36,
            37: 37
          } ],
          15: [ function(require, module, exports) {
            module.exports = Enum;
            var ReflectionObject = require(24);
            ((Enum.prototype = Object.create(ReflectionObject.prototype)).constructor = Enum).className = "Enum";
            var Namespace = require(23), util = require(37);
            function Enum(name, values, options, comment, comments) {
              ReflectionObject.call(this, name, options);
              if (values && "object" !== typeof values) throw TypeError("values must be an object");
              this.valuesById = {};
              this.values = Object.create(this.valuesById);
              this.comment = comment;
              this.comments = comments || {};
              this.reserved = undefined;
              if (values) for (var keys = Object.keys(values), i = 0; i < keys.length; ++i) "number" === typeof values[keys[i]] && (this.valuesById[this.values[keys[i]] = values[keys[i]]] = keys[i]);
            }
            Enum.fromJSON = function fromJSON(name, json) {
              var enm = new Enum(name, json.values, json.options, json.comment, json.comments);
              enm.reserved = json.reserved;
              return enm;
            };
            Enum.prototype.toJSON = function toJSON(toJSONOptions) {
              var keepComments = !!toJSONOptions && Boolean(toJSONOptions.keepComments);
              return util.toObject([ "options", this.options, "values", this.values, "reserved", this.reserved && this.reserved.length ? this.reserved : undefined, "comment", keepComments ? this.comment : undefined, "comments", keepComments ? this.comments : undefined ]);
            };
            Enum.prototype.add = function add(name, id, comment) {
              if (!util.isString(name)) throw TypeError("name must be a string");
              if (!util.isInteger(id)) throw TypeError("id must be an integer");
              if (this.values[name] !== undefined) throw Error("duplicate name '" + name + "' in " + this);
              if (this.isReservedId(id)) throw Error("id " + id + " is reserved in " + this);
              if (this.isReservedName(name)) throw Error("name '" + name + "' is reserved in " + this);
              if (this.valuesById[id] !== undefined) {
                if (!(this.options && this.options.allow_alias)) throw Error("duplicate id " + id + " in " + this);
                this.values[name] = id;
              } else this.valuesById[this.values[name] = id] = name;
              this.comments[name] = comment || null;
              return this;
            };
            Enum.prototype.remove = function remove(name) {
              if (!util.isString(name)) throw TypeError("name must be a string");
              var val = this.values[name];
              if (null == val) throw Error("name '" + name + "' does not exist in " + this);
              delete this.valuesById[val];
              delete this.values[name];
              delete this.comments[name];
              return this;
            };
            Enum.prototype.isReservedId = function isReservedId(id) {
              return Namespace.isReservedId(this.reserved, id);
            };
            Enum.prototype.isReservedName = function isReservedName(name) {
              return Namespace.isReservedName(this.reserved, name);
            };
          }, {
            23: 23,
            24: 24,
            37: 37
          } ],
          16: [ function(require, module, exports) {
            module.exports = Field;
            var ReflectionObject = require(24);
            ((Field.prototype = Object.create(ReflectionObject.prototype)).constructor = Field).className = "Field";
            var Enum = require(15), types = require(36), util = require(37);
            var Type;
            var ruleRe = /^required|optional|repeated$/;
            Field.fromJSON = function fromJSON(name, json) {
              return new Field(name, json.id, json.type, json.rule, json.extend, json.options, json.comment);
            };
            function Field(name, id, type, rule, extend, options, comment) {
              if (util.isObject(rule)) {
                comment = extend;
                options = rule;
                rule = extend = undefined;
              } else if (util.isObject(extend)) {
                comment = options;
                options = extend;
                extend = undefined;
              }
              ReflectionObject.call(this, name, options);
              if (!util.isInteger(id) || id < 0) throw TypeError("id must be a non-negative integer");
              if (!util.isString(type)) throw TypeError("type must be a string");
              if (rule !== undefined && !ruleRe.test(rule = rule.toString().toLowerCase())) throw TypeError("rule must be a string rule");
              if (extend !== undefined && !util.isString(extend)) throw TypeError("extend must be a string");
              this.rule = rule && "optional" !== rule ? rule : undefined;
              this.type = type;
              this.id = id;
              this.extend = extend || undefined;
              this.required = "required" === rule;
              this.optional = !this.required;
              this.repeated = "repeated" === rule;
              this.map = false;
              this.message = null;
              this.partOf = null;
              this.typeDefault = null;
              this.defaultValue = null;
              this["long"] = !!util.Long && types["long"][type] !== undefined;
              this.bytes = "bytes" === type;
              this.resolvedType = null;
              this.extensionField = null;
              this.declaringField = null;
              this._packed = null;
              this.comment = comment;
            }
            Object.defineProperty(Field.prototype, "packed", {
              get: function get() {
                null === this._packed && (this._packed = false !== this.getOption("packed"));
                return this._packed;
              }
            });
            Field.prototype.setOption = function setOption(name, value, ifNotSet) {
              "packed" === name && (this._packed = null);
              return ReflectionObject.prototype.setOption.call(this, name, value, ifNotSet);
            };
            Field.prototype.toJSON = function toJSON(toJSONOptions) {
              var keepComments = !!toJSONOptions && Boolean(toJSONOptions.keepComments);
              return util.toObject([ "rule", "optional" !== this.rule && this.rule || undefined, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", keepComments ? this.comment : undefined ]);
            };
            Field.prototype.resolve = function resolve() {
              if (this.resolved) return this;
              if ((this.typeDefault = types.defaults[this.type]) === undefined) {
                this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type);
                this.resolvedType instanceof Type ? this.typeDefault = null : this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
              }
              if (this.options && null != this.options["default"]) {
                this.typeDefault = this.options["default"];
                this.resolvedType instanceof Enum && "string" === typeof this.typeDefault && (this.typeDefault = this.resolvedType.values[this.typeDefault]);
              }
              if (this.options) {
                true !== this.options.packed && (this.options.packed === undefined || !this.resolvedType || this.resolvedType instanceof Enum) || delete this.options.packed;
                Object.keys(this.options).length || (this.options = undefined);
              }
              if (this["long"]) {
                this.typeDefault = util.Long.fromNumber(this.typeDefault, "u" === this.type.charAt(0));
                Object.freeze && Object.freeze(this.typeDefault);
              } else if (this.bytes && "string" === typeof this.typeDefault) {
                var buf;
                util.base64.test(this.typeDefault) ? util.base64.decode(this.typeDefault, buf = util.newBuffer(util.base64.length(this.typeDefault)), 0) : util.utf8.write(this.typeDefault, buf = util.newBuffer(util.utf8.length(this.typeDefault)), 0);
                this.typeDefault = buf;
              }
              this.map ? this.defaultValue = util.emptyObject : this.repeated ? this.defaultValue = util.emptyArray : this.defaultValue = this.typeDefault;
              this.parent instanceof Type && (this.parent.ctor.prototype[this.name] = this.defaultValue);
              return ReflectionObject.prototype.resolve.call(this);
            };
            Field.d = function decorateField(fieldId, fieldType, fieldRule, defaultValue) {
              "function" === typeof fieldType ? fieldType = util.decorateType(fieldType).name : fieldType && "object" === typeof fieldType && (fieldType = util.decorateEnum(fieldType).name);
              return function fieldDecorator(prototype, fieldName) {
                util.decorateType(prototype.constructor).add(new Field(fieldName, fieldId, fieldType, fieldRule, {
                  default: defaultValue
                }));
              };
            };
            Field._configure = function configure(Type_) {
              Type = Type_;
            };
          }, {
            15: 15,
            24: 24,
            36: 36,
            37: 37
          } ],
          17: [ function(require, module, exports) {
            var protobuf = module.exports = require(18);
            protobuf.build = "light";
            function load(filename, root, callback) {
              if ("function" === typeof root) {
                callback = root;
                root = new protobuf.Root();
              } else root || (root = new protobuf.Root());
              return root.load(filename, callback);
            }
            protobuf.load = load;
            function loadSync(filename, root) {
              root || (root = new protobuf.Root());
              return root.loadSync(filename);
            }
            protobuf.loadSync = loadSync;
            protobuf.encoder = require(14);
            protobuf.decoder = require(13);
            protobuf.verifier = require(40);
            protobuf.converter = require(12);
            protobuf.ReflectionObject = require(24);
            protobuf.Namespace = require(23);
            protobuf.Root = require(29);
            protobuf.Enum = require(15);
            protobuf.Type = require(35);
            protobuf.Field = require(16);
            protobuf.OneOf = require(25);
            protobuf.MapField = require(20);
            protobuf.Service = require(33);
            protobuf.Method = require(22);
            protobuf.Message = require(21);
            protobuf.wrappers = require(41);
            protobuf.types = require(36);
            protobuf.util = require(37);
            protobuf.ReflectionObject._configure(protobuf.Root);
            protobuf.Namespace._configure(protobuf.Type, protobuf.Service, protobuf.Enum);
            protobuf.Root._configure(protobuf.Type);
            protobuf.Field._configure(protobuf.Type);
          }, {
            12: 12,
            13: 13,
            14: 14,
            15: 15,
            16: 16,
            18: 18,
            20: 20,
            21: 21,
            22: 22,
            23: 23,
            24: 24,
            25: 25,
            29: 29,
            33: 33,
            35: 35,
            36: 36,
            37: 37,
            40: 40,
            41: 41
          } ],
          18: [ function(require, module, exports) {
            var protobuf = exports;
            protobuf.build = "minimal";
            protobuf.Writer = require(42);
            protobuf.BufferWriter = require(43);
            protobuf.Reader = require(27);
            protobuf.BufferReader = require(28);
            protobuf.util = require(39);
            protobuf.rpc = require(31);
            protobuf.roots = require(30);
            protobuf.configure = configure;
            function configure() {
              protobuf.util._configure();
              protobuf.Writer._configure(protobuf.BufferWriter);
              protobuf.Reader._configure(protobuf.BufferReader);
            }
            configure();
          }, {
            27: 27,
            28: 28,
            30: 30,
            31: 31,
            39: 39,
            42: 42,
            43: 43
          } ],
          19: [ function(require, module, exports) {
            var protobuf = module.exports = require(17);
            protobuf.build = "full";
            protobuf.tokenize = require(34);
            protobuf.parse = require(26);
            protobuf.common = require(11);
            protobuf.Root._configure(protobuf.Type, protobuf.parse, protobuf.common);
          }, {
            11: 11,
            17: 17,
            26: 26,
            34: 34
          } ],
          20: [ function(require, module, exports) {
            module.exports = MapField;
            var Field = require(16);
            ((MapField.prototype = Object.create(Field.prototype)).constructor = MapField).className = "MapField";
            var types = require(36), util = require(37);
            function MapField(name, id, keyType, type, options, comment) {
              Field.call(this, name, id, type, undefined, undefined, options, comment);
              if (!util.isString(keyType)) throw TypeError("keyType must be a string");
              this.keyType = keyType;
              this.resolvedKeyType = null;
              this.map = true;
            }
            MapField.fromJSON = function fromJSON(name, json) {
              return new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
            };
            MapField.prototype.toJSON = function toJSON(toJSONOptions) {
              var keepComments = !!toJSONOptions && Boolean(toJSONOptions.keepComments);
              return util.toObject([ "keyType", this.keyType, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", keepComments ? this.comment : undefined ]);
            };
            MapField.prototype.resolve = function resolve() {
              if (this.resolved) return this;
              if (types.mapKey[this.keyType] === undefined) throw Error("invalid key type: " + this.keyType);
              return Field.prototype.resolve.call(this);
            };
            MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {
              "function" === typeof fieldValueType ? fieldValueType = util.decorateType(fieldValueType).name : fieldValueType && "object" === typeof fieldValueType && (fieldValueType = util.decorateEnum(fieldValueType).name);
              return function mapFieldDecorator(prototype, fieldName) {
                util.decorateType(prototype.constructor).add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
              };
            };
          }, {
            16: 16,
            36: 36,
            37: 37
          } ],
          21: [ function(require, module, exports) {
            module.exports = Message;
            var util = require(39);
            function Message(properties) {
              if (properties) for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i) this[keys[i]] = properties[keys[i]];
            }
            Message.create = function create(properties) {
              return this.$type.create(properties);
            };
            Message.encode = function encode(message, writer) {
              return this.$type.encode(message, writer);
            };
            Message.encodeDelimited = function encodeDelimited(message, writer) {
              return this.$type.encodeDelimited(message, writer);
            };
            Message.decode = function decode(reader) {
              return this.$type.decode(reader);
            };
            Message.decodeDelimited = function decodeDelimited(reader) {
              return this.$type.decodeDelimited(reader);
            };
            Message.verify = function verify(message) {
              return this.$type.verify(message);
            };
            Message.fromObject = function fromObject(object) {
              return this.$type.fromObject(object);
            };
            Message.toObject = function toObject(message, options) {
              return this.$type.toObject(message, options);
            };
            Message.prototype.toJSON = function toJSON() {
              return this.$type.toObject(this, util.toJSONOptions);
            };
          }, {
            39: 39
          } ],
          22: [ function(require, module, exports) {
            module.exports = Method;
            var ReflectionObject = require(24);
            ((Method.prototype = Object.create(ReflectionObject.prototype)).constructor = Method).className = "Method";
            var util = require(37);
            function Method(name, type, requestType, responseType, requestStream, responseStream, options, comment) {
              if (util.isObject(requestStream)) {
                options = requestStream;
                requestStream = responseStream = undefined;
              } else if (util.isObject(responseStream)) {
                options = responseStream;
                responseStream = undefined;
              }
              if (!(type === undefined || util.isString(type))) throw TypeError("type must be a string");
              if (!util.isString(requestType)) throw TypeError("requestType must be a string");
              if (!util.isString(responseType)) throw TypeError("responseType must be a string");
              ReflectionObject.call(this, name, options);
              this.type = type || "rpc";
              this.requestType = requestType;
              this.requestStream = !!requestStream || undefined;
              this.responseType = responseType;
              this.responseStream = !!responseStream || undefined;
              this.resolvedRequestType = null;
              this.resolvedResponseType = null;
              this.comment = comment;
            }
            Method.fromJSON = function fromJSON(name, json) {
              return new Method(name, json.type, json.requestType, json.responseType, json.requestStream, json.responseStream, json.options, json.comment);
            };
            Method.prototype.toJSON = function toJSON(toJSONOptions) {
              var keepComments = !!toJSONOptions && Boolean(toJSONOptions.keepComments);
              return util.toObject([ "type", "rpc" !== this.type && this.type || undefined, "requestType", this.requestType, "requestStream", this.requestStream, "responseType", this.responseType, "responseStream", this.responseStream, "options", this.options, "comment", keepComments ? this.comment : undefined ]);
            };
            Method.prototype.resolve = function resolve() {
              if (this.resolved) return this;
              this.resolvedRequestType = this.parent.lookupType(this.requestType);
              this.resolvedResponseType = this.parent.lookupType(this.responseType);
              return ReflectionObject.prototype.resolve.call(this);
            };
          }, {
            24: 24,
            37: 37
          } ],
          23: [ function(require, module, exports) {
            module.exports = Namespace;
            var ReflectionObject = require(24);
            ((Namespace.prototype = Object.create(ReflectionObject.prototype)).constructor = Namespace).className = "Namespace";
            var Field = require(16), util = require(37);
            var Type, Service, Enum;
            Namespace.fromJSON = function fromJSON(name, json) {
              return new Namespace(name, json.options).addJSON(json.nested);
            };
            function arrayToJSON(array, toJSONOptions) {
              if (!(array && array.length)) return undefined;
              var obj = {};
              for (var i = 0; i < array.length; ++i) obj[array[i].name] = array[i].toJSON(toJSONOptions);
              return obj;
            }
            Namespace.arrayToJSON = arrayToJSON;
            Namespace.isReservedId = function isReservedId(reserved, id) {
              if (reserved) for (var i = 0; i < reserved.length; ++i) if ("string" !== typeof reserved[i] && reserved[i][0] <= id && reserved[i][1] > id) return true;
              return false;
            };
            Namespace.isReservedName = function isReservedName(reserved, name) {
              if (reserved) for (var i = 0; i < reserved.length; ++i) if (reserved[i] === name) return true;
              return false;
            };
            function Namespace(name, options) {
              ReflectionObject.call(this, name, options);
              this.nested = undefined;
              this._nestedArray = null;
            }
            function clearCache(namespace) {
              namespace._nestedArray = null;
              return namespace;
            }
            Object.defineProperty(Namespace.prototype, "nestedArray", {
              get: function get() {
                return this._nestedArray || (this._nestedArray = util.toArray(this.nested));
              }
            });
            Namespace.prototype.toJSON = function toJSON(toJSONOptions) {
              return util.toObject([ "options", this.options, "nested", arrayToJSON(this.nestedArray, toJSONOptions) ]);
            };
            Namespace.prototype.addJSON = function addJSON(nestedJson) {
              var ns = this;
              if (nestedJson) for (var names = Object.keys(nestedJson), i = 0, nested; i < names.length; ++i) {
                nested = nestedJson[names[i]];
                ns.add((nested.fields !== undefined ? Type.fromJSON : nested.values !== undefined ? Enum.fromJSON : nested.methods !== undefined ? Service.fromJSON : nested.id !== undefined ? Field.fromJSON : Namespace.fromJSON)(names[i], nested));
              }
              return this;
            };
            Namespace.prototype.get = function get(name) {
              return this.nested && this.nested[name] || null;
            };
            Namespace.prototype.getEnum = function getEnum(name) {
              if (this.nested && this.nested[name] instanceof Enum) return this.nested[name].values;
              throw Error("no such enum: " + name);
            };
            Namespace.prototype.add = function add(object) {
              if (!(object instanceof Field && object.extend !== undefined || object instanceof Type || object instanceof Enum || object instanceof Service || object instanceof Namespace)) throw TypeError("object must be a valid nested object");
              if (this.nested) {
                var prev = this.get(object.name);
                if (prev) {
                  if (!(prev instanceof Namespace && object instanceof Namespace) || prev instanceof Type || prev instanceof Service) throw Error("duplicate name '" + object.name + "' in " + this);
                  var nested = prev.nestedArray;
                  for (var i = 0; i < nested.length; ++i) object.add(nested[i]);
                  this.remove(prev);
                  this.nested || (this.nested = {});
                  object.setOptions(prev.options, true);
                }
              } else this.nested = {};
              this.nested[object.name] = object;
              object.onAdd(this);
              return clearCache(this);
            };
            Namespace.prototype.remove = function remove(object) {
              if (!(object instanceof ReflectionObject)) throw TypeError("object must be a ReflectionObject");
              if (object.parent !== this) throw Error(object + " is not a member of " + this);
              delete this.nested[object.name];
              Object.keys(this.nested).length || (this.nested = undefined);
              object.onRemove(this);
              return clearCache(this);
            };
            Namespace.prototype.define = function define(path, json) {
              if (util.isString(path)) path = path.split("."); else if (!Array.isArray(path)) throw TypeError("illegal path");
              if (path && path.length && "" === path[0]) throw Error("path must be relative");
              var ptr = this;
              while (path.length > 0) {
                var part = path.shift();
                if (ptr.nested && ptr.nested[part]) {
                  ptr = ptr.nested[part];
                  if (!(ptr instanceof Namespace)) throw Error("path conflicts with non-namespace objects");
                } else ptr.add(ptr = new Namespace(part));
              }
              json && ptr.addJSON(json);
              return ptr;
            };
            Namespace.prototype.resolveAll = function resolveAll() {
              var nested = this.nestedArray, i = 0;
              while (i < nested.length) nested[i] instanceof Namespace ? nested[i++].resolveAll() : nested[i++].resolve();
              return this.resolve();
            };
            Namespace.prototype.lookup = function lookup(path, filterTypes, parentAlreadyChecked) {
              if ("boolean" === typeof filterTypes) {
                parentAlreadyChecked = filterTypes;
                filterTypes = undefined;
              } else filterTypes && !Array.isArray(filterTypes) && (filterTypes = [ filterTypes ]);
              if (util.isString(path) && path.length) {
                if ("." === path) return this.root;
                path = path.split(".");
              } else if (!path.length) return this;
              if ("" === path[0]) return this.root.lookup(path.slice(1), filterTypes);
              var found = this.get(path[0]);
              if (found) {
                if (1 === path.length) {
                  if (!filterTypes || filterTypes.indexOf(found.constructor) > -1) return found;
                } else if (found instanceof Namespace && (found = found.lookup(path.slice(1), filterTypes, true))) return found;
              } else for (var i = 0; i < this.nestedArray.length; ++i) if (this._nestedArray[i] instanceof Namespace && (found = this._nestedArray[i].lookup(path, filterTypes, true))) return found;
              if (null === this.parent || parentAlreadyChecked) return null;
              return this.parent.lookup(path, filterTypes);
            };
            Namespace.prototype.lookupType = function lookupType(path) {
              var found = this.lookup(path, [ Type ]);
              if (!found) throw Error("no such type: " + path);
              return found;
            };
            Namespace.prototype.lookupEnum = function lookupEnum(path) {
              var found = this.lookup(path, [ Enum ]);
              if (!found) throw Error("no such Enum '" + path + "' in " + this);
              return found;
            };
            Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path) {
              var found = this.lookup(path, [ Type, Enum ]);
              if (!found) throw Error("no such Type or Enum '" + path + "' in " + this);
              return found;
            };
            Namespace.prototype.lookupService = function lookupService(path) {
              var found = this.lookup(path, [ Service ]);
              if (!found) throw Error("no such Service '" + path + "' in " + this);
              return found;
            };
            Namespace._configure = function(Type_, Service_, Enum_) {
              Type = Type_;
              Service = Service_;
              Enum = Enum_;
            };
          }, {
            16: 16,
            24: 24,
            37: 37
          } ],
          24: [ function(require, module, exports) {
            module.exports = ReflectionObject;
            ReflectionObject.className = "ReflectionObject";
            var util = require(37);
            var Root;
            function ReflectionObject(name, options) {
              if (!util.isString(name)) throw TypeError("name must be a string");
              if (options && !util.isObject(options)) throw TypeError("options must be an object");
              this.options = options;
              this.parsedOptions = null;
              this.name = name;
              this.parent = null;
              this.resolved = false;
              this.comment = null;
              this.filename = null;
            }
            Object.defineProperties(ReflectionObject.prototype, {
              root: {
                get: function get() {
                  var ptr = this;
                  while (null !== ptr.parent) ptr = ptr.parent;
                  return ptr;
                }
              },
              fullName: {
                get: function get() {
                  var path = [ this.name ], ptr = this.parent;
                  while (ptr) {
                    path.unshift(ptr.name);
                    ptr = ptr.parent;
                  }
                  return path.join(".");
                }
              }
            });
            ReflectionObject.prototype.toJSON = function toJSON() {
              throw Error();
            };
            ReflectionObject.prototype.onAdd = function onAdd(parent) {
              this.parent && this.parent !== parent && this.parent.remove(this);
              this.parent = parent;
              this.resolved = false;
              var root = parent.root;
              root instanceof Root && root._handleAdd(this);
            };
            ReflectionObject.prototype.onRemove = function onRemove(parent) {
              var root = parent.root;
              root instanceof Root && root._handleRemove(this);
              this.parent = null;
              this.resolved = false;
            };
            ReflectionObject.prototype.resolve = function resolve() {
              if (this.resolved) return this;
              this.root instanceof Root && (this.resolved = true);
              return this;
            };
            ReflectionObject.prototype.getOption = function getOption(name) {
              if (this.options) return this.options[name];
              return undefined;
            };
            ReflectionObject.prototype.setOption = function setOption(name, value, ifNotSet) {
              ifNotSet && this.options && this.options[name] !== undefined || ((this.options || (this.options = {}))[name] = value);
              return this;
            };
            ReflectionObject.prototype.setParsedOption = function setParsedOption(name, value, propName) {
              this.parsedOptions || (this.parsedOptions = []);
              var parsedOptions = this.parsedOptions;
              if (propName) {
                var opt = parsedOptions.find(function(opt) {
                  return Object.prototype.hasOwnProperty.call(opt, name);
                });
                if (opt) {
                  var newValue = opt[name];
                  util.setProperty(newValue, propName, value);
                } else {
                  opt = {};
                  opt[name] = util.setProperty({}, propName, value);
                  parsedOptions.push(opt);
                }
              } else {
                var newOpt = {};
                newOpt[name] = value;
                parsedOptions.push(newOpt);
              }
              return this;
            };
            ReflectionObject.prototype.setOptions = function setOptions(options, ifNotSet) {
              if (options) for (var keys = Object.keys(options), i = 0; i < keys.length; ++i) this.setOption(keys[i], options[keys[i]], ifNotSet);
              return this;
            };
            ReflectionObject.prototype.toString = function toString() {
              var className = this.constructor.className, fullName = this.fullName;
              if (fullName.length) return className + " " + fullName;
              return className;
            };
            ReflectionObject._configure = function(Root_) {
              Root = Root_;
            };
          }, {
            37: 37
          } ],
          25: [ function(require, module, exports) {
            module.exports = OneOf;
            var ReflectionObject = require(24);
            ((OneOf.prototype = Object.create(ReflectionObject.prototype)).constructor = OneOf).className = "OneOf";
            var Field = require(16), util = require(37);
            function OneOf(name, fieldNames, options, comment) {
              if (!Array.isArray(fieldNames)) {
                options = fieldNames;
                fieldNames = undefined;
              }
              ReflectionObject.call(this, name, options);
              if (!(fieldNames === undefined || Array.isArray(fieldNames))) throw TypeError("fieldNames must be an Array");
              this.oneof = fieldNames || [];
              this.fieldsArray = [];
              this.comment = comment;
            }
            OneOf.fromJSON = function fromJSON(name, json) {
              return new OneOf(name, json.oneof, json.options, json.comment);
            };
            OneOf.prototype.toJSON = function toJSON(toJSONOptions) {
              var keepComments = !!toJSONOptions && Boolean(toJSONOptions.keepComments);
              return util.toObject([ "options", this.options, "oneof", this.oneof, "comment", keepComments ? this.comment : undefined ]);
            };
            function addFieldsToParent(oneof) {
              if (oneof.parent) for (var i = 0; i < oneof.fieldsArray.length; ++i) oneof.fieldsArray[i].parent || oneof.parent.add(oneof.fieldsArray[i]);
            }
            OneOf.prototype.add = function add(field) {
              if (!(field instanceof Field)) throw TypeError("field must be a Field");
              field.parent && field.parent !== this.parent && field.parent.remove(field);
              this.oneof.push(field.name);
              this.fieldsArray.push(field);
              field.partOf = this;
              addFieldsToParent(this);
              return this;
            };
            OneOf.prototype.remove = function remove(field) {
              if (!(field instanceof Field)) throw TypeError("field must be a Field");
              var index = this.fieldsArray.indexOf(field);
              if (index < 0) throw Error(field + " is not a member of " + this);
              this.fieldsArray.splice(index, 1);
              index = this.oneof.indexOf(field.name);
              index > -1 && this.oneof.splice(index, 1);
              field.partOf = null;
              return this;
            };
            OneOf.prototype.onAdd = function onAdd(parent) {
              ReflectionObject.prototype.onAdd.call(this, parent);
              var self = this;
              for (var i = 0; i < this.oneof.length; ++i) {
                var field = parent.get(this.oneof[i]);
                if (field && !field.partOf) {
                  field.partOf = self;
                  self.fieldsArray.push(field);
                }
              }
              addFieldsToParent(this);
            };
            OneOf.prototype.onRemove = function onRemove(parent) {
              for (var i = 0, field; i < this.fieldsArray.length; ++i) (field = this.fieldsArray[i]).parent && field.parent.remove(field);
              ReflectionObject.prototype.onRemove.call(this, parent);
            };
            OneOf.d = function decorateOneOf() {
              var fieldNames = new Array(arguments.length), index = 0;
              while (index < arguments.length) fieldNames[index] = arguments[index++];
              return function oneOfDecorator(prototype, oneofName) {
                util.decorateType(prototype.constructor).add(new OneOf(oneofName, fieldNames));
                Object.defineProperty(prototype, oneofName, {
                  get: util.oneOfGetter(fieldNames),
                  set: util.oneOfSetter(fieldNames)
                });
              };
            };
          }, {
            16: 16,
            24: 24,
            37: 37
          } ],
          26: [ function(require, module, exports) {
            module.exports = parse;
            parse.filename = null;
            parse.defaults = {
              keepCase: false
            };
            var tokenize = require(34), Root = require(29), Type = require(35), Field = require(16), MapField = require(20), OneOf = require(25), Enum = require(15), Service = require(33), Method = require(22), types = require(36), util = require(37);
            var base10Re = /^[1-9][0-9]*$/, base10NegRe = /^-?[1-9][0-9]*$/, base16Re = /^0[x][0-9a-fA-F]+$/, base16NegRe = /^-?0[x][0-9a-fA-F]+$/, base8Re = /^0[0-7]+$/, base8NegRe = /^-?0[0-7]+$/, numberRe = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/, nameRe = /^[a-zA-Z_][a-zA-Z_0-9]*$/, typeRefRe = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/, fqTypeRefRe = /^(?:\.[a-zA-Z_][a-zA-Z_0-9]*)+$/;
            function parse(source, root, options) {
              if (!(root instanceof Root)) {
                options = root;
                root = new Root();
              }
              options || (options = parse.defaults);
              var preferTrailingComment = options.preferTrailingComment || false;
              var tn = tokenize(source, options.alternateCommentMode || false), next = tn.next, push = tn.push, peek = tn.peek, skip = tn.skip, cmnt = tn.cmnt;
              var head = true, pkg, imports, weakImports, syntax, isProto3 = false;
              var ptr = root;
              var applyCase = options.keepCase ? function(name) {
                return name;
              } : util.camelCase;
              function illegal(token, name, insideTryCatch) {
                var filename = parse.filename;
                insideTryCatch || (parse.filename = null);
                return Error("illegal " + (name || "token") + " '" + token + "' (" + (filename ? filename + ", " : "") + "line " + tn.line + ")");
              }
              function readString() {
                var values = [], token;
                do {
                  if ('"' !== (token = next()) && "'" !== token) throw illegal(token);
                  values.push(next());
                  skip(token);
                  token = peek();
                } while ('"' === token || "'" === token);
                return values.join("");
              }
              function readValue(acceptTypeRef) {
                var token = next();
                switch (token) {
                 case "'":
                 case '"':
                  push(token);
                  return readString();

                 case "true":
                 case "TRUE":
                  return true;

                 case "false":
                 case "FALSE":
                  return false;
                }
                try {
                  return parseNumber(token, true);
                } catch (e) {
                  if (acceptTypeRef && typeRefRe.test(token)) return token;
                  throw illegal(token, "value");
                }
              }
              function readRanges(target, acceptStrings) {
                var token, start;
                do {
                  !acceptStrings || '"' !== (token = peek()) && "'" !== token ? target.push([ start = parseId(next()), skip("to", true) ? parseId(next()) : start ]) : target.push(readString());
                } while (skip(",", true));
                skip(";");
              }
              function parseNumber(token, insideTryCatch) {
                var sign = 1;
                if ("-" === token.charAt(0)) {
                  sign = -1;
                  token = token.substring(1);
                }
                switch (token) {
                 case "inf":
                 case "INF":
                 case "Inf":
                  return Infinity * sign;

                 case "nan":
                 case "NAN":
                 case "Nan":
                 case "NaN":
                  return NaN;

                 case "0":
                  return 0;
                }
                if (base10Re.test(token)) return sign * parseInt(token, 10);
                if (base16Re.test(token)) return sign * parseInt(token, 16);
                if (base8Re.test(token)) return sign * parseInt(token, 8);
                if (numberRe.test(token)) return sign * parseFloat(token);
                throw illegal(token, "number", insideTryCatch);
              }
              function parseId(token, acceptNegative) {
                switch (token) {
                 case "max":
                 case "MAX":
                 case "Max":
                  return 536870911;

                 case "0":
                  return 0;
                }
                if (!acceptNegative && "-" === token.charAt(0)) throw illegal(token, "id");
                if (base10NegRe.test(token)) return parseInt(token, 10);
                if (base16NegRe.test(token)) return parseInt(token, 16);
                if (base8NegRe.test(token)) return parseInt(token, 8);
                throw illegal(token, "id");
              }
              function parsePackage() {
                if (pkg !== undefined) throw illegal("package");
                pkg = next();
                if (!typeRefRe.test(pkg)) throw illegal(pkg, "name");
                ptr = ptr.define(pkg);
                skip(";");
              }
              function parseImport() {
                var token = peek();
                var whichImports;
                switch (token) {
                 case "weak":
                  whichImports = weakImports || (weakImports = []);
                  next();
                  break;

                 case "public":
                  next();

                 default:
                  whichImports = imports || (imports = []);
                }
                token = readString();
                skip(";");
                whichImports.push(token);
              }
              function parseSyntax() {
                skip("=");
                syntax = readString();
                isProto3 = "proto3" === syntax;
                if (!isProto3 && "proto2" !== syntax) throw illegal(syntax, "syntax");
                skip(";");
              }
              function parseCommon(parent, token) {
                switch (token) {
                 case "option":
                  parseOption(parent, token);
                  skip(";");
                  return true;

                 case "message":
                  parseType(parent, token);
                  return true;

                 case "enum":
                  parseEnum(parent, token);
                  return true;

                 case "service":
                  parseService(parent, token);
                  return true;

                 case "extend":
                  parseExtension(parent, token);
                  return true;
                }
                return false;
              }
              function ifBlock(obj, fnIf, fnElse) {
                var trailingLine = tn.line;
                if (obj) {
                  "string" !== typeof obj.comment && (obj.comment = cmnt());
                  obj.filename = parse.filename;
                }
                if (skip("{", true)) {
                  var token;
                  while ("}" !== (token = next())) fnIf(token);
                  skip(";", true);
                } else {
                  fnElse && fnElse();
                  skip(";");
                  obj && ("string" !== typeof obj.comment || preferTrailingComment) && (obj.comment = cmnt(trailingLine) || obj.comment);
                }
              }
              function parseType(parent, token) {
                if (!nameRe.test(token = next())) throw illegal(token, "type name");
                var type = new Type(token);
                ifBlock(type, function parseType_block(token) {
                  if (parseCommon(type, token)) return;
                  switch (token) {
                   case "map":
                    parseMapField(type, token);
                    break;

                   case "required":
                   case "optional":
                   case "repeated":
                    parseField(type, token);
                    break;

                   case "oneof":
                    parseOneOf(type, token);
                    break;

                   case "extensions":
                    readRanges(type.extensions || (type.extensions = []));
                    break;

                   case "reserved":
                    readRanges(type.reserved || (type.reserved = []), true);
                    break;

                   default:
                    if (!isProto3 || !typeRefRe.test(token)) throw illegal(token);
                    push(token);
                    parseField(type, "optional");
                  }
                });
                parent.add(type);
              }
              function parseField(parent, rule, extend) {
                var type = next();
                if ("group" === type) {
                  parseGroup(parent, rule);
                  return;
                }
                if (!typeRefRe.test(type)) throw illegal(type, "type");
                var name = next();
                if (!nameRe.test(name)) throw illegal(name, "name");
                name = applyCase(name);
                skip("=");
                var field = new Field(name, parseId(next()), type, rule, extend);
                ifBlock(field, function parseField_block(token) {
                  if ("option" !== token) throw illegal(token);
                  parseOption(field, token);
                  skip(";");
                }, function parseField_line() {
                  parseInlineOptions(field);
                });
                parent.add(field);
                isProto3 || !field.repeated || types.packed[type] === undefined && types.basic[type] !== undefined || field.setOption("packed", false, true);
              }
              function parseGroup(parent, rule) {
                var name = next();
                if (!nameRe.test(name)) throw illegal(name, "name");
                var fieldName = util.lcFirst(name);
                name === fieldName && (name = util.ucFirst(name));
                skip("=");
                var id = parseId(next());
                var type = new Type(name);
                type.group = true;
                var field = new Field(fieldName, id, name, rule);
                field.filename = parse.filename;
                ifBlock(type, function parseGroup_block(token) {
                  switch (token) {
                   case "option":
                    parseOption(type, token);
                    skip(";");
                    break;

                   case "required":
                   case "optional":
                   case "repeated":
                    parseField(type, token);
                    break;

                   default:
                    throw illegal(token);
                  }
                });
                parent.add(type).add(field);
              }
              function parseMapField(parent) {
                skip("<");
                var keyType = next();
                if (types.mapKey[keyType] === undefined) throw illegal(keyType, "type");
                skip(",");
                var valueType = next();
                if (!typeRefRe.test(valueType)) throw illegal(valueType, "type");
                skip(">");
                var name = next();
                if (!nameRe.test(name)) throw illegal(name, "name");
                skip("=");
                var field = new MapField(applyCase(name), parseId(next()), keyType, valueType);
                ifBlock(field, function parseMapField_block(token) {
                  if ("option" !== token) throw illegal(token);
                  parseOption(field, token);
                  skip(";");
                }, function parseMapField_line() {
                  parseInlineOptions(field);
                });
                parent.add(field);
              }
              function parseOneOf(parent, token) {
                if (!nameRe.test(token = next())) throw illegal(token, "name");
                var oneof = new OneOf(applyCase(token));
                ifBlock(oneof, function parseOneOf_block(token) {
                  if ("option" === token) {
                    parseOption(oneof, token);
                    skip(";");
                  } else {
                    push(token);
                    parseField(oneof, "optional");
                  }
                });
                parent.add(oneof);
              }
              function parseEnum(parent, token) {
                if (!nameRe.test(token = next())) throw illegal(token, "name");
                var enm = new Enum(token);
                ifBlock(enm, function parseEnum_block(token) {
                  switch (token) {
                   case "option":
                    parseOption(enm, token);
                    skip(";");
                    break;

                   case "reserved":
                    readRanges(enm.reserved || (enm.reserved = []), true);
                    break;

                   default:
                    parseEnumValue(enm, token);
                  }
                });
                parent.add(enm);
              }
              function parseEnumValue(parent, token) {
                if (!nameRe.test(token)) throw illegal(token, "name");
                skip("=");
                var value = parseId(next(), true), dummy = {};
                ifBlock(dummy, function parseEnumValue_block(token) {
                  if ("option" !== token) throw illegal(token);
                  parseOption(dummy, token);
                  skip(";");
                }, function parseEnumValue_line() {
                  parseInlineOptions(dummy);
                });
                parent.add(token, value, dummy.comment);
              }
              function parseOption(parent, token) {
                var isCustom = skip("(", true);
                if (!typeRefRe.test(token = next())) throw illegal(token, "name");
                var name = token;
                var option = name;
                var propName;
                if (isCustom) {
                  skip(")");
                  name = "(" + name + ")";
                  option = name;
                  token = peek();
                  if (fqTypeRefRe.test(token)) {
                    propName = token.substr(1);
                    name += token;
                    next();
                  }
                }
                skip("=");
                var optionValue = parseOptionValue(parent, name);
                setParsedOption(parent, option, optionValue, propName);
              }
              function parseOptionValue(parent, name) {
                if (skip("{", true)) {
                  var result = {};
                  while (!skip("}", true)) {
                    if (!nameRe.test(token = next())) throw illegal(token, "name");
                    var value;
                    var propName = token;
                    if ("{" === peek()) value = parseOptionValue(parent, name + "." + token); else {
                      skip(":");
                      if ("{" === peek()) value = parseOptionValue(parent, name + "." + token); else {
                        value = readValue(true);
                        setOption(parent, name + "." + token, value);
                      }
                    }
                    var prevValue = result[propName];
                    prevValue && (value = [].concat(prevValue).concat(value));
                    result[propName] = value;
                    skip(",", true);
                  }
                  return result;
                }
                var simpleValue = readValue(true);
                setOption(parent, name, simpleValue);
                return simpleValue;
              }
              function setOption(parent, name, value) {
                parent.setOption && parent.setOption(name, value);
              }
              function setParsedOption(parent, name, value, propName) {
                parent.setParsedOption && parent.setParsedOption(name, value, propName);
              }
              function parseInlineOptions(parent) {
                if (skip("[", true)) {
                  do {
                    parseOption(parent, "option");
                  } while (skip(",", true));
                  skip("]");
                }
                return parent;
              }
              function parseService(parent, token) {
                if (!nameRe.test(token = next())) throw illegal(token, "service name");
                var service = new Service(token);
                ifBlock(service, function parseService_block(token) {
                  if (parseCommon(service, token)) return;
                  if ("rpc" !== token) throw illegal(token);
                  parseMethod(service, token);
                });
                parent.add(service);
              }
              function parseMethod(parent, token) {
                var commentText = cmnt();
                var type = token;
                if (!nameRe.test(token = next())) throw illegal(token, "name");
                var name = token, requestType, requestStream, responseType, responseStream;
                skip("(");
                skip("stream", true) && (requestStream = true);
                if (!typeRefRe.test(token = next())) throw illegal(token);
                requestType = token;
                skip(")");
                skip("returns");
                skip("(");
                skip("stream", true) && (responseStream = true);
                if (!typeRefRe.test(token = next())) throw illegal(token);
                responseType = token;
                skip(")");
                var method = new Method(name, type, requestType, responseType, requestStream, responseStream);
                method.comment = commentText;
                ifBlock(method, function parseMethod_block(token) {
                  if ("option" !== token) throw illegal(token);
                  parseOption(method, token);
                  skip(";");
                });
                parent.add(method);
              }
              function parseExtension(parent, token) {
                if (!typeRefRe.test(token = next())) throw illegal(token, "reference");
                var reference = token;
                ifBlock(null, function parseExtension_block(token) {
                  switch (token) {
                   case "required":
                   case "repeated":
                   case "optional":
                    parseField(parent, token, reference);
                    break;

                   default:
                    if (!isProto3 || !typeRefRe.test(token)) throw illegal(token);
                    push(token);
                    parseField(parent, "optional", reference);
                  }
                });
              }
              var token;
              while (null !== (token = next())) switch (token) {
               case "package":
                if (!head) throw illegal(token);
                parsePackage();
                break;

               case "import":
                if (!head) throw illegal(token);
                parseImport();
                break;

               case "syntax":
                if (!head) throw illegal(token);
                parseSyntax();
                break;

               case "option":
                parseOption(ptr, token);
                skip(";");
                break;

               default:
                if (parseCommon(ptr, token)) {
                  head = false;
                  continue;
                }
                throw illegal(token);
              }
              parse.filename = null;
              return {
                package: pkg,
                imports: imports,
                weakImports: weakImports,
                syntax: syntax,
                root: root
              };
            }
          }, {
            15: 15,
            16: 16,
            20: 20,
            22: 22,
            25: 25,
            29: 29,
            33: 33,
            34: 34,
            35: 35,
            36: 36,
            37: 37
          } ],
          27: [ function(require, module, exports) {
            module.exports = Reader;
            var util = require(39);
            var BufferReader;
            var LongBits = util.LongBits, utf8 = util.utf8;
            function indexOutOfRange(reader, writeLength) {
              return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
            }
            function Reader(buffer) {
              this.buf = buffer;
              this.pos = 0;
              this.len = buffer.length;
            }
            var create_array = "undefined" !== typeof Uint8Array ? function create_typed_array(buffer) {
              if (buffer instanceof Uint8Array || Array.isArray(buffer)) return new Reader(buffer);
              throw Error("illegal buffer");
            } : function create_array(buffer) {
              if (Array.isArray(buffer)) return new Reader(buffer);
              throw Error("illegal buffer");
            };
            var create = function create() {
              return util.Buffer ? function create_buffer_setup(buffer) {
                return (Reader.create = function create_buffer(buffer) {
                  return util.Buffer.isBuffer(buffer) ? new BufferReader(buffer) : create_array(buffer);
                })(buffer);
              } : create_array;
            };
            Reader.create = create();
            Reader.prototype._slice = util.Array.prototype.subarray || util.Array.prototype.slice;
            Reader.prototype.uint32 = function read_uint32_setup() {
              var value = 4294967295;
              return function read_uint32() {
                value = (127 & this.buf[this.pos]) >>> 0;
                if (this.buf[this.pos++] < 128) return value;
                value = (value | (127 & this.buf[this.pos]) << 7) >>> 0;
                if (this.buf[this.pos++] < 128) return value;
                value = (value | (127 & this.buf[this.pos]) << 14) >>> 0;
                if (this.buf[this.pos++] < 128) return value;
                value = (value | (127 & this.buf[this.pos]) << 21) >>> 0;
                if (this.buf[this.pos++] < 128) return value;
                value = (value | (15 & this.buf[this.pos]) << 28) >>> 0;
                if (this.buf[this.pos++] < 128) return value;
                if ((this.pos += 5) > this.len) {
                  this.pos = this.len;
                  throw indexOutOfRange(this, 10);
                }
                return value;
              };
            }();
            Reader.prototype.int32 = function read_int32() {
              return 0 | this.uint32();
            };
            Reader.prototype.sint32 = function read_sint32() {
              var value = this.uint32();
              return value >>> 1 ^ -(1 & value) | 0;
            };
            function readLongVarint() {
              var bits = new LongBits(0, 0);
              var i = 0;
              if (!(this.len - this.pos > 4)) {
                for (;i < 3; ++i) {
                  if (this.pos >= this.len) throw indexOutOfRange(this);
                  bits.lo = (bits.lo | (127 & this.buf[this.pos]) << 7 * i) >>> 0;
                  if (this.buf[this.pos++] < 128) return bits;
                }
                bits.lo = (bits.lo | (127 & this.buf[this.pos++]) << 7 * i) >>> 0;
                return bits;
              }
              for (;i < 4; ++i) {
                bits.lo = (bits.lo | (127 & this.buf[this.pos]) << 7 * i) >>> 0;
                if (this.buf[this.pos++] < 128) return bits;
              }
              bits.lo = (bits.lo | (127 & this.buf[this.pos]) << 28) >>> 0;
              bits.hi = (bits.hi | (127 & this.buf[this.pos]) >> 4) >>> 0;
              if (this.buf[this.pos++] < 128) return bits;
              i = 0;
              if (this.len - this.pos > 4) for (;i < 5; ++i) {
                bits.hi = (bits.hi | (127 & this.buf[this.pos]) << 7 * i + 3) >>> 0;
                if (this.buf[this.pos++] < 128) return bits;
              } else for (;i < 5; ++i) {
                if (this.pos >= this.len) throw indexOutOfRange(this);
                bits.hi = (bits.hi | (127 & this.buf[this.pos]) << 7 * i + 3) >>> 0;
                if (this.buf[this.pos++] < 128) return bits;
              }
              throw Error("invalid varint encoding");
            }
            Reader.prototype.bool = function read_bool() {
              return 0 !== this.uint32();
            };
            function readFixed32_end(buf, end) {
              return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
            }
            Reader.prototype.fixed32 = function read_fixed32() {
              if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
              return readFixed32_end(this.buf, this.pos += 4);
            };
            Reader.prototype.sfixed32 = function read_sfixed32() {
              if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
              return 0 | readFixed32_end(this.buf, this.pos += 4);
            };
            function readFixed64() {
              if (this.pos + 8 > this.len) throw indexOutOfRange(this, 8);
              return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
            }
            Reader.prototype["float"] = function read_float() {
              if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
              var value = util["float"].readFloatLE(this.buf, this.pos);
              this.pos += 4;
              return value;
            };
            Reader.prototype["double"] = function read_double() {
              if (this.pos + 8 > this.len) throw indexOutOfRange(this, 4);
              var value = util["float"].readDoubleLE(this.buf, this.pos);
              this.pos += 8;
              return value;
            };
            Reader.prototype.bytes = function read_bytes() {
              var length = this.uint32(), start = this.pos, end = this.pos + length;
              if (end > this.len) throw indexOutOfRange(this, length);
              this.pos += length;
              if (Array.isArray(this.buf)) return this.buf.slice(start, end);
              return start === end ? new this.buf.constructor(0) : this._slice.call(this.buf, start, end);
            };
            Reader.prototype.string = function read_string() {
              var bytes = this.bytes();
              return utf8.read(bytes, 0, bytes.length);
            };
            Reader.prototype.skip = function skip(length) {
              if ("number" === typeof length) {
                if (this.pos + length > this.len) throw indexOutOfRange(this, length);
                this.pos += length;
              } else do {
                if (this.pos >= this.len) throw indexOutOfRange(this);
              } while (128 & this.buf[this.pos++]);
              return this;
            };
            Reader.prototype.skipType = function(wireType) {
              switch (wireType) {
               case 0:
                this.skip();
                break;

               case 1:
                this.skip(8);
                break;

               case 2:
                this.skip(this.uint32());
                break;

               case 3:
                while (4 !== (wireType = 7 & this.uint32())) this.skipType(wireType);
                break;

               case 5:
                this.skip(4);
                break;

               default:
                throw Error("invalid wire type " + wireType + " at offset " + this.pos);
              }
              return this;
            };
            Reader._configure = function(BufferReader_) {
              BufferReader = BufferReader_;
              Reader.create = create();
              BufferReader._configure();
              var fn = util.Long ? "toLong" : "toNumber";
              util.merge(Reader.prototype, {
                int64: function read_int64() {
                  return readLongVarint.call(this)[fn](false);
                },
                uint64: function read_uint64() {
                  return readLongVarint.call(this)[fn](true);
                },
                sint64: function read_sint64() {
                  return readLongVarint.call(this).zzDecode()[fn](false);
                },
                fixed64: function read_fixed64() {
                  return readFixed64.call(this)[fn](true);
                },
                sfixed64: function read_sfixed64() {
                  return readFixed64.call(this)[fn](false);
                }
              });
            };
          }, {
            39: 39
          } ],
          28: [ function(require, module, exports) {
            module.exports = BufferReader;
            var Reader = require(27);
            (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
            var util = require(39);
            function BufferReader(buffer) {
              Reader.call(this, buffer);
            }
            BufferReader._configure = function() {
              util.Buffer && (BufferReader.prototype._slice = util.Buffer.prototype.slice);
            };
            BufferReader.prototype.string = function read_string_buffer() {
              var len = this.uint32();
              return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
            };
            BufferReader._configure();
          }, {
            27: 27,
            39: 39
          } ],
          29: [ function(require, module, exports) {
            module.exports = Root;
            var Namespace = require(23);
            ((Root.prototype = Object.create(Namespace.prototype)).constructor = Root).className = "Root";
            var Field = require(16), Enum = require(15), OneOf = require(25), util = require(37);
            var Type, parse, common;
            function Root(options) {
              Namespace.call(this, "", options);
              this.deferred = [];
              this.files = [];
            }
            Root.fromJSON = function fromJSON(json, root) {
              root || (root = new Root());
              json.options && root.setOptions(json.options);
              return root.addJSON(json.nested);
            };
            Root.prototype.resolvePath = util.path.resolve;
            Root.prototype.fetch = util.fetch;
            function SYNC() {}
            Root.prototype.load = function load(filename, options, callback) {
              if ("function" === typeof options) {
                callback = options;
                options = undefined;
              }
              var self = this;
              if (!callback) return util.asPromise(load, self, filename, options);
              var sync = callback === SYNC;
              function finish(err, root) {
                if (!callback) return;
                var cb = callback;
                callback = null;
                if (sync) throw err;
                cb(err, root);
              }
              function getBundledFileName(filename) {
                var idx = filename.lastIndexOf("google/protobuf/");
                if (idx > -1) {
                  var altname = filename.substring(idx);
                  if (altname in common) return altname;
                }
                return null;
              }
              function process(filename, source) {
                try {
                  util.isString(source) && "{" === source.charAt(0) && (source = JSON.parse(source));
                  if (util.isString(source)) {
                    parse.filename = filename;
                    var parsed = parse(source, self, options), resolved, i = 0;
                    if (parsed.imports) for (;i < parsed.imports.length; ++i) (resolved = getBundledFileName(parsed.imports[i]) || self.resolvePath(filename, parsed.imports[i])) && fetch(resolved);
                    if (parsed.weakImports) for (i = 0; i < parsed.weakImports.length; ++i) (resolved = getBundledFileName(parsed.weakImports[i]) || self.resolvePath(filename, parsed.weakImports[i])) && fetch(resolved, true);
                  } else self.setOptions(source.options).addJSON(source.nested);
                } catch (err) {
                  finish(err);
                }
                sync || queued || finish(null, self);
              }
              function fetch(filename, weak) {
                if (self.files.indexOf(filename) > -1) return;
                self.files.push(filename);
                if (filename in common) {
                  if (sync) process(filename, common[filename]); else {
                    ++queued;
                    setTimeout(function() {
                      --queued;
                      process(filename, common[filename]);
                    });
                  }
                  return;
                }
                if (sync) {
                  var source;
                  try {
                    source = util.fs.readFileSync(filename).toString("utf8");
                  } catch (err) {
                    weak || finish(err);
                    return;
                  }
                  process(filename, source);
                } else {
                  ++queued;
                  self.fetch(filename, function(err, source) {
                    --queued;
                    if (!callback) return;
                    if (err) {
                      weak ? queued || finish(null, self) : finish(err);
                      return;
                    }
                    process(filename, source);
                  });
                }
              }
              var queued = 0;
              util.isString(filename) && (filename = [ filename ]);
              for (var i = 0, resolved; i < filename.length; ++i) (resolved = self.resolvePath("", filename[i])) && fetch(resolved);
              if (sync) return self;
              queued || finish(null, self);
              return undefined;
            };
            Root.prototype.loadSync = function loadSync(filename, options) {
              if (!util.isNode) throw Error("not supported");
              return this.load(filename, options, SYNC);
            };
            Root.prototype.resolveAll = function resolveAll() {
              if (this.deferred.length) throw Error("unresolvable extensions: " + this.deferred.map(function(field) {
                return "'extend " + field.extend + "' in " + field.parent.fullName;
              }).join(", "));
              return Namespace.prototype.resolveAll.call(this);
            };
            var exposeRe = /^[A-Z]/;
            function tryHandleExtension(root, field) {
              var extendedType = field.parent.lookup(field.extend);
              if (extendedType) {
                var sisterField = new Field(field.fullName, field.id, field.type, field.rule, undefined, field.options);
                sisterField.declaringField = field;
                field.extensionField = sisterField;
                extendedType.add(sisterField);
                return true;
              }
              return false;
            }
            Root.prototype._handleAdd = function _handleAdd(object) {
              if (object instanceof Field) object.extend === undefined || object.extensionField || tryHandleExtension(this, object) || this.deferred.push(object); else if (object instanceof Enum) exposeRe.test(object.name) && (object.parent[object.name] = object.values); else if (!(object instanceof OneOf)) {
                if (object instanceof Type) for (var i = 0; i < this.deferred.length; ) tryHandleExtension(this, this.deferred[i]) ? this.deferred.splice(i, 1) : ++i;
                for (var j = 0; j < object.nestedArray.length; ++j) this._handleAdd(object._nestedArray[j]);
                exposeRe.test(object.name) && (object.parent[object.name] = object);
              }
            };
            Root.prototype._handleRemove = function _handleRemove(object) {
              if (object instanceof Field) {
                if (object.extend !== undefined) if (object.extensionField) {
                  object.extensionField.parent.remove(object.extensionField);
                  object.extensionField = null;
                } else {
                  var index = this.deferred.indexOf(object);
                  index > -1 && this.deferred.splice(index, 1);
                }
              } else if (object instanceof Enum) exposeRe.test(object.name) && delete object.parent[object.name]; else if (object instanceof Namespace) {
                for (var i = 0; i < object.nestedArray.length; ++i) this._handleRemove(object._nestedArray[i]);
                exposeRe.test(object.name) && delete object.parent[object.name];
              }
            };
            Root._configure = function(Type_, parse_, common_) {
              Type = Type_;
              parse = parse_;
              common = common_;
            };
          }, {
            15: 15,
            16: 16,
            23: 23,
            25: 25,
            37: 37
          } ],
          30: [ function(require, module, exports) {
            module.exports = {};
          }, {} ],
          31: [ function(require, module, exports) {
            var rpc = exports;
            rpc.Service = require(32);
          }, {
            32: 32
          } ],
          32: [ function(require, module, exports) {
            module.exports = Service;
            var util = require(39);
            (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
            function Service(rpcImpl, requestDelimited, responseDelimited) {
              if ("function" !== typeof rpcImpl) throw TypeError("rpcImpl must be a function");
              util.EventEmitter.call(this);
              this.rpcImpl = rpcImpl;
              this.requestDelimited = Boolean(requestDelimited);
              this.responseDelimited = Boolean(responseDelimited);
            }
            Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
              if (!request) throw TypeError("request must be specified");
              var self = this;
              if (!callback) return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);
              if (!self.rpcImpl) {
                setTimeout(function() {
                  callback(Error("already ended"));
                }, 0);
                return undefined;
              }
              try {
                return self.rpcImpl(method, requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(), function rpcCallback(err, response) {
                  if (err) {
                    self.emit("error", err, method);
                    return callback(err);
                  }
                  if (null === response) {
                    self.end(true);
                    return undefined;
                  }
                  if (!(response instanceof responseCtor)) try {
                    response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                  } catch (err) {
                    self.emit("error", err, method);
                    return callback(err);
                  }
                  self.emit("data", response, method);
                  return callback(null, response);
                });
              } catch (err) {
                self.emit("error", err, method);
                setTimeout(function() {
                  callback(err);
                }, 0);
                return undefined;
              }
            };
            Service.prototype.end = function end(endedByRPC) {
              if (this.rpcImpl) {
                endedByRPC || this.rpcImpl(null, null, null);
                this.rpcImpl = null;
                this.emit("end").off();
              }
              return this;
            };
          }, {
            39: 39
          } ],
          33: [ function(require, module, exports) {
            module.exports = Service;
            var Namespace = require(23);
            ((Service.prototype = Object.create(Namespace.prototype)).constructor = Service).className = "Service";
            var Method = require(22), util = require(37), rpc = require(31);
            function Service(name, options) {
              Namespace.call(this, name, options);
              this.methods = {};
              this._methodsArray = null;
            }
            Service.fromJSON = function fromJSON(name, json) {
              var service = new Service(name, json.options);
              if (json.methods) for (var names = Object.keys(json.methods), i = 0; i < names.length; ++i) service.add(Method.fromJSON(names[i], json.methods[names[i]]));
              json.nested && service.addJSON(json.nested);
              service.comment = json.comment;
              return service;
            };
            Service.prototype.toJSON = function toJSON(toJSONOptions) {
              var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
              var keepComments = !!toJSONOptions && Boolean(toJSONOptions.keepComments);
              return util.toObject([ "options", inherited && inherited.options || undefined, "methods", Namespace.arrayToJSON(this.methodsArray, toJSONOptions) || {}, "nested", inherited && inherited.nested || undefined, "comment", keepComments ? this.comment : undefined ]);
            };
            Object.defineProperty(Service.prototype, "methodsArray", {
              get: function get() {
                return this._methodsArray || (this._methodsArray = util.toArray(this.methods));
              }
            });
            function clearCache(service) {
              service._methodsArray = null;
              return service;
            }
            Service.prototype.get = function get(name) {
              return this.methods[name] || Namespace.prototype.get.call(this, name);
            };
            Service.prototype.resolveAll = function resolveAll() {
              var methods = this.methodsArray;
              for (var i = 0; i < methods.length; ++i) methods[i].resolve();
              return Namespace.prototype.resolve.call(this);
            };
            Service.prototype.add = function add(object) {
              if (this.get(object.name)) throw Error("duplicate name '" + object.name + "' in " + this);
              if (object instanceof Method) {
                this.methods[object.name] = object;
                object.parent = this;
                return clearCache(this);
              }
              return Namespace.prototype.add.call(this, object);
            };
            Service.prototype.remove = function remove(object) {
              if (object instanceof Method) {
                if (this.methods[object.name] !== object) throw Error(object + " is not a member of " + this);
                delete this.methods[object.name];
                object.parent = null;
                return clearCache(this);
              }
              return Namespace.prototype.remove.call(this, object);
            };
            Service.prototype.create = function create(rpcImpl, requestDelimited, responseDelimited) {
              var rpcService = new rpc.Service(rpcImpl, requestDelimited, responseDelimited);
              for (var i = 0, method; i < this.methodsArray.length; ++i) {
                var methodName = util.lcFirst((method = this._methodsArray[i]).resolve().name).replace(/[^$\w_]/g, "");
                rpcService[methodName] = util.codegen([ "r", "c" ], util.isReserved(methodName) ? methodName + "_" : methodName)("return this.rpcCall(m,q,s,r,c)")({
                  m: method,
                  q: method.resolvedRequestType.ctor,
                  s: method.resolvedResponseType.ctor
                });
              }
              return rpcService;
            };
          }, {
            22: 22,
            23: 23,
            31: 31,
            37: 37
          } ],
          34: [ function(require, module, exports) {
            module.exports = tokenize;
            var delimRe = /[\s{}=;:[\],'"()<>]/g, stringDoubleRe = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g, stringSingleRe = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g;
            var setCommentRe = /^ *[*/]+ */, setCommentAltRe = /^\s*\*?\/*/, setCommentSplitRe = /\n/g, whitespaceRe = /\s/, unescapeRe = /\\(.?)/g;
            var unescapeMap = {
              0: "\0",
              r: "\r",
              n: "\n",
              t: "\t"
            };
            function unescape(str) {
              return str.replace(unescapeRe, function($0, $1) {
                switch ($1) {
                 case "\\":
                 case "":
                  return $1;

                 default:
                  return unescapeMap[$1] || "";
                }
              });
            }
            tokenize.unescape = unescape;
            function tokenize(source, alternateCommentMode) {
              source = source.toString();
              var offset = 0, length = source.length, line = 1, commentType = null, commentText = null, commentLine = 0, commentLineEmpty = false, commentIsLeading = false;
              var stack = [];
              var stringDelim = null;
              function illegal(subject) {
                return Error("illegal " + subject + " (line " + line + ")");
              }
              function readString() {
                var re = "'" === stringDelim ? stringSingleRe : stringDoubleRe;
                re.lastIndex = offset - 1;
                var match = re.exec(source);
                if (!match) throw illegal("string");
                offset = re.lastIndex;
                push(stringDelim);
                stringDelim = null;
                return unescape(match[1]);
              }
              function charAt(pos) {
                return source.charAt(pos);
              }
              function setComment(start, end, isLeading) {
                commentType = source.charAt(start++);
                commentLine = line;
                commentLineEmpty = false;
                commentIsLeading = isLeading;
                var lookback;
                lookback = alternateCommentMode ? 2 : 3;
                var commentOffset = start - lookback, c;
                do {
                  if (--commentOffset < 0 || "\n" === (c = source.charAt(commentOffset))) {
                    commentLineEmpty = true;
                    break;
                  }
                } while (" " === c || "\t" === c);
                var lines = source.substring(start, end).split(setCommentSplitRe);
                for (var i = 0; i < lines.length; ++i) lines[i] = lines[i].replace(alternateCommentMode ? setCommentAltRe : setCommentRe, "").trim();
                commentText = lines.join("\n").trim();
              }
              function isDoubleSlashCommentLine(startOffset) {
                var endOffset = findEndOfLine(startOffset);
                var lineText = source.substring(startOffset, endOffset);
                var isComment = /^\s*\/{1,2}/.test(lineText);
                return isComment;
              }
              function findEndOfLine(cursor) {
                var endOffset = cursor;
                while (endOffset < length && "\n" !== charAt(endOffset)) endOffset++;
                return endOffset;
              }
              function next() {
                if (stack.length > 0) return stack.shift();
                if (stringDelim) return readString();
                var repeat, prev, curr, start, isDoc, isLeadingComment = 0 === offset;
                do {
                  if (offset === length) return null;
                  repeat = false;
                  while (whitespaceRe.test(curr = charAt(offset))) {
                    if ("\n" === curr) {
                      isLeadingComment = true;
                      ++line;
                    }
                    if (++offset === length) return null;
                  }
                  if ("/" === charAt(offset)) {
                    if (++offset === length) throw illegal("comment");
                    if ("/" === charAt(offset)) if (alternateCommentMode) {
                      start = offset;
                      isDoc = false;
                      if (isDoubleSlashCommentLine(offset)) {
                        isDoc = true;
                        do {
                          offset = findEndOfLine(offset);
                          if (offset === length) break;
                          offset++;
                        } while (isDoubleSlashCommentLine(offset));
                      } else offset = Math.min(length, findEndOfLine(offset) + 1);
                      isDoc && setComment(start, offset, isLeadingComment);
                      line++;
                      repeat = true;
                    } else {
                      isDoc = "/" === charAt(start = offset + 1);
                      while ("\n" !== charAt(++offset)) if (offset === length) return null;
                      ++offset;
                      isDoc && setComment(start, offset - 1, isLeadingComment);
                      ++line;
                      repeat = true;
                    } else {
                      if ("*" !== (curr = charAt(offset))) return "/";
                      start = offset + 1;
                      isDoc = alternateCommentMode || "*" === charAt(start);
                      do {
                        "\n" === curr && ++line;
                        if (++offset === length) throw illegal("comment");
                        prev = curr;
                        curr = charAt(offset);
                      } while ("*" !== prev || "/" !== curr);
                      ++offset;
                      isDoc && setComment(start, offset - 2, isLeadingComment);
                      repeat = true;
                    }
                  }
                } while (repeat);
                var end = offset;
                delimRe.lastIndex = 0;
                var delim = delimRe.test(charAt(end++));
                if (!delim) while (end < length && !delimRe.test(charAt(end))) ++end;
                var token = source.substring(offset, offset = end);
                '"' !== token && "'" !== token || (stringDelim = token);
                return token;
              }
              function push(token) {
                stack.push(token);
              }
              function peek() {
                if (!stack.length) {
                  var token = next();
                  if (null === token) return null;
                  push(token);
                }
                return stack[0];
              }
              function skip(expected, optional) {
                var actual = peek(), equals = actual === expected;
                if (equals) {
                  next();
                  return true;
                }
                if (!optional) throw illegal("token '" + actual + "', '" + expected + "' expected");
                return false;
              }
              function cmnt(trailingLine) {
                var ret = null;
                if (trailingLine === undefined) commentLine === line - 1 && (alternateCommentMode || "*" === commentType || commentLineEmpty) && (ret = commentIsLeading ? commentText : null); else {
                  commentLine < trailingLine && peek();
                  commentLine !== trailingLine || commentLineEmpty || !alternateCommentMode && "/" !== commentType || (ret = commentIsLeading ? null : commentText);
                }
                return ret;
              }
              return Object.defineProperty({
                next: next,
                peek: peek,
                push: push,
                skip: skip,
                cmnt: cmnt
              }, "line", {
                get: function get() {
                  return line;
                }
              });
            }
          }, {} ],
          35: [ function(require, module, exports) {
            module.exports = Type;
            var Namespace = require(23);
            ((Type.prototype = Object.create(Namespace.prototype)).constructor = Type).className = "Type";
            var Enum = require(15), OneOf = require(25), Field = require(16), MapField = require(20), Service = require(33), Message = require(21), Reader = require(27), Writer = require(42), util = require(37), encoder = require(14), decoder = require(13), verifier = require(40), converter = require(12), wrappers = require(41);
            function Type(name, options) {
              Namespace.call(this, name, options);
              this.fields = {};
              this.oneofs = undefined;
              this.extensions = undefined;
              this.reserved = undefined;
              this.group = undefined;
              this._fieldsById = null;
              this._fieldsArray = null;
              this._oneofsArray = null;
              this._ctor = null;
            }
            Object.defineProperties(Type.prototype, {
              fieldsById: {
                get: function get() {
                  if (this._fieldsById) return this._fieldsById;
                  this._fieldsById = {};
                  for (var names = Object.keys(this.fields), i = 0; i < names.length; ++i) {
                    var field = this.fields[names[i]], id = field.id;
                    if (this._fieldsById[id]) throw Error("duplicate id " + id + " in " + this);
                    this._fieldsById[id] = field;
                  }
                  return this._fieldsById;
                }
              },
              fieldsArray: {
                get: function get() {
                  return this._fieldsArray || (this._fieldsArray = util.toArray(this.fields));
                }
              },
              oneofsArray: {
                get: function get() {
                  return this._oneofsArray || (this._oneofsArray = util.toArray(this.oneofs));
                }
              },
              ctor: {
                get: function get() {
                  return this._ctor || (this.ctor = Type.generateConstructor(this)());
                },
                set: function set(ctor) {
                  var prototype = ctor.prototype;
                  if (!(prototype instanceof Message)) {
                    (ctor.prototype = new Message()).constructor = ctor;
                    util.merge(ctor.prototype, prototype);
                  }
                  ctor.$type = ctor.prototype.$type = this;
                  util.merge(ctor, Message, true);
                  this._ctor = ctor;
                  var i = 0;
                  for (;i < this.fieldsArray.length; ++i) this._fieldsArray[i].resolve();
                  var ctorProperties = {};
                  for (i = 0; i < this.oneofsArray.length; ++i) ctorProperties[this._oneofsArray[i].resolve().name] = {
                    get: util.oneOfGetter(this._oneofsArray[i].oneof),
                    set: util.oneOfSetter(this._oneofsArray[i].oneof)
                  };
                  i && Object.defineProperties(ctor.prototype, ctorProperties);
                }
              }
            });
            Type.generateConstructor = function generateConstructor(mtype) {
              var gen = util.codegen([ "p" ], mtype.name);
              for (var i = 0, field; i < mtype.fieldsArray.length; ++i) (field = mtype._fieldsArray[i]).map ? gen("this%s={}", util.safeProp(field.name)) : field.repeated && gen("this%s=[]", util.safeProp(field.name));
              return gen("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]");
            };
            function clearCache(type) {
              type._fieldsById = type._fieldsArray = type._oneofsArray = null;
              delete type.encode;
              delete type.decode;
              delete type.verify;
              return type;
            }
            Type.fromJSON = function fromJSON(name, json) {
              var type = new Type(name, json.options);
              type.extensions = json.extensions;
              type.reserved = json.reserved;
              var names = Object.keys(json.fields), i = 0;
              for (;i < names.length; ++i) type.add(("undefined" !== typeof json.fields[names[i]].keyType ? MapField.fromJSON : Field.fromJSON)(names[i], json.fields[names[i]]));
              if (json.oneofs) for (names = Object.keys(json.oneofs), i = 0; i < names.length; ++i) type.add(OneOf.fromJSON(names[i], json.oneofs[names[i]]));
              if (json.nested) for (names = Object.keys(json.nested), i = 0; i < names.length; ++i) {
                var nested = json.nested[names[i]];
                type.add((nested.id !== undefined ? Field.fromJSON : nested.fields !== undefined ? Type.fromJSON : nested.values !== undefined ? Enum.fromJSON : nested.methods !== undefined ? Service.fromJSON : Namespace.fromJSON)(names[i], nested));
              }
              json.extensions && json.extensions.length && (type.extensions = json.extensions);
              json.reserved && json.reserved.length && (type.reserved = json.reserved);
              json.group && (type.group = true);
              json.comment && (type.comment = json.comment);
              return type;
            };
            Type.prototype.toJSON = function toJSON(toJSONOptions) {
              var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
              var keepComments = !!toJSONOptions && Boolean(toJSONOptions.keepComments);
              return util.toObject([ "options", inherited && inherited.options || undefined, "oneofs", Namespace.arrayToJSON(this.oneofsArray, toJSONOptions), "fields", Namespace.arrayToJSON(this.fieldsArray.filter(function(obj) {
                return !obj.declaringField;
              }), toJSONOptions) || {}, "extensions", this.extensions && this.extensions.length ? this.extensions : undefined, "reserved", this.reserved && this.reserved.length ? this.reserved : undefined, "group", this.group || undefined, "nested", inherited && inherited.nested || undefined, "comment", keepComments ? this.comment : undefined ]);
            };
            Type.prototype.resolveAll = function resolveAll() {
              var fields = this.fieldsArray, i = 0;
              while (i < fields.length) fields[i++].resolve();
              var oneofs = this.oneofsArray;
              i = 0;
              while (i < oneofs.length) oneofs[i++].resolve();
              return Namespace.prototype.resolveAll.call(this);
            };
            Type.prototype.get = function get(name) {
              return this.fields[name] || this.oneofs && this.oneofs[name] || this.nested && this.nested[name] || null;
            };
            Type.prototype.add = function add(object) {
              if (this.get(object.name)) throw Error("duplicate name '" + object.name + "' in " + this);
              if (object instanceof Field && object.extend === undefined) {
                if (this._fieldsById ? this._fieldsById[object.id] : this.fieldsById[object.id]) throw Error("duplicate id " + object.id + " in " + this);
                if (this.isReservedId(object.id)) throw Error("id " + object.id + " is reserved in " + this);
                if (this.isReservedName(object.name)) throw Error("name '" + object.name + "' is reserved in " + this);
                object.parent && object.parent.remove(object);
                this.fields[object.name] = object;
                object.message = this;
                object.onAdd(this);
                return clearCache(this);
              }
              if (object instanceof OneOf) {
                this.oneofs || (this.oneofs = {});
                this.oneofs[object.name] = object;
                object.onAdd(this);
                return clearCache(this);
              }
              return Namespace.prototype.add.call(this, object);
            };
            Type.prototype.remove = function remove(object) {
              if (object instanceof Field && object.extend === undefined) {
                if (!this.fields || this.fields[object.name] !== object) throw Error(object + " is not a member of " + this);
                delete this.fields[object.name];
                object.parent = null;
                object.onRemove(this);
                return clearCache(this);
              }
              if (object instanceof OneOf) {
                if (!this.oneofs || this.oneofs[object.name] !== object) throw Error(object + " is not a member of " + this);
                delete this.oneofs[object.name];
                object.parent = null;
                object.onRemove(this);
                return clearCache(this);
              }
              return Namespace.prototype.remove.call(this, object);
            };
            Type.prototype.isReservedId = function isReservedId(id) {
              return Namespace.isReservedId(this.reserved, id);
            };
            Type.prototype.isReservedName = function isReservedName(name) {
              return Namespace.isReservedName(this.reserved, name);
            };
            Type.prototype.create = function create(properties) {
              return new this.ctor(properties);
            };
            Type.prototype.setup = function setup() {
              var fullName = this.fullName, types = [];
              for (var i = 0; i < this.fieldsArray.length; ++i) types.push(this._fieldsArray[i].resolve().resolvedType);
              this.encode = encoder(this)({
                Writer: Writer,
                types: types,
                util: util
              });
              this.decode = decoder(this)({
                Reader: Reader,
                types: types,
                util: util
              });
              this.verify = verifier(this)({
                types: types,
                util: util
              });
              this.fromObject = converter.fromObject(this)({
                types: types,
                util: util
              });
              this.toObject = converter.toObject(this)({
                types: types,
                util: util
              });
              var wrapper = wrappers[fullName];
              if (wrapper) {
                var originalThis = Object.create(this);
                originalThis.fromObject = this.fromObject;
                this.fromObject = wrapper.fromObject.bind(originalThis);
                originalThis.toObject = this.toObject;
                this.toObject = wrapper.toObject.bind(originalThis);
              }
              return this;
            };
            Type.prototype.encode = function encode_setup(message, writer) {
              return this.setup().encode(message, writer);
            };
            Type.prototype.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Type.prototype.decode = function decode_setup(reader, length) {
              return this.setup().decode(reader, length);
            };
            Type.prototype.decodeDelimited = function decodeDelimited(reader) {
              reader instanceof Reader || (reader = Reader.create(reader));
              return this.decode(reader, reader.uint32());
            };
            Type.prototype.verify = function verify_setup(message) {
              return this.setup().verify(message);
            };
            Type.prototype.fromObject = function fromObject(object) {
              return this.setup().fromObject(object);
            };
            Type.prototype.toObject = function toObject(message, options) {
              return this.setup().toObject(message, options);
            };
            Type.d = function decorateType(typeName) {
              return function typeDecorator(target) {
                util.decorateType(target, typeName);
              };
            };
          }, {
            12: 12,
            13: 13,
            14: 14,
            15: 15,
            16: 16,
            20: 20,
            21: 21,
            23: 23,
            25: 25,
            27: 27,
            33: 33,
            37: 37,
            40: 40,
            41: 41,
            42: 42
          } ],
          36: [ function(require, module, exports) {
            var types = exports;
            var util = require(37);
            var s = [ "double", "float", "int32", "uint32", "sint32", "fixed32", "sfixed32", "int64", "uint64", "sint64", "fixed64", "sfixed64", "bool", "string", "bytes" ];
            function bake(values, offset) {
              var i = 0, o = {};
              offset |= 0;
              while (i < values.length) o[s[i + offset]] = values[i++];
              return o;
            }
            types.basic = bake([ 1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2, 2 ]);
            types.defaults = bake([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false, "", util.emptyArray, null ]);
            types["long"] = bake([ 0, 0, 0, 1, 1 ], 7);
            types.mapKey = bake([ 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 2 ], 2);
            types.packed = bake([ 1, 5, 0, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0 ]);
          }, {
            37: 37
          } ],
          37: [ function(require, module, exports) {
            var util = module.exports = require(39);
            var roots = require(30);
            var Type, Enum;
            util.codegen = require(3);
            util.fetch = require(5);
            util.path = require(8);
            util.fs = util.inquire("fs");
            util.toArray = function toArray(object) {
              if (object) {
                var keys = Object.keys(object), array = new Array(keys.length), index = 0;
                while (index < keys.length) array[index] = object[keys[index++]];
                return array;
              }
              return [];
            };
            util.toObject = function toObject(array) {
              var object = {}, index = 0;
              while (index < array.length) {
                var key = array[index++], val = array[index++];
                val !== undefined && (object[key] = val);
              }
              return object;
            };
            var safePropBackslashRe = /\\/g, safePropQuoteRe = /"/g;
            util.isReserved = function isReserved(name) {
              return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(name);
            };
            util.safeProp = function safeProp(prop) {
              if (!/^[$\w_]+$/.test(prop) || util.isReserved(prop)) return '["' + prop.replace(safePropBackslashRe, "\\\\").replace(safePropQuoteRe, '\\"') + '"]';
              return "." + prop;
            };
            util.ucFirst = function ucFirst(str) {
              return str.charAt(0).toUpperCase() + str.substring(1);
            };
            var camelCaseRe = /_([a-z])/g;
            util.camelCase = function camelCase(str) {
              return str.substring(0, 1) + str.substring(1).replace(camelCaseRe, function($0, $1) {
                return $1.toUpperCase();
              });
            };
            util.compareFieldsById = function compareFieldsById(a, b) {
              return a.id - b.id;
            };
            util.decorateType = function decorateType(ctor, typeName) {
              if (ctor.$type) {
                if (typeName && ctor.$type.name !== typeName) {
                  util.decorateRoot.remove(ctor.$type);
                  ctor.$type.name = typeName;
                  util.decorateRoot.add(ctor.$type);
                }
                return ctor.$type;
              }
              Type || (Type = require(35));
              var type = new Type(typeName || ctor.name);
              util.decorateRoot.add(type);
              type.ctor = ctor;
              Object.defineProperty(ctor, "$type", {
                value: type,
                enumerable: false
              });
              Object.defineProperty(ctor.prototype, "$type", {
                value: type,
                enumerable: false
              });
              return type;
            };
            var decorateEnumIndex = 0;
            util.decorateEnum = function decorateEnum(object) {
              if (object.$type) return object.$type;
              Enum || (Enum = require(15));
              var enm = new Enum("Enum" + decorateEnumIndex++, object);
              util.decorateRoot.add(enm);
              Object.defineProperty(object, "$type", {
                value: enm,
                enumerable: false
              });
              return enm;
            };
            util.setProperty = function setProperty(dst, path, value) {
              function setProp(dst, path, value) {
                var part = path.shift();
                if (path.length > 0) dst[part] = setProp(dst[part] || {}, path, value); else {
                  var prevValue = dst[part];
                  prevValue && (value = [].concat(prevValue).concat(value));
                  dst[part] = value;
                }
                return dst;
              }
              if ("object" !== typeof dst) throw TypeError("dst must be an object");
              if (!path) throw TypeError("path must be specified");
              path = path.split(".");
              return setProp(dst, path, value);
            };
            Object.defineProperty(util, "decorateRoot", {
              get: function get() {
                return roots["decorated"] || (roots["decorated"] = new (require(29))());
              }
            });
          }, {
            15: 15,
            29: 29,
            3: 3,
            30: 30,
            35: 35,
            39: 39,
            5: 5,
            8: 8
          } ],
          38: [ function(require, module, exports) {
            module.exports = LongBits;
            var util = require(39);
            function LongBits(lo, hi) {
              this.lo = lo >>> 0;
              this.hi = hi >>> 0;
            }
            var zero = LongBits.zero = new LongBits(0, 0);
            zero.toNumber = function() {
              return 0;
            };
            zero.zzEncode = zero.zzDecode = function() {
              return this;
            };
            zero.length = function() {
              return 1;
            };
            var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
            LongBits.fromNumber = function fromNumber(value) {
              if (0 === value) return zero;
              var sign = value < 0;
              sign && (value = -value);
              var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
              if (sign) {
                hi = ~hi >>> 0;
                lo = ~lo >>> 0;
                if (++lo > 4294967295) {
                  lo = 0;
                  ++hi > 4294967295 && (hi = 0);
                }
              }
              return new LongBits(lo, hi);
            };
            LongBits.from = function from(value) {
              if ("number" === typeof value) return LongBits.fromNumber(value);
              if (util.isString(value)) {
                if (!util.Long) return LongBits.fromNumber(parseInt(value, 10));
                value = util.Long.fromString(value);
              }
              return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
            };
            LongBits.prototype.toNumber = function toNumber(unsigned) {
              if (!unsigned && this.hi >>> 31) {
                var lo = 1 + ~this.lo >>> 0, hi = ~this.hi >>> 0;
                lo || (hi = hi + 1 >>> 0);
                return -(lo + 4294967296 * hi);
              }
              return this.lo + 4294967296 * this.hi;
            };
            LongBits.prototype.toLong = function toLong(unsigned) {
              return util.Long ? new util.Long(0 | this.lo, 0 | this.hi, Boolean(unsigned)) : {
                low: 0 | this.lo,
                high: 0 | this.hi,
                unsigned: Boolean(unsigned)
              };
            };
            var charCodeAt = String.prototype.charCodeAt;
            LongBits.fromHash = function fromHash(hash) {
              if (hash === zeroHash) return zero;
              return new LongBits((charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0, (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0);
            };
            LongBits.prototype.toHash = function toHash() {
              return String.fromCharCode(255 & this.lo, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, 255 & this.hi, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24);
            };
            LongBits.prototype.zzEncode = function zzEncode() {
              var mask = this.hi >> 31;
              this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
              this.lo = (this.lo << 1 ^ mask) >>> 0;
              return this;
            };
            LongBits.prototype.zzDecode = function zzDecode() {
              var mask = -(1 & this.lo);
              this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
              this.hi = (this.hi >>> 1 ^ mask) >>> 0;
              return this;
            };
            LongBits.prototype.length = function length() {
              var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
              return 0 === part2 ? 0 === part1 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
            };
          }, {
            39: 39
          } ],
          39: [ function(require, module, exports) {
            var util = exports;
            util.asPromise = require(1);
            util.base64 = require(2);
            util.EventEmitter = require(4);
            util["float"] = require(6);
            util.inquire = require(7);
            util.utf8 = require(10);
            util.pool = require(9);
            util.LongBits = require(38);
            util.isNode = Boolean("undefined" !== typeof global && global && global.process && global.process.versions && global.process.versions.node);
            util.global = util.isNode && global || "undefined" !== typeof window && window || "undefined" !== typeof self && self || this;
            util.emptyArray = Object.freeze ? Object.freeze([]) : [];
            util.emptyObject = Object.freeze ? Object.freeze({}) : {};
            util.isInteger = Number.isInteger || function isInteger(value) {
              return "number" === typeof value && isFinite(value) && Math.floor(value) === value;
            };
            util.isString = function isString(value) {
              return "string" === typeof value || value instanceof String;
            };
            util.isObject = function isObject(value) {
              return value && "object" === typeof value;
            };
            util.isset = util.isSet = function isSet(obj, prop) {
              var value = obj[prop];
              if (null != value && obj.hasOwnProperty(prop)) return "object" !== typeof value || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
              return false;
            };
            util.Buffer = function() {
              try {
                var Buffer = util.inquire("buffer").Buffer;
                return Buffer.prototype.utf8Write ? Buffer : null;
              } catch (e) {
                return null;
              }
            }();
            util._Buffer_from = null;
            util._Buffer_allocUnsafe = null;
            util.newBuffer = function newBuffer(sizeOrArray) {
              return "number" === typeof sizeOrArray ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : "undefined" === typeof Uint8Array ? sizeOrArray : new Uint8Array(sizeOrArray);
            };
            util.Array = "undefined" !== typeof Uint8Array ? Uint8Array : Array;
            util.Long = util.global.dcodeIO && util.global.dcodeIO.Long || util.global.Long || util.inquire("long");
            util.key2Re = /^true|false|0|1$/;
            util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
            util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
            util.longToHash = function longToHash(value) {
              return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
            };
            util.longFromHash = function longFromHash(hash, unsigned) {
              var bits = util.LongBits.fromHash(hash);
              if (util.Long) return util.Long.fromBits(bits.lo, bits.hi, unsigned);
              return bits.toNumber(Boolean(unsigned));
            };
            function merge(dst, src, ifNotSet) {
              for (var keys = Object.keys(src), i = 0; i < keys.length; ++i) dst[keys[i]] !== undefined && ifNotSet || (dst[keys[i]] = src[keys[i]]);
              return dst;
            }
            util.merge = merge;
            util.lcFirst = function lcFirst(str) {
              return str.charAt(0).toLowerCase() + str.substring(1);
            };
            function newError(name) {
              function CustomError(message, properties) {
                if (!(this instanceof CustomError)) return new CustomError(message, properties);
                Object.defineProperty(this, "message", {
                  get: function get() {
                    return message;
                  }
                });
                Error.captureStackTrace ? Error.captureStackTrace(this, CustomError) : Object.defineProperty(this, "stack", {
                  value: new Error().stack || ""
                });
                properties && merge(this, properties);
              }
              (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;
              Object.defineProperty(CustomError.prototype, "name", {
                get: function get() {
                  return name;
                }
              });
              CustomError.prototype.toString = function toString() {
                return this.name + ": " + this.message;
              };
              return CustomError;
            }
            util.newError = newError;
            util.ProtocolError = newError("ProtocolError");
            util.oneOfGetter = function getOneOf(fieldNames) {
              var fieldMap = {};
              for (var i = 0; i < fieldNames.length; ++i) fieldMap[fieldNames[i]] = 1;
              return function() {
                for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i) if (1 === fieldMap[keys[i]] && this[keys[i]] !== undefined && null !== this[keys[i]]) return keys[i];
              };
            };
            util.oneOfSetter = function setOneOf(fieldNames) {
              return function(name) {
                for (var i = 0; i < fieldNames.length; ++i) fieldNames[i] !== name && delete this[fieldNames[i]];
              };
            };
            util.toJSONOptions = {
              longs: String,
              enums: String,
              bytes: String,
              json: true
            };
            util._configure = function() {
              var Buffer = util.Buffer;
              if (!Buffer) {
                util._Buffer_from = util._Buffer_allocUnsafe = null;
                return;
              }
              util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from || function Buffer_from(value, encoding) {
                return new Buffer(value, encoding);
              };
              util._Buffer_allocUnsafe = Buffer.allocUnsafe || function Buffer_allocUnsafe(size) {
                return new Buffer(size);
              };
            };
          }, {
            1: 1,
            10: 10,
            2: 2,
            38: 38,
            4: 4,
            6: 6,
            7: 7,
            9: 9
          } ],
          40: [ function(require, module, exports) {
            module.exports = verifier;
            var Enum = require(15), util = require(37);
            function invalid(field, expected) {
              return field.name + ": " + expected + (field.repeated && "array" !== expected ? "[]" : field.map && "object" !== expected ? "{k:" + field.keyType + "}" : "") + " expected";
            }
            function genVerifyValue(gen, field, fieldIndex, ref) {
              if (field.resolvedType) if (field.resolvedType instanceof Enum) {
                gen("switch(%s){", ref)("default:")("return%j", invalid(field, "enum value"));
                for (var keys = Object.keys(field.resolvedType.values), j = 0; j < keys.length; ++j) gen("case %i:", field.resolvedType.values[keys[j]]);
                gen("break")("}");
              } else gen("{")("var e=types[%i].verify(%s);", fieldIndex, ref)("if(e)")("return%j+e", field.name + ".")("}"); else switch (field.type) {
               case "int32":
               case "uint32":
               case "sint32":
               case "fixed32":
               case "sfixed32":
                gen("if(!util.isInteger(%s))", ref)("return%j", invalid(field, "integer"));
                break;

               case "int64":
               case "uint64":
               case "sint64":
               case "fixed64":
               case "sfixed64":
                gen("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", ref, ref, ref, ref)("return%j", invalid(field, "integer|Long"));
                break;

               case "float":
               case "double":
                gen('if(typeof %s!=="number")', ref)("return%j", invalid(field, "number"));
                break;

               case "bool":
                gen('if(typeof %s!=="boolean")', ref)("return%j", invalid(field, "boolean"));
                break;

               case "string":
                gen("if(!util.isString(%s))", ref)("return%j", invalid(field, "string"));
                break;

               case "bytes":
                gen('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', ref, ref, ref)("return%j", invalid(field, "buffer"));
              }
              return gen;
            }
            function genVerifyKey(gen, field, ref) {
              switch (field.keyType) {
               case "int32":
               case "uint32":
               case "sint32":
               case "fixed32":
               case "sfixed32":
                gen("if(!util.key32Re.test(%s))", ref)("return%j", invalid(field, "integer key"));
                break;

               case "int64":
               case "uint64":
               case "sint64":
               case "fixed64":
               case "sfixed64":
                gen("if(!util.key64Re.test(%s))", ref)("return%j", invalid(field, "integer|Long key"));
                break;

               case "bool":
                gen("if(!util.key2Re.test(%s))", ref)("return%j", invalid(field, "boolean key"));
              }
              return gen;
            }
            function verifier(mtype) {
              var gen = util.codegen([ "m" ], mtype.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected");
              var oneofs = mtype.oneofsArray, seenFirstField = {};
              oneofs.length && gen("var p={}");
              for (var i = 0; i < mtype.fieldsArray.length; ++i) {
                var field = mtype._fieldsArray[i].resolve(), ref = "m" + util.safeProp(field.name);
                field.optional && gen("if(%s!=null&&m.hasOwnProperty(%j)){", ref, field.name);
                if (field.map) {
                  gen("if(!util.isObject(%s))", ref)("return%j", invalid(field, "object"))("var k=Object.keys(%s)", ref)("for(var i=0;i<k.length;++i){");
                  genVerifyKey(gen, field, "k[i]");
                  genVerifyValue(gen, field, i, ref + "[k[i]]")("}");
                } else if (field.repeated) {
                  gen("if(!Array.isArray(%s))", ref)("return%j", invalid(field, "array"))("for(var i=0;i<%s.length;++i){", ref);
                  genVerifyValue(gen, field, i, ref + "[i]")("}");
                } else {
                  if (field.partOf) {
                    var oneofProp = util.safeProp(field.partOf.name);
                    1 === seenFirstField[field.partOf.name] && gen("if(p%s===1)", oneofProp)("return%j", field.partOf.name + ": multiple values");
                    seenFirstField[field.partOf.name] = 1;
                    gen("p%s=1", oneofProp);
                  }
                  genVerifyValue(gen, field, i, ref);
                }
                field.optional && gen("}");
              }
              return gen("return null");
            }
          }, {
            15: 15,
            37: 37
          } ],
          41: [ function(require, module, exports) {
            var wrappers = exports;
            var Message = require(21);
            wrappers[".google.protobuf.Any"] = {
              fromObject: function fromObject(object) {
                if (object && object["@type"]) {
                  var name = object["@type"].substring(object["@type"].lastIndexOf("/") + 1);
                  var type = this.lookup(name);
                  if (type) {
                    var type_url = "." === object["@type"].charAt(0) ? object["@type"].substr(1) : object["@type"];
                    -1 === type_url.indexOf("/") && (type_url = "/" + type_url);
                    return this.create({
                      type_url: type_url,
                      value: type.encode(type.fromObject(object)).finish()
                    });
                  }
                }
                return this.fromObject(object);
              },
              toObject: function toObject(message, options) {
                var googleApi = "type.googleapis.com/";
                var prefix = "";
                var name = "";
                if (options && options.json && message.type_url && message.value) {
                  name = message.type_url.substring(message.type_url.lastIndexOf("/") + 1);
                  prefix = message.type_url.substring(0, message.type_url.lastIndexOf("/") + 1);
                  var type = this.lookup(name);
                  type && (message = type.decode(message.value));
                }
                if (!(message instanceof this.ctor) && message instanceof Message) {
                  var object = message.$type.toObject(message, options);
                  var messageName = "." === message.$type.fullName[0] ? message.$type.fullName.substr(1) : message.$type.fullName;
                  "" === prefix && (prefix = googleApi);
                  name = prefix + messageName;
                  object["@type"] = name;
                  return object;
                }
                return this.toObject(message, options);
              }
            };
          }, {
            21: 21
          } ],
          42: [ function(require, module, exports) {
            module.exports = Writer;
            var util = require(39);
            var BufferWriter;
            var LongBits = util.LongBits, base64 = util.base64, utf8 = util.utf8;
            function Op(fn, len, val) {
              this.fn = fn;
              this.len = len;
              this.next = undefined;
              this.val = val;
            }
            function noop() {}
            function State(writer) {
              this.head = writer.head;
              this.tail = writer.tail;
              this.len = writer.len;
              this.next = writer.states;
            }
            function Writer() {
              this.len = 0;
              this.head = new Op(noop, 0, 0);
              this.tail = this.head;
              this.states = null;
            }
            var create = function create() {
              return util.Buffer ? function create_buffer_setup() {
                return (Writer.create = function create_buffer() {
                  return new BufferWriter();
                })();
              } : function create_array() {
                return new Writer();
              };
            };
            Writer.create = create();
            Writer.alloc = function alloc(size) {
              return new util.Array(size);
            };
            util.Array !== Array && (Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray));
            Writer.prototype._push = function push(fn, len, val) {
              this.tail = this.tail.next = new Op(fn, len, val);
              this.len += len;
              return this;
            };
            function writeByte(val, buf, pos) {
              buf[pos] = 255 & val;
            }
            function writeVarint32(val, buf, pos) {
              while (val > 127) {
                buf[pos++] = 127 & val | 128;
                val >>>= 7;
              }
              buf[pos] = val;
            }
            function VarintOp(len, val) {
              this.len = len;
              this.next = undefined;
              this.val = val;
            }
            VarintOp.prototype = Object.create(Op.prototype);
            VarintOp.prototype.fn = writeVarint32;
            Writer.prototype.uint32 = function write_uint32(value) {
              this.len += (this.tail = this.tail.next = new VarintOp((value >>>= 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
              return this;
            };
            Writer.prototype.int32 = function write_int32(value) {
              return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
            };
            Writer.prototype.sint32 = function write_sint32(value) {
              return this.uint32((value << 1 ^ value >> 31) >>> 0);
            };
            function writeVarint64(val, buf, pos) {
              while (val.hi) {
                buf[pos++] = 127 & val.lo | 128;
                val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
                val.hi >>>= 7;
              }
              while (val.lo > 127) {
                buf[pos++] = 127 & val.lo | 128;
                val.lo = val.lo >>> 7;
              }
              buf[pos++] = val.lo;
            }
            Writer.prototype.uint64 = function write_uint64(value) {
              var bits = LongBits.from(value);
              return this._push(writeVarint64, bits.length(), bits);
            };
            Writer.prototype.int64 = Writer.prototype.uint64;
            Writer.prototype.sint64 = function write_sint64(value) {
              var bits = LongBits.from(value).zzEncode();
              return this._push(writeVarint64, bits.length(), bits);
            };
            Writer.prototype.bool = function write_bool(value) {
              return this._push(writeByte, 1, value ? 1 : 0);
            };
            function writeFixed32(val, buf, pos) {
              buf[pos] = 255 & val;
              buf[pos + 1] = val >>> 8 & 255;
              buf[pos + 2] = val >>> 16 & 255;
              buf[pos + 3] = val >>> 24;
            }
            Writer.prototype.fixed32 = function write_fixed32(value) {
              return this._push(writeFixed32, 4, value >>> 0);
            };
            Writer.prototype.sfixed32 = Writer.prototype.fixed32;
            Writer.prototype.fixed64 = function write_fixed64(value) {
              var bits = LongBits.from(value);
              return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
            };
            Writer.prototype.sfixed64 = Writer.prototype.fixed64;
            Writer.prototype["float"] = function write_float(value) {
              return this._push(util["float"].writeFloatLE, 4, value);
            };
            Writer.prototype["double"] = function write_double(value) {
              return this._push(util["float"].writeDoubleLE, 8, value);
            };
            var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
              buf.set(val, pos);
            } : function writeBytes_for(val, buf, pos) {
              for (var i = 0; i < val.length; ++i) buf[pos + i] = val[i];
            };
            Writer.prototype.bytes = function write_bytes(value) {
              var len = value.length >>> 0;
              if (!len) return this._push(writeByte, 1, 0);
              if (util.isString(value)) {
                var buf = Writer.alloc(len = base64.length(value));
                base64.decode(value, buf, 0);
                value = buf;
              }
              return this.uint32(len)._push(writeBytes, len, value);
            };
            Writer.prototype.string = function write_string(value) {
              var len = utf8.length(value);
              return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
            };
            Writer.prototype.fork = function fork() {
              this.states = new State(this);
              this.head = this.tail = new Op(noop, 0, 0);
              this.len = 0;
              return this;
            };
            Writer.prototype.reset = function reset() {
              if (this.states) {
                this.head = this.states.head;
                this.tail = this.states.tail;
                this.len = this.states.len;
                this.states = this.states.next;
              } else {
                this.head = this.tail = new Op(noop, 0, 0);
                this.len = 0;
              }
              return this;
            };
            Writer.prototype.ldelim = function ldelim() {
              var head = this.head, tail = this.tail, len = this.len;
              this.reset().uint32(len);
              if (len) {
                this.tail.next = head.next;
                this.tail = tail;
                this.len += len;
              }
              return this;
            };
            Writer.prototype.finish = function finish() {
              var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
              while (head) {
                head.fn(head.val, buf, pos);
                pos += head.len;
                head = head.next;
              }
              return buf;
            };
            Writer._configure = function(BufferWriter_) {
              BufferWriter = BufferWriter_;
              Writer.create = create();
              BufferWriter._configure();
            };
          }, {
            39: 39
          } ],
          43: [ function(require, module, exports) {
            module.exports = BufferWriter;
            var Writer = require(42);
            (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
            var util = require(39);
            function BufferWriter() {
              Writer.call(this);
            }
            BufferWriter._configure = function() {
              BufferWriter.alloc = util._Buffer_allocUnsafe;
              BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && "set" === util.Buffer.prototype.set.name ? function writeBytesBuffer_set(val, buf, pos) {
                buf.set(val, pos);
              } : function writeBytesBuffer_copy(val, buf, pos) {
                if (val.copy) val.copy(buf, pos, 0, val.length); else for (var i = 0; i < val.length; ) buf[pos++] = val[i++];
              };
            };
            BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
              util.isString(value) && (value = util._Buffer_from(value, "base64"));
              var len = value.length >>> 0;
              this.uint32(len);
              len && this._push(BufferWriter.writeBytesBuffer, len, value);
              return this;
            };
            function writeStringBuffer(val, buf, pos) {
              val.length < 40 ? util.utf8.write(val, buf, pos) : buf.utf8Write ? buf.utf8Write(val, pos) : buf.write(val, pos);
            }
            BufferWriter.prototype.string = function write_string_buffer(value) {
              var len = util.Buffer.byteLength(value);
              this.uint32(len);
              len && this._push(writeStringBuffer, len, value);
              return this;
            };
            BufferWriter._configure();
          }, {
            39: 39,
            42: 42
          } ]
        }, {}, [ 19 ]);
      })();
      cc._RF.pop();
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    1: void 0,
    10: void 0,
    11: void 0,
    12: void 0,
    13: void 0,
    14: void 0,
    15: void 0,
    16: void 0,
    17: void 0,
    18: void 0,
    2: void 0,
    20: void 0,
    21: void 0,
    22: void 0,
    23: void 0,
    24: void 0,
    25: void 0,
    26: void 0,
    27: void 0,
    28: void 0,
    29: void 0,
    3: void 0,
    30: void 0,
    31: void 0,
    32: void 0,
    33: void 0,
    34: void 0,
    35: void 0,
    36: void 0,
    37: void 0,
    38: void 0,
    39: void 0,
    4: void 0,
    40: void 0,
    41: void 0,
    42: void 0,
    43: void 0,
    5: void 0,
    6: void 0,
    7: void 0,
    8: void 0,
    9: void 0
  } ]
}, {}, [ "Application", "GameData", "GameView", "HotUpdate", "Logic", "RoomListView", "Alert", "DownloadLoading", "GlobalAudio", "Loading", "SettingView", "Tips", "UILoading", "Config", "CommonEvent", "LogicEvent", "LanguageEN", "LanguageImpl", "LanguageZH", "BundleManager", "LogicManager", "MainController", "Manager", "NetManager", "ServiceManager", "ChatService", "CommonService", "GameService", "LobbyService", "Reconnect", "ReconnectComponent", "CmdDefines", "HeartbetBinary", "HeartbetJson", "HeartbetProto", "Framework", "ResolutionHelper", "AssetManager", "CacheManager", "ResourceLoader", "AudioComponent", "Defines", "EventComponent", "GameEventInterface", "Language", "LocalStorage", "Presenter", "Service", "Singleton", "UIManager", "Controller", "NetHelper", "Decorators", "EventApi", "EventDispatcher", "BitEncrypt", "CocosExtention", "Extentions", "Utils", "WebEditBoxImpl", "protobuf", "Log", "BinaryStreamMessage", "HttpClient", "JsonMessage", "Message", "ProtoMessage", "ServerConnector", "WebSocketClient", "TipsDelegate", "UILoadingDelegate", "UIView", "LoginLogic", "LoginView" ]);