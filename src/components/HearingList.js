/* eslint-disable react/no-multi-comp */
import React from 'react';
import {injectIntl} from 'react-intl';
import {Link} from 'react-router';
import formatRelativeTime from '../utils/formatRelativeTime';
import Icon from 'utils/Icon';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import LabelList from './LabelList';

class HearingListItem extends React.Component {

  render() {
    const hearing = this.props.hearing;
    const mainImage = (hearing.images.length ? hearing.images[0] : null);
    return (<Row className="hearing-list-item">
      <Col md={4}>
        {mainImage ? <img src={mainImage.url} className="img-responsive"/> : null}
      </Col>
      <Col md={8}>
        <h4 className="hearing-list-item-title">
          {!hearing.published ? <Icon name="eye-slash"/> : null}
          <Link to={`/hearing/${hearing.id}`}>{hearing.title}</Link>
        </h4>
        <div className="hearing-list-item-meta hearing-list-item-times">
          <Icon name="clock-o"/>&nbsp;
          {formatRelativeTime("timeOpen", hearing.open_at)}
          &nbsp;|&nbsp;
          {formatRelativeTime("timeClose", hearing.close_at)}
        </div>
        <div className="hearing-list-item-meta hearing-list-item-labels">
          <LabelList labels={hearing.labels} />
        </div>
        <div className="hearing-list-item-meta hearing-list-item-comments">
          <Icon name="comment-o"/>&nbsp;{ hearing.n_comments }
        </div>
      </Col>
    </Row>);
  }
}

HearingListItem.propTypes = {hearing: React.PropTypes.object};

class HearingList extends React.Component {
  render() {
    const {state, data} = (this.props.hearings || {});
    if (state !== "done") return <div className="loader-wrap"><i className="fa fa-spinner fa-spin fa-2x text-primary"></i></div>;
    return (<div className="media-list">{data.map((hearing) => <HearingListItem hearing={hearing} key={hearing.id}/>)}</div>);
  }
}

HearingList.propTypes = {
  hearings: React.PropTypes.object
};

export default (injectIntl(HearingList));
