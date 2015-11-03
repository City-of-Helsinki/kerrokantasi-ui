import React from 'react';
import Badge from 'react-bootstrap/lib/Badge';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import {injectIntl, FormattedMessage} from 'react-intl';
import {Map, Marker, TileLayer} from 'react-leaflet';
import Comment from './Comment';
import Scenario from './Scenario';

class Hearing extends React.Component {
  getLabels() {
    return (<div>
      <Label>label 1</Label> <Label>label 2</Label>
    </div>);
  }

  getScenarios() {
    return (<div id="hearing-scenarios">
      <h2><FormattedMessage id="hearing-scenarios"/></h2>
      <div>
        <Scenario sourceId="abcdef123"/>
        <Scenario sourceId="abcd1234"/>
        <Scenario sourceId="123abcdef"/>
      </div>
    </div>);
  }

  getComments() {
    return (<div id="hearing-comments">
              <h2><FormattedMessage id="comments"/></h2>
              <Comment sourceId="abcdef123"/>
              <Comment sourceId="123abcdef"/>
            </div>);
  }

  getOverviewMap() {
    const position = [51.505, -0.09];
    const style = {height: "200px"}
    return (<Map center={position} zoom={13} style={style}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}/>
      </Map>
    );
  }

  render() {
    return (<div className="container">
      <Col xs={6} sm={3}>
        <div>
          <h4><FormattedMessage id="table-of-content"/></h4>
        </div>
        <ButtonGroup vertical>
          <Button href="#hearing"><FormattedMessage id="hearing"/></Button>
          <Button href="#hearing-scenarios"><FormattedMessage id="hearing-scenarios"/> <Badge>3</Badge></Button>
          <Button href="#hearing-comments"><FormattedMessage id="comments"/> <Badge>2</Badge></Button>
        </ButtonGroup>
        <div>
          <h4><FormattedMessage id="overview-map"/></h4>
        </div>
        {this.getOverviewMap()}
      </Col>
      <Col xs={12} sm={9}>
        <div id="hearing">
          {this.getLabels()}
          <div>
            <h1>Title</h1>
            <img src="/assets/carousel.png"/>
            <div className="image-caption">
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </div>
            <div className="hearing-abstract">
              <p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac lacus ac lacus cursus laoreet vel non mauris. Nullam sed justo id ligula vulputate molestie vel ut lacus. Sed placerat volutpat venenatis. Pellentesque maximus convallis hendrerit. Quisque elementum porta turpis, quis consectetur purus. Phasellus odio eros, tincidunt in mattis id, eleifend nec purus. Curabitur at ultricies erat.
              </p>
            </div>
          </div>
          <div>
            <p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor velit velit, sed sodales ipsum iaculis ac. Praesent gravida lectus a felis vulputate congue. Integer dignissim massa at tortor scelerisque viverra. Aliquam velit metus, vulputate suscipit rutrum at, blandit vitae sapien. Ut ornare mollis nibh, sit amet tempor mi sodales et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce libero tellus, fringilla at purus a, viverra pellentesque orci. Nam vestibulum fringilla leo sed aliquam. Donec tempus dolor erat, sed pellentesque sem fermentum et. Nunc rutrum congue velit eu pulvinar.
</p><p>
Curabitur tempor dapibus orci, sed aliquet purus lobortis id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consequat, purus et feugiat pellentesque, metus libero tempor odio, sit amet condimentum purus urna in massa. Mauris sagittis quis turpis luctus vestibulum. Morbi tristique, sem non viverra commodo, metus tortor cursus elit, vitae bibendum augue mi sit amet diam. Duis nulla massa, pretium quis ante quis, tristique scelerisque sem. Quisque eros leo, elementum ut erat id, interdum ultricies odio. Cras sit amet volutpat lorem, nec tristique sem. Duis tortor odio, pretium vitae varius et, eleifend et lacus.
</p><p>
Sed vulputate ipsum sit amet ipsum rutrum, sed consectetur elit accumsan. Praesent at mi fringilla, placerat neque eu, accumsan sapien. Nunc et ligula nibh. Phasellus suscipit risus eu leo egestas tincidunt. Nullam id velit vestibulum, congue nisl a, venenatis nisl. Donec sed hendrerit turpis, et ultrices mi. Etiam rutrum, mauris nec dapibus blandit, nibh nisl pellentesque augue, ut blandit ipsum mi sed felis. Ut lacinia molestie justo ut viverra. Ut ut risus nec nulla accumsan imperdiet a non augue.
</p><p>
Curabitur vulputate venenatis lectus ac pulvinar. Etiam finibus aliquet magna convallis commodo. Praesent ligula erat, scelerisque vitae tempor eu, accumsan pulvinar erat. Vivamus ut nibh sit amet turpis vestibulum placerat. Ut vel placerat lectus, eu vulputate orci. Pellentesque consequat sed lectus eu euismod. Vestibulum nisi nibh, molestie a leo id, venenatis efficitur elit. Nulla facilisi. Sed suscipit, urna vel facilisis tincidunt, turpis felis egestas mauris, quis lobortis mi tellus eget odio.
            </p>
          </div>
        </div>
        <hr/>
        {this.getScenarios()}
        {this.getComments()}
      </Col>
    </div>);
  }
}

export default injectIntl(Hearing);
