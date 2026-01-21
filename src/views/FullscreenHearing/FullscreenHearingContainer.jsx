/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import { Button } from 'hds-react';
import logoWhite from '@city-images/logo-fi-white.svg';
import logoSwedishWhite from '@city-images/logo-sv-white.svg';
import { useParams, useLocation } from 'react-router-dom';

import PluginContent from '../../components/PluginContent';
import { getHearingWithSlug, getMainSection, getMainSectionComments } from '../../selectors/hearing';
import LoadSpinner from '../../components/LoadSpinner';
import getAttr from '../../utils/getAttr';
import { parseQuery } from '../../utils/urlQuery';
import {
  fetchHearing as fetchHearingAction,
  postSectionComment,
  postVote,
  fetchAllSectionComments,
} from '../../actions';
import Link from '../../components/LinkWithLang';
import Icon from '../../utils/Icon';
import getUser from '../../selectors/user';

const FullscreenHearingContainerComponent = (ownProps) => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const hearing = useSelector((state) => getHearingWithSlug(state, params.hearingSlug));
  const mainSection = useSelector((state) => getMainSection(state, params.hearingSlug));
  const mainSectionComments = useSelector((state) => getMainSectionComments(state, params.hearingSlug));
  const user = useSelector((state) => getUser(state));
  const language = useSelector((state) => state.language);
  const fetchAllComments = (hearingSlug, sectionId, ordering) => {
    dispatch(fetchAllSectionComments(hearingSlug, sectionId, ordering));
  };

  useEffect(() => {
    if (isEmpty(hearing)) {
      dispatch(fetchHearingAction(params.hearingSlug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPostComment = (comment) => {
    const { mainSection } = ownProps;
    const { hearingSlug } = params;
    const { authCode } = parseQuery(location.search);
    const commentData = { authCode, ...comment };
    return dispatch(postSectionComment(hearingSlug, mainSection.id, commentData));
  };

  const onVoteComment = (commentId) => {
    const { mainSection } = ownProps;
    const { hearingSlug } = params;
    const sectionId = mainSection.id;
    dispatch(postVote(commentId, hearingSlug, sectionId));
  };

  // Use params.hearingSlug directly since we're already on this page via that slug
  const detailURL = `/${params.hearingSlug}`;

  return (
    <div id='hearing'>
      {isEmpty(hearing) ? (
        <LoadSpinner />
      ) : (
        <div className='fullscreen-hearing'>
          <div className='fullscreen-navigation'>
            <div className='logo'>
              <Link to={{ path: '/' }}>
                <FormattedMessage id='fullscreenHeaderLogoAlt'>
                  {(altText) => (
                    <img alt={altText} src={language === 'sv' ? logoSwedishWhite : logoWhite} className='logo' />
                  )}
                </FormattedMessage>
              </Link>
            </div>
            <div className='header-title'>
              <Link to={{ path: detailURL, state: { fromFullscreen: true } }}>{getAttr(hearing.title, language)}</Link>
            </div>
            <div className='minimize'>
              <Link to={{ path: detailURL, state: { fromFullscreen: true } }}>
                <Button>
                  <Icon name='compress' />
                </Button>
              </Link>
            </div>
          </div>
          <div className='plugin-content'>
            <PluginContent
              hearingSlug={params.hearingSlug}
              fetchAllComments={fetchAllComments}
              section={mainSection}
              comments={mainSectionComments}
              onPostComment={onPostComment}
              onPostVote={onVoteComment}
              user={user}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FullscreenHearingContainerComponent;
