// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';

import { getFeedbackEmailUrl, getFeedbackUrl } from '../languageUtils';

describe('languageUtils', () => {
  describe('getFeedbackUrl', () => {
    it('returns correct url when language param is en', () => {
      expect(getFeedbackUrl('en')).toBe(urls.feedbackEN);
    });

    it('returns correct url when language param is sv', () => {
      expect(getFeedbackUrl('sv')).toBe(urls.feedbackSV);
    });

    it('returns correct url when language param is fi', () => {
      expect(getFeedbackUrl('fi')).toBe(urls.feedbackFI);
    });

    it('returns finnish url when language param is not en or sv', () => {
      expect(getFeedbackUrl('abc')).toBe(urls.feedbackFI);
      expect(getFeedbackUrl('')).toBe(urls.feedbackFI);
      expect(getFeedbackUrl('1')).toBe(urls.feedbackFI);
      expect(getFeedbackUrl()).toBe(urls.feedbackFI);
      expect(getFeedbackUrl(3)).toBe(urls.feedbackFI);
    });
  });

  describe('getFeedbackEmailUrl', () => {
    it('returns correct url when language param is en', () => {
      expect(getFeedbackEmailUrl('en')).toBe(urls.feedbackEmailEN);
    });

    it('returns correct url when language param is sv', () => {
      expect(getFeedbackEmailUrl('sv')).toBe(urls.feedbackEmailSV);
    });

    it('returns correct url when language param is fi', () => {
      expect(getFeedbackEmailUrl('fi')).toBe(urls.feedbackEmailFI);
    });

    it('returns finnish url when language param is not en or sv', () => {
      expect(getFeedbackEmailUrl('abc')).toBe(urls.feedbackEmailFI);
      expect(getFeedbackEmailUrl('')).toBe(urls.feedbackEmailFI);
      expect(getFeedbackEmailUrl('1')).toBe(urls.feedbackEmailFI);
      expect(getFeedbackEmailUrl()).toBe(urls.feedbackEmailFI);
      expect(getFeedbackEmailUrl(3)).toBe(urls.feedbackEmailFI);
    });
  });
});
