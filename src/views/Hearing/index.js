import React from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import {injectIntl, FormattedMessage} from 'react-intl';
import {
  fetchHearing, fetchSectionComments, followHearing,
  postHearingComment, postSectionComment, postVote
} from 'actions';
import CommentList from 'components/CommentList';
import LabelList from 'components/LabelList';
import HearingImageList from 'components/HearingImageList';
import SectionList from 'components/SectionList';
import Section from 'components/Section';
import Sidebar from './Sidebar';
import find from 'lodash/find';
import Icon from 'utils/Icon';
import {isSpecialSectionType} from 'utils/section';
import LoadSpinner from 'components/LoadSpinner';

class Hearing extends React.Component {
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the Hearing view into the dispatch's associated store.
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
    Hearing.fetchData(dispatch, null, location, params);
  }

  onPostHearingComment(text) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(postHearingComment(hearingId, text));
  }

  onPostSectionComment(sectionId, text, pluginData) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(postSectionComment(hearingId, sectionId, text, pluginData));
  }

  onVoteComment(commentId, sectionId) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(postVote(commentId, hearingId, sectionId));
  }

  onFollowHearing() {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(followHearing(hearingId));
  }

  loadSectionComments(sectionId) {
    const {dispatch} = this.props;
    const {hearingId} = this.props.params;
    dispatch(fetchSectionComments(hearingId, sectionId));
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

  getFollowButton() {
    if (this.props.user === null) {
      return null;
    }
    return (
      <span className="pull-right">
        <Button bsStyle="primary" onClick={this.onFollowHearing.bind(this)}>
          <Icon name="bell-o"/> <FormattedMessage id="follow"/>
        </Button>
      </span>
    );
  }

  render() {
    const {hearingId} = this.props.params;
    const {state, data: hearing} = (this.props.hearing[hearingId] || {state: 'initial'});
    const {user} = this.props;

    if (state !== 'done') {
      return (<div className="container">
        <LoadSpinner />
      </div>);
    }
    const hearingAllowsComments = !hearing.closed && (new Date() < new Date(hearing.close_at));
    const onPostVote = this.onVoteComment.bind(this);
    const introSection = find(hearing.sections, (section) => section.type === "introduction");
    const closureInfoSection = find(hearing.sections, (section) => section.type === "closure-info");
    const regularSections = hearing.sections.filter((section) => !isSpecialSectionType(section.type));
    const sectionGroups = groupSections(regularSections);

    return (<div className="container">
      <Helmet title={hearing.title} meta={this.getOpenGraphMetaData(hearing)}/>
      <LabelList className="main-labels" labels={hearing.labels}/>
      <h1 className="page-title">
        {this.getFollowButton()}
        {!hearing.published ? <Icon name="eye-slash"/> : null}
        {hearing.title}
      </h1>
      <Row>
        <Sidebar hearing={hearing} sectionGroups={sectionGroups}/>
        <Col md={8} lg={9}>
          <div id="hearing">
            <div>
              <HearingImageList images={hearing.images}/>
              <div className="hearing-abstract" dangerouslySetInnerHTML={{__html: hearing.abstract}}/>
            </div>
            {closureInfoSection ? <Section section={closureInfoSection} canComment={false}/> : null}
            {introSection ? <Section section={introSection} canComment={false}/> : null}
          </div>
          {sectionGroups.map((sectionGroup) => (
            <div id={"hearing-sectiongroup-" + sectionGroup.type} key={sectionGroup.type}>
              <SectionList
                sections={sectionGroup.sections}
                canComment={hearingAllowsComments}
                onPostComment={this.onPostSectionComment.bind(this)}
                canVote={user !== null}
                onPostVote={onPostVote}
                loadSectionComments={this.loadSectionComments.bind(this)}
                sectionComments={this.props.sectionComments}
              />
            </div>
          ))}
          <div id="hearing-comments">
            <CommentList
              comments={hearing.comments}
              canComment={hearingAllowsComments}
              onPostComment={this.onPostHearingComment.bind(this)}
              canVote={user !== null}
              onPostVote={onPostVote}
            />
          </div>
        </Col>
      </Row>
    </div>);
  }
}

Hearing.propTypes = {
  dispatch: React.PropTypes.func,
  hearing: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  user: React.PropTypes.object,
  sectionComments: React.PropTypes.object,
};

const WrappedHearing = connect((state) => ({
  user: state.user,
  hearing: state.hearing,
  sectionComments: state.sectionComments,
  language: state.language
}))(injectIntl(Hearing));
// We need to re-hoist the data statics to the wrapped component due to react-intl:
WrappedHearing.canRenderFully = Hearing.canRenderFully;
WrappedHearing.fetchData = Hearing.fetchData;
export default WrappedHearing;

function groupSections(sections) {
  const sectionGroups = [];
  sections.forEach((section) => {
    const sectionGroup = sectionGroups.find(group => section.type === group.type);
    if (sectionGroup) {
      sectionGroup.sections.push(section);
    } else {
      sectionGroups.push({
        name_singular: section.type_name_singular,
        name_plural: section.type_name_plural,
        type: section.type,
        sections: [section]
      });
    }
  });
  return sectionGroups;
}
