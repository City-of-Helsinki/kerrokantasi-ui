/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Panel, PanelGroup, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Switch from 'react-bootstrap-switch';

import getMessage from '../../utils/getMessage';
import Icon from '../../utils/Icon';
import { addCookieScripts } from "../../utils/cookieUtils";
import Link from '../LinkWithLang';

class CookieManagementModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      activeKey: '0',
      changesMade: false,
      cookies: {
        googleAnalytics: false
      }
    };
  }

  UNSAFE_componentWillReceiveProps() {
    if (document.cookie.split('; ').find(row => row.startsWith('CookieConsent'))) {
      const consentValue = document.cookie.split('; ').find(row => row.startsWith('CookieConsent')).split('=')[1];
      if (consentValue === 'true') {
        this.setState(prevState => ({
          cookies: {
            ...prevState.cookies,
            googleAnalytics: true
          },
          changesMade: false
        }));
      } else {
        this.setState(prevState => ({
          cookies: {
            ...prevState.cookies,
            googleAnalytics: false
          },
          changesMade: false
        }));
      }
    }
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  handleSwitch(elem, state) {
    this.setState(prevState => ({
      cookies: {
        ...prevState.cookies,
        [elem.props.name]: state
      },
      changesMade: true
    }));
  }

  handleKeyDown(ev, key, value) {
    if (ev && ev.key === "Enter") {
      this.setState({ [key]: value });
    }
  }

  handleOnHide() {
    if (this.state.changesMade && this.state.cookies.googleAnalytics) {
      addCookieScripts();
    }

    this.props.close();
  }

  render() {
    return (
      <Modal
        className="cookie-management-modal"
        size="xl"
        show={this.props.isOpen}
        onHide={() => this.handleOnHide()}
      >
        <Modal.Body>
          <Button id="cookie-management-modal-close" onClick={() => this.props.close()}>
            <Icon name="close" />
          </Button>
          <Modal.Title><FormattedMessage id="cookieBar.modal.header" /></Modal.Title>
          <Panel id="collapsible-cookie-panel" expanded={this.state.expanded}>
            <p>{getMessage('cookieBar.modal.paragraph1')}</p>
            <Panel.Collapse>
              <p>{getMessage('cookieBar.modal.paragraph2')}</p>
              <FormattedMessage
                id="cookieBar.modal.cookieInfoLink"
                values={{
                  linkToInfo: (
                    <Link to={{ path: "/info" }} target="_blank">
                      {getMessage('cookieBar.modal.cookieInfoLinkText')}
                    </Link>
                  ),
                }}
              />
            </Panel.Collapse>
          </Panel>
          <a
            id="cookie-show-more"
            tabIndex="0"
            role="button"
            onClick={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
            onKeyDown={(ev) => this.handleKeyDown(ev, 'expanded', !this.state.expanded)}
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
                <Panel.Title>
                  <div id="cookie-panel-title-container">
                    <div
                      onClick={() =>
                        this.setState((prevState) => ({ activeKey: prevState.activeKey === '1' ? '0' : '1' }))
                      }
                      onKeyDown={
                        (ev) =>
                          this.handleKeyDown(ev, 'activeKey', this.state.activeKey === '1' ? '0' : '1')
                      }
                    >
                      <Icon
                        id="cookie-panel-icon"
                        name={this.state.activeKey === '1' ? 'chevron-down' : 'chevron-right'}
                      />
                      <a tabIndex="0" role="tab">
                        {getMessage('cookieBar.modal.panel.functionalCookies')}
                      </a>
                    </div>
                    <span id="cookie-panel-switch-container">
                      <span id="cookie-panel-info-status" style={{ marginRight: 0 }}>
                        {getMessage('cookieBar.modal.panel.alwaysEnabled')}
                      </span>
                    </span>
                  </div>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible id="cookie-panel-body">
                {getMessage('cookieBar.modal.panel.functionalCookiesContent')}
              </Panel.Body>
            </Panel>
            <Panel eventKey="2">
              <Panel.Heading>
                <Panel.Title>
                  <div id="cookie-panel-title-container">
                    <div
                      onClick={() =>
                        this.setState((prevState) => ({ activeKey: prevState.activeKey === '2' ? '0' : '2' }))
                      }
                      onKeyDown={
                        (ev) =>
                          this.handleKeyDown(ev, 'activeKey', this.state.activeKey === '2' ? '0' : '2')
                      }
                    >
                      <Icon
                        id="cookie-panel-icon"
                        name={this.state.activeKey === '2' ? 'chevron-down' : 'chevron-right'}
                      />
                      <a
                        tabIndex="0"
                        role="tab"
                      >
                        {getMessage('cookieBar.modal.panel.googleAnalytics')}
                      </a>
                    </div>
                    <span id="cookie-panel-switch-container">
                      <span id="cookie-panel-switch-status">
                        {
                          this.state.cookies.googleAnalytics ?
                            getMessage('cookieBar.modal.panel.enabled') :
                            getMessage('cookieBar.modal.panel.disabled')
                        }
                      </span>
                      <Switch
                        tabIndex="0"
                        defaultValue={this.state.cookies.googleAnalytics}
                        onChange={(el, state) => this.handleSwitch(el, state)}
                        name="googleAnalytics"
                      />
                    </span>
                  </div>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible id="cookie-panel-body">
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
