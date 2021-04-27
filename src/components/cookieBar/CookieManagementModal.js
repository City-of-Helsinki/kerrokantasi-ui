import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Panel, PanelGroup, Button} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import getMessage from '../../utils/getMessage';
import Icon from '../../utils/Icon';

class CookieManagementModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      activeKey: '0'
    };
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  render() {
    return (
      <Modal
        className="cookie-management-modal"
        scrollable
        size="xl"
        show={this.props.isOpen}
        onHide={() => this.props.close()}
      >
        <Modal.Body>
          <Button id="cookie-management-modal-close" onClick={() => this.props.close()}>
            <Icon name="close" />
          </Button>
          <Modal.Title><FormattedMessage id="cookieBar.modal.header"/></Modal.Title>
          <Panel id="collapsible-cookie-panel" expanded={this.state.expanded}>
            <p>{getMessage('cookieBar.modal.paragraph1')}</p>
            <Panel.Collapse>
              <p>{getMessage('cookieBar.modal.paragraph2')}</p>
              <FormattedMessage
                id="cookieBar.modal.cookieInfoLink"
                values={{
                  linkToInfo: (
                    <a href={getMessage('cookieBar.link.href')}>
                      {getMessage('cookieBar.modal.cookieInfoLinkText')}
                    </a>
                  ),
                }}
              />
            </Panel.Collapse>
          </Panel>
          <a
            id="cookie-show-more"
            tabIndex="0"
            role="button"
            onClick={() => this.setState({ expanded: !this.state.expanded })}
            onKeyDown={() => this.setState({ expanded: !this.state.expanded })}
          >
            {this.state.expanded ? getMessage('cookieBar.modal.showLess') : getMessage('cookieBar.modal.showMore')}
          </a>
          <PanelGroup
            accordion
            id="cookie-management-panel"
            activeKey={this.state.activeKey}
            onSelect={this.handleSelect}
          >
            <Panel eventKey="1">
              <Panel.Heading>
                <Panel.Title
                  onClick={() =>
                    this.setState({ activeKey: this.state.activeKey === '1' ? '0' : '1' })}
                >
                  <Icon id="cookie-panel-icon" name={this.state.activeKey === '1' ? 'chevron-down' : 'chevron-right'} />
                  {getMessage('cookieBar.modal.panel.functionalCookies')}
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                {getMessage('cookieBar.modal.panel.functionalCookiesContent')}
              </Panel.Body>
            </Panel>
            <Panel eventKey="2">
              <Panel.Heading>
                <Panel.Title
                  onClick={() =>
                    this.setState({ activeKey: this.state.activeKey === '2' ? '0' : '2' })}
                >
                  <Icon id="cookie-panel-icon" name={this.state.activeKey === '2' ? 'chevron-down' : 'chevron-right'} />
                  {getMessage('cookieBar.modal.panel.googleAnalytics')}
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                {getMessage('cookieBar.modal.panel.googleAnalyticsContent')}
              </Panel.Body>
            </Panel>
          </PanelGroup>
        </Modal.Body>
      </Modal>
    );
  }
}

CookieManagementModal.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func
};

export default CookieManagementModal;
