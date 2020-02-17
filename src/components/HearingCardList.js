import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'react-bootstrap';
import HearingCard from './HearingCard';
import {hearingShape} from '../types';

const HearingCardList = ({hearings, language}) =>
  <Row className="hearing-card-list">
    {hearings && hearings.map((hearing) =>
      <Col xs={12} md={4} key={hearing.id}>
        <HearingCard hearing={hearing} language={language}/>
      </Col>
    )}
  </Row>;

HearingCardList.propTypes = {
  hearings: PropTypes.arrayOf(hearingShape),
  language: PropTypes.string
};

export default HearingCardList;
