// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';

export function getFeedbackEmailUrl(language) {
  if (language === 'en') {
    return urls.feedbackEmailEN;
  }

  if (language === 'sv') {
    return urls.feedbackEmailSV;
  }

  return urls.feedbackEmailFI;
}

export function getFeedbackUrl(language) {
  if (language === 'en') {
    return urls.feedbackEN;
  }

  if (language === 'sv') {
    return urls.feedbackSV;
  }

  return urls.feedbackFI;
};

export function getDataProtectionUrl(language) {
  if (language === 'sv') {
    return urls.dataProtectionSV;
  }

  if (language === 'en') {
    return urls.dataProtectionEN;
  }

  return urls.dataProtectionFI;
}
