(globalThis as any).Enum = function Enum(variants: any, methods: any = null): any {
    const fn = (key: any) => key;

    fn.valueOf = (key: any): any => variants[key];
    fn.variants = () => Array.from(Object.keys(variants));
    fn.from = (arg: any): any => {
        if (typeof arg == "string") {
            const v = typeof (variants as any)[arg];
            return v == "number" || v == "bigint" ? arg : null;
        }
        if (typeof arg == "number" || typeof arg == "bigint") {
            return Object.entries(variants).find(([k, v]) => v === arg)?.[0] ?? null;
        }
        return null;
    };
    if (methods) {
        Object.assign(fn, methods);
    }

    return fn;
};