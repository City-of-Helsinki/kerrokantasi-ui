import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import WrappedSection from './Section';
import {userCanComment, userCanVote} from '../utils/section';

class SectionList extends React.Component {
  render() {
    const {sections, user, basePath} = this.props;
    if (!sections || sections.length === 0) {
      return null;
    }
    return (<div>
      <h2>{sections.length === 1 ?
        sections[0].type_name_singular :
        sections[0].type_name_plural}
      </h2>
      {sections.map((section) => (
        <WrappedSection
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
  basePath: PropTypes.string,
  canComment: PropTypes.bool,
  canVote: PropTypes.bool,
  loadSectionComments: PropTypes.func,
  onPostComment: PropTypes.func,
  onPostVote: PropTypes.func,
  sections: PropTypes.array,
  sectionComments: PropTypes.object,
  user: PropTypes.object,
};

export default (injectIntl(SectionList));
