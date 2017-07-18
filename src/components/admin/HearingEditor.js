import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {isEmpty} from 'lodash';

import {
  changeHearing,
  changeHearingEditorLanguages,
  changeSection,
  changeSectionMainImage,
  closeHearing,
  closeHearingForm,
  publishHearing,
  saveHearingChanges,
  saveAndPreviewHearingChanges,
  saveAndPreviewNewHearing,
  startHearingEdit,
  unPublishHearing,
} from '../../actions/hearingEditor';
import HearingForm from '../../components/admin/HearingForm';
import HearingToolbar from '../../components/admin/HearingToolbar';
import {contactShape, hearingShape, labelShape, userShape} from '../../types';
import * as EditorSelector from '../../selectors/hearingEditor';


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
      dispatch(saveAndPreviewNewHearing(hearing));
    } else {
      dispatch(saveAndPreviewHearingChanges(hearing));
    }
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
    const {contactPersons, hearing, hearingLanguages, labels, dispatch, show} = this.props;

    if (isEmpty(hearing)) {
      return null;
    }
    return (
      <HearingForm
        contactPersons={contactPersons}
        currentStep={1}
        hearing={hearing}
        hearingLanguages={hearingLanguages}
        labels={labels}
        onHearingChange={this.onHearingChange}
        onLeaveForm={() => dispatch(closeHearingForm())}
        onSaveAndPreview={this.onSaveAndPreview}
        onSaveChanges={this.onSaveChanges}
        onSectionChange={this.onSectionChange}
        onSectionImageChange={this.onSectionImageChange}
        onLanguagesChange={this.onLanguagesChange}
        show={show}
        dispatch={this.props.dispatch}
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

HearingEditor.propTypes = {
  contactPersons: PropTypes.arrayOf(contactShape),
  dispatch: PropTypes.func,
  show: PropTypes.bool,
  isLoading: PropTypes.bool,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.arrayOf(labelShape),
  user: userShape
};

const WrappedHearingEditor = connect((state) => ({
  show: EditorSelector.getShowForm(state),
}))(injectIntl(HearingEditor));

export default WrappedHearingEditor;
