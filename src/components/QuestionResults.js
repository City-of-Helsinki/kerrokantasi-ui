import React from 'react';
import PropTypes from 'prop-types';
import getAttr from '../utils/getAttr';
import keys from 'lodash/keys';
import {ProgressBar} from 'react-bootstrap';

export const QuestionResultsComponent = ({question, lang}) => {
  return (
    <div>
      <h4>{getAttr(question.text, lang)}</h4>
      {keys(question.answers).map(
        (answerKey) =>
          <div key={answerKey}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{color: 'blue', margin: '10px'}}>
                {Math.round((question.answers[answerKey] / question.n_answers) * 100)}%
              </div>
              <div>
                {getAttr(question.options[answerKey])}
              </div>
            </div>
            <ProgressBar now={Math.round((question.answers[answerKey] / question.n_answers) * 100)} />
          </div>
        )
      }
    </div>
  );
};

QuestionResultsComponent.propTypes = {
  question: PropTypes.object,
  lang: PropTypes.string
};

export default QuestionResultsComponent;
