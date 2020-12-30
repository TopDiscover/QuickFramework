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
  TankBattleBlock: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5d07fZgMQdF2qjxWDCK4Syq", "TankBattleBlock");
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
    var TankBattleGameData_1 = require("../data/TankBattleGameData");
    var TankBattleBullet_1 = require("./TankBattleBullet");
    var TankBattleTank_1 = require("./TankBattleTank");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TankBattleBlock = function(_super) {
      __extends(TankBattleBlock, _super);
      function TankBattleBlock() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.type = null;
        return _this;
      }
      TankBattleBlock.prototype.onCollisionEnter = function(other, me) {
        this.handBullet(other, me);
      };
      TankBattleBlock.prototype.onCollisionStay = function(other, me) {};
      TankBattleBlock.prototype.onCollisionExit = function(other, me) {};
      TankBattleBlock.prototype.removeSelf = function() {
        this.node.removeFromParent();
        this.node.destroy();
      };
      TankBattleBlock.prototype.handBullet = function(other, me) {
        if (other.node.group == TankBattleGameData_1.TankBettle.GROUP.Bullet) switch (this.type) {
         case TankBattleGameData_1.TankBettle.BLOCK_TYPE.GRASS:
         case TankBattleGameData_1.TankBettle.BLOCK_TYPE.ICE:
          break;

         case TankBattleGameData_1.TankBettle.BLOCK_TYPE.WALL:
          this.removeSelf();
          break;

         case TankBattleGameData_1.TankBettle.BLOCK_TYPE.STONE_WALL:
          var bullet = other.node.getComponent(TankBattleBullet_1.default);
          bullet && bullet.owner instanceof TankBattleTank_1.TankBettleTankPlayer && bullet.owner.hasStatus(TankBattleGameData_1.TankBettle.PLAYER_STATUS.STRONG) && this.removeSelf();
          break;

         case TankBattleGameData_1.TankBettle.BLOCK_TYPE.HOME:
          TankBattleGameData_1.TankBettle.gameData.gameOver();
        }
      };
      TankBattleBlock = __decorate([ ccclass ], TankBattleBlock);
      return TankBattleBlock;
    }(cc.Component);
    exports.default = TankBattleBlock;
    cc._RF.pop();
  }, {
    "../data/TankBattleGameData": "TankBattleGameData",
    "./TankBattleBullet": "TankBattleBullet",
    "./TankBattleTank": "TankBattleTank"
  } ],
  TankBattleBullet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8360cCkuQBKvoCOCgEpK8Dd", "TankBattleBullet");
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
    var TankBattleGameData_1 = require("../data/TankBattleGameData");
    var TankBattleTank_1 = require("./TankBattleTank");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TankBettleBullet = function(_super) {
      __extends(TankBettleBullet, _super);
      function TankBettleBullet() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.owner = null;
        return _this;
      }
      TankBettleBullet_1 = TankBettleBullet;
      TankBettleBullet.prototype.addBullet = function() {
        TankBattleGameData_1.TankBettle.gameData.gameMap.addBullet(this);
        if (this.owner.direction == TankBattleGameData_1.TankBettle.Direction.UP) {
          this.node.x = this.owner.node.x;
          this.node.y = this.owner.node.y + this.owner.node.height / 2;
          this.node.angle = 0;
        } else if (this.owner.direction == TankBattleGameData_1.TankBettle.Direction.DOWN) {
          this.node.x = this.owner.node.x;
          this.node.y = this.owner.node.y - this.owner.node.height / 2;
          this.node.angle = 180;
        } else if (this.owner.direction == TankBattleGameData_1.TankBettle.Direction.RIGHT) {
          this.node.x = this.owner.node.x + this.owner.node.width / 2;
          this.node.y = this.owner.node.y;
          this.node.angle = -90;
        } else if (this.owner.direction == TankBattleGameData_1.TankBettle.Direction.LEFT) {
          this.node.x = this.owner.node.x - this.owner.node.width / 2;
          this.node.y = this.owner.node.y;
          this.node.angle = 90;
        }
      };
      TankBettleBullet.prototype.move = function(owner) {
        this.owner = owner;
        this.addBullet();
        this.owner.direction == TankBattleGameData_1.TankBettle.Direction.UP ? cc.tween(this.node).delay(0).by(this.owner.config.bulletTime, {
          y: this.owner.config.bulletDistance
        }).repeatForever().start() : this.owner.direction == TankBattleGameData_1.TankBettle.Direction.DOWN ? cc.tween(this.node).delay(0).by(this.owner.config.bulletTime, {
          y: -this.owner.config.bulletDistance
        }).repeatForever().start() : this.owner.direction == TankBattleGameData_1.TankBettle.Direction.RIGHT ? cc.tween(this.node).delay(0).by(this.owner.config.bulletTime, {
          x: this.owner.config.bulletDistance
        }).repeatForever().start() : this.owner.direction == TankBattleGameData_1.TankBettle.Direction.LEFT && cc.tween(this.node).delay(0).by(this.owner.config.bulletTime, {
          x: -this.owner.config.bulletDistance
        }).repeatForever().start();
      };
      TankBettleBullet.prototype.onCollisionEnter = function(other, me) {
        if (other.node.group == TankBattleGameData_1.TankBettle.GROUP.Wall || other.node.group == TankBattleGameData_1.TankBettle.GROUP.StoneWall || other.node.group == TankBattleGameData_1.TankBettle.GROUP.Boundary || other.node.group == TankBattleGameData_1.TankBettle.GROUP.Home) this.removeSelf(); else if (other.node.group == TankBattleGameData_1.TankBettle.GROUP.Bullet) {
          var bullet = other.node.getComponent(TankBettleBullet_1);
          this.owner.isAI ? bullet.owner.isAI || this.removeSelf() : bullet.owner.isAI && this.removeSelf();
        } else if (other.node.group == TankBattleGameData_1.TankBettle.GROUP.Player) {
          var tank = this.getPlayer(other.node);
          this.owner.isAI ? tank.isAI || this.removeSelf() : tank.isAI && this.removeSelf();
        }
      };
      TankBettleBullet.prototype.removeSelf = function() {
        TankBattleGameData_1.TankBettle.gameData.bulletCrackAudio();
        this.node.stopAllActions();
        this.owner.bullet = null;
        this.node.removeFromParent();
        this.node.destroy();
      };
      TankBettleBullet.prototype.getPlayer = function(node) {
        var player = node.getComponent(TankBattleTank_1.TankBettleTankPlayer);
        if (player) return player;
        return node.getComponent(TankBattleTank_1.TankBettleTankEnemy);
      };
      TankBettleBullet.prototype.onCollisionStay = function(other, me) {};
      TankBettleBullet.prototype.onCollisionExit = function(other, me) {};
      var TankBettleBullet_1;
      TankBettleBullet = TankBettleBullet_1 = __decorate([ ccclass ], TankBettleBullet);
      return TankBettleBullet;
    }(cc.Component);
    exports.default = TankBettleBullet;
    cc._RF.pop();
  }, {
    "../data/TankBattleGameData": "TankBattleGameData",
    "./TankBattleTank": "TankBattleTank"
  } ],
  TankBattleChangeStageView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e5e540uUpxCMqkmZ3sALOvq", "TankBattleChangeStageView");
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
    var TankBattleGameData_1 = require("../data/TankBattleGameData");
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TankBattleChangeStageView = function(_super) {
      __extends(TankBattleChangeStageView, _super);
      function TankBattleChangeStageView() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      TankBattleChangeStageView.getPrefabUrl = function() {
        return "prefabs/TankBattleChangeStageView";
      };
      TankBattleChangeStageView.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        var level = this.args[0];
        var node = cc.find("level", this.node);
        node.getComponent(cc.Label).language = Manager_1.Manager.makeLanguage([ "stage", level + 1 ], this.bundle);
        var comp = this.node.getComponent(cc.Animation);
        comp.on(cc.Animation.EventType.FINISHED, this.onStartFinished, this);
        comp.play();
      };
      TankBattleChangeStageView.prototype.onStartFinished = function(type, state) {
        var _this = this;
        cc.tween(this.node).delay(1).call(function() {
          var comp = _this.node.getComponent(cc.Animation);
          comp.off(cc.Animation.EventType.FINISHED, _this.onStartFinished, _this);
          comp.on(cc.Animation.EventType.FINISHED, _this.onStartQuitFinished, _this);
          comp.play("startQuit");
          dispatch(TankBattleGameData_1.TankBettle.EVENT.SHOW_MAP_LEVEL, _this.args[0]);
        }).start();
      };
      TankBattleChangeStageView.prototype.onStartQuitFinished = function(type, state) {
        dispatch(TankBattleGameData_1.TankBettle.EVENT.CHANGE_STAGE_FINISHED);
        this.close();
      };
      TankBattleChangeStageView = __decorate([ ccclass ], TankBattleChangeStageView);
      return TankBattleChangeStageView;
    }(UIView_1.default);
    exports.default = TankBattleChangeStageView;
    cc._RF.pop();
  }, {
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/framework/ui/UIView": void 0,
    "../data/TankBattleGameData": "TankBattleGameData"
  } ],
  TankBattleGameData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e6b70AuwTxKb5kaf9HeK8vs", "TankBattleGameData");
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
    exports.TankBettle = void 0;
    var GameData_1 = require("../../../../script/common/base/GameData");
    var TankBattleLanguageZH_1 = require("./TankBattleLanguageZH");
    var TankBattleLanguageEN_1 = require("./TankBattleLanguageEN");
    var LanguageImpl_1 = require("../../../../script/common/language/LanguageImpl");
    var TankBattleLevel_1 = require("./TankBattleLevel");
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var Singleton_1 = require("../../../../script/framework/base/Singleton");
    var TankBattleChangeStageView_1 = require("../view/TankBattleChangeStageView");
    var Config_1 = require("../../../../script/common/config/Config");
    var TankBattleStartView_1 = require("../view/TankBattleStartView");
    var TankBattleGameOver_1 = require("../view/TankBattleGameOver");
    var TankBettle;
    (function(TankBettle) {
      var Direction;
      (function(Direction) {
        Direction[Direction["MIN"] = 0] = "MIN";
        Direction[Direction["UP"] = 0] = "UP";
        Direction[Direction["DOWN"] = 1] = "DOWN";
        Direction[Direction["LEFT"] = 2] = "LEFT";
        Direction[Direction["RIGHT"] = 3] = "RIGHT";
        Direction[Direction["MAX"] = 3] = "MAX";
      })(Direction = TankBettle.Direction || (TankBettle.Direction = {}));
      TankBettle.MAX_ENEMY = 20;
      TankBettle.MAX_APPEAR_ENEMY = 5;
      TankBettle.MAX_PLAYER_LIVE = 3;
      var GAME_STATUS;
      (function(GAME_STATUS) {
        GAME_STATUS[GAME_STATUS["UNKNOWN"] = 0] = "UNKNOWN";
        GAME_STATUS[GAME_STATUS["SELECTED"] = 1] = "SELECTED";
        GAME_STATUS[GAME_STATUS["INIT"] = 2] = "INIT";
        GAME_STATUS[GAME_STATUS["GAME"] = 3] = "GAME";
        GAME_STATUS[GAME_STATUS["OVER"] = 4] = "OVER";
        GAME_STATUS[GAME_STATUS["WIN"] = 5] = "WIN";
      })(GAME_STATUS = TankBettle.GAME_STATUS || (TankBettle.GAME_STATUS = {}));
      var BLOCK_TYPE;
      (function(BLOCK_TYPE) {
        BLOCK_TYPE[BLOCK_TYPE["WALL"] = 1] = "WALL";
        BLOCK_TYPE[BLOCK_TYPE["STONE_WALL"] = 2] = "STONE_WALL";
        BLOCK_TYPE[BLOCK_TYPE["GRASS"] = 3] = "GRASS";
        BLOCK_TYPE[BLOCK_TYPE["WATER"] = 4] = "WATER";
        BLOCK_TYPE[BLOCK_TYPE["ICE"] = 5] = "ICE";
        BLOCK_TYPE[BLOCK_TYPE["HOME"] = 9] = "HOME";
        BLOCK_TYPE[BLOCK_TYPE["ANOTHREHOME"] = 8] = "ANOTHREHOME";
      })(BLOCK_TYPE = TankBettle.BLOCK_TYPE || (TankBettle.BLOCK_TYPE = {}));
      var GROUP;
      (function(GROUP) {
        GROUP["Wall"] = "Wall";
        GROUP["StoneWall"] = "StoneWall";
        GROUP["Grass"] = "Grass";
        GROUP["Water"] = "Water";
        GROUP["Ice"] = "Ice";
        GROUP["Home"] = "Home";
        GROUP["Bullet"] = "Bullet";
        GROUP["Player"] = "Player";
        GROUP["Boundary"] = "Boundary";
        GROUP["Props"] = "Props";
      })(GROUP = TankBettle.GROUP || (TankBettle.GROUP = {}));
      var EVENT;
      (function(EVENT) {
        EVENT["SHOW_MAP_LEVEL"] = "SHOW_MAP_LEVEL";
        EVENT["CHANGE_STAGE_FINISHED"] = "CHANGE_STAGE_FINISHED";
        EVENT["REQ_LEVEL"] = "REQ_LEVEL";
      })(EVENT = TankBettle.EVENT || (TankBettle.EVENT = {}));
      function netController() {
        return Manager_1.Manager.gameController;
      }
      TankBettle.netController = netController;
      var PLAYER_STATUS;
      (function(PLAYER_STATUS) {
        PLAYER_STATUS[PLAYER_STATUS["STRONG"] = 0] = "STRONG";
        PLAYER_STATUS[PLAYER_STATUS["PROTECTED"] = 1] = "PROTECTED";
      })(PLAYER_STATUS = TankBettle.PLAYER_STATUS || (TankBettle.PLAYER_STATUS = {}));
      TankBettle.PLAYER_STATUS_EXIST_TIME = 5;
      var ZIndex;
      (function(ZIndex) {
        ZIndex[ZIndex["TANK"] = 0] = "TANK";
        ZIndex[ZIndex["BULLET"] = 1] = "BULLET";
        ZIndex[ZIndex["BLOCK"] = 2] = "BLOCK";
        ZIndex[ZIndex["PROPS"] = 3] = "PROPS";
      })(ZIndex = TankBettle.ZIndex || (TankBettle.ZIndex = {}));
      var EnemyType;
      (function(EnemyType) {
        EnemyType[EnemyType["MIN"] = 0] = "MIN";
        EnemyType[EnemyType["NORMAL"] = 0] = "NORMAL";
        EnemyType[EnemyType["SPEED"] = 1] = "SPEED";
        EnemyType[EnemyType["STRONG"] = 2] = "STRONG";
        EnemyType[EnemyType["MAX"] = 2] = "MAX";
      })(EnemyType = TankBettle.EnemyType || (TankBettle.EnemyType = {}));
      var TankConfig = function() {
        function TankConfig() {
          this.distance = 5;
          this.time = .1;
          this.bulletDistance = 10;
          this.bulletTime = .1;
          this.live = 1;
          this.shootInterval = {
            min: 2,
            max: 5
          };
          this.changeInterval = {
            min: 4,
            max: 10
          };
        }
        return TankConfig;
      }();
      TankBettle.TankConfig = TankConfig;
      var EnemyBornPosition;
      (function(EnemyBornPosition) {
        EnemyBornPosition[EnemyBornPosition["MIN"] = 0] = "MIN";
        EnemyBornPosition[EnemyBornPosition["LEFT"] = 0] = "LEFT";
        EnemyBornPosition[EnemyBornPosition["MIDDLE"] = 1] = "MIDDLE";
        EnemyBornPosition[EnemyBornPosition["RIGHT"] = 2] = "RIGHT";
        EnemyBornPosition[EnemyBornPosition["MAX"] = 2] = "MAX";
      })(EnemyBornPosition = TankBettle.EnemyBornPosition || (TankBettle.EnemyBornPosition = {}));
      var PropsType;
      (function(PropsType) {
        PropsType[PropsType["MIN"] = 0] = "MIN";
        PropsType[PropsType["LIVE"] = 0] = "LIVE";
        PropsType[PropsType["TIME"] = 1] = "TIME";
        PropsType[PropsType["STRONG_BULLET"] = 2] = "STRONG_BULLET";
        PropsType[PropsType["BOOM_ALL_ENEMY"] = 3] = "BOOM_ALL_ENEMY";
        PropsType[PropsType["STRONG_MY_SELF"] = 4] = "STRONG_MY_SELF";
        PropsType[PropsType["GOD"] = 5] = "GOD";
        PropsType[PropsType["MAX"] = 6] = "MAX";
      })(PropsType = TankBettle.PropsType || (TankBettle.PropsType = {}));
      var AUDIO_PATH;
      (function(AUDIO_PATH) {
        AUDIO_PATH["START"] = "audio/start";
        AUDIO_PATH["MOVE"] = "audio/move";
        AUDIO_PATH["ATTACK"] = "audio/attack";
        AUDIO_PATH["PROP"] = "audio/prop";
        AUDIO_PATH["BULLETCRACK"] = "audio/bulletCrack";
        AUDIO_PATH["PLAYERCRACK"] = "audio/playerCrack";
        AUDIO_PATH["ENEMYCRACK"] = "audio/tankCrack";
      })(AUDIO_PATH = TankBettle.AUDIO_PATH || (TankBettle.AUDIO_PATH = {}));
      TankBettle.PROPS_DISAPPEAR = 10;
      TankBettle.PROPS_CREATE_INTERVAL = {
        min: 10,
        max: 20
      };
      var TankBettleGameData = function(_super) {
        __extends(TankBettleGameData, _super);
        function TankBettleGameData() {
          var _this = null !== _super && _super.apply(this, arguments) || this;
          _this.gameMap = null;
          _this.gamePrefabs = null;
          _this._isSingle = true;
          _this._gameStatus = GAME_STATUS.UNKNOWN;
          _this.isNeedReducePlayerLive = true;
          _this.currentLevel = 0;
          _this.curLeftEnemy = 0;
          _this.playerOneLive = 0;
          _this.playerTwoLive = 0;
          return _this;
        }
        TankBettleGameData.Instance = function() {
          return this._instance || (this._instance = new TankBettleGameData());
        };
        TankBettleGameData.prototype.addGameTime = function() {};
        TankBettleGameData.prototype.onLanguageChange = function() {
          var lan = TankBattleLanguageZH_1.TANK_LAN_ZH;
          Manager_1.Manager.language.getLanguage() == TankBattleLanguageEN_1.TANK_LAN_EN.language && (lan = TankBattleLanguageEN_1.TANK_LAN_EN);
          LanguageImpl_1.i18n["" + this.bundle] = {};
          LanguageImpl_1.i18n["" + this.bundle] = lan.data;
        };
        Object.defineProperty(TankBettleGameData.prototype, "bulletPrefab", {
          get: function() {
            return this.gamePrefabs.getChildByName("bullet");
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(TankBettleGameData.prototype, "bundle", {
          get: function() {
            return "tankBattle";
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(TankBettleGameData.prototype, "animationPrefab", {
          get: function() {
            return this.gamePrefabs.getChildByName("tank_animations");
          },
          enumerable: false,
          configurable: true
        });
        TankBettleGameData.prototype.getPlayerPrefab = function(isOne) {
          return isOne ? this.gamePrefabs.getChildByName("player_1") : this.gamePrefabs.getChildByName("player_2");
        };
        TankBettleGameData.prototype.getEnemyPrefab = function(type) {
          return this.gamePrefabs.getChildByName("tank_" + type);
        };
        TankBettleGameData.prototype.getPropsPrefab = function(type) {
          return this.gamePrefabs.getChildByName("item_" + type);
        };
        Object.defineProperty(TankBettleGameData.prototype, "isSingle", {
          get: function() {
            return this._isSingle;
          },
          set: function(value) {
            this._isSingle = value;
            if (value) {
              this.playerOneLive = TankBettle.MAX_PLAYER_LIVE;
              this.playerTwoLive = 0;
            } else {
              this.playerOneLive = TankBettle.MAX_PLAYER_LIVE;
              this.playerTwoLive = TankBettle.MAX_PLAYER_LIVE;
            }
            this.curLeftEnemy = TankBettle.MAX_ENEMY;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(TankBettleGameData.prototype, "gameStatus", {
          get: function() {
            return this._gameStatus;
          },
          set: function(status) {
            cc.log("gamestatus : " + this._gameStatus + " => " + status);
            this._gameStatus = status;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(TankBettleGameData.prototype, "gameView", {
          get: function() {
            return Manager_1.Manager.gameView;
          },
          enumerable: false,
          configurable: true
        });
        TankBettleGameData.prototype.reducePlayerLive = function(isOne) {
          this.isNeedReducePlayerLive && (isOne ? this.playerOneLive-- : this.playerTwoLive--);
        };
        TankBettleGameData.prototype.addPlayerLive = function(isOne) {
          isOne ? this.playerOneLive++ : this.playerTwoLive++;
          this.updateGameInfo();
        };
        TankBettleGameData.prototype.clear = function() {
          _super.prototype.clear.call(this);
          this._isSingle = true;
          this.currentLevel = 0;
          this.playerOneLive = 0;
          this.playerTwoLive = 0;
          this.curLeftEnemy = 0;
        };
        TankBettleGameData.prototype.getEnemyConfig = function(type) {
          var config = new TankConfig();
          type == EnemyType.STRONG ? config.live = 3 : type == EnemyType.SPEED && (config.distance *= 2);
          return config;
        };
        Object.defineProperty(TankBettleGameData.prototype, "playerConfig", {
          get: function() {
            var config = new TankConfig();
            config.time = .05;
            return config;
          },
          enumerable: false,
          configurable: true
        });
        TankBettleGameData.prototype.enterGame = function() {
          this.gameStatus = GAME_STATUS.INIT;
          Manager_1.Manager.uiManager.open({
            bundle: this.bundle,
            type: TankBattleChangeStageView_1.default,
            zIndex: Config_1.ViewZOrder.UI,
            args: [ this.currentLevel ]
          });
        };
        TankBettleGameData.prototype.enterStart = function() {
          this.gameStatus = GAME_STATUS.SELECTED;
          Manager_1.Manager.uiManager.open({
            type: TankBattleStartView_1.default,
            bundle: this.bundle,
            zIndex: Config_1.ViewZOrder.UI
          });
        };
        TankBettleGameData.prototype.nextLevel = function() {
          var level = this.currentLevel + 1;
          level >= TankBattleLevel_1.MapLevel.length && (level = 0);
          this.curLeftEnemy = TankBettle.MAX_ENEMY;
          this.currentLevel = level;
          this.enterGame();
        };
        TankBettleGameData.prototype.prevLevel = function() {
          var level = this.currentLevel - 1;
          level < 0 && (level = TankBattleLevel_1.MapLevel.length - 1);
          this.currentLevel = level;
          this.curLeftEnemy = TankBettle.MAX_ENEMY;
          this.enterGame();
        };
        TankBettleGameData.prototype.showMap = function(level) {
          if (!this.gameMap) {
            cc.error("\u5730\u56fe\u672a\u521d\u59cb\u5316");
            return;
          }
          this.gameMap.setLevel(level);
          if (this.isSingle) {
            this.reducePlayerLive(true);
            this.gameMap.addPlayer(true);
          } else {
            this.reducePlayerLive(true);
            this.reducePlayerLive(false);
            this.gameMap.addPlayer(true);
            this.gameMap.addPlayer(false);
          }
          this.isNeedReducePlayerLive = true;
          this.updateGameInfo();
          this.gameStatus = GAME_STATUS.GAME;
          this.gameMap.startCreateProps();
        };
        TankBettleGameData.prototype.gameOver = function() {
          if (this.gameStatus == GAME_STATUS.OVER) return;
          this.gameStatus = GAME_STATUS.OVER;
          Manager_1.Manager.uiManager.open({
            type: TankBattleGameOver_1.default,
            bundle: this.bundle,
            zIndex: Config_1.ViewZOrder.UI
          });
          this.gameMap.gameOver();
        };
        TankBettleGameData.prototype.updateGameInfo = function() {
          this.gameView.showGameInfo();
        };
        TankBettleGameData.prototype.playPropsAudio = function() {
          this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.PROP, this.bundle, false);
        };
        TankBettleGameData.prototype.playAttackAudio = function() {
          this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.ATTACK, this.bundle, false);
        };
        TankBettleGameData.prototype.bulletCrackAudio = function() {
          this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.BULLETCRACK, this.bundle, false);
        };
        TankBettleGameData.prototype.playerCrackAudio = function() {
          this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.PLAYERCRACK, this.bundle, false);
        };
        TankBettleGameData.prototype.enemyCrackAudio = function() {
          this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.ENEMYCRACK, this.bundle, false);
        };
        TankBettleGameData._instance = null;
        return TankBettleGameData;
      }(GameData_1.GameData);
      TankBettle.TankBettleGameData = TankBettleGameData;
      TankBettle.gameData = Singleton_1.getSingleton(TankBettleGameData);
    })(TankBettle = exports.TankBettle || (exports.TankBettle = {}));
    cc._RF.pop();
  }, {
    "../../../../script/common/base/GameData": void 0,
    "../../../../script/common/config/Config": void 0,
    "../../../../script/common/language/LanguageImpl": void 0,
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/framework/base/Singleton": void 0,
    "../view/TankBattleChangeStageView": "TankBattleChangeStageView",
    "../view/TankBattleGameOver": "TankBattleGameOver",
    "../view/TankBattleStartView": "TankBattleStartView",
    "./TankBattleLanguageEN": "TankBattleLanguageEN",
    "./TankBattleLanguageZH": "TankBattleLanguageZH",
    "./TankBattleLevel": "TankBattleLevel"
  } ],
  TankBattleGameOver: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ef01fuOr29Czogi6/FlMHdw", "TankBattleGameOver");
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
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var TankBattleGameData_1 = require("../data/TankBattleGameData");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TankBattleGameOver = function(_super) {
      __extends(TankBattleGameOver, _super);
      function TankBattleGameOver() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      TankBattleGameOver.getPrefabUrl = function() {
        return "prefabs/TankBattleGameOver";
      };
      TankBattleGameOver.prototype.onLoad = function() {
        var _this = this;
        _super.prototype.onLoad.call(this);
        this.content = cc.find("content", this.node);
        var title = cc.find("title", this.content);
        title.getComponent(cc.Label).language = Manager_1.Manager.makeLanguage("gameOver", this.bundle);
        cc.tween(title).set({
          y: this.node.height / 2
        }).to(1, {
          y: 0
        }).delay(2).call(function() {
          _this.close();
          TankBattleGameData_1.TankBettle.gameData.gameMap.clear();
          TankBattleGameData_1.TankBettle.gameData.enterStart();
        }).start();
      };
      TankBattleGameOver = __decorate([ ccclass ], TankBattleGameOver);
      return TankBattleGameOver;
    }(UIView_1.default);
    exports.default = TankBattleGameOver;
    cc._RF.pop();
  }, {
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/framework/ui/UIView": void 0,
    "../data/TankBattleGameData": "TankBattleGameData"
  } ],
  TankBattleGameView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4c9f0EnOj5NvKup1r5Szrhw", "TankBattleGameView");
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
    var TankBattleStartView_1 = require("./TankBattleStartView");
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var TankBattleMap_1 = require("../model/TankBattleMap");
    var TankBattleGameData_1 = require("../data/TankBattleGameData");
    var GameView_1 = require("../../../../script/common/base/GameView");
    var Decorators_1 = require("../../../../script/framework/decorator/Decorators");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TankBattleGameView = function(_super) {
      __extends(TankBattleGameView, _super);
      function TankBattleGameView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._enemyTankCount = null;
        _this._enemyTankPrefab = null;
        _this._playerOneLive = null;
        _this._playerTwoLive = null;
        _this._gameLevel = null;
        _this._instructions = null;
        _this._playerOneTankLive = null;
        _this._playerTwoTankLive = null;
        return _this;
      }
      Object.defineProperty(TankBattleGameView.prototype, "presenter", {
        get: function() {
          return this.presenterAny;
        },
        enumerable: false,
        configurable: true
      });
      TankBattleGameView.getPrefabUrl = function() {
        return "prefabs/TankBattleGameView";
      };
      TankBattleGameView.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(TankBattleGameData_1.TankBettle.EVENT.SHOW_MAP_LEVEL, this.onShowMapLevel);
      };
      TankBattleGameView.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        cc.director.getCollisionManager().enabled = true;
        this.init();
        LogicEvent_1.dispatchEnterComplete({
          type: LogicEvent_1.LogicType.GAME,
          views: [ this, TankBattleStartView_1.default ]
        });
      };
      TankBattleGameView.prototype.onDestroy = function() {
        this.presenter.gameMap = null;
        this.presenter.gamePrefabs = null;
        _super.prototype.onDestroy.call(this);
      };
      TankBattleGameView.prototype.init = function() {
        this.presenter.enterStart();
        var prefabs = cc.find("prefabs", this.node);
        this.presenter.gamePrefabs = prefabs;
        var game = cc.find("Game", this.node);
        this.presenter.gameMap = game.addComponent(TankBattleMap_1.default);
        this.presenter.gameMap.owner = this;
        this.presenter.gameMap.setPrefabs(prefabs);
        var gameInfo = cc.find("Info", this.node);
        this._enemyTankCount = cc.find("enemy_count", gameInfo);
        this._enemyTankPrefab = cc.find("enemy_tank_prefab", gameInfo);
        this._playerOneLive = cc.find("player_count_1", gameInfo).getComponent(cc.Label);
        this._playerTwoLive = cc.find("player_count_2", gameInfo).getComponent(cc.Label);
        this._playerOneTankLive = cc.find("player_live_1", gameInfo).getComponent(cc.Label);
        this._playerTwoTankLive = cc.find("player_live_2", gameInfo).getComponent(cc.Label);
        this._gameLevel = cc.find("level", gameInfo).getComponent(cc.Label);
        this._instructions = cc.find("Instructions", this.node).getComponent(cc.Label);
        this._instructions.language = Manager_1.Manager.makeLanguage("Instructions", this.bundle);
        this.setEnabledKeyBack(true);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      };
      TankBattleGameView.prototype.onKeyUp = function(ev) {
        this.presenter.gameMap && this.presenter.gameMap.onKeyUp(ev);
        if (ev.keyCode == cc.macro.KEY.n) {
          this.presenter.isSingle = this.presenter.isSingle;
          this.presenter.nextLevel();
        } else if (ev.keyCode == cc.macro.KEY.p) {
          this.presenter.isSingle = this.presenter.isSingle;
          this.presenter.prevLevel();
        } else if (ev.keyCode == cc.macro.KEY.escape) {
          ev.stopPropagation();
          this.presenter.gameMap.clear();
          this.presenter.enterStart();
        }
      };
      TankBattleGameView.prototype.onKeyDown = function(ev) {
        this.presenter.gameMap && this.presenter.gameMap.onKeyDown(ev);
      };
      TankBattleGameView.prototype.onShowMapLevel = function(data) {
        this.presenter.showMap(data);
        this.audioHelper.playMusic(TankBattleGameData_1.TankBettle.AUDIO_PATH.START, this.bundle, false);
      };
      TankBattleGameView.prototype.showGameInfo = function() {
        this._gameLevel.string = (this.presenter.currentLevel + 1).toString();
        this._playerOneLive.string = (this.presenter.playerOneLive < 0 ? 0 : this.presenter.playerOneLive).toString();
        this._playerTwoLive.string = (this.presenter.playerTwoLive < 0 ? 0 : this.presenter.playerTwoLive).toString();
        this.presenter.gameMap.playerOne && this.presenter.gameMap.playerOne.config.live > 0 ? this._playerOneTankLive.string = "-" + this.presenter.gameMap.playerOne.config.live : this._playerOneTankLive.string = "";
        this.presenter.gameMap.playerTwo && this.presenter.gameMap.playerTwo.config.live > 0 ? this._playerTwoTankLive.string = "-" + this.presenter.gameMap.playerTwo.config.live : this._playerTwoTankLive.string = "";
        var count = this._enemyTankCount.children.length;
        if (count < this.presenter.curLeftEnemy) {
          var addCount = this.presenter.curLeftEnemy - count;
          for (var i = 0; i < addCount; i++) {
            var tank = cc.instantiate(this._enemyTankPrefab);
            this._enemyTankCount.addChild(tank);
          }
        } else if (count > this.presenter.curLeftEnemy) {
          var delCount = count - this.presenter.curLeftEnemy;
          for (var i = 0; i < delCount; i++) this._enemyTankCount.removeChild(this._enemyTankCount.children[0]);
        }
      };
      TankBattleGameView = __decorate([ ccclass, Decorators_1.injectPresenter(TankBattleGameData_1.TankBettle.TankBettleGameData) ], TankBattleGameView);
      return TankBattleGameView;
    }(GameView_1.default);
    exports.default = TankBattleGameView;
    cc._RF.pop();
  }, {
    "../../../../script/common/base/GameView": void 0,
    "../../../../script/common/event/LogicEvent": void 0,
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/framework/decorator/Decorators": void 0,
    "../data/TankBattleGameData": "TankBattleGameData",
    "../model/TankBattleMap": "TankBattleMap",
    "./TankBattleStartView": "TankBattleStartView"
  } ],
  TankBattleLanguageEN: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1d569Hx5QZFQ5W86JJQCXDm", "TankBattleLanguageEN");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TANK_LAN_EN = void 0;
    exports.TANK_LAN_EN = {
      language: cc.sys.LANGUAGE_ENGLISH,
      data: {
        title: "BATTLE\nCITY",
        player: "1  PLAYER ",
        players: "2  PLAYERS",
        tips: "The current game does not support touch operation",
        stage: "Stage {0}",
        Instructions: "\nInstructions:\n\nPlayer 1:\nwasd up left down right \nspace shoot\n        \nPlayer 2:\n\u2193\u2191\u2190\u2192\nenter shoot\n        \nn Next level\np Prev level",
        gameOver: "GAME OVER"
      }
    };
    cc._RF.pop();
  }, {} ],
  TankBattleLanguageZH: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1099dpVFz5GWJ7OO+wPVfUz", "TankBattleLanguageZH");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TANK_LAN_ZH = void 0;
    exports.TANK_LAN_ZH = {
      language: cc.sys.LANGUAGE_CHINESE,
      data: {
        title: "\u5766\u514b\u5927\u6218",
        player: "\u5355\u4eba\u6a21\u5f0f ",
        players: "\u53cc\u4eba\u6a21\u5f0f",
        tips: "\u5f53\u524d\u6e38\u620f\u4e0d\u652f\u6301\u89e6\u6478\u64cd\u4f5c",
        stage: "\u7b2c {0} \u5173",
        Instructions: "\n\u64cd\u4f5c\u8bf4\u660e\uff1a\n\n\u73a9\u5bb61\uff1a\nwsad \u4e0a\u4e0b\u5de6\u53f3 \n\u7a7a\u683c\u952e \u5c04\u51fb\n\n\u73a9\u5bb62\uff1a\n\u65b9\u5411\u952e\n\u56de\u8f66\u952e \u5c04\u51fb\n\nn \u4e0b\u4e00\u5173\np \u4e0a\u4e00\u5173",
        gameOver: "\u6e38\u620f\u7ed3\u675f"
      }
    };
    cc._RF.pop();
  }, {} ],
  TankBattleLevel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9dc1eDoGRZMt69ZKMBxwkp8", "TankBattleLevel");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.MapLevel = void 0;
    var Level1 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1 ], [ 2, 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 2, 2 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];
    var Level2 = [ [ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0 ], [ 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 1, 1, 3, 3, 1, 1, 2, 2 ], [ 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 1, 1, 3, 3, 1, 1, 2, 2 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2, 2, 0, 0, 3, 3, 0, 0, 0, 0 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2, 2, 0, 0, 3, 3, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 2, 2, 0, 0, 0, 0, 3, 3, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 2, 2, 0, 0, 0, 0, 3, 3, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 2, 2, 1, 1, 0, 0, 2, 2, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 2, 2, 1, 1, 0, 0, 2, 2, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0 ] ];
    var Level3 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2 ], [ 0, 0, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 3, 3, 0, 0 ], [ 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 3, 3, 0, 0 ], [ 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 1, 1, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 1, 1, 1, 1, 0, 0, 2, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ] ];
    var Level4 = [ [ 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0 ], [ 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 3 ], [ 3, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2 ], [ 3, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ], [ 2, 2, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0 ], [ 4, 4, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 4, 4, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 4, 4, 4, 4 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 4, 4, 4, 4 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 3, 3 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3 ], [ 3, 3, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 3, 3, 3, 3 ], [ 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3 ], [ 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 3, 3, 3, 3, 2, 2 ], [ 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 3, 3, 3, 3, 2, 0 ] ];
    var Level5 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0 ], [ 2, 2, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0 ], [ 2, 2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 2, 2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4 ], [ 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 1, 1, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 1, 1, 1, 1 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 4, 4, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 0, 0, 0, 0, 4, 4, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0 ], [ 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 0, 0, 2, 2, 0, 0, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0 ], [ 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 0, 0, 2, 2, 0, 0, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];
    var Level6 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 1, 3, 3 ], [ 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 1, 3, 3 ], [ 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 3, 3, 1, 0, 0, 1, 3, 3 ], [ 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 3, 3, 1, 0, 0, 1, 3, 3 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 1, 1, 3, 3, 0, 0, 1, 1, 3, 3 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 1, 1, 3, 3, 0, 0, 1, 1, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 1, 1, 0, 0, 1, 1, 2, 0, 0, 0, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 3, 3, 3, 3 ], [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 3, 3, 1, 1, 3, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1 ], [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 3, 3, 1, 1, 3, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 0, 1, 1, 1, 1, 1, 2, 2 ], [ 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2 ], [ 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3 ], [ 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3 ] ];
    var Level7 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0 ], [ 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0 ], [ 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0 ], [ 0, 0, 2, 2, 0, 0, 3, 3, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 2, 2, 0, 0, 3, 3, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0, 0 ], [ 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0, 0 ], [ 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 3, 3, 0, 0, 0, 0, 2, 2, 0, 0 ], [ 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 3, 3, 0, 0, 0, 0, 2, 2, 0, 0 ], [ 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0 ], [ 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0 ], [ 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];
    var Level8 = [ [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0 ], [ 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0 ], [ 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0 ], [ 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0 ], [ 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4 ], [ 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 3, 3, 1, 1, 0, 0, 0, 0, 1, 1 ], [ 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 3, 3, 1, 1, 2, 2, 2, 2, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0 ], [ 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4 ], [ 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4 ], [ 3, 3, 3, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 3, 3, 3, 3, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 3, 3, 3, 3, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 3, 3, 3, 3, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 2, 1, 1, 1, 1, 0, 0 ], [ 3, 3, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 3, 3, 2, 2, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ] ];
    var Level9 = [ [ 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 0, 0, 0, 0 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 2, 2, 2, 2, 0, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 0, 2, 2, 2, 2, 0, 0, 0, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 2, 2, 2, 2, 0, 0, 0, 2, 2, 3, 3, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 3, 3, 0, 0, 3, 3, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0 ], [ 2, 2, 1, 1, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 3, 3, 2, 2 ], [ 2, 2, 1, 1, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 3, 3, 2, 2 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 3, 3, 0, 0, 3, 3, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 0, 0, 3, 3, 2, 2, 3, 3, 0, 0, 3, 3, 2, 2, 3, 3, 0, 0, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 0, 0, 3, 3, 2, 2, 3, 3, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0, 0, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ] ];
    var Level10 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0 ], [ 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0 ], [ 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1 ], [ 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0, 1 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0, 1 ], [ 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3, 2, 2, 2, 2, 3, 3, 1, 1, 1, 0, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3, 2, 2, 2, 2, 3, 3, 1, 1, 1, 0, 0, 0, 1, 1 ], [ 0, 1, 0, 0, 0, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1 ], [ 0, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 0, 0, 1, 1, 0, 0, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 0, 0, 1, 1, 0, 0, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ], [ 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1 ], [ 1, 1, 3, 3, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1, 1 ], [ 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1 ], [ 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1 ], [ 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 1, 1, 1, 1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ] ];
    var Level11 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 2, 2 ], [ 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 3, 3, 3, 3, 0, 0, 2, 2 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0 ], [ 2, 2, 1, 1, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0 ], [ 2, 2, 1, 1, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0 ], [ 0, 1, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 0, 1, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 4, 4, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0 ], [ 0, 0, 4, 4, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0 ], [ 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0 ], [ 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 3, 3, 3, 3, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];
    var Level12 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1 ], [ 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 1, 1, 0, 0, 2, 2, 2, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 4, 4, 0, 0, 1, 1, 0, 0, 2, 2, 2, 0, 1, 1, 0, 0 ], [ 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 1, 1, 1, 1, 0, 0 ], [ 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 1, 1, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 4, 4, 0, 0, 0, 0, 0, 0, 4, 4, 2, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 4, 4, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0 ], [ 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 1, 1, 1, 1, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0 ], [ 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 1, 1, 1, 1, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0 ], [ 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0 ], [ 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];
    var Level13 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0 ], [ 0, 0, 2, 2, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1 ], [ 0, 0, 2, 2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1 ], [ 0, 0, 1, 1, 0, 0, 1, 0, 3, 3, 0, 0, 2, 2, 0, 0, 3, 3, 0, 1, 0, 0, 2, 2, 1, 1 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 0, 1, 0, 0, 2, 2, 1, 1 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 2, 2, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1 ], [ 1, 1, 2, 2, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 1, 1 ], [ 1, 1, 2, 2, 0, 0, 1, 0, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 0, 1, 0, 0, 1, 1, 0, 0 ], [ 1, 1, 2, 2, 0, 0, 1, 0, 3, 3, 0, 0, 2, 2, 0, 0, 3, 3, 0, 1, 0, 0, 1, 1, 0, 0 ], [ 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 2, 0, 0 ], [ 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 2, 2, 0, 0 ], [ 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2 ], [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2 ], [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ], [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];
    var Level14 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3 ], [ 3, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 3, 3 ], [ 3, 3, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 0, 0, 0, 0, 0, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 3, 3, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 3, 3 ], [ 3, 3, 0, 0, 0, 0, 1, 1, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 3, 3 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3 ], [ 4, 4, 4, 4, 4, 4, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 4, 4, 4, 4, 4, 4 ], [ 4, 4, 4, 4, 4, 4, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 4, 4, 4, 4, 4, 4 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0 ], [ 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0 ], [ 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1 ], [ 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1 ], [ 2, 0, 2, 0, 2, 0, 0, 2, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 2 ], [ 2, 0, 2, 0, 2, 0, 0, 2, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 2 ] ];
    var Level15 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 3, 3, 2, 2, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 2, 2 ], [ 3, 3, 0, 0, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 2, 2 ], [ 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 1, 1, 2, 0, 1, 1, 0, 0 ], [ 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 3, 3, 3, 3, 1, 1, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 3, 3, 3, 3, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 0, 3, 3, 3, 3 ], [ 0, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 1, 1, 1, 0, 3, 3 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 2, 2, 1, 1, 0, 0, 3, 3, 3, 3, 1, 1, 1, 0, 3, 3 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 3, 3 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 3, 3, 3, 3, 1, 1, 0, 0, 0, 0, 3, 3 ], [ 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 3, 3, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 3, 3 ], [ 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 3, 3, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 1, 1, 3, 3, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 0, 1, 1, 1, 1, 0, 1, 1, 3, 3, 0, 0, 3, 3, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0 ] ];
    var Level16 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 2, 2, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 2, 2, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 2, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 2, 2 ], [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 2, 2 ], [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3 ], [ 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3 ], [ 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 1, 9, 8, 1, 0, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3 ], [ 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 1, 8, 8, 1, 0, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3 ] ];
    var Level17 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0 ], [ 3, 3, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 3, 3, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 3, 3, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 3, 3, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0 ], [ 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 1, 0 ], [ 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 1, 1, 1, 0 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0 ], [ 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ], [ 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2 ], [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2 ], [ 2, 2, 0, 0, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2 ], [ 2, 2, 0, 0, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2 ], [ 0, 0, 2, 2, 1, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 0 ], [ 0, 0, 2, 2, 1, 1, 0, 0, 2, 2, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];
    var Level18 = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 3, 3, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0 ], [ 1, 1, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 0, 0 ], [ 1, 1, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 0, 0 ], [ 0, 0, 1, 1, 3, 3, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 1, 1, 2, 2, 2, 2, 0, 0 ], [ 0, 0, 1, 1, 3, 3, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 1, 1, 2, 2, 2, 2, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 2, 2, 1, 1, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 2, 2, 1, 1, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1, 1, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1, 1, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 1, 1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 1, 1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 1, 1, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 1, 1, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 2, 2, 2, 2, 2, 2, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 2, 2, 2, 2, 2, 2, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ], [ 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 0, 0, 0, 0 ], [ 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 0, 0, 0, 0 ], [ 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 0, 0 ], [ 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 0, 0 ], [ 3, 3, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2 ], [ 3, 3, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2 ] ];
    var Level19 = [ [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 ], [ 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 3, 3, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3 ], [ 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 3, 3, 0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];
    var Level20 = [ [ 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 2, 2, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 1, 1, 2, 2, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0 ], [ 2, 2, 0, 0, 1, 1, 4, 4, 0, 0, 2, 2, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 4, 4, 0, 0, 2, 2, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 4, 4, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 1, 4, 4, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 0, 0, 1, 1, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 1, 1, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 1, 1 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 4, 4, 0, 0, 2, 2, 2, 2 ], [ 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 0, 0, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 0, 0, 1, 1, 1, 1 ], [ 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 4, 4, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 4, 4, 0, 0, 1, 1, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 4, 4, 0, 0, 3, 3, 0, 0 ], [ 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 4, 4, 0, 0, 3, 3, 0, 0 ], [ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 4, 4, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 4, 4, 0, 0, 3, 3, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 4, 4, 0, 0, 3, 3, 0, 0 ] ];
    var Level21 = [ [ 0, 0, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ], [ 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 2, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 3 ], [ 4, 0, 2, 4, 1, 1, 4, 1, 3, 3, 3, 4, 3, 0, 2, 4, 2, 2, 4, 0, 0, 0, 3, 3, 3, 3 ], [ 4, 0, 2, 4, 4, 4, 4, 0, 3, 0, 0, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 3, 2, 0, 0 ], [ 4, 0, 2, 0, 3, 3, 3, 3, 3, 2, 2, 2, 3, 2, 2, 5, 5, 5, 5, 5, 0, 4, 3, 2, 0, 0 ], [ 4, 4, 4, 0, 3, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 5, 0, 1, 0, 0, 0, 4, 3, 2, 0, 4 ], [ 0, 0, 4, 0, 3, 0, 0, 0, 2, 4, 4, 4, 4, 4, 3, 5, 3, 3, 3, 0, 0, 4, 3, 2, 0, 4 ], [ 0, 0, 4, 1, 3, 0, 0, 0, 2, 4, 0, 5, 5, 5, 5, 5, 1, 1, 3, 0, 0, 4, 4, 4, 4, 4 ], [ 0, 3, 4, 3, 3, 1, 0, 0, 3, 4, 3, 5, 3, 4, 0, 0, 1, 1, 3, 3, 3, 3, 3, 2, 0, 4 ], [ 0, 3, 4, 0, 1, 0, 1, 0, 3, 4, 0, 5, 3, 4, 4, 4, 4, 3, 3, 3, 1, 1, 0, 2, 0, 4 ], [ 4, 4, 4, 0, 1, 4, 4, 4, 4, 4, 0, 5, 1, 1, 0, 0, 4, 1, 0, 3, 1, 1, 0, 2, 4, 4 ], [ 4, 3, 2, 0, 1, 0, 1, 0, 5, 5, 5, 5, 1, 0, 1, 2, 4, 3, 3, 3, 3, 3, 2, 2, 4, 0 ], [ 4, 3, 2, 1, 1, 1, 0, 0, 5, 1, 1, 3, 1, 1, 0, 2, 4, 1, 0, 3, 1, 3, 0, 0, 4, 0 ], [ 4, 3, 2, 1, 1, 0, 0, 0, 5, 0, 1, 3, 1, 0, 4, 4, 4, 3, 4, 4, 4, 3, 0, 0, 4, 0 ], [ 4, 3, 3, 3, 3, 3, 0, 0, 5, 3, 3, 3, 1, 0, 4, 3, 0, 1, 4, 0, 4, 4, 4, 3, 4, 0 ], [ 4, 0, 2, 0, 1, 5, 5, 5, 5, 4, 4, 0, 1, 0, 4, 3, 2, 2, 4, 2, 0, 1, 4, 3, 4, 4 ], [ 4, 0, 2, 1, 1, 5, 4, 1, 3, 1, 4, 1, 1, 1, 4, 3, 0, 1, 4, 2, 0, 1, 4, 3, 0, 4 ], [ 4, 4, 4, 4, 1, 5, 4, 0, 3, 3, 4, 3, 3, 3, 4, 3, 0, 1, 4, 2, 0, 1, 4, 3, 0, 4 ], [ 0, 0, 2, 4, 1, 5, 4, 0, 3, 0, 4, 4, 4, 4, 4, 0, 0, 1, 4, 2, 0, 1, 4, 4, 3, 4 ], [ 0, 1, 5, 5, 5, 5, 4, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 1, 4, 3, 3, 3, 3, 4, 0, 4 ], [ 0, 0, 5, 4, 4, 4, 4, 3, 3, 0, 0, 0, 3, 3, 3, 3, 3, 1, 4, 4, 4, 0, 3, 4, 0, 4 ], [ 0, 0, 5, 0, 1, 3, 5, 0, 3, 0, 0, 0, 3, 1, 1, 1, 3, 1, 0, 3, 4, 0, 3, 4, 3, 4 ], [ 5, 5, 5, 0, 1, 3, 5, 0, 3, 0, 2, 2, 3, 2, 2, 0, 3, 0, 0, 3, 4, 0, 0, 4, 4, 4 ], [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 4, 4, 3, 3, 3, 3, 3, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 9, 8, 1, 0, 0, 0, 4, 4, 0, 0, 3, 3, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 8, 1, 0, 0, 0, 4, 4, 0, 0, 3, 3, 0, 0 ] ];
    exports.MapLevel = [ Level1, Level2, Level3, Level4, Level5, Level6, Level7, Level8, Level9, Level10, Level11, Level12, Level13, Level14, Level15, Level16, Level17, Level18, Level19, Level20, Level21 ];
    cc._RF.pop();
  }, {} ],
  TankBattleLogic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e253dm7SeBI7byRtH5JQMZE", "TankBattleLogic");
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
    var LobbyService_1 = require("../../../script/common/net/LobbyService");
    var ResourceLoader_1 = require("../../../script/framework/assetManager/ResourceLoader");
    var Manager_1 = require("../../../script/common/manager/Manager");
    var TankBattleGameView_1 = require("./view/TankBattleGameView");
    var TankBattleGameData_1 = require("./data/TankBattleGameData");
    var TankBattleNetController_1 = require("./controller/TankBattleNetController");
    var TankBattleLogic = function(_super) {
      __extends(TankBattleLogic, _super);
      function TankBattleLogic() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.logicType = LogicEvent_1.LogicType.GAME;
        return _this;
      }
      TankBattleLogic.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
      };
      TankBattleLogic.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(LogicEvent_1.LogicEvent.ENTER_GAME, this.onEnterGame);
        this.registerEvent(LogicEvent_1.LogicEvent.ENTER_ROOM_LIST, this.onEnterRoomList);
      };
      Object.defineProperty(TankBattleLogic.prototype, "bundle", {
        get: function() {
          return TankBattleGameData_1.TankBettle.gameData.bundle;
        },
        enumerable: false,
        configurable: true
      });
      TankBattleLogic.prototype.onEnterComplete = function(data) {
        _super.prototype.onEnterComplete.call(this, data);
        if (data.type == this.logicType) ; else {
          this.removeNetComponent();
          this._loader.unLoadResources();
        }
      };
      TankBattleLogic.prototype.onEnterRoomList = function(data) {};
      TankBattleLogic.prototype.onLoadResourceComplete = function(err) {
        if (err == ResourceLoader_1.ResourceLoaderError.LOADING) return;
        cc.log(this.bundle + "\u8d44\u6e90\u52a0\u8f7d\u5b8c\u6210!!!");
        _super.prototype.onLoadResourceComplete.call(this, err);
        LobbyService_1.LobbyService.instance.resumeMessageQueue();
        Manager_1.Manager.uiManager.open({
          type: TankBattleGameView_1.default,
          bundle: this.bundle
        });
      };
      TankBattleLogic.prototype.getNetControllerType = function() {
        return TankBattleNetController_1.default;
      };
      TankBattleLogic.prototype.onEnterGame = function(data) {
        if (data == this.bundle) {
          Manager_1.Manager.gameData = TankBattleGameData_1.TankBettle.gameData;
          Manager_1.Manager.gameData.clear();
          this.onLanguageChange();
          this.addNetComponent();
          LobbyService_1.LobbyService.instance.pauseMessageQueue();
          this._loader.loadResources();
        } else {
          this.removeNetComponent();
          this._loader.unLoadResources();
        }
      };
      TankBattleLogic.prototype.getLoadResources = function() {
        return [ {
          preloadView: TankBattleGameView_1.default,
          bundle: this.bundle
        } ];
      };
      return TankBattleLogic;
    }(Logic_1.Logic);
    Manager_1.Manager.logicManager.push(TankBattleLogic);
    cc._RF.pop();
  }, {
    "../../../script/common/base/Logic": void 0,
    "../../../script/common/event/LogicEvent": void 0,
    "../../../script/common/manager/Manager": void 0,
    "../../../script/common/net/LobbyService": void 0,
    "../../../script/framework/assetManager/ResourceLoader": void 0,
    "./controller/TankBattleNetController": "TankBattleNetController",
    "./data/TankBattleGameData": "TankBattleGameData",
    "./view/TankBattleGameView": "TankBattleGameView"
  } ],
  TankBattleMap: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "82edc4ZSX5NQZhNyPcR7QJV", "TankBattleMap");
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
    var TankBattleLevel_1 = require("../data/TankBattleLevel");
    var TankBattleGameData_1 = require("../data/TankBattleGameData");
    var TankBattleTank_1 = require("./TankBattleTank");
    var TankBattleBlock_1 = require("./TankBattleBlock");
    var TankBattleProps_1 = require("./TankBattleProps");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TankBattleMap = function(_super) {
      __extends(TankBattleMap, _super);
      function TankBattleMap() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._blockPrefab = null;
        _this.playerOne = null;
        _this.playerTwo = null;
        _this.outWall = [];
        _this.owner = null;
        _this._enemys = [];
        _this._waitEnemy = [];
        _this._heart = null;
        _this.propsProductNode = null;
        _this._waitingDestory = [];
        _this._keyboardEvents = new Map();
        return _this;
      }
      TankBattleMap.prototype.setPrefabs = function(node) {
        this._blockPrefab = node;
      };
      TankBattleMap.prototype.onLoad = function() {
        var _this = this;
        this.node.children.forEach(function(node) {
          _this.outWall.push(node);
        });
        this.node.removeAllChildren(false);
        var node = new cc.Node();
        this.node.addChild(node);
        this.propsProductNode = node;
      };
      TankBattleMap.prototype.onDestroy = function() {
        this.outWall.forEach(function(value) {
          value.destroy();
        });
        this.clear();
        this.outWall = [];
        this.propsProductNode.stopAllActions();
        this.propsProductNode = null;
      };
      TankBattleMap.prototype.update = function() {
        this.addEnemy();
        this.doKeyboardEvents();
      };
      TankBattleMap.prototype.randomEnemyPosition = function(enemyNode) {
        var pos = cc.randomRangeInt(TankBattleGameData_1.TankBettle.EnemyBornPosition.MIN, TankBattleGameData_1.TankBettle.EnemyBornPosition.MAX + 1);
        var outPosition = cc.v3(0, 0, 0);
        var outBornPosition = TankBattleGameData_1.TankBettle.EnemyBornPosition.RIGHT;
        if (0 == pos) {
          outPosition.x = enemyNode.width / 2;
          outPosition.y = -enemyNode.height / 2;
          outBornPosition = TankBattleGameData_1.TankBettle.EnemyBornPosition.LEFT;
        } else if (1 == pos) {
          outPosition.x = this.node.width / 2;
          outPosition.y = -enemyNode.height / 2;
          outBornPosition = TankBattleGameData_1.TankBettle.EnemyBornPosition.MIDDLE;
        } else {
          outPosition.x = this.node.width - enemyNode.width / 2;
          outPosition.y = -enemyNode.height / 2;
          outBornPosition = TankBattleGameData_1.TankBettle.EnemyBornPosition.RIGHT;
        }
        return {
          position: outPosition,
          bornPosition: outBornPosition
        };
      };
      TankBattleMap.prototype.randomEnemyDirction = function(bornPosition) {
        var allDir = [ TankBattleGameData_1.TankBettle.Direction.LEFT, TankBattleGameData_1.TankBettle.Direction.RIGHT, TankBattleGameData_1.TankBettle.Direction.DOWN ];
        bornPosition == TankBattleGameData_1.TankBettle.EnemyBornPosition.LEFT ? allDir = [ TankBattleGameData_1.TankBettle.Direction.DOWN, TankBattleGameData_1.TankBettle.Direction.RIGHT ] : bornPosition == TankBattleGameData_1.TankBettle.EnemyBornPosition.RIGHT && (allDir = [ TankBattleGameData_1.TankBettle.Direction.DOWN, TankBattleGameData_1.TankBettle.Direction.LEFT ]);
        var value = cc.randomRangeInt(0, allDir.length);
        var outDir = allDir[value];
        return outDir;
      };
      TankBattleMap.prototype.addEnemy = function() {
        if (this._waitingDestory.length > 0) return;
        if (TankBattleGameData_1.TankBettle.gameData.gameStatus == TankBattleGameData_1.TankBettle.GAME_STATUS.GAME && TankBattleGameData_1.TankBettle.gameData.curLeftEnemy > 0 && this._enemys.length < TankBattleGameData_1.TankBettle.MAX_APPEAR_ENEMY) {
          var type = cc.randomRangeInt(TankBattleGameData_1.TankBettle.EnemyType.MIN, TankBattleGameData_1.TankBettle.EnemyType.MAX + 1);
          var prefab = TankBattleGameData_1.TankBettle.gameData.getEnemyPrefab(type);
          var randomPos = this.randomEnemyPosition(prefab);
          var enemyNode = this._waitEnemy.shift();
          null == enemyNode && (enemyNode = cc.instantiate(prefab));
          this.node.addChild(enemyNode, TankBattleGameData_1.TankBettle.ZIndex.TANK);
          var enemy = enemyNode.getComponent(TankBattleTank_1.TankBettleTankEnemy);
          enemy || (enemy = enemyNode.addComponent(TankBattleTank_1.TankBettleTankEnemy));
          enemy.type = type;
          enemy.config = TankBattleGameData_1.TankBettle.gameData.getEnemyConfig(type);
          enemyNode.position = randomPos.position;
          enemy.direction = this.randomEnemyDirction(randomPos.bornPosition);
          enemyNode.getComponent(cc.BoxCollider).enabled = false;
          if (this.checkBornPosition(randomPos.position, enemyNode)) {
            enemy.move();
            enemy.startShoot();
            this._enemys.push(enemyNode);
            enemyNode.getComponent(cc.BoxCollider).enabled = true;
            TankBattleGameData_1.TankBettle.gameData.curLeftEnemy -= 1;
            TankBattleGameData_1.TankBettle.gameData.updateGameInfo();
          } else {
            enemyNode.removeFromParent(false);
            this._waitEnemy.push(enemyNode);
          }
        }
      };
      TankBattleMap.prototype.intersects = function(node, other) {
        var box = node.getBoundingBox();
        var otherBox = other.getBoundingBox();
        var scale = 3;
        var width = box.width * scale;
        var height = box.height * scale;
        var newBox = cc.rect(box.x - (width - box.width) / 2, box.y - (height - box.height) / 2, width, height);
        if (newBox.intersects(otherBox)) return true;
        return false;
      };
      TankBattleMap.prototype.checkBornPosition = function(pos, node) {
        var result = true;
        for (var i = 0; i < this._enemys.length; i++) {
          var enemy = this._enemys[i];
          if (this.intersects(enemy, node)) {
            result = false;
            break;
          }
        }
        if (result) {
          if (this.playerOne && this.intersects(node, this.playerOne.node)) return false;
          if (this.playerTwo && this.intersects(node, this.playerTwo.node)) return false;
        }
        return result;
      };
      TankBattleMap.prototype.removeAllEnemy = function() {
        for (var i = 0; i < this._enemys.length; i++) {
          var enemy = this._enemys[i];
          enemy.getComponent(TankBattleTank_1.TankBettleTankEnemy).die();
          this._waitingDestory.push(enemy);
        }
        this._enemys = [];
        this.checkGamePass();
      };
      TankBattleMap.prototype.removeEnemy = function(enemy) {
        var i = this._enemys.length;
        while (i--) if (this._enemys[i] == enemy) {
          enemy.removeFromParent();
          enemy.destroy();
          this._enemys.splice(i, 1);
        }
        i = this._waitingDestory.length;
        while (i--) if (this._waitingDestory[i] == enemy) {
          enemy.removeFromParent();
          enemy.destroy();
          this._waitingDestory.splice(i, 1);
        }
        this.checkGamePass();
      };
      TankBattleMap.prototype.checkGamePass = function() {
        if (TankBattleGameData_1.TankBettle.gameData.curLeftEnemy <= 0 && this._enemys.length <= 0) {
          TankBattleGameData_1.TankBettle.gameData.isNeedReducePlayerLive = false;
          TankBattleGameData_1.TankBettle.gameData.nextLevel();
        }
      };
      TankBattleMap.prototype.setLevel = function(level) {
        var _this = this;
        if (!!!this._blockPrefab) {
          cc.error("\u8bf7\u5148\u8bbe\u7f6e\u9884\u7f6e\u8282\u70b9");
          return;
        }
        this.node.removeAllChildren(true);
        this.outWall.forEach(function(value) {
          _this.node.addChild(cc.instantiate(value));
        });
        this._enemys = [];
        var data = TankBattleLevel_1.MapLevel[level];
        var x = 0;
        var y = 0;
        var tempBlock = this._blockPrefab.getChildByName("block_1");
        var prefebSize = cc.size(tempBlock.width, tempBlock.height);
        for (var i = 0; i < data.length; i++) {
          var element = data[i];
          y = -((i + 1) * prefebSize.height / 2 + i * prefebSize.height / 2);
          for (var j = 0; j < element.length; j++) {
            var blockData = element[j];
            if (blockData > 0 && blockData != TankBattleGameData_1.TankBettle.BLOCK_TYPE.ANOTHREHOME) {
              var name = "block_" + blockData.toString();
              var prefab = this._blockPrefab.getChildByName(name);
              if (prefab) {
                var node = cc.instantiate(prefab);
                var block = node.addComponent(TankBattleBlock_1.default);
                block.type = blockData;
                blockData == TankBattleGameData_1.TankBettle.BLOCK_TYPE.HOME && (this._heart = node);
                this.node.addChild(node, TankBattleGameData_1.TankBettle.ZIndex.BLOCK);
                x = (j + 1) * prefebSize.width / 2 + j * prefebSize.width / 2;
                node.x = x;
                node.y = y;
                if (blockData == TankBattleGameData_1.TankBettle.BLOCK_TYPE.HOME) {
                  x = this.node.width / 2;
                  node.x = x;
                  node.y -= prefebSize.height / 2;
                }
              }
            }
          }
        }
      };
      TankBattleMap.prototype.randomPropPosition = function() {
        var tank = TankBattleGameData_1.TankBettle.gameData.getPlayerPrefab(true);
        var xMin = tank.width / 2;
        var xMax = this.node.width - tank.width / 2;
        var yMin = -tank.height / 2;
        var yMax = -this.node.height + tank.height / 2;
        var x = cc.randomRange(xMin, xMax);
        var y = cc.randomRange(yMin, yMax);
        return cc.v3(x, y, 0);
      };
      TankBattleMap.prototype.createProps = function() {
        var type = cc.randomRangeInt(TankBattleGameData_1.TankBettle.PropsType.MIN, TankBattleGameData_1.TankBettle.PropsType.MAX);
        var prefab = TankBattleGameData_1.TankBettle.gameData.getPropsPrefab(type);
        var node = cc.instantiate(prefab);
        var props = node.addComponent(TankBattleProps_1.default);
        props.type = type;
        this.node.addChild(node, TankBattleGameData_1.TankBettle.ZIndex.PROPS);
        node.position = this.randomPropPosition();
      };
      TankBattleMap.prototype.startCreateProps = function() {
        var _this = this;
        if (TankBattleGameData_1.TankBettle.gameData.gameStatus == TankBattleGameData_1.TankBettle.GAME_STATUS.GAME) {
          var time = cc.randomRange(TankBattleGameData_1.TankBettle.PROPS_CREATE_INTERVAL.min, TankBattleGameData_1.TankBettle.PROPS_CREATE_INTERVAL.max);
          this.propsProductNode.stopAllActions();
          cc.tween(this.propsProductNode).delay(time).call(function() {
            _this.createProps();
            _this.startCreateProps();
          }).start();
        }
      };
      TankBattleMap.prototype.addPlayer = function(isOne) {
        var playerNode = cc.instantiate(TankBattleGameData_1.TankBettle.gameData.getPlayerPrefab(isOne));
        if (isOne) {
          this.playerOne = playerNode.addComponent(TankBattleTank_1.TankBettleTankPlayer);
          this.playerOne.isOnePlayer = isOne;
          playerNode.x = this.node.width / 2 - 2 * playerNode.width;
          playerNode.y = -this.node.height + playerNode.height / 2;
          this.node.addChild(playerNode, TankBattleGameData_1.TankBettle.ZIndex.TANK);
          this.playerOne.born();
        } else {
          this.playerTwo = playerNode.addComponent(TankBattleTank_1.TankBettleTankPlayer);
          this.playerTwo.isOnePlayer = isOne;
          playerNode.x = this.node.width / 2 + 2 * playerNode.width;
          playerNode.y = -this.node.height + playerNode.height / 2;
          this.node.addChild(playerNode, TankBattleGameData_1.TankBettle.ZIndex.TANK);
          this.playerTwo.born();
        }
      };
      TankBattleMap.prototype.removePlayer = function(player) {
        var isOne = player.isOnePlayer;
        player.node.removeFromParent();
        player.node.destroy();
        if (TankBattleGameData_1.TankBettle.gameData.isSingle) {
          this.playerOne = null;
          if (TankBattleGameData_1.TankBettle.gameData.playerOneLive > 0) {
            this.addPlayer(isOne);
            TankBattleGameData_1.TankBettle.gameData.reducePlayerLive(true);
            TankBattleGameData_1.TankBettle.gameData.updateGameInfo();
          } else TankBattleGameData_1.TankBettle.gameData.gameOver();
        } else {
          if (isOne) {
            this.playerOne = null;
            TankBattleGameData_1.TankBettle.gameData.playerOneLive > 0 && this.addPlayer(isOne);
            TankBattleGameData_1.TankBettle.gameData.reducePlayerLive(true);
          } else {
            this.playerTwo = null;
            TankBattleGameData_1.TankBettle.gameData.playerTwoLive > 0 && this.addPlayer(isOne);
            TankBattleGameData_1.TankBettle.gameData.reducePlayerLive(false);
          }
          TankBattleGameData_1.TankBettle.gameData.updateGameInfo();
          TankBattleGameData_1.TankBettle.gameData.playerTwoLive < 0 && TankBattleGameData_1.TankBettle.gameData.playerOneLive < 0 && TankBattleGameData_1.TankBettle.gameData.gameOver();
        }
      };
      TankBattleMap.prototype.addBullet = function(bullet) {
        this.node.addChild(bullet.node, TankBattleGameData_1.TankBettle.ZIndex.BULLET);
      };
      TankBattleMap.prototype.onKeyDown = function(ev) {
        this._keyboardEvents.has(ev.keyCode) || this._keyboardEvents.set(ev.keyCode, ev);
      };
      TankBattleMap.prototype.onKeyUp = function(ev) {
        this._keyboardEvents.has(ev.keyCode) && this._keyboardEvents.delete(ev.keyCode);
      };
      TankBattleMap.prototype.doKeyboardEvents = function() {
        this._keyboardEvents.has(cc.macro.KEY.a) ? this._handlePlayerMove(this.playerTwo, TankBattleGameData_1.TankBettle.Direction.LEFT) : this._keyboardEvents.has(cc.macro.KEY.w) ? this._handlePlayerMove(this.playerTwo, TankBattleGameData_1.TankBettle.Direction.UP) : this._keyboardEvents.has(cc.macro.KEY.s) ? this._handlePlayerMove(this.playerTwo, TankBattleGameData_1.TankBettle.Direction.DOWN) : this._keyboardEvents.has(cc.macro.KEY.d) && this._handlePlayerMove(this.playerTwo, TankBattleGameData_1.TankBettle.Direction.RIGHT);
        this._keyboardEvents.has(cc.macro.KEY.left) ? this._handlePlayerMove(this.playerOne, TankBattleGameData_1.TankBettle.Direction.LEFT) : this._keyboardEvents.has(cc.macro.KEY.up) ? this._handlePlayerMove(this.playerOne, TankBattleGameData_1.TankBettle.Direction.UP) : this._keyboardEvents.has(cc.macro.KEY.down) ? this._handlePlayerMove(this.playerOne, TankBattleGameData_1.TankBettle.Direction.DOWN) : this._keyboardEvents.has(cc.macro.KEY.right) && this._handlePlayerMove(this.playerOne, TankBattleGameData_1.TankBettle.Direction.RIGHT);
        this._keyboardEvents.has(cc.macro.KEY.enter) && this._handlePlayerShoot(this.playerOne);
        if (this._keyboardEvents.has(cc.macro.KEY.space)) {
          TankBattleGameData_1.TankBettle.gameData.isSingle && this._handlePlayerShoot(this.playerOne);
          this._handlePlayerShoot(this.playerTwo);
        }
      };
      TankBattleMap.prototype._handlePlayerMove = function(player, dir) {
        if (TankBattleGameData_1.TankBettle.gameData.gameStatus == TankBattleGameData_1.TankBettle.GAME_STATUS.GAME && player) {
          player.direction = dir;
          player.move();
        }
      };
      TankBattleMap.prototype._handlePlayerShoot = function(player) {
        TankBattleGameData_1.TankBettle.gameData.gameStatus == TankBattleGameData_1.TankBettle.GAME_STATUS.GAME && player && player.shoot();
      };
      TankBattleMap.prototype.gameOver = function() {
        var _this = this;
        if (this._heart) {
          var aniNode_1 = cc.instantiate(TankBattleGameData_1.TankBettle.gameData.animationPrefab);
          this._heart.addChild(aniNode_1);
          var animation = aniNode_1.getComponent(cc.Animation);
          var state = animation.play("king_boom");
          aniNode_1.x = 0;
          aniNode_1.y = 0;
          cc.tween(aniNode_1).delay(state.duration).call(function() {
            aniNode_1.removeFromParent();
            aniNode_1.destroy();
            var sprite = _this._heart.getComponent(cc.Sprite);
            sprite.loadImage({
              url: {
                urls: [ "texture/images" ],
                key: "heart_0"
              },
              view: _this.owner,
              bundle: _this.owner.bundle
            });
          }).removeSelf().start();
        }
      };
      TankBattleMap.prototype.clear = function() {
        this._waitingDestory.forEach(function(value) {
          value.destroy();
        });
        this._waitingDestory = [];
        this._waitEnemy.forEach(function(value) {
          value.destroy();
        });
        this._waitEnemy = [];
        for (var i = 0; i < this._enemys.length; i++) {
          var enemy = this._enemys[i];
          enemy.removeFromParent();
          enemy.destroy();
        }
        this._enemys = [];
      };
      TankBattleMap = __decorate([ ccclass ], TankBattleMap);
      return TankBattleMap;
    }(cc.Component);
    exports.default = TankBattleMap;
    cc._RF.pop();
  }, {
    "../data/TankBattleGameData": "TankBattleGameData",
    "../data/TankBattleLevel": "TankBattleLevel",
    "./TankBattleBlock": "TankBattleBlock",
    "./TankBattleProps": "TankBattleProps",
    "./TankBattleTank": "TankBattleTank"
  } ],
  TankBattleNetController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "30ced16h1BMCYuR8xb8/kkd", "TankBattleNetController");
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
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var CmdDefines_1 = require("../../../../script/common/protocol/CmdDefines");
    var TankBattleProtocal_1 = require("../protocol/TankBattleProtocal");
    var TankBattleGameData_1 = require("../data/TankBattleGameData");
    var TankBattleChangeStageView_1 = require("../view/TankBattleChangeStageView");
    var Config_1 = require("../../../../script/common/config/Config");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TankBattleNetController = function(_super) {
      __extends(TankBattleNetController, _super);
      function TankBattleNetController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      TankBattleNetController.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        cc.log("TankBattleNetController=>bindingEvents");
        this.registerEvent(CmdDefines_1.MainCmd.CMD_GAME, TankBattleProtocal_1.SUB_CMD_GAME.CMD_GAME_CONFIG, this.onGameSaveConfig, TankBattleProtocal_1.TankBattleConfig);
      };
      Object.defineProperty(TankBattleNetController.prototype, "bundle", {
        get: function() {
          return TankBattleGameData_1.TankBettle.gameData.bundle;
        },
        enumerable: false,
        configurable: true
      });
      TankBattleNetController.prototype.onGameSaveConfig = function(data) {
        TankBattleGameData_1.TankBettle.gameData.gameStatus = TankBattleGameData_1.TankBettle.GAME_STATUS.INIT;
        Manager_1.Manager.uiManager.open({
          bundle: this.bundle,
          type: TankBattleChangeStageView_1.default,
          zIndex: Config_1.ViewZOrder.UI,
          args: [ TankBattleGameData_1.TankBettle.gameData.currentLevel ]
        });
      };
      TankBattleNetController = __decorate([ ccclass, Decorators_1.injectService(LobbyService_1.LobbyService.instance) ], TankBattleNetController);
      return TankBattleNetController;
    }(Controller_1.default);
    exports.default = TankBattleNetController;
    cc._RF.pop();
  }, {
    "../../../../script/common/config/Config": void 0,
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/common/net/LobbyService": void 0,
    "../../../../script/common/protocol/CmdDefines": void 0,
    "../../../../script/framework/controller/Controller": void 0,
    "../../../../script/framework/decorator/Decorators": void 0,
    "../data/TankBattleGameData": "TankBattleGameData",
    "../protocol/TankBattleProtocal": "TankBattleProtocal",
    "../view/TankBattleChangeStageView": "TankBattleChangeStageView"
  } ],
  TankBattleProps: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ee0a1IYefhKlIHJeC5XEeDv", "TankBattleProps");
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
    var TankBattleGameData_1 = require("../data/TankBattleGameData");
    var TankBattleTank_1 = require("./TankBattleTank");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TankBattleProps = function(_super) {
      __extends(TankBattleProps, _super);
      function TankBattleProps() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.type = null;
        return _this;
      }
      TankBattleProps.prototype.onLoad = function() {
        var _this = this;
        var time = TankBattleGameData_1.TankBettle.PROPS_DISAPPEAR;
        cc.tween(this.node).delay(time - 3).blink(3, 5).call(function() {
          _this.node.removeFromParent();
          _this.node.destroy();
        }).start();
      };
      TankBattleProps.prototype.onCollisionEnter = function(other, me) {
        if (other.node.group == TankBattleGameData_1.TankBettle.GROUP.Player) {
          var player = other.node.getComponent(TankBattleTank_1.TankBettleTankPlayer);
          if (player) {
            TankBattleGameData_1.TankBettle.gameData.playPropsAudio();
            this.type == TankBattleGameData_1.TankBettle.PropsType.LIVE ? TankBattleGameData_1.TankBettle.gameData.addPlayerLive(player.isOnePlayer) : this.type == TankBattleGameData_1.TankBettle.PropsType.BOOM_ALL_ENEMY ? TankBattleGameData_1.TankBettle.gameData.gameMap.removeAllEnemy() : this.type == TankBattleGameData_1.TankBettle.PropsType.GOD ? player.addStatus(TankBattleGameData_1.TankBettle.PLAYER_STATUS.PROTECTED) : this.type == TankBattleGameData_1.TankBettle.PropsType.STRONG_BULLET ? player.addStatus(TankBattleGameData_1.TankBettle.PLAYER_STATUS.STRONG) : this.type == TankBattleGameData_1.TankBettle.PropsType.STRONG_MY_SELF ? player.addLive() : this.type == TankBattleGameData_1.TankBettle.PropsType.TIME && TankBattleGameData_1.TankBettle.gameData.addGameTime();
            this.node.stopAllActions();
            this.node.removeFromParent();
            this.node.destroy();
          }
        }
      };
      TankBattleProps.prototype.onCollisionStay = function(other, me) {};
      TankBattleProps.prototype.onCollisionExit = function(other, me) {};
      TankBattleProps.prototype.removeSelf = function() {
        this.node.removeFromParent();
        this.node.destroy();
      };
      TankBattleProps = __decorate([ ccclass ], TankBattleProps);
      return TankBattleProps;
    }(cc.Component);
    exports.default = TankBattleProps;
    cc._RF.pop();
  }, {
    "../data/TankBattleGameData": "TankBattleGameData",
    "./TankBattleTank": "TankBattleTank"
  } ],
  TankBattleProtocal: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "376d5krRm9Fe5BgF8Ty99zN", "TankBattleProtocal");
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
    exports.TankBattleConfig = exports.SUB_CMD_GAME = void 0;
    var CmdDefines_1 = require("../../../../script/common/protocol/CmdDefines");
    var JsonMessage_1 = require("../../../../script/framework/net/JsonMessage");
    exports.SUB_CMD_GAME = {
      CMD_GAME_CONFIG: 100
    };
    var TankBattleConfig = function(_super) {
      __extends(TankBattleConfig, _super);
      function TankBattleConfig() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.mainCmd = CmdDefines_1.MainCmd.CMD_GAME;
        _this.subCmd = exports.SUB_CMD_GAME.CMD_GAME_CONFIG;
        _this.level = 1;
        return _this;
      }
      __decorate([ JsonMessage_1.serialize("level", Number) ], TankBattleConfig.prototype, "level", void 0);
      return TankBattleConfig;
    }(JsonMessage_1.JsonMessage);
    exports.TankBattleConfig = TankBattleConfig;
    cc._RF.pop();
  }, {
    "../../../../script/common/protocol/CmdDefines": void 0,
    "../../../../script/framework/net/JsonMessage": void 0
  } ],
  TankBattleStartView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6df36RQMBdMeq06LopbA6Ug", "TankBattleStartView");
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
    var LogicEvent_1 = require("../../../../script/common/event/LogicEvent");
    var Manager_1 = require("../../../../script/common/manager/Manager");
    var TankBattleGameData_1 = require("../data/TankBattleGameData");
    var Decorators_1 = require("../../../../script/framework/decorator/Decorators");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TankBattleStartView = function(_super) {
      __extends(TankBattleStartView, _super);
      function TankBattleStartView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.selectTank = null;
        _this.singlePlayer = null;
        _this.doublePalyers = null;
        return _this;
      }
      Object.defineProperty(TankBattleStartView.prototype, "presenter", {
        get: function() {
          return this.presenterAny;
        },
        enumerable: false,
        configurable: true
      });
      TankBattleStartView.getPrefabUrl = function() {
        return "prefabs/TankBattleStartView";
      };
      TankBattleStartView.prototype.bindingEvents = function() {
        _super.prototype.bindingEvents.call(this);
        this.registerEvent(TankBattleGameData_1.TankBettle.EVENT.SHOW_MAP_LEVEL, this.onChangeStageFinished);
      };
      TankBattleStartView.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.content = cc.find("content", this.node);
        cc.find("title", this.content).getComponent(cc.Label).language = Manager_1.Manager.makeLanguage("title", this.bundle);
        this.singlePlayer = cc.find("player", this.content);
        this.singlePlayer.getComponent(cc.Label).language = Manager_1.Manager.makeLanguage("player", this.bundle);
        this.doublePalyers = cc.find("players", this.content);
        this.doublePalyers.getComponent(cc.Label).language = Manager_1.Manager.makeLanguage("players", this.bundle);
        cc.find("tips", this.content).getComponent(cc.Label).language = Manager_1.Manager.makeLanguage("tips", this.bundle);
        this.selectTank = cc.find("tank", this.content);
        this.selectTank.y = this.singlePlayer.y;
        this.setEnabledKeyBack(true);
      };
      TankBattleStartView.prototype.onKeyBack = function(ev) {
        _super.prototype.onKeyBack.call(this, ev);
        dispatch(LogicEvent_1.LogicEvent.ENTER_HALL);
      };
      TankBattleStartView.prototype.onKeyUp = function(ev) {
        _super.prototype.onKeyUp.call(this, ev);
        if (this.presenter.gameStatus != TankBattleGameData_1.TankBettle.GAME_STATUS.SELECTED) return;
        if (ev.keyCode == cc.macro.KEY.down || ev.keyCode == cc.macro.KEY.up) {
          var isSingle = false;
          if (this.selectTank.y == this.singlePlayer.y) this.selectTank.y = this.doublePalyers.y; else {
            this.selectTank.y = this.singlePlayer.y;
            isSingle = true;
          }
          this.presenter.isSingle = isSingle;
        } else if (ev.keyCode == cc.macro.KEY.space || ev.keyCode == cc.macro.KEY.enter) {
          this.presenter.isSingle = this.presenter.isSingle;
          this.presenter.enterGame();
        }
      };
      TankBattleStartView.prototype.onChangeStageFinished = function() {
        this.close();
      };
      TankBattleStartView = __decorate([ ccclass, Decorators_1.injectPresenter(TankBattleGameData_1.TankBettle.TankBettleGameData) ], TankBattleStartView);
      return TankBattleStartView;
    }(UIView_1.default);
    exports.default = TankBattleStartView;
    cc._RF.pop();
  }, {
    "../../../../script/common/event/LogicEvent": void 0,
    "../../../../script/common/manager/Manager": void 0,
    "../../../../script/framework/decorator/Decorators": void 0,
    "../../../../script/framework/ui/UIView": void 0,
    "../data/TankBattleGameData": "TankBattleGameData"
  } ],
  TankBattleTank: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "14635tkKA9PoIm9Ge5RcVI8", "TankBattleTank");
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
    exports.TankBettleTankEnemy = exports.TankBettleTankPlayer = void 0;
    var TankBattleGameData_1 = require("../data/TankBattleGameData");
    var TankBattleBullet_1 = require("./TankBattleBullet");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TankBettleTank = function(_super) {
      __extends(TankBettleTank, _super);
      function TankBettleTank() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isAI = false;
        _this.config = null;
        _this.bullet = null;
        _this._direction = TankBattleGameData_1.TankBettle.Direction.UP;
        _this.isWaitingChange = false;
        _this.isMoving = false;
        return _this;
      }
      Object.defineProperty(TankBettleTank.prototype, "direction", {
        get: function() {
          return this._direction;
        },
        set: function(value) {
          var old = this._direction;
          this._direction = value;
          old != this._direction && (this.isMoving = false);
        },
        enumerable: false,
        configurable: true
      });
      TankBettleTank.prototype.move = function() {};
      TankBettleTank.prototype.shoot = function() {
        if (this.bullet) return false;
        var bulletNode = cc.instantiate(TankBattleGameData_1.TankBettle.gameData.bulletPrefab);
        this.bullet = bulletNode.addComponent(TankBattleBullet_1.default);
        this.bullet.move(this);
        return true;
      };
      TankBettleTank.prototype.born = function() {};
      TankBettleTank.prototype.hurt = function() {};
      TankBettleTank.prototype.die = function() {};
      TankBettleTank.prototype.changeDirection = function(other) {};
      TankBettleTank.prototype.onCollisionEnter = function(other, me) {
        this.onBulletCollision(other, me);
        this.onBlockCollision(other, me);
      };
      TankBettleTank.prototype.onCollisionStay = function(other, me) {};
      TankBettleTank.prototype.onCollisionExit = function(other, me) {};
      TankBettleTank.prototype.getPlayer = function(node) {
        var player = node.getComponent(TankBettleTankPlayer);
        if (player) return player;
        return node.getComponent(TankBettleTankEnemy);
      };
      TankBettleTank.prototype.onBlockCollision = function(other, me) {
        if (other.node.group == TankBattleGameData_1.TankBettle.GROUP.Wall || other.node.group == TankBattleGameData_1.TankBettle.GROUP.StoneWall || other.node.group == TankBattleGameData_1.TankBettle.GROUP.Boundary || other.node.group == TankBattleGameData_1.TankBettle.GROUP.Home || other.node.group == TankBattleGameData_1.TankBettle.GROUP.Water) {
          var wordPos = me.world.preAabb.center;
          this.node.stopAllActions();
          var pos = this.node.parent.convertToNodeSpaceAR(wordPos);
          this.checkPostion(pos);
          this.node.x = pos.x;
          this.node.y = pos.y;
          this.isMoving = false;
          this.isAI && other.node.group == TankBattleGameData_1.TankBettle.GROUP.Home && TankBattleGameData_1.TankBettle.gameData.gameOver();
          this.isAI && this.changeDirection(other);
        } else if (other.node.group == TankBattleGameData_1.TankBettle.GROUP.Player) {
          var player = this.getPlayer(other.node);
          if (this.isAI) ; else if (player.isAI) {
            this.node.stopAllActions();
            var wordPos = me.world.preAabb.center;
            var pos = this.node.parent.convertToNodeSpaceAR(wordPos);
            this.checkPostion(pos);
            this.node.x = pos.x;
            this.node.y = pos.y;
            this.isMoving = false;
          }
        }
      };
      TankBettleTank.prototype.checkPostion = function(pos) {
        if (pos.x < this.node.width / 2) {
          pos.x = this.node.width / 2;
          pos.y = this.node.y;
        }
      };
      TankBettleTank.prototype.onBulletCollision = function(other, me) {
        if (other.node.group == TankBattleGameData_1.TankBettle.GROUP.Bullet) {
          var bullet = other.node.getComponent(TankBattleBullet_1.default);
          if (this.isAI) {
            if (bullet.owner.isAI) return;
          } else if (!bullet.owner.isAI) return;
          this.hurt();
        }
      };
      TankBettleTank = __decorate([ ccclass ], TankBettleTank);
      return TankBettleTank;
    }(cc.Component);
    exports.default = TankBettleTank;
    var TankBettleTankPlayer = function(_super) {
      __extends(TankBettleTankPlayer, _super);
      function TankBettleTankPlayer() {
        var _this = _super.call(this) || this;
        _this.isOnePlayer = false;
        _this._status = new Map();
        _this._strongNode = null;
        _this.config = TankBattleGameData_1.TankBettle.gameData.playerConfig;
        return _this;
      }
      TankBettleTankPlayer.prototype.onLoad = function() {
        this._strongNode = new cc.Node();
        this.node.addChild(this._strongNode);
      };
      TankBettleTankPlayer.prototype.addLive = function() {
        this.config.live++;
        TankBattleGameData_1.TankBettle.gameData.updateGameInfo();
      };
      TankBettleTankPlayer.prototype.shoot = function() {
        _super.prototype.shoot.call(this) && TankBattleGameData_1.TankBettle.gameData.playAttackAudio();
        return true;
      };
      TankBettleTankPlayer.prototype.addStatus = function(status) {
        var _this = this;
        this._status.set(status, true);
        if (status == TankBattleGameData_1.TankBettle.PLAYER_STATUS.PROTECTED) {
          var aniNode_1 = cc.instantiate(TankBattleGameData_1.TankBettle.gameData.animationPrefab);
          this.node.addChild(aniNode_1);
          var animation = aniNode_1.getComponent(cc.Animation);
          animation.play("tank_protected");
          aniNode_1.x = 0;
          aniNode_1.y = 0;
          cc.tween(aniNode_1).delay(TankBattleGameData_1.TankBettle.PLAYER_STATUS_EXIST_TIME).call(function() {
            aniNode_1.removeFromParent();
            aniNode_1.destroy();
            _this.removeStatus(TankBattleGameData_1.TankBettle.PLAYER_STATUS.PROTECTED);
          }).removeSelf().start();
        } else if (status == TankBattleGameData_1.TankBettle.PLAYER_STATUS.STRONG) {
          this._strongNode.stopAllActions();
          cc.tween(this._strongNode).delay(TankBattleGameData_1.TankBettle.PLAYER_STATUS_EXIST_TIME).call(function() {
            _this.removeStatus(status);
          }).start();
        }
      };
      TankBettleTankPlayer.prototype.hasStatus = function(status) {
        return this._status.has(status);
      };
      TankBettleTankPlayer.prototype.removeStatus = function(status) {
        this._status.delete(status);
      };
      TankBettleTankPlayer.prototype.born = function() {
        this.addStatus(TankBattleGameData_1.TankBettle.PLAYER_STATUS.PROTECTED);
      };
      TankBettleTankPlayer.prototype.hurt = function() {
        var _this = this;
        if (this.hasStatus(TankBattleGameData_1.TankBettle.PLAYER_STATUS.PROTECTED)) return;
        this.config.live--;
        if (0 == this.config.live) {
          this.node.stopAllActions();
          var aniNode = cc.instantiate(TankBattleGameData_1.TankBettle.gameData.animationPrefab);
          this.node.addChild(aniNode);
          var animation = aniNode.getComponent(cc.Animation);
          var state = animation.play("tank_boom");
          TankBattleGameData_1.TankBettle.gameData.playerCrackAudio();
          aniNode.x = 0;
          aniNode.y = 0;
          cc.tween(aniNode).delay(state.duration).call(function() {
            TankBattleGameData_1.TankBettle.gameData.gameMap.removePlayer(_this);
          }).removeSelf().start();
        }
        TankBattleGameData_1.TankBettle.gameData.updateGameInfo();
      };
      TankBettleTankPlayer.prototype.move = function() {
        var _this = this;
        if (this.isMoving) return;
        this.node.stopAllActions();
        this.isMoving = true;
        if (this.direction == TankBattleGameData_1.TankBettle.Direction.UP) {
          this.node.angle = 0;
          cc.tween(this.node).delay(0).by(this.config.time, {
            y: this.config.distance
          }).call(function() {
            _this.isMoving = false;
          }).start();
        } else if (this.direction == TankBattleGameData_1.TankBettle.Direction.DOWN) {
          this.node.angle = 180;
          cc.tween(this.node).delay(0).by(this.config.time, {
            y: -this.config.distance
          }).call(function() {
            _this.isMoving = false;
          }).start();
        } else if (this.direction == TankBattleGameData_1.TankBettle.Direction.RIGHT) {
          this.node.angle = -90;
          cc.tween(this.node).delay(0).by(this.config.time, {
            x: this.config.distance
          }).call(function() {
            _this.isMoving = false;
          }).start();
        } else if (this.direction == TankBattleGameData_1.TankBettle.Direction.LEFT) {
          this.node.angle = 90;
          cc.tween(this.node).delay(0).by(this.config.time, {
            x: -this.config.distance
          }).call(function() {
            _this.isMoving = false;
          }).start();
        }
      };
      return TankBettleTankPlayer;
    }(TankBettleTank);
    exports.TankBettleTankPlayer = TankBettleTankPlayer;
    var TankBettleTankEnemy = function(_super) {
      __extends(TankBettleTankEnemy, _super);
      function TankBettleTankEnemy() {
        var _this = _super.call(this) || this;
        _this.shootNode = null;
        _this.changeNode = null;
        _this.delayChangeNode = null;
        _this._type = null;
        _this.isAI = true;
        _this.config = new TankBattleGameData_1.TankBettle.TankConfig();
        return _this;
      }
      Object.defineProperty(TankBettleTankEnemy.prototype, "type", {
        set: function(value) {
          this._type = value;
          var spriteFrameKey = "";
          value == TankBattleGameData_1.TankBettle.EnemyType.NORMAL ? spriteFrameKey = "tank_0_0" : value == TankBattleGameData_1.TankBettle.EnemyType.SPEED ? spriteFrameKey = "tank_3_0" : value == TankBattleGameData_1.TankBettle.EnemyType.STRONG && (spriteFrameKey = "tank_4_0");
          var sprite = this.node.getComponent(cc.Sprite);
          sprite.loadImage({
            url: {
              urls: [ "texture/images" ],
              key: spriteFrameKey
            },
            view: TankBattleGameData_1.TankBettle.gameData.gameView,
            bundle: TankBattleGameData_1.TankBettle.gameData.gameView.bundle
          });
        },
        enumerable: false,
        configurable: true
      });
      TankBettleTankEnemy.prototype.stopShootAction = function() {
        this.shootNode && this.shootNode.stopAllActions();
      };
      TankBettleTankEnemy.prototype.onLoad = function() {
        var node = new cc.Node();
        this.node.addChild(node);
        this.shootNode = node;
        this.changeNode = new cc.Node();
        this.node.addChild(this.changeNode);
        this.delayChangeNode = new cc.Node();
        this.node.addChild(this.delayChangeNode);
        this.startDelayChange();
      };
      TankBettleTankEnemy.prototype.onDestroy = function() {
        this.stopShootAction();
        this.changeNode && this.changeNode.stopAllActions();
        this.delayChangeNode && this.delayChangeNode.stopAllActions();
      };
      TankBettleTankEnemy.prototype.startDelayChange = function() {
        var _this = this;
        var delay = cc.randomRange(this.config.changeInterval.min, this.config.changeInterval.max);
        this.delayChangeNode.stopAllActions();
        cc.tween(this.shootNode).delay(delay).call(function() {
          _this.changeDirection();
          _this.startDelayChange();
        }).start();
      };
      TankBettleTankEnemy.prototype.hurt = function() {
        this.config.live--;
        if (this._type == TankBattleGameData_1.TankBettle.EnemyType.STRONG) {
          var sprite = this.node.getComponent(cc.Sprite);
          var spriteFrameKey = "tank_5_0";
          1 == this.config.live && (spriteFrameKey = "tank_6_0");
          sprite.loadImage({
            url: {
              urls: [ "texture/images" ],
              key: spriteFrameKey
            },
            view: TankBattleGameData_1.TankBettle.gameData.gameView,
            bundle: TankBattleGameData_1.TankBettle.gameData.gameView.bundle
          });
        }
        0 == this.config.live && this.die();
      };
      TankBettleTankEnemy.prototype.die = function() {
        var _this = this;
        this.node.stopAllActions();
        this.stopShootAction();
        var aniNode = cc.instantiate(TankBattleGameData_1.TankBettle.gameData.animationPrefab);
        this.node.addChild(aniNode);
        var animation = aniNode.getComponent(cc.Animation);
        var state = animation.play("tank_boom");
        TankBattleGameData_1.TankBettle.gameData.enemyCrackAudio();
        aniNode.x = 0;
        aniNode.y = 0;
        cc.tween(aniNode).delay(state.duration).call(function() {
          TankBattleGameData_1.TankBettle.gameData.gameMap.removeEnemy(_this.node);
        }).removeSelf().start();
      };
      TankBettleTankEnemy.prototype.startShoot = function() {
        var _this = this;
        var delay = cc.randomRange(this.config.shootInterval.min, this.config.shootInterval.max);
        this.stopShootAction();
        cc.tween(this.shootNode).delay(delay).call(function() {
          _this.shoot();
          _this.startShoot();
        }).start();
      };
      TankBettleTankEnemy.prototype.move = function() {
        this.node.stopAllActions();
        if (this.direction == TankBattleGameData_1.TankBettle.Direction.UP) {
          this.node.angle = 0;
          cc.tween(this.node).delay(0).by(this.config.time, {
            y: this.config.distance
          }).repeatForever().start();
        } else if (this.direction == TankBattleGameData_1.TankBettle.Direction.DOWN) {
          this.node.angle = 180;
          cc.tween(this.node).delay(0).by(this.config.time, {
            y: -this.config.distance
          }).repeatForever().start();
        } else if (this.direction == TankBattleGameData_1.TankBettle.Direction.RIGHT) {
          this.node.angle = -90;
          cc.tween(this.node).delay(0).by(this.config.time, {
            x: this.config.distance
          }).repeatForever().start();
        } else if (this.direction == TankBattleGameData_1.TankBettle.Direction.LEFT) {
          this.node.angle = 90;
          cc.tween(this.node).delay(0).by(this.config.time, {
            x: -this.config.distance
          }).repeatForever().start();
        }
      };
      TankBettleTankEnemy.prototype.delayMove = function(other) {
        this.isWaitingChange = false;
        var except = null;
        var allDir = [];
        this.node.x <= this.node.width && (except = TankBattleGameData_1.TankBettle.Direction.LEFT);
        this.node.x >= this.node.parent.width - this.node.width && (except = TankBattleGameData_1.TankBettle.Direction.RIGHT);
        for (var i = TankBattleGameData_1.TankBettle.Direction.MIN; i <= TankBattleGameData_1.TankBettle.Direction.MAX; i++) this.direction != i && i != except && allDir.push(i);
        var randomValue = cc.randomRangeInt(0, allDir.length);
        this.direction = allDir[randomValue];
        this.move();
      };
      TankBettleTankEnemy.prototype.changeDirection = function(other) {
        var _this = this;
        if (other && other.node.group == TankBattleGameData_1.TankBettle.GROUP.Player) {
          var player = this.getPlayer(other.node);
          if (!player.isAI) {
            this.move();
            return;
          }
        }
        if (this.isWaitingChange) return;
        this.isWaitingChange = true;
        var delay = cc.randomRange(.5, 1);
        this.changeNode.stopAllActions();
        cc.tween(this.changeNode).delay(delay).call(function() {
          _this.delayMove(other);
        }).start();
      };
      return TankBettleTankEnemy;
    }(TankBettleTank);
    exports.TankBettleTankEnemy = TankBettleTankEnemy;
    cc._RF.pop();
  }, {
    "../data/TankBattleGameData": "TankBattleGameData",
    "./TankBattleBullet": "TankBattleBullet"
  } ]
}, {}, [ "TankBattleLogic", "TankBattleNetController", "TankBattleGameData", "TankBattleLanguageEN", "TankBattleLanguageZH", "TankBattleLevel", "TankBattleBlock", "TankBattleBullet", "TankBattleMap", "TankBattleProps", "TankBattleTank", "TankBattleProtocal", "TankBattleChangeStageView", "TankBattleGameOver", "TankBattleGameView", "TankBattleStartView" ]);