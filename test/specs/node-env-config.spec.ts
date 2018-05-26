import {expect} from 'chai';
import {Value} from '../../';
import {ValidationError} from '../../src/validation/validation-error';

describe('node-env-config', () => {

    const loadProcessEnvs = (config) => Object
        .keys(config)
        .forEach((key, i, a, variable = config[key]) => process.env[variable.key] = variable.toString());

    describe('proper configuration', () => {

        const db = {
            host: {
                key: 'DB_HOST', value: 'localhost', toString() {
                    return this.value
                },
            },
            name: {
                key: 'DB_NAME', value: 'type-config', toString() {
                    return this.value
                },
            },
            port: {
                key: 'DB_PORT', value: 1234, toString() {
                    return String(this.value)
                },
            },
            username: {
                key: 'DB_USERNAME', value: 'bear', toString() {
                    return this.value
                },
            },
            password: {
                key: 'DB_PASSWORD', value: 'honey', toString() {
                    return this.value
                },
            },
            poolIds: {
                key: 'DB_POOLIDS', value: [13, 32, 46], toString() {
                    return this.value.join(',')
                },
            },
        };
        loadProcessEnvs(db);

        class DatabaseConfig {
            @Value(db.host.key) host: string;
            @Value(db.name.key) name: string;
            @Value(db.port.key) port: number;
            @Value(db.username.key) username: string;
            @Value(db.password.key) password: string;
            @Value(db.poolIds.key, Number) poolIds: number[];

            // invalid
            @Value(db.host.key) hostNumber: number;
            @Value(db.poolIds.key) poolIdStrings: number;
        }

        const databaseConfig = new DatabaseConfig();

        it('should be able to load all values with correct type', () => {

            expect(databaseConfig.host).to.eql(db.host.value);
            expect(databaseConfig.host).to.be.a('string');

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