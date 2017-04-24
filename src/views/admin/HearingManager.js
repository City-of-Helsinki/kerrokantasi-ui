import Helmet from 'react-helmet';
import React from 'react';
// import {cloneDeep} from 'lodash';
import {connect} from 'react-redux';
import {injectIntl, intlShape} from 'react-intl';

import {fetchHearing} from '../../actions/index';
import {initNewHearing, fetchHearingEditorMetaData} from '../../actions/hearingEditor';
import {Hearing, wrapHearingComponent} from '../../components/Hearing';
import HearingEditor from '../../components/admin/HearingEditor';
import {HearingView} from '../Hearing/index';
import {hearingShape} from '../../types';
import getAttr from '../../utils/getAttr';
import * as HearingEditorSelector from '../../selectors/hearingEditor';


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
    } else {
      this.props.dispatch(fetchHearing(this.props.params.hearingSlug));
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (!this.isNewHearing()) {
  //     // The parent class HearingView fetces the hearing (Promise) from the api
  //     // and it gets passed to this view via props.
  //     // Instead of editing the hearing stored in the Redux store we make
  //     // a deep clone from it and store the cloned hearing into local state of this view.
  //     // That cloned hearing can then be freely managed as needed.
  //     const {hearingSlug} = this.props.params;
  //     const {state, data: hearing} = nextProps.hearing[hearingSlug] || {state: "initial"};
  //
  //     const draft = this.props.hearingDraft;
  //     if (state === 'done' && (!draft || (draft.id !== hearing.id))) {
  //       // Make a deep local clone out of the passed hearing
  //       // this.setState({hearing: cloneDeep(hearing)});
  //       // Hearing is loaded and we are ready to beging editing the hearing
  //       this.props.dispatch(beginEditHearing(hearing));
  //     }
  //   }
  // }

  getHearing() {
    if (this.isNewHearing()) {
      return this.props.hearingDraft;
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
    if (isLoading || !hearing) {
      return this.renderSpinner();
    }

    return (
      <div className="container">
        <Helmet title={getAttr(hearing.title, language)} meta={this.getOpenGraphMetaData(hearing)}/>

        <HearingEditor
          hearing={hearingDraft}
          user={user}
        />

        { Object.keys(hearing).length && hearing.title ?
          <HearingPreview
            hearingSlug={hearing.slug}
            hearing={hearing}
            sectionComments={this.props.sectionComments}
            location={this.props.location}
            dispatch={dispatch}
            changeCurrentlyViewed={this.changeCurrentlyViewed}
            currentlyViewed={currentlyViewed}
          />
          : <this.renderSpinner/>
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
