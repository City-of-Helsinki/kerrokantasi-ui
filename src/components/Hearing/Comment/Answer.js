/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { v1 as uuid } from 'uuid';

import Icon from '../../../utils/Icon';

/**
 * Class declaration for answer component.
 */
const Answer = ({ answer }) => (
  <div style={{ borderBottom: '1px solid #ebedf1', padding: '8px 0', fontSize: '15px' }}>
    <p><strong>{answer.question}</strong></p>
    {
      answer.answers.map((ans) => (
        <div key={uuid()}>
          <span style={{ color: '#9fb6eb', marginRight: '4px' }}>
            <Icon className="icon" name="check" />
          </span>
          <p>{ans}</p>
        </div>
      ))
    }
  </div>
);

Answer.propTypes = {
  answer: PropTypes.object
};

export default Answer;
