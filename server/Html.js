import React from 'react';

export default class Html extends React.Component {

  render() {
    const {head, bundleSrc, content, initialState} = this.props;
    const initialStateHtml = `window.STATE = ${JSON.stringify(initialState || {})};`;

    return (
      <html lang="fi">
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta content="width=device-width, initial-scale=1" name="viewport"/>
        {head ? head.title.toComponent() : <title>Kerro Kantasi</title>}
        {head ? head.meta.toComponent() : null}
        {head ? head.link.toComponent() : null}
      </head>
      <body>
      <div id="root" dangerouslySetInnerHTML={{ __html: content || "" }}/>
      <script dangerouslySetInnerHTML={{ __html: initialStateHtml }}/>
      <script src={bundleSrc}/>
      </body>
      </html>
    );
  }
}

Html.propTypes = {
  head: React.PropTypes.object,
  content: React.PropTypes.string,
  bundleSrc: React.PropTypes.string.isRequired,
  initialState: React.PropTypes.object
};
