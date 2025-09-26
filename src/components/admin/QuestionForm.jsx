import React from 'react';
import PropTypes from 'prop-types';
import { v1 as uuid } from 'uuid';
import { Button } from 'hds-react';
import { FormattedMessage } from 'react-intl';

import ProgressBar from '../ProgressBar';
import MultiLanguageTextField, { TextFieldTypes } from '../forms/MultiLanguageTextField';
import Icon from '../../utils/Icon';
import getAttr from '../../utils/getAttr';

export class QuestionForm extends React.Component {
  /**
   * Delete an existing question from a section
   */
  handleDeleteExistingQuestion = () => {
    const { question, sectionId } = this.props;
    if (question.id && sectionId) {
      this.props.onDeleteExistingQuestion(sectionId, question.id);
    }
  };

  /**
   * Returns editable form for questions
   * @returns {JSX.Element}
   */
  getEditableForm = () => {
    const { question, sectionId, addOption, deleteOption, sectionLanguages, onQuestionChange } = this.props;
    return (
      <div className='question-form' key={question.type}>
        <MultiLanguageTextField
          labelId=' '
          maxLength={1000}
          name='abstract'
          onBlur={(value) => onQuestionChange('text', sectionId, question.frontId || question.id, '', value)}
          value={question.text}
          languages={sectionLanguages}
          fieldType={TextFieldTypes.TEXTAREA}
          placeholderId='questionTextPlaceholder'
        />
        {question.options.map((option, index) => (
          <div style={{ display: 'flex' }} key={`option-${index}`}>
            <div style={{ flex: '19' }}>
              <MultiLanguageTextField
                labelId='option'
                name={`content-${index}`}
                onBlur={(value) => onQuestionChange('option', sectionId, question.frontId || question.id, index, value)}
                rows='10'
                value={option.text || {}}
                languages={sectionLanguages}
                placeholderId='questionOptionPlaceholder'
              />
            </div>
            <div style={{ flex: '1', marginTop: '48px', marginLeft: '15px' }}>
              {question.options.length > 2 && index === question.options.length - 1 && (
                <Button
                  className={'kerrokantasi-btn danger'}
                  onClick={() => deleteOption(sectionId, question.frontId || question.id, index)}
                >
                  <Icon style={{ fontSize: '24px' }} className='icon' name='trash' />
                </Button>
              )}
            </div>
          </div>
        ))}
        <div>
          <Button className={'kerrokantasi-btn'} onClick={() => addOption(sectionId, question.frontId || question.id)}>
            <Icon className='icon' name='plus' /> <FormattedMessage id='addOption' />
          </Button>
        </div>
      </div>
    );
  };

  /**
   * Returns details of existing question
   * @returns {JSX.Element}
   */
  getQuestionDetails = () => {
    const { question, lang } = this.props;
    return (
      <div>
        <h6>{getAttr(question.text, lang)}</h6>
        {
          <div>
            {question.options.map((option) => {
              const answerPercentage = Math.round((option.n_answers / question.n_answers) * 100) || 0;
              return (
                <div key={uuid()}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ color: 'blue', margin: 'auto 10px auto 0' }}>{answerPercentage}%</div>
                    <div>{getAttr(option.text, lang)}</div>
                  </div>
                  <ProgressBar now={answerPercentage} />
                </div>
              );
            })}
            <Button className={'kerrokantasi-btn danger'} onClick={this.handleDeleteExistingQuestion}>
              <FormattedMessage id='deleteQuestion' />
            </Button>
          </div>
        }
      </div>
    );
  };

  render() {
    const { question, isPublic } = this.props;
    /**
     * Display editable form when question is new or when the hearing is not yet public/hasn't been public.
     * Otherwise display details of existing questions
     */
    return question.frontId || (question.id && !isPublic && question.n_answers === 0)
      ? this.getEditableForm()
      : this.getQuestionDetails();
  }
}

QuestionForm.propTypes = {
  question: PropTypes.object,
  sectionId: PropTypes.string,
  addOption: PropTypes.func,
  deleteOption: PropTypes.func,
  sectionLanguages: PropTypes.array,
  onQuestionChange: PropTypes.func,
  lang: PropTypes.string,
  onDeleteExistingQuestion: PropTypes.func,
  isPublic: PropTypes.bool,
};

export default QuestionForm;
