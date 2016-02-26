import React from 'react';
import {injectIntl} from 'react-intl';
import BaseCommentForm from './BaseCommentForm';


class CommentForm extends BaseCommentForm {

}

CommentForm.propTypes = {
  onPostComment: React.PropTypes.func
};

export default injectIntl(CommentForm);
