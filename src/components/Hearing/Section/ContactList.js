import React from 'react';
import PropTypes from 'prop-types';
import {Row} from 'react-bootstrap';
import ContactCard from '../../ContactCard';

export const ContactListComponent = ({contacts, language}) => {
  return (
    <Row>
      {contacts && contacts.map((person, index) => (
        <ContactCard
          activeLanguage={language}
          key={index + Math.random() /* eslint-disable-line react/no-array-index-key */}
          {...person}
        />
      ))}
    </Row>
  );
};

ContactListComponent.propTypes = {
  contacts: PropTypes.array,
  language: PropTypes.string
};

export default ContactListComponent;
