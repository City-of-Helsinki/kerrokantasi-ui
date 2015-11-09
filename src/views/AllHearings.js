import React from 'react';
import Helmet from 'react-helmet';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {fetchHearingList} from 'actions';
import HearingList from 'components/HearingList';

class AllHearings extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchHearingList("allHearings", "/v1/hearing/"));
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {hearingLists} = this.props;
    return (<div className="container">
      <Helmet title={formatMessage({id: 'allHearings'})}/>
      <h1><FormattedMessage id="allHearings"/></h1>
      <HearingList hearings={hearingLists.allHearings} />
    </div>);
  }
}

AllHearings.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearingLists: React.PropTypes.object
};

export default connect((state) => ({hearingLists: state.hearingLists}))(injectIntl(AllHearings));
