/* eslint-disable react/no-children-prop */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import { injectIntl, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ServiceInfoFi from '@city-i18n/service-info/content.fi.md';
import ServiceInfoSv from '@city-i18n/service-info/content.sv.md';
import ServiceInfoEn from '@city-i18n/service-info/content.en.md';

function getContent(language) {
  if (typeof window === 'undefined') return '';

  // Return correct file content depending on the chosen language. @city-i18n will handle correct files depending
  // on the selected themes.
  if (language === 'fi') {
    return ServiceInfoFi;
  }
  if (language === 'sv') {
    return ServiceInfoSv;
  }
  if (language === 'en') {
    return ServiceInfoEn;
  }
  return 'Content not available in current language';
}

const Info = () => {
  const intl = useIntl();
  const content = getContent(intl.locale);

  const [markdown, setMarkdown] = useState();

  useEffect(() => {
    async function fetchData() {
      if (content) {
        const response = await fetch(content);
        const text = await response.text();

        setMarkdown(text);
      }
    }
    fetchData();
  }, [content]);

  return (
    <div className='container'>
      <Helmet
        title={intl.formatMessage({ id: 'infoPage' })}
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
    </div>
  );
};

export default injectIntl(connect()(Info));
