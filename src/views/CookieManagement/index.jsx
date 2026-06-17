import React from 'react';
import { Helmet } from 'react-helmet-async';
import { formatPageTitle } from '../../utils/pageTitle';
import { CookieSettingsPage } from 'hds-react';

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
