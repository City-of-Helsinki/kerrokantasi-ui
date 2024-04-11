import { before } from "lodash";
import { getApiURL, getApiTokenFromStorage, storeApiTokenToStorage, getBaseApiURL, apiCall, get, post, put, patch} from "../api";
import config from "../config"
import { replace } from "../mockable-fetch"
import { beforeEach } from "node:test";

const testKey = 'testiavain';

const mockFetch = jest.fn();
beforeAll(() => {
    replace(mockFetch);
})
afterEach(() => {
    jest.clearAllMocks();
});
afterAll(() => {
    replace(false);
})

describe('Api utility functions', () => {
    it('should return same base api url with or without / at the end', () => {
        const test1 = getBaseApiURL('https://testaddress.com/')
        const test2 = getBaseApiURL('https://testaddress.com')
        const test3 = getBaseApiURL('https://testaddress.com/api')
        const test4 = getBaseApiURL('https://testaddress.com/api/')
        expect(test1).toEqual(test2);
        expect(test3).toEqual(test4);
    })
    it('should be able to return correct API url', () => {
        const testUrl = getApiURL('/test_endpoint', {test_param: 'test_value'})
        const testUrl2 = getApiURL('test_endpoint', {test_param: 'test_value'})
        expect(testUrl).toEqual(`${config.apiBaseUrl  }test_endpoint/?test_param=test_value`)
        expect(testUrl).toEqual(testUrl2);
    });
    it('should be able to store and read api token from storage', () => {
        storeApiTokenToStorage(testKey);
        const avain = getApiTokenFromStorage();
        expect(avain).toEqual(testKey);
    });
    it('should call the mockable-fetch jest.fn', () => {
        expect(mockFetch).not.toHaveBeenCalled();
        apiCall('testpoint');
        expect(mockFetch).toHaveBeenCalled();
    })
    it('should call fetch at the end of all types of calls', () => {
        get('testurl');
        post('testurl', {test_data: 'test_value'});
        put('testurl', {test_data: 'test_value'});
        patch('testurl', {test_data: 'test_value'});
        expect(mockFetch).toHaveBeenCalledTimes(4);
    })
});