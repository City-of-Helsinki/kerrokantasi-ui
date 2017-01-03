/* eslint-disable react/no-multi-comp */
import React from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
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
  <Nav className="hearing-list__tabs" bsStyle="tabs" style={{width: '100%'}} activeKey="1" pullRight={1}>
    <NavItem eventKey="3" disabled style={{width: '70%'}}/>
    <NavItem eventKey="1" href="/home">Lista</NavItem>
    <NavItem eventKey="2" title="Item">Kartta</NavItem>
  </Nav>;

const HearingListFilters = ({handleSort}) =>
  <div className="hearing-list__filter-bar">
    <FormGroup controlId="formControlsSelect" className="hearing-list__filter-bar-filter">
      <ControlLabel><FormattedMessage id="sort"/></ControlLabel>
      <FormControl componentClass="select" placeholder="select" onChange={(event) => handleSort(event.target.value)}>
        <option value="-created_at"><FormattedMessage id="newestFirst"/></option>
        <option value="created_at"><FormattedMessage id="oldestFirst"/></option>
        <option value="-close_at"><FormattedMessage id="lastClosing"/></option>
        <option value="close_at"><FormattedMessage id="firstClosing"/></option>
        <option value="-open_at"><FormattedMessage id="lastOpen"/></option>
        <option value="open_at"><FormattedMessage id="firstOpen"/></option>
        <option value="-n_comments"><FormattedMessage id="mostCommented"/></option>
        <option value="n_comments"><FormattedMessage id="leastCommented"/></option>
      </FormControl>
    </FormGroup>
  </div>;

HearingListFilters.propTypes = {
  labels: React.PropTypes.object,
  handleChangeFilter: React.PropTypes.func,
  handleSort: React.PropTypes.func
};

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
    const {hearings, isLoading, labels, handleChangeFilter, handleSort, handleSearch, handleLabelSearch} = this.props;

    return (
      <div>
        <HearingsSearch handleSearch={handleSearch} labels={labels} handleLabelSearch={handleLabelSearch}/>
        <HearingListTabs/>
        {isLoading && <LoadSpinner />}
        <div className={`hearing-list${isLoading ? '-hidden' : ''}`}>
          <HearingListFilters labels={labels} handleChangeFilter={handleChangeFilter} handleSort={handleSort}/>
          {hearings.map(
          (hearing) => <HearingListItem hearing={hearing} key={hearing.id}/>
        )}</div>
      </div>
    );
  }
}

HearingList.propTypes = {
  hearings: React.PropTypes.object,
  labels: React.PropTypes.object,
  isLoading: React.PropTypes.string,
  handleChangeFilter: React.PropTypes.func,
  handleSort: React.PropTypes.func,
  handleSearch: React.PropTypes.func,
  handleLabelSearch: React.PropTypes.func
};

export default (injectIntl(HearingList));
