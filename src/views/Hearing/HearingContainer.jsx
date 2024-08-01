/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React, { lazy, Suspense, useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { Routes, Route, useParams, useLocation, useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

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
    user,
    language,
    hearingDraft,
    hearingLanguages,
    organizations,
    isLoading,
    labels,
  } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [hearingSlug, setHearingSlug] = useState(null);
  const hearing = useSelector((state) => getHearingWithSlug(state, hearingSlug));

  useEffect(() => {
    setHearingSlug(params.hearingSlug);
  }, [params.hearingSlug]);

  useEffect(() => {
    if (hearingSlug !== null) {
      if (location.search.includes('?preview')) {
        // regex match to get the ?preview=key and substring to retrieve the key part
        fetchHearing(hearingSlug, location.search.match(/\?preview=([\w+-]+)/g)[0].substring(9));
      } else {
        fetchHearing(hearingSlug);
      }
      fetchEditorMetaData();
      fetchProjectsList();
    }
  }, [fetchProjectsList, fetchHearing, fetchEditorMetaData, location.search, hearingSlug]);

  useEffect(() => {
    if (location.state) {
      if (!isEmpty(hearing) && hearing.default_to_fullscreen && !location.state.fromFullscreen) {
        navigate({
          pathname: `/${hearing.slug}/fullscreen`,
          search: `?lang=${language}`,
        });
      }
    } else if (!isEmpty(hearing) && hearing.default_to_fullscreen) {
      navigate({
        pathname: `/${hearing.slug}/fullscreen`,
        search: `?lang=${language}`,
      });
    }
  }, [hearing, language, navigate, location.state]);

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
            <Header hearing={hearing} language={language} />
            <Routes>
              <Route path='/:sectionId' element={<Section />} />
              <Route path='/' element={<Section />} />
            </Routes>
          </div>
        </>
      ) : (
        <>
          <LoadSpinner />
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(HearingContainerComponent);
