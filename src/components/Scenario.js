import React from 'react';

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
        <img className="img-responsive" src="/assets/carousel.png" />
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
