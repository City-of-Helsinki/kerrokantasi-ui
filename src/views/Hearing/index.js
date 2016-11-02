import Hearing from '../../components/Hearing';
import Helmet from 'react-helmet';
import LoadSpinner from '../../components/LoadSpinner';
import React from 'react';
import {connect} from 'react-redux';
import {fetchHearing} from '../../actions';
import {injectIntl, intlShape} from 'react-intl';

export class HearingView extends React.Component {
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the HearingView view into the dispatch's associated store.
   *
   * @param dispatch Redux Dispatch function
   * @param getState Redux state getter
   * @param location Router location
   * @param params Router params
   * @return {Promise} Data fetching promise
   */
  static fetchData(dispatch, getState, location, params) {
    return dispatch(fetchHearing(params.hearingId, location.query.preview));
  }

  /**
   * Return truthy if the view can be rendered fully with the data currently
   * acquirable by `getState()`.
   *
   * @param getState State getter
   * @param location Router location
   * @param params Router params
   * @return {boolean} Renderable?
   */
  static canRenderFully(getState, location, params) {
    const {state, data} = (getState().hearing[params.hearingId] || {state: 'initial'});
    return (state === 'done' && data);
  }

  componentDidMount() {
    const {dispatch, params, location} = this.props;
    HearingView.fetchData(dispatch, null, location, params);
  }

  getOpenGraphMetaData(data) {
    let hostname = "http://kerrokantasi.hel.fi";
    if (typeof HOSTNAME === 'string') {
      hostname = HOSTNAME;  // eslint-disable-line no-undef
    } else if (typeof window !== 'undefined') {
      hostname = window.location.protocol + "//" + window.location.host;
    }
    const url = hostname + this.props.location.pathname;
    return [
      {property: "og:url", content: url},
      {property: "og:type", content: "website"},
      {property: "og:title", content: data.title}
      // TODO: Add description and image?
    ];
  }

  renderSpinner() {  // eslint-disable-line class-methods-use-this
    return (
      <div className="container">
        <LoadSpinner />
      </div>
    );
  }

  render() {
    const {hearingId} = this.props.params;
    const {state, data: hearing} = (this.props.hearing[hearingId] || {state: 'initial'});
    const {user} = this.props;

    if (state !== 'done') {
      return this.renderSpinner();
    }

    return (
      <div className="container">
        <Helmet title={hearing.title} meta={this.getOpenGraphMetaData(hearing)} />
        <Hearing
          hearingId={hearingId}
          hearing={hearing}
          user={user}
          sectionComments={this.props.sectionComments}
          location={this.props.location}
        />
      </div>
    );
  }
}

HearingView.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearing: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  user: React.PropTypes.object,
  sectionComments: React.PropTypes.object,
};

const WrappedHearingView = connect((state) => ({
  user: state.user,
  hearing: state.hearing,
  sectionComments: state.sectionComments,
}))(injectIntl(HearingView));
// We need to re-hoist the data statics to the wrapped component due to react-intl:
WrappedHearingView.canRenderFully = HearingView.canRenderFully;
WrappedHearingView.fetchData = HearingView.fetchData;

export default WrappedHearingView;
