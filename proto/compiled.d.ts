// import * as $protobuf from "protobufjs";
/** Namespace awesomepackage. */
declare namespace awesomepackage {

    /** Properties of an AwesomeMessage. */
    interface IAwesomeMessage {

        /** AwesomeMessage testValue */
        testValue?: (string|null);

        /** AwesomeMessage testOne */
        testOne?: (string|null);
    }

    /** Represents an AwesomeMessage. */
    class AwesomeMessage implements IAwesomeMessage {

        /**
         * Constructs a new AwesomeMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: awesomepackage.IAwesomeMessage);

        /** AwesomeMessage testValue. */
        public testValue: string;

        /** AwesomeMessage testOne. */
        public testOne: string;

        /**
         * Creates a new AwesomeMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AwesomeMessage instance
         */
        public static create(properties?: awesomepackage.IAwesomeMessage): awesomepackage.AwesomeMessage;

        /**
         * Encodes the specified AwesomeMessage message. Does not implicitly {@link awesomepackage.AwesomeMessage.verify|verify} messages.
         * @param message AwesomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: awesomepackage.IAwesomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AwesomeMessage message, length delimited. Does not implicitly {@link awesomepackage.AwesomeMessage.verify|verify} messages.
         * @param message AwesomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: awesomepackage.IAwesomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): awesomepackage.AwesomeMessage;

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): awesomepackage.AwesomeMessage;

        /**
         * Verifies an AwesomeMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AwesomeMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AwesomeMessage
         */
        public static fromObject(object: { [k: string]: any }): awesomepackage.AwesomeMessage;

        /**
         * Creates a plain object from an AwesomeMessage message. Also converts values to other types if specified.
         * @param message AwesomeMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: awesomepackage.AwesomeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AwesomeMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TestType. */
    interface ITestType {

        /** TestType awesomeField */
        awesomeField?: (string|null);

        /** TestType value */
        value?: (awesomepackage.IAwesomeMessage[]|null);

        /** TestType myStr */
        myStr?: (string|null);
    }

    /** Represents a TestType. */
    class TestType implements ITestType {

        /**
         * Constructs a new TestType.
         * @param [properties] Properties to set
         */
        constructor(properties?: awesomepackage.ITestType);

        /** TestType awesomeField. */
        public awesomeField: string;

        /** TestType value. */
        public value: awesomepackage.IAwesomeMessage[];

        /** TestType myStr. */
        public myStr: string;

        /**
         * Creates a new TestType instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TestType instance
         */
        public static create(properties?: awesomepackage.ITestType): awesomepackage.TestType;

        /**
         * Encodes the specified TestType message. Does not implicitly {@link awesomepackage.TestType.verify|verify} messages.
         * @param message TestType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: awesomepackage.ITestType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TestType message, length delimited. Does not implicitly {@link awesomepackage.TestType.verify|verify} messages.
         * @param message TestType message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: awesomepackage.ITestType, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TestType message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TestType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): awesomepackage.TestType;

        /**
         * Decodes a TestType message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TestType
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): awesomepackage.TestType;

        /**
         * Verifies a TestType message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TestType message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TestType
         */
        public static fromObject(object: { [k: string]: any }): awesomepackage.TestType;

        /**
         * Creates a plain object from a TestType message. Also converts values to other types if specified.
         * @param message TestType
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: awesomepackage.TestType, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TestType to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
