import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Section from './Section';

class SectionList extends React.Component {
  render() {
    const {sections} = this.props;
    if (!sections || sections.length === 0) {
      return null;
    }
    return (<div>
      <h2><FormattedMessage id="hearing-sections"/></h2>
      {sections.map((section) => (<Section section={section}
                                     key={section.id}
                                     canComment={this.props.canComment}
                                     onPostComment={this.props.onPostComment}
                                     canVote={this.props.canVote}
                                     onPostVote={this.props.onPostVote}
                                     loadSectionComments={this.props.loadSectionComments}
                                     comments={this.props.sectionComments[section.id] || {data: []}}
                                    />))}
    </div>);
  }
}

SectionList.propTypes = {
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  loadSectionComments: React.PropTypes.func,
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  sections: React.PropTypes.array,
  sectionComments: React.PropTypes.object,
};

export default (injectIntl(SectionList));
