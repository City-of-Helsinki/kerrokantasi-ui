import React from 'react';
import {intlShape} from 'react-intl';
import FullscreenPlugin from './FullscreenPlugin';
import {getHearingURL, getMainSection} from '../utils/hearing';
import {Hearing, wrapHearingComponent} from './Hearing';
import getAttr from '../utils/getAttr';


class FullscreenHearing extends Hearing {

  render() {
    const hearing = this.props.hearing;
    const user = this.props.user;
    const mainSection = getMainSection(hearing);
    const {language} = this.context;

    return (
      <div id="hearing">
        {mainSection ? <FullscreenPlugin
          canComment={this.isMainSectionCommentable}
          canVote={this.isMainSectionVotable}
          comments={this.props.sectionComments[mainSection.id]}
          detailURL={getHearingURL(hearing, {fullscreen: false})}
          headerTitle={getAttr(hearing.title, language)}
          onPostComment={this.onPostSectionComment.bind(this)}
          onPostVote={this.onVoteComment.bind(this)}
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

FullscreenHearing.contextTypes = {
  language: React.PropTypes.string
};

export default wrapHearingComponent(FullscreenHearing);
