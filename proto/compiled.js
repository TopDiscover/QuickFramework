/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.awesomepackage = (function() {

    /**
     * Namespace awesomepackage.
     * @exports awesomepackage
     * @namespace
     */
    var awesomepackage = {};

    awesomepackage.AwesomeMessage = (function() {

        /**
         * Properties of an AwesomeMessage.
         * @memberof awesomepackage
         * @interface IAwesomeMessage
         * @property {string|null} [testValue] AwesomeMessage testValue
         * @property {string|null} [testOne] AwesomeMessage testOne
         */

        /**
         * Constructs a new AwesomeMessage.
         * @memberof awesomepackage
         * @classdesc Represents an AwesomeMessage.
         * @implements IAwesomeMessage
         * @constructor
         * @param {awesomepackage.IAwesomeMessage=} [properties] Properties to set
         */
        function AwesomeMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AwesomeMessage testValue.
         * @member {string} testValue
         * @memberof awesomepackage.AwesomeMessage
         * @instance
         */
        AwesomeMessage.prototype.testValue = "";

        /**
         * AwesomeMessage testOne.
         * @member {string} testOne
         * @memberof awesomepackage.AwesomeMessage
         * @instance
         */
        AwesomeMessage.prototype.testOne = "";

        /**
         * Creates a new AwesomeMessage instance using the specified properties.
         * @function create
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {awesomepackage.IAwesomeMessage=} [properties] Properties to set
         * @returns {awesomepackage.AwesomeMessage} AwesomeMessage instance
         */
        AwesomeMessage.create = function create(properties) {
            return new AwesomeMessage(properties);
        };

        /**
         * Encodes the specified AwesomeMessage message. Does not implicitly {@link awesomepackage.AwesomeMessage.verify|verify} messages.
         * @function encode
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {awesomepackage.IAwesomeMessage} message AwesomeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AwesomeMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.testValue != null && Object.hasOwnProperty.call(message, "testValue"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.testValue);
            if (message.testOne != null && Object.hasOwnProperty.call(message, "testOne"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.testOne);
            return writer;
        };

        /**
         * Encodes the specified AwesomeMessage message, length delimited. Does not implicitly {@link awesomepackage.AwesomeMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {awesomepackage.IAwesomeMessage} message AwesomeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AwesomeMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer.
         * @function decode
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {awesomepackage.AwesomeMessage} AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AwesomeMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.awesomepackage.AwesomeMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.testValue = reader.string();
                    break;
                case 2:
                    message.testOne = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {awesomepackage.AwesomeMessage} AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AwesomeMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AwesomeMessage message.
         * @function verify
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AwesomeMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.testValue != null && message.hasOwnProperty("testValue"))
                if (!$util.isString(message.testValue))
                    return "testValue: string expected";
            if (message.testOne != null && message.hasOwnProperty("testOne"))
                if (!$util.isString(message.testOne))
                    return "testOne: string expected";
            return null;
        };

        /**
         * Creates an AwesomeMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {awesomepackage.AwesomeMessage} AwesomeMessage
         */
        AwesomeMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.awesomepackage.AwesomeMessage)
                return object;
            var message = new $root.awesomepackage.AwesomeMessage();
            if (object.testValue != null)
                message.testValue = String(object.testValue);
            if (object.testOne != null)
                message.testOne = String(object.testOne);
            return message;
        };

        /**
         * Creates a plain object from an AwesomeMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof awesomepackage.AwesomeMessage
         * @static
         * @param {awesomepackage.AwesomeMessage} message AwesomeMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AwesomeMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.testValue = "";
                object.testOne = "";
            }
            if (message.testValue != null && message.hasOwnProperty("testValue"))
                object.testValue = message.testValue;
            if (message.testOne != null && message.hasOwnProperty("testOne"))
                object.testOne = message.testOne;
            return object;
        };

        /**
         * Converts this AwesomeMessage to JSON.
         * @function toJSON
         * @memberof awesomepackage.AwesomeMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AwesomeMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AwesomeMessage;
    })();

    awesomepackage.TestType = (function() {

        /**
         * Properties of a TestType.
         * @memberof awesomepackage
         * @interface ITestType
         * @property {string|null} [awesomeField] TestType awesomeField
         * @property {Array.<awesomepackage.IAwesomeMessage>|null} [value] TestType value
         * @property {string|null} [myStr] TestType myStr
         */

        /**
         * Constructs a new TestType.
         * @memberof awesomepackage
         * @classdesc Represents a TestType.
         * @implements ITestType
         * @constructor
         * @param {awesomepackage.ITestType=} [properties] Properties to set
         */
        function TestType(properties) {
            this.value = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TestType awesomeField.
         * @member {string} awesomeField
         * @memberof awesomepackage.TestType
         * @instance
         */
        TestType.prototype.awesomeField = "";

        /**
         * TestType value.
         * @member {Array.<awesomepackage.IAwesomeMessage>} value
         * @memberof awesomepackage.TestType
         * @instance
         */
        TestType.prototype.value = $util.emptyArray;

        /**
         * TestType myStr.
         * @member {string} myStr
         * @memberof awesomepackage.TestType
         * @instance
         */
        TestType.prototype.myStr = "";

        /**
         * Creates a new TestType instance using the specified properties.
         * @function create
         * @memberof awesomepackage.TestType
         * @static
         * @param {awesomepackage.ITestType=} [properties] Properties to set
         * @returns {awesomepackage.TestType} TestType instance
         */
        TestType.create = function create(properties) {
            return new TestType(properties);
        };

        /**
         * Encodes the specified TestType message. Does not implicitly {@link awesomepackage.TestType.verify|verify} messages.
         * @function encode
         * @memberof awesomepackage.TestType
         * @static
         * @param {awesomepackage.ITestType} message TestType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestType.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.awesomeField != null && Object.hasOwnProperty.call(message, "awesomeField"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.awesomeField);
            if (message.value != null && message.value.length)
                for (var i = 0; i < message.value.length; ++i)
                    $root.awesomepackage.AwesomeMessage.encode(message.value[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.myStr != null && Object.hasOwnProperty.call(message, "myStr"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.myStr);
            return writer;
        };

        /**
         * Encodes the specified TestType message, length delimited. Does not implicitly {@link awesomepackage.TestType.verify|verify} messages.
         * @function encodeDelimited
         * @memberof awesomepackage.TestType
         * @static
         * @param {awesomepackage.ITestType} message TestType message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TestType.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TestType message from the specified reader or buffer.
         * @function decode
         * @memberof awesomepackage.TestType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {awesomepackage.TestType} TestType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TestType.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.awesomepackage.TestType();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.awesomeField = reader.string();
                    break;
                case 2:
                    if (!(message.value && message.value.length))
                        message.value = [];
                    message.value.push($root.awesomepackage.AwesomeMessage.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.myStr = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TestType message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof awesomepackage.TestType
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {awesomepackage.TestType} TestType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TestType.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TestType message.
         * @function verify
         * @memberof awesomepackage.TestType
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TestType.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.awesomeField != null && message.hasOwnProperty("awesomeField"))
                if (!$util.isString(message.awesomeField))
                    return "awesomeField: string expected";
            if (message.value != null && message.hasOwnProperty("value")) {
                if (!Array.isArray(message.value))
                    return "value: array expected";
                for (var i = 0; i < message.value.length; ++i) {
                    var error = $root.awesomepackage.AwesomeMessage.verify(message.value[i]);
                    if (error)
                        return "value." + error;
                }
            }
            if (message.myStr != null && message.hasOwnProperty("myStr"))
                if (!$util.isString(message.myStr))
                    return "myStr: string expected";
            return null;
        };

        /**
         * Creates a TestType message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof awesomepackage.TestType
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {awesomepackage.TestType} TestType
         */
        TestType.fromObject = function fromObject(object) {
            if (object instanceof $root.awesomepackage.TestType)
                return object;
            var message = new $root.awesomepackage.TestType();
            if (object.awesomeField != null)
                message.awesomeField = String(object.awesomeField);
            if (object.value) {
                if (!Array.isArray(object.value))
                    throw TypeError(".awesomepackage.TestType.value: array expected");
                message.value = [];
                for (var i = 0; i < object.value.length; ++i) {
                    if (typeof object.value[i] !== "object")
                        throw TypeError(".awesomepackage.TestType.value: object expected");
                    message.value[i] = $root.awesomepackage.AwesomeMessage.fromObject(object.value[i]);
                }
            }
            if (object.myStr != null)
                message.myStr = String(object.myStr);
            return message;
        };

        /**
         * Creates a plain object from a TestType message. Also converts values to other types if specified.
         * @function toObject
         * @memberof awesomepackage.TestType
         * @static
         * @param {awesomepackage.TestType} message TestType
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TestType.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.value = [];
            if (options.defaults) {
                object.awesomeField = "";
                object.myStr = "";
            }
            if (message.awesomeField != null && message.hasOwnProperty("awesomeField"))
                object.awesomeField = message.awesomeField;
            if (message.value && message.value.length) {
                object.value = [];
                for (var j = 0; j < message.value.length; ++j)
                    object.value[j] = $root.awesomepackage.AwesomeMessage.toObject(message.value[j], options);
            }
            if (message.myStr != null && message.hasOwnProperty("myStr"))
                object.myStr = message.myStr;
            return object;
        };

        /**
         * Converts this TestType to JSON.
         * @function toJSON
         * @memberof awesomepackage.TestType
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TestType.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TestType;
    })();

    return awesomepackage;
})();

module.exports = $root;
