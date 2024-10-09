/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import LoadSpinner from '../../LoadSpinner';
import Icon from '../../../utils/Icon';

/**
 * Functional component to display "Show more reply's button"
 * Keep component simple and effective and contained within comment component hierarchy.
 */
const ShowMore = ({ isLoadingSubComment = false, open = false, ...props }) => {
  /**
   * Event handler for when hyperlink is clicked.
   * Override and prevent default action, so it doesn't act like a hyperlink.
   */
  const handleShowMore = (event) => {
    event.preventDefault();
    props.onClickShowMore();
  };

  /**
   * Object with values based on props.open boolean.
   * @type {{msg: (string), icon: (string)}}
   */
  const toggle = {
    icon: open ? 'chevron-up' : 'chevron-down',
    msg: open ? 'hideReplies' : 'showMoreReplies',
  };

  return (
    <div className='hearing-comment__show-more'>
      {isLoadingSubComment ? (
        <LoadSpinner style={{ padding: '12px' }} />
      ) : (
        <span className='hearing-comment__show-more__wrapper'>
          <a href='' onClick={handleShowMore} role='button' aria-expanded={open}>
            <Icon name={toggle.icon} aria-hidden='true' />
            <FormattedMessage id={toggle.msg} />
            <span className='hearing-comment__show-more__count'>{`(${props.numberOfComments})`}</span>
          </a>
        </span>
      )}
    </div>
  );
};

ShowMore.propTypes = {
  numberOfComments: PropTypes.number.isRequired,
  onClickShowMore: PropTypes.func.isRequired,
  isLoadingSubComment: PropTypes.bool,
  open: PropTypes.bool,
};

export default injectIntl(ShowMore);
