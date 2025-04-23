import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog } from 'hds-react';
import { FormattedMessage, injectIntl } from 'react-intl';

const DeleteModal = ({ isOpen, commentSectionId, commentId, refreshUser, intl, close, onDeleteComment }) => {
  const titleId = 'delete-modal-title';
  const descriptionId = 'delete-modal-description';

  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      closeButtonLabelText={intl.formatMessage({ id: 'close' })}
      theme={{ '--accent-line-color': 'rgb(176, 16, 56)' }}
    >
      <Dialog.Header id={titleId} title={<FormattedMessage id='deleteComment' />} />
      <Dialog.Content>
        <span id={descriptionId}>
          <FormattedMessage id='deleteConfirmation' />
        </span>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button className='kerrokantasi-btn' onClick={() => close()}>
          <FormattedMessage id='cancel' />
        </Button>
        <Button
          className='kerrokantasi-btn danger'
          onClick={() => {
            onDeleteComment(commentSectionId, commentId, refreshUser);
            close();
          }}
        >
          <FormattedMessage id='deleteComment' />
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool,
  intl: PropTypes.object,
  close: PropTypes.func,
  onDeleteComment: PropTypes.func,
  commentSectionId: PropTypes.string,
  commentId: PropTypes.string,
  refreshUser: PropTypes.bool,
};

export default injectIntl(DeleteModal);
