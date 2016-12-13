import React, {PropTypes} from 'react';

const ContactCard = ({className = '', name, title, phone, email, organization, ...rest}) =>
  <div className={`contact-card ${className}`} {...rest}>
    <header>
      {name && <h4>{name}</h4>}
      {title || organization ?
        <h6>{title || ''}{title && organization ? `, ${organization}` : ''}</h6>
        : null}
    </header>
    <div className="contact-card__information">
      {phone && <a href={`tel:${phone}`}>{phone}</a>}
      {email && <a href={`mailto:${email}`}>{email}</a>}
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
