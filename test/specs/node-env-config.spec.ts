import {expect} from 'chai';
import {Config, EnvValue} from '../../';
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
            json: {
                key: 'SOME_JSON', value: {test: 'hello world'}, toString() {
                    return JSON.stringify(this.value);
                },
            },
        };
        loadProcessEnvs(db);

        interface DatabaseConfigContract {
            host: string;
            name: string;
            port: number;
            username: string;
            password: string;
            poolIds: number[];
            poolIdStrings: number;
            hostNumber: number;
            json: any;
        }

        let DatabaseConfig: {host: string, poolIds: number[]};
        let databaseConfig: DatabaseConfigContract;

        before(() => {
            @Config
            class _DatabaseConfig implements DatabaseConfigContract {
                @EnvValue(db.host.key) host: string;
                @EnvValue(db.name.key) name: string;
                @EnvValue(db.port.key) port: number;
                @EnvValue(db.username.key) username: string;
                @EnvValue(db.password.key) password: string;
                @EnvValue(db.poolIds.key, Number) poolIds: number[];

                @EnvValue(db.json.key, Object) json: any;

                // invalid
                @EnvValue(db.host.key) hostNumber: number;
                @EnvValue(db.poolIds.key) poolIdStrings: number;

                @EnvValue(db.host.key) static host: string;
                @EnvValue(db.poolIds.key, Number) static poolIds: number[];
            }

            DatabaseConfig = _DatabaseConfig;
            databaseConfig = new _DatabaseConfig();
        });

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

            expect(databaseConfig.json).to.eql(db.json.value);
            expect(databaseConfig.json).to.be.an('object');
        });

        it('should throw validation errors', () => {
            expect(() => databaseConfig.hostNumber).to.throw(ValidationError);
        });

        describe('static members', () => {

            it('should be able to load all static values with correct type', () => {
                expect(DatabaseConfig.host).to.eql(db.host.value);
                expect(DatabaseConfig.host).to.be.a('string');

                expect(DatabaseConfig.poolIds).to.eql(db.poolIds.value);
                expect(DatabaseConfig.poolIds).to.be.an('array');
                expect(DatabaseConfig.poolIds[0]).to.be.a('number');
            });

        });

        describe('default values', () => {

            const auth = {
                jwtExpiry: {
                    key: 'JWT_EXPIRY',
                    value: new Date(),
                    default: new Date(2000, 1, 1),
                    toString() {
                        return this.value.toJSON()
                    },
                },
                jwtIssuer: {
                    key: 'JWT_ISSUER',
                    value: 'type-config',
                    default: 'default-config',
                    toString() {
                        return this.value
                    },
                },
            };
            const nonSetEnvAuthVariables = {
                authTokens: {
                    key: 'AUTH_TOKENS',
                    value: ['1234', '4321'],
                    toString() {
                        return this.value.join(',')
                    },
                },
            };
            loadProcessEnvs(auth);

            @Config
            class AuthConfig {
                @EnvValue(auth.jwtExpiry.key) jwtExpiry: Date = auth.jwtExpiry.default;
                @EnvValue(nonSetEnvAuthVariables.authTokens.key) authTokens: string[] =
                    nonSetEnvAuthVariables.authTokens.value;

                @EnvValue(auth.jwtIssuer.key) static jwtIssuer: string = auth.jwtIssuer.default;
                @EnvValue(nonSetEnvAuthVariables.authTokens.key) static authTokens: string[] =
                    nonSetEnvAuthVariables.authTokens.value;
            }
            const authConfig = new AuthConfig();

            it('should overwrite default value', () => {
                expect(authConfig.jwtExpiry).to.eql(auth.jwtExpiry.value);
            });

            it('should not throw despite of env var is missing due to default value is set', () => {
                expect(() => authConfig.authTokens).to.not.throw();
                expect(authConfig.authTokens).to.eql(nonSetEnvAuthVariables.authTokens.value);
            });

            describe('static members', () => {

                it('should overwrite default value of static member', () => {
                    expect(AuthConfig.jwtIssuer).to.eql(auth.jwtIssuer.value);
                });

                it('should not throw despite of env var is missing due to default value is set', () => {
                    expect(() => AuthConfig.authTokens).to.not.throw();
                    expect(AuthConfig.authTokens).to.eql(nonSetEnvAuthVariables.authTokens.value);
                });

            });

        });

    });

});