import React from 'react';
import {Col, Row, OverlayTrigger} from 'react-bootstrap';
import {injectIntl, FormattedPlural, FormattedMessage} from 'react-intl';
import FormatRelativeTime from '../../utils/FormatRelativeTime';
import LabelList from '../../components/LabelList';
import SocialBar from '../../components/SocialBar';
import Icon from '../../utils/Icon';
import getAttr from '../../utils/getAttr';
import {isPublic} from "../../utils/hearing";
import PropTypes from 'prop-types';
import keys from 'lodash/keys';
import {setLanguage} from '../../actions';

class Header extends React.Component {
  getTimetableText(hearing) { // eslint-disable-line class-methods-use-this
    const openMessage = <FormatRelativeTime messagePrefix="timeOpen" timeVal={hearing.open_at}/>;
    const closeMessage = <FormatRelativeTime messagePrefix="timeClose" timeVal={hearing.close_at}/>;
    if (!hearing.published) {
      return (
        <div className="timetable">
          <Icon name="clock-o"/>
          <del>{openMessage}</del>
          (<FormattedMessage id="draftNotPublished"/>)
          <br/>
          <Icon name="clock-o"/>
          <del>{closeMessage}</del>
        </div>
      );
    }
    return (
      <div className="timetable">
        <Icon name="clock-o"/> {openMessage}
        <br/>
        <Icon name="clock-o"/> {closeMessage}
      </div>
    );
  }

  getLanguageChanger() {
    const {hearing, dispatch, activeLanguage} = this.props;
    const availableLanguages = {fi: 'Kuuleminen suomeksi', sv: 'Enkäten på svenska', en: 'Questionnaire in English'};
    const languageOptionsArray = keys(hearing.title).map((lang, index) => {
      if (getAttr(hearing.title, lang, {exact: true}) && lang === activeLanguage) {
        return (
          <div className="language-link-active" key={lang}>
            {availableLanguages[lang]}
          </div>
        );
      }

      if (
        getAttr(hearing.title, lang, {exact: true}) &&
        keys(hearing.title).filter(key => key === activeLanguage).length === 0 &&
        index === 0
      ) {
        return (
          <div className="language-link-active" key={lang}>
            {availableLanguages[lang]}
          </div>
        );
      }

      if (getAttr(hearing.title, lang, {exact: true})) {
        return (
          <div className="language-link" key={lang}>
            <a
              onClick={event => {
                event.preventDefault();
                dispatch(setLanguage(lang));
              }}
              onKeyPress={event => {
                event.preventDefault();
                dispatch(setLanguage(lang));
              }}
            >
              {availableLanguages[lang]}
            </a>
          </div>
        );
      }

      return null;
    });

    if (languageOptionsArray.length > 1) {
      return languageOptionsArray;
    }

    return null;
  }

  render() {
    const { hearing, activeLanguage, reportUrl, eyeTooltip } = this.props;
    return (
      <div className="hearing-header">
        <h1>
          {!isPublic(hearing)
            ? <OverlayTrigger placement="bottom" overlay={eyeTooltip}><Icon name="eye-slash"/></OverlayTrigger>
            : null}
          {' '}
          {getAttr(hearing.title, activeLanguage)}
        </h1>
        <Row className="hearing-meta">
          <Col xs={12}>
            <LabelList className="main-labels" labels={hearing.labels} />
          </Col>
          <Col xs={12} sm={6}>
            {this.getTimetableText(hearing)}
          </Col>
          <Col xs={12} sm={6}>
            <div className="comment-summary">
              {hearing.n_comments ? (
                <div className="commentNumber">
                  <Icon name="comment-o"/> {' '}
                  <FormattedPlural
                    value={hearing.n_comments}
                    one={<FormattedMessage id="totalSubmittedComment" values={{n: hearing.n_comments}}/>}
                    other={<FormattedMessage id="totalSubmittedComments" values={{n: hearing.n_comments}}/>}
                  />
                </div>
              ) : null}
              {reportUrl ? (
                <div className="report-download">
                  <a href={reportUrl}>
                    <small>
                      <Icon name="download" /> <FormattedMessage id="downloadReport" />
                    </small>
                  </a>
                </div>
              ) : null}
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <SocialBar />
          </Col>
          <Col lg={6}>
            {this.getLanguageChanger()}
          </Col>
        </Row>
      </div>
    );
  }
}

Header.propTypes = {
  eyeTooltip: PropTypes.element,
  hearing: PropTypes.object,
  reportUrl: PropTypes.string,
  activeLanguage: PropTypes.string,
  dispatch: PropTypes.func
};

export default injectIntl(Header);
