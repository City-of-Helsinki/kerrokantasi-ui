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
          <Helmet
            titleTemplate="%s - Kerro Kantasi"
            link={[
              {rel: "shortcut icon", type: "image/x-icon", href:"/assets/images/favicon.ico"}
            ]}/>
          <Header slim={this.props.location.pathname !== "/"} history={this.props.history} />
          {this.props.children}
          <Footer/>
        </div>
      </IntlProvider>);
  }
}

App.propTypes = {
  children: React.PropTypes.node,
  history: React.PropTypes.object,
  language: React.PropTypes.string,
  location: React.PropTypes.object,
  user: React.PropTypes.object,
};
App.childContextTypes = {
  language: React.PropTypes.string,
  user: React.PropTypes.object
};
export default connect((state) => ({user: state.user, language: state.language}))(App);
