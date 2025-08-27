import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { Col, Row } from 'react-bootstrap';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

import MarkdownLinkRenderer from '../../components/MarkdownLinkRenderer/MarkdownLinkRenderer';

const MarkdownPage = ({ title, markdown }) => {
  const intl = useIntl();

  return (
    <>
      <Helmet
        title={title}
        meta={[
          { name: 'description', content: intl.formatMessage({ id: 'descriptionTag' }) },
          { property: 'og:description', content: intl.formatMessage({ id: 'descriptionTag' }) },
        ]}
      />
      <Row>
        <Col md={8}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLinkRenderer }}>
            {markdown}
          </ReactMarkdown>
        </Col>
      </Row>
    </>
  );
};

MarkdownPage.propTypes = {
  title: PropTypes.string,
  markdown: PropTypes.string,
};

export default MarkdownPage;
