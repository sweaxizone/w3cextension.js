import assert from "assert";

//
const validEndianSet = ["big", "little"];

//
(globalThis as any).SAByteArray = class SAByteArray {
    static INITIAL_CAPACITY: number = 8;
    m_dataview: DataView;
    m_u8array: Uint8Array;
    m_position: number = 0;
    m_length: number = 0;
    m_endian: string = "big";

    constructor(initialCapacityArg: any = undefined) {
        let initialCapacity = initialCapacityArg === undefined ? SAByteArray.INITIAL_CAPACITY : initialCapacityArg;
        assert(initialCapacity >= 2, 'SAByteArray initial capacity must be >= 2.');
        this.m_dataview = new DataView(new ArrayBuffer(initialCapacity));
        this.m_u8array = new Uint8Array(this.m_dataview.buffer);
    }

    static withCapacity(bytes: number): any {
        return new SAByteArray(bytes);
    }

    static zeroes(length: number): any {
        const r = new SAByteArray();
        r.m_dataview = new DataView(new ArrayBuffer(Math.max(2, length >> 0)));
        r.m_u8array = new Uint8Array(r.m_dataview.buffer);
        r.m_length = length;
        return r;
    }

    static from(arg: any) {
        const r = new SAByteArray();
        if (arg instanceof SAByteArray)
        {
            r.m_dataview = new DataView(arg.m_dataview.buffer.slice(0));
            r.m_u8array = new Uint8Array(r.m_dataview.buffer);
            r.m_length = arg.m_length;
            return r;
        }
        r.m_dataview = new DataView(arg instanceof Uint8Array ? arg.buffer : arg);
        r.m_u8array = new Uint8Array(r.m_dataview.buffer);
        r.m_length = r.m_dataview.byteLength;
        return r;
    }

    clone() {
        return SAByteArray.from(this);
    }

    toArrayBuffer() {
        return this.m_dataview.buffer;
    }

    toBuffer() {
        return Buffer.from(this.m_dataview.buffer.slice(0));
    }

    equals(other: any): boolean {
        const l = this.m_length;
        if (l != other.m_length) {
            return false;
        }
        for (let i = 0; i < l; i++) {
            if (this.m_u8array[i] != other.m_u8array[i]) {
                return false;
            }
        }
        return true;
    }
    
    get endian() {
        return this.m_endian;
    }

    set endian(val) {
        assert(validEndianSet.indexOf(val) != -1);
        this.m_endian = val;
    }

    get length() {
        return this.m_length >>> 0;
    }

    set length(val) {
        this.m_length = Math.min(Math.max(0, val >>> 0), this.m_length);
    }

    get position() {
        return this.m_position >>> 0;
    }

    set position(val) {
        this.m_position = Math.min(Math.max(val >>> 0, 0), this.m_length);
    }

    get bytesAvailable() {
        return this.length - this.position;
    }

    get hasRemaining() {
        return this.position < this.length;
    }

    get(position: number) {
        return position < this.m_length ? this.m_u8array[position] : 0;
    }

    set(position: number, val: number) {
        if (position >= this.m_length) {
            throw new RangeError("Index is out of bounds (index=" + position + ", length=" + this.m_length + ")");
        }
        this.m_u8array[position] = val >>> 0;
    }

    paygrow(length: number) {
        const ipl = this.m_position + length;
        // double buffer capacity as needed
        while (ipl > this.m_dataview.byteLength) {
            const arraybuf = new ArrayBuffer(this.m_dataview.byteLength * 2);
            this.m_dataview = new DataView(arraybuf);
            const k = this.m_u8array;
            this.m_u8array = new Uint8Array(arraybuf);
            this.m_u8array.set(k.subarray(0, this.m_length));
        }
        const newBytes = -(this.m_length - ipl);
        this.m_length += Math.max(0, newBytes);
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.m_length; i++) {
            yield this.m_u8array[i];
        }
    }

    *keys() {
        for (let i = 0; i < this.m_length; i++) {
            yield i;
        }
    }

    *values() {
        for (let i = 0; i < this.m_length; i++) {
            yield this.m_u8array[i];
        }
    }

    readUnsignedByte() {
        assert(this.m_position < this.m_length, 'Insufficient data available to read.');
        let k = this.m_dataview.getUint8(this.m_position);
        this.m_position += 1;
        return k;
    }

    writeUnsignedByte(value: number) {
        this.paygrow(1);
        this.m_dataview.setUint8(this.m_position, value);
        this.m_position += 1;
    }

    readByte() {
        assert(this.m_position < this.m_length, 'Insufficient data available to read.');
        let k = this.m_dataview.getInt8(this.m_position);
        this.m_position += 1;
        return k;
    }

    writeByte(value: number) {
        this.paygrow(1);
        this.m_dataview.setInt8(this.m_position, value);
        this.m_position += 1;
    }

    readShort() {
        assert(this.m_position + 2 <= this.m_length, 'Insufficient data available to read.');
        let k = this.m_dataview.getInt16(this.m_position, this.m_endian == "little");
        this.m_position += 2;
        return k;
    }

    writeShort(value: number) {
        this.paygrow(2);
        this.m_dataview.setInt16(this.m_position, value, this.m_endian == "little");
        this.m_position += 2;
    }

    readUnsignedShort() {
        assert(this.m_position + 2 <= this.m_length, 'Insufficient data available to read.');
        let k = this.m_dataview.getUint16(this.m_position, this.m_endian == "little");
        this.m_position += 2;
        return k;
    }

    writeUnsignedShort(value: number) {
        this.paygrow(2);
        this.m_dataview.setUint16(this.m_position, value, this.m_endian == "little");
        this.m_position += 2;
    }

    readInt() {
        assert(this.m_position + 4 <= this.m_length, 'Insufficient data available to read.');
        let k = this.m_dataview.getInt32(this.m_position, this.m_endian == "little");
        this.m_position += 4;
        return k;
    }

    writeInt(value: number) {
        this.paygrow(4);
        this.m_dataview.setInt32(this.m_position, value, this.m_endian == "little");
        this.m_position += 4;
    }

    readUnsignedInt() {
        assert(this.m_position + 4 <= this.m_length, 'Insufficient data available to read.');
        let k = this.m_dataview.getUint32(this.m_position, this.m_endian == "little");
        this.m_position += 4;
        return k;
    }

    writeUnsignedInt(value: number) {
        this.paygrow(4);
        this.m_dataview.setUint32(this.m_position, value, this.m_endian == "little");
        this.m_position += 4;
    }

    readLong(): bigint {
        assert(this.m_position + 8 <= this.m_length, 'Insufficient data available to read.');
        let k = this.m_dataview.getBigInt64(this.m_position, this.m_endian == "little");
        this.m_position += 8;
        return k;
    }

    writeLong(value: bigint) {
        this.paygrow(8);
        this.m_dataview.setBigInt64(this.m_position, value, this.m_endian == "little");
        this.m_position += 8;
    }

    readUnsignedLong(): bigint {
        assert(this.m_position + 8 <= this.m_length, 'Insufficient data available to read.');
        let k = this.m_dataview.getBigUint64(this.m_position, this.m_endian == "little");
        this.m_position += 8;
        return k;
    }

    writeUnsignedLong(value: bigint) {
        this.paygrow(8);
        this.m_dataview.setBigUint64(this.m_position, value, this.m_endian == "little");
        this.m_position += 8;
    }

    readFloat(): number {
        assert(this.m_position + 4 <= this.m_length, 'Insufficient data available to read.');
        let k = this.m_dataview.getFloat32(this.m_position, this.m_endian == "little");
        this.m_position += 4;
        return k;
    }

    writeFloat(value: number) {
        this.paygrow(4);
        this.m_dataview.setFloat32(this.m_position, value, this.m_endian == "little");
        this.m_position += 4;
    }

    readDouble(): number {
        assert(this.m_position + 8 <= this.m_length, 'Insufficient data available to read.');
        let k = this.m_dataview.getFloat64(this.m_position, this.m_endian == "little");
        this.m_position += 8;
        return k;
    }

    writeDouble(value: number) {
        this.paygrow(8);
        this.m_dataview.setFloat64(this.m_position, value, this.m_endian == "little");
        this.m_position += 8;
    }

    readUTF(length: number): string {
        assert(this.m_position + length <= this.m_length, 'Insufficient data available to read.');
        let k = this.m_u8array.subarray(this.m_position, this.m_position + length);
        this.m_position += length;
        return new TextDecoder().decode(k);
    }

    writeUTF(value: string) {
        var u8arr = new TextEncoder().encode(value);
        this.paygrow(u8arr.length);
        this.m_u8array.set(u8arr, this.m_position);
        this.m_position += u8arr.length;
    }

    readBytes(length: number) {
        assert(this.m_position + length <= this.m_length, 'Insufficient data available to read.');
        let k = this.m_u8array.subarray(this.m_position, this.m_position + length);
        this.m_position += length;
        return SAByteArray.from(k);
    }

    writeBytes(value: SAByteArray) {
        const u8arr = value.m_u8array;
        this.paygrow(u8arr.length);
        this.m_u8array.set(u8arr, this.m_position);;
        this.m_position += u8arr.length;
    }

    clear() {
        this.m_position = 0;
        this.m_length = 0;
        const arraybuf = new ArrayBuffer(SAByteArray.INITIAL_CAPACITY);
        this.m_dataview = new DataView(arraybuf);
        this.m_u8array = new Uint8Array(arraybuf);
    }

};
