export const Config = <T extends new(...args: any[]) => object>(target: T) =>
    class extends target {
        constructor(...args: any[]) {
            super(...args);
            makeItSpreadable(target, this);
        }
    };

const makeItSpreadable = (target, configInstance) =>
    Object.keys(target.prototype)
        .forEach(key => Object.defineProperty(configInstance, key, {
                enumerable: true,
                get() {
                    return target.prototype[key];
                },
                set(value) {
                    target.prototype[key] = value;
                },
            },
        ));
