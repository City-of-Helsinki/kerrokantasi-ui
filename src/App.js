import React from 'react';
import LanguageSwitch from 'components/LanguageSwitch';

class App extends React.Component {
  render() {
    return (<div>
      <LanguageSwitch />
      <hr/>
      {this.props.children}
    </div>);
  }
}

App.propTypes = {children: React.PropTypes.node};
export default App;
