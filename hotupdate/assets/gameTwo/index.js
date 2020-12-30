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
  GameTwoLogic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d6c70wA1fRI158LX0UTibHr", "GameTwoLogic");
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
    var GameTwoView_1 = require("./GameTwoView");
    var Manager_1 = require("../../../script/common/manager/Manager");
    var GameTwoLogic = function(_super) {
      __extends(GameTwoLogic, _super);
      function GameTwoLogic() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.logicType = LogicEvent_1.LogicType.GAME;
        return _this;
      }
      GameTwoLogic.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
      };
      GameTwoLogic.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(LogicEvent_1.LogicEvent.ENTER_GAME, this.onEnterGame);
      };
      Object.defineProperty(GameTwoLogic.prototype, "bundle", {
        get: function() {
          return "gameTwo";
        },
        enumerable: false,
        configurable: true
      });
      GameTwoLogic.prototype.onEnterGame = function(data) {
        data == this.bundle && Manager_1.Manager.uiManager.open({
          type: GameTwoView_1.default,
          bundle: this.bundle
        });
      };
      return GameTwoLogic;
    }(Logic_1.Logic);
    Manager_1.Manager.logicManager.push(GameTwoLogic);
    cc._RF.pop();
  }, {
    "../../../script/common/base/Logic": void 0,
    "../../../script/common/event/LogicEvent": void 0,
    "../../../script/common/manager/Manager": void 0,
    "./GameTwoView": "GameTwoView"
  } ],
  GameTwoView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "389d54BbYlKhIs5WeYH3wfB", "GameTwoView");
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
    var UIView_1 = require("../../../script/framework/ui/UIView");
    var LogicEvent_1 = require("../../../script/common/event/LogicEvent");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameTwoView = function(_super) {
      __extends(GameTwoView, _super);
      function GameTwoView() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      GameTwoView.getPrefabUrl = function() {
        return "prefabs/GameTwoView";
      };
      GameTwoView.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        cc.find("goBack", this.node).on(cc.Node.EventType.TOUCH_END, function() {
          dispatch(LogicEvent_1.LogicEvent.ENTER_HALL);
        });
        LogicEvent_1.dispatchEnterComplete({
          type: LogicEvent_1.LogicType.GAME,
          views: [ this ]
        });
      };
      GameTwoView = __decorate([ ccclass ], GameTwoView);
      return GameTwoView;
    }(UIView_1.default);
    exports.default = GameTwoView;
    cc._RF.pop();
  }, {
    "../../../script/common/event/LogicEvent": void 0,
    "../../../script/framework/ui/UIView": void 0
  } ]
}, {}, [ "GameTwoLogic", "GameTwoView" ]);