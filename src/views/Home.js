import React from 'react';
import Helmet from 'react-helmet';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

class Home extends React.Component {
  render() {
    const {formatMessage} = this.props.intl;
    return (<div className="container">
      <Helmet title={formatMessage({id: 'welcome'})}/>
      <h1><FormattedMessage id="welcome" /></h1>
      <p>A welcome message in {this.context.language}.</p>
    </div>);
  }
}

Home.propTypes = {intl: intlShape.isRequired};
Home.contextTypes = {language: React.PropTypes.string};

export default injectIntl(Home);
