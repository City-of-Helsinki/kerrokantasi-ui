import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

function CommentFormErrors({ commentRequiredError, commentOrAnswerRequiredError, imageTooBig }) {
  if (!commentRequiredError && !commentOrAnswerRequiredError && !imageTooBig) {
    return null;
  }

  return (
    <ul role='alert' className='comment-form-errors'>
      {commentRequiredError && (
        <li>
          <FormattedMessage id='commentRequiredError' />
        </li>
      )}
      {commentOrAnswerRequiredError && (
        <li>
          <FormattedMessage id='commentOrAnswerRequiredError' />
        </li>
      )}
      {imageTooBig && (
        <li>
          <FormattedMessage id='imageSizeError' />
        </li>
      )}
    </ul>
  );
}

CommentFormErrors.propTypes = {
  commentRequiredError: PropTypes.bool.isRequired,
  commentOrAnswerRequiredError: PropTypes.bool.isRequired,
  imageTooBig: PropTypes.bool.isRequired,
};

export default CommentFormErrors;
