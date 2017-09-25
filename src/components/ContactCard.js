import React from 'react';
import PropTypes from 'prop-types';
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

const ContactCard = ({className = '', activeLanguage, name, title, phone, email, organization, ...rest}) =>
  <div className={`contact-card ${className}`} {...rest}>
    <header>
      {name && <h5 style={{marginBottom: 5}}>{name}</h5>}
      {title || organization ?
        <div>
          {title ? <span>{getAttr(title, activeLanguage)}</span> : null}
          {title && organization ? <br/> : null}
          {organization ? <span>{organization}</span> : null}
        </div>
        : null}
    </header>
    <div className="contact-card__information">
      {phone && <ContactMethod icon="phone" value={phone} href={`tel:${phone}`}/>}
      {email && <ContactMethod icon="envelope-o" value={email} href={`mailto:${email}`}/>}
    </div>
  </div>;

ContactCard.propTypes = {
  className: PropTypes.string,
  activeLanguage: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.object,
  phone: PropTypes.string,
  email: PropTypes.string,
  organization: PropTypes.string
};

export default ContactCard;
