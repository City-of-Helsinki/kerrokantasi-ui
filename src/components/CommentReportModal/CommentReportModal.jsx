import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, IconInfoCircle } from 'hds-react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import CommentReportForm from './CommentReportForm';
import { hearingShape } from '../../types';

const CommentReportModal = ({ isOpen, intl, hearing, onClose }) => {
  const titleId = 'comment-report-modal-title';
  const descriptionId = 'comment-report-modal-description';

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      closeButtonLabelText={intl.formatMessage({ id: 'close' })}
      theme={{ '--accent-line-color': 'var(--color-black)' }}
    >
      <Dialog.Header
        id={titleId}
        title={<FormattedMessage id='commentReportsTitle' />}
        iconLeft={<IconInfoCircle aria-hidden='true' />}
      />
      <Dialog.Content>
        <CommentReportForm hearing={hearing} id={descriptionId} />
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button className='kerrokantasi-btn black' onClick={onClose}>
          <FormattedMessage id='commentReportsClose' />
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

CommentReportModal.propTypes = {
  hearing: hearingShape.isRequired,
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default injectIntl(CommentReportModal);
