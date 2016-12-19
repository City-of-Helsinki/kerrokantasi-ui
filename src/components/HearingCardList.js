import React, {PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';
import HearingCard from './HearingCard';

const HearingCardList = ({hearings, language}) =>
  <Row className="hearing-card-list">
    {hearings && hearings.map((hearing) =>
      <Col sm={4} key={hearing.id}>
        <HearingCard hearing={hearing} language={language}/>
      </Col>
    )}
  </Row>;

HearingCardList.propTypes = {
  hearings: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  language: PropTypes.string
};

export default HearingCardList;
