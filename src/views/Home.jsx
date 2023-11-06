/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Col, Grid, Row } from 'react-bootstrap';
import { Button } from 'hds-react';
import orderBy from 'lodash/orderBy';

import { fetchHearingList } from '../actions';
import { getTopHearing, getOpenHearings } from '../selectors/hearing';
import { getUser } from '../selectors/user';
import FullWidthHearing from '../components/FullWidthHearing';
import HearingCardList from '../components/HearingCardList';
import OverviewMap from '../components/OverviewMap';
import Link from '../components/LinkWithLang';
import CreateHearingButton from '../components/Hearings/CreateHearingButton';
import { isAdmin } from '../utils/user';
import config from '../config';
import { getFeedbackUrl } from '../utils/languageUtils';

export class Home extends React.Component {
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the home view into the dispatch's associated store.
   *
   * @param dispatch Redux Dispatch function
   * @return {Promise} Data fetching promise
   */
  static fetchData(dispatch) {
    return Promise.all([
      dispatch(fetchHearingList('topHearing', '/v1/hearing', { ordering: '-n_comments', open: true, limit: 1 })),
      dispatch(fetchHearingList('openHearings', '/v1/hearing', { open: true, include: 'geojson' })),
    ]);
  }

  constructor(props) {
    super(props);

    this.state = { isMobile: typeof window !== 'undefined' && window.innerWidth < 768 };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    Home.fetchData(this.props.dispatch);
    if (typeof window !== 'undefined') window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({ isMobile: typeof window !== 'undefined' && window.innerWidth < 768 });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { topHearing, openHearings, language, user, intl } = this.props;
    const { isMobile } = this.state;
    const hearingMap =
      openHearings && openHearings.data ? (
        <div className='map'>
          <h2>
            <FormattedMessage id='open-hearings-on-map' />
          </h2>
          <OverviewMap
            enablePopups
            hearings={openHearings.data}
            style={{ width: '100%', height: isMobile ? '70%' : 600 }}
            mapElementLimit={10}
          />
        </div>
      ) : null;
    const heroStyle = {
      backgroundImage: `url('${config.heroImageURL}')`,
    };

    return (
      <div>
        <section className='page-section page-section--welcome' style={heroStyle}>
          <Grid>
            <Row>
              <Col xs={10} md={8} className='welcome-content'>
                <Helmet
                  title={formatMessage({ id: 'welcome' })}
                  meta={[
                    { name: 'description', content: formatMessage({ id: 'descriptionTag' }) },
                    { property: 'og:description', content: formatMessage({ id: 'descriptionTag' }) },
                  ]}
                />
                <h1>
                  <FormattedMessage id='welcome' />
                </h1>
                <p className='lead'>
                  <FormattedMessage id='welcomeMessage' />
                </p>
              </Col>
            </Row>
          </Grid>
          <div className='welcome-koro__bottom' />
        </section>
        <section className='page-section page-section--hearing-card'>
          <div className='container'>
            <h2 className='page-title'>
              <FormattedMessage id='openHearings' />
            </h2>
            {topHearing && <FullWidthHearing hearing={topHearing} language={language} intl={intl} />}
            {openHearings && openHearings.data && topHearing && !openHearings.isFetching && (
              <div className='list'>
                <HearingCardList
                  hearings={orderBy(
                    openHearings.data.filter((hearing) => hearing.id !== topHearing.id),
                    ['close_at'],
                    ['desc'],
                  )}
                  language={language}
                  intl={intl}
                />
                <p className='text-center'>
                  <Link to={{ path: '/hearings/list' }}>
                    <Button className={'kerrokantasi-btn'}>
                        <FormattedMessage id='allHearings' />
                    </Button>
                  </Link>
                </p>
              </div>
            )}
          </div>
          <div className='hearings-koro__bottom' />
        </section>
        <section className='page-section page-section--feedback'>
          <div className='container'>
            <h2 className='feedback-prompt'>
              <a href={getFeedbackUrl(language)} target='_blank' rel='noopener noreferrer' className='feedback-box'>
                <FormattedMessage id='feedbackPrompt' />{' '}
              </a>
            </h2>
          </div>
        </section>
        <section className='page-section page-section--map'>
          <div className='container'>{hearingMap}</div>
        </section>
        {isAdmin(user) && <CreateHearingButton to={{ path: '/hearing/new' }} />}
      </div>
    );
  }
}

Home.propTypes = {
  intl: intlShape.isRequired,
  dispatch: PropTypes.func,
  openHearings: PropTypes.object,
  topHearing: PropTypes.object,
  language: PropTypes.string, // make sure changing language refreshes
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  topHearing: getTopHearing(state),
  language: state.language,
  openHearings: getOpenHearings(state),
  user: getUser(state),
});

const WrappedHome = connect(mapStateToProps)(injectIntl(Home));
// We need to re-hoist the static fetchData to the wrapped component due to react-intl:
WrappedHome.fetchData = Home.fetchData;
export default WrappedHome;
