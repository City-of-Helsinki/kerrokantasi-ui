import React from 'react';
import Badge from 'react-bootstrap/lib/Badge';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import {injectIntl, FormattedMessage, FormattedPlural} from 'react-intl';
import OverviewMap from '../../components/OverviewMap';
import SocialBar from '../../components/SocialBar';
import formatRelativeTime from '../../utils/formatRelativeTime';
import Icon from '../../utils/Icon';
import {hasFullscreenMapPlugin, getHearingURL} from '../../utils/hearing';
import AutoAffix from 'react-overlays/lib/AutoAffix';
import Row from 'react-bootstrap/lib/Row';
import config from '../../config';
import getAttr from '../../utils/getAttr';
import {setLanguage} from '../../actions';

class Sidebar extends React.Component {

  getCommentsItem() {
    const hearing = this.props.hearing;
    const fullscreen = hasFullscreenMapPlugin(hearing);
    const commentsURL = (
      fullscreen ? getHearingURL(hearing, {fullscreen: true}) : "#hearing-comments"
    );
    if (this.props.mainSection.n_comments === 0) {
      return null;
    }
    return (
      <ListGroupItem href={commentsURL}>
        <FormattedMessage id={fullscreen ? "commentsOnMap" : "comments"}/>
        <div className="comment-icon">
          <Icon name="comment-o"/>&nbsp;{this.props.mainSection.n_comments}
        </div>
      </ListGroupItem>
    );
  }

  render() {
    const {dispatch, hearing, sectionGroups, activeLanguage} = this.props;
    const availableLanguages = { fi: 'Kuuleminen Suomeksi', sv: 'Frågorna tillgängliga', en: 'Questionaire in English'};
    console.log(hearing.sections[0]);
    const boroughDiv = (hearing.borough ? (<div>
      <h4><FormattedMessage id="borough"/></h4>
      <Label>{hearing.borough}</Label>
    </div>) : null);
    const hearingMap = (hearing.geojson ? (<div className="sidebar-section map">
      <h4><FormattedMessage id="overview-map"/></h4>
      <OverviewMap hearings={[hearing]} style={{width: '100%', height: '200px'}} hideIfEmpty />
    </div>) : null);
    return (<Col md={4} lg={3}>
      <AutoAffix viewportOffsetTop={75} offsetBottom={165} container={this.parentNode}>
        <div className="hearing-sidebar">
          <Row>
            <Col sm={6} md={12}>
              <div className="sidebar-section commentNumber">
                <Icon name="comment-o"/> {' '}
                <FormattedPlural
                  value={hearing.n_comments}
                  one={<FormattedMessage id="totalSubmittedComment" values={{n: hearing.n_comments}}/>}
                  other={<FormattedMessage id="totalSubmittedComments" values={{n: hearing.n_comments}}/>}
                />
              </div>
              <div className="sidebar-section timetable">
                <h4><FormattedMessage id="timetable"/></h4>
                <Icon name="clock-o"/> {formatRelativeTime("timeOpen", hearing.open_at)}<br/>
                <Icon name="clock-o"/> {formatRelativeTime("timeClose", hearing.close_at)}
              </div>
              <div className="sidebar-section contents">
                <h4><FormattedMessage id="table-of-content"/></h4>
                <ListGroup>
                  <ListGroupItem href="#hearing">
                    <FormattedMessage id="hearing"/>
                  </ListGroupItem>
                  {sectionGroups.map((sectionGroup) => (
                    <ListGroupItem href={"#hearing-sectiongroup-" + sectionGroup.type} key={sectionGroup.type}>
                      {sectionGroup.name_plural}
                      <div className="comment-icon"><Icon name="comment-o"/>&nbsp;{sectionGroup.n_comments}</div>
                      <Badge>{sectionGroup.sections.length}</Badge>
                    </ListGroupItem>
                  ))}
                  {this.getCommentsItem()}
                </ListGroup>
              </div>
            </Col>
            <Col sm={6} md={12} style={{ marginBottom: 20 }}>
              {config.languages.map((lang) => { if (getAttr(hearing.title, lang, {exact: true})) { return <div className={`language-link${lang === activeLanguage ? "-active" : ''}`}><a onClick={(event) => { event.preventDefault(); dispatch(setLanguage(lang)); }} href="" >{availableLanguages[lang]}</a></div>; } return null; })}
            </Col>
            <Col sm={6} md={12}>
              {Object.keys(hearing.borough).length !== 0 && boroughDiv}
              <SocialBar />
              {hearingMap}
            </Col>
          </Row>
        </div>
      </AutoAffix>
    </Col>);
  }
}

Sidebar.propTypes = {
  hearing: React.PropTypes.object,
  mainSection: React.PropTypes.object,
  sectionGroups: React.PropTypes.array,
  activeLanguage: React.PropTypes.string,
  dispatch: React.PropTypes.func
};

export default injectIntl(Sidebar);
