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
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sagittis lacus non metus efficitur blandit. Proin tincidunt laoreet convallis. Etiam faucibus, metus non eleifend tempor, nulla mauris bibendum tortor, eu tincidunt libero enim nec felis. Sed cursus congue felis, id ornare purus ultricies eu. Quisque auctor dui eget pulvinar finibus. Phasellus tempus aliquam mi at viverra. Aenean volutpat quis diam in lacinia.
        </p>
      </div>
    <hr/>
    </div>);
  }
}
