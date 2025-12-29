// Chars
(globalThis as any).Chars = class Chars extends Iterator<number> {
    private _str: string;
    private _length: number;
    private _offset: number;

    public constructor(str: string, offset: number = -1) {
        super();
        this._str = str;
        this._length = str.length;
        this._offset = offset == -1 ? 0 : offset;
    }

    public get hasRemaining(): boolean {
        return this._offset < this._length;
    }

    public get reachedEnd(): boolean {
        return this._offset >= this._length;
    }

    public next(): IteratorResult<number> {
        const ch = this._str.codePointAt(this._offset);
        if (ch === undefined) {
            return { done: true, value: 0 };
        }
        if (ch! >= 0x10000) {
            this._offset++;
        }
        this._offset++;
        return { done: false, value: ch! };
    }

    public skipOneInPlace(): void {
        this.next();
    }

    public skipInPlace(count: number): void {
        for (let i = 0; i < count; i++) {
            if (this.next().done) {
                break;
            }
        }
    }

    public get index(): number {
        return this._offset;
    }

    public nextOrZero(): number {
        const r = this.next();
        return r.done ? 0 : r.value;
    }

    public peek(): null | number {
        return this._str.codePointAt(this._offset) ?? null;
    }

    public peekOrZero(): number {
        return this._str.codePointAt(this._offset) ?? 0;
    }

    public at(index: number): null | number {
        let offset = this._offset;
        for (let i = 0; i < index; i++) {
            const ch = this._str.codePointAt(offset);
            if (ch === undefined) {
                break;
            }
            if (ch! >= 0x10000) {
                offset++;
            }
            offset++;
        }
        return this._str.codePointAt(offset) ?? null;
    }

    public atOrZero(index: number): number {
        return this.at(index) ?? 0;
    }

    public seq(numChars: number): string {
        const r: string[] = [];
        let offset = this._offset;
        for (let i = 0; i < numChars; i++) {
            const ch = this._str.codePointAt(offset);
            if (ch === undefined) {
                break;
            }
            if (ch! >= 0x10000) {
                offset++;
            }
            offset++;
            r.push(String.fromCodePoint(ch));
        }
        return r.join("");
    }
};

// String.prototype.chars()
(String.prototype as any).chars = function() {
    return new Chars(this);
};