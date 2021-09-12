/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.tp = (function() {

    /**
     * Namespace tp.
     * @exports tp
     * @namespace
     */
    var tp = {};

    tp.RoomInfo = (function() {

        /**
         * Properties of a RoomInfo.
         * @memberof tp
         * @interface IRoomInfo
         * @property {number|null} [roomID] RoomInfo roomID
         * @property {string|null} [name] RoomInfo name
         * @property {Array.<tp.IUserInfo>|null} [players] RoomInfo players
         */

        /**
         * Constructs a new RoomInfo.
         * @memberof tp
         * @classdesc Represents a RoomInfo.
         * @implements IRoomInfo
         * @constructor
         * @param {tp.IRoomInfo=} [properties] Properties to set
         */
        function RoomInfo(properties) {
            this.players = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomInfo roomID.
         * @member {number} roomID
         * @memberof tp.RoomInfo
         * @instance
         */
        RoomInfo.prototype.roomID = 0;

        /**
         * RoomInfo name.
         * @member {string} name
         * @memberof tp.RoomInfo
         * @instance
         */
        RoomInfo.prototype.name = "";

        /**
         * RoomInfo players.
         * @member {Array.<tp.IUserInfo>} players
         * @memberof tp.RoomInfo
         * @instance
         */
        RoomInfo.prototype.players = $util.emptyArray;

        /**
         * Creates a new RoomInfo instance using the specified properties.
         * @function create
         * @memberof tp.RoomInfo
         * @static
         * @param {tp.IRoomInfo=} [properties] Properties to set
         * @returns {tp.RoomInfo} RoomInfo instance
         */
        RoomInfo.create = function create(properties) {
            return new RoomInfo(properties);
        };

        /**
         * Encodes the specified RoomInfo message. Does not implicitly {@link tp.RoomInfo.verify|verify} messages.
         * @function encode
         * @memberof tp.RoomInfo
         * @static
         * @param {tp.IRoomInfo} message RoomInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomID);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.players != null && message.players.length)
                for (var i = 0; i < message.players.length; ++i)
                    $root.tp.UserInfo.encode(message.players[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RoomInfo message, length delimited. Does not implicitly {@link tp.RoomInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof tp.RoomInfo
         * @static
         * @param {tp.IRoomInfo} message RoomInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomInfo message from the specified reader or buffer.
         * @function decode
         * @memberof tp.RoomInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {tp.RoomInfo} RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.tp.RoomInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.int32();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    if (!(message.players && message.players.length))
                        message.players = [];
                    message.players.push($root.tp.UserInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof tp.RoomInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {tp.RoomInfo} RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomInfo message.
         * @function verify
         * @memberof tp.RoomInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isInteger(message.roomID))
                    return "roomID: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.players != null && message.hasOwnProperty("players")) {
                if (!Array.isArray(message.players))
                    return "players: array expected";
                for (var i = 0; i < message.players.length; ++i) {
                    var error = $root.tp.UserInfo.verify(message.players[i]);
                    if (error)
                        return "players." + error;
                }
            }
            return null;
        };

        /**
         * Creates a RoomInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof tp.RoomInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {tp.RoomInfo} RoomInfo
         */
        RoomInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.tp.RoomInfo)
                return object;
            var message = new $root.tp.RoomInfo();
            if (object.roomID != null)
                message.roomID = object.roomID | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.players) {
                if (!Array.isArray(object.players))
                    throw TypeError(".tp.RoomInfo.players: array expected");
                message.players = [];
                for (var i = 0; i < object.players.length; ++i) {
                    if (typeof object.players[i] !== "object")
                        throw TypeError(".tp.RoomInfo.players: object expected");
                    message.players[i] = $root.tp.UserInfo.fromObject(object.players[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a RoomInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof tp.RoomInfo
         * @static
         * @param {tp.RoomInfo} message RoomInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.players = [];
            if (options.defaults) {
                object.roomID = 0;
                object.name = "";
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.players && message.players.length) {
                object.players = [];
                for (var j = 0; j < message.players.length; ++j)
                    object.players[j] = $root.tp.UserInfo.toObject(message.players[j], options);
            }
            return object;
        };

        /**
         * Converts this RoomInfo to JSON.
         * @function toJSON
         * @memberof tp.RoomInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomInfo;
    })();

    /**
     * GenderType enum.
     * @name tp.GenderType
     * @enum {number}
     * @property {number} male=1 male value
     * @property {number} female=2 female value
     */
    tp.GenderType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[1] = "male"] = 1;
        values[valuesById[2] = "female"] = 2;
        return values;
    })();

    tp.UserInfo = (function() {

        /**
         * Properties of a UserInfo.
         * @memberof tp
         * @interface IUserInfo
         * @property {string|null} [name] UserInfo name
         * @property {tp.GenderType|null} [gender] UserInfo gender
         * @property {number|Long|null} [id] UserInfo id
         * @property {number|null} [level] UserInfo level
         * @property {number|Long|null} [money] UserInfo money
         */

        /**
         * Constructs a new UserInfo.
         * @memberof tp
         * @classdesc Represents a UserInfo.
         * @implements IUserInfo
         * @constructor
         * @param {tp.IUserInfo=} [properties] Properties to set
         */
        function UserInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserInfo name.
         * @member {string} name
         * @memberof tp.UserInfo
         * @instance
         */
        UserInfo.prototype.name = "";

        /**
         * UserInfo gender.
         * @member {tp.GenderType} gender
         * @memberof tp.UserInfo
         * @instance
         */
        UserInfo.prototype.gender = 1;

        /**
         * UserInfo id.
         * @member {number|Long} id
         * @memberof tp.UserInfo
         * @instance
         */
        UserInfo.prototype.id = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * UserInfo level.
         * @member {number} level
         * @memberof tp.UserInfo
         * @instance
         */
        UserInfo.prototype.level = 0;

        /**
         * UserInfo money.
         * @member {number|Long} money
         * @memberof tp.UserInfo
         * @instance
         */
        UserInfo.prototype.money = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @function create
         * @memberof tp.UserInfo
         * @static
         * @param {tp.IUserInfo=} [properties] Properties to set
         * @returns {tp.UserInfo} UserInfo instance
         */
        UserInfo.create = function create(properties) {
            return new UserInfo(properties);
        };

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link tp.UserInfo.verify|verify} messages.
         * @function encode
         * @memberof tp.UserInfo
         * @static
         * @param {tp.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.gender != null && Object.hasOwnProperty.call(message, "gender"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.gender);
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.id);
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.level);
            if (message.money != null && Object.hasOwnProperty.call(message, "money"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.money);
            return writer;
        };

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link tp.UserInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof tp.UserInfo
         * @static
         * @param {tp.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @function decode
         * @memberof tp.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {tp.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.tp.UserInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.gender = reader.int32();
                    break;
                case 3:
                    message.id = reader.int64();
                    break;
                case 4:
                    message.level = reader.int32();
                    break;
                case 5:
                    message.money = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof tp.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {tp.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserInfo message.
         * @function verify
         * @memberof tp.UserInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.gender != null && message.hasOwnProperty("gender"))
                switch (message.gender) {
                default:
                    return "gender: enum value expected";
                case 1:
                case 2:
                    break;
                }
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                    return "id: integer|Long expected";
            if (message.level != null && message.hasOwnProperty("level"))
                if (!$util.isInteger(message.level))
                    return "level: integer expected";
            if (message.money != null && message.hasOwnProperty("money"))
                if (!$util.isInteger(message.money) && !(message.money && $util.isInteger(message.money.low) && $util.isInteger(message.money.high)))
                    return "money: integer|Long expected";
            return null;
        };

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof tp.UserInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {tp.UserInfo} UserInfo
         */
        UserInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.tp.UserInfo)
                return object;
            var message = new $root.tp.UserInfo();
            if (object.name != null)
                message.name = String(object.name);
            switch (object.gender) {
            case "male":
            case 1:
                message.gender = 1;
                break;
            case "female":
            case 2:
                message.gender = 2;
                break;
            }
            if (object.id != null)
                if ($util.Long)
                    (message.id = $util.Long.fromValue(object.id)).unsigned = false;
                else if (typeof object.id === "string")
                    message.id = parseInt(object.id, 10);
                else if (typeof object.id === "number")
                    message.id = object.id;
                else if (typeof object.id === "object")
                    message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber();
            if (object.level != null)
                message.level = object.level | 0;
            if (object.money != null)
                if ($util.Long)
                    (message.money = $util.Long.fromValue(object.money)).unsigned = false;
                else if (typeof object.money === "string")
                    message.money = parseInt(object.money, 10);
                else if (typeof object.money === "number")
                    message.money = object.money;
                else if (typeof object.money === "object")
                    message.money = new $util.LongBits(object.money.low >>> 0, object.money.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof tp.UserInfo
         * @static
         * @param {tp.UserInfo} message UserInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.gender = options.enums === String ? "male" : 1;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.id = options.longs === String ? "0" : 0;
                object.level = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.money = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.money = options.longs === String ? "0" : 0;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.gender != null && message.hasOwnProperty("gender"))
                object.gender = options.enums === String ? $root.tp.GenderType[message.gender] : message.gender;
            if (message.id != null && message.hasOwnProperty("id"))
                if (typeof message.id === "number")
                    object.id = options.longs === String ? String(message.id) : message.id;
                else
                    object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber() : message.id;
            if (message.level != null && message.hasOwnProperty("level"))
                object.level = message.level;
            if (message.money != null && message.hasOwnProperty("money"))
                if (typeof message.money === "number")
                    object.money = options.longs === String ? String(message.money) : message.money;
                else
                    object.money = options.longs === String ? $util.Long.prototype.toString.call(message.money) : options.longs === Number ? new $util.LongBits(message.money.low >>> 0, message.money.high >>> 0).toNumber() : message.money;
            return object;
        };

        /**
         * Converts this UserInfo to JSON.
         * @function toJSON
         * @memberof tp.UserInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UserInfo;
    })();

    return tp;
})();

module.exports = $root;
