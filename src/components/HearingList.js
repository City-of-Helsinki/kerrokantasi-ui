/* eslint-disable react/no-multi-comp */
import React from 'react';
import {injectIntl, FormattedMessage, FormattedRelative} from 'react-intl';
import {Link} from 'react-router';

class HearingListItem extends React.Component {
  render() {
    const hearing = this.props.hearing;
    return (<div>
      <h4>
        <Link to={`/hearing/${hearing.id}`}>{hearing.title}</Link>
      </h4>
      <div>
        <i className="fa fa-clock-o"/> <FormattedMessage id="timeOpened" /> <FormattedRelative value={hearing.created_at}/> | <FormattedMessage id="timeClosed" /> <FormattedRelative value={hearing.close_at}/>
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
