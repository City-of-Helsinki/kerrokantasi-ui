/* eslint-disable react/forbid-prop-types */
import React, { useCallback, useEffect, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { isEmpty } from 'lodash';
import Helmet from 'react-helmet';

import { organizationShape } from '../../types';
import { getHearingWithSlug } from '../../selectors/hearing';
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import getUser from '../../selectors/user';
import { fetchHearing as fetchHearingAction, setLanguage as setLanguageAction, fetchProjects } from '../../actions';
import { fetchHearingEditorMetaData } from '../../actions/hearingEditor';
import getAttr from '../../utils/getAttr';
import { html2text } from '../../utils/commonUtils';
import { canEdit } from '../../utils/hearing';
import LoadSpinner from '../../components/LoadSpinner';
import Header from '../../components/Hearing/Header';
import Section from '../../components/Hearing/Section/SectionContainer';

const HearingEditor = lazy(() => import('../../components/admin/HearingEditor'));

const HearingContainerComponent = ({
  fetchProjectsList,
  fetchHearing,
  fetchEditorMetaData,
  hearing,
  hearingDraft,
  hearingLanguages,
  history,
  intl,
  isLoading,
  labels,
  language,
  location,
  match: { params },
  organizations,
  setLanguage,
  user,
}) => {
  const { hearingSlug } = params;

  const fetchHearingData = useCallback(() => {
    if (hearingSlug !== null) {
      if (location.search.includes('?preview')) {
        // regex match to get the ?preview=key and substring to retrieve the key part
        fetchHearing(hearingSlug, location.search.match(/\?preview=([\w+-]+)/g)[0].substring(9));
      } else {
        fetchHearing(hearingSlug);
      }

      fetchProjectsList();
    }
  }, [fetchHearing, fetchProjectsList, location.search, hearingSlug]);

  useEffect(() => {
    if (isEmpty(hearing)) {
      fetchHearingData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, hearingSlug]);

  useEffect(() => {
    if (!isEmpty(hearing) && !isEmpty(user) && canEdit(user, hearing)) {
      fetchEditorMetaData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hearing, user]);

  useEffect(() => {
    if (location.state) {
      if (!isEmpty(hearing) && hearing.default_to_fullscreen && !location.state.fromFullscreen) {
        history.push({
          pathname: `/${hearing.slug}/fullscreen`,
          search: `?lang=${language}`,
        });
      }
    } else if (!isEmpty(hearing) && hearing.default_to_fullscreen) {
      history.push({
        pathname: `/${hearing.slug}/fullscreen`,
        search: `?lang=${language}`,
      });
    }
  }, [hearing, language, history, location.state]);

  const helmetMeta = [
    { name: 'description', content: html2text(getAttr(hearing.abstract, language)) },
    { property: 'og:description', content: html2text(getAttr(hearing.abstract, language)) },
  ];

  if (hearing?.main_image?.url) {
    helmetMeta.push({ property: 'og:image', content: hearing.main_image.url });
  }

  return (
    <div className='hearing-page'>
      {!isEmpty(hearing) ? (
        <>
          <Helmet title={getAttr(hearing.title, language)} meta={helmetMeta} />
          {!isEmpty(user) && canEdit(user, hearing) && (
            <Suspense fallback={<LoadSpinner />}>
              <HearingEditor
                hearing={hearingDraft}
                hearingLanguages={hearingLanguages}
                labels={labels}
                user={user}
                isLoading={isLoading}
                organizations={organizations}
              />
            </Suspense>
          )}
          <div className='hearing-wrapper' id='hearing-wrapper'>
            <Header hearing={hearing} language={language} intl={intl} setLanguage={setLanguage} />
            <Switch>
              <Route path='/:hearingSlug/:sectionId' component={Section} />
              <Route path='/:hearingSlug' component={Section} />
            </Switch>
          </div>
        </>
      ) : (
        <LoadSpinner />
      )}
    </div>
  );
};

HearingContainerComponent.propTypes = {
  hearing: PropTypes.object,
  intl: intlShape.isRequired,
  language: PropTypes.string,
  match: PropTypes.object,
  user: PropTypes.object,
  labels: PropTypes.array,
  hearingDraft: PropTypes.object,
  hearingLanguages: PropTypes.array,
  isLoading: PropTypes.bool,
  organizations: PropTypes.arrayOf(organizationShape),
  fetchHearing: PropTypes.func,
  fetchEditorMetaData: PropTypes.func,
  setLanguage: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  fetchProjectsList: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  hearing: getHearingWithSlug(state, ownProps.match.params.hearingSlug),
  language: state.language,
  hearingDraft: HearingEditorSelector.getPopulatedHearing(state),
  hearingLanguages: state.hearingEditor.languages,
  labels: HearingEditorSelector.getLabels(state),
  user: getUser(state),
  isLoading: HearingEditorSelector.getIsLoading(state),
  organizations: state.hearingEditor.organizations.all,
});

const mapDispatchToProps = (dispatch) => ({
  fetchHearing: (hearingSlug, preview = false) => dispatch(fetchHearingAction(hearingSlug, preview)),
  fetchEditorMetaData: () => dispatch(fetchHearingEditorMetaData()),
  setLanguage: (lang) => dispatch(setLanguageAction(lang)),
  fetchProjectsList: () => dispatch(fetchProjects()),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(HearingContainerComponent));
