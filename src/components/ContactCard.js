import React, {PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';

const ContactMethod = ({name = null, value, href}) =>
  <div className="contact-card__contact-method">
    {name}
    {name && ': '}
    {href ?
      <a href={href}>{value}</a>
      : value
    }
  </div>;

ContactMethod.propTypes = {
  name: PropTypes.element,
  value: PropTypes.string,
  href: PropTypes.string
};

const contactCardStyles = {
  padding: '10px 0'
};

const ContactCard = ({className = '', name, title, phone, email, organization, ...rest}) =>
  <div className={`contact-card ${className}`} style={contactCardStyles} {...rest}>
    <header>
      {name && <h5>{name}</h5>}
      {title || organization ?
        <strong>
          {title || ''}
          {title && organization ? <br/> : null}
          {organization || ''}
        </strong>
        : null}
    </header>
    <div className="contact-card__information">
      {phone && <ContactMethod name={<FormattedMessage id="phone"/>} value={phone} href={`tel:${phone}`}/>}
      {email && <ContactMethod name={<FormattedMessage id="email"/>} value={email} href={`mailto:${email}`}/>}
    </div>
  </div>;

ContactCard.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  organization: PropTypes.string
};

export default ContactCard;
