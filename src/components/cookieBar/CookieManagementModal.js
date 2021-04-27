import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Panel, PanelGroup, Button} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import getMessage from '../../utils/getMessage';
import Icon from '../../utils/Icon';
import Switch from 'react-bootstrap-switch';
import {addCookieScript} from "../../utils/cookieUtils";

class CookieManagementModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      activeKey: '0',
      cookies: {
        googleAnalytics: false
      }
    };
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  handleSwitch(elem, state) {
    this.setState(prevState => ({  
      cookies: {
        ...prevState.cookies,
        [elem.props.name]: state
      }
    }));
  }

  handleKeyDown(e) {
    if (e && e.key === "Enter") {
      this.setState({ expanded: !this.state.expanded })
    }
  }

  handleSwitchKeyDown(e) {
    console.log(e)
  }

  handleOnHide() {
    if (this.state.cookies.googleAnalytics) {
      addCookieScript();
    }
    this.props.close();
  }

  render() {
    return (
      <Modal
        className="cookie-management-modal"
        scrollable={true}
        size="xl"
        show={this.props.isOpen}
        onHide={() => this.handleOnHide()}
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
            onKeyDown={(e) => this.handleKeyDown(e)}
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
                  <div id="cookie-panel-title-container">
                    <Icon id="cookie-panel-icon" name={this.state.activeKey === '1' ? 'chevron-down' : 'chevron-right'} />
                    <a tabIndex="0" role="tab">{getMessage('cookieBar.modal.panel.functionalCookies')}</a>
                  </div>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                {getMessage('cookieBar.modal.panel.functionalCookiesContent')}
              </Panel.Body>
            </Panel>
            <Panel eventKey="2">
              <Panel.Heading>
                <Panel.Title>
                  <div id="cookie-panel-title-container">
                    <div onClick={() =>
                      this.setState({ activeKey: this.state.activeKey === '2' ? '0' : '2' })}
                    >
                      <Icon id="cookie-panel-icon" name={this.state.activeKey === '2' ? 'chevron-down' : 'chevron-right'} />
                      <a tabIndex="0" role="tab">{getMessage('cookieBar.modal.panel.googleAnalytics')}</a>
                    </div>
                    <span id="cookie-panel-switch-container">
                      <span id="cookie-panel-switch-status">{this.state.cookies.googleAnalytics ? 'Käytössä' : 'Pois käytöstä'}</span>
                      <Switch
                        tabIndex="0"
                        defaultValue={this.state.cookies.googleAnalytics}
                        onChange={(el, state) => this.handleSwitch(el, state)}
                        onKeyDown={(el, state) => this.handleSwitchKeyDown(el, state)}
                        name='googleAnalytics'
                      />
                    </span>
                  </div>
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
