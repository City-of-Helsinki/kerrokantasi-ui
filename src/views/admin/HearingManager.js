import Helmet from 'react-helmet';
import React from 'react';
// import {cloneDeep} from 'lodash';
import {connect} from 'react-redux';
import {injectIntl, intlShape} from 'react-intl';

import {beginCreateHearing, beginEditHearing} from '../../actions/hearingEditor';
import {Hearing, wrapHearingComponent} from '../../components/Hearing';
import HearingEditor from '../../components/admin/HearingEditor';
import {HearingView} from '../Hearing/index';
import {hearingShape} from '../../types';


const HearingPreview = wrapHearingComponent(Hearing, false);


class HearingManagementView extends HearingView {

  isNewHearing() {
    return !this.props.params.hearingSlug;
  }

  componentDidMount() {
    // Hearing will be fetched from the API in the super implementation.
    // We don't want to do that when we are creating a new hearing.
    if (this.isNewHearing()) {
      this.props.dispatch(beginCreateHearing());
    } else {
      super.componentDidMount();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.isNewHearing()) {
      // The parent class HearingView fetces the hearing (Promise) from the api
      // and it gets passed to this view via props.
      // Instead of editing the hearing stored in the Redux store we make
      // a deep clone from it and store the cloned hearing into local state of this view.
      // That cloned hearing can then be freely managed as needed.
      const {hearingSlug} = this.props.params;
      const {state, data: hearing} = nextProps.hearing[hearingSlug] || {state: "initial"};

      const draft = this.props.hearingDraft;
      if (state === 'done' && (!draft || (draft.id !== hearing.id))) {
        // Make a deep local clone out of the passed hearing
        // this.setState({hearing: cloneDeep(hearing)});
        // Hearing is loaded and we are ready to beging editing the hearing
        this.props.dispatch(beginEditHearing(hearing));
      }
    }
  }

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
    if (!hearing) {
      return this.renderSpinner();
    }

    return (
      <div className="container">
        <Helmet title={hearing.title} meta={this.getOpenGraphMetaData(hearing)}/>

        <HearingEditor hearingID={hearing.id}/>

        <HearingPreview
          hearingSlug={hearing.slug}
          hearing={hearing}
          sectionComments={this.props.sectionComments}
          location={this.props.location}
        />
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
};


const wrappedView = connect((state) => ({
  user: state.user,
  hearing: state.hearing,
  hearingDraft: state.hearingEditor.hearing,
  sectionComments: state.sectionComments,
}))(injectIntl(HearingManagementView));

export default wrappedView;
