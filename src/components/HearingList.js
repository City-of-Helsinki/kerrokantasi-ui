/* eslint-disable react/no-multi-comp */
import React from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import {FormattedMessage, injectIntl} from 'react-intl';
import {Link} from 'react-router';
import formatRelativeTime from '../utils/formatRelativeTime';
import Icon from '../utils/Icon';
import {getHearingURL} from '../utils/hearing';
import LabelList from './LabelList';
import Label from 'react-bootstrap/lib/Label';
import LoadSpinner from './LoadSpinner';
import getAttr from '../utils/getAttr';
import HearingsSearch from './HearingsSearch';

const HearingListTabs = () =>
  <Nav bsStyle="tabs" activeKey="1" onSelect={(event) => console.log(event.target.value)}>
    <NavItem eventKey="1" href="/home">NavItem 1 content</NavItem>
    <NavItem eventKey="2" title="Item">NavItem 2 content</NavItem>
    <NavItem eventKey="3" disabled>NavItem 3 content</NavItem>
  </Nav>;

class HearingListItem extends React.Component {

  render() {
    const hearing = this.props.hearing;
    const mainImage = hearing.main_image;
    const {language} = this.context;

    return (<div className="hearing-list-item">
      <div className="hearing-list-item-image">
        {mainImage ? <img role="presentation" src={mainImage.url} /> : null}
      </div>
      <div className="hearing-list-item-content">
        <div className="hearing-list-item-labels">
          <LabelList labels={hearing.labels} className="hearing-list-item-labellist"/>
          <div className="hearing-list-item-closed">
            {hearing.closed ? <Label><FormattedMessage id="hearingClosed"/></Label> : <p>&nbsp;</p>}
          </div>
        </div>
        <div className="hearing-list-item-title-wrap">
          <h4 className="hearing-list-item-title">
            {!hearing.published ? <Icon name="eye-slash"/> : null}
            <Link to={getHearingURL(hearing)}>{getAttr(hearing.title, language)}</Link>
          </h4>
          <div className="hearing-list-item-comments">
            <Icon name="comment-o"/>&nbsp;{hearing.n_comments}
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
HearingListItem.contextTypes = {
  language: React.PropTypes.string
};

class HearingList extends React.Component {
  render() {
    const {state, data} = (this.props.hearings || {});
    if (state !== "done") return <LoadSpinner />;
    return (<div className="hearing-list">
      <HearingsSearch/>
      <HearingListTabs/>
      {data.map(
      (hearing) => <HearingListItem hearing={hearing} key={hearing.id}/>
    )}</div>);
  }
}

HearingList.propTypes = {
  hearings: React.PropTypes.object
};

export default (injectIntl(HearingList));
