import React from 'react';
import Helmet from 'react-helmet';
import {Link} from 'react-router';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {fetchHearingList} from '../actions';
import {getTopHearing, getOpenHearings} from '../selectors/hearing';
import HearingList from '../components/HearingList';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import FullWidthHearing from '../components//FullWidthHearing';
import HearingCardList from '../components/HearingCardList';
import orderBy from 'lodash/orderBy';

class Home extends React.Component {
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the home view into the dispatch's associated store.
   *
   * @param dispatch Redux Dispatch function
   * @return {Promise} Data fetching promise
   */
  static fetchData(dispatch) {
    return Promise.all([
      dispatch(fetchHearingList("nextClosingHearing", "/v1/hearing/", {next_closing: (new Date().toISOString())})),
      dispatch(fetchHearingList("topHearing", "/v1/hearing", {order: "-n_comments", open: true, limit: 1})),
      dispatch(fetchHearingList("openHearings", "/v1/hearing", {open: true}))
    ]);
  }

  componentDidMount() {
    Home.fetchData(this.props.dispatch);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {hearingLists, topHearing, openHearings, language} = this.props;
    return (<div className="container">
      <Helmet title={formatMessage({id: 'welcome'})}/>
      <h1><FormattedMessage id="welcome"/></h1>
      <p className="lead"><FormattedMessage id="welcomeMessage"/></p>
      {topHearing && <FullWidthHearing hearing={topHearing}/>}
      <hr />
      <Row>
        <Col md={8} xs={12}>
          <div className="list">
            <h2 className="page-title"><FormattedMessage id="nextClosingHearing"/></h2>
            <HearingList hearings={hearingLists.nextClosingHearing} />
          </div>
          {openHearings && openHearings.state === 'done' &&
          <div className="list">
            <h2 className="page-title"><FormattedMessage id="openHearings"/></h2>
            <HearingCardList hearings={orderBy(openHearings.data, ['close_at'], ['desc'])} language={language}/>
            <Link className="fullwidth" to="/hearings"><FormattedMessage id="allHearings"/></Link>
          </div>
          }
        </Col>
        <Col md={4} xs={12}>
          <div className="feedback-box">
            <a href="mailto:dev@hel.fi?subject=Kerro kantasi -palaute">
              <h2 className="feedback-prompt"><FormattedMessage id="feedbackPrompt"/></h2>
            </a>
          </div>
        </Col>
      </Row>
    </div>);
  }
}

Home.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearingLists: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  openHearings: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  topHearing: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  // eslint-disable-next-line react/no-unused-prop-types
  language: React.PropTypes.string, // make sure changing language refreshes
};

const mapStateToProps = (state) => ({
  hearingLists: state.hearingLists,
  topHearing: getTopHearing(state),
  language: state.language,
  openHearings: getOpenHearings(state)
});

const WrappedHome = connect(mapStateToProps)(injectIntl(Home));
// We need to re-hoist the static fetchData to the wrapped component due to react-intl:
WrappedHome.fetchData = Home.fetchData;
export default WrappedHome;
