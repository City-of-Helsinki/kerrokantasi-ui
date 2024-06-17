/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React, { lazy, Suspense, useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import * as HearingEditorSelector from '../../selectors/hearingEditor';
import Header from '../../components/Hearing/Header';
import LoadSpinner from '../../components/LoadSpinner';
import Section from '../../components/Hearing/Section/SectionContainer';
import getAttr from '../../utils/getAttr';
import { canEdit } from '../../utils/hearing';
import { fetchHearing as fetchHearingAction, setLanguage as setLanguageAction, fetchProjects } from '../../actions';
import { fetchHearingEditorMetaData } from '../../actions/hearingEditor';
import { getHearingWithSlug } from '../../selectors/hearing';
import getUser from '../../selectors/user';
import { organizationShape } from '../../types';
import { html2text } from '../../utils/commonUtils';

const HearingEditor = lazy(() => import(/* webpackChunkName: "editor" */ '../../components/admin/HearingEditor'));

function HearingContainerComponent(props) {
  const {
    fetchProjectsList,
    fetchHearing,
    fetchEditorMetaData,
    history,
    hearing,
    user,
    language,
  } = props;
  const location = useLocation();
  const [hearingSlug, setHearingSlug] = useState();
  const params = useParams();
  setHearingSlug(params.hearingSlug);

  useEffect(() => {
    if (location.search.includes('?preview')) {
      // regex match to get the ?preview=key and substring to retrieve the key part
      fetchHearing(hearingSlug, location.search.match(/\?preview=([\w+-]+)/g)[0].substring(9));
    } else {
      fetchHearing(hearingSlug);
    }
    fetchEditorMetaData();
    fetchProjectsList();
  }, [fetchProjectsList, fetchHearing, fetchEditorMetaData, location.search, hearingSlug]);

  useEffect(() => {
    if (location.state) {
      if (
        !isEmpty(hearing) &&
        hearing.default_to_fullscreen &&
        !props.location.state.fromFullscreen
      ) {
        history.push({
          pathname: `/${props.hearing.slug}/fullscreen`,
          search: `?lang=${language}`,
        });
      }
    } else if (!isEmpty(props.hearing) && props.hearing.default_to_fullscreen) {
      history.push({
        pathname: `/${props.hearing.slug}/fullscreen`,
        search: `?lang=${language}`,
      });
    }
    /*
    if (isEmpty(user) && isEmpty(hearing) && !isEmpty(nextProps.user)) {
      props.fetchHearing(hearingSlug);
    } */
  }, [hearingSlug, location, history, hearing, user, language, props]);

  return (
    <div className='hearing-page'>
      {!isEmpty(hearing) ? (
        <>
          <Helmet
            title={getAttr(hearing.title, language)}
            meta={[
              { name: 'description', content: html2text(getAttr(hearing.abstract, language)) },
              { property: 'og:description', content: html2text(getAttr(hearing.abstract, language)) },
              hearing.main_image != null &&
                hearing.main_image.url && { property: 'og:image', content: hearing.main_image.url },
            ]}
          />
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
            <Routes>
              <Route path='/:hearingSlug/:sectionId' element={Section} />
              <Route path='/:hearingSlug' element={Section} />
            </Routes>
          </div>
        </>
      ) : (
        <LoadSpinner />
      )}
    </div>
  );
}

HearingContainerComponent.propTypes = {
  hearing: PropTypes.object,
  language: PropTypes.string,
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

const mapStateToProps = (state) => ({
  hearing: getHearingWithSlug(state, state.hearingSlug),
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
