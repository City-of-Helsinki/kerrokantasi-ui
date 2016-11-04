import React from 'react';
import {connect} from 'react-redux';
import {push} from 'redux-router';
import Section from './Section';
import {injectIntl, intlShape} from 'react-intl';
import {Link} from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import Icon from '../utils/Icon';


class FullscreenPlugin extends Section {

  render() {
    const {section} = this.props;
    const pluginContent = this.renderPluginContent(section);
    const openDetailPage = () => this.props.dispatch(push(this.props.detailURL));
    return (
      <div>
        <div className="fullscreen-navigation">
          <div className="logo">
            <Link to="/">
              <img alt="City of Helsinki" src="/assets/images/helsinki-coat-of-arms-white-big.png"/>
            </Link>
          </div>
          <div className="header-title">
            {this.props.headerTitle}
          </div>
          <div className="minimize">
            <Button onClick={openDetailPage}>
              <Icon name="compress"/>
            </Button>
          </div>
        </div>
        <div className="plugin-content">{pluginContent}</div>
      </div>
    );
  }
}

FullscreenPlugin.propTypes = {
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  comments: React.PropTypes.object,
  detailURL: React.PropTypes.string.isRequired,
  dispatch: React.PropTypes.func,
  headerTitle: React.PropTypes.string,
  intl: intlShape.isRequired,
  loadSectionComments: React.PropTypes.func,
  onPostComment: React.PropTypes.func,
  onPostVote: React.PropTypes.func,
  section: React.PropTypes.object.isRequired,
  user: React.PropTypes.object,
};

export default connect()(injectIntl(FullscreenPlugin));
