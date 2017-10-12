import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {fetchHearingList} from '../actions';
import {getTopHearing, getOpenHearings} from '../selectors/hearing';
import {Col, Grid, Row, Button} from 'react-bootstrap';
import FullWidthHearing from '../components/FullWidthHearing';
import HearingCardList from '../components/HearingCardList';
import orderBy from 'lodash/orderBy';
import OverviewMap from '../components/OverviewMap';
import {Link} from 'react-router-dom';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {isMobile: typeof window !== 'undefined' && window.innerWidth < 768};
    this.handleResize = this.handleResize.bind(this);
  }
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the home view into the dispatch's associated store.
   *
   * @param dispatch Redux Dispatch function
   * @return {Promise} Data fetching promise
   */
  static fetchData(dispatch) {
    return Promise.all([
      dispatch(fetchHearingList('topHearing', '/v1/hearing', {ordering: '-n_comments', open: true, limit: 1})),
      dispatch(fetchHearingList('openHearings', '/v1/hearing', {open: true, include: 'geojson'})),
    ]);
  }

  componentDidMount() {
    Home.fetchData(this.props.dispatch);
    if (typeof window !== 'undefined') window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({isMobile: typeof window !== 'undefined' && window.innerWidth < 768});
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {topHearing, openHearings, language} = this.props;
    const {isMobile} = this.state;
    const hearingMap =
      openHearings && openHearings.data ? (
        <div className="map">
          <h2>
            <FormattedMessage id="open-hearings-on-map" />
          </h2>
          <OverviewMap hearings={openHearings.data} style={{width: '100%', height: isMobile ? '70%' : 600}} />
        </div>
      ) : null;

    return (
      <div>
        <section className="page-section page-section--welcome">
          <div className="container">
            <Row>
              <Col xs={8}>
                <Helmet title={formatMessage({id: 'welcome'})} />
                <h1>
                  <FormattedMessage id="welcome" />
                </h1>
                <p className="lead">
                  <FormattedMessage id="welcomeMessage" />
                </p>
              </Col>
              <Col xs={4}>
                <div className="home-logo" />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>{topHearing && <FullWidthHearing hearing={topHearing} />}</Col>
            </Row>
          </div>
        </section>
        <section className="page-section page-section--hearing-card">
          <div className="hearings-koro__top" />
          <div className="container">
            <Row>
              {openHearings &&
                !openHearings.isFetching && (
                  <Col xs={12}>
                    <div className="list">
                      <h2 className="page-title">
                        <FormattedMessage id="openHearings" />
                      </h2>
                      <HearingCardList
                        hearings={orderBy(openHearings.data, ['close_at'], ['desc'])}
                        language={language}
                      />
                      <p className="text-center">
                        <Link to="/hearings/list">
                          <Button bsStyle="default">
                            <FormattedMessage id="allHearings" />
                          </Button>
                        </Link>
                      </p>
                    </div>
                  </Col>
                )}
            </Row>
          </div>
          <div className="hearings-koro__bottom" />
        </section>
        <section className="page-section page-section--feedback">
          <Grid>
            <Row>
              <Col xs={12}>
                <div className="feedback-box">
                  <a href="mailto:dev@hel.fi?subject=Kerro kantasi -palaute">
                    <h2 className="feedback-prompt">
                      <FormattedMessage id="feedbackPrompt" />
                    </h2>
                  </a>
                </div>
              </Col>
            </Row>
          </Grid>
        </section>
        <section className="page-section page-section--map">
          <Grid>
            <Row>
              <Col sm={12}>{hearingMap}</Col>
            </Row>
          </Grid>
        </section>
      </div>
    );
  }
}

Home.propTypes = {
  intl: intlShape.isRequired,
  dispatch: PropTypes.func,
  openHearings: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  topHearing: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  // eslint-disable-next-line react/no-unused-prop-types
  language: PropTypes.string, // make sure changing language refreshes
};

const mapStateToProps = state => ({
  topHearing: getTopHearing(state),
  language: state.language,
  openHearings: getOpenHearings(state),
});

const WrappedHome = connect(mapStateToProps)(injectIntl(Home));
// We need to re-hoist the static fetchData to the wrapped component due to react-intl:
WrappedHome.fetchData = Home.fetchData;
export default WrappedHome;
