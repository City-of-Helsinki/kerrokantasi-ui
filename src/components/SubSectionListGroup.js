import React, {PropTypes} from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import Icon from '../utils/Icon';
import getAttr from '../utils/getAttr';
import {getSectionURL} from '../utils/section';

const SubSectionListGroup = ({sections, language = 'fi', hearing, currentlyViewed}) => (
  <ListGroup className="subsection-list-group">
    {sections && sections.map((section) =>
// <<<<<<< HEAD
      <ListGroupItem
        className={`subsection-list-group-item ${currentlyViewed === section.id ? "active" : ""}`}
        key={section.id}
        href={getSectionURL(hearing.slug, section)}
      >
        <span className="subsection-list-group-item__title">
          {getAttr(section.title, language)}
        </span>
        <div className="subsection-list-group-item__comments comment-icon">
          <Icon name="comment-o"/>&nbsp;{section.n_comments}
        </div>
      </ListGroupItem>
// =======
//       <Link key={section.id} to={getSectionURL(hearing.slug, section)}>
//         <ListGroupItem
//           className={`subsection-list-group-item ${currentlyViewed === section.id ? "active" : ""}`}
//           key={section.id}
//           href={`#hearing-subsection-${section.id}`}
//         >
//           <span className="subsection-list-group-item__title">
//             {getAttr(section.title, language)}
//           </span>
//           <div className="subsection-list-group-item__comments comment-icon">
//             <Icon name="comment-o"/>&nbsp;{section.n_comments}
//           </div>
//         </ListGroupItem>
//       </Link>
// >>>>>>> epic/hearing-manager
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
