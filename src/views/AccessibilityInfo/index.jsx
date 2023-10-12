/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable global-require */
/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Col, Row, Grid } from 'react-bootstrap';
import { injectIntl, intlShape } from 'react-intl';

function getContent(language) {
  if (typeof window === 'undefined') return '';

  // Return correct file content depending on the chosen language. @city-i18n will handle correct files depending
  // on the selected themes.
  if (language === 'fi') {
    return require('@city-i18n/accessibility-info/accessibility.fi.md');
  }
  if (language === 'sv') {
    return require('@city-i18n/accessibility-info/accessibility.sv.md');
  }
  if (language === 'en') {
    return require('@city-i18n/accessibility-info/accessibility.en.md');
  }
  return 'Content not available in current language';
}

const AccessibilityInfo = (props) => {
  const pageContent = getContent(props.language);
  const { intl } = props;
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
          <div dangerouslySetInnerHTML={{ __html: pageContent }} />
        </Col>
      </Row>
    </Grid>
  );
};

AccessibilityInfo.propTypes = {
  language: PropTypes.string,
  intl: intlShape,
};

export default injectIntl(connect((state) => ({ language: state.language }))(AccessibilityInfo));
