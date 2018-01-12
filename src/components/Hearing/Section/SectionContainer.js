import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import {
  getSections,
  getIsHearingPublished,
  getIsHearingClosed
} from '../../../selectors/hearing';
import isEmpty from 'lodash/isEmpty';
import SectionImage from './SectionImage';
import SectionClosureInfo from './SectionClosureInfo';
import SectionContacts from './SectionContacts';
import SectionBrowser from '../../SectionBrowser';
import getAttr from '../../../utils/getAttr';
import {SectionTypes} from '../../../utils/section';

export class SectionContainer extends React.Component {
  render() {
    const {showClosureInfo, sections, match, language} = this.props;
    const section = sections.find(sec => sec.id === match.params.sectionId);
    const sectionImage = section.images[0];
    const closureInfoContent = getAttr(sections.find(sec => sec.type === SectionTypes.CLOSURE).content, language);
    const showSectionBrowser = sections.filter(sec => sec.type !== SectionTypes.CLOSURE).length > 1;
    console.log(section);

    return (
      <div>
        {isEmpty(section) ?
          <div>Loading</div>
        :
          <div className="container">
            <div className="hearing-content-section">
              <Grid>
                <Row>
                  <Col md={8} mdOffset={2}>
                    {sectionImage &&
                      <SectionImage
                        image={sectionImage}
                        caption={getAttr(sectionImage.caption, language)}
                        title={getAttr(sectionImage.title, language)}
                      />
                    }
                    {!isEmpty(section.abstract) &&
                      <div
                        className="section-abstract lead"
                        dangerouslySetInnerHTML={{__html: getAttr(section.abstract, language)}}
                      />
                    }
                    {showClosureInfo
                      ? <SectionClosureInfo content={closureInfoContent} />
                      : null
                    }
                    {!isEmpty(section.content) &&
                      <div dangerouslySetInnerHTML={{__html: getAttr(section.content, language)}} />
                    }
                    {showSectionBrowser && <SectionBrowser />}
                    <SectionContacts />
                    {/* <SortableCommentList /> */}
                  </Col>
                </Row>
              </Grid>
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  showClosureInfo: getIsHearingClosed(state, ownProps.match.params.hearingSlug) && getIsHearingPublished(state, ownProps.match.params.hearingSlug),
  sections: getSections(state, ownProps.match.params.hearingSlug),
  language: state.language

});

SectionContainer.propTypes = {
  sections: PropTypes.array,
  match: PropTypes.object,
  language: PropTypes.string,
  showClosureInfo: PropTypes.bool
};

export default connect(mapStateToProps)(SectionContainer);
