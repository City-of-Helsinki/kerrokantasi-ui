import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
import i18n from '../../i18n';
import getAttr from '../../utils/getAttr';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Row from 'react-bootstrap/lib/Row';
import {isEmpty} from 'lodash';

import DateTime from 'react-datetime/DateTime';

import {getClosureSection} from '../../utils/hearing';
import {initNewSection, SectionTypes} from '../../utils/section';
import MultiLanguageTextField, {TextFieldTypes} from '../forms/MultiLanguageTextField';
import {hearingShape} from '../../types';
import {addSection} from '../../actions/hearingEditor';


class HearingFormStep4 extends React.Component {
  constructor(props) {
    super(props);
    this.date_format = "llll";
    this.time_format = "";
    this.onChangeStart = this.onChangeStart.bind(this);
    this.onChangeEnd = this.onChangeEnd.bind(this);
    this.onClosureSectionChange = this.onClosureSectionChange.bind(this);
    moment.locale("fi-FI");
  }

  onClosureSectionChange(value) {
    const {hearing, onSectionChange, dispatch} = this.props;
    const closureInfoSection = getClosureSection(hearing);

    if (closureInfoSection) {
      onSectionChange(closureInfoSection.id, 'content', value);
    } else {
      dispatch(addSection(initNewSection({type: SectionTypes.CLOSURE, content: value})));
    }
  }

  onChangeStart(datetime) {
    this.props.onHearingChange("open_at", datetime.toISOString());
  }

  onChangeEnd(datetime) {
    this.props.onHearingChange("close_at", datetime.toISOString());
  }

  formatDateTime(datetime) {
    const dt = moment(datetime);
    if (dt.isValid()) {
      return dt.format(this.date_format);
    }
    return null;
  }

  render() {
    const {hearing, hearingLanguages} = this.props;
    const closureInfoContent = getClosureSection(hearing) && !isEmpty(getAttr(getClosureSection(hearing).content)) ? getClosureSection(hearing).content : {fi: i18n.fi.defaultClosureInfo, sv: i18n.sv.defaultClosureInfo, en: i18n.en.defaultClosureInfo};

    return (
      <div className="form-step">
        <Row>
          <Col md={3}>
            <FormGroup controlId="hearingOpeningTime">
              <ControlLabel><FormattedMessage id="hearingOpeningTime"/>*</ControlLabel>
              <DateTime
                name="open_at"
                dateFormat={this.date_format}
                timeFormat={this.time_format}
                value={this.formatDateTime(hearing.open_at)}
                onChange={this.onChangeStart}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup controlId="hearingClosingTime">
              <ControlLabel><FormattedMessage id="hearingClosingTime"/>*</ControlLabel>
              <DateTime
                name="close_at"
                dateFormat={this.date_format}
                timeFormat={this.time_format}
                value={this.formatDateTime(hearing.close_at)}
                onChange={this.onChangeEnd}
              />
            </FormGroup>
          </Col>
        </Row>

        <MultiLanguageTextField
          richTextEditor
          labelId="hearingClosureInfo"
          name="closureInfo"
          onBlur={this.onClosureSectionChange}
          rows="10"
          value={closureInfoContent}
          fieldType={TextFieldTypes.TEXTAREA}
          languages={hearingLanguages}
        />

      </div>
    );
  }
}

HearingFormStep4.propTypes = {
  dispatch: PropTypes.func,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  onHearingChange: PropTypes.func,
  onSectionChange: PropTypes.func,
};

const WrappedHearingFormStep4 = connect()(injectIntl(HearingFormStep4));

export default WrappedHearingFormStep4;
