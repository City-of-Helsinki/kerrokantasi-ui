/* eslint-disable react/no-multi-comp */
import React from 'react';
import {injectIntl} from 'react-intl';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';
import formatRelativeTime from '../utils/formatRelativeTime';
import Icon from 'utils/Icon';
import LabelList from './LabelList';
import Label from 'react-bootstrap/lib/Label';
import LoadSpinner from './LoadSpinner';

class HearingListItem extends React.Component {

  render() {
    const hearing = this.props.hearing;
    const mainImage = (hearing.images.length ? hearing.images[0] : null);
    return (<div className="hearing-list-item">
      <div className="hearing-list-item-image">
        {mainImage ? <img src={mainImage.url} /> : null}
      </div>
      <div className="hearing-list-item-content">
        <div className="hearing-list-item-labels">
          <LabelList labels={hearing.labels} className="hearing-list-item-labellist"/>
          <div className="hearing-list-item-closed">
            {hearing.closed ? <Label><FormattedMessage id="hearingClosed"/></Label> : <p>&nbsp;</p> }
          </div>
        </div>
        <div className="hearing-list-item-title-wrap">
          <h4 className="hearing-list-item-title">
            {!hearing.published ? <Icon name="eye-slash"/> : null}
            <Link to={`/hearing/${hearing.id}`}>{hearing.title}</Link>
          </h4>
          <div className="hearing-list-item-comments">
            <Icon name="comment-o"/>&nbsp;{ hearing.n_comments }
          </div>
        </div>
        <div className="hearing-list-item-times">
          <div>
            {formatRelativeTime("timeOpen", hearing.open_at)}
          </div>
          <div>
            {formatRelativeTime("timeClose", hearing.close_at)}
          </div>
        </div>
      </div>
    </div>);
  }
}

HearingListItem.propTypes = {hearing: React.PropTypes.object};

class HearingList extends React.Component {
  render() {
    const {state, data} = (this.props.hearings || {});
    if (state !== "done") return <LoadSpinner />;
    return (<div className="hearing-list">{data.map((hearing) => <HearingListItem hearing={hearing} key={hearing.id}/>)}</div>);
  }
}

HearingList.propTypes = {
  hearings: React.PropTypes.object
};

export default (injectIntl(HearingList));
