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
  GameOneLogic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c11bn1QidDxZ9uOVLsWapY", "GameOneLogic");
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
    var GameOneView_1 = require("./view/GameOneView");
    var GameOneLogic = function(_super) {
      __extends(GameOneLogic, _super);
      function GameOneLogic() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.logicType = LogicEvent_1.LogicType.GAME;
        return _this;
      }
      GameOneLogic.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
      };
      GameOneLogic.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(LogicEvent_1.LogicEvent.ENTER_GAME, this.onEnterGame);
      };
      Object.defineProperty(GameOneLogic.prototype, "bundle", {
        get: function() {
          return "gameOne";
        },
        enumerable: false,
        configurable: true
      });
      GameOneLogic.prototype.onEnterGame = function(data) {
        data == this.bundle && Manager_1.Manager.uiManager.open({
          type: GameOneView_1.default,
          bundle: this.bundle
        });
      };
      return GameOneLogic;
    }(Logic_1.Logic);
    Manager_1.Manager.logicManager.push(GameOneLogic);
    cc._RF.pop();
  }, {
    "../../../script/common/base/Logic": void 0,
    "../../../script/common/event/LogicEvent": void 0,
    "../../../script/common/manager/Manager": void 0,
    "./view/GameOneView": "GameOneView"
  } ],
  GameOneView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e3f0co2zrNGsI3LETdxc107", "GameOneView");
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
    var SettingView_1 = require("../../../../script/common/component/SettingView");
    var Config_1 = require("../../../../script/common/config/Config");
    var LogicEvent_1 = require("../../../../script/common/event/LogicEvent");
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var Defines_1 = require("../../../../script/framework/base/Defines");
    var UIView_1 = require("../../../../script/framework/ui/UIView");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameOneView = function(_super) {
      __extends(GameOneView, _super);
      function GameOneView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.testNode = null;
        return _this;
      }
      GameOneView.getPrefabUrl = function() {
        return "prefabs/GameOneView";
      };
      GameOneView.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        var goback = cc.find("goBack", this.node);
        goback.on(cc.Node.EventType.TOUCH_END, function() {
          dispatch(LogicEvent_1.LogicEvent.ENTER_HALL);
        });
        goback.zIndex = 10;
        this.audioHelper.playMusic("audio/background", this.bundle);
        cc.find("setting", this.node).on(cc.Node.EventType.TOUCH_END, this.onSetting, this);
        LogicEvent_1.dispatchEnterComplete({
          type: LogicEvent_1.LogicType.GAME,
          views: [ this ]
        });
      };
      GameOneView.prototype.onSetting = function() {
        Manager_1.Manager.uiManager.open({
          type: SettingView_1.default,
          bundle: Defines_1.BUNDLE_RESOURCES,
          zIndex: Config_1.ViewZOrder.UI,
          name: "\u8bbe\u7f6e\u754c\u9762"
        });
      };
      GameOneView = __decorate([ ccclass ], GameOneView);
      return GameOneView;
    }(UIView_1.default);
    exports.default = GameOneView;
    cc._RF.pop();
  }, {
    "../../../../script/common/component/SettingView": void 0,
    "../../../../script/common/config/Config": void 0,
    "../../../../script/common/event/LogicEvent": void 0,
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/framework/base/Defines": void 0,
    "../../../../script/framework/ui/UIView": void 0
  } ]
}, {}, [ "GameOneLogic", "GameOneView" ]);