import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
import LoadSpinner from '../../LoadSpinner';
import Icon from '../../../utils/Icon';

/**
 * Functional component to display "Show more reply's button"
 * Keep component simple and effective and contained within comment component hierarchy.
 */
const ShowMore = (props) => {
  /**
   * Event hadler for when hyperlink is clicked.
   * Override and prevent default action so it doesnt act like a hyper link.
   */
  const handleShowMore = (event) => {
    event.preventDefault();
    props.onClickShowMore();
  };

  return (
    <div className="hearing-comment__show-more">
      {
        props.isLoadingSubComment
          ? <LoadSpinner style={{ padding: '12px' }}/>
          : (
            <span className="hearing-comment__show-more__wrapper">
              <a href="" onClick={handleShowMore}>
                <Icon name="chevron-down" aria-hidden="true" />
                <FormattedMessage id="showMoreReplies" />
                <span className="hearing-comment__show-more__count">{`(${props.numberOfComments})`}</span>
              </a>
            </span>
          )
      }
    </div>
  );
};

ShowMore.propTypes = {
  numberOfComments: PropTypes.number.isRequired,
  onClickShowMore: PropTypes.func.isRequired,
  isLoadingSubComment: PropTypes.bool,
};

ShowMore.defaultProps = {
  isLoadingSubComment: false,
};


export default injectIntl(ShowMore);
