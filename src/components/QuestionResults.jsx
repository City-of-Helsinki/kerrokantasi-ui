import React from 'react';
import PropTypes from 'prop-types';
import { v1 as uuid } from 'uuid';
import { FormattedMessage } from 'react-intl';

import ProgressBar from './ProgressBar';
import getAttr from '../utils/getAttr';

export const QuestionResultsComponent = ({ question, lang }) => {
  const totalAnswers = question.options.map((option) => option.n_answers).reduce((total, answers) => total + answers);

  return (
    <div>
      <h4>{getAttr(question.text, lang)}</h4>
      {question.options.map((option) => {
        const answerPercentage = Math.round((option.n_answers / totalAnswers) * 100) || 0;
        return (
          <div key={uuid()}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ color: 'blue', margin: '10px' }}>{answerPercentage}%</div>
              <div>{getAttr(option.text, lang)}</div>
            </div>
            <ProgressBar now={answerPercentage} />
          </div>
        );
      })}
      <p>
        <FormattedMessage id='totalQuestionVotes' values={{ n: question.n_answers }} />
      </p>
    </div>
  );
};

QuestionResultsComponent.propTypes = {
  question: PropTypes.object,
  lang: PropTypes.string,
};

export default QuestionResultsComponent;
