import React from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import {injectIntl, FormattedMessage} from 'react-intl';
import OverviewMap from '../../components/OverviewMap';
import Icon from '../../utils/Icon';
import {hasFullscreenMapPlugin, getHearingURL} from '../../utils/hearing';
import AutoAffix from 'react-overlays/lib/AutoAffix';
import Row from 'react-bootstrap/lib/Row';
import getAttr from '../../utils/getAttr';
import keys from 'lodash/keys';
import {setLanguage} from '../../actions';
import SubSectionListGroup from '../../components/SubSectionListGroup';
import {Link} from 'react-router';

class Sidebar extends React.Component {

  // constructor(props) {
  //   super(props);
  //
  //   this.state = {mouseOnSidebar: false, scrollPosition: []};
  //   this.handleScroll = this.handleScroll.bind(this);
  // }


  // componentDidMount() {
  //   window.addEventListener('scroll', this.handleScroll);
  // }
  //
  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.handleScroll);
  // }
  //
  // handleScroll(event) {
  //   if (this.state.mouseOnSidebar) {
  //     event.preventDefault();
  //     window.scroll(...this.state.scrollPosition);
  //   }
  // }

  getCommentsItem() {
    const {hearing, mainSection, currentlyViewed, isQuestionView} = this.props;
    const showPluginInline = !mainSection.plugin_fullscreen;
    if (mainSection.n_comments === 0 || !showPluginInline) {
      return null;
    }

    if (isQuestionView) {
      return (
        <Link to={getHearingURL(hearing) + "#hearing-comments"}>
          <ListGroupItem className={currentlyViewed === '#hearing-comments' && 'active'}>
            <div className="comment-icon">
              <Icon name="comment-o"/>&nbsp;{mainSection.n_comments}
            </div>
            <FormattedMessage id="comments"/>
          </ListGroupItem>
        </Link>
      );
    }

    return (
      <ListGroupItem className={currentlyViewed === '#hearing-comments' && 'active'} href="#hearing-comments">
        <div className="comment-icon">
          <Icon name="comment-o"/>&nbsp;{mainSection.n_comments}
        </div>
        <FormattedMessage id="comments"/>
      </ListGroupItem>
    );
  }

  getFullscreenItem() {
    const {hearing, mainSection} = this.props;
    const fullscreen = hasFullscreenMapPlugin(hearing);
    if (!fullscreen) {
      return null;
    }
    const fullscreenURL = getHearingURL(hearing, {fullscreen: true});
    return (
      <Link to={fullscreenURL}>
        <ListGroupItem>
          <FormattedMessage id="commentsOnMap"/>
          <div className="comment-icon">
            <Icon name="comment-o"/>&nbsp;{mainSection.n_comments}
          </div>
        </ListGroupItem>
      </Link>
    );
  }

  getLanguageChanger() {
    const {hearing, dispatch, activeLanguage} = this.props;
    const availableLanguages = { fi: 'Kuuleminen Suomeksi', sv: 'Enkäten på svenska', en: 'Questionnaire in English'};
    const languageOptionsArray = keys(hearing.title).map((lang, index) => {
      if (getAttr(hearing.title, lang, {exact: true}) && lang === activeLanguage) {
        return (<div className="language-link-active" key={lang}>
          {availableLanguages[lang]}
        </div>);
      }

      if (getAttr(hearing.title, lang, {exact: true}) &&
        keys(hearing.title).filter((key) => key === activeLanguage).length === 0 &&
        index === 0) {
        return (<div className="language-link-active" key={lang}>
          {availableLanguages[lang]}
        </div>);
      }

      if (getAttr(hearing.title, lang, {exact: true})) {
        return (<div className="language-link" key={lang}>
          <a onClick={(event) => { event.preventDefault(); dispatch(setLanguage(lang)); }} href="" >
            {availableLanguages[lang]}
          </a>
        </div>);
      }

      return null;
    });

    if (languageOptionsArray.length > 1) {
      return languageOptionsArray;
    }

    return null;
  }

  getSectionList() {
    const {
      hearing,
      sectionGroups,
      currentlyViewed,
      isQuestionView,
      activeLanguage} = this.props;
    return (
      <ListGroup>
        {isQuestionView ?
          <Link to={getHearingURL(hearing) + "#hearing"}>
            <ListGroupItem className={currentlyViewed === '#hearing' && 'active'}>
              <FormattedMessage id="hearing"/>
            </ListGroupItem>
          </Link>
          : <ListGroupItem className={currentlyViewed === '#hearing' && 'active'} href="#hearing">
            <FormattedMessage id="hearing"/>
          </ListGroupItem>}
        {sectionGroups.map((sectionGroup) => (
          !isQuestionView ?
            <div className="list-group-root" key={sectionGroup.type}>
              <ListGroupItem
                className={currentlyViewed === '#hearing-sectiongroup-' + sectionGroup.type && 'active'}
                key={sectionGroup.type}
                href={"#hearing-sectiongroup-" + sectionGroup.type}
              >
                {getAttr(sectionGroup.name_plural, activeLanguage)}
              </ListGroupItem>
              <SubSectionListGroup
                sections={sectionGroup.sections}
                hearing={hearing}
              />
            </div> :
            <div className="list-group-root active-group-link" key={sectionGroup.type}>
              <Link to={getHearingURL(hearing) + '#hearing-sectiongroup-' + sectionGroup.type} key={sectionGroup.type}>
                <ListGroupItem
                  className={currentlyViewed === '#hearing-sectiongroup-' + sectionGroup.type && 'active'}
                  key={sectionGroup.type}
                >
                  {getAttr(sectionGroup.name_plural, activeLanguage)}
                </ListGroupItem>
              </Link>
              <SubSectionListGroup
                currentlyViewed={currentlyViewed}
                sections={sectionGroup.sections}
                hearing={hearing}
              />
            </div>
        ))}
        {this.getFullscreenItem()}
        {this.getCommentsItem()}
      </ListGroup>
    );
  }

  render() {
    const {hearing} = this.props;
    const TOP_OFFSET = 75;
    const BOTTOM_OFFSET = 165;
    const boroughDiv = (hearing.borough ? (<div>
      <h4><FormattedMessage id="borough"/></h4>
      <Label>{hearing.borough}</Label>
    </div>) : null);
    const hearingMap = (hearing.geojson ? (<div className="sidebar-section map">
      <h4><FormattedMessage id="overview-map"/></h4>
      <OverviewMap hearings={[hearing]} style={{width: '100%', height: '200px'}} hideIfEmpty />
    </div>) : null);
    const sidebarStyle = (
      (typeof window !== 'undefined') && window.innerWidth >= 992 ?
        {maxHeight: window.innerHeight - TOP_OFFSET}
        : null
    );
    return (<Col md={4} lg={3}>
      <AutoAffix viewportOffsetTop={TOP_OFFSET} offsetBottom={BOTTOM_OFFSET} container={this.parentNode}>
        <div
             className="hearing-sidebar"
             style={sidebarStyle}
             /* onMouseEnter={() =>
             { this.setState({mouseOnSidebar: true, scrollPosition: [window.pageXOffset, window.pageYOffset]}); }} */
             /* onMouseLeave={() =>
             { this.setState({mouseOnSidebar: false}); }} */
        >
          <Row>
            <Col sm={6} md={12} style={{ marginBottom: 20 }}>
              {this.getLanguageChanger()}
            </Col>
            <Col sm={6} md={12}>
              <div className="sidebar-section contents">
                <h4><FormattedMessage id="table-of-content"/></h4>
                {this.getSectionList()}
              </div>
            </Col>
            <Col sm={6} md={12}>
              {Object.keys(hearing.borough).length !== 0 && boroughDiv}
              {hearingMap}
            </Col>
          </Row>
        </div>
      </AutoAffix>
    </Col>);
  }
}

Sidebar.propTypes = {
  hearing: PropTypes.object,
  mainSection: PropTypes.object,
  sectionGroups: PropTypes.array,
  activeLanguage: PropTypes.string,
  dispatch: PropTypes.func,
  currentlyViewed: PropTypes.string,
  isQuestionView: PropTypes.func,
};

export default injectIntl(Sidebar);
