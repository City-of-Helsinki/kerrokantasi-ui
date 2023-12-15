import React from 'react';
import { connect } from 'react-redux';
import { useOidcClient } from 'hds-react';

function SilentRenew() {
  const { getUserManager } = useOidcClient();
  const userManager = getUserManager();
  userManager.signinSilentCallback();
  return <div>Silent Renew</div>;
}

export default connect()(SilentRenew);
