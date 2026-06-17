import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CookieSettingsPage } from 'hds-react';

import { formatPageTitle } from '../../utils/pageTitle';

const CookieManagement = () => {
  return (
    <main>
      <Helmet title={formatPageTitle()} />
      <div className='container'>
        <CookieSettingsPage />
      </div>
    </main>
  );
};

export default CookieManagement;
