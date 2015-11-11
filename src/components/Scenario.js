import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import {FormattedMessage} from 'react-intl';

export default class Scenario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    const {data} = this.props;
    if (this.state.collapsed) {
      return (<div className="hearing-scenario">
        <h3 className="scenario-title" onClick={this.toggle.bind(this)}><i className="fa fa-chevron-right"></i> {data.title}</h3>
        <hr/>
      </div>);
    }
    return (<div className="hearing-scenario">
      <h3 className="scenario-title" onClick={this.toggle.bind(this)}><i className="fa fa-chevron-down"></i> {data.title}</h3>
      <div className="scenario-content">
        {data.images.map((image) => <div key={image.url}><img className="img-responsive" alt={image.title} title={image.title} src={image.url} /><div className="image-caption">{image.caption}</div></div>)}
        <p>{data.abstract}</p>
        <p>{data.content}</p>
      </div>
      <Button bsStyle="primary"><i className="fa fa-comment-o"/> <FormattedMessage id="commentThisScenario"/></Button>
    <hr/>
    </div>);
  }
}

Scenario.propTypes = {
  data: React.PropTypes.object
};
