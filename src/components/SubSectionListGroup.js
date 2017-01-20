import React, {PropTypes} from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import Icon from '../utils/Icon';
import getAttr from '../utils/getAttr';
import {getSectionURL} from '../utils/section';
import {Link} from 'react-router';

const SubSectionListGroup = ({sections, language = 'fi', hearing, currentlyViewed}) => (
  <ListGroup className="subsection-list-group">
    {sections && sections.map((section) =>
      <Link to={getSectionURL(hearing.slug, section)}>
        <ListGroupItem className={currentlyViewed === section.id ? "subsection-list-group-item active" : "subsection-list-group-item"} key={section.id} href={`#hearing-subsection-${section.id}`}>
          <span className="subsection-list-group-item__title">
            {getAttr(section.title, language)}
          </span>
          <div className="subsection-list-group-item__comments comment-icon">
            <Icon name="comment-o"/>&nbsp;{section.n_comments}
          </div>
        </ListGroupItem>
      </Link>
    )}
  </ListGroup>);

SubSectionListGroup.propTypes = {
  sections: PropTypes.array,
  language: PropTypes.string,
  hearing: PropTypes.object,
  currentlyViewed: PropTypes.string,
};

SubSectionListGroup.contextTypes = {
  language: PropTypes.string
};

export default SubSectionListGroup;
