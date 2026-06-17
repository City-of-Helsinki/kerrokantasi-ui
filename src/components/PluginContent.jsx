/* eslint-disable sonarjs/no-inverted-boolean-check */
/**
 * Created by riku on 11.5.2017.
 */
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import MapQuestionnaire from './plugins/MapQuestionnaire';
import config from '../config';

export default function PluginContent({
  hearingSlug,
  section,
  comments,
  fetchAllComments,
  onPostComment,
  onPostVote,
}) {
  // comment fetching may already be taking place in a comment list!
  // legacy plugins have no need for comments
  useEffect(() => {
    if (
      !get(comments, 'isFetching') &&
      !(section.plugin_identifier === 'mapdon-hkr') &&
      !(section.plugin_identifier === 'mapdon-ksv')
    ) {
      fetchAllComments(hearingSlug, section.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Replacement for UNSAFE_componentWillReceiveProps: re-fetch when comments
  // change and results are empty after a post.
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const isFetching = get(comments, 'isFetching');
    const results = get(comments, 'results');
    if (
      !isFetching &&
      results &&
      results.length === 0 &&
      section.n_comments !== 0
    ) {
      // comments have to be reloaded due to posting
      fetchAllComments(hearingSlug, section.id, comments.ordering);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments]);

  const commentResults = comments ? comments.results : [];

  if (typeof window === 'undefined' || !section.plugin_identifier) {
    return null;
  }

  switch (section.plugin_identifier) {
    // reserved word for legacy plugin
    case 'mapdon-hkr':
      return (
        <MapQuestionnaire
          data={section.plugin_data}
          onPostComment={onPostComment}
          pluginInstanceId='hkr'
        />
      );
    // reserved word for legacy plugin
    case 'mapdon-ksv':
      return (
        <MapQuestionnaire
          data={section.plugin_data}
          onPostComment={onPostComment}
          onPostVote={onPostVote}
          pluginInstanceId='ksv'
          pluginPurpose='postComments'
        />
      );
    // include here any other matching criteria, e.g. for non-map plugins
    default:
      return (
        <MapQuestionnaire
          comments={commentResults}
          data={section.plugin_data}
          onPostComment={onPostComment}
          onPostVote={onPostVote}
          pluginInstanceId='map'
          pluginPurpose='postComments'
          pluginSource={config.pluginMap[section.plugin_identifier].path} //
        />
      );
  }
}

PluginContent.propTypes = {
  hearingSlug: PropTypes.string,
  fetchAllComments: PropTypes.func,
  comments: PropTypes.object,
  onPostComment: PropTypes.func,
  onPostVote: PropTypes.func,
  section: PropTypes.object.isRequired,
};
