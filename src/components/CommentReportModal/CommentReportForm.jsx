/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import getAttr from '../../utils/getAttr';
import Icon from '../../utils/Icon';
import { FILE_FORMATS } from './constants';
import { getApiURL } from '../../api';

class CommentReportForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileFormat: FILE_FORMATS.EXCEL.id,
    };

    this.handleFileFormatChange = this.handleFileFormatChange.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  handleFileFormatChange(event) {
    this.setState({ fileFormat: event.target.value });
  }

  handleDownloadClick(event) {
    event.preventDefault();
    const { fileFormat } = this.state;
    const { apiToken, hearing, language } = this.props;

    const accessToken = apiToken.apiToken;
    const targetFileFormat = Object.values(FILE_FORMATS).find((format) => format.id === fileFormat);
    const reportUrl = new URL(getApiURL(`/v1/hearing/${hearing.slug}${targetFileFormat.downloadEndpoint}`));
    reportUrl.search = new URLSearchParams({ lang: language });

    fetch(reportUrl, {
      method: 'GET',
      headers: {
        'Content-Type': targetFileFormat.contentType,
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
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
      });
  }

  render() {
    const { fileFormat } = this.state;
    return (
      <Form>
        <FormGroup controlId='file-format-select'>
          <ControlLabel>
            <FormattedMessage id='commentReportsSelectFileType' />
          </ControlLabel>
          <FormControl componentClass='select' onChange={this.handleFileFormatChange} value={fileFormat}>
            {Object.values(FILE_FORMATS).map((format) => (
              <option key={format.id} value={format.id}>
                {format.name}
              </option>
            ))}
          </FormControl>
        </FormGroup>
        <Button onClick={this.handleDownloadClick} type='submit'>
          <Icon name='download' aria-hidden='true' /> <FormattedMessage id='commentReportsDownload' />
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.language,
  apiToken: state.apitoken,
});

CommentReportForm.propTypes = {
  apiToken: PropTypes.object.isRequired,
  hearing: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
};

export { CommentReportForm as UnconnectedCommentReportForm };
export default connect(mapStateToProps, null)(CommentReportForm);
