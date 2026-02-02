import React, { useCallback, useEffect, Suspense, lazy, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import Helmet from 'react-helmet';
import { useIntl } from 'react-intl';
import { createAction } from 'redux-actions';

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
  syncHearingToEditor,
  hearingDraft,
  hearingLanguages,
  isLoading,
  labels,
  language,
  organizations,
  user,
}) => {
  const { hearingSlug } = useParams();
  const hearing = useSelector((state) => getHearingWithSlug(state, hearingSlug));
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const [shouldFetch, setShouldFetch] = useState(() => hearingSlug && isEmpty(hearing));

  const userCanEditHearing = useMemo(() => canEdit(user, hearing), [hearing, user]);

  const fetchHearingData = useCallback(() => {
    if (hearingSlug !== null && shouldFetch) {
      setShouldFetch(false); // Set immediately to prevent race condition

      if (location.search.includes('?preview')) {
        // regex match to get the ?preview=key and substring to retrieve the key part
        fetchHearing(hearingSlug, location.search.match(/\?preview=([\w+-]+)/g)[0].substring(9));
      } else {
        fetchHearing(hearingSlug);
      }
      fetchProjectsList();
    }
  }, [fetchHearing, fetchProjectsList, location.search, hearingSlug, shouldFetch]);

  useEffect(() => {
    if (isEmpty(hearing) && !isLoading) {
      fetchHearingData();
    }
  }, [hearing, isLoading, fetchHearingData]);

  useEffect(() => {
    if (!isEmpty(hearing) && !isEmpty(user) && userCanEditHearing) {
      // Sync hearing to editor if they don't match
      if (!hearingDraft || hearingDraft.slug !== hearing.slug) {
        syncHearingToEditor(hearing);
      }
      fetchEditorMetaData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hearing.slug, user, userCanEditHearing, hearingDraft?.slug]);

  useEffect(() => {
    if (location.state) {
      if (!isEmpty(hearing) && hearing.slug && hearing.default_to_fullscreen && !location.state.fromFullscreen) {
        navigate({
          pathname: `/${hearing.slug}/fullscreen`,
          search: `?lang=${language}`,
        });
      }
    } else if (!isEmpty(hearing) && hearing.slug && hearing.default_to_fullscreen) {
      navigate({
        pathname: `/${hearing.slug}/fullscreen`,
        search: `?lang=${language}`,
      });
    }
  }, [hearing, language, location.state, navigate]);

  const helmetMeta = [
    { name: 'description', content: html2text(getAttr(hearing.abstract, language)) },
    { property: 'og:description', content: html2text(getAttr(hearing.abstract, language)) },
  ];

  if (hearing?.main_image?.url) {
    helmetMeta.push({ property: 'og:image', content: hearing.main_image.url });
  }

  let hearingContent;

  if (!isEmpty(hearing)) {
    hearingContent = (
      <>
        <Helmet title={getAttr(hearing.title, language)} meta={helmetMeta} />
        {!isEmpty(user) && canEdit(user, hearing) && (
          <Suspense fallback={<LoadSpinner />}>
            <HearingEditor
              data-testid='hearingEditor'
              hearing={hearingDraft}
              hearingLanguages={hearingLanguages}
              labels={labels}
              user={user}
              isLoading={isLoading}
              organizations={organizations}
              navigate={navigate}
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
    );
  } else if (shouldFetch || isLoading) {
    hearingContent = <LoadSpinner />;
  } else {
    hearingContent = <h1 style={{ textAlign: 'center' }}>{intl.formatMessage({ id: 'hearingNotFound' })}</h1>;
  }

  return <div className='hearing-page'>{hearingContent}</div>;
};

HearingContainerComponent.propTypes = {
  language: PropTypes.string,
  user: PropTypes.object,
  labels: PropTypes.array,
  hearingDraft: PropTypes.object,
  hearingLanguages: PropTypes.array,
  isLoading: PropTypes.bool,
  organizations: PropTypes.arrayOf(organizationShape),
  fetchHearing: PropTypes.func,
  fetchEditorMetaData: PropTypes.func,
  syncHearingToEditor: PropTypes.func,
  setLanguage: PropTypes.func,
  fetchProjectsList: PropTypes.func,
};

const mapStateToProps = (state) => ({
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
  syncHearingToEditor: (hearing) => dispatch(createAction('receiveHearing')({ data: hearing })),
  setLanguage: (lang) => dispatch(setLanguageAction(lang)),
  fetchProjectsList: () => dispatch(fetchProjects()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HearingContainerComponent);
