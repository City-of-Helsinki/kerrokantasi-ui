import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LoadSpinner from '../../components/LoadSpinner';

const UnconnectedLogoutCallback = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('votedComments');
    navigate('/');
  });

  return (
    <LoadSpinner />
  );
}

export { UnconnectedLogoutCallback };
export default connect()(UnconnectedLogoutCallback);
