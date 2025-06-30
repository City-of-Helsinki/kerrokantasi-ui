/* eslint-disable sonarjs/no-nested-functions */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Accordion, Button, Dialog, Notification } from 'hds-react';

import Icon from '../../utils/Icon';
import config from '../../config';
import Step1 from './HearingFormStep1';
import Step2 from './HearingFormStep2';
import Step3 from './HearingFormStep3';
import Step4 from './HearingFormStep4';
import Step5 from './HearingFormStep5';
import LoadSpinner from '../LoadSpinner';
import { contactShape, hearingShape, hearingEditorMetaDataShape, labelShape, organizationShape } from '../../types';

const ACCORDION_TOGGLE = 'div button';

const HearingForm = ({
  contactPersons,
  currentStep: initialStep,
  organizations,
  intl: { formatMessage },
  editorMetaData,
  hearing,
  isSaving,
  labels,
  language,
  hearingLanguages,
  show,
  sectionMoveUp,
  sectionMoveDown,
  addOption,
  deleteOption,
  onQuestionChange,
  onDeleteTemporaryQuestion,
  clearQuestions,
  initMultipleChoiceQuestion,
  initSingleChoiceQuestion,
  onAddMapMarker,
  onAddMapMarkersToCollection,
  onCreateMapMarker,
  onDeleteExistingQuestion,
  onHearingChange,
  onLanguagesChange,
  onSectionAttachment,
  onSectionAttachmentDelete,
  onSectionChange,
  onSectionImageSet,
  onSectionImageDelete,
  onSectionImageCaptionChange,
  onSaveChanges,
  onSaveAsCopy,
  onSaveAndPreview,
  onLeaveForm,
  errors,
}) => {
  const [currentStep, setCurrentStep] = useState(parseInt(initialStep, 10) || 1);

  const formSteps = [Step1, Step2, Step3, Step4, Step5];
  const stepRefs = useRef(formSteps.map((step) => createRef(step)));

  const nextStep = () => {
    const next = parseInt(currentStep, 10) + 1;
    const nextAccordion = stepRefs.current[currentStep];

    if (nextAccordion.current) {
      nextAccordion.current.querySelector(ACCORDION_TOGGLE).click();

      setTimeout(() => nextAccordion.current?.scrollIntoView({ behaviour: 'smooth' }), 250);
    }

    setCurrentStep(next);
  };

  const onToggleClick = useCallback(
    ($this, stepNumber) => {
      setTimeout(() => {
        const isOpen = $this.getAttribute('aria-expanded') === 'true';

        if (currentStep === stepNumber) {
          return;
        }

        if (isOpen) {
          setCurrentStep(stepNumber);
        }
      }, 500);
    },
    [currentStep],
  );

  useEffect(() => {
    if (show) {
      const toggles = stepRefs.current.map((step, index) => ({
        stepNumber: index + 1,
        node: step.current.querySelector(ACCORDION_TOGGLE),
      }));

      toggles.forEach((item) => {
        if (!item.node) {
          return;
        }
        item.node.addEventListener('click', () => onToggleClick(item.node, item.stepNumber));
      });

      return () => {
        toggles.forEach((item) => {
          if (!item.node) {
          return;
        }
          item.node.removeEventListener('click', () => onToggleClick(item.node, item.stepNumber));
        });
      };
    }
  }, [onToggleClick, show]);

  const getFormStep = (StepNode, stepIndex) => {
    const stepNumber = stepIndex + 1;
    const step = `${stepNumber}`;

    let title = formatMessage({ id: `hearingFormHeaderStep${stepNumber}` });

    const stepErrors = errors[stepNumber] || {};

    if (errors[stepNumber] && Object.keys(errors[stepNumber]).length > 0) {
      title += formatMessage({ id: 'hearingFormHeaderContainsErrors' });
    }

    const isVisible = currentStep === stepNumber;

    return (
      <div ref={stepRefs.current[stepNumber - 1]} key={step}>
        <Accordion
          className='hearing-form-accordion'
          heading={title}
          language={language}
          initiallyOpen={stepIndex === 0}
          card
          theme={{
            '--padding-vertical': 'var(--spacing-3-xs)',
            '--padding-horizontal': '0',
          }}
        >
          <StepNode
            addOption={addOption}
            clearQuestions={clearQuestions}
            contactPersons={contactPersons}
            organizations={organizations}
            deleteOption={deleteOption}
            editorMetaData={editorMetaData}
            errors={stepErrors}
            formatMessage={formatMessage}
            hearing={hearing}
            hearingLanguages={hearingLanguages}
            initMultipleChoiceQuestion={initMultipleChoiceQuestion}
            initSingleChoiceQuestion={initSingleChoiceQuestion}
            labels={labels}
            language={language}
            onContinue={nextStep}
            onAddMapMarker={onAddMapMarker}
            onAddMapMarkersToCollection={onAddMapMarkersToCollection}
            onCreateMapMarker={onCreateMapMarker}
            onDeleteExistingQuestion={onDeleteExistingQuestion}
            onDeleteTemporaryQuestion={onDeleteTemporaryQuestion}
            onHearingChange={onHearingChange}
            onLanguagesChange={onLanguagesChange}
            onQuestionChange={onQuestionChange}
            onSectionAttachment={onSectionAttachment}
            onSectionAttachmentDelete={onSectionAttachmentDelete}
            onSectionChange={onSectionChange}
            onSectionImageSet={onSectionImageSet}
            onSectionImageDelete={onSectionImageDelete}
            onSectionImageCaptionChange={onSectionImageCaptionChange}
            sectionMoveDown={sectionMoveDown}
            sectionMoveUp={sectionMoveUp}
            visible={isVisible}
          />
        </Accordion>
      </div>
    );
  };

  const getActions = () => {
    let ActionButton;

    if (hearing.published) {
      ActionButton = () => (
        <div className='btn-toolbar'>
          <Button className='kerrokantasi-btn' onClick={onSaveAsCopy}>
            <Icon name='copy' /> <FormattedMessage id='copyHearing' />
          </Button>
          <Button className='kerrokantasi-btn black' onClick={onSaveChanges}>
            <Icon className='icon' name='check-circle-o' /> <FormattedMessage id='saveHearingChanges' />
          </Button>
        </div>
      );
    } else {
      ActionButton = () => (
        <Button className='kerrokantasi-btn black' onClick={onSaveAndPreview}>
          <Icon className='icon' name='check-circle-o' /> <FormattedMessage id='saveAndPreviewHearing' />
        </Button>
      );
    }

    if (!isSaving) {
      return <ActionButton />;
    }

    return (
      <div className='pull-right'>
        <LoadSpinner />
      </div>
    );
  };

  const getErrors = () => {
    if (!errors || !Object.keys(errors).some((key) => Object.keys(errors[key]).length > 0)) {
      return null;
    }
    /**
     * Iterates through each key in the errors object and if they contain keys we iterate through those keys.
     *
     * Push a list element with text from each specific inner value and we end up with a list for each
     * key ie. title/slug that contains a ul with each value listed.
     * @example
     * {1: {title: 'Fill in title', slug: 'Fill in address'},
     * 4: {},
     * 5: {project_title: 'Fill in project title'}
     * }
     * <li>hearingFormHeaderStep1
     * <ul><li>'Fill in title'</li><li>'Fill in address'</li></ul>
     * </li>
     * <li>hearingFormHeaderStep5
     * <ul><li>'Fill in project title'</li></ul>
     * </li>
     */

    const messages = Object.keys(errors).reduce((rootAccumulator, currentRootValue) => {
      if (Object.keys(errors[currentRootValue]).length > 0) {
        const subErrors = Object.keys(errors[currentRootValue]).reduce((accumulator, currentValue) => {
          accumulator.push(<li key={currentValue}>{errors[currentRootValue][currentValue]}</li>);
          return accumulator;
        }, []);
        rootAccumulator.push(
          <li key={currentRootValue}>
            {formatMessage({ id: `hearingFormHeaderStep${currentRootValue}` })}
            <ul>{subErrors}</ul>
          </li>,
        );
      }
      return rootAccumulator;
    }, []);
    return (
      <Notification
        type='error'
        label={<FormattedMessage id='saveFailed' />}
        style={{ marginBottom: 'var(--spacing-s)' }}
      >
        <ul>{messages}</ul>
      </Notification>
    );
  };

  if (!show) {
    return null;
  }

  const titleId = 'hearing-form-title';
  const descriptionId = 'hearing-form-description';

  return (
    <Dialog
      className='form-container container hearing-form-modal'
      isOpen={show}
      close={onLeaveForm}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      closeButtonLabelText={formatMessage({ id: 'close' })}
      theme={{ '--accent-line-color': 'var(--color-black)' }}
    >
      <Dialog.Header id={titleId} title={<FormattedMessage id='editHearing' />} />
      <Dialog.Content>
        <div id={descriptionId}>
          <a style={{ lineHeight: 2 }} href={config.adminHelpUrl} rel='noopener noreferrer' target='_blank'>
            <FormattedMessage id='help' />
          </a>
          {getErrors()}
          <form>{formSteps.map((step, index) => getFormStep(step, index))}</form>
        </div>
      </Dialog.Content>
      <Dialog.ActionButtons className='hearing-form-action-buttons'>
        <Button className='kerrokantasi-btn' onClick={onLeaveForm}>
          <FormattedMessage id='cancel' />
        </Button>
        {getActions()}
      </Dialog.ActionButtons>
    </Dialog>
  );
};

