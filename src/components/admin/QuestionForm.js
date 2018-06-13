import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';
import MultiLanguageTextField, {TextFieldTypes} from '../forms/MultiLanguageTextField';
import {Button} from 'react-bootstrap';
import Icon from '../../utils/Icon';
import {FormattedMessage} from 'react-intl';

export class QuestionForm extends React.Component {
  render() {
    const {question, sectionId, addOption, deleteOption, sectionLanguages, onQuestionChange} = this.props;

    return (
      <div className="question-form" key={question.type}>
        <MultiLanguageTextField
          labelId="question"
          maxLength={120}
          name="abstract"
          onBlur={(value) => onQuestionChange('text', sectionId, question.frontId, value)}
          value={question.text}
          languages={sectionLanguages}
          fieldType={TextFieldTypes.TEXTAREA}
          placeholderId="sectionAbstractPlaceholder"
        />
        {question.options.map((option, index) =>
          <div style={{display: 'flex'}} key={uuid()}>
            <div style={{flex: '19'}}>
              <MultiLanguageTextField
                labelId="option"
                showLabel
                label={index + 1}
                name="content"
                onBlur={(value) => onQuestionChange('option', sectionId, question.frontId, value, index)}
                rows="10"
                value={option.text}
                languages={sectionLanguages}
                placeholderId="sectionContentPlaceholder"
              />
            </div>
            <div style={{flex: '1', marginTop: '48px', marginLeft: '15px'}}>
              {index !== 0 && index !== 1 && index === question.options.length - 1 &&
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
    );
  }
}

QuestionForm.propTypes = {
  question: PropTypes.object,
  sectionId: PropTypes.string,
  addOption: PropTypes.func,
  deleteOption: PropTypes.func,
  sectionLanguages: PropTypes.array,
  onQuestionChange: PropTypes.func
};

export default QuestionForm;
