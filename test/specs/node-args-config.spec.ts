import {expect} from 'chai';
import {ArgsValue} from '../../';
import {ValidationError} from '../../src/validation/validation-error';

describe('node-args-config', () => {

    const loadProcessArgvs = config => Object.keys(config)
        .forEach((key, i, a, variable = config[key]) => {
            const makeOptionKey = key => `--${key}`;
            if (variable.value !== false) {
                process.argv.push(makeOptionKey(variable.key));
            }
            if (Array.isArray(variable.value)) {
                variable.value.forEach(value => process.argv.push(String(value)));
            } else if (typeof variable.value !== 'boolean') {
                process.argv.push(String(variable.value));
            }
        });

    describe('proper configuration', () => {

        const db = {
            host: {
                key: 'host',
                value: 'localhost',
            },
            logging: {
                key: 'logging',
                value: true,
            },
            warning: {
                key: 'warning',
                value: false,
            },
            name: {
                key: 'name',
                value: 'type-config',
            },
            port: {
                key: 'port',
                value: 1234,
            },
            username: {
                key: 'username',
                value: 'bear',
            },
            password: {
                key: 'password',
                value: 'honey',
            },
            poolIds: {
                key: 'pool-ids',
                value: [13, 32, 46],
            },
        };
        loadProcessArgvs(db);

        class DatabaseConfig {
            @ArgsValue(db.host.key) host: string;
            @ArgsValue(db.logging.key) logging: boolean;
            @ArgsValue(db.warning.key) warning: boolean;
            @ArgsValue(db.name.key) name: string;
            @ArgsValue(db.port.key) port: number;
            @ArgsValue(db.username.key) username: string;
            @ArgsValue(db.password.key) password: string;
            @ArgsValue(db.poolIds.key, Number) poolIds: number[];

            // invalid
            @ArgsValue(db.host.key) hostNumber: number;
            @ArgsValue(db.poolIds.key) poolIdStrings: number;
        }

        const databaseConfig = new DatabaseConfig();

        it('should be able to load all values with correct type', () => {

            expect(databaseConfig.host).to.eql(db.host.value);
            expect(databaseConfig.host).to.be.a('string');

            expect(databaseConfig.logging).to.eql(db.logging.value);
            expect(databaseConfig.logging).to.be.a('boolean');

            expect(databaseConfig.warning).to.eql(db.warning.value);
            expect(databaseConfig.warning).to.be.a('boolean');

            expect(databaseConfig.name).to.eql(db.name.value);
            expect(databaseConfig.name).to.be.a('string');

            expect(databaseConfig.port).to.eql(db.port.value);
            expect(databaseConfig.port).to.be.a('number');

            expect(databaseConfig.username).to.eql(db.username.value);
            expect(databaseConfig.username).to.be.a('string');

            expect(databaseConfig.password).to.eql(db.password.value);
            expect(databaseConfig.password).to.be.a('string');

            expect(databaseConfig.poolIds).to.eql(db.poolIds.value);
            expect(databaseConfig.poolIds).to.be.an('array');
            expect(databaseConfig.poolIds[0]).to.be.a('number');
        });

        it('should throw validation errors', () => {
            expect(() => databaseConfig.hostNumber).to.throw(ValidationError);
        });

    });

});