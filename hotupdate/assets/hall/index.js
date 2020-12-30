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
  HallData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cf4f2DWK7VBnpIUWpXcfa1z", "HallData");
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
    exports.HallData = void 0;
    var GameData_1 = require("../../../../script/common/base/GameData");
    var Singleton_1 = require("../../../../script/framework/base/Singleton");
    var HallLanguageZH_1 = require("./HallLanguageZH");
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var HallLanguageEN_1 = require("./HallLanguageEN");
    var LanguageImpl_1 = require("../../../../script/common/language/LanguageImpl");
    var Config_1 = require("../../../../script/common/config/Config");
    var _HallData = function(_super) {
      __extends(_HallData, _super);
      function _HallData() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      _HallData.Instance = function() {
        return this._instance || (this._instance = new _HallData());
      };
      Object.defineProperty(_HallData.prototype, "bundle", {
        get: function() {
          return Config_1.Config.BUNDLE_HALL;
        },
        enumerable: false,
        configurable: true
      });
      _HallData.prototype.onLanguageChange = function() {
        var lan = HallLanguageZH_1.HALL_ZH;
        Manager_1.Manager.language.getLanguage() == HallLanguageEN_1.HALL_EN.language && (lan = HallLanguageEN_1.HALL_EN);
        LanguageImpl_1.i18n["" + this.bundle] = {};
        LanguageImpl_1.i18n["" + this.bundle] = lan.data;
      };
      _HallData._instance = null;
      return _HallData;
    }(GameData_1.GameData);
    exports.HallData = Singleton_1.getSingleton(_HallData);
    cc._RF.pop();
  }, {
    "../../../../script/common/base/GameData": void 0,
    "../../../../script/common/config/Config": void 0,
    "../../../../script/common/language/LanguageImpl": void 0,
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/framework/base/Singleton": void 0,
    "./HallLanguageEN": "HallLanguageEN",
    "./HallLanguageZH": "HallLanguageZH"
  } ],
  HallLanguageEN: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1751fk/PENIVpM9Q29r1axv", "HallLanguageEN");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HALL_EN = void 0;
    exports.HALL_EN = {
      language: cc.sys.LANGUAGE_ENGLISH,
      data: {
        hall_view_game_name: [ "game1", "game2", "BATTLE\nCITY", "Load Test", "Net Test", "game6" ],
        hall_view_broadcast_content: "[broadcast] congratulations!",
        hall_view_nogame_notice: "\u3010{0}\u3011developing!!!",
        test: " test : {0}--\x3e{1}--\x3e{2}--\x3e{3}--\x3e"
      }
    };
    cc._RF.pop();
  }, {} ],
  HallLanguageZH: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d26c47aLsxH44oXOOf7uKj/", "HallLanguageZH");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HALL_ZH = void 0;
    exports.HALL_ZH = {
      language: cc.sys.LANGUAGE_CHINESE,
      data: {
        hall_view_game_name: [ "\u6e38\u620f1", "\u6e38\u620f2", "\u5766\u514b\u5927\u6218", "\u6269\u5c55Load\u63a5\u53e3\u793a\u4f8b", "\u7f51\u7edc\u793a\u4f8b", "\u6e38\u620f6" ],
        hall_view_broadcast_content: "[\u7cfb\u7edf\u5e7f\u64ad] \u606d\u559c\u5927\u4f6c\u8fdb\u5165",
        hall_view_nogame_notice: "\u3010{0}\u3011\u672a\u5b9e\u73b0\uff0c\u66f4\u591a\u529f\u80fd\uff0c\u656c\u8bf7\u671f\u5f85!!!",
        test: "\u6d4b\u8bd5 : {0}--\x3e{1}--\x3e{2}--\x3e{3}--\x3e"
      }
    };
    cc._RF.pop();
  }, {} ],
  HallLogic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "453618KXphPXKtmWnFztofy", "HallLogic");
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
    var Logic_1 = require("../../../script/common/base/Logic");
    var LogicEvent_1 = require("../../../script/common/event/LogicEvent");
    var HallView_1 = require("./view/HallView");
    var Manager_1 = require("../../../script/common/manager/Manager");
    var HallData_1 = require("./data/HallData");
    var HallLogic = function(_super) {
      __extends(HallLogic, _super);
      function HallLogic() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.logicType = LogicEvent_1.LogicType.HALL;
        return _this;
      }
      Object.defineProperty(HallLogic.prototype, "bundle", {
        get: function() {
          return HallData_1.HallData.bundle;
        },
        enumerable: false,
        configurable: true
      });
      HallLogic.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(LogicEvent_1.LogicEvent.ENTER_HALL, this.onEnterHall);
        this.registerEvent(LogicEvent_1.LogicEvent.ENTER_COMPLETE, this.onEnterComplete);
      };
      HallLogic.prototype.onEnterHall = function() {
        this.onLanguageChange();
        Manager_1.Manager.hallNetManager.addNetControllers();
        Manager_1.Manager.uiManager.open({
          type: HallView_1.default,
          bundle: this.bundle
        });
      };
      HallLogic.prototype.onLanguageChange = function() {
        HallData_1.HallData.onLanguageChange();
      };
      HallLogic.prototype.onEnterComplete = function(data) {
        _super.prototype.onEnterComplete.call(this, data);
        data.type == LogicEvent_1.LogicType.LOGIN && Manager_1.Manager.hallNetManager.removeNetControllers();
      };
      return HallLogic;
    }(Logic_1.Logic);
    Manager_1.Manager.logicManager.push(HallLogic);
    cc._RF.pop();
  }, {
    "../../../script/common/base/Logic": void 0,
    "../../../script/common/event/LogicEvent": void 0,
    "../../../script/common/manager/Manager": void 0,
    "./data/HallData": "HallData",
    "./view/HallView": "HallView"
  } ],
  HallNetController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "19a73+/n1hKu5W3HmA4RhXD", "HallNetController");
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
    var Decorators_1 = require("../../../../script/framework/decorator/Decorators");
    var LobbyService_1 = require("../../../../script/common/net/LobbyService");
    var Controller_1 = require("../../../../script/framework/controller/Controller");
    var CmdDefines_1 = require("../../../../script/common/protocol/CmdDefines");
    var TestProtoMessage_1 = require("../protocol/TestProtoMessage");
    var TestBinaryMessage_1 = require("../protocol/TestBinaryMessage");
    var CommonEvent_1 = require("../../../../script/common/event/CommonEvent");
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var LobbyCmd_1 = require("../protocol/LobbyCmd");
    var TestJsonMessage_1 = require("../protocol/TestJsonMessage");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var HallNetController = function(_super) {
      __extends(HallNetController, _super);
      function HallNetController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      HallNetController.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(CmdDefines_1.MainCmd.CMD_LOBBY, LobbyCmd_1.SUB_CMD_LOBBY.TEST_JSON_MSG, this.onTestJsonMessage, TestJsonMessage_1.TestJsonMessage);
        this.registerEvent(CmdDefines_1.MainCmd.CMD_LOBBY, LobbyCmd_1.SUB_CMD_LOBBY.TEST_PROTO_MSG, this.onTestProtoMessage, TestProtoMessage_1.TestProtoMessage);
        this.registerEvent(CmdDefines_1.MainCmd.CMD_LOBBY, LobbyCmd_1.SUB_CMD_LOBBY.TEST_BINARY_MSG, this.onTestBinaryMessage, TestBinaryMessage_1.TestBinaryMessage);
      };
      HallNetController.prototype.onTestJsonMessage = function(data) {
        dispatch(CommonEvent_1.CommonEvent.TEST_JSON_MSG, data.hello);
      };
      HallNetController.prototype.onTestProtoMessage = function(data) {
        dispatch(CommonEvent_1.CommonEvent.TEST_PROTO_MSG, data.data.hello);
      };
      HallNetController.prototype.onTestBinaryMessage = function(data) {
        dispatch(CommonEvent_1.CommonEvent.TEST_BINARY_MSG, data.hello);
      };
      HallNetController.prototype.onNetOpen = function(event) {
        var result = _super.prototype.onNetOpen.call(this, event);
        result && dispatch(CommonEvent_1.CommonEvent.LOBBY_SERVICE_CONNECTED, this.service);
        return result;
      };
      HallNetController.prototype.onNetClose = function(event) {
        var result = _super.prototype.onNetClose.call(this, event);
        result && dispatch(CommonEvent_1.CommonEvent.LOBBY_SERVICE_CLOSE, this.service);
        return result;
      };
      HallNetController = __decorate([ ccclass, Decorators_1.injectService(LobbyService_1.LobbyService.instance) ], HallNetController);
      return HallNetController;
    }(Controller_1.default);
    exports.default = HallNetController;
    Manager_1.Manager.hallNetManager.register(HallNetController);
    cc._RF.pop();
  }, {
    "../../../../script/common/event/CommonEvent": void 0,
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/common/net/LobbyService": void 0,
    "../../../../script/common/protocol/CmdDefines": void 0,
    "../../../../script/framework/controller/Controller": void 0,
    "../../../../script/framework/decorator/Decorators": void 0,
    "../protocol/LobbyCmd": "LobbyCmd",
    "../protocol/TestBinaryMessage": "TestBinaryMessage",
    "../protocol/TestJsonMessage": "TestJsonMessage",
    "../protocol/TestProtoMessage": "TestProtoMessage"
  } ],
  HallNetHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "219adRaBtRJ8ZhSEsj03DAx", "HallNetHelper");
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
    exports.HallNetHelper = void 0;
    var NetHelper_1 = require("../../../../script/framework/controller/NetHelper");
    var LobbyService_1 = require("../../../../script/common/net/LobbyService");
    var TestProtoMessage_1 = require("../protocol/TestProtoMessage");
    var TestBinaryMessage_1 = require("../protocol/TestBinaryMessage");
    var HttpClient_1 = require("../../../../script/framework/net/HttpClient");
    var TestJsonMessage_1 = require("../protocol/TestJsonMessage");
    var _HallNetHelper = function(_super) {
      __extends(_HallNetHelper, _super);
      function _HallNetHelper() {
        return _super.call(this, LobbyService_1.LobbyService.instance) || this;
      }
      _HallNetHelper.prototype.sendProtoMessage = function(hello) {
        var testProto = new TestProtoMessage_1.TestProtoMessage();
        testProto.data.hello = hello;
        testProto.data.afvalue = 4.5;
        this.service.send(testProto);
      };
      _HallNetHelper.prototype.sendJsonMessage = function(hello) {
        var msg = new TestJsonMessage_1.TestJsonMessage();
        msg.hello = hello;
        this.service.send(msg);
      };
      _HallNetHelper.prototype.sendBinaryMessage = function(hello) {
        var binaryMessage = new TestBinaryMessage_1.TestBinaryMessage();
        binaryMessage.hello = hello;
        this.service.send(binaryMessage);
      };
      _HallNetHelper.prototype.sendHttpMessage = function() {
        var httpPackage = new HttpClient_1.HttpPackage();
        httpPackage.data.url = "https://httpbin.org/post";
        httpPackage.data.type = HttpClient_1.HttpRequestType.POST;
        httpPackage.data.requestHeader = {
          name: "Content-Type",
          value: "text/plain"
        };
        httpPackage.data.data = new Uint8Array([ 1, 2, 3, 4, 5 ]);
        httpPackage.send(function(data) {
          cc.log("\u6570\u636e\u8fd4\u56de");
        }, function() {
          cc.log("\u6570\u636e\u9519\u8bef");
        });
        httpPackage = new HttpClient_1.HttpPackage();
        httpPackage.data.url = "https://httpbin.org/get";
        httpPackage.params = {
          a: 100,
          b: "zheng"
        };
        httpPackage.send(function(data) {
          cc.log("\u6570\u636e\u8fd4\u56de");
        }, function() {
          cc.log("\u6570\u636e\u9519\u8bef");
        });
      };
      return _HallNetHelper;
    }(NetHelper_1.default);
    exports.HallNetHelper = new _HallNetHelper();
    cc._RF.pop();
  }, {
    "../../../../script/common/net/LobbyService": void 0,
    "../../../../script/framework/controller/NetHelper": void 0,
    "../../../../script/framework/net/HttpClient": void 0,
    "../protocol/TestBinaryMessage": "TestBinaryMessage",
    "../protocol/TestJsonMessage": "TestJsonMessage",
    "../protocol/TestProtoMessage": "TestProtoMessage"
  } ],
  HallView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1b90/rohdEk4SdmmEZANaD", "HallView");
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
    var UIView_1 = require("../../../../script/framework/ui/UIView");
    var HotUpdate_1 = require("../../../../script/common/base/HotUpdate");
    var LogicEvent_1 = require("../../../../script/common/event/LogicEvent");
    var CommonEvent_1 = require("../../../../script/common/event/CommonEvent");
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var HallData_1 = require("../data/HallData");
    var LobbyService_1 = require("../../../../script/common/net/LobbyService");
    var GameService_1 = require("../../../../script/common/net/GameService");
    var ChatService_1 = require("../../../../script/common/net/ChatService");
    var SettingView_1 = require("../../../../script/common/component/SettingView");
    var Defines_1 = require("../../../../script/framework/base/Defines");
    var Config_1 = require("../../../../script/common/config/Config");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var HallView = function(_super) {
      __extends(HallView, _super);
      function HallView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._bundles = [];
        return _this;
      }
      HallView.getPrefabUrl = function() {
        return "prefabs/HallView";
      };
      HallView.prototype.onClick = function(ev) {
        Manager_1.Manager.bundleManager.enterBundle(this.bundles[ev.target.userData]);
      };
      Object.defineProperty(HallView.prototype, "bundles", {
        get: function() {
          this._bundles.length <= 0 && (this._bundles = [ new HotUpdate_1.BundleConfig(Manager_1.Manager.getLanguage("hall_view_game_name.0", HallData_1.HallData.bundle), "gameOne", 1), new HotUpdate_1.BundleConfig(Manager_1.Manager.getLanguage("hall_view_game_name.1", HallData_1.HallData.bundle), "gameTwo", 2), new HotUpdate_1.BundleConfig(Manager_1.Manager.getLanguage("hall_view_game_name.2", HallData_1.HallData.bundle), "tankBattle", 3), new HotUpdate_1.BundleConfig(Manager_1.Manager.getLanguage("hall_view_game_name.3", HallData_1.HallData.bundle), "LoadTest", 4), new HotUpdate_1.BundleConfig(Manager_1.Manager.getLanguage("hall_view_game_name.4", HallData_1.HallData.bundle), "NetTest", 5) ]);
          return this._bundles;
        },
        enumerable: false,
        configurable: true
      });
      HallView.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        var nodeGames = cc.find("games", this.node);
        var item = cc.find("gameItem", this.node);
        for (var i = 1; i <= this.bundles.length; i++) {
          var game = cc.instantiate(item);
          game.name = "game_" + i;
          game.active = true;
          game.userData = i - 1;
          cc.find("Background/label", game).getComponent(cc.Label).language = Manager_1.Manager.makeLanguage("hall_view_game_name." + (i - 1), this.bundle);
          nodeGames.addChild(game);
          game.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
        }
        var bottom_op = cc.find("bottom_op", this.node);
        var setting = cc.find("setting", bottom_op);
        setting.on(cc.Node.EventType.TOUCH_END, function() {
          Manager_1.Manager.uiManager.open({
            type: SettingView_1.default,
            bundle: Defines_1.BUNDLE_RESOURCES,
            zIndex: Config_1.ViewZOrder.UI,
            name: "\u8bbe\u7f6e\u754c\u9762"
          });
        });
        LobbyService_1.LobbyService.instance.enabled = false;
        GameService_1.GameService.instance.enabled = false;
        ChatService_1.ChatService.instance.enabled = false;
        this.audioHelper.playMusic("audio/background", this.bundle);
        LogicEvent_1.dispatchEnterComplete({
          type: LogicEvent_1.LogicType.HALL,
          views: [ this ]
        });
      };
      HallView.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(CommonEvent_1.CommonEvent.DOWNLOAD_PROGRESS, this.onDownloadProgess);
      };
      HallView.prototype.onDownloadProgess = function(data) {
        var progressBar = cc.find("games/game_" + data.config.index + "/Background/progressBar", this.node).getComponent(cc.ProgressBar);
        var progressLabel = cc.find("games/game_" + data.config.index + "/Background/progressBar/progress", this.node).getComponent(cc.Label);
        if (-1 == data.progress) progressBar.node.active = false; else if (data.progress < 1) {
          progressBar.node.active = true;
          progressBar.progress = data.progress;
          progressLabel.string = Math.floor(100 * data.progress) + "%";
        } else progressBar.node.active = false;
      };
      HallView = __decorate([ ccclass ], HallView);
      return HallView;
    }(UIView_1.default);
    exports.default = HallView;
    cc._RF.pop();
  }, {
    "../../../../script/common/base/HotUpdate": void 0,
    "../../../../script/common/component/SettingView": void 0,
    "../../../../script/common/config/Config": void 0,
    "../../../../script/common/event/CommonEvent": void 0,
    "../../../../script/common/event/LogicEvent": void 0,
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/common/net/ChatService": void 0,
    "../../../../script/common/net/GameService": void 0,
    "../../../../script/common/net/LobbyService": void 0,
    "../../../../script/framework/base/Defines": void 0,
    "../../../../script/framework/ui/UIView": void 0,
    "../data/HallData": "HallData"
  } ],
  LobbyCmd: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "04e03YdPLBADrD0Q+gFggMH", "LobbyCmd");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SUB_CMD_LOBBY = void 0;
    exports.SUB_CMD_LOBBY = {
      TEST_JSON_MSG: 2,
      TEST_PROTO_MSG: 3,
      TEST_BINARY_MSG: 4
    };
    cc._RF.pop();
  }, {} ],
  TestBinaryMessage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "33243sptcRJ1Lx7WxL1no+T", "TestBinaryMessage");
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
    exports.TestBinaryMessage = void 0;
    var BinaryStreamMessage_1 = require("../../../../script/framework/net/BinaryStreamMessage");
    var CmdDefines_1 = require("../../../../script/common/protocol/CmdDefines");
    var LobbyCmd_1 = require("./LobbyCmd");
    var TestData = function(_super) {
      __extends(TestData, _super);
      function TestData() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.float32 = 32;
        _this.float64 = 64;
        return _this;
      }
      __decorate([ BinaryStreamMessage_1.serialize("value32", BinaryStreamMessage_1.Float32Value) ], TestData.prototype, "float32", void 0);
      __decorate([ BinaryStreamMessage_1.serialize("value64", BinaryStreamMessage_1.Float64Value) ], TestData.prototype, "float64", void 0);
      return TestData;
    }(BinaryStreamMessage_1.BinaryStream);
    var TestBinaryMessage = function(_super) {
      __extends(TestBinaryMessage, _super);
      function TestBinaryMessage() {
        var _this = _super.call(this) || this;
        _this.mainCmd = CmdDefines_1.MainCmd.CMD_LOBBY;
        _this.subCmd = LobbyCmd_1.SUB_CMD_LOBBY.TEST_BINARY_MSG;
        _this.user = new TestData();
        _this.hello = "\u60a8\u597d\uff0c\u6211\u662fBinary\u6d88\u606f\uff01";
        return _this;
      }
      __decorate([ BinaryStreamMessage_1.serialize("user", TestData) ], TestBinaryMessage.prototype, "user", void 0);
      __decorate([ BinaryStreamMessage_1.serialize("hello", BinaryStreamMessage_1.StringValue) ], TestBinaryMessage.prototype, "hello", void 0);
      return TestBinaryMessage;
    }(BinaryStreamMessage_1.BinaryStreamMessage);
    exports.TestBinaryMessage = TestBinaryMessage;
    cc._RF.pop();
  }, {
    "../../../../script/common/protocol/CmdDefines": void 0,
    "../../../../script/framework/net/BinaryStreamMessage": void 0,
    "./LobbyCmd": "LobbyCmd"
  } ],
  TestJsonMessage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2f767J2DLBLMbzSjt4azbMk", "TestJsonMessage");
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
    exports.TestJsonMessage = exports.TestData = void 0;
    var CmdDefines_1 = require("../../../../script/common/protocol/CmdDefines");
    var JsonMessage_1 = require("../../../../script/framework/net/JsonMessage");
    var LobbyCmd_1 = require("./LobbyCmd");
    var TestData = function(_super) {
      __extends(TestData, _super);
      function TestData() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.test = "\u8fd9\u662f\u4e00\u4e2a\u4e2d\u6587\u7684\u5b57\u7b26\u4e32\u6d4b\u8bd5";
        return _this;
      }
      __decorate([ JsonMessage_1.serialize("test", String) ], TestData.prototype, "test", void 0);
      return TestData;
    }(JsonMessage_1.JsonMessage);
    exports.TestData = TestData;
    var TestJsonMessage = function(_super) {
      __extends(TestJsonMessage, _super);
      function TestJsonMessage() {
        var _this = _super.call(this) || this;
        _this.mainCmd = CmdDefines_1.MainCmd.CMD_LOBBY;
        _this.subCmd = LobbyCmd_1.SUB_CMD_LOBBY.TEST_JSON_MSG;
        _this.count = 1e3;
        _this.testArr = [ "1", "2", "3", "4" ];
        _this.testMap = new Map();
        _this.testData = new TestData();
        _this.hello = "\u60a8\u597d\uff0c\u6211\u662fJson\u6d88\u606f\uff01";
        _this.testMap.set(1, "ss");
        _this.testMap.set(2, "s22s");
        _this.testMap.set(3, "s33s");
        _this.testMap.set(4, "s44s");
        _this.testMap.set(5, "s55s");
        _this.testMap.set(6, "s66s");
        return _this;
      }
      __decorate([ JsonMessage_1.serialize("count", Number) ], TestJsonMessage.prototype, "count", void 0);
      __decorate([ JsonMessage_1.serialize("arr", Array, String) ], TestJsonMessage.prototype, "testArr", void 0);
      __decorate([ JsonMessage_1.serialize("mapdata", Map, Number, String) ], TestJsonMessage.prototype, "testMap", void 0);
      __decorate([ JsonMessage_1.serialize("test", TestData) ], TestJsonMessage.prototype, "testData", void 0);
      __decorate([ JsonMessage_1.serialize("hello", String) ], TestJsonMessage.prototype, "hello", void 0);
      return TestJsonMessage;
    }(JsonMessage_1.JsonMessage);
    exports.TestJsonMessage = TestJsonMessage;
    cc._RF.pop();
  }, {
    "../../../../script/common/protocol/CmdDefines": void 0,
    "../../../../script/framework/net/JsonMessage": void 0,
    "./LobbyCmd": "LobbyCmd"
  } ],
  TestProtoMessage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2d2ecWmZg9Kr7TB+OBcCwNn", "TestProtoMessage");
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
    exports.TestProtoMessage = exports.TestProtoData = exports.AwesomeEnum = void 0;
    var CmdDefines_1 = require("../../../../script/common/protocol/CmdDefines");
    var ProtoMessage_1 = require("../../../../script/framework/net/ProtoMessage");
    var AwesomeEnum;
    (function(AwesomeEnum) {
      AwesomeEnum[AwesomeEnum["ONE"] = 1] = "ONE";
      AwesomeEnum[AwesomeEnum["TWO"] = 2] = "TWO";
    })(AwesomeEnum = exports.AwesomeEnum || (exports.AwesomeEnum = {}));
    var protobuf_1 = require("../../../../script/framework/external/protobuf");
    var LobbyCmd_1 = require("./LobbyCmd");
    var TestProtoData = function(_super) {
      __extends(TestProtoData, _super);
      function TestProtoData() {
        var _this = _super.call(this) || this;
        _this.afvalue = 3.3;
        return _this;
      }
      __decorate([ protobuf_1.Field.d(1, "string", "required", "awesome default string") ], TestProtoData.prototype, "hello", void 0);
      __decorate([ protobuf_1.Field.d(2, AwesomeEnum, "required", AwesomeEnum.ONE) ], TestProtoData.prototype, "awesomeEnum", void 0);
      __decorate([ protobuf_1.Field.d(3, "float", "required", 3.3) ], TestProtoData.prototype, "afvalue", void 0);
      TestProtoData = __decorate([ protobuf_1.Type.d("TestProtoData") ], TestProtoData);
      return TestProtoData;
    }(protobuf_1.Message);
    exports.TestProtoData = TestProtoData;
    var TestProtoMessage = function(_super) {
      __extends(TestProtoMessage, _super);
      function TestProtoMessage() {
        var _this = _super.call(this, TestProtoData) || this;
        _this.mainCmd = CmdDefines_1.MainCmd.CMD_LOBBY;
        _this.subCmd = LobbyCmd_1.SUB_CMD_LOBBY.TEST_PROTO_MSG;
        return _this;
      }
      return TestProtoMessage;
    }(ProtoMessage_1.ProtoMessage);
    exports.TestProtoMessage = TestProtoMessage;
    cc._RF.pop();
  }, {
    "../../../../script/common/protocol/CmdDefines": void 0,
    "../../../../script/framework/external/protobuf": void 0,
    "../../../../script/framework/net/ProtoMessage": void 0,
    "./LobbyCmd": "LobbyCmd"
  } ]
}, {}, [ "HallLogic", "HallNetController", "HallNetHelper", "HallData", "HallLanguageEN", "HallLanguageZH", "LobbyCmd", "TestBinaryMessage", "TestJsonMessage", "TestProtoMessage", "HallView" ]);