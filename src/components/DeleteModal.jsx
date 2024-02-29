import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Button } from 'hds-react';
import { FormattedMessage } from 'react-intl';

const DeleteModal = ({ isOpen, close, onDeleteComment }) => (
  <Modal className='delete-modal' show={isOpen} onHide={() => close()} animation={false}>
    <Modal.Header closeButton>
      <Modal.Title>
        <FormattedMessage id='deleteConfirmation' />
      </Modal.Title>
    </Modal.Header>
    <Modal.Footer>
      <Button className="kerrokantasi-btn" onClick={() => close()}>
        <FormattedMessage id='cancel' />
      </Button>
      <Button
        className="kerrokantasi-btn danger"
        onClick={() => {
          onDeleteComment();
          close();
        }}
      >
        <FormattedMessage id='deleteComment' />
      </Button>
    </Modal.Footer>
  </Modal>
);

DeleteModal.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  onDeleteComment: PropTypes.func,
};

export default DeleteModal;
