/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tag } from 'hds-react';
import { capitalize } from 'lodash';

import getAttr from '../utils/getAttr';
import Link from './LinkWithLang';

export const Labels = (props) => {
  const { className, intl, labels, language } = props;

  /*
   * Hearing.labels
   *     Old API response: [String]
   *     New API response: [{id, label}]
   * DONE: Remove support for old styled API response when API has changed.
   */

  const labelToHTML = (label) => (
    <Link
      to={{
        path: '/hearings/list',
        search: `?label=${label.id}`,
        state: { filteredByLabelLink: true },
      }}
      key={label.id || label}
    >
      <Tag theme={{ '--tag-background': 'var(--color-fog)' }}>{capitalize(getAttr(label.label, language))}</Tag>
    </Link>
  );

  const ariaLabel = intl.formatMessage({ id: 'labelListTagsTitle' });

  return (
    <div className={className} aria-label={ariaLabel}>
      {labels?.map((label) => labelToHTML(label))}
    </div>
  );
};

Labels.propTypes = {
  labels: PropTypes.array,
  className: PropTypes.string,
  language: PropTypes.string,
  intl: PropTypes.object,
};

export default injectIntl(Labels);
