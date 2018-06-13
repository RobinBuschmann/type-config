import {expect} from 'chai';
import {buildDecorators, Config, JsonConfig, JsonValue} from '../../';
import config = require('../assets/config.json');
import {JsonConfigDecoratorMissingError} from '../../src/config-source/json-config/json-config-decorator-missing-error';
import {JsonConfigDecoratorFilepathError} from '../../src/config-source/json-config/json-config-decorator-filepath-error';
import {ValueMissingError} from '../../src/config-value/value-missing-error';
import {ValidationError} from '../../src/validation/validation-error';

const JSON_CONFIG_PATH = `${__dirname}/../assets/config.json`;

describe('json-config', () => {

    describe('proper configuration', () => {

        interface DatabaseConfigContract {
            host: string;
            name: string;
            port: number;
            username: string;
            password: string;
            poolIds: number[];
            hostNumber: number;
            poolIdStrings: string;
        }

        let databaseConfig: DatabaseConfigContract;

        before(() => {
            @Config
            @JsonConfig(JSON_CONFIG_PATH)
            class DatabaseConfig implements DatabaseConfigContract {
                @JsonValue('database.host') host: string;
                @JsonValue('database.name') name: string;
                @JsonValue('database.port') port: number;
                @JsonValue('database.username') username: string;
                @JsonValue('database.password') password: string;
                @JsonValue('database.poolIds', Number) poolIds: number[];

                // invalid
                @JsonValue('database.host') hostNumber: number;
                @JsonValue('database.poolIds') poolIdStrings: string;
            }
            databaseConfig = new DatabaseConfig();
        });

        it('should be able to load all values with correct type', () => {

            expect(databaseConfig.host).to.eql(config.database.host);
            expect(databaseConfig.host).to.be.a('string');

            expect(databaseConfig.name).to.eql(config.database.name);
            expect(databaseConfig.name).to.be.a('string');

            expect(databaseConfig.port).to.eql(config.database.port);
            expect(databaseConfig.port).to.be.a('number');

            expect(databaseConfig.username).to.eql(config.database.username);
            expect(databaseConfig.username).to.be.a('string');

            expect(databaseConfig.password).to.eql(config.database.password);
            expect(databaseConfig.password).to.be.a('string');

            expect(databaseConfig.poolIds).to.eql(config.database.poolIds);
            expect(databaseConfig.poolIds).to.be.an('array');
            expect(databaseConfig.poolIds[0]).to.be.a('number');
        });

        it('should throw validation errors', () => {

            expect(() => databaseConfig.hostNumber).to
                .throw(ValidationError);
            expect(() => databaseConfig.poolIdStrings).to
                .throw(ValidationError);
        });

    });

    describe('JsonConfiguration decorator', () => {

        it('should throw due to missing decorator', () => {
            @Config
            class DatabaseConfig {
                @JsonValue('database.host') host: string;
            }

            const databaseConfig = new DatabaseConfig();

            expect(() => databaseConfig.host).to
                .throw(JsonConfigDecoratorMissingError, `JsonConfiguration" decorator is missing on class "${DatabaseConfig.name}`);
        });

        it('should throw wrong json config path', () => {
            @Config
            @JsonConfig('./wrong-path')
            class DatabaseConfig {
                @JsonValue('database.host') host: string;
            }

            const databaseConfig = new DatabaseConfig();

            expect(() => databaseConfig.host).to
                .throw(JsonConfigDecoratorFilepathError, `File path "./wrong-path" is wrong in "JsonConfiguration" decorator` +
                    ` of class "${DatabaseConfig.name}"`);
        });

    });

    describe('non existing properties in json', () => {

        const TEST_BLA_PATH = 'test.bla';
        const DATABASE_PORT_TEST_PATH = 'database.port.test';

        it('should throw due to loading from non existing config properties', () => {
            @Config
            @JsonConfig(JSON_CONFIG_PATH)
            class TestConfig {
                @JsonValue(TEST_BLA_PATH) bla: string;
                @JsonValue(DATABASE_PORT_TEST_PATH) test: string;
            }

            const testConfig = new TestConfig();

            expect(() => testConfig.bla).to
                .throw(ValueMissingError, `Value of config key "${TEST_BLA_PATH}" is missing on TestConfig.bla`);
            expect(() => testConfig.test).to
                .throw(ValueMissingError, `Value of config key "${DATABASE_PORT_TEST_PATH}" is missing on TestConfig.test`);
        });

    });

    describe('custom options', () => {

        describe('lazyLoad: false', () => {

            const {JsonValue} = buildDecorators({lazyLoad: false});

            it('should throw due to lazyLoad is false', () => {
                expect(() => {
                    @Config
                    @JsonConfig(JSON_CONFIG_PATH)
                    class DatabaseConfig {
                        @JsonValue('database.host') host: string;
                    }
                    new DatabaseConfig();
                }).to.throw('"lazyLoad" need to be true to work properly with JsonConfig');
            })

        });

    });

});