import React from 'react';
import {Col, Row, OverlayTrigger, Tooltip, Grid} from 'react-bootstrap';
import {injectIntl, FormattedPlural, FormattedMessage, intlShape} from 'react-intl';
import FormatRelativeTime from '../../utils/FormatRelativeTime';
import LabelList from '../../components/LabelList';
import SocialBar from '../../components/SocialBar';
import Icon from '../../utils/Icon';
import getAttr from '../../utils/getAttr';
import {isPublic} from "../../utils/hearing";
import PropTypes from 'prop-types';
import keys from 'lodash/keys';
import moment from 'moment';
import {stringifyQuery} from '../../utils/urlQuery';
import {withRouter} from 'react-router-dom';

export class HeaderComponent extends React.Component {
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
    const {hearing, activeLanguage, location, history} = this.props;
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
                history.push({location: location.pathname, search: stringifyQuery({lang})});
              }}
              onKeyPress={event => {
                event.preventDefault();
                history.push({location: location.pathname, search: stringifyQuery({lang})});
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

  getEyeTooltip() {
    // eslint-disable-line class-methods-use-this
    const {formatMessage} = this.props.intl;
    const openingTime = moment(this.props.hearing.open_at);
    let text = <FormattedMessage id="eyeTooltip" />;
    if (this.props.hearing.published && openingTime > moment()) {
      const duration = moment.duration(openingTime.diff(moment()));
      const durationAs = duration.asHours() < 24 ? duration.asHours() : duration.asDays();
      const differenceText = duration.asHours() < 24 ? 'eyeTooltipOpensHours' : 'eyeTooltipOpensDays';
      text = `${formatMessage({id: 'eyeTooltipOpens'})} ${Math.ceil(durationAs)} ${formatMessage({
        id: differenceText,
      })}`;
    }
    return <Tooltip id="eye-tooltip">{text}</Tooltip>;
  }

  render() {
    const { hearing, activeLanguage, reportUrl} = this.props;
    return (
      <div className="header-section">
        <Grid>
          <div className="hearing-header">
            <h1>
              {!isPublic(hearing)
                ? <OverlayTrigger placement="bottom" overlay={this.getEyeTooltip()}><Icon name="eye-slash"/></OverlayTrigger>
                : null}
              {' '}
              {getAttr(hearing.title, activeLanguage)}
            </h1>
            <Row className="hearing-meta">
              <Col xs={12}>
                <LabelList className="main-labels" labels={hearing.labels} language={activeLanguage} />
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
        </Grid>
      </div>
    );
  }
}

HeaderComponent.propTypes = {
  hearing: PropTypes.object,
  reportUrl: PropTypes.string,
  activeLanguage: PropTypes.string,
  intl: intlShape.isRequired,
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(injectIntl(HeaderComponent));
