import React from 'react';
import Helmet from 'react-helmet';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {fetchHearingList} from '../actions';
import OverviewMap from '../components/OverviewMap';

class HearingMap extends React.Component {
  // This view won't be able to successfully render on the server in any case,
  // so we're not bothering with isomorphic data fetching

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchHearingList("hearingMap", "/v1/hearing/map/"));
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {hearingMap} = this.props.hearingLists;
    const hearings = (hearingMap && Array.isArray(hearingMap.data) ? hearingMap.data : []);
    return (<div className="container">
      <Helmet title={formatMessage({id: 'hearingMap'})}/>
      <h1 className="page-title"><FormattedMessage id="hearingMap"/></h1>
      <OverviewMap hearings={hearings} style={{height: "800px"}} enablePopups />
    </div>);
  }
}

HearingMap.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearingLists: React.PropTypes.object,
};

export default connect(
  (state) => ({hearingLists: state.hearingLists, language: state.language})
)(
  injectIntl(HearingMap)
);
