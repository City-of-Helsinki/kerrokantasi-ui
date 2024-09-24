/* eslint-disable react/forbid-prop-types */
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, DateInput } from 'hds-react';
import { isEmpty } from 'lodash';

import getAttr from '../../utils/getAttr';
import i18n from '../../i18n';
import { getClosureSection } from '../../utils/hearing';
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
    // eslint-disable-next-line react/no-unused-class-component-methods
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
    const stringToDate = moment(datetime, 'DD.M.YYYY').toDate();

    if (stringToDate.toISOString instanceof Function) {
      this.props.onHearingChange('open_at', stringToDate.toISOString());
    } else if (moment(stringToDate, DATE_FORMAT, true).isValid()) {
      const manualDate = moment(stringToDate, DATE_FORMAT);
      this.props.onHearingChange('open_at', moment(manualDate, 'llll').toISOString());
    }
  }

  onChangeEnd(datetime) {
    const stringToDate = moment(datetime, 'DD.M.YYYY').toDate();

    if (stringToDate.toISOString instanceof Function) {
      const dt = convertStartOfToEndOfDay(stringToDate);
      this.props.onHearingChange('close_at', dt.toISOString());
    } else if (moment(stringToDate, DATE_FORMAT, true).isValid()) {
      const manualDate = convertStartOfToEndOfDay(moment(stringToDate, DATE_FORMAT));
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
        <div className='hearing-form-row'>
          <div id='hearingOpeningTime' className='hearing-form-column'>
            <DateInput
              label={<FormattedMessage id='hearingOpeningTime' />}
              name='open_at'
              id='open_at'
              required
              placeholder={formatMessage({ id: 'hearingClosingTimePlaceholder' })}
              initialMonth={new Date()}
              language='fi'
              onChange={this.onChangeStart}
              value={this.formatDateTime(hearing.open_at)}
              errorText={errors.open_at}
              invalid={!!errors.open_at}
            />
          </div>
          <div id='hearingClosingTime' className='hearing-form-column'>
            <DateInput
              label={<FormattedMessage id='hearingClosingTime' />}
              name='close_at'
              id='close_at'
              required
              placeholder={formatMessage({ id: 'hearingClosingTimePlaceholder' })}
              initialMonth={new Date()}
              language='fi'
              onChange={this.onChangeEnd}
              value={this.formatDateTime(hearing.close_at)}
              errorText={errors.close_at}
              invalid={!!errors.close_at}
            />
          </div>
        </div>
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
          <Button className='kerrokantasi-btn' onClick={this.props.onContinue}>
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
