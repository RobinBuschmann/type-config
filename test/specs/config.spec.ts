import {expect} from 'chai';
import {Config} from '../../src/decorators/config';
import {Value} from '../../src/type-config';

describe('config', () => {

    it('should make instance of config spreadable', () => {
        process.env.A = '1';
        process.env.C = '3';

        @Config
        class TestConfig {
            @Value('A') a: string;
            @Value('B') b: string = '2';
            @Value('C') c: number;
        }
        const testConfig = new TestConfig();
        const copy = {...testConfig};

        expect(copy).to.eql({a: '1', b: '2', c: 3});
    });

});
