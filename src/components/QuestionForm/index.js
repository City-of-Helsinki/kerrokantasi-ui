import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Checkbox, Radio } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import uuid from 'uuid/v1';

import getAttr from '../../utils/getAttr';

const QuestionForm = ({question, lang, onChange, answers, canAnswer}) => {
  return (
    <FormGroup onChange={(ev) => onChange(question.id, question.type, parseInt(ev.target.value, 10))}>
      <h3 className="h4">{getAttr(question.text, lang)}</h3>
      {canAnswer && question.type === 'single-choice' && question.options.map((option) => {
          const optionContent = getAttr(option.text, lang);
          return (
            <Radio
              checked={answers && answers.answers.includes(option.id)}
              key={uuid()}
              value={option.id}
              onChange={() => {}}
            >
              {optionContent}
            </Radio>
          );
        })}
      {canAnswer && question.type === 'multiple-choice' && question.options.map((option) => (
        <Checkbox
          checked={answers && answers.answers.includes(option.id)}
          key={uuid()}
          value={option.id}
          onChange={() => {}}
        >
          {getAttr(option.text, lang)}
        </Checkbox>
        ))}
      {!canAnswer && <FormattedMessage id="logInToAnswer" />}
    </FormGroup>
  );
};

QuestionForm.propTypes = {
  question: PropTypes.object,
  lang: PropTypes.string,
  onChange: PropTypes.func,
  answers: PropTypes.any,
  canAnswer: PropTypes.bool
};


export default QuestionForm;
