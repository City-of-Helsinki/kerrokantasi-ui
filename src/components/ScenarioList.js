import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Scenario from './Scenario';

class ScenarioList extends React.Component {
  render() {
    const {scenarios} = this.props;
    if (scenarios.length === 0) {
      return (<div id="hearing-scenarios">
          <h2><FormattedMessage id="hearing-scenarios"/></h2>
          <p><FormattedMessage id="no-scenarios-available"/></p>
      </div>);
    }
    return (<div id="hearing-scenarios">
      <h2><FormattedMessage id="hearing-scenarios"/></h2>
      {scenarios.map((scenario) => <Scenario data={scenario} key={scenario.id}/>)}
    </div>);
  }
}

ScenarioList.propTypes = {
  scenarios: React.PropTypes.Array
};

export default (injectIntl(ScenarioList));
