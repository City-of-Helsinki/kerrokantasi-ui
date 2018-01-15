import React from 'react';
import {connect} from 'react-redux';
import {Switch, Route, Redirect} from 'react-router-dom';
import Section from '../../components/Hearing/Section/SectionContainer';
import Header from '../../components/Hearing/Header';
import WrappedCarousel from '../../components/Carousel';
import {getHearingWithSlug} from '../../selectors/hearing';
import PropTypes from 'prop-types';
import {fetchHearing as fetchHearingAction} from '../../actions';
import LoadSpinner from '../../components/LoadSpinner';
import isEmpty from 'lodash/isEmpty';
import { injectIntl, intlShape } from 'react-intl';
import {SectionTypes} from '../../utils/section';

export class HearingContainer extends React.Component {
  componentWillMount() {
    const {fetchHearing, match: {params}} = this.props;
    fetchHearing(params.hearingSlug);
  }

  render() {
    const {hearing, intl, language, match} = this.props;
    const mainSectionId = !isEmpty(hearing) ? hearing.sections.find(section => section.type === SectionTypes.MAIN).id : null;

    return (
      <div className="hearing-page">
        {!isEmpty(hearing) ?
          <div className="hearing-wrapper" id="hearing-wrapper">
            <Header hearing={hearing} activeLanguage={language} intl={intl}/>
            <WrappedCarousel hearing={hearing} intl={intl} language={language}/>
            <Switch>
              <Route path="/:hearingSlug/:sectionId" component={Section} />
              <Redirect from="/:hearingSlug" to={`/${match.params.hearingSlug}/${mainSectionId}`} />
            </Switch>
          </div>
        : <LoadSpinner />
      }
      </div>

    );
  }
}

HearingContainer.propTypes = {
  hearing: PropTypes.object,
  intl: intlShape.isRequired,
  language: PropTypes.string,
  match: PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
  hearing: getHearingWithSlug(state, ownProps.match.params.hearingSlug),
  language: state.language
});

const mapDispatchToProps = dispatch => ({
  fetchHearing: (hearingSlug, preview = false) => dispatch(fetchHearingAction(hearingSlug, preview))
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(HearingContainer));
