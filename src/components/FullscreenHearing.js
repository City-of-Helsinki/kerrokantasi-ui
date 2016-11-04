import React from 'react';
import {intlShape} from 'react-intl';
import FullscreenPlugin from './FullscreenPlugin';
import {getHearingURL, getMainSection} from '../utils/hearing';
import {Hearing, wrapHearingComponent} from './Hearing';


class FullscreenHearing extends Hearing {

  render() {
    const hearing = this.props.hearing;
    const user = this.props.user;
    const onPostVote = this.onVoteComment.bind(this);
    const mainSection = getMainSection(hearing);

    return (
      <div id="hearing">
        {mainSection ? <FullscreenPlugin
          canComment={this.isMainSectionCommentable}
          canVote={this.isMainSectionVotable}
          comments={this.props.sectionComments[mainSection.id]}
          detailURL={getHearingURL(hearing, {fullscreen: false})}
          headerTitle={hearing.title}
          loadSectionComments={this.loadSectionComments.bind(this)}
          onPostComment={this.onPostSectionComment.bind(this)}
          onPostVote={onPostVote}
          section={mainSection}
          user={user}
        /> : null}
      </div>
    );
  }
}

FullscreenHearing.propTypes = {
  dispatch: React.PropTypes.func,
  hearing: React.PropTypes.object,
  hearingId: React.PropTypes.string,
  intl: intlShape.isRequired,
  location: React.PropTypes.object,
  sectionComments: React.PropTypes.object,
  user: React.PropTypes.object,
};

export default wrapHearingComponent(FullscreenHearing);
