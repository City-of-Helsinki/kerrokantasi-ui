import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Fieldset, RadioButton, Checkbox } from 'hds-react';

import getAttr from '../../utils/getAttr';

/**
 * Renders a form for a question.
 *
 * @component
 * @param {boolean} autoFocus - Determines if the first input should be auto-focused.
 * @param {Object} question - The question object.
 * @param {string} lang - The language code for localization.
 * @param {function} onChange - The callback function for handling changes in the form.
 * @param {Object} answers - The answers object.
 * @param {boolean} canAnswer - Determines if the user can answer the question.
 * @returns {JSX.Element} The rendered QuestionForm component.
 */
const QuestionForm = ({ autoFocus, question, lang, onChange, answers, canAnswer }) => (
  <div data-testid='question-form-group' className='question-form-group'>
    <Fieldset
      heading={getAttr(question.text, lang)}
      className='question-form-fieldset'
      helperText={
        <FormattedMessage id={question.type === 'multiple-choice' ? 'questionHelpMulti' : 'questionHelpSingle'} />
      }
    >
      {canAnswer &&
        question.options.map((option, index) => {
          const props = {
            id: option.id,
            key: option.id,
            autoFocus: autoFocus && index === 0,
            checked: answers?.answers.includes(option.id),
            name: `question_${question.id}`,
            value: option.id,
            onChange: (e) => onChange(question.id, question.type, parseInt(e.target.value, 10)),
            label: getAttr(option.text, lang),
          };

          if (question.type === 'single-choice') {
            return <RadioButton key={`${question.id}-${question.type}`} {...props} />;
          }

          return <Checkbox key={`${question.id}-${question.type}`} {...props} />;
        })}
      {!canAnswer && <FormattedMessage id='logInToAnswer' />}
    </Fieldset>
  </div>
);

QuestionForm.propTypes = {
  autoFocus: PropTypes.bool,
  question: PropTypes.object,
  lang: PropTypes.string,
  onChange: PropTypes.func,
  answers: PropTypes.any,
  canAnswer: PropTypes.bool,
};

export default QuestionForm;
