// EventRecord
(globalThis as any).EventRecord = Symbol("http://sweaxizone.com/javascript/EventRecord");

// SAEventTarget
(globalThis as any).SAEventTarget = class SAEventTarget {
    //
    private m_eventTarget: globalThis.EventTarget = new globalThis.EventTarget();

    //
    public on(type: any, listener: any, options: any = undefined): void {
        const new_options = typeof options == "object"
            ? { capture: options!.capture }
            : options;
        this.m_eventTarget.addEventListener(type, listener as any, new_options);
    }

    //
    public off(type: any, listener: any, options: any = undefined): void {
        const new_options = typeof options == "object"
            ? { capture: options!.capture }
            : options;
        this.m_eventTarget.removeEventListener(type, listener as any, new_options);
    }

    //
    public emit(arg1: any, arg2?: any, arg3?: any): boolean {
        let event: null | Event = null;
        if (arg1 instanceof Event) {
            event = arg1;
        } else {
            event = typeof arg3 !== "undefined" ?
                new arg2(arg1, arg3) :
                new arg2(arg1);
        }

        return this.m_eventTarget.dispatchEvent(event!);
    }
}