import {use, expect} from 'chai';
import {SinonStub, stub} from 'sinon';
import * as sinonChai from 'sinon-chai';
import {buildDecorators} from '../../src/type-config';
import {ConfigSource} from '../../src/config-source/config-source';

use(sinonChai);

describe('custom-config', () => {
    let getValueStub: SinonStub | undefined;
    let deserializeStub: SinonStub | undefined;

    class CustomSource extends ConfigSource {
        getValue(identifier: string): string | undefined {
            return 'some-value';
        }
    }

    const createClass = Value => {
        class Config {
            @Value('some-identifier') test?: string;
        }

        return Config;
    };
    const createConfig = Value => {
        const Config = createClass(Value);
        return new Config();
    };

    afterEach(() => {
        if (getValueStub) {
            getValueStub.restore();
        }
        if (deserializeStub) {
            deserializeStub.restore();
        }
    });

    describe('validate', () => {

        describe('global options', () => {

            describe('set to false', () => {

                const {CustomValue} = buildDecorators({
                    validate: false,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should not throw despite of invalidate data', () => {
                    deserializeStub = stub(CustomSource.prototype, 'deserialize')
                        .callsFake(() => 1234);
                    const config = createConfig(CustomValue);
                    expect(() => config.test).not.to.throw();
                });

            });

            describe('set to true', () => {

                const {CustomValue} = buildDecorators({
                    validate: true,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should throw due to invalid data', () => {
                    deserializeStub = stub(CustomSource.prototype, 'deserialize')
                        .callsFake(() => 1234);
                    const config = createConfig(CustomValue);
                    expect(() => config.test).to.throw();
                });

            });

        });

        describe('decorator options', () => {

            describe('set to true (globally false)', () => {

                const {CustomValue} = buildDecorators({
                    validate: false,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should throw due to invalid data', () => {
                    deserializeStub = stub(CustomSource.prototype, 'deserialize')
                        .callsFake(() => 1234);
                    const config = createConfig(key => CustomValue({id: key, validate: true}));
                    expect(() => config.test).to.throw();
                });

            });

            describe('set to false (globally true)', () => {

                const {CustomValue} = buildDecorators({
                    validate: true,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should not throw despite of invalid data', () => {
                    deserializeStub = stub(CustomSource.prototype, 'deserialize')
                        .callsFake(() => 1234);
                    const config = createConfig(key => CustomValue({id: key, validate: false}));
                    expect(() => config.test).to.not.throw();
                });

            });

        });

    });

    describe('lazyLoad', () => {

        describe('global options', () => {

            describe('set to false', () => {

                const {CustomValue} = buildDecorators({
                    lazyLoad: false,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should load values immediately', () => {
                    getValueStub = stub(CustomSource.prototype, 'getValue').callsFake(() => 'some-value');
                    createClass(CustomValue);
                    expect(getValueStub).to.be.called;
                });

            });

            describe('set to true', () => {

                const {CustomValue} = buildDecorators({
                    lazyLoad: true,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should not load values', () => {
                    getValueStub = stub(CustomSource.prototype, 'getValue').callsFake(() => 'some-value');
                    createClass(CustomValue);
                    expect(getValueStub).to.be.not.called;
                });

            });

        });

        describe('decorator options', () => {

            describe('set to true (globally false)', () => {

                const {CustomValue} = buildDecorators({
                    lazyLoad: false,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should not load values', () => {
                    getValueStub = stub(CustomSource.prototype, 'getValue').callsFake(() => 'some-value');
                    createClass(key => CustomValue({id: key, lazyLoad: true}));
                    expect(getValueStub).not.to.be.called;
                });

            });

            describe('set to false (globally true)', () => {

                const {CustomValue} = buildDecorators({
                    lazyLoad: true,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should load values immediately', () => {
                    getValueStub = stub(CustomSource.prototype, 'getValue').callsFake(() => 'some-value');
                    createClass(key => CustomValue({id: key, lazyLoad: false}));
                    expect(getValueStub).to.be.called;
                });

            });

        });

    });

    describe('required', () => {

        describe('global options', () => {

            describe('set to false', () => {

                const {CustomValue} = buildDecorators({
                    required: false,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should not throw even if value is not defined', () => {
                    stub(CustomSource.prototype, 'getValue').callsFake(() => undefined);
                    const config = createConfig(CustomValue);
                    expect(() => config.test).not.to.throw();
                });

            });

            describe('set to true', () => {

                const {CustomValue} = buildDecorators({
                    required: true,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should throw if value is not defined', () => {
                    getValueStub = stub(CustomSource.prototype, 'getValue').callsFake(() => undefined);
                    const config = createConfig(CustomValue);
                    expect(() => config.test).to.throw();
                });

            });

        });

        describe('decorator options', () => {

            describe('set to true (globally false)', () => {

                const {CustomValue} = buildDecorators({
                    required: false,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should throw if value is not defined', () => {
                    getValueStub = stub(CustomSource.prototype, 'getValue').callsFake(() => undefined);
                    const config = createConfig(key => CustomValue({id: key, required: true}));
                    expect(() => config.test).to.throw();
                });

            });

            describe('set to false (globally true)', () => {

                const {CustomValue} = buildDecorators({
                    required: true,
                    decoratorMeta: {
                        CustomValue: CustomSource,
                    },
                });

                it('should not throw even if value is not defined', () => {
                    stub(CustomSource.prototype, 'getValue').callsFake(() => undefined);
                    const config = createConfig(key => CustomValue({id: key, required: false}));
                    expect(() => config.test).not.to.throw();
                });

            });

        });

    });

});