import Helmet from 'react-helmet';
import React from 'react';
// import {cloneDeep} from 'lodash';
import {connect} from 'react-redux';
import {injectIntl, intlShape} from 'react-intl';

import {fetchHearing, login} from '../../actions';
import {getOpenGraphMetaData} from '../../utils/hearing';
import {initNewHearing, fetchHearingEditorMetaData} from '../../actions/hearingEditor';
import {Hearing, wrapHearingComponent} from '../../components/Hearing';
import HearingEditor from '../../components/admin/HearingEditor';
import {HearingView} from '../Hearing/index';
import {hearingShape} from '../../types';
import getAttr from '../../utils/getAttr';
import * as HearingEditorSelector from '../../selectors/hearingEditor';
import PleaseLogin from '../../components/admin/PleaseLogin';

const HearingPreview = wrapHearingComponent(Hearing, false);


class HearingManagementView extends HearingView {

  isNewHearing() {
    return !this.props.params.hearingSlug;
  }

  componentDidMount() {
    this.props.dispatch(fetchHearingEditorMetaData());
    // Hearing will be fetched from the API in the super implementation.
    // We don't want to do that when we are creating a new hearing.
    if (this.isNewHearing()) {
      this.props.dispatch(initNewHearing());
    }
  }

  componentWillReceiveProps(nextProps) {
    const {user, dispatch, params: {hearingSlug}} = this.props;
    // Fetch hearing only when user data is available
    const shouldFetchHearing = !this.isNewHearing() && !user && nextProps.user;

    if (shouldFetchHearing) {
      dispatch(fetchHearing(hearingSlug));
    }
  }

  getHearing() {
    if (this.isNewHearing()) {
      return null;
    }
    const {hearingSlug} = this.props.params;
    const {state, data: hearing} = (this.props.hearing[hearingSlug] || {state: 'initial'});
    if (state === 'done') {
      return hearing;
    }
    return null;
  }

  render() {
    const hearing = this.getHearing();
    const {language, dispatch, currentlyViewed, isLoading, hearingDraft, user} = this.props;

    if (!user) {
      return (
        <div className="container">
          <PleaseLogin login={() => dispatch(login())}/>
        </div>
      );
    }

    const PreviewReplacement = () =>
      (this.isNewHearing() ? null : <this.renderSpinner/>);

    return (
      <div className="container">
        <Helmet title={getAttr(hearingDraft.title, language)} meta={getOpenGraphMetaData(hearingDraft, language)}/>

        <HearingEditor
          hearing={hearingDraft}
          user={user}
        />

        { (isLoading && !hearingDraft) || (hearing && Object.keys(hearing).length && hearing.title) ?
          <HearingPreview
            hearingSlug={hearing.slug}
            hearing={hearing}
            sectionComments={this.props.sectionComments}
            location={this.props.location}
            dispatch={dispatch}
            changeCurrentlyViewed={this.changeCurrentlyViewed}
            currentlyViewed={currentlyViewed}
          />
          : <PreviewReplacement/>
        }
      </div>
    );
  }
}

HearingManagementView.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearing: hearingShape,
  hearingDraft: hearingShape,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  sectionComments: React.PropTypes.object,
  language: React.PropTypes.string,
  hearingLanguages: React.PropTypes.arrayOf(React.PropTypes.string)
};


const wrappedView = connect((state) => ({
  user: state.user,
  hearing: state.hearing,
  hearingDraft: HearingEditorSelector.getHearing(state),
  hearingLanguages: state.hearingEditor.languages,
  isLoading: HearingEditorSelector.getIsLoading(state),
  sectionComments: state.sectionComments,
  language: state.language,
}))(injectIntl(HearingManagementView));

export default wrappedView;
