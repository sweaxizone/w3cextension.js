// isXMLName
function isXMLName(argument: string): boolean {
    argument = String(argument);
    return /[a-z_][a-z_0-9.\-]*/i.test(argument);
}
(globalThis as any).isXMLName = isXMLName;

// Namespace
(globalThis as any).Namespace = class Namespace {
    _prefix: string = "";
    _uri: string = "";

    // Namespace(uri:*)
    // Namespace(prefix:*, uri:*)
    constructor(arg1: any = undefined, arg2: any = undefined) {
        if (arg2 === undefined || arg2 === null) {
            if (arg1 instanceof Namespace) {
                this._uri = (arg1 as Namespace).uri;
            } else if (arg1 instanceof QName) {
                this._uri = (arg1 as QName).uri ?? "";
            } else {
                this._uri = String(arg1);
            }
        } else {
            // arg1 = prefixValue
            if (arg1 === undefined && !isXMLName(arg1)) {
                this._prefix = "undefined";
            } else {
                this._prefix = String(arg1);
            }

            // arg2 = uriValue
            if (arg2 instanceof QName) {
                this._uri = (arg2 as QName).uri ?? "";
            } else {
                this._uri = String(arg2);
            }
        }
    }

    get prefix(): string {
        return this._prefix;
    }
    set prefix(val) {
        this._prefix = String(val);
    }

    get uri(): string {
        return this._uri;
    }
    set uri(val) {
        this._uri = String(val);
    }

    toString() {
        return this._uri;
    }

    valueOf() {
        return this._uri;
    }
};

// QName
(globalThis as any).QName = class QName {
    _uri: null | string = null;
    _localName: string = "";

    // QName(qname:*)
    // QName(uri:*, localName:*)
    constructor(arg1: any = undefined, arg2: any = undefined) {
        // QName(qname:*)
        if (arg2 === undefined || arg2 === null) {
            if (arg1 === undefined || arg1 === null) {
                this._localName = "";
            } else if (arg1 instanceof QName) {
                this._uri = (arg1 as QName).uri;
                this._localName = (arg1 as QName).localName;
            } else {
                this._localName = String(arg1);
            }
        // QName(uri:*, localName:*)
        } else {
            if (arg1 !== undefined && arg1 !== null) {
                if (arg1 instanceof Namespace) {
                    this._uri = (arg1 as Namespace).uri;
                } else {
                    this._uri = String(arg1);
                }
            }

            if (arg2 instanceof QName) {
                this._localName = (arg2 as QName).localName;
            } else {
                this._localName = String(arg2);
            }
        }
    }

    get localName(): string {
        return this._localName;
    }

    // null = wildcard (*)
    get uri(): null | string {
        return this._uri;
    }

    toString(): string {
        const { uri, localName } = this;
        return uri === "" ? localName : uri === null ? "*::" + localName : uri + "::" + localName;
    }

    valueOf(): QName {
        return this;
    }
};