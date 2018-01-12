import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import {
  getSections,
  getIsHearingPublished,
  getIsHearingClosed,
  getHearingContacts
} from '../../../selectors/hearing';
import isEmpty from 'lodash/isEmpty';
import SectionImage from './SectionImage';
import SectionClosureInfo from './SectionClosureInfo';
import SectionContacts from './SectionContacts';
import SectionBrowser from '../../SectionBrowser';
import ContactList from '../ContactList';
import getAttr from '../../../utils/getAttr';
import {SectionTypes} from '../../../utils/section';
import {injectIntl} from 'react-intl';

export class SectionContainer extends React.Component {

  componentWillMount() {
    const {sections, match, history} = this.props;
    if (isEmpty(match.params.sectionId) || isEmpty(sections.find(sec => sec.id === match.params.sectionId))) history.push(`/${match.params.hearingSlug}/${sections.find(sec => sec.type === SectionTypes.MAIN).id}`);
  }

  getSectionNav = () => {
    const {sections, location, match} = this.props;
    const filteredSections = sections.filter(section => section.type !== SectionTypes.CLOSURE);
    const currentSectionIndex = filteredSections.findIndex(section => section.id === match.params.sectionId);
    const prevPath = currentSectionIndex - 1 >= 0 ? `/${match.params.hearingSlug}/` + filteredSections[currentSectionIndex - 1].id : undefined;
    const nextPath = currentSectionIndex + 1 < filteredSections.length ? `/${match.params.hearingSlug}/` + filteredSections[currentSectionIndex + 1].id : undefined;

    return {
      prevPath,
      nextPath,
      currentNum: currentSectionIndex + 1,
      totalNum: filteredSections.length
    }
  }

  render() {
    const {showClosureInfo, sections, match, language, contacts, intl: {formatMessage}} = this.props;
    const section = sections.find(sec => sec.id === match.params.sectionId) || {};
    const sectionImage = section.images[0];
    const closureInfoContent = sections.find(sec => sec.type === SectionTypes.CLOSURE) ? getAttr(sections.find(sec => sec.type === SectionTypes.CLOSURE).content, language) : formatMessage({id: 'defaultClosureInfo'});
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
                    {showSectionBrowser && <SectionBrowser sectionNav={this.getSectionNav()} />}
                    <ContactList contacts={contacts} />
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
  language: state.language,
  contacts: getHearingContacts(state, ownProps.match.params.hearingSlug)
});

SectionContainer.propTypes = {
  sections: PropTypes.array,
  match: PropTypes.object,
  language: PropTypes.string,
  showClosureInfo: PropTypes.bool,
  contacts: PropTypes.array
};

export default injectIntl(connect(mapStateToProps)(SectionContainer));
