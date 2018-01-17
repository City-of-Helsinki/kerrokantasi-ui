import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'react-bootstrap';
import ContactCard from '../ContactCard';
import {FormattedMessage} from 'react-intl';

export const ContactListComponent = ({contacts, language}) => {
  return (
    <div className="hearing-contacts">
      <h3>
        <FormattedMessage id="contactPersons" />
      </h3>
      <Row>
        {contacts &&
          contacts.map((person, index) => (
            <Col
              xs={6}
              key={index + Math.random()} // eslint-disable-line react/no-array-index-key
              md={4}
            >
              <ContactCard activeLanguage={language} {...person} />
            </Col>
          ))}
      </Row>
    </div>
  );
};

ContactListComponent.propTypes = {
  contacts: PropTypes.array,
  language: PropTypes.string
};

export default ContactListComponent;