HearingForm.propTypes = {
  addOption: PropTypes.func,
  clearQuestions: PropTypes.func,
  contactPersons: PropTypes.arrayOf(contactShape),
  organizations: PropTypes.arrayOf(organizationShape),
  currentStep: PropTypes.number,
  deleteOption: PropTypes.func,
  editorMetaData: hearingEditorMetaDataShape,
  errors: PropTypes.object,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  initMultipleChoiceQuestion: PropTypes.func,
  initSingleChoiceQuestion: PropTypes.func,
  isSaving: PropTypes.bool,
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  onAddMapMarker: PropTypes.func,
  onAddMapMarkersToCollection: PropTypes.func,
  onCreateMapMarker: PropTypes.func,
  onDeleteExistingQuestion: PropTypes.func,
  onDeleteTemporaryQuestion: PropTypes.func,
  onHearingChange: PropTypes.func,
  onLanguagesChange: PropTypes.func,
  onLeaveForm: PropTypes.func,
  onQuestionChange: PropTypes.func,
  onSaveAndPreview: PropTypes.func,
  onSaveChanges: PropTypes.func,
  onSaveAsCopy: PropTypes.func,
  onSectionAttachment: PropTypes.func,
  onSectionAttachmentDelete: PropTypes.func,
  onSectionChange: PropTypes.func,
  onSectionImageSet: PropTypes.func,
  onSectionImageDelete: PropTypes.func,
  onSectionImageCaptionChange: PropTypes.func,
  sectionMoveDown: PropTypes.func,
  sectionMoveUp: PropTypes.func,
  show: PropTypes.bool,
  intl: PropTypes.object,
};

export default connect(null, null, null)(injectIntl(HearingForm));
