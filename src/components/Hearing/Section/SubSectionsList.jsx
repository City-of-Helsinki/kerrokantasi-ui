/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { FormattedMessage, FormattedPlural } from 'react-intl';
import { Button } from 'hds-react';
import defaultImage from '@city-images/default-image.svg';
import { useParams } from 'react-router-dom';

import getAttr from '../../../utils/getAttr';
import Icon from '../../../utils/Icon';
import Link from '../../LinkWithLang';
import MouseOnlyLink from '../../MouseOnlyLink';
import { getSectionURL, hasAnyQuestions } from '../../../utils/section';

const SubsectionList = ({ hearing, language, history }) => {
  const { hearingSlug } = useParams();
  const sectionsWithoutClosure = hearing.sections.filter((section) => section.type !== 'closure-info');
  const subSections = sectionsWithoutClosure.filter((section) => section.type !== 'main');

  const bgImage = (section) =>
    !isEmpty(section.images) ? `url("${section.images[0].url}")` : `url("${defaultImage}")`;

  if (!subSections.length) {
    return null;
  }

  return (
    <section className='hearing-section subsections-list'>
      <h2>
        <FormattedMessage id='hearingSubsectionsTitle' /> ({subSections.length})
      </h2>
      <div className='section-content-spacer'>
        <ul className='subsection-grid'>
          {subSections.map((section, index) => (
            <li key={section.id} className='subsection-grid-item'>
              <div className='section-card'>
                <MouseOnlyLink
                  className='section-card-image'
                  style={{ backgroundImage: bgImage(section) }}
                  history={history}
                  url={getSectionURL(hearingSlug, section)}
                  altText={
                    section.type === 'main' ? getAttr(hearing.title, language) : getAttr(section.title, language)
                  }
                />
                <div className='section-card-content'>
                  <div className='section-card-title-wrapper'>
                    <div className='section-card-title-prefix'>
                      <FormattedMessage id='sectionCardSubsectionTitle' /> {index + 1}/{subSections.length}
                    </div>
                    <Link to={{ path: getSectionURL(hearingSlug, section) }} className='section-card-title'>
                      <h3 id={`subsection-title-${section.id}`}>
                        {section.type === 'main' ? getAttr(hearing.title, language) : getAttr(section.title, language)}
                      </h3>
                    </Link>
                  </div>
                  {section.commenting !== 'none' && (
                    <div className='hearing-card-comment-count'>
                      <Icon name='comment-o' aria-hidden='true' /> <span aria-hidden='true'>{section.n_comments}</span>
                      <span className='sr-only'>
                        <FormattedPlural
                          value={section.n_comments}
                          one={<FormattedMessage id='sectionTotalComment' values={{ n: section.n_comments }} />}
                          other={<FormattedMessage id='sectionTotalComments' values={{ n: section.n_comments }} />}
                        />
                      </span>
                    </div>
                  )}
                  <div className='section-card-buttons'>
                    <Link to={{ path: getSectionURL(hearingSlug, section) }}>
                      <Button size='small' className='kerrokantasi-btn black'>
                        <FormattedMessage id='showSubsectionBtn' />
                      </Button>
                    </Link>
                    {!hearing.closed && (
                      <Link to={{ path: getSectionURL(hearing.slug, section), hash: '#comments-section' }}>
                        <Button size='small' className='kerrokantasi-btn'>
                          <FormattedMessage
                            id={hasAnyQuestions(section) ? 'commentAndVoteSubsectionBtn' : 'commentSubsectionBtn'}
                          />
                        </Button>
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
  history: PropTypes.object,
};

export default SubsectionList;
