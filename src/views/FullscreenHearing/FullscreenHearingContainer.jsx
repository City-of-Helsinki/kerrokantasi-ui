import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import { Button } from 'hds-react';
import logoWhite from '@city-images/logo-fi-white.svg';
import logoSwedishWhite from '@city-images/logo-sv-white.svg';

import PluginContent from '../../components/PluginContent';
import { getHearingWithSlug, getMainSection, getMainSectionComments } from '../../selectors/hearing';
import LoadSpinner from '../../components/LoadSpinner';
import getAttr from '../../utils/getAttr';
import { parseQuery } from '../../utils/urlQuery';
import {
  fetchHearing as fetchHearingAction,
  postSectionComment,
  postVote,
} from '../../actions';
import Link from '../../components/LinkWithLang';
import Icon from '../../utils/Icon';
import getUser from '../../selectors/user';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const FullscreenHearingContainerComponent = (ownProps) => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const hearing = useSelector((state) => getHearingWithSlug(state, params.hearingSlug));
  const mainSection = useSelector((state) => getMainSection(state, params.hearingSlug));
  const mainSectionComments = useSelector((state) => getMainSectionComments(state, params.hearingSlug));
  const user = useSelector((state) => getUser(state));
  const language = useSelector((state) => state.language);

  useEffect(() => {
    if (isEmpty(hearing)) {
      dispatch(fetchHearingAction(params.hearingSlug));
    }
  }, []);

  const onPostComment = (text, authorName, pluginData, geojson, label, images) => {
    const sectionCommentData = { text, authorName, pluginData, geojson, label, images };
    const { mainSection } = ownProps;
    const { hearingSlug } = params;
    const { authCode } = parseQuery(location.search);
    const commentData = { authCode, ...sectionCommentData };
    return dispatch(postSectionComment(hearingSlug, mainSection.id, commentData));
  };

  const onVoteComment = (commentId) => {
    const { mainSection } = ownProps;
    const { hearingSlug } = params;
    const sectionId = mainSection.id;
    dispatch(postVote(commentId, hearingSlug, sectionId));
  };

  const detailURL = `/${hearing.slug}`;

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
              <Link to={{ path: detailURL, state: { fromFullscreen: true } }}>
                {getAttr(hearing.title, language)}
              </Link>
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
