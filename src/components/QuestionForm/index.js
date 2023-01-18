import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Checkbox, Radio, HelpBlock } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import getAttr from '../../utils/getAttr';

const QuestionForm = ({autoFocus, question, lang, onChange, answers, canAnswer}) => {
  return (
    <FormGroup
      className="question-form-group"
      onChange={(ev) => onChange(question.id, question.type, parseInt(ev.target.value, 10))}
    >
      <fieldset className="question-form-fieldset">
        <legend>
          <h3 className="h4 question-label">{getAttr(question.text, lang)}</h3>
          <HelpBlock>
            <FormattedMessage id={question.type === 'multiple-choice' ? 'questionHelpMulti' : 'questionHelpSingle'} />
          </HelpBlock>
        </legend>
        {canAnswer && question.type === 'single-choice' && question.options.map((option, index) => {
          const optionContent = getAttr(option.text, lang);
          return (
            <Radio
              autoFocus={autoFocus && index === 0}
              checked={answers && answers.answers.includes(option.id)}
              key={option.id}
              name={`question_${question.id}`}
              value={option.id}
              onChange={() => {}}
            >
              {optionContent}
            </Radio>
          );
        })}
        {canAnswer && question.type === 'multiple-choice' && question.options.map((option, index) => (
          <Checkbox
            autoFocus={autoFocus && index === 0}
            checked={answers && answers.answers.includes(option.id)}
            key={option.id}
            name={`question_${question.id}`}
            value={option.id}
            onChange={() => {}}
          >
            {getAttr(option.text, lang)}
          </Checkbox>
        ))}
        {!canAnswer && <FormattedMessage id="logInToAnswer" />}
      </fieldset>
    </FormGroup>
  );
};

QuestionForm.propTypes = {
  autoFocus: PropTypes.bool,
  question: PropTypes.object,
  lang: PropTypes.string,
  onChange: PropTypes.func,
  answers: PropTypes.any,
  canAnswer: PropTypes.bool
};


export default QuestionForm;
