import React from 'react';
import PropTypes from 'prop-types';
import MultiLanguageTextField, {TextFieldTypes} from '../forms/MultiLanguageTextField';
import keys from 'lodash/keys';

export class QuestionForm extends React.Component {
  render() {
    const {question} = this.props;

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
      </div>
    );
  }
}

QuestionForm.propTypes = {
  question: PropTypes.object
};

export default QuestionForm;
