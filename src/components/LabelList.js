import React from 'react';
import PropTypes from 'prop-types';
import Label from 'react-bootstrap/lib/Label';
import getAttr from '../utils/getAttr';
import Link from './LinkWithLang';
import { injectIntl, intlShape } from 'react-intl';

export class Labels extends React.Component {
  render() {
    const {
      className,
      intl,
      labels,
      language
    } = this.props;

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
          state: { filteredByLabelLink: true }
        }}
        key={label.id || label}
      >
        <Label bsStyle="info">{getAttr(label.label, language)}</Label>{' '}
      </Link>
    );

    const ariaLabel = intl.formatMessage({id: 'labelListTagsTitle'});

    return (
      <div className={className} aria-label={ariaLabel}>
        {labels.map((label) => labelToHTML(label))}
      </div>
    );
  }
}

Labels.propTypes = {
  intl: intlShape,
  labels: PropTypes.array,
  className: PropTypes.string,
  language: PropTypes.string
};

export default injectIntl(Labels);
