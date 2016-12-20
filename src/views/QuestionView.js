import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import LoadSpinner from '../components/LoadSpinner';
import SectionContainer from '../components/SectionContainer';
import {injectIntl} from 'react-intl';
import {fetchHearing, fetchSectionComments} from '../actions';
import {getOpenGraphMetaData} from '../utils/hearing';
import getAttr from '../utils/getAttr';
// import {groupSections, isSpecialSectionType} from '../utils/section';

class QuestionView extends Component {

  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the HearingView view into the dispatch's associated store.
   *
   * @param dispatch Redux Dispatch function
   * @param getState Redux state getter
   * @param location Router location
   * @param params Router params
   * @return {Promise} Data fetching promise
   */
  static fetchData(dispatch, getState, location, params) {
    return Promise.all([
      dispatch(fetchHearing(params.hearingSlug, location.query.preview)),
      dispatch(fetchSectionComments(params.hearingSlug, params.sectionId))
    ]);
  }

  /**
   * Return truthy if the view can be rendered fully with the data currently
   * acquirable by `getState()`.
   *
   * @param getState State getter
   * @param location Router location
   * @param params Router params
   * @return {boolean} Renderable?
   */
  static canRenderFully(getState) {
    const {state, data} = (getState().hearing || {state: 'initial'});
    return (state === 'done' && data);
  }

  componentDidMount() {
    const {dispatch, location, params} = this.props;
    QuestionView.fetchData(dispatch, null, location, params);
  }

  render() {
    const {params: {hearingSlug, sectionId}, user, location, sectionComments, language} = this.props;
    const {data: hearing} = this.props.hearing || {state: 'initial'};

    if (!QuestionView.canRenderFully(() => this.props)) {
      return (
        <div className="hearing-view container">
          <LoadSpinner />
        </div>
      );
    }

    return (
      <div className="hearing-view container">
        <Helmet title={hearing.title} meta={getOpenGraphMetaData(getAttr(hearing.title, language), this.props.location.pathname)}/>
        <SectionContainer
          hearingSlug={hearingSlug}
          sectionId={sectionId}
          hearing={hearing}
          user={user}
          section={hearing.sections.find((section) => section.id === sectionId)}
          sectionComments={sectionComments}
          location={location}
        />
      </div>
    );
  }
}

/* eslint react/forbid-prop-types: "off" */
QuestionView.propTypes = {
  dispatch: PropTypes.func,
  hearing: PropTypes.object,
  language: PropTypes.string,
  location: PropTypes.object,
  params: PropTypes.object,
  sectionComments: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = (state, props) => {
  const {hearingSlug, sectionId} = props.params;
  return ({
    hearing: state.hearing[hearingSlug],
    language: state.language,
    sectionComments: state.sectionComments[sectionId],
  });
};

export function wrapQuestionView(view) {
  const wrappedView = connect(mapStateToProps)(injectIntl(view));
  wrappedView.canRenderFully = view.canRenderFully;
  wrappedView.fetchData = view.fetchData;
  return wrappedView;
}

export default wrapQuestionView(QuestionView);
