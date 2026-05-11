import React from 'react';
import { Helmet } from 'react-helmet';
import { CookieSettingsPage } from 'hds-react';

const CookieManagement = () => {
  return (
    <main>
      <Helmet>
        <title>Kerrokantasi</title>
      </Helmet>
      <div className='container'>
        <CookieSettingsPage />
      </div>
    </main>
  );
};

export default CookieManagement;
