/* eslint-disable import/no-unresolved */
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';
import AccessibilityFi from '@city-i18n/accessibility-info/accessibility.fi.md';
import AccessibilitySv from '@city-i18n/accessibility-info/accessibility.sv.md';
import AccessibilityEn from '@city-i18n/accessibility-info/accessibility.en.md';

import MarkdownPage from '../../components/MarkdownPage/MarkdownPage';

function getContent(language) {
  if (typeof window === 'undefined') return '';

  // Return correct file content depending on the chosen language. @city-i18n will handle correct files depending
  // on the selected themes.
  if (language === 'fi') {
    return AccessibilityFi;
  }
  if (language === 'sv') {
    return AccessibilitySv;
  }
  if (language === 'en') {
    return AccessibilityEn;
  }
  return 'Content not available in current language';
}

const AccessibilityInfo = () => {
  const intl = useIntl();
  const { locale } = intl;

  const pageContent = getContent(locale);

  const [markdown, setMarkdown] = useState();

  useEffect(() => {
    async function fetchData() {
      if (pageContent) {
        const response = await fetch(pageContent);
        const text = await response.text();

        setMarkdown(text);
      }
    }
    fetchData();
  }, [pageContent]);
  return (
    <div className='container accessibility-page'>
      <MarkdownPage title={intl.formatMessage({ id: 'accessibilityPage' })} markdown={markdown} />
    </div>
  );
};

export default connect()(AccessibilityInfo);
