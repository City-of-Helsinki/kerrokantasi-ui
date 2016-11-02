import React from 'react';
import {connect} from 'react-redux';
import {IntlProvider} from 'react-intl';
import messages from './i18n';
import Helmet from 'react-helmet';
import Header from './components/Header';
import Footer from './components/Footer';
import {retrieveUserFromSession} from './actions';

class App extends React.Component {
  getChildContext() {
    return {
      language: this.props.language,
      user: this.props.user
    };
  }

  componentDidMount() {
    this.props.dispatch(retrieveUserFromSession());
  }

  render() {
    const locale = this.props.language;
    const links = [
      {rel: "shortcut icon", type: "image/x-icon", href: "/assets/images/favicon.ico"}
    ];
    return (
      <IntlProvider locale={locale} messages={messages[locale] || {}}>
        <div>
          <Helmet
            titleTemplate="%s - Kerro Kantasi"
            link={links}
            script={[{src: "/assets/js/piwik.js", type: "text/javascript"}]}
          />
          <Header slim={this.props.location.pathname !== "/"} history={this.props.history}/>
          <main>{this.props.children}</main>
          <Footer/>
        </div>
      </IntlProvider>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
  history: React.PropTypes.object,
  language: React.PropTypes.string,
  location: React.PropTypes.object,
  user: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};
App.childContextTypes = {
  language: React.PropTypes.string,
  user: React.PropTypes.object
};
export default connect((state) => ({user: state.user, language: state.language}))(App);
