import React from 'react';
import PropTypes from 'prop-types';
import Link from './LinkWithLang';
import Icon from '../utils/Icon';
import LabelList from './LabelList';
import FormatRelativeTime from '../utils/FormatRelativeTime';
import {getHearingURL, getHearingMainImageURL} from '../utils/hearing';
import getAttr from '../utils/getAttr';

const FullWidthHearing = ({hearing, className = '', ...rest}, {language}) => {
  const backgroundImage = getHearingMainImageURL(hearing);
  const styles = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'url(/assets/images/default-image.svg)',
  };
  return (
    <div className={`fullwidth-hearing ${className}`} {...rest}>
      <div className="fullwidth-hearing-image" style={styles} />
      <div className="fullwidth-hearing-header">
        <div className="fullwidth-hearing-title-wrap">
          <h2 className="fullwidth-hearing-title">
            <Link to={{path: getHearingURL(hearing)}}>{getAttr(hearing.title, language)}</Link>
          </h2>
        </div>
        <div className="fullwidth-hearing-times">
          <span>
            <FormatRelativeTime messagePrefix="timeOpen" timeVal={hearing.open_at} />.
          </span>{' '}
          <span>
            <FormatRelativeTime messagePrefix="timeClose" timeVal={hearing.close_at} />.
          </span>
        </div>
        <div className="fullwidth-hearing-labels">
          <LabelList className="hearing-list-item-labellist" labels={hearing.labels} language={language} />
        </div>
      </div>
      <div className="fullwidth-hearing-comments">
        <Icon name="comment-o" />&nbsp;{hearing.n_comments}
      </div>
    </div>
  );
};

FullWidthHearing.propTypes = {
  className: PropTypes.string,
  hearing: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

FullWidthHearing.contextTypes = {
  language: PropTypes.string,
};

export default FullWidthHearing;
