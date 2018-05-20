import 'reflect-metadata';
import {ConfigOptions} from './config-options/config-options.interface';
import {ConfigSource} from './config-source/config-source.model';
import {NodeEnvConfigSource} from './config-source/node-env-config-source.model';
import {NodeArgsConfigSource} from './config-source/node-args-config-source.model';
import {TypeValidator} from './type-validator';
import {ConfigValue} from './config-value';

export type ValueDecorator = (envKey: string, arrayType?: any) => PropertyDecorator;
type DecoratorMeta = [keyof TypeConfig, ConfigSource];

export class TypeConfig {

    Value: ValueDecorator;
    ArgsValue: ValueDecorator;
    EnvValue: ValueDecorator;

    private valueDecoratorMeta: Array<DecoratorMeta>;
    private typeValidator = new TypeValidator();

    constructor(private options: ConfigOptions) {
        this.valueDecoratorMeta = [
            ['Value', new options.defaultConfigSource()],
            ['EnvValue', new NodeEnvConfigSource()],
            ['ArgsValue', new NodeArgsConfigSource()],
        ];
        this.initDecorators();
    }

    private initDecorators() {
        this.valueDecoratorMeta.forEach(meta => this.createDecorator(meta));
    }

    private createDecorator([key, configSource]: DecoratorMeta) {
        this[key] = (
            (configKey: string, additionalType?: any): PropertyDecorator =>
                (target, propertyKey) => {
                    new ConfigValue(this.typeValidator, {
                        propertyKey,
                        target,
                        additionalType,
                        configKey,
                        configSource,
                        configOptions: this.options,
                    })
                }
        ) as any;
    }

}

