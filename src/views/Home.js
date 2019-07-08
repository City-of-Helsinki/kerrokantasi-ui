import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {fetchHearingList} from '../actions';
import {getTopHearing, getOpenHearings} from '../selectors/hearing';
import {getUser} from '../selectors/user';
import {Col, Grid, Row, Button} from 'react-bootstrap';
import FullWidthHearing from '../components/FullWidthHearing';
import HearingCardList from '../components/HearingCardList';
import orderBy from 'lodash/orderBy';
import OverviewMap from '../components/OverviewMap';
import Link from '../components/LinkWithLang';
import trackLink from '../utils/trackLink';
import CreateHearingButton from '../components/Hearings/CreateHearingButton';
import { isAdmin } from '../utils/user';
import config from '../config';
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';

export class Home extends React.Component {
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
    trackLink();
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({isMobile: typeof window !== 'undefined' && window.innerWidth < 768});
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {topHearing, openHearings, language, user} = this.props;
    const {isMobile} = this.state;
    const hearingMap =
      openHearings && openHearings.data ? (
        <div className="map">
          <h2>
            <FormattedMessage id="open-hearings-on-map" />
          </h2>
          <OverviewMap
            enablePopups
            hearings={openHearings.data}
            style={{width: '100%', height: isMobile ? '70%' : 600}}
          />
        </div>
      ) : null;
    const heroStyle = {
      backgroundImage: "url('" + config.heroImageURL + "')",
    };

    return (
      <div>
        <section className="page-section page-section--welcome" style={heroStyle}>
          <div className="container">
            <Row>
              <Col xs={10} md={8} className="welcome-content">
                <Helmet title={formatMessage({id: 'welcome'})} />
                <h1>
                  <FormattedMessage id="welcome" />
                </h1>
                <p className="lead">
                  <FormattedMessage id="welcomeMessage" />
                </p>
              </Col>
            </Row>
          </div>
          <div className="welcome-koro__bottom" />
        </section>
        <section className="page-section page-section--hearing-card">
          <div className="container">
            <Row>
              <Col xs={12}>
                <h2 className="page-title">
                  <FormattedMessage id="openHearings" />
                </h2>
                {topHearing && <FullWidthHearing hearing={topHearing} />}
              </Col>
            </Row>
            <Row>
              {openHearings && openHearings.data && topHearing &&
                !openHearings.isFetching && (
                  <Col xs={12}>
                    <div className="list">
                      <HearingCardList
                        hearings={
                          orderBy(openHearings.data
                            .filter(hearing => hearing.id !== topHearing.id), ['close_at'], ['desc'])
                        }
                        language={language}
                      />
                      <p className="text-center">
                        <Link to={{path: "/hearings/list"}}>
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
                  <a href={urls.mailto}>
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
        {isAdmin(user) && <CreateHearingButton to={{path: '/hearing/new'}} />}
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
  user: PropTypes.object
};

const mapStateToProps = state => ({
  topHearing: getTopHearing(state),
  language: state.language,
  openHearings: getOpenHearings(state),
  user: getUser(state)
});

const WrappedHome = connect(mapStateToProps)(injectIntl(Home));
// We need to re-hoist the static fetchData to the wrapped component due to react-intl:
WrappedHome.fetchData = Home.fetchData;
export default WrappedHome;
