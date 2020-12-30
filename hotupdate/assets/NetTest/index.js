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
  INetHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "306e3ejqE1OSYDeYb43uW6M", "INetHelper");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  NetTestData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4ff457fMfVFhaY4kf0puEQS", "NetTestData");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.NetTest = void 0;
    var NetTest;
    (function(NetTest) {
      var NetType;
      (function(NetType) {
        NetType[NetType["JSON"] = 0] = "JSON";
        NetType[NetType["PROTO"] = 1] = "PROTO";
        NetType[NetType["BINARY"] = 2] = "BINARY";
      })(NetType = NetTest.NetType || (NetTest.NetType = {}));
      var ServiceType;
      (function(ServiceType) {
        ServiceType[ServiceType["Lobby"] = 0] = "Lobby";
        ServiceType[ServiceType["Game"] = 1] = "Game";
        ServiceType[ServiceType["Chat"] = 2] = "Chat";
      })(ServiceType = NetTest.ServiceType || (NetTest.ServiceType = {}));
    })(NetTest = exports.NetTest || (exports.NetTest = {}));
    cc._RF.pop();
  }, {} ],
  NetTestLogic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a32dbGvukJJ8ZYb2+xivEJj", "NetTestLogic");
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
    var Manager_1 = require("../../../script/common/manager/Manager");
    var NetTestView_1 = require("./view/NetTestView");
    var NetTestLogic = function(_super) {
      __extends(NetTestLogic, _super);
      function NetTestLogic() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.logicType = LogicEvent_1.LogicType.GAME;
        return _this;
      }
      NetTestLogic.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
      };
      NetTestLogic.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(LogicEvent_1.LogicEvent.ENTER_GAME, this.onEnterGame);
      };
      Object.defineProperty(NetTestLogic.prototype, "bundle", {
        get: function() {
          return "NetTest";
        },
        enumerable: false,
        configurable: true
      });
      NetTestLogic.prototype.onEnterGame = function(data) {
        data == this.bundle && Manager_1.Manager.uiManager.open({
          type: NetTestView_1.default,
          bundle: this.bundle
        });
      };
      return NetTestLogic;
    }(Logic_1.Logic);
    Manager_1.Manager.logicManager.push(NetTestLogic);
    cc._RF.pop();
  }, {
    "../../../script/common/base/Logic": void 0,
    "../../../script/common/event/LogicEvent": void 0,
    "../../../script/common/manager/Manager": void 0,
    "./view/NetTestView": "NetTestView"
  } ],
  NetTestView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "12679dQuIBCAqcEhil5zodI", "NetTestView");
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
    var GameView_1 = require("../../../../script/common/base/GameView");
    var Config_1 = require("../../../../script/common/config/Config");
    var CommonEvent_1 = require("../../../../script/common/event/CommonEvent");
    var LogicEvent_1 = require("../../../../script/common/event/LogicEvent");
    var ChatService_1 = require("../../../../script/common/net/ChatService");
    var GameService_1 = require("../../../../script/common/net/GameService");
    var LobbyService_1 = require("../../../../script/common/net/LobbyService");
    var HeartbetBinary_1 = require("../../../../script/common/protocol/HeartbetBinary");
    var HeartbetJson_1 = require("../../../../script/common/protocol/HeartbetJson");
    var HeartbetProto_1 = require("../../../../script/common/protocol/HeartbetProto");
    var BinaryStreamMessage_1 = require("../../../../script/framework/net/BinaryStreamMessage");
    var JsonMessage_1 = require("../../../../script/framework/net/JsonMessage");
    var ProtoMessage_1 = require("../../../../script/framework/net/ProtoMessage");
    var HallNetHelper_1 = require("../../../hall/script/controller/HallNetHelper");
    var TestChatNetHelper_1 = require("../controller/TestChatNetHelper");
    var TestGameNetHelper_1 = require("../controller/TestGameNetHelper");
    var NetTestData_1 = require("../data/NetTestData");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NetTestView = function(_super) {
      __extends(NetTestView, _super);
      function NetTestView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.netToggleContainer = null;
        _this.reconnects = [];
        _this.logScorllView = null;
        _this.logItem = null;
        _this.connects = [];
        _this.enabledServices = [];
        _this.netType = NetTestData_1.NetTest.NetType.JSON;
        return _this;
      }
      NetTestView.getPrefabUrl = function() {
        return "prefabs/NetTestView";
      };
      NetTestView.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(CommonEvent_1.CommonEvent.LOBBY_SERVICE_CONNECTED, this.onNetConnected);
        this.registerEvent(CommonEvent_1.CommonEvent.LOBBY_SERVICE_CLOSE, this.onNetClose);
        this.registerEvent(CommonEvent_1.CommonEvent.GAME_SERVICE_CONNECTED, this.onNetConnected);
        this.registerEvent(CommonEvent_1.CommonEvent.GAME_SERVICE_CLOSE, this.onNetClose);
        this.registerEvent(CommonEvent_1.CommonEvent.CHAT_SERVICE_CONNECTED, this.onNetConnected);
        this.registerEvent(CommonEvent_1.CommonEvent.CHAT_SERVICE_CLOSE, this.onNetClose);
        this.registerEvent(CommonEvent_1.CommonEvent.TEST_BINARY_MSG, this.onMessage);
        this.registerEvent(CommonEvent_1.CommonEvent.TEST_JSON_MSG, this.onMessage);
        this.registerEvent(CommonEvent_1.CommonEvent.TEST_PROTO_MSG, this.onMessage);
      };
      NetTestView.prototype.onMessage = function(hello) {
        this.log("\u6536\u5230\uff1a" + hello);
      };
      NetTestView.prototype.onNetClose = function(service) {
        var isConnected = false;
        service == LobbyService_1.LobbyService.instance ? this.connects[NetTestData_1.NetTest.ServiceType.Lobby].isChecked = isConnected : service == GameService_1.GameService.instance ? this.connects[NetTestData_1.NetTest.ServiceType.Game].isChecked = isConnected : service == ChatService_1.ChatService.instance && (this.connects[NetTestData_1.NetTest.ServiceType.Chat].isChecked = isConnected);
        this.log(service.serviceName + " \u65ad\u5f00\u8fde\u63a5!");
      };
      NetTestView.prototype.onNetConnected = function(service) {
        var isConnected = true;
        service == LobbyService_1.LobbyService.instance ? this.connects[NetTestData_1.NetTest.ServiceType.Lobby].isChecked = isConnected : service == GameService_1.GameService.instance ? this.connects[NetTestData_1.NetTest.ServiceType.Game].isChecked = isConnected : service == ChatService_1.ChatService.instance && (this.connects[NetTestData_1.NetTest.ServiceType.Chat].isChecked = isConnected);
        this.log(service.serviceName + " \u8fde\u63a5\u6210\u529f!");
      };
      NetTestView.prototype.onDestroy = function() {
        this.logItem.destroy();
        _super.prototype.onDestroy.call(this);
      };
      NetTestView.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        cc.find("goback", this.node).on(cc.Node.EventType.TOUCH_END, function() {
          dispatch(LogicEvent_1.LogicEvent.ENTER_HALL);
        });
        this.netToggleContainer = cc.find("netType", this.node).getComponent(cc.ToggleContainer);
        var reconnect = cc.find("reconnet", this.node);
        for (var i = 0; i < 3; i++) {
          var toggle = cc.find("type" + i, reconnect).getComponent(cc.Toggle);
          this.reconnects.push(toggle);
        }
        this.logScorllView = cc.find("log", this.node).getComponent(cc.ScrollView);
        this.logItem = this.logScorllView.content.getChildByName("item");
        this.logItem.removeFromParent(false);
        var connects = cc.find("connet", this.node);
        for (var i = 0; i < 3; i++) {
          var toggle = cc.find("type" + i + "/toggle", connects).getComponent(cc.Toggle);
          this.connects.push(toggle);
          var node = cc.find("type" + i + "/title", connects);
          node.userData = i;
          node.on(cc.Node.EventType.TOUCH_END, this.onConnect, this);
        }
        var send = cc.find("send", this.node);
        for (var i = 0; i < 3; i++) {
          var node = cc.find("type" + i + "/title", send);
          node.userData = i;
          node.on(cc.Node.EventType.TOUCH_END, this.onSend, this);
        }
        var enabled = cc.find("enabled", this.node);
        for (var i = 0; i < 3; i++) {
          var toggle = cc.find("type" + i, enabled).getComponent(cc.Toggle);
          this.enabledServices.push(toggle);
        }
        this.init();
        LogicEvent_1.dispatchEnterComplete({
          type: LogicEvent_1.LogicType.GAME,
          views: [ this ]
        });
      };
      NetTestView.prototype.init = function() {
        for (var i = 0; i < this.netToggleContainer.toggleItems.length; i++) {
          this.netToggleContainer.toggleItems[i].node.userData = i;
          this.netToggleContainer.toggleItems[i].isChecked && this.changeNetType(i);
          this.netToggleContainer.toggleItems[i].node.on("toggle", this.onNetType, this);
        }
        for (var i = 0; i < this.reconnects.length; i++) {
          this.reconnects[i].node.userData = i;
          this.reconnects[i].node.on("toggle", this.onReconnectToggle, this);
          this.onReconnectToggle(this.reconnects[i]);
        }
        for (var i = 0; i < this.connects.length; i++) {
          this.connects[i].node.userData = i;
          this.connects[i].node.on("toggle", this.onConnect, this);
        }
        for (var i = 0; i < this.enabledServices.length; i++) {
          this.enabledServices[i].node.userData = i;
          this.enabledServices[i].node.on("toggle", this.onEnableService, this);
          this.onEnableService(this.enabledServices[i]);
        }
      };
      NetTestView.prototype.onNetType = function(target) {
        this.changeNetType(target.node.userData);
      };
      NetTestView.prototype._changeNetType = function(type, service) {
        if (type == NetTestData_1.NetTest.NetType.JSON) {
          this.log(service.serviceName + " \u4f7f\u7528Json\u65b9\u5f0f");
          service.messageHeader = JsonMessage_1.JsonMessageHeader;
          service.heartbeat = HeartbetJson_1.HeartbeatJson;
          service.maxEnterBackgroundTime = Config_1.Config.MIN_INBACKGROUND_TIME;
        } else if (type == NetTestData_1.NetTest.NetType.PROTO) {
          this.log(service.serviceName + " \u4f7f\u7528Proto\u65b9\u5f0f");
          service.messageHeader = ProtoMessage_1.ProtoMessageHeader;
          service.heartbeat = HeartbetProto_1.HeartbeatProto;
          service.maxEnterBackgroundTime = Config_1.Config.MAX_INBACKGROUND_TIME;
        } else if (type == NetTestData_1.NetTest.NetType.BINARY) {
          this.log(service.serviceName + " \u4f7f\u7528Binary\u65b9\u5f0f");
          service.messageHeader = BinaryStreamMessage_1.BinaryStreamMessageHeader;
          service.heartbeat = HeartbetBinary_1.HeartbeatBinary;
          service.maxEnterBackgroundTime = Config_1.Config.MAX_INBACKGROUND_TIME;
        } else cc.error("\u672a\u77e5\u7f51\u7edc\u7c7b\u578b");
        this.netType = type;
      };
      NetTestView.prototype.changeNetType = function(type) {
        this._changeNetType(type, LobbyService_1.LobbyService.instance);
        this._changeNetType(type, GameService_1.GameService.instance);
        this._changeNetType(type, ChatService_1.ChatService.instance);
      };
      NetTestView.prototype.enabledReconnect = function(service, enabled) {
        service.reconnect.enabled = enabled;
        enabled ? this.log(service.serviceName + " \u542f\u7528\u91cd\u8fde\u7ec4\u4ef6") : this.log(service.serviceName + " \u7981\u7528\u91cd\u8fde\u7ec4\u4ef6");
      };
      NetTestView.prototype.onReconnectToggle = function(toggle) {
        toggle.node.userData == NetTestData_1.NetTest.ServiceType.Lobby ? this.enabledReconnect(LobbyService_1.LobbyService.instance, toggle.isChecked) : toggle.node.userData == NetTestData_1.NetTest.ServiceType.Game ? this.enabledReconnect(GameService_1.GameService.instance, toggle.isChecked) : toggle.node.userData == NetTestData_1.NetTest.ServiceType.Chat && this.enabledReconnect(ChatService_1.ChatService.instance, toggle.isChecked);
      };
      NetTestView.prototype.log = function(data) {
        var item = cc.instantiate(this.logItem);
        item.getComponent(cc.Label).string = data;
        this.logScorllView.content.addChild(item);
        this.logScorllView.scrollToBottom(1);
      };
      NetTestView.prototype._connect = function(service) {
        if (service.isConnected) {
          this.log(service.serviceName + " \u65ad\u5f00\u8fde\u63a5\u4e2d...");
          service.close();
          return;
        }
        this.log(service.serviceName + " \u8fde\u63a5\u4e2d...");
        service.connect();
      };
      NetTestView.prototype.onConnect = function(ev) {
        var target = ev.target;
        target.userData == NetTestData_1.NetTest.ServiceType.Lobby ? this._connect(LobbyService_1.LobbyService.instance) : target.userData == NetTestData_1.NetTest.ServiceType.Game ? this._connect(GameService_1.GameService.instance) : target.userData == NetTestData_1.NetTest.ServiceType.Chat && this._connect(ChatService_1.ChatService.instance);
      };
      NetTestView.prototype.send = function(helper) {
        var msg = "";
        if (this.netType == NetTestData_1.NetTest.NetType.JSON) {
          msg = "\u60a8\u597d\uff0c\u6211\u662fJson\u6d88\u606f";
          helper.sendJsonMessage(msg);
        } else if (this.netType == NetTestData_1.NetTest.NetType.PROTO) {
          msg = "\u60a8\u597d\uff0c\u6211\u662fProto\u6d88\u606f";
          helper.sendProtoMessage(msg);
        } else if (this.netType == NetTestData_1.NetTest.NetType.BINARY) {
          msg = "\u60a8\u597d\uff0c\u6211\u662fBinary\u6d88\u606f";
          helper.sendBinaryMessage(msg);
        }
        this.log("\u53d1\u9001\u6d88\u606f: " + msg);
      };
      NetTestView.prototype.onSend = function(ev) {
        var target = ev.target;
        target.userData == NetTestData_1.NetTest.ServiceType.Lobby ? this.send(HallNetHelper_1.HallNetHelper) : target.userData == NetTestData_1.NetTest.ServiceType.Game ? this.send(TestGameNetHelper_1.TestGameNetHelper) : target.userData == NetTestData_1.NetTest.ServiceType.Chat && this.send(TestChatNetHelper_1.TestChatNetHelper);
      };
      NetTestView.prototype.onEnableService = function(toggle) {
        toggle.node.userData == NetTestData_1.NetTest.ServiceType.Lobby ? LobbyService_1.LobbyService.instance.enabled = toggle.isChecked : toggle.node.userData == NetTestData_1.NetTest.ServiceType.Game ? GameService_1.GameService.instance.enabled = toggle.isChecked : toggle.node.userData == NetTestData_1.NetTest.ServiceType.Chat && (ChatService_1.ChatService.instance.enabled = toggle.isChecked);
      };
      NetTestView = __decorate([ ccclass ], NetTestView);
      return NetTestView;
    }(GameView_1.default);
    exports.default = NetTestView;
    cc._RF.pop();
  }, {
    "../../../../script/common/base/GameView": void 0,
    "../../../../script/common/config/Config": void 0,
    "../../../../script/common/event/CommonEvent": void 0,
    "../../../../script/common/event/LogicEvent": void 0,
    "../../../../script/common/net/ChatService": void 0,
    "../../../../script/common/net/GameService": void 0,
    "../../../../script/common/net/LobbyService": void 0,
    "../../../../script/common/protocol/HeartbetBinary": void 0,
    "../../../../script/common/protocol/HeartbetJson": void 0,
    "../../../../script/common/protocol/HeartbetProto": void 0,
    "../../../../script/framework/net/BinaryStreamMessage": void 0,
    "../../../../script/framework/net/JsonMessage": void 0,
    "../../../../script/framework/net/ProtoMessage": void 0,
    "../../../hall/script/controller/HallNetHelper": void 0,
    "../controller/TestChatNetHelper": "TestChatNetHelper",
    "../controller/TestGameNetHelper": "TestGameNetHelper",
    "../data/NetTestData": "NetTestData"
  } ],
  TestChatNetController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a4effBmVdxAk7iT7KUwUP9f", "TestChatNetController");
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
    var Controller_1 = require("../../../../script/framework/controller/Controller");
    var ChatService_1 = require("../../../../script/common/net/ChatService");
    var CommonEvent_1 = require("../../../../script/common/event/CommonEvent");
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var CmdDefines_1 = require("../../../../script/common/protocol/CmdDefines");
    var LobbyCmd_1 = require("../../../hall/script/protocol/LobbyCmd");
    var TestBinaryMessage_1 = require("../../../hall/script/protocol/TestBinaryMessage");
    var TestJsonMessage_1 = require("../../../hall/script/protocol/TestJsonMessage");
    var TestProtoMessage_1 = require("../../../hall/script/protocol/TestProtoMessage");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TestChatNetController = function(_super) {
      __extends(TestChatNetController, _super);
      function TestChatNetController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      TestChatNetController.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(CmdDefines_1.MainCmd.CMD_LOBBY, LobbyCmd_1.SUB_CMD_LOBBY.TEST_JSON_MSG, this.onTestJsonMessage, TestJsonMessage_1.TestJsonMessage, true);
        this.registerEvent(CmdDefines_1.MainCmd.CMD_LOBBY, LobbyCmd_1.SUB_CMD_LOBBY.TEST_PROTO_MSG, this.onTestProtoMessage, TestProtoMessage_1.TestProtoMessage);
        this.registerEvent(CmdDefines_1.MainCmd.CMD_LOBBY, LobbyCmd_1.SUB_CMD_LOBBY.TEST_BINARY_MSG, this.onTestBinaryMessage, TestBinaryMessage_1.TestBinaryMessage);
      };
      TestChatNetController.prototype.onTestJsonMessage = function(data) {
        dispatch(CommonEvent_1.CommonEvent.TEST_JSON_MSG, data.hello);
      };
      TestChatNetController.prototype.onTestProtoMessage = function(data) {
        dispatch(CommonEvent_1.CommonEvent.TEST_PROTO_MSG, data.data.hello);
      };
      TestChatNetController.prototype.onTestBinaryMessage = function(data) {
        dispatch(CommonEvent_1.CommonEvent.TEST_BINARY_MSG, data.hello);
      };
      TestChatNetController.prototype.onNetOpen = function(event) {
        var result = _super.prototype.onNetOpen.call(this, event);
        result && dispatch(CommonEvent_1.CommonEvent.CHAT_SERVICE_CONNECTED, this.service);
        return result;
      };
      TestChatNetController.prototype.onNetClose = function(event) {
        var result = _super.prototype.onNetClose.call(this, event);
        result && dispatch(CommonEvent_1.CommonEvent.CHAT_SERVICE_CLOSE, this.service);
        return result;
      };
      TestChatNetController = __decorate([ ccclass, Decorators_1.injectService(ChatService_1.ChatService.instance) ], TestChatNetController);
      return TestChatNetController;
    }(Controller_1.default);
    exports.default = TestChatNetController;
    Manager_1.Manager.hallNetManager.register(TestChatNetController);
    cc._RF.pop();
  }, {
    "../../../../script/common/event/CommonEvent": void 0,
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/common/net/ChatService": void 0,
    "../../../../script/common/protocol/CmdDefines": void 0,
    "../../../../script/framework/controller/Controller": void 0,
    "../../../../script/framework/decorator/Decorators": void 0,
    "../../../hall/script/protocol/LobbyCmd": void 0,
    "../../../hall/script/protocol/TestBinaryMessage": void 0,
    "../../../hall/script/protocol/TestJsonMessage": void 0,
    "../../../hall/script/protocol/TestProtoMessage": void 0
  } ],
  TestChatNetHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4139aBwAClAHKGqJZcurvMk", "TestChatNetHelper");
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
    exports.TestChatNetHelper = void 0;
    var NetHelper_1 = require("../../../../script/framework/controller/NetHelper");
    var ChatService_1 = require("../../../../script/common/net/ChatService");
    var TestBinaryMessage_1 = require("../../../hall/script/protocol/TestBinaryMessage");
    var TestJsonMessage_1 = require("../../../hall/script/protocol/TestJsonMessage");
    var TestProtoMessage_1 = require("../../../hall/script/protocol/TestProtoMessage");
    var _TestChatNetHelper = function(_super) {
      __extends(_TestChatNetHelper, _super);
      function _TestChatNetHelper() {
        return _super.call(this, ChatService_1.ChatService.instance) || this;
      }
      _TestChatNetHelper.prototype.sendProtoMessage = function(hello) {
        var testProto = new TestProtoMessage_1.TestProtoMessage();
        testProto.data.hello = hello;
        testProto.data.afvalue = 4.5;
        this.service.send(testProto);
      };
      _TestChatNetHelper.prototype.sendJsonMessage = function(hello) {
        var msg = new TestJsonMessage_1.TestJsonMessage();
        msg.hello = hello;
        this.service.send(msg);
      };
      _TestChatNetHelper.prototype.sendBinaryMessage = function(hello) {
        var binaryMessage = new TestBinaryMessage_1.TestBinaryMessage();
        binaryMessage.hello = hello;
        this.service.send(binaryMessage);
      };
      return _TestChatNetHelper;
    }(NetHelper_1.default);
    exports.TestChatNetHelper = new _TestChatNetHelper();
    cc._RF.pop();
  }, {
    "../../../../script/common/net/ChatService": void 0,
    "../../../../script/framework/controller/NetHelper": void 0,
    "../../../hall/script/protocol/TestBinaryMessage": void 0,
    "../../../hall/script/protocol/TestJsonMessage": void 0,
    "../../../hall/script/protocol/TestProtoMessage": void 0
  } ],
  TestGameNetController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f1ac2v+JFFArLru4CSYQYQX", "TestGameNetController");
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
    var Controller_1 = require("../../../../script/framework/controller/Controller");
    var CommonEvent_1 = require("../../../../script/common/event/CommonEvent");
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var GameService_1 = require("../../../../script/common/net/GameService");
    var CmdDefines_1 = require("../../../../script/common/protocol/CmdDefines");
    var LobbyCmd_1 = require("../../../hall/script/protocol/LobbyCmd");
    var TestBinaryMessage_1 = require("../../../hall/script/protocol/TestBinaryMessage");
    var TestJsonMessage_1 = require("../../../hall/script/protocol/TestJsonMessage");
    var TestProtoMessage_1 = require("../../../hall/script/protocol/TestProtoMessage");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TestGameNetController = function(_super) {
      __extends(TestGameNetController, _super);
      function TestGameNetController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      TestGameNetController.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(CmdDefines_1.MainCmd.CMD_LOBBY, LobbyCmd_1.SUB_CMD_LOBBY.TEST_JSON_MSG, this.onTestJsonMessage, TestJsonMessage_1.TestJsonMessage);
        this.registerEvent(CmdDefines_1.MainCmd.CMD_LOBBY, LobbyCmd_1.SUB_CMD_LOBBY.TEST_PROTO_MSG, this.onTestProtoMessage, TestProtoMessage_1.TestProtoMessage);
        this.registerEvent(CmdDefines_1.MainCmd.CMD_LOBBY, LobbyCmd_1.SUB_CMD_LOBBY.TEST_BINARY_MSG, this.onTestBinaryMessage, TestBinaryMessage_1.TestBinaryMessage);
      };
      TestGameNetController.prototype.onTestJsonMessage = function(data) {
        dispatch(CommonEvent_1.CommonEvent.TEST_JSON_MSG, data.hello);
      };
      TestGameNetController.prototype.onTestProtoMessage = function(data) {
        dispatch(CommonEvent_1.CommonEvent.TEST_PROTO_MSG, data.data.hello);
      };
      TestGameNetController.prototype.onTestBinaryMessage = function(data) {
        dispatch(CommonEvent_1.CommonEvent.TEST_BINARY_MSG, data.hello);
      };
      TestGameNetController.prototype.onNetOpen = function(event) {
        var result = _super.prototype.onNetOpen.call(this, event);
        result && dispatch(CommonEvent_1.CommonEvent.GAME_SERVICE_CONNECTED, this.service);
        return result;
      };
      TestGameNetController.prototype.onNetClose = function(event) {
        var result = _super.prototype.onNetClose.call(this, event);
        result && dispatch(CommonEvent_1.CommonEvent.GAME_SERVICE_CLOSE, this.service);
        return result;
      };
      TestGameNetController = __decorate([ ccclass, Decorators_1.injectService(GameService_1.GameService.instance) ], TestGameNetController);
      return TestGameNetController;
    }(Controller_1.default);
    exports.default = TestGameNetController;
    Manager_1.Manager.hallNetManager.register(TestGameNetController);
    cc._RF.pop();
  }, {
    "../../../../script/common/event/CommonEvent": void 0,
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/common/net/GameService": void 0,
    "../../../../script/common/protocol/CmdDefines": void 0,
    "../../../../script/framework/controller/Controller": void 0,
    "../../../../script/framework/decorator/Decorators": void 0,
    "../../../hall/script/protocol/LobbyCmd": void 0,
    "../../../hall/script/protocol/TestBinaryMessage": void 0,
    "../../../hall/script/protocol/TestJsonMessage": void 0,
    "../../../hall/script/protocol/TestProtoMessage": void 0
  } ],
  TestGameNetHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6f20fAe+ChNPZ7vaYZQKk8J", "TestGameNetHelper");
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
    exports.TestGameNetHelper = void 0;
    var NetHelper_1 = require("../../../../script/framework/controller/NetHelper");
    var GameService_1 = require("../../../../script/common/net/GameService");
    var TestBinaryMessage_1 = require("../../../hall/script/protocol/TestBinaryMessage");
    var TestJsonMessage_1 = require("../../../hall/script/protocol/TestJsonMessage");
    var TestProtoMessage_1 = require("../../../hall/script/protocol/TestProtoMessage");
    var _TestGameNetHelper = function(_super) {
      __extends(_TestGameNetHelper, _super);
      function _TestGameNetHelper() {
        return _super.call(this, GameService_1.GameService.instance) || this;
      }
      _TestGameNetHelper.prototype.sendProtoMessage = function(hello) {
        var testProto = new TestProtoMessage_1.TestProtoMessage();
        testProto.data.hello = hello;
        testProto.data.afvalue = 4.5;
        this.service.send(testProto);
      };
      _TestGameNetHelper.prototype.sendJsonMessage = function(hello) {
        var msg = new TestJsonMessage_1.TestJsonMessage();
        msg.hello = hello;
        this.service.send(msg);
      };
      _TestGameNetHelper.prototype.sendBinaryMessage = function(hello) {
        var binaryMessage = new TestBinaryMessage_1.TestBinaryMessage();
        binaryMessage.hello = hello;
        this.service.send(binaryMessage);
      };
      return _TestGameNetHelper;
    }(NetHelper_1.default);
    exports.TestGameNetHelper = new _TestGameNetHelper();
    cc._RF.pop();
  }, {
    "../../../../script/common/net/GameService": void 0,
    "../../../../script/framework/controller/NetHelper": void 0,
    "../../../hall/script/protocol/TestBinaryMessage": void 0,
    "../../../hall/script/protocol/TestJsonMessage": void 0,
    "../../../hall/script/protocol/TestProtoMessage": void 0
  } ]
}, {}, [ "NetTestLogic", "INetHelper", "TestChatNetController", "TestChatNetHelper", "TestGameNetController", "TestGameNetHelper", "NetTestData", "NetTestView" ]);