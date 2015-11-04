/* eslint-disable react/no-multi-comp */
import React from 'react';
import {injectIntl} from 'react-intl';

class HearingListItem extends React.Component {
  render() {
    const hearing = this.props.hearing;
    return <li>{hearing.id}</li>;
  }
}

HearingListItem.propTypes = {hearing: React.PropTypes.object};

class HearingList extends React.Component {
  render() {
    const {state, data} = (this.props.hearings || {});
    if (state !== "done") return <i>Loading...</i>;
    return (<ul>{data.map((hearing) => <HearingListItem hearing={hearing} key={hearing.id}/>)}</ul>);
  }
}

HearingList.propTypes = {
  hearings: React.PropTypes.object
};

export default (injectIntl(HearingList));
