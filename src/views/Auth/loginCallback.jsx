import React from 'react';
import { LoginCallbackHandler } from 'hds-react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class CallbackPage extends React.Component {
  success = () => {
    localStorage.removeItem('votedComments');
    this.props.dispatch(push('/'));
  };

  failure = () => {
    this.props.dispatch(push('/'));
  };

  render() {
    return (
      <LoginCallbackHandler onSuccess={this.success} onError={this.failure}>
        <div>Redirecting...</div>
      </LoginCallbackHandler>
    );
  }
}

CallbackPage.propTypes = {
  dispatch: PropTypes.func,
};

export { CallbackPage as UnconnectedCallbackPage };
export default connect()(CallbackPage);
