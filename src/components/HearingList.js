/* eslint-disable react/no-multi-comp */
import React from 'react';
import {injectIntl} from 'react-intl';
import {Link} from 'react-router';
import formatRelativeTime from '../utils/formatRelativeTime';
import Icon from 'utils/Icon';

class HearingListItem extends React.Component {

  render() {
    const hearing = this.props.hearing;
    return (<div>
      <h4>
        {!hearing.published ? <Icon name="eye-slash" /> : null}
        <Link to={`/hearing/${hearing.id}`}>{hearing.title}</Link>
      </h4>
      <div>
        <Icon name="clock-o"/> {formatRelativeTime("timeOpen", hearing.open_at)} | {formatRelativeTime("timeClose", hearing.close_at)}
      </div>
      <hr/>
    </div>);
  }
}

HearingListItem.propTypes = {hearing: React.PropTypes.object};

class HearingList extends React.Component {
  render() {
    const {state, data} = (this.props.hearings || {});
    if (state !== "done") return <i>Loading...</i>;
    return (<div className="media-list">{data.map((hearing) => <HearingListItem hearing={hearing} key={hearing.id}/>)}</div>);
  }
}

HearingList.propTypes = {
  hearings: React.PropTypes.object
};

export default (injectIntl(HearingList));
