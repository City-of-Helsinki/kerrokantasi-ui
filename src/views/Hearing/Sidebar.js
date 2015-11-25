import React from 'react';
import Badge from 'react-bootstrap/lib/Badge';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import {injectIntl, FormattedMessage} from 'react-intl';
import OverviewMap from 'components/OverviewMap';
import SocialBar from 'components/SocialBar';
import formatRelativeTime from '../../utils/formatRelativeTime';

class Sidebar extends React.Component {
  render() {
    const {hearing} = this.props;
    return (<Col xs={6} sm={3}>
      <div className="hearing-sidebar">
        <div>
          <h4><FormattedMessage id="timetable"/></h4>
          <i className="fa fa-clock-o"/> {formatRelativeTime("timeOpen", hearing.open_at)}<br/>
          <i className="fa fa-clock-o"/> {formatRelativeTime("timeClose", hearing.close_at)}
        </div>
        <div>
          <h4><FormattedMessage id="table-of-content"/></h4>
        </div>
        <ButtonGroup vertical>
          <Button href="#hearing"><FormattedMessage id="hearing"/></Button>
          <Button href="#hearing-sections"><FormattedMessage id="hearing-sections"/>
            <Badge>{hearing.sections.length}</Badge></Button>
          <Button href="#hearing-comments"><FormattedMessage id="comments"/> <Badge>{hearing.n_comments}</Badge></Button>
        </ButtonGroup>
        <div>
          <h4><FormattedMessage id="borough"/></h4>
          <Label>{hearing.borough}</Label>
        </div>
        <OverviewMap latitude={hearing.latitude} longitude={hearing.longitude}/>
        <SocialBar />
      </div>
    </Col>);
  }
}

Sidebar.propTypes = {
  hearing: React.PropTypes.object
};

export default injectIntl(Sidebar);
