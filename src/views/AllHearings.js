import React from 'react';
import Helmet from 'react-helmet';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {fetchHearingList} from 'actions';
import HearingList from 'components/HearingList';

class AllHearings extends React.Component {
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the All Hearings view into the dispatch's associated
   * store.
   *
   * @param dispatch Redux Dispatch function
   * @return {Promise} Data fetching promise
   */
  static fetchData(dispatch) {
    return dispatch(fetchHearingList("allHearings", "/v1/hearing/"));
  }

  componentDidMount() {
    const {dispatch} = this.props;
    AllHearings.fetchData(dispatch);
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

const WrappedAllHearings = connect((state) => ({hearingLists: state.hearingLists}))(injectIntl(AllHearings));
// We need to re-hoist the static fetchData to the wrapped component due to react-intl:
WrappedAllHearings.fetchData = AllHearings.fetchData;
export default WrappedAllHearings;
