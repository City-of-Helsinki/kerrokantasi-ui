import moment from 'moment';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, DateInput, TimeInput } from 'hds-react';
import { isEmpty } from 'lodash';

import getAttr from '../../utils/getAttr';
import i18n from '../../i18n';
import { getClosureSection } from '../../utils/hearing';
import { initNewSection, SectionTypes } from '../../utils/section';
import MultiLanguageTextField, { TextFieldTypes } from '../forms/MultiLanguageTextField';
import { hearingShape } from '../../types';
import { addSection } from '../../actions/hearingEditor';

const DATE_FORMAT = 'DD.M.YYYY';
const TIME_FORMAT = 'HH:mm';

const getDate = (value) => {
  const date = moment(value);

  if (date.isValid()) {
    return date.format(DATE_FORMAT);
  }

  return null;
};

const getTime = (value) => {
  const date = moment(value);

  if (date.isValid()) {
    return date.format(TIME_FORMAT);
  }

  return null;
};

const HearingFormStep4 = ({
  hearing,
  hearingLanguages,
  formatMessage,
  errors,
  onSectionChange,
  onHearingChange,
  onContinue,
}) => {
  moment.locale('fi-FI');

  const [openDate, setOpenDate] = useState(getDate(hearing.open_at));
  const [openTime, setOpenTime] = useState(getTime(hearing.open_at));

  const [closeDate, setCloseDate] = useState(getDate(hearing.close_at));
  const [closeTime, setCloseTime] = useState(getTime(hearing.close_at));
  const dispatch = useDispatch();

  const onClosureSectionChange = (value) => {
    const closureInfoSection = getClosureSection(hearing);

    if (closureInfoSection) {
      onSectionChange(closureInfoSection.frontId, 'content', value);
    } else {
      dispatch(addSection(initNewSection({ type: SectionTypes.CLOSURE, content: value })));
    }
  };

  const onDateChange = (newDate, type) => {
    const time = type === 'START' ? openTime : closeTime;

    const currentTime = moment(time, TIME_FORMAT).isValid()
      ? moment(time, TIME_FORMAT)
      : moment(new Date(), TIME_FORMAT);

    const stringToDate = moment(newDate, DATE_FORMAT).toDate();

    const hours = moment(currentTime, TIME_FORMAT).get('hours');
    const minutes = moment(currentTime, TIME_FORMAT).get('minutes');

    stringToDate.setHours(hours);
    stringToDate.setMinutes(minutes);

    if (type === 'START') {
      setOpenDate(newDate);
      setOpenTime(moment(stringToDate).format(TIME_FORMAT));

      onHearingChange('open_at', stringToDate.toISOString());
    } else {
      setCloseDate(newDate);
      setCloseTime(moment(stringToDate).format(TIME_FORMAT));

      onHearingChange('close_at', stringToDate.toISOString());
    }
  };

  const onTimeChange = (event, type) => {
    const newTime = event.target.value;

    const hours = moment(newTime, TIME_FORMAT).get('hours');
    const minutes = moment(newTime, TIME_FORMAT).get('minutes');

    const date = type === 'START' ? openDate : closeDate;

    const currentDate = moment(date, DATE_FORMAT).isValid()
      ? moment(date, DATE_FORMAT)
      : moment(new Date(), DATE_FORMAT);

    const stringToDate = currentDate.toDate();

    stringToDate.setHours(hours);
    stringToDate.setMinutes(minutes);

    if (type === 'START') {
      setOpenDate(moment(stringToDate).format(DATE_FORMAT));
      setOpenTime(newTime);

      onHearingChange('open_at', stringToDate.toISOString());
    } else {
      setCloseDate(moment(stringToDate).format(DATE_FORMAT));
      setCloseTime(newTime);

      onHearingChange('close_at', stringToDate.toISOString());
    }
  };

  const closureInfoContent =
    getClosureSection(hearing) && !isEmpty(getAttr(getClosureSection(hearing).content))
      ? getClosureSection(hearing).content
      : { fi: i18n.fi.defaultClosureInfo, sv: i18n.sv.defaultClosureInfo, en: i18n.en.defaultClosureInfo };

  return (
    <div className='form-step'>
      <div className='hearing-form-row'>
        <div id='hearingOpeningTime' className='hearing-form-column' style={{ display: 'block' }}>
          <DateInput
            label={<FormattedMessage id='hearingOpeningDate' />}
            name='open_date'
            id='open_date'
            required
            placeholder={formatMessage({ id: 'hearingClosingTimePlaceholder' })}
            initialMonth={new Date()}
            language='fi'
            onChange={(value) => onDateChange(value, 'START')}
            value={openDate}
            errorText={errors.open_at}
            invalid={!!errors.open_at}
            style={{ marginBottom: 'var(--spacing-s)' }}
          />
          <TimeInput
            label={<FormattedMessage id='hearingOpeningTime' />}
            hoursLabel='Tunti'
            minutesLabel='Minuutti'
            name='open_time'
            id='open_time'
            required
            value={openTime || '00:00'}
            onChange={(event) => onTimeChange(event, 'START')}
            errorText={errors.open_at}
            invalid={!!errors.open_at}
          />
        </div>
        <div id='hearingClosingTime' className='hearing-form-column' style={{ display: 'block' }}>
          <DateInput
            label={<FormattedMessage id='hearingClosingDate' />}
            name='close_date'
            id='close_date'
            required
            placeholder={formatMessage({ id: 'hearingClosingTimePlaceholder' })}
            initialMonth={new Date()}
            language='fi'
            onChange={(value) => onDateChange(value, 'END')}
            value={closeDate}
            errorText={errors.close_at}
            invalid={!!errors.close_at}
            style={{ marginBottom: 'var(--spacing-s)' }}
          />
          <TimeInput
            label={<FormattedMessage id='hearingClosingTime' />}
            hoursLabel='Tunti'
            minutesLabel='Minuutti'
            name='close_time'
            id='close_time'
            required
            value={closeTime || '23:59'}
            onChange={(event) => onTimeChange(event, 'END')}
            errorText={errors.close_at}
            invalid={!!errors.close_at}
          />
        </div>
      </div>
      <MultiLanguageTextField
        richTextEditor
        labelId='hearingClosureInfo'
        name='closureInfo'
        onBlur={onClosureSectionChange}
        rows='10'
        value={closureInfoContent}
        fieldType={TextFieldTypes.TEXTAREA}
        languages={hearingLanguages}
      />
      <div className='step-footer'>
        <Button className='kerrokantasi-btn' onClick={onContinue}>
          <FormattedMessage id='hearingFormNext' />
        </Button>
      </div>
    </div>
  );
};

HearingFormStep4.propTypes = {
  errors: PropTypes.object,
  hearing: hearingShape,
  onContinue: PropTypes.func,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  onHearingChange: PropTypes.func,
  onSectionChange: PropTypes.func,
  formatMessage: PropTypes.func,
};

export default connect()(injectIntl(HearingFormStep4));
