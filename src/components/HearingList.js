/* eslint-disable react/no-multi-comp */
import React from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Checkbox from 'react-bootstrap/lib/Checkbox';
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
import config from '../config';
import OverviewMap from '../components/OverviewMap';

const HearingListTabs = ({activeTab}) =>
  <Nav className="hearing-list__tabs" bsStyle="tabs" activeKey={activeTab}>
    <NavItem eventKey="3" disabled className="hearing-list__tabs-empty"/>
    <NavItem eventKey="list" title="List"><Link to="/hearings/list"><FormattedMessage id="list"/></Link></NavItem>
    <NavItem eventKey="map" title="Map"><Link to="/hearings/map"><FormattedMessage id="map"/></Link></NavItem>
  </Nav>;

HearingListTabs.propTypes = {
  activeTab: React.PropTypes.string,
  handleChangeTab: React.PropTypes.func
};

const HearingListFilters = ({handleSort}) =>
  <div className="hearing-list__filter-bar">
    <FormGroup controlId="formControlsSelect" className="hearing-list__filter-bar-filter">
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
    <ControlLabel className="hearing-list__filter-bar-label"><FormattedMessage id="sort"/></ControlLabel>
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
    const {language} = this.props;
    const translationAvailable = !!getAttr(hearing.title, language, {exact: true});
    const availableInLanguageMessages = { fi: 'Kuuleminen saatavilla suomeksi', sv: 'Höranden tillgänglig på svenska', en: 'Questionnaire available in English'};

    return (<div className="hearing-list-item">
      {
        !translationAvailable &&
        <Link to={getHearingURL(hearing)} className="hearing-card-notice">
          <div className="notice-content">
            <FormattedMessage id="hearingTranslationNotAvailable"/>
            {config.languages.map((lang) => { if (getAttr(hearing.title, lang, {exact: true})) { return <div className="language-available-message">{availableInLanguageMessages[lang]}</div>; } return null; })}
          </div>
        </Link>
      }
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

HearingListItem.propTypes = {
  hearing: React.PropTypes.object,
  language: React.PropTypes.string
};

class HearingList extends React.Component {

  render() {
    const {hearings, isLoading, labels, handleSort, handleSearch, handleLabelSearch, language, activeTab, showOnlyOpen, toggleShowOnlyOpen, isMobile} = this.props;
    const hearingsToShow = !showOnlyOpen ? hearings : hearings.filter((hearing) => !hearing.closed);

    const hearingListMap = (hearingsToShow ? (<div className="hearing-list-map map">
      <Checkbox inline readOnly checked={showOnlyOpen} onChange={() => toggleShowOnlyOpen()} style={{marginBottom: 10}}>
        <FormattedMessage id="showOnlyOpen"/>
      </Checkbox>
      <OverviewMap hearings={hearingsToShow} style={{width: isMobile ? '100%' : '130%', height: isMobile ? '100%' : 600}} enablePopups />
    </div>) : null);

    return (
      <div>
        <HearingsSearch handleSearch={handleSearch} labels={labels} handleLabelSearch={handleLabelSearch} language={language}/>
        <HearingListTabs activeTab={activeTab}/>
        {isLoading && <LoadSpinner />}
        {activeTab === 'list' &&
          <div className={`hearing-list${isLoading ? '-hidden' : ''}`}>
            <HearingListFilters handleSort={handleSort}/>
            {hearings.map(
              (hearing) => <HearingListItem hearing={hearing} key={hearing.id} language={language}/>
            )}
          </div>
        }
        {activeTab === 'map' && !isLoading && hearingListMap}
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
  handleLabelSearch: React.PropTypes.func,
  language: React.PropTypes.string,
  activeTab: React.PropTypes.string,
  handleChangeTab: React.PropTypes.func,
  showOnlyOpen: React.PropTypes.bool,
  toggleShowOnlyOpen: React.PropTypes.func,
  isMobile: React.PropTypes.bool
};

export default (injectIntl(HearingList));
