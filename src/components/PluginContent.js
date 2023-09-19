/**
 * Created by riku on 11.5.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import MapQuestionnaire from './plugins/MapQuestionnaire';
import config from '../config';
import { get } from 'lodash';

export default class PluginContent extends React.Component {
  componentDidMount() {
    const { hearingSlug, section, comments } = this.props;
    // comment fetching may already be taking place in a comment list!
    // legacy plugins have no need for comments
    if (!get(comments, 'isFetching') &&
      !(section.plugin_identifier === "mapdon-hkr") &&
      !(section.plugin_identifier === "mapdon-ksv")) {
      this.props.fetchAllComments(hearingSlug, section.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { hearingSlug, section } = this.props;
    const isFetching = get(nextProps.comments, 'isFetching');
    const results = get(nextProps.comments, 'results');

    if (!isFetching && results && results.length === 0 && section.n_comments !== 0) {
      // comments have to be reloaded due to posting
      this.props.fetchAllComments(hearingSlug, nextProps.section.id, nextProps.comments.ordering);
    }
  }

  render() {
    const { section, onPostComment, onPostVote } = this.props;
    const comments = this.props.comments ? this.props.comments.results : [];
    if (typeof window === 'undefined' || !section.plugin_identifier) {
      return null;
    }
    switch (section.plugin_identifier) {
      // reserved word for legacy plugin
      case "mapdon-hkr":
        return (
          <MapQuestionnaire
            data={section.plugin_data}
            onPostComment={onPostComment}
            pluginInstanceId="hkr"
          />
        );
      // reserved word for legacy plugin
      case "mapdon-ksv":
        return (
          <MapQuestionnaire
            data={section.plugin_data}
            onPostComment={onPostComment}
            onPostVote={onPostVote}
            pluginInstanceId="ksv"
            pluginPurpose="postComments"
          />
        );
      // include here any other matching criteria, e.g. for non-map plugins
      default:
        return (
          <MapQuestionnaire
            comments={comments}
            data={section.plugin_data}
            onPostComment={onPostComment}
            onPostVote={onPostVote}
            pluginInstanceId="map"
            pluginPurpose="postComments"
            pluginSource={config.pluginMap[section.plugin_identifier].path} //
          />
        );
    }
  }
}

PluginContent.propTypes = {
  hearingSlug: PropTypes.string,
  fetchAllComments: PropTypes.func,
  comments: PropTypes.object,
  onPostComment: PropTypes.func,
  onPostVote: PropTypes.func,
  section: PropTypes.object.isRequired,
  user: PropTypes.object
};
