import "./E4X";
import "./SAEventTarget";
import "./SAByteArray";
import "./Chars";
import impAssert from "assert";

// assert
(globalThis as any).assert = impAssert;
(globalThis as any).AssertionError = impAssert.AssertionError;
declare global {
    const assert: typeof import("assert");
    class AssertionError extends impAssert.AssertionError {}
    type AssertPredicate = impAssert.AssertPredicate;
}

// SAEvent
declare global {
    /**
     * Used to declare known compile-time events
     * for a class that extends `EventTarget` or
     * implements `IEventTarget`.
     */
    const EventRecord: unique symbol;

    /**
     * `SAEventTarget` stands for Short-Augmented Event Target.
     */
    class SAEventTarget implements ISAEventTarget {
        //
        declare [EventRecord]: {};

        //
        public on<K extends keyof this[typeof EventRecord]>(
            type: K,
            listener: (e: this[typeof EventRecord][K] extends Event ? this[typeof EventRecord][K] : never) => void | undefined,
            options?: boolean | SAOnEventOptions
        ): void;
        public on(type: string, listener: (e: Event) => void | undefined, options?: boolean | SAOnEventOptions): void;

        //
        public off<K extends keyof this[typeof EventRecord]>(
            type: K,
            listener: (e: this[typeof EventRecord][K] extends Event ? this[typeof EventRecord][K] : never) => void | undefined,
            options?: boolean | SAOffEventOptions
        ): void;
        public off(type: string, listener: (e: Event) => void | undefined, options?: boolean | SAOffEventOptions): void;

        //
        public emit<K extends string & keyof this[typeof EventRecord], C extends (new (type: K) => EventResult), EventResult extends this[typeof EventRecord][K]>(type: K, constructor: C): boolean;
        public emit<K extends string & keyof this[typeof EventRecord], C extends (new (type: K, options: O) => EventResult), O, EventResult extends this[typeof EventRecord][K]>(type: K, constructor: C, options: O): boolean;
        public emit(event: Event): boolean;
    }

    //
    interface ISAEventTarget {
        [EventRecord]: {};

        //
        on<K extends keyof this[typeof EventRecord]>(
            type: K,
            listener: (e: this[typeof EventRecord][K] extends Event ? this[typeof EventRecord][K] : never) => void | undefined,
            options?: boolean | SAOnEventOptions
        ): void;
        on(type: string, listener: (e: Event) => void | undefined, options?: boolean | SAOnEventOptions): void;

        //
        off<K extends keyof this[typeof EventRecord]>(
            type: K,
            listener: (e: this[typeof EventRecord][K] extends Event ? this[typeof EventRecord][K] : never) => void | undefined,
            options?: boolean | SAOffEventOptions
        ): void;
        off(type: string, listener: (e: Event) => void | undefined, options?: boolean | SAOffEventOptions): void;

        //
        emit<K extends string & keyof this[typeof EventRecord], C extends (new (type: K) => EventResult), EventResult extends this[typeof EventRecord][K]>(type: K, constructor: C): boolean;
        emit<K extends string & keyof this[typeof EventRecord], C extends (new (type: K, options: O) => EventResult), O, EventResult extends this[typeof EventRecord][K]>(type: K, constructor: C, options: O): boolean;
        emit(event: Event): boolean;
    }

    //
    type SAOnEventOptions = {
        capture?: boolean,
    };

    //
    type SAOffEventOptions = {
        capture?: boolean,
    };
}

// trace(), etrace()
(globalThis as any).trace = console.log;
(globalThis as any).etrace = console.error;
declare global {
    const trace: typeof console.log;
    const etrace: typeof console.error;
}

// Math.clamp()
(Math as any).clamp = (val: any, from: any, to: any): any => {
    return val < from ? from : val > to ? to : val;
};
declare global {
    interface Math {
        /**
         * Clamps value to specified range (inclusive on both ends).
         */
        clamp(val: number, from: number, to: number): number;
        /**
         * Clamps value to specified range (inclusive on both ends).
         */
        clamp(val: bigint, from: bigint, to: bigint): bigint;
    }
}

// BigInt.min(), BigInt.max()
(BigInt as any).min = (...rest: any): any => {
    let r = rest.pop() ?? 0n;
    for (const val of rest) {
        if (val < r) {
            r = val;
        }
    }
    return r;
};
(BigInt as any).max = (...rest: any): any => {
    let r = rest.pop() ?? 0n;
    for (const val of rest) {
        if (val > r) {
            r = val;
        }
    }
    return r;
};
declare global {
    interface BigIntConstructor  {
        min(...rest: bigint[]): bigint;
        max(...rest: bigint[]): bigint;
    }
}

