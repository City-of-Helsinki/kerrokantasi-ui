import React from 'react';
import {injectIntl} from 'react-intl';
import Section from './Section';
import Icon from '../utils/Icon';
import {userCanComment, userCanVote} from '../utils/section';

class SectionList extends React.Component {
  render() {
    const {sections, nComments, user, basePath} = this.props;
    if (!sections || sections.length === 0) {
      return null;
    }
    return (<div>
      <h2>{sections.length === 1 ?
        sections[0].type_name_singular :
        sections[0].type_name_plural}
        <div className="section-title-comments">
          <Icon name="comment-o"/>&nbsp;{nComments}
        </div>
      </h2>
      {sections.map((section) => (
        <Section
          section={section}
          key={section.id}
          canComment={this.props.canComment && userCanComment(user, section)}
          onPostComment={this.props.onPostComment}
          canVote={this.props.canVote && userCanVote(user, section)}
          onPostVote={this.props.onPostVote}
          loadSectionComments={this.props.loadSectionComments}
          comments={this.props.sectionComments[section.id]}
          user={user}
          linkTo={`${basePath}/${section.id}`}
        />))}
    </div>);
  }
}

SectionList.propTypes = {
  basePath: React.PropTypes.string,
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  loadSectionComments: React.PropTypes.func,
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  sections: React.PropTypes.array,
  sectionComments: React.PropTypes.object,
  nComments: React.PropTypes.number,
  user: React.PropTypes.object,
};

export default (injectIntl(SectionList));
