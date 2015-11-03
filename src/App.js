import React from 'react';
import {connect} from 'react-redux';
import {IntlProvider} from 'react-intl';
import messages from './i18n';
import Helmet from 'react-helmet';
import Header from 'components/Header';
import Footer from 'components/Footer';

class App extends React.Component {
  getChildContext() {
    return {
      language: this.props.language,
      user: this.props.user
    };
  }

  render() {
    const locale = this.props.language;
    return (
      <IntlProvider locale={locale} messages={messages[locale] || {}}>
        <div>
          <Helmet titleTemplate="%s - Kerro Kantasi" />
          <Header/>
          {this.props.children}
          <Footer/>
        </div>
      </IntlProvider>);
  }
}

App.propTypes = {
  children: React.PropTypes.node,
  language: React.PropTypes.string,
  user: React.PropTypes.object
};
App.childContextTypes = {
  language: React.PropTypes.string,
  user: React.PropTypes.object
};
export default connect((state) => ({user: state.user, language: state.language}))(App);
