import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';
import MultiLanguageTextField, {TextFieldTypes} from '../forms/MultiLanguageTextField';
import {Button, ProgressBar} from 'react-bootstrap';
import Icon from '../../utils/Icon';
import {FormattedMessage} from 'react-intl';
import getAttr from '../../utils/getAttr';

export class QuestionForm extends React.Component {
  /**
   * Delete an exisitng question from a section
   */
  handleDeleteExistingQuestion = () => {
    const {question, sectionId} = this.props;
    if (question.id && sectionId) {
      this.props.onDeleteExistingQuestion(sectionId, question.id);
    }
  }

  render() {
    const {question, sectionId, addOption, deleteOption, sectionLanguages, onQuestionChange, lang} = this.props;
    return question.frontId
      // display a form for newly generated questions
      ? (
        <div className="question-form" key={question.type}>
          <MultiLanguageTextField
            labelId=" "
            maxLength={120}
            name="abstract"
            onBlur={(value) => onQuestionChange('text', sectionId, question.frontId, "", value)}
            value={question.text}
            languages={sectionLanguages}
            fieldType={TextFieldTypes.TEXTAREA}
            placeholderId="questionTextPlaceholder"
          />
          {question.options.map((option, index) =>
            <div style={{display: 'flex'}} key={uuid()}>
              <div style={{flex: '19'}}>
                <MultiLanguageTextField
                  labelId="option"
                  showLabel
                  label={index + 1}
                  name="content"
                  onBlur={(value) => onQuestionChange('option', sectionId, question.frontId, index, value)}
                  rows="10"
                  value={option.text || {}}
                  languages={sectionLanguages}
                  placeholderId="questionOptionPlaceholder"
                />
              </div>
              <div style={{flex: '1', marginTop: '48px', marginLeft: '15px'}}>
                {
                  index !== 0 && index !== 1 && index === question.options.length - 1 &&
                  <Button bsStyle="danger" onClick={() => deleteOption(sectionId, question.frontId, index)}>
                    <Icon style={{fontSize: '24px'}} className="icon" name="trash" />
                  </Button>
                }
              </div>
            </div>
          )}
          <Button bsStyle="default" onClick={() => addOption(sectionId, question.frontId)}>
            <Icon className="icon" name="plus" /> <FormattedMessage id="addOption" />
          </Button>
        </div>
      )
      // display details of existing questions instead of a form
      : (
        <div>
          <h6>{getAttr(question.text, lang)}</h6>
          {
            <div>
              {
                 question.options.map(
                  (option) => {
                    const answerPercentage = Math.round((option.n_answers / question.n_answers) * 100) || 0;
                    return (
                      <div key={uuid()}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <div style={{color: 'blue', margin: 'auto 10px auto 0'}}>
                            {answerPercentage}%
                          </div>
                          <div>
                            {getAttr(option.text, lang)}
                          </div>
                        </div>
                        <ProgressBar now={answerPercentage} />
                      </div>
                    );
                  }
                )
              }
              <Button bsStyle="danger" onClick={this.handleDeleteExistingQuestion}>
                <FormattedMessage id="deleteQuestion" />
              </Button>
            </div>
          }
        </div>
      );
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
};

export default QuestionForm;
