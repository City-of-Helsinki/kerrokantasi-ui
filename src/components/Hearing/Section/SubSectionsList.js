import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { FormattedMessage, FormattedPlural } from 'react-intl';

import getAttr from '../../../utils/getAttr';
import Icon from '../../../utils/Icon';
import Link from '../../LinkWithLang';
import {
  getSectionURL,
  isSectionCommentable,
  userCanComment,
} from '../../../utils/section';

// eslint-disable-next-line import/no-unresolved
import defaultImage from '@city-images/default-image.svg';

const SubsectionList = ({ hearing, language, user }) => {
  const sectionsWithoutClosure = hearing.sections.filter((section) => section.type !== 'closure-info');
  const subSections = sectionsWithoutClosure.filter((section) => section.type !== 'main');

  const bgImage = (section) => {
    return !isEmpty(section.images) ? 'url("' + section.images[0].url + '")' : `url(${defaultImage})`;
  };

  const isCommentable = (section) => {
    const hasPlugin = !!section.plugin_identifier;
    return isSectionCommentable(hearing, section, user) && !hasPlugin;
  };

  if (!subSections.length) {
    return null;
  }

  return (
    <section className="hearing-section subsections-list">
      <h2>
        <FormattedMessage id="hearingSubsectionsTitle" /> ({subSections.length})
      </h2>
      <div className="section-content-spacer">
        <ul className="subsection-grid">
          {subSections.map((section, index) => (
            <li key={section.id} className="subsection-grid-item">
              <div className="section-card">
                <Link
                  to={{ path: getSectionURL(hearing.slug, section) }}
                  className="section-card-image"
                  style={{ backgroundImage: bgImage(section) }}
                >
                  {section.commenting !== 'none' && (
                    <div className="hearing-card-comment-count">
                      <Icon name="comment-o" aria-hidden="true" /> <span aria-hidden="true">{section.n_comments}</span>
                      <span className="sr-only">
                        <FormattedPlural
                          value={section.n_comments}
                          one={<FormattedMessage id="sectionTotalComment" values={{ n: section.n_comments }} />}
                          other={<FormattedMessage id="sectionTotalComments" values={{ n: section.n_comments }} />}
                        />
                      </span>
                    </div>
                  )}
                </Link>
                <div className="section-card-content">
                  <div className="section-card-title-wrapper">
                    <div className="section-card-title-prefix">
                      <FormattedMessage id="sectionCardSubsectionTitle" /> {index + 1}/{subSections.length}
                    </div>
                    <h3 className="section-card-title">
                      <Link to={{ path: getSectionURL(hearing.slug, section) }} className="">
                        {section.type === 'main' ? getAttr(hearing.title, language) : getAttr(section.title, language)}
                      </Link>
                    </h3>
                  </div>
                  <div className="section-card-buttons">
                    <Link to={{ path: getSectionURL(hearing.slug, section) }} className="btn btn-sm btn-primary">
                      <FormattedMessage id="showSubsectionBtn" />
                    </Link>
                    {!hearing.closed && isCommentable(section) && userCanComment(user, section) && (
                      <Link
                        to={{ path: getSectionURL(hearing.slug, section), hash: "#comments-section" }}
                        className="btn btn-sm btn-default"
                      >
                        <FormattedMessage id="commentSubsectionBtn" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

SubsectionList.propTypes = {
  hearing: PropTypes.object,
  language: PropTypes.string,
  user: PropTypes.object,
};

export default SubsectionList;
