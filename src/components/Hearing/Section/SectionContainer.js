import React from 'react';
import {connect} from 'react-redux';
import {getSections} from '../../../selectors/hearing';
import isEmpty from 'lodash/isEmpty';

export class SectionContainer extends React.Component {
  render() {
    const {sections, match} = this.props;
    const section = sections.find(sec => sec.id === match.params.sectionId);

    return (
      <div>
        {isEmpty(section) ?
          <div>Loading</div>
          : <div className="container">
            {section.id}
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  sections: getSections(state, ownProps.match.params.hearingSlug)
});

export default connect(mapStateToProps)(SectionContainer);
