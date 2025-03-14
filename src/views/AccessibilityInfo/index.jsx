/* eslint-disable react/no-children-prop */
/* eslint-disable import/no-unresolved */
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AccessibilityFi from '@city-i18n/accessibility-info/accessibility.fi.md';
import AccessibilitySv from '@city-i18n/accessibility-info/accessibility.sv.md';
import AccessibilityEn from '@city-i18n/accessibility-info/accessibility.en.md';

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
    <Grid className='accessibility-page'>
      <Helmet
        title={intl.formatMessage({ id: 'accessibilityPage' })}
        meta={[
          { name: 'description', content: intl.formatMessage({ id: 'descriptionTag' }) },
          { property: 'og:description', content: intl.formatMessage({ id: 'descriptionTag' }) },
        ]}
      />
      <Row>
        <Col md={8}>
          <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
        </Col>
      </Row>
    </Grid>
  );
};

export default connect()(AccessibilityInfo);
