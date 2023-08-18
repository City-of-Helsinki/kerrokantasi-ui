/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';

import Icon from '../utils/Icon';
import getAttr from '../utils/getAttr';

const ContactMethod = ({icon, value, href}) =>
  <div className="contact-card__contact-method">
    {icon && <Icon name={icon}/>}
    {icon && ' '}
    {href ?
      <a href={href}>{value}</a>
      : value
    }
  </div>;

ContactMethod.propTypes = {
  icon: PropTypes.string,
  value: PropTypes.string,
  href: PropTypes.string
};

const ContactCard = ({
  className = '',
  activeLanguage,
  name,
  title,
  phone,
  email,
  organization,
  external_organization,
  additional_info,
  ...rest}
) => {
  const hasTitle = title && Object.keys(title).length;
  const visibleOrganization = external_organization ? additional_info : organization;
  return (
    <Col xs={12} md={4} className={`contact-card ${className}`} {...rest}>
      <header>
        {name && <h3 className="h5" style={{marginBottom: 5}}>{name}</h3>}
        {title || organization ?
          <div>
            {hasTitle ? <span>{getAttr(title, activeLanguage)}</span> : null}
            {hasTitle && organization ? <br/> : null}
            {visibleOrganization ? <span>{visibleOrganization}</span> : null}
          </div>
          : null}
      </header>
      <div className="contact-card__information">
        {phone && <ContactMethod icon="phone" value={phone} href={`tel:${phone}`}/>}
        {email && <ContactMethod icon="envelope-o" value={email} href={`mailto:${email}`}/>}
      </div>
    </Col>
  );
};


ContactCard.propTypes = {
  className: PropTypes.string,
  activeLanguage: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.object,
  phone: PropTypes.string,
  email: PropTypes.string,
  organization: PropTypes.string,
  external_organization: PropTypes.bool,
  additional_info: PropTypes.string
};

export default ContactCard;
