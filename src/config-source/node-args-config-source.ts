import {ConfigSource} from './config-source';
import {AnyConfigOptions} from '../config-options/config-options';

export class NodeArgsConfigSource extends ConfigSource {

    private preparedArgs: any;

    constructor(protected options: AnyConfigOptions,
                protected target: any) {
        super(
            options,
            target,
            [
                [Array, (value, {deserializer}) => (Array.isArray(value) ? value : [value]).map(deserializer)],
                [String, value => Array.isArray(value) ? value.join(',') : value],
            ]);
        this.prepareArgs();
    }

    getValue(key: string): string {
        return this.preparedArgs[key] || '';
    }

    private prepareArgs() {
        const getIsOptionRegex = () => /^(--)|^(-)/;
        const isOption = value => getIsOptionRegex().test(value);
        const convertOptionToKey = value => value.replace(getIsOptionRegex(), '');
        const getValues = args => {
            let values: any[] = [];
            for (const arg of args) {
                if (isOption(arg)) {
                    break;
                } else {
                    values = [...values, arg];
                }
            }
            return values;
        };

        this.preparedArgs = process.argv.reduce((acc, arg, index, array) => {
            if (isOption(arg)) {
                const option = arg;
                const key = convertOptionToKey(arg);
                const nextArgIndex = index + 1;
                const values = getValues(array.slice(nextArgIndex));
                const value = values.length > 1 ? values : (values[0] || true);

                acc[key] = value;
                acc[option] = value;
            }
            return acc;
        }, {});
    }

}
