import { getApiURL, getApiTokenFromStorage, storeApiTokenToStorage, getBaseApiURL, apiCall} from "../api";
import config from "../config"
import { replace } from "../mockable-fetch"

const test_key = 'testiavain';

const mock_fetch = jest.fn();
beforeAll(() => {
    replace(mock_fetch);
})
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
        const test_url = getApiURL('/test_endpoint', {test_param: 'test_value'})
        const test_url2 = getApiURL('test_endpoint', {test_param: 'test_value'})
        expect(test_url).toEqual(config.apiBaseUrl + 'test_endpoint/?test_param=test_value')
        expect(test_url).toEqual(test_url2);
    });
    it('should be able to store and read api token from storage', () => {
        storeApiTokenToStorage(test_key);
        const avain = getApiTokenFromStorage();
        expect(avain).toEqual(test_key);
    });
    it('should call the mockable-fetch jest.fn', () => {
        expect(mock_fetch).not.toHaveBeenCalled();
        apiCall('testpoint');
        expect(mock_fetch).toHaveBeenCalled();
    })
});