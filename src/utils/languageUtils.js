// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';

export function getFeedbackUrl(language) {
  if (language === 'en') {
    return urls.feedbackEN;
  } else if (language === 'sv') {
    return urls.feedbackSV;
  }

  return urls.feedbackFI;
}

export default getFeedbackUrl;
