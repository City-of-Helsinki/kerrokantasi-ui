import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { v1 as uuid } from 'uuid';
import { head, last } from 'lodash';
import Accordion from 'react-bootstrap/lib/Accordion';
import { Button } from 'hds-react';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Panel from 'react-bootstrap/lib/Panel';

import Icon from '../../utils/Icon';
import SectionForm from './SectionForm';
import { addSection, removeSection } from '../../actions/hearingEditor';
import { getMainSection, isPublic } from '../../utils/hearing';
import { hearingShape } from '../../types';
import { initNewSection, SectionTypes } from '../../utils/section';
import getAttr from '../../utils/getAttr';

class HearingFormStep2 extends React.Component {
  static scrollModalToTop = () => {
    if (document && document.getElementsByClassName) {
      const modal = head(document.getElementsByClassName('modal'));
      if (modal) {
        modal.scrollTop = 0;
      }
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      activeSection: getMainSection(props.hearing).frontId,
    };
    this.addSection = this.addSection.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(activeSection) {
    if (activeSection === this.state.activeSection) {
      this.setState({ activeSection: '' }, HearingFormStep2.scrollModalToTop);
    } else {
      this.setState({ activeSection }, HearingFormStep2.scrollModalToTop);
    }
  }

  /*
   * Get element for each hearing section.
   * @returns {Array} - Array of Panel elements.
   */
  getSections() {
    const { language } = this.context;
    const {
      hearing,
      hearingLanguages,
      sectionMoveUp,
      sectionMoveDown,
      addOption,
      deleteOption,
      onQuestionChange,
      onDeleteTemporaryQuestion,
    } = this.props;
    return hearing.sections
      .filter(({ type }) => type !== SectionTypes.CLOSURE)
      .map((section, index) => {
        const sectionHeader = this.props.intl.formatMessage({
          id: `${section.type}Section`,
        });
        const sectionID = section.frontId;
        return (
          <Panel eventKey={sectionID} key={sectionID} bsStyle='info'>
            <Panel.Heading>
              <Panel.Title toggle>{`${sectionHeader}: ${getAttr(section.title, language) || ''}`}</Panel.Title>
            </Panel.Heading>
            <Panel.Collapse>
              <Panel.Body>
                <SectionForm
                  addOption={addOption}
                  clearQuestions={this.props.clearQuestions}
                  deleteOption={deleteOption}
                  initMultipleChoiceQuestion={this.props.initMultipleChoiceQuestion}
                  initSingleChoiceQuestion={this.props.initSingleChoiceQuestion}
                  isFirstSubsection={index === 1}
                  isLastSubsection={sectionID === last(hearing.sections).frontId}
                  isPublic={isPublic(hearing)}
                  onDeleteTemporaryQuestion={onDeleteTemporaryQuestion}
                  onEditSectionAttachmentOrder={this.props.onEditSectionAttachmentOrder}
                  onQuestionChange={onQuestionChange}
                  onSectionAttachment={this.props.onSectionAttachment}
                  onSectionAttachmentDelete={this.props.onSectionAttachmentDelete}
                  onSectionAttachmentEdit={this.props.onSectionAttachmentEdit}
                  onSectionChange={this.props.onSectionChange}
                  onSectionImageChange={this.props.onSectionImageChange}
                  section={section}
                  sectionLanguages={hearingLanguages}
                  sectionMoveDown={sectionMoveDown}
                  sectionMoveUp={sectionMoveUp}
                  onDeleteExistingQuestion={this.props.onDeleteExistingQuestion}
                />
                <div className='section-toolbar'>{this.getDeleteSectionButton(section, sectionID)}</div>
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
        );
      });
  }

  getDeleteSectionButton(section, sectionID) {
    if (section.type !== 'main') {
      return (
        <Button className={'kerrokantasi-btn danger'} onClick={() => this.deleteSection(sectionID)}>
          <Icon className='icon' name='trash' /> <FormattedMessage id='deleteSection' />
        </Button>
      );
    }
    return null;
  }

  /*
   * Add new section to the hearing
   * @param {str} type - Type of the new section to be created
   */
  addSection(type) {
    const newSection = initNewSection();
    newSection.frontId = uuid();
    newSection.type = type;
    this.props.dispatch(addSection(newSection));
    this.setState({ activeSection: newSection.frontId }, HearingFormStep2.scrollModalToTop);
  }

  /*
   * Remove section with given id.
   * @param {str} sectionID
   */
  deleteSection(sectionID) {
    const { sections } = this.props.hearing;
    this.props.dispatch(removeSection(sectionID));
    this.setState({ activeSection: sections[sections.length - 2].frontId }, HearingFormStep2.scrollModalToTop);
  }

  render() {
    return (
      <div className='form-step'>
        <Accordion activeKey={this.state.activeSection} onSelect={this.handleSelect}>
          {this.getSections()}
        </Accordion>
        <div className='new-section-toolbar'>
          <ButtonToolbar>
            <Button size='small' className='kerrokantasi-btn' onClick={() => this.addSection('part')}>
              <Icon className='icon' name='plus' /> <FormattedMessage id='addSection' />
            </Button>
          </ButtonToolbar>
        </div>
        <div className='step-footer'>
          <Button className='kerrokantasi-btn'  onClick={this.props.onContinue}>
            <FormattedMessage id='hearingFormNext' />
          </Button>
        </div>
      </div>
    );
  }
}

HearingFormStep2.propTypes = {
  addOption: PropTypes.func,
  clearQuestions: PropTypes.func,
  deleteOption: PropTypes.func,
  dispatch: PropTypes.func,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  initMultipleChoiceQuestion: PropTypes.func,
  initSingleChoiceQuestion: PropTypes.func,
  intl: intlShape.isRequired,
  onContinue: PropTypes.func,
  onDeleteExistingQuestion: PropTypes.func,
  onDeleteTemporaryQuestion: PropTypes.func,
  onEditSectionAttachmentOrder: PropTypes.func,
  onQuestionChange: PropTypes.func,
  onSectionAttachment: PropTypes.func,
  onSectionAttachmentDelete: PropTypes.func,
  onSectionAttachmentEdit: PropTypes.func,
  onSectionChange: PropTypes.func,
  onSectionImageChange: PropTypes.func,
  sectionMoveDown: PropTypes.func,
  sectionMoveUp: PropTypes.func,
};

HearingFormStep2.contextTypes = {
  language: PropTypes.string,
};

const WrappedHearingFormStep2 = connect()(injectIntl(HearingFormStep2));

export default WrappedHearingFormStep2;
