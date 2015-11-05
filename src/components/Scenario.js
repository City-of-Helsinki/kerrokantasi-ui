import React from 'react';

export default class Scenario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
  }

  toogle() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    const {data} = this.props;
    if (this.state.collapsed) {
      return (<div className="hearing-scenario">
        <h3 className="scenario-title" onClick={this.toogle.bind(this)}><i className="fa fa-chevron-right"></i> {'Scenario Name'}</h3>
        <hr/>
      </div>);
    }
    return (<div className="hearing-scenario">
      <h3 className="scenario-title" onClick={this.toogle.bind(this)}><i className="fa fa-chevron-down"></i> {'Scenario Name'}</h3>
      <div className="scenario-content">
        <img width="100%" src="/assets/carousel.png" />
        <div className="image-caption">Image Caption</div>
        <p>{data.abstract}</p>
        <p>{data.content}</p>
      </div>
    <hr/>
    </div>);
  }
}

Scenario.propTypes = {
  data: React.PropTypes.object
};
