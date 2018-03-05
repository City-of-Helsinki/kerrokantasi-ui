import React from 'react';
import PropTypes from 'prop-types';
import MultiLanguageTextField, {TextFieldTypes} from '../forms/MultiLanguageTextField';
import keys from 'lodash/keys';
import {Button} from 'react-bootstrap';

export class QuestionForm extends React.Component {
  render() {
    const {question, sectionId, addOption} = this.props;

    return (
      <div>
        <MultiLanguageTextField
          labelId="question"
          maxLength={120}
          name="abstract"
          onBlur={() => {}}
          value={'moi'}
          languages={['fi']}
          fieldType={TextFieldTypes.TEXTAREA}
          placeholderId="sectionAbstractPlaceholder"
        />
        {keys(question.options).map((option) =>
          <MultiLanguageTextField
            labelId="sectionContent"
            name="content"
            onBlur={() => {}}
            rows="10"
            value={'Wryy'}
            languages={['fi']}
            placeholderId="sectionContentPlaceholder"
          />
        )}
        <Button bsStyle="default" onClick={() => addOption(sectionId)}>
          Click here
        </Button>
      </div>
    );
  }
}

QuestionForm.propTypes = {
  question: PropTypes.object
};

export default QuestionForm;
