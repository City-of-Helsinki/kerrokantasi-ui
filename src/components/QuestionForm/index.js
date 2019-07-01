import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Checkbox, Radio } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import uuid from 'uuid/v1';

import getAttr from '../../utils/getAttr';

const QuestionForm = ({question, lang, onChange, answers, loggedIn}) => {
  return (
    <FormGroup onChange={(ev) => onChange(question.id, question.type, parseInt(ev.target.value, 10))}>
      <h4>{getAttr(question.text, lang)}</h4>
      {loggedIn && question.type === 'single-choice' && question.options.map((option) => {
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
      {loggedIn && question.type === 'multiple-choice' && question.options.map((option) => (
        <Checkbox
          checked={answers && answers.answers.includes(option.id)}
          key={uuid()}
          value={option.id}
          onChange={() => {}}
        >
          {getAttr(option.text, lang)}
        </Checkbox>
        ))}
      {!loggedIn && <FormattedMessage id="logInToAnswer" />}
    </FormGroup>
  );
};

QuestionForm.propTypes = {
  question: PropTypes.object,
  lang: PropTypes.string,
  onChange: PropTypes.func,
  answers: PropTypes.any,
  loggedIn: PropTypes.bool
};


export default QuestionForm;
