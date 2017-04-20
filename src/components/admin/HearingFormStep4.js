import moment from 'moment';
import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';

import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Row from 'react-bootstrap/lib/Row';

import DateTime from 'react-datetime/DateTime';

import {getClosureSection} from '../../utils/hearing';
import {initNewSection, SectionTypes} from '../../utils/section';
import MultiLanguageTextField, {TextFieldTypes} from '../forms/MultiLanguageTextField';
import {hearingShape} from '../../types';


class HearingFormStep4 extends React.Component {


  constructor(props) {
    super(props);
    this.date_format = "llll";
    this.time_format = "";
    this.onChangeStart = this.onChangeStart.bind(this);
    this.onChangeEnd = this.onChangeEnd.bind(this);
    this.onChange = this.onChange.bind(this);
    moment.locale("fi-FI");
  }

  onChange(event) {
    if (this.props.onHearingChange) {
      // Propagate interestin changes to parent components
      const {name: field, value} = event.target;
      switch (field) {
        case "closureInfo": {
          const closureInfoSection = getClosureSection(this.props.hearing) || {};
          this.props.onSectionChange(closureInfoSection.id, "content", value);
          break;
        }
        default:
          this.props.onHearingChange(field, value);
      }
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
    const {hearing, hearingLanguages, onSectionChange} = this.props;
    const closureInfoSection = getClosureSection(hearing) || initNewSection({type: SectionTypes.CLOSURE});

    return (
      <div className="form-step">
        <Row>
          <Col md={3}>
            <FormGroup controlId="hearingOpeningTime">
              <ControlLabel><FormattedMessage id="hearingOpeningTime"/></ControlLabel>
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
              <ControlLabel><FormattedMessage id="hearingClosingTime"/></ControlLabel>
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
          labelId="hearingClosureInfo"
          name="closureInfo"
          onBlur={(value) => onSectionChange(closureInfoSection.id, 'content', value)}
          rows="10"
          value={closureInfoSection.content}
          fieldType={TextFieldTypes.TEXTAREA}
          languages={hearingLanguages}
        />

      </div>
    );
  }
}

HearingFormStep4.defaultProps = {
  onChange: () => {}
};

HearingFormStep4.propTypes = {
  hearing: hearingShape,
  onHearingChange: React.PropTypes.func,
  onSectionChange: React.PropTypes.func,
  hearingLanguages: React.PropTypes.arrayOf(React.PropTypes.string),
};

const WrappedHearingFormStep4 = injectIntl(HearingFormStep4);

export default WrappedHearingFormStep4;
