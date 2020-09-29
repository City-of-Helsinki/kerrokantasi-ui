import React from 'react';

function BrowserWarning() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12">
          <div className="browser-warning-text-container">
            <p>
              Kerrokantasi-palvelu ei toimi Internet Explorer-selaimella.
            </p>
            <p>
              Käytä toista selainta, kuten <a href="https://www.google.com/intl/fi/chrome/" rel="noopener noreferrer" target="_blank">Chrome</a>, <a href="https://www.mozilla.org/fi/firefox/new/" rel="noopener noreferrer" target="_blank">Firefox</a> tai <a href="https://www.microsoft.com/fi-fi/edge" rel="noopener noreferrer" target="_blank">Edge</a>, ole hyvä.
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <div className="browser-warning-text-container">
            <p>
              Kerrokantasi (Säg din åsikt) tjänsten fungerar inte med Internet Explorer.
            </p>
            <p>
              Vänligen använd någon annan webbläsare t.ex. <a href="https://www.google.com/intl/sv/chrome/" rel="noopener noreferrer" target="_blank">Chrome</a>, <a href="https://www.mozilla.org/sv-SE/firefox/new/" rel="noopener noreferrer" target="_blank">Firefox</a> eller <a href="https://www.microsoft.com/sv-se/edge" rel="noopener noreferrer" target="_blank">Edge</a>.
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <div className="browser-warning-text-container">
            <p>
              Kerrokantasi (Voice your opinion) service does not work with Internet Explorer.
            </p>
            <p>
              Please use another browser such as <a href="https://www.google.com/intl/en_us/chrome/" rel="noopener noreferrer" target="_blank">Chrome</a>,<a href="https://www.mozilla.org/en-US/firefox/new/" rel="noopener noreferrer" target="_blank">Firefox</a> or <a href="https://www.microsoft.com/en-us/edge" rel="noopener noreferrer" target="_blank">Edge</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowserWarning;
