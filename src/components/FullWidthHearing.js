import React from 'react';
import {Link} from 'react-router';
import Icon from '../utils/Icon';
import formatRelativeTime from '../utils/formatRelativeTime';
import {getHearingURL} from '../utils/hearing';
import getAttr from '../utils/getAttr';

const FullWidthHearing = ({hearing, className = '', ...rest}, {language}) => {
  const styles = {
    backgroundImage: hearing && hearing.main_image && hearing.main_image.url ?
    `url(${hearing && hearing.main_image && hearing.main_image.url})` :
    ''
  };
  return (
    <div className={`fullwidth-hearing ${className}`} style={styles} {...rest}>
      <div className="fullwidth-hearing-header">
        <div className="fullwidth-hearing-title-wrap">
          <h2 className="fullwidth-hearing-title">
            <Link to={getHearingURL(hearing)}>{getAttr(hearing.title, language)}</Link>
          </h2>
        </div>
        <div className="fullwidth-hearing-times">
          <span>
            {formatRelativeTime("timeOpen", hearing.open_at)}.
          </span> <span>
            {formatRelativeTime("timeClose", hearing.close_at)}.
          </span>
        </div>
      </div>
      <div className="fullwidth-hearing-comments">
        <Icon name="comment-o"/>&nbsp;{hearing.n_comments}
      </div>
    </div>
  );
};

FullWidthHearing.propTypes = {
  className: React.PropTypes.string,
  hearing: React.PropTypes.object // eslint-disable-line react/forbid-prop-types
};

FullWidthHearing.contextTypes = {
  language: React.PropTypes.string
};

export default FullWidthHearing;
