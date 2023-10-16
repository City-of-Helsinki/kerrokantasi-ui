/* eslint-disable react/forbid-prop-types */
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Col from 'react-bootstrap/lib/Col';
import { Button } from 'hds-react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Row from 'react-bootstrap/lib/Row';
import { isEmpty } from 'lodash';
import DateTime from 'react-datetime/DateTime';

import getAttr from '../../utils/getAttr';
import i18n from '../../i18n';
import { getClosureSection } from '../../utils/hearing';
import { getValidationState } from '../../utils/hearingEditor';
import { initNewSection, SectionTypes } from '../../utils/section';
import MultiLanguageTextField, { TextFieldTypes } from '../forms/MultiLanguageTextField';
import { hearingShape } from '../../types';
import { addSection } from '../../actions/hearingEditor';

const convertStartOfToEndOfDay = function convertToEndOfDay(datetime) {
  const dt = moment(datetime);
  if (dt.isValid() && dt.isSame(dt.clone().startOf('day'))) {
    return dt.endOf('day');
  }
  return datetime;
};

const DATE_FORMAT = 'DD-MM-YYYY';

class HearingFormStep4 extends React.Component {
  constructor(props) {
    super(props);
    this.date_format = 'llll';
    this.time_format = '';
    this.onChangeStart = this.onChangeStart.bind(this);
    this.onChangeEnd = this.onChangeEnd.bind(this);
    this.onClosureSectionChange = this.onClosureSectionChange.bind(this);
    moment.locale('fi-FI');
  }

  onClosureSectionChange(value) {
    const { hearing, onSectionChange, dispatch } = this.props;
    const closureInfoSection = getClosureSection(hearing);
    if (closureInfoSection) {
      onSectionChange(closureInfoSection.frontId, 'content', value);
    } else {
      dispatch(addSection(initNewSection({ type: SectionTypes.CLOSURE, content: value })));
    }
  }

  onChangeStart(datetime) {
    if (datetime.toISOString instanceof Function) {
      this.props.onHearingChange('open_at', datetime.toISOString());
    } else if (moment(datetime, DATE_FORMAT, true).isValid()) {
      const manualDate = moment(datetime, DATE_FORMAT);
      this.props.onHearingChange('open_at', moment(manualDate, 'llll').toISOString());
    }
  }

  onChangeEnd(datetime) {
    if (datetime.toISOString instanceof Function) {
      const dt = convertStartOfToEndOfDay(datetime);
      this.props.onHearingChange('close_at', dt.toISOString());
    } else if (moment(datetime, DATE_FORMAT, true).isValid()) {
      const manualDate = convertStartOfToEndOfDay(moment(datetime, DATE_FORMAT));
      this.props.onHearingChange('close_at', moment(manualDate, 'llll').toISOString());
    }
  }

  formatDateTime(datetime) {
    const dt = moment(datetime);
    if (dt.isValid()) {
      return dt.format(this.date_format);
    }
    return null;
  }

  render() {
    const { hearing, hearingLanguages, formatMessage, errors } = this.props;
    const closureInfoContent =
      getClosureSection(hearing) && !isEmpty(getAttr(getClosureSection(hearing).content))
        ? getClosureSection(hearing).content
        : { fi: i18n.fi.defaultClosureInfo, sv: i18n.sv.defaultClosureInfo, en: i18n.en.defaultClosureInfo };

    return (
      <div className='form-step'>
        <Row>
          <Col md={3}>
            <FormGroup controlId='hearingOpeningTime' validationState={getValidationState(errors, 'open_at')}>
              <ControlLabel>
                <FormattedMessage id='hearingOpeningTime' />*
              </ControlLabel>
              <DateTime
                name='open_at'
                dateFormat={this.date_format}
                timeFormat={this.time_format}
                value={this.formatDateTime(hearing.open_at)}
                onChange={this.onChangeStart}
                inputProps={{ placeholder: formatMessage({ id: 'hearingClosingTimePlaceholder' }) }}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup controlId='hearingClosingTime' validationState={getValidationState(errors, 'close_at')}>
              <ControlLabel>
                <FormattedMessage id='hearingClosingTime' />*
              </ControlLabel>
              <DateTime
                name='close_at'
                dateFormat={this.date_format}
                timeFormat={this.time_format}
                value={this.formatDateTime(hearing.close_at)}
                onChange={this.onChangeEnd}
                inputProps={{ placeholder: formatMessage({ id: 'hearingClosingTimePlaceholder' }) }}
              />
            </FormGroup>
          </Col>
        </Row>

        <MultiLanguageTextField
          richTextEditor
          labelId='hearingClosureInfo'
          name='closureInfo'
          onBlur={this.onClosureSectionChange}
          rows='10'
          value={closureInfoContent}
          fieldType={TextFieldTypes.TEXTAREA}
          languages={hearingLanguages}
        />
        <div className='step-footer'>
          <Button variant='primary' onClick={this.props.onContinue}>
            <FormattedMessage id='hearingFormNext' />
          </Button>
        </div>
      </div>
    );
  }
}

HearingFormStep4.propTypes = {
  dispatch: PropTypes.func,
  errors: PropTypes.object,
  hearing: hearingShape,
  onContinue: PropTypes.func,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  onHearingChange: PropTypes.func,
  onSectionChange: PropTypes.func,
  formatMessage: PropTypes.func,
};

const WrappedHearingFormStep4 = connect()(injectIntl(HearingFormStep4));

export default WrappedHearingFormStep4;
