import {buildDecorators, ArgsValue, EnvValue, Value, JsonValue} from '../src/type-config';
import {ConfigSource} from '../src/config-source/config-source';
import {JsonConfiguration} from '../src/config-source/json-config-source';

console.log(process.argv);

const DB_NAME_KEY = 'DB_NAME';
const DB_NAME_VALUE = 'test';
process.env[DB_NAME_KEY] = DB_NAME_VALUE;

const DB_TIMEOUT_KEY = 'DB_TIMEOUT';
const DB_TIMEOUT_VALUE = 1111;
process.env[DB_TIMEOUT_KEY] = String(DB_TIMEOUT_VALUE);

const DB_USERS_KEY = 'DB_USERS';
const DB_USERS_VALUE = ['a', 'b'];
process.env[DB_USERS_KEY] = DB_USERS_VALUE.join(',');

const DB_USER_IDS_KEY = 'DB_USER_IDS';
const DB_USER_IDS_VALUE = [1, 2];
process.env[DB_USER_IDS_KEY] = DB_USER_IDS_VALUE.join(',');

const {ArgsValue: InstantArgsValue, FromCustom} = buildDecorators({
    lazyLoad: false,
    warnOnly: true,
    decoratorMeta: {
        FromCustom: class extends ConfigSource {
            config =  {
                test: 'test',
            };
            getValue(key) {
                return this.config[key];
            }
            hasValue(key) {
                return !!this.config[key];
            }
            hasKey(key) {
                return key in this.config;
            }

            deserialize(type: any, value: string, additionalType?: any): any {
                return value;
            }
        }
    }
});

@JsonConfiguration(__dirname + '/config.json')
class DBConfig {

    @Value(DB_NAME_KEY)
    name: string;

    @JsonValue('database.host')
    host: string;

    @Value(DB_TIMEOUT_KEY)
    timeout: number;

    @EnvValue(DB_USERS_KEY)
    users: string[];

    @Value(DB_USER_IDS_KEY, Number)
    userIds: number[] = [4,5];

    @ArgsValue('test')
    test: string[];

    @InstantArgsValue('test')
    instantTest: string[];

    @ArgsValue('test2')
    test2: boolean = true;

    @ArgsValue('indexes', Number)
    indexes: number[];

    @ArgsValue('test')
    static test: string[];

    @FromCustom('test')
    fromCustom: string;

}


const config = new DBConfig();

// Spreading before reading
console.log('SPREADING BEFORE', {...config});

console.log('name           ', config.name, typeof config.name, eqls(config.name, DB_NAME_VALUE));
console.log('host           ', config.host, typeof config.host);
console.log('timeout        ', config.timeout, typeof config.timeout, eqls(config.timeout, DB_TIMEOUT_VALUE));
console.log('users          ', config.users, typeof config.users, eqls(config.users, DB_USERS_VALUE));
console.log('userIds        ', config.userIds, typeof config.userIds, eqls(config.userIds, DB_USER_IDS_VALUE));

console.log('static test    ', DBConfig.test, typeof DBConfig.test);
// console.log('instance test  ', config.instantTest, typeof config.instantTest);
console.log('test           ', config.test, typeof config.test);
console.log('test2          ', config.test2, typeof config.test2);
console.log('indexes        ', config.indexes, typeof config.indexes);

console.log('bla            ', config.fromCustom, typeof config.fromCustom);

// Overwrite
config.indexes = [8,9];
DBConfig.test = ['bla'];
console.log('indexes        ', config.indexes, typeof config.indexes);
console.log('static test    ', DBConfig.test, typeof DBConfig.test);

// Spreading after reading
console.log('SPREADING AFTER', {...config});

function eqls(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
