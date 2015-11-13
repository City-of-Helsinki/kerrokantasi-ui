import React from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import Scenario from './Scenario';

class ScenarioList extends React.Component {
  render() {
    const {scenarios} = this.props;
    if (scenarios.length === 0) {
      return (<div>
          <h2><FormattedMessage id="hearing-scenarios"/></h2>
          <p><FormattedMessage id="no-scenarios-available"/></p>
      </div>);
    }
    return (<div>
      <h2><FormattedMessage id="hearing-scenarios"/></h2>
      {scenarios.map((scenario) => (<Scenario data={scenario}
                                     key={scenario.id}
                                     canComment={this.props.canComment}
                                     onPostComment={this.props.onPostComment}
                                     canVote={this.props.canVote}
                                     onPostVote={this.props.onPostVote}
                                     loadScenarioComments={this.props.loadScenarioComments}
                                     comments={this.props.scenarioComments[scenario.id] || {data: []}}
                                    />))}
    </div>);
  }
}

ScenarioList.propTypes = {
  canComment: React.PropTypes.bool,
  canVote: React.PropTypes.bool,
  loadScenarioComments: React.PropTypes.function,
  onPostComment: React.PropTypes.function,
  onPostVote: React.PropTypes.function,
  scenarios: React.PropTypes.array,
  scenarioComments: React.PropTypes.object,
};

export default (injectIntl(ScenarioList));
