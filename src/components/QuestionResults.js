import React from 'react';
import PropTypes from 'prop-types';
import getAttr from '../utils/getAttr';
import uuid from 'uuid/v1';
import {ProgressBar} from 'react-bootstrap';

export const QuestionResultsComponent = ({question, lang}) => {
  return (
    <div>
      <h4>{getAttr(question.text, lang)}</h4>
      {question.options.map(
        (option) => {
          const answerPercentage = Math.round((option.n_answers / question.n_answers) * 100) || 0;
          return (
            <div key={uuid()}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{color: 'blue', margin: '10px'}}>
                  {answerPercentage}%
                </div>
                <div>
                  {getAttr(option.text, lang)}
                </div>
              </div>
              <ProgressBar now={answerPercentage} />
            </div>
          );
        })
      }
    </div>
  );
};

QuestionResultsComponent.propTypes = {
  question: PropTypes.object,
  lang: PropTypes.string
};

export default QuestionResultsComponent;
