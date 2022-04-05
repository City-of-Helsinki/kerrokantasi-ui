import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import CommentReportForm from "./CommentReportForm";
import getMessage from '../../utils/getMessage';
import { hearingShape } from "../../types";


function CommentReportModal({isOpen, hearing, onClose}) {
  return (
    <Modal animation={false} className="comment-reports-modal" onHide={onClose} show={isOpen} >
      <Modal.Header closeButton closeLabel={getMessage('commentReportsClose')}>
        <Modal.Title componentClass="h1">
          <FormattedMessage id="commentReportsTitle"/>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CommentReportForm hearing={hearing}/>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>
          <FormattedMessage id="commentReportsClose"/>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

CommentReportModal.propTypes = {
  hearing: hearingShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CommentReportModal;
