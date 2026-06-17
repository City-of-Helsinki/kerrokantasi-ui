import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button } from 'hds-react';
import orderBy from 'lodash/orderBy';

import { formatPageTitle } from '../utils/pageTitle';
import { fetchHearingList } from '../actions';
import { getTopHearing, getOpenHearings } from '../selectors/hearing';
import getUser from '../selectors/user';
import FullWidthHearing from '../components/FullWidthHearing';
import HearingCardList from '../components/HearingCardList';
import OverviewMap from '../components/OverviewMap';
import Link from '../components/LinkWithLang';
import CreateHearingButton from '../components/Hearings/CreateHearingButton';
import { isAdmin } from '../utils/user';
import config from '../config';

function fetchData(dispatch) {
  return Promise.all([
    dispatch(
      fetchHearingList('topHearing', '/v1/hearing', {
        ordering: '-n_comments',
        open: true,
        limit: 1,
      })
    ),
    dispatch(
      fetchHearingList('openHearings', '/v1/hearing', {
        open: true,
        include: 'geojson',
      })
    ),
  ]);
}

export function Home({ topHearing, openHearings, language, user, dispatch }) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const [isMobile, setIsMobile] = useState(
    globalThis.window && window.innerWidth < 768
  );

  const handleResize = useCallback(() => {
    setIsMobile(globalThis.window && window.innerWidth < 768);
  }, []);

  useEffect(() => {
    fetchData(dispatch);
    if (globalThis.window) {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (globalThis.window) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [dispatch, handleResize]);

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
        <div className='container'>
          <div className='row'>
            <div className='col-xs-10 col-md-8 welcome-content'>
              <Helmet
                title={formatPageTitle(formatMessage({ id: 'welcome' }))}
                meta={[
                  {
                    name: 'description',
                    content: formatMessage({ id: 'descriptionTag' }),
                  },
                  {
                    property: 'og:description',
                    content: formatMessage({ id: 'descriptionTag' }),
                  },
                ]}
              />
              <h1>
                <FormattedMessage id='welcome' />
              </h1>
              <p className='lead'>
                <FormattedMessage id='welcomeMessage' />
              </p>
            </div>
          </div>
        </div>
        <div className='welcome-koro__bottom' />
      </section>
      <section className='page-section page-section--hearing-card'>
        <div className='container'>
          <h2 className='page-title'>
            <FormattedMessage id='openHearings' />
          </h2>
          {topHearing && (
            <FullWidthHearing
              hearing={topHearing}
              language={language}
              intl={intl}
            />
          )}
          {openHearings &&
            openHearings.data &&
            topHearing &&
            !openHearings.isFetching && (
              <div className='list'>
                <HearingCardList
                  hearings={orderBy(
                    openHearings.data.filter(
                      (hearing) => hearing.id !== topHearing.id
                    ),
                    ['close_at'],
                    ['desc']
                  )}
                  language={language}
                  intl={intl}
                />
                <p className='text-center'>
                  <Link to={{ path: '/hearings/list' }}>
                    <Button className='kerrokantasi-btn'>
                      <FormattedMessage id='allHearings' />
                    </Button>
                  </Link>
                </p>
              </div>
            )}
        </div>
        <div className='hearings-koro__bottom' />
      </section>
      <section className='page-section page-section--map'>
        <div className='container'>{hearingMap}</div>
      </section>
      {isAdmin(user) && <CreateHearingButton to={{ path: '/hearing/new' }} />}
    </div>
  );
}

Home.propTypes = {
  dispatch: PropTypes.func,
  openHearings: PropTypes.object,
  topHearing: PropTypes.object,
  language: PropTypes.string,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  topHearing: getTopHearing(state),
  language: state.language,
  openHearings: getOpenHearings(state),
  user: getUser(state),
});

const WrappedHome = connect(mapStateToProps)(Home);
WrappedHome.fetchData = fetchData;
export default WrappedHome;
