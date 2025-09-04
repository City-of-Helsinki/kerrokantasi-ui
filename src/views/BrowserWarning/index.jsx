import React from 'react';
import { Helmet } from 'react-helmet';

function BrowserWarning() {
  return (
    <div className='container'>
      <Helmet>
        <title>Kerrokantasi</title>
      </Helmet>
      <h1>Kerrokantasi</h1>
      <div className='row'>
        <div className='col-xs-12'>
          <div className='browser-warning-text-container'>
            <p>Kerrokantasi-palvelu ei toimi Internet Explorer-selaimella.</p>
            <p>
              Käytä toista selainta, kuten
              <a href='https://www.google.com/intl/fi/chrome/'>Chrome</a>,
              <a href='https://www.mozilla.org/fi/firefox/new/'>Firefox</a> tai
              <a href='https://www.microsoft.com/fi-fi/edge'>Edge</a>, ole hyvä.
            </p>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12'>
          <div className='browser-warning-text-container'>
            <p>Kerrokantasi (Säg din åsikt) tjänsten fungerar inte med Internet Explorer.</p>
            <p>
              Vänligen använd någon annan webbläsare t.ex.
              <a href='https://www.google.com/intl/sv/chrome/'>Chrome</a>,
              <a href='https://www.mozilla.org/sv-SE/firefox/new/'>Firefox</a> eller
              <a href='https://www.microsoft.com/sv-se/edge'>Edge</a>.
            </p>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12'>
          <div className='browser-warning-text-container'>
            <p>Kerrokantasi (Voice your opinion) service does not work with Internet Explorer.</p>
            <p>
              Please use another browser such as
              <a href='https://www.google.com/intl/en_us/chrome/'>Chrome</a>,
              <a href='https://www.mozilla.org/en-US/firefox/new/'>Firefox</a> or
              <a href='https://www.microsoft.com/en-us/edge'>Edge</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowserWarning;
