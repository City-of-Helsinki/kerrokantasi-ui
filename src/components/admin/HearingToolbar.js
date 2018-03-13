import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';

import {Row, Col, Button, ButtonToolbar, Alert} from 'react-bootstrap';
import Icon from '../../utils/Icon';

import {hearingShape, userShape} from '../../types';


const DATE_FORMAT = "LLLL";


class HearingToolbar extends React.Component {
  constructor(props) {
    super(props);
    moment.locale("fi-FI");
  }

  render() {
    const hearing = this.props.hearing;

    let statusLabel = "";
    const openingTime = moment(hearing.open_at);
    const actions = [
      <Button bsStyle="default" onClick={this.props.onEdit} key="edit">
        <Icon name="pencil-square-o"/> <FormattedMessage id="editHearing"/>
      </Button>
    ];
    if (!hearing.closed && hearing.published) {
      statusLabel = (<Alert bsStyle="success"><Icon name="eye"/> <FormattedMessage id="published"/></Alert>);
      actions.push(
        <Button bsStyle="danger" onClick={this.props.onRevertPublishing} key="unpublish">
          <Icon name="eye-slash"/> <FormattedMessage id="revertPublishing"/>
        </Button>
      );
      actions.push(
        <Button bsStyle="danger" onClick={this.props.onCloseHearing} key="close">
          <Icon name="ban"/> <FormattedMessage id="closeHearing"/>
        </Button>
      );
    } else if (hearing.closed && hearing.published && moment(hearing.close_at) <= moment()) {
      statusLabel = (<Alert bsStyle="danger"><Icon name="ban"/> <FormattedMessage id="closedHearing"/></Alert>);
    } else if (hearing.closed && hearing.published) {
      statusLabel = (
        <Alert bsStyle="warning">
          <Icon name="clock-o"/> <FormattedMessage id="toBePublishedHearing"/> {openingTime.format(DATE_FORMAT)}
        </Alert>
      );
      actions.push(
        <Button bsStyle="danger" onClick={this.props.onRevertPublishing} key="unpublish">
          <Icon name="eye-slash"/> <FormattedMessage id="revertPublishing"/>
        </Button>
      );
    } else if (!hearing.published) {
      actions.push(
        <Button bsStyle="danger" onClick={() => this.props.onDeleteHearingDraft()} key="unpublish">
          <Icon name="eye-slash"/> <FormattedMessage id="deleteDraft"/>
        </Button>
      );
    } else {
      statusLabel = (<Alert bsStyle="info"><Icon name="pencil"/> <FormattedMessage id="draft"/></Alert>);
      let publishText = <FormattedMessage id="publishHearing"/>;
      if (moment(hearing.open_at).diff(moment()) < 0) {
        publishText = <FormattedMessage id="publishHearingNow"/>;
      }
      actions.push(
        <Button bsStyle="danger" onClick={this.props.onPublish} key="publish">
          <Icon name="eye"/> {publishText}
        </Button>
      );
    }

    return (
      <div className="toolbar-bottom">
        <Row>
          <Col md={6}>
            {statusLabel}
          </Col>
          <Col md={6}>
            <ButtonToolbar className="actions pull-right">
              {actions}
            </ButtonToolbar>
          </Col>
        </Row>
      </div>
    );
  }
}

HearingToolbar.propTypes = {
  hearing: hearingShape,
  onCloseHearing: PropTypes.func,
  onEdit: PropTypes.func,
  onPublish: PropTypes.func,
  onRevertPublishing: PropTypes.func,
  onDeleteHearingDraft: PropTypes.func,
  user: userShape,
};

const WrappedHearingToolbar = injectIntl(HearingToolbar);

export default WrappedHearingToolbar;
