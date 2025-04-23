import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { v1 as uuid } from 'uuid';
import { head, last } from 'lodash';
import { Accordion, Button } from 'hds-react';

import Icon from '../../utils/Icon';
import SectionForm from './SectionForm';
import { addSection, removeSection } from '../../actions/hearingEditor';
import { getMainSection, isPublic } from '../../utils/hearing';
import { hearingShape } from '../../types';
import { initNewSection, SectionTypes } from '../../utils/section';
import getAttr from '../../utils/getAttr';

const HearingFormStep2 = ({
  hearing,
  hearingLanguages,
  sectionMoveUp,
  sectionMoveDown,
  addOption,
  deleteOption,
  onQuestionChange,
  onDeleteTemporaryQuestion,
  clearQuestions,
  initMultipleChoiceQuestion,
  initSingleChoiceQuestion,
  onSectionAttachment,
  onSectionAttachmentDelete,
  onSectionChange,
  onSectionImageSet,
  onSectionImageDelete,
  onSectionImageCaptionChange,
  language,
  onDeleteExistingQuestion,
  onContinue,
  intl,
}) => {
  const [activeSection, setActiveSection] = useState(getMainSection(hearing).frontId);

  const dispatch = useDispatch();

  const scrollModalToTop = () => {
    if (document && document.getElementsByClassName) {
      const modal = head(document.getElementsByClassName('modal'));
      if (modal) {
        modal.scrollTop = 0;
      }
    }
  };

  const deleteSection = (sectionID) => {
    const { sections } = hearing;

    dispatch(removeSection(sectionID));

    setActiveSection(sections[sections.length - 2].frontId);
    scrollModalToTop();
  };

  const getDeleteSectionButton = (section, sectionID) => {
    if (section.type !== 'main') {
      return (
        <Button className='kerrokantasi-btn danger' onClick={() => deleteSection(sectionID)}>
          <Icon className='icon' name='trash' /> <FormattedMessage id='deleteSection' />
        </Button>
      );
    }
    return null;
  };

  const getSections = () =>
    hearing.sections
      .filter(({ type }) => type !== SectionTypes.CLOSURE)
      .map((section, index) => {
        const sectionHeader = intl.formatMessage({
          id: `${section.type}Section`,
        });
        const sectionID = section.frontId;
        const heading = `${sectionHeader}: ${getAttr(section.title, language) || ''}`;

        return (
          <Accordion
            className='section-accordion'
            key={sectionID}
            heading={heading}
            language={language}
            initiallyOpen={activeSection === sectionID}
            card
            theme={{
              '--padding-vertical': 'var(--spacing-3-xs)',
              '--padding-horizontal': '0',
            }}
          >
            <SectionForm
              addOption={addOption}
              clearQuestions={clearQuestions}
              deleteOption={deleteOption}
              initMultipleChoiceQuestion={initMultipleChoiceQuestion}
              initSingleChoiceQuestion={initSingleChoiceQuestion}
              isFirstSubsection={index === 1}
              isLastSubsection={sectionID === last(hearing.sections).frontId}
              isPublic={isPublic(hearing)}
              onDeleteTemporaryQuestion={onDeleteTemporaryQuestion}
              onQuestionChange={onQuestionChange}
              onSectionAttachment={onSectionAttachment}
              onSectionAttachmentDelete={onSectionAttachmentDelete}
              onSectionChange={onSectionChange}
              onSectionImageSet={onSectionImageSet}
              onSectionImageDelete={onSectionImageDelete}
              onSectionImageCaptionChange={onSectionImageCaptionChange}
              section={section}
              sectionLanguages={hearingLanguages}
              sectionMoveDown={sectionMoveDown}
              sectionMoveUp={sectionMoveUp}
              onDeleteExistingQuestion={onDeleteExistingQuestion}
            />
            <div className='section-toolbar'>{getDeleteSectionButton(section, sectionID)}</div>
          </Accordion>
        );
      });

  const addSectionFn = (type) => {
    const newSection = initNewSection();

    newSection.frontId = uuid();
    newSection.type = type;

    dispatch(addSection(newSection));

    setActiveSection(newSection.frontId);
    scrollModalToTop();
  };

  return (
    <div className='form-step'>
      {getSections()}
      <div className='new-section-toolbar'>
        <Button size='small' className='kerrokantasi-btn' onClick={() => addSectionFn('part')}>
          <Icon className='icon' name='plus' /> <FormattedMessage id='addSection' />
        </Button>
      </div>
      <div className='step-footer'>
        <Button className='kerrokantasi-btn' onClick={onContinue}>
          <FormattedMessage id='hearingFormNext' />
        </Button>
      </div>
    </div>
  );
};

HearingFormStep2.propTypes = {
  addOption: PropTypes.func,
  clearQuestions: PropTypes.func,
  deleteOption: PropTypes.func,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  initMultipleChoiceQuestion: PropTypes.func,
  initSingleChoiceQuestion: PropTypes.func,
  language: PropTypes.string,
  onContinue: PropTypes.func,
  onDeleteExistingQuestion: PropTypes.func,
  onDeleteTemporaryQuestion: PropTypes.func,
  onQuestionChange: PropTypes.func,
  onSectionAttachment: PropTypes.func,
  onSectionAttachmentDelete: PropTypes.func,
  onSectionChange: PropTypes.func,
  onSectionImageSet: PropTypes.func,
  onSectionImageDelete: PropTypes.func,
  onSectionImageCaptionChange: PropTypes.func,
  sectionMoveDown: PropTypes.func,
  sectionMoveUp: PropTypes.func,
  intl: PropTypes.object,
};

HearingFormStep2.contextTypes = {
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  language: state.language,
});

export default connect(mapStateToProps, null)(injectIntl(HearingFormStep2));
