import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog } from 'hds-react';
import { FormattedMessage } from 'react-intl';

const DeleteModal = ({ isOpen, close, onDeleteComment }) => {
  const titleId = 'delete-modal-title';
  const descriptionId = 'delete-modal-description';

  return (
    <Dialog isOpen={isOpen} close={close} aria-labelledby={titleId} aria-describedby={descriptionId}>
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
            onDeleteComment();
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
  close: PropTypes.func,
  onDeleteComment: PropTypes.func,
};

export default DeleteModal;
