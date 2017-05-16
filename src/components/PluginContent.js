/**
 * Created by riku on 11.5.2017.
 */
import React from 'react';
import MapdonHKRPlugin from './plugins/legacy/mapdon-hkr';
import MapdonKSVPlugin from './plugins/legacy/mapdon-ksv';
import MapQuestionnaire from './plugins/MapQuestionnaire';
import Alert from 'react-bootstrap/lib/Alert';

export default class PluginContent extends React.Component {

  render() {
    const {user, section, onPostComment, onPostVote} = this.props;
    const comments = this.props.comments ? this.props.comments.results : [];
    if (typeof window === 'undefined' || !section.plugin_identifier) {
      return <div />;
    }
    switch (section.plugin_identifier) {
      case "mapdon-hkr":
        return (
          <MapdonHKRPlugin
            data={section.plugin_data}
            onPostComment={onPostComment}
          />
        );
      case "mapdon-ksv":
        return (
          <MapdonKSVPlugin
            data={section.plugin_data}
            onPostComment={onPostComment}
            pluginPurpose="postComments"
            canSetNickname={user === null}
          />
        );
      case "map-questionnaire":
        return (
          <MapQuestionnaire
            data={section.plugin_data}
            onPostComment={onPostComment}
            onPostVote={onPostVote}
            comments={comments}
            pluginPurpose="postComments"
            canSetNickname={user === null}
            displayCommentBox={false}
            pluginSource={section.plugin_iframe_url}
          />
        );
      default:
        return <Alert>I do not know how to render the plugin {section.plugin_identifier}</Alert>;
    }
  }
}

PluginContent.propTypes = {
  comments: React.PropTypes.object,
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  section: React.PropTypes.object.isRequired,
  user: React.PropTypes.object
};
