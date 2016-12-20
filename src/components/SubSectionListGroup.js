import React, {PropTypes} from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import Icon from '../utils/Icon';
import getAttr from '../utils/getAttr';

const SubSectionListGroup = ({sections, language = 'fi'}) => (
  <ListGroup className="subsection-list-group">
    {sections && sections.map((section) =>
      <ListGroupItem className="subsection-list-group-item" key={section.id} href={`#hearing-subsection-${section.id}`}>
        <span className="subsection-list-group-item__title">
          {getAttr(section.title, language)}
        </span>
        <div className="subsection-list-group-item__comments comment-icon">
          <Icon name="comment-o"/>&nbsp;{section.n_comments}
        </div>
      </ListGroupItem>
    )}
  </ListGroup>);

SubSectionListGroup.propTypes = {
  sections: PropTypes.array,
  language: PropTypes.string
};

SubSectionListGroup.contextTypes = {
  language: PropTypes.string
};

export default SubSectionListGroup;
