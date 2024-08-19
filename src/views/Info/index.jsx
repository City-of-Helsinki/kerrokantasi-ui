/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import { injectIntl, useIntl } from 'react-intl';
import Helmet from 'react-helmet';

function getContent(language) {
  if (typeof window === 'undefined') return '';

  // Return correct file content depending on the chosen language. @city-i18n will handle correct files depending
  // on the selected themes.
  if (language === 'fi') {
    return require('@city-i18n/service-info/content.fi.md');
  }
  if (language === 'sv') {
    return require('@city-i18n/service-info/content.sv.md');
  }
  if (language === 'en') {
    return require('@city-i18n/service-info/content.en.md');
  }
  return 'Content not available in current language';
}

const Info = () => {
  const intl = useIntl();
  const content = getContent(intl.locale);
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
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Col>
      </Row>
    </div>
  );
};

export default injectIntl(connect()(Info));
