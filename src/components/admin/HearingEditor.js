import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {isEmpty} from 'lodash';
import {push} from 'redux-router';

import {
  changeHearing,
  changeHearingEditorLanguages,
  changeSection,
  changeSectionMainImage,
  closeHearing,
  closeHearingForm,
  fetchHearingEditorMetaData,
  publishHearing,
  saveHearingChanges,
  saveNewHearing,
  startHearingEdit,
  unPublishHearing,
} from '../../actions/hearingEditor';
import HearingForm from '../../components/admin/HearingForm';
import HearingToolbar from '../../components/admin/HearingToolbar';
import {getHearingEditorURL} from '../../utils/hearing';
import {hearingShape, userShape} from '../../types';


class HearingEditor extends React.Component {

  constructor(props) {
    super(props);
    this.onCloseHearing = this.onCloseHearing.bind(this);
    this.onHearingChange = this.onHearingChange.bind(this);
    this.onLanguagesChange = this.onLanguagesChange.bind(this);
    this.onPublish = this.onPublish.bind(this);
    this.onSaveAndPreview = this.onSaveAndPreview.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.onSectionChange = this.onSectionChange.bind(this);
    this.onSectionImageChange = this.onSectionImageChange.bind(this);
    this.onUnPublish = this.onUnPublish.bind(this);
  }

  /**
  * Return a promise that will, as it fulfills, have added data
  * required by the form into the dispatch's associated store.
  *
  * @param dispatch Redux Dispatch function
  * @return {Promise} Data fetching promise
  */
  static fetchRequiredData(dispatch) {
    return Promise.all([
      dispatch(fetchHearingEditorMetaData())
    ]);
  }

  componentDidMount() {
    HearingEditor.fetchRequiredData(this.props.dispatch);
  }

  onHearingChange(field, value) {
    this.props.dispatch(changeHearing(field, value));
  }

  onSectionChange(sectionID, field, value) {
    this.props.dispatch(changeSection(sectionID, field, value));
  }

  onSectionImageChange(sectionID, field, value) {
    this.props.dispatch(changeSectionMainImage(sectionID, field, value));
  }

  onLanguagesChange(newLanguages) {
    this.props.dispatch(changeHearingEditorLanguages(newLanguages));
  }

  onPublish() {
    this.props.dispatch(publishHearing(this.props.hearing));
  }

  onSaveAndPreview() {
    const {dispatch, hearing} = this.props;
    if (hearing.isNew) {
      dispatch(saveNewHearing(hearing));
    } else {
      dispatch(saveHearingChanges(hearing));
    }
    dispatch(push(getHearingEditorURL(hearing)));
  }

  onSaveChanges() {
    this.props.dispatch(saveHearingChanges(this.props.hearing));
  }

  onUnPublish() {
    this.props.dispatch(unPublishHearing(this.props.hearing));
  }

  onCloseHearing() {
    this.props.dispatch(closeHearing(this.props.hearing));
  }

  getHearingForm() {
    if (isEmpty(this.props.hearing)) {
      return null;
    }
    return (
      <HearingForm
        currentStep={1}
        hearing={this.props.hearing}
        onHearingChange={this.onHearingChange}
        onLeaveForm={() => this.props.dispatch(closeHearingForm())}
        onSaveAndPreview={this.onSaveAndPreview}
        onSaveChanges={this.onSaveChanges}
        onSectionChange={this.onSectionChange}
        onSectionImageChange={this.onSectionImageChange}
        onLanguagesChange={this.onLanguagesChange}
        show={this.props.editorState === "editForm"}
      />
    );
  }

  render() {
    const {hearing} = this.props;
    return (
      <div className="hearing-editor">
        {this.getHearingForm()}

        <HearingToolbar
          hearing={hearing}
          onCloseHearing={this.onCloseHearing}
          onEdit={() => this.props.dispatch(startHearingEdit())}
          onPublish={this.onPublish}
          onRevertPublishing={this.onUnPublish}
          user={this.props.user}
        />
      </div>
    );
  }
}

HearingEditor.defaultProps = {
  editorState: "editForm",
  hearing: {},
};

HearingEditor.propTypes = {
  dispatch: React.PropTypes.func,
  editorState: React.PropTypes.string,
  hearing: hearingShape,
  user: userShape
};

const WrappedHearingEditor = connect((state) => ({
  editorState: state.hearingEditor.editorState,
  hearing: state.hearingEditor.hearing,
  user: state.user
}))(injectIntl(HearingEditor));

export default WrappedHearingEditor;
