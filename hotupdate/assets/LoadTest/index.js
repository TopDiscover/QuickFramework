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
  LoadTestLogic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "59d47b8obJKi7rHWTIjpS5j", "LoadTestLogic");
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
    var LoadTestView_1 = require("./view/LoadTestView");
    var LoadTestLogic = function(_super) {
      __extends(LoadTestLogic, _super);
      function LoadTestLogic() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.logicType = LogicEvent_1.LogicType.GAME;
        return _this;
      }
      LoadTestLogic.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
      };
      LoadTestLogic.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(LogicEvent_1.LogicEvent.ENTER_GAME, this.onEnterGame);
      };
      Object.defineProperty(LoadTestLogic.prototype, "bundle", {
        get: function() {
          return "LoadTest";
        },
        enumerable: false,
        configurable: true
      });
      LoadTestLogic.prototype.onEnterGame = function(data) {
        data == this.bundle && Manager_1.Manager.uiManager.open({
          type: LoadTestView_1.default,
          bundle: this.bundle
        });
      };
      return LoadTestLogic;
    }(Logic_1.Logic);
    Manager_1.Manager.logicManager.push(LoadTestLogic);
    cc._RF.pop();
  }, {
    "../../../script/common/base/Logic": void 0,
    "../../../script/common/event/LogicEvent": void 0,
    "../../../script/common/manager/Manager": void 0,
    "./view/LoadTestView": "LoadTestView"
  } ],
  LoadTestView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a7f3c43g6lKyIXnot0as1dC", "LoadTestView");
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
    var LogicEvent_1 = require("../../../../script/common/event/LogicEvent");
    var Utils_1 = require("../../../../script/framework/extentions/Utils");
    var UIView_1 = require("../../../../script/framework/ui/UIView");
    var HallData_1 = require("../../../hall/script/data/HallData");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LoadTestView = function(_super) {
      __extends(LoadTestView, _super);
      function LoadTestView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.loadButton = null;
        return _this;
      }
      LoadTestView.getPrefabUrl = function() {
        return "prefabs/LoadTestView";
      };
      LoadTestView.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        cc.find("goback", this.node).on(cc.Node.EventType.TOUCH_END, this.onGoback, this);
        this.content = cc.find("content", this.node);
        var op = cc.find("op", this.node);
        cc.find("loadFont", op).on(cc.Node.EventType.TOUCH_END, this.onLoadFont, this);
        cc.find("loadImg", op).on(cc.Node.EventType.TOUCH_END, this.onLoadImg, this);
        cc.find("loadNetImg", op).on(cc.Node.EventType.TOUCH_END, this.onLoadNetImg, this);
        this.loadButton = cc.find("loadButton", op);
        this.loadButton.on(cc.Node.EventType.TOUCH_END, this.onLoadButton, this);
        cc.find("loadParticle", op).on(cc.Node.EventType.TOUCH_END, this.onLoadParticle, this);
        cc.find("loadSpine", op).on(cc.Node.EventType.TOUCH_END, this.onLoadSpine, this);
        cc.find("loadNetSpine", op).on(cc.Node.EventType.TOUCH_END, this.onLoadNetSpine, this);
        LogicEvent_1.dispatchEnterComplete({
          type: LogicEvent_1.LogicType.GAME,
          views: [ this ]
        });
      };
      LoadTestView.prototype.onGoback = function() {
        dispatch(LogicEvent_1.LogicEvent.ENTER_HALL);
      };
      LoadTestView.prototype.onLoadFont = function() {
        if (this.content.getChildByName("font")) return;
        this.content.removeAllChildren();
        var node = new cc.Node();
        node.name = "font";
        this.content.addChild(node);
        var label = node.addComponent(cc.Label);
        label.loadFont({
          font: "font/number",
          view: this,
          completeCallback: function(font) {
            font && (label.string = "+12345678.9\u4e07");
          },
          bundle: this.bundle
        });
      };
      LoadTestView.prototype.onLoadImg = function() {
        var name = "testImg";
        if (this.content.getChildByName(name)) return;
        this.content.removeAllChildren();
        var node = new cc.Node();
        this.content.addChild(node);
        node.name = name;
        var sp = node.addComponent(cc.Sprite);
        sp.loadImage({
          url: "texture/timg",
          view: this
        });
      };
      LoadTestView.prototype.onLoadNetImg = function() {
        var name = "netimg";
        if (this.content.getChildByName(name)) return;
        this.content.removeAllChildren();
        var node = new cc.Node();
        this.content.addChild(node);
        node.name = name;
        var sp = node.addComponent(cc.Sprite);
        sp.loadRemoteImage({
          url: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1625394063,1937534251&fm=26&gp=0.jpg",
          view: this,
          defaultBundle: this.bundle,
          defaultSpriteFrame: "texture/timg"
        });
      };
      LoadTestView.prototype.onLoadButton = function() {
        var name = "button";
        if (this.content.getChildByName(name)) return;
        this.content.removeAllChildren();
        var button = cc.instantiate(this.loadButton);
        this.content.addChild(button);
        button.name = name;
        button.position = cc.v3(0, 0, 0);
        var btn = button.getComponent(cc.Button);
        btn.loadButton({
          normalSprite: "texture/btn_b",
          pressedSprite: "texture/btn_y",
          hoverSprite: "texture/btnbg",
          view: this,
          bundle: HallData_1.HallData.bundle,
          completeCallback: function(type, spriteFrame) {
            if (type == Utils_1.ButtonSpriteMemberName.Norml) {
              button.setContentSize(spriteFrame.getOriginalSize());
              btn.target.setContentSize(spriteFrame.getOriginalSize());
            }
          }
        });
      };
      LoadTestView.prototype.onLoadParticle = function() {
        var name = "onLoadParticle";
        if (this.content.getChildByName(name)) return;
        this.content.removeAllChildren();
        var node = new cc.Node();
        node.name = name;
        this.content.addChild(node);
        var sys = node.addComponent(cc.ParticleSystem);
        sys.loadFile({
          url: "particle/test",
          view: this
        });
      };
      LoadTestView.prototype.onLoadSpine = function() {
        var name = "onLoadSpine";
        if (this.content.getChildByName(name)) return;
        this.content.removeAllChildren();
        var node = new cc.Node();
        node.name = name;
        this.content.addChild(node);
        var spine = node.addComponent(sp.Skeleton);
        spine.loadSkeleton({
          view: this,
          url: "spine/raptor",
          completeCallback: function() {
            spine.setAnimation(0, "walk", true);
          }
        });
        node.y = -this.content.height / 2;
        node.scale = .5;
      };
      LoadTestView.prototype.onLoadNetSpine = function() {
        var name = "onLoadNetSpine";
        if (this.content.getChildByName(name)) return;
        this.content.removeAllChildren();
        var node = new cc.Node();
        this.content.addChild(node);
        var spine = node.addComponent(sp.Skeleton);
        spine.loadRemoteSkeleton({
          view: this,
          path: "http://192.168.3.104",
          name: "raptor",
          completeCallback: function(data) {
            data && spine.setAnimation(0, "walk", true);
          }
        });
        node.y = -this.content.height / 2;
        node.scale = .7;
      };
      LoadTestView = __decorate([ ccclass ], LoadTestView);
      return LoadTestView;
    }(UIView_1.default);
    exports.default = LoadTestView;
    cc._RF.pop();
  }, {
    "../../../../script/common/event/LogicEvent": void 0,
    "../../../../script/framework/extentions/Utils": void 0,
    "../../../../script/framework/ui/UIView": void 0,
    "../../../hall/script/data/HallData": void 0
  } ]
}, {}, [ "LoadTestLogic", "LoadTestView" ]);