import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'hds-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';

import getAttr from '../../utils/getAttr';
import Icon from '../../utils/Icon';
import { FILE_FORMATS } from './constants';
import { getApiTokenFromStorage, getApiURL } from '../../api';
import { createNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import { addToast } from '../../actions/toast';

/**
 * Renders a form for reporting comments.
 *
 * @component
 * @param {Object} hearing - The hearing object.
 * @param {string} id - The ID of the form.
 * @param {string} language - The UI language.
 * @returns {JSX.Element} - The rendered component.
 */
const CommentReportForm = ({ hearing, id, language }) => {
  const [fileFormat, setFileFormat] = useState(FILE_FORMATS.EXCEL.id);

  const intl = useIntl();
  const dispatch = useDispatch();

  /**
   * Handles the change event of the file format input.
   *
   * @param {OptionType} selected - The change event.
   * @returns {void}
   */
  const handleFileFormatChange = (selected) => setFileFormat(selected[0].value);

  /**
   * Handles the click event for downloading a report.
   *
   * @param {Event} event - The submit event.
   * @returns {Promise<void>} - A promise that resolves when the download is complete.
   */
  const handleDownloadClick = async (event) => {
    event.preventDefault();

    const accessToken = getApiTokenFromStorage();
    const targetFileFormat = Object.values(FILE_FORMATS).find((format) => format.id === fileFormat);
    const reportUrl = new URL(getApiURL(`/v1/hearing/${hearing.slug}${targetFileFormat.downloadEndpoint}`));
    reportUrl.search = new URLSearchParams({ lang: language });
    try {
      const response = await fetch(reportUrl, {
        method: 'GET',
        headers: {
          'Content-Type': targetFileFormat.contentType,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const blob = await response.blob();

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;

      // remove filename special characters to avoid potential naming issues
      const filename = hearing.title
        ? `${getAttr(hearing.title, language).replace(/[^a-zA-Z0-9 ]/g, '')}.${targetFileFormat.fileExtension}`
        : `kuuleminen.${targetFileFormat.fileExtension}`;

      link.setAttribute('download', filename);

      document.body.appendChild(link);

      link.click();

      link.parentNode.removeChild(link);
    } catch (error) {
      dispatch(addToast(createNotificationPayload(NOTIFICATION_TYPES.error, error.message)));
    }
  };

  const options = Object.values(FILE_FORMATS).map((format) => ({ value: format.id, label: format.name }));

  return (
    <form id={id} onSubmit={handleDownloadClick}>
      <Select
        id='download-reports'
        onChange={handleFileFormatChange}
        texts={{
          label: intl.formatMessage({id: 'commentReportsSelectFileType'})
        }}
        options={options}
        style={{ marginBottom: 'var(--spacing-l)' }}
      />

      <Button type='submit'>
        <Icon name='download' aria-hidden='true' /> <FormattedMessage id='commentReportsDownload' />
      </Button>
    </form>
  );
};

const mapStateToProps = (state) => ({
  language: state.language,
});

CommentReportForm.propTypes = {
  id: PropTypes.string.isRequired,
  hearing: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, null)(CommentReportForm);