// SAByteArray
declare global {
    type Endian = "littleEndian" | "bigEndian";

    class SAByteArray implements ISADataInput, ISADataOutput {
        constructor(initialCapacity?: number);
        static withCapacity(bytes: number): SAByteArray;
        static zeroes(length: number): SAByteArray;
        static from(argument: SAByteArray | Uint8Array | ArrayBuffer | SharedArrayBuffer): SAByteArray;

        clone(): SAByteArray;
        toArrayBuffer(): ArrayBuffer;
        /**
         * *Applies to the Node.js runtime.*
         */
        toBuffer(): Buffer;

        equals(other: SAByteArray): boolean;

        get endian(): Endian;
        set endian(val);

        get length(): number;
        set length(val);

        get position(): number;
        set position(val);

        get bytesAvailable(): number;
        get hasRemaining(): boolean;

        get(position: number): number;
        set(position: number, val: number): void;

        [Symbol.iterator](): Iterator<number>;
        keys(): Iterator<number>;
        values(): Iterator<number>;

        readUnsignedByte(): number;
        writeUnsignedByte(value: number): void;

        readByte(): number;
        writeByte(value: number): void;

        readShort(): number;
        writeShort(value: number): void;

        readUnsignedShort(): number;
        writeUnsignedShort(value: number): void;

        readInt(): number;
        writeInt(value: number): void;

        readUnsignedInt(): number;
        writeUnsignedInt(value: number): void;

        readLong(): bigint;
        writeLong(value: bigint): void;

        readUnsignedLong(): bigint;
        writeUnsignedLong(value: bigint): void;

        readFloat(): number;
        writeFloat(value: number): void;

        readDouble(): number;
        writeDouble(value: number): void;

        readUTF(length: number): string;
        writeUTF(value: string): void;

        readBytes(length: number): SAByteArray;
        writeBytes(value: SAByteArray): void;

        clear(): void;
    }

    interface ISADataInput {
        get endian(): Endian;
        set endian(val);

        get bytesAvailable(): number;
        get hasRemaining(): boolean;

        readUnsignedByte(): number;
        readByte(): number;
        readShort(): number;
        readUnsignedShort(): number;
        readInt(): number;
        readUnsignedInt(): number;
        readLong(): bigint;
        readUnsignedLong(): bigint;
        readFloat(): number;
        readDouble(): number;
        readUTF(length: number): string;
        readBytes(length: number): SAByteArray;
    }

    interface ISADataOutput {
        get endian(): Endian;
        set endian(val);

        writeUnsignedByte(value: number): void;
        writeByte(value: number): void;
        writeShort(value: number): void;
        writeUnsignedShort(value: number): void;
        writeInt(value: number): void;
        writeUnsignedInt(value: number): void;
        writeLong(value: bigint): void;
        writeUnsignedLong(value: bigint): void;
        writeFloat(value: number): void;
        writeDouble(value: number): void;
        writeUTF(value: string): void;
        writeBytes(value: SAByteArray): void;
    }
}

// E4X
declare global {
    function isXMLName(argument: string): boolean;

    /**
     * Represents a XML namespace.
     */
    class Namespace {
        constructor(uri: string | Namespace | QName);
        constructor(prefix: string, uri: string | QName);
        
        get prefix(): string;
        set prefix(val);

        get uri(): string;
        set uri(val);

        toString(): string;
        valueOf(): string;
    }

    /**
     * Represents a XML qualified name.
     * 
     * The `uri` component may be `null`, in which
     * case it means *wildcard* (\*), used to match
     * any URI.
     */
    class QName {
        constructor(localName: string);
        constructor(qname: QName);
        constructor(uri: null | Namespace | string, localName: QName | string);

        get localName(): string;
        get uri(): null | string;

        toString(): string;
        valueOf(): QName;
    }
}

// Iterator.length()
(Iterator.prototype as any).length = function() {
    let n = 0;
    for (const _ of this) {
        n++;
    }
    return n;
};
declare global {
    interface IteratorObject<T, TReturn, TNext> {
        /**
         * Consumes the iterator and returns the number of
         * iterated entries.
         */
        length(): number;
    }
}

// Chars
declare global {
    /**
     * `Chars` may be used for iterating characters (as Unicode code points)
     * from left-to-right in a string with miscellaneous operation methods.
     */
    class Chars extends Iterator<number> {
        /**
         * Constructs a `Chars` iterator over the specified string,
         * at the specified UTF-16 `offset`.
         */
        public constructor(str: string, offset?: number);

        /**
         * Indicates if there are remaining code points to read.
         */
        public get hasRemaining(): boolean;
        /**
         * Indicates if the reader has reached the end of the string.
         */
        public get reachedEnd(): boolean;

        public next(): IteratorResult<number>;

        /**
         * Returns the next code point. If there are no code points
         * available, returns U+00.
         */
        public nextOrZero(): number;

        /**
         * Skips a code point. This is equivalent to
         * calling `next()`.
         */
        public skipOneInPlace(): void;
        /**
         * Skips the given number of code points.
         */
        public skipInPlace(count: number): void;

        /**
         * Returns the current UTF-16 offset in the string.
         */
        public get index(): number;

        /**
         * Peeks the next code point.
         */
        public peek(): null | number;
        /**
         * Peeks the next code point. If there are no code points
         * available, returns U+00.
         */
        public peekOrZero(): number;

        /**
         * Peeks the next code point at the given
         * zero based code point index.
         */
        public at(index: number): null | number;
        /**
         * Peeks the next code point at the given zero based code point index.
         * If there are no code points available, returns U+00.
         */
        public atOrZero(index: number): number;

        /**
         * Peeks a number of code points until the string's end.
         */
        public seq(numChars: number): string;
    }
}

// String.prototype.chars()
declare global {
    interface String {
        chars(): Chars;
    }
}