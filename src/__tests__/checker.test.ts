import { DefaultConfig } from './../@types/Config';
import { verify, resolveExchangeServers, verifyExistence } from '../index';

const EMAIL_NOT_EXIST: string = 'emailthatshouldnotexist.99@gmail.com';

afterAll(async (done) => {
    done();
});

describe('Testing resolveExchangeServers method', () => {
    test('Find hosts for gmail.com', async (done) => {
        const addresses = await resolveExchangeServers('gmail.com')
        expect(addresses.length).toBeGreaterThan(0);
        done();
    });
});

describe('Testing verify method', () => {

    test('Email should exist', async (done) => {
        try {
            const res = await verify(DefaultConfig);
            expect(res.success).toBe(true);
            done();
        } catch (error) {
            done(error);
        }
    });

    test('Email should NOT exist', async (done) => {
        try {
            const res = await verify({ ...DefaultConfig, email: EMAIL_NOT_EXIST });
            expect(res.success).toBe(false);
            done();
        } catch (error) {
            done(error);
        }
    });
});

describe('Testing verifyExistance method', () => {

    test('Email should exist', async (done) => {
        try {
            const res = await verifyExistence(DefaultConfig.email);
            expect(res.success).toBe(true);
            done();
        } catch (error) {
            done(error);
        }
    });

    test('Email should NOT exist', async (done) => {
        try {
            const res = await verifyExistence(EMAIL_NOT_EXIST);
            expect(res.success).toBe(false);
            done();
        } catch (error) {
            done(error);
        }
    });

});

