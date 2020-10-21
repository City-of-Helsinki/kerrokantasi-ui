// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';
import {getFeedbackUrl} from '../../src/utils/languageUtils';

describe('languageUtils', () => {
  describe('getFeedbackUrl', () => {
    test('returns correct url when language param is en', () => {
      expect(getFeedbackUrl('en')).toBe(urls.feedbackEN);
    });

    test('returns correct url when language param is sv', () => {
      expect(getFeedbackUrl('sv')).toBe(urls.feedbackSV);
    });

    test('returns correct url when language param is fi', () => {
      expect(getFeedbackUrl('fi')).toBe(urls.feedbackFI);
    });

    test('returns finnish url when language param is not en or sv', () => {
      expect(getFeedbackUrl('abc')).toBe(urls.feedbackFI);
      expect(getFeedbackUrl('')).toBe(urls.feedbackFI);
      expect(getFeedbackUrl('1')).toBe(urls.feedbackFI);
      expect(getFeedbackUrl()).toBe(urls.feedbackFI);
      expect(getFeedbackUrl(3)).toBe(urls.feedbackFI);
    });
  });
});
