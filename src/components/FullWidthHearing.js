import React from 'react';
import {Link} from 'react-router';
import Icon from '../utils/Icon';
import formatRelativeTime from '../utils/formatRelativeTime';
import {getHearingURL} from '../utils/hearing';

const FullWidthHearing = ({hearing, className = '', ...rest}) => {
  const styles = {
    backgroundImage: `url(${hearing && hearing.main_image.url})`
  };
  return (
    <div className={`fullwidth-hearing ${className}`} style={styles} {...rest}>
      <div className="fullwidth-hearing-header">
        <div className="fullwidth-hearing-title-wrap">
          <h3 className="fullwidth-hearing-title">
            <Link to={getHearingURL(hearing)}>{hearing.title}</Link>
          </h3>
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

export default FullWidthHearing;
