import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

const DeleteModal = ({ isOpen, close, onDeleteComment }) =>
  <Modal className="delete-modal" show={isOpen} onHide={() => close()} animation={false}>
    <Modal.Header closeButton>
      <Modal.Title><FormattedMessage id="deleteConfirmation"/></Modal.Title>
    </Modal.Header>
    <Modal.Footer>
      <Button onClick={() => close()}>
        <FormattedMessage id="cancel"/>
      </Button>
      <Button bsStyle="danger" onClick={() => { onDeleteComment(); close(); }}>
        <FormattedMessage id="deleteComment"/>
      </Button>
    </Modal.Footer>
  </Modal>;

DeleteModal.propTypes = {
  isOpen: React.PropTypes.boolean,
  close: React.PropTypes.func,
  onDeleteComment: React.PropTypes.func
};

export default DeleteModal;
