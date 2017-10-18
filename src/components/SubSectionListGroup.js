import React from 'react';
import PropTypes from 'prop-types';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import Icon from '../utils/Icon';
import getAttr from '../utils/getAttr';
import {getSectionURL} from '../utils/section';
import {Link} from 'react-router-dom';

const SubSectionListGroup = ({sections, language = 'fi', hearing, currentlyViewed = null}) => (
  <ListGroup className="subsection-list-group">
    {sections &&
      sections.map(section => (
        <Link key={section.id} to={getSectionURL(hearing.slug, section)}>
          <ListGroupItem
            className={`subsection-list-group-item ${currentlyViewed === section.id ? 'active' : ''}`}
            key={section.id}
          >
            <div className="subsection-list-group-item__comments comment-icon">
              <Icon name="comment-o" />&nbsp;{section.n_comments}
            </div>
            <span className="subsection-list-group-item__title">{getAttr(section.title, language)}</span>
          </ListGroupItem>
        </Link>
      ))}
  </ListGroup>
);

SubSectionListGroup.propTypes = {
  sections: PropTypes.array,
  language: PropTypes.string,
  hearing: PropTypes.object,
  currentlyViewed: PropTypes.string,
};

SubSectionListGroup.contextTypes = {
  language: PropTypes.string,
};

export default SubSectionListGroup;
