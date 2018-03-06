import React from 'react';
import PropTypes from 'prop-types';
import MultiLanguageTextField, {TextFieldTypes} from '../forms/MultiLanguageTextField';
import keys from 'lodash/keys';
import {Button} from 'react-bootstrap';
import Icon from '../../utils/Icon';
import {FormattedMessage} from 'react-intl';

export class QuestionForm extends React.Component {
  render() {
    const {question, sectionId, addOption, deleteOption, sectionLanguages} = this.props;

    return (
      <div>
        <MultiLanguageTextField
          labelId="question"
          maxLength={120}
          name="abstract"
          onBlur={() => {}}
          value={'moi'}
          languages={sectionLanguages}
          fieldType={TextFieldTypes.TEXTAREA}
          placeholderId="sectionAbstractPlaceholder"
        />
        {keys(question.options).map((optionKey, index) =>
          <div style={{display: 'flex'}}>
            <div style={{flex: '19'}}>
              <MultiLanguageTextField
                labelId="option"
                name="content"
                onBlur={() => {}}
                rows="10"
                value={'Wryy'}
                languages={sectionLanguages}
                placeholderId="sectionContentPlaceholder"
              />
            </div>
            <div style={{flex: '1', marginTop: '54px', marginLeft: '15px'}}>
              {index !== 0 && index !== 1 && index === keys(question.options).length - 1 &&
                <Button bsStyle="danger" onClick={() => deleteOption(sectionId, question.frontId, optionKey)}>
                  <Icon className="icon" name="trash" />
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
  sectionLanguages: PropTypes.array
};

export default QuestionForm;
