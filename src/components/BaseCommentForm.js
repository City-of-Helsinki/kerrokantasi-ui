import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape, FormattedMessage, } from 'react-intl';
import { Button, Checkbox, FormControl, FormGroup, ControlLabel, Alert } from 'react-bootstrap';
import classnames from 'classnames';
import uuid from 'uuid/v1';
import Icon from '../utils/Icon';
import {getImageAsBase64Promise} from '../utils/hearing';
import CommentDisclaimer from './CommentDisclaimer';
import {get, includes} from 'lodash';
import QuestionResults from './QuestionResults';
import QuestionForm from './QuestionForm';

export class BaseCommentForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      collapsed: true,
      commentText: "",
      nickname: props.defaultNickname || '',
      imageTooBig: false,
      images: [],
      pinned: false,
      showAlert: true,
      hideName: false,
    };
    this.getSelectedImagesAsArray = this.getSelectedImagesAsArray.bind(this);
  }

  componentDidMount = () => {
    if (this.isUserAdmin()) {
      this.setState({ nickname: this.props.user.displayName });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.collapseForm && nextProps.collapseForm) {
      this.clearCommentText();
      this.toggle();
    }
    if (this.props.defaultNickname === '' && nextProps.defaultNickname !== '' && !this.isUserAdmin()) {
      this.setState({nickname: nextProps.defaultNickname});
    }
    if (this.isUserAdmin() && nextProps.user && nextProps.user.displayName) {
      this.setState({ nickname: nextProps.user.displayName });
    }
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
    if (this.props.onOverrideCollapse instanceof Function) {
      this.props.onOverrideCollapse();
    }
  }

  handleTextChange(event) {
    this.setState({commentText: event.target.value});
  }

  handleNicknameChange(event) {
    this.setState({nickname: event.target.value});
  }

  clearCommentText() {
    this.setState({commentText: ""});
  }

  submitComment() {
    const pluginComment = this.getPluginComment();
    let pluginData = this.getPluginData();
    let nickname = (this.state.nickname === "" ? this.props.nicknamePlaceholder : this.state.nickname);
    let commentText = (this.state.commentText === null ? '' : this.state.commentText);
    let geojson = null;
    let label = null;
    let images = this.state.images;
    let pinned = this.state.pinned;

    // plugin comment will override comment fields, if provided
    if (pluginComment) {
      commentText = pluginComment.content || commentText;
      nickname = pluginComment.author_name || nickname;
      pluginData = pluginComment.plugin_data || pluginData;
      label = pluginComment.label || null;
      images = pluginComment.image ? [pluginComment.image] : images;
      geojson = pluginComment.geojson || null;
      pinned = pluginComment.pinned || null;
    } else if (pluginData && typeof pluginData !== "string") {
      // this is for old-fashioned plugins with only data
      pluginData = JSON.stringify(pluginData);
    }
    this.props.onPostComment(
      commentText,
      nickname,
      pluginData,
      geojson,
      label,
      images,
      pinned,
    );
  }

  handleChange(event) {
    const imagePromisesArray = [];
    const images = [];
    this.isImageTooBig(event.target.files);

    for (let _i = 0; _i < this.refs.images.files.length; _i += 1) {
      imagePromisesArray.push(getImageAsBase64Promise(this.refs.images.files[_i]));
    }

    Promise.all(imagePromisesArray).then((arrayOfResults) => {
      for (let _i = 0; _i < this.refs.images.files.length; _i += 1) {
        const imageObject = {title: "Title", caption: "Caption"};

        imageObject.image = arrayOfResults[_i];
        images.push(imageObject);
      }

      this.setState({images});
    });
  }

  /**
   * Determines whether the logged in user is admin or not.
   * The array in users with key adminOrganizations should be of length > 0
   */
  isUserAdmin = () => (
    this.props.user
    && Array.isArray(this.props.user.adminOrganizations)
    && this.props.user.adminOrganizations.length > 0
  );

  getPluginData() {  // eslint-disable-line class-methods-use-this
    return undefined;
  }

  getPluginComment() {  // eslint-disable-line class-methods-use-this
    return undefined;
  }

  getSelectedImagesAsArray(files) { // eslint-disable-line class-methods-use-this
    const imagesArray = [];
    for (let _i = 0; _i < files.length; _i += 1) {
      imagesArray.push(files[_i]);
    }
    return imagesArray;
  }

  /**
   * When user type is admin, an alert is shown, use this method to close the alert.
   */
  handleCloseAlert = () => {
    this.setState((prevState) => ({
      showAlert: !prevState.showAlert,
    }));
  }

  /**
   * When logged in as admin, user may chose to hide their identity.
   */
  handleToggleHideName = () => {
    this.setState((prevState) => ({
      nickname: !prevState.hideName ? this.props.intl.formatMessage({ id: 'employee' }) : this.props.user.displayName,
      hideName: !prevState.hideName,
    }));
  }

  /**
   * Toggle the pinning of comment
   */
  handleTogglePin = () => {
    this.setState((prevState) => ({
      pinned: !prevState.pinned,
    }));
  }

  isImageTooBig(images) { // eslint-disable-line class-methods-use-this
    let isImageTooBig = false;
    images.forEach((image) => {
      if (image.size > 1000000) {
        isImageTooBig = true;
      }
    });
    if (isImageTooBig) {
      this.setState({imageTooBig: true});
    } else {
      this.setState({imageTooBig: false});
    }
  }

  /**
   * When admin user is posting a comment, we will show a closeable warning.
   */
  renderAdminWarning = () => (
    <Alert bsStyle="warning">
      <div className="comment-form__comment-alert">
        <div className="comment-form__comment-alert__alert-icon">
          <Icon name="info-circle" size="lg" />
        </div>
        <span className="comment-form__comment-alert__alert-message"><FormattedMessage id="adminCommentMessage"/></span>
        <div className="comment-form__comment-alert__alert-close">
          <Icon name="close" onClick={this.handleCloseAlert}/>
        </div>
      </div>
    </Alert>
  );

  /**
   * Render the checkbox to hide user name and identitiy for admin user.
   */
  renderHideNameOption = () => (
    <Checkbox checked={this.state.hideName} key={uuid()} onChange={this.handleToggleHideName}>
      <FormattedMessage id="hideName"/>
    </Checkbox>
  );

  /**
   * For admins, there is slightly different form.
   */
  renderFormForAdmin =() => {
    const { user } = this.props;
    const organization = this.isUserAdmin() && user.adminOrganizations[0];
    return (
      <FormGroup>
        <FormControl
          type="text"
          placeholder={this.props.nicknamePlaceholder}
          value={this.state.nickname}
          onChange={this.handleNicknameChange.bind(this)}
          maxLength={32}
          disabled
        />
        <FormControl
          type="text"
          placeholder={this.props.intl.formatMessage({ id: 'organization' })}
          value={organization || ''}
          onChange={() => {}}
          maxLength={32}
          disabled
        />
      </FormGroup>
    );
  }

  /**
   * If an admin type of user is posting comment, the form is slightly different.
   * @returns {JSX<Component>}
   */
  renderNameFormForUser = () => {
    const isAdminUser = this.isUserAdmin();
    const headingId = isAdminUser ? 'nameAndOrganization' : 'nickname';

    return (
      <React.Fragment>
        <h4><FormattedMessage id={headingId} /></h4>
        { isAdminUser && this.state.showAlert && this.renderAdminWarning() }
        { isAdminUser && this.renderHideNameOption() }
        {
          isAdminUser
          ? (
            <div className="comment-form__group-admin">
              { this.renderFormForAdmin() }
            </div>
          )
          : (
            <FormGroup>
              <FormControl
                type="text"
                placeholder={this.props.nicknamePlaceholder}
                value={this.state.nickname}
                onChange={this.handleNicknameChange.bind(this)}
                maxLength={32}
              />
            </FormGroup>
          )
        }
      </React.Fragment>
    );
  }

  /**
   * When user is of admin type, they are allowed to pin a comment to top.
   * In the form, an icon can be shown to pin or unpin the comment.
   */
  renderPinUnpinIcon = () => (
    <Button
      className={classnames([
        'comment-form__heading-container__pin__icon',
        {
        'comment-form__heading-container__pin__pin-comment': !this.state.pinned,
        'comment-form__heading-container__pin__unpin-comment': this.state.pinned
        }
      ])}
      onClick={this.handleTogglePin}
    />
  );

  render() {
    const {language, section, onChangeAnswers, answers, loggedIn, closed, user} = this.props;
    if (!this.props.overrideCollapse && this.state.collapsed) {
      return (
        <Button onClick={this.toggle.bind(this)} bsStyle="primary" bsSize="large" block>
          <Icon name="comment"/> <FormattedMessage id="addComment"/>
        </Button>
      );
    }
    return (
      <div className="comment-form">
        <form>
          <h2><FormattedMessage id="writeComment"/></h2>
          {
            !this.props.isReply &&
            section.questions.map((question) => {
              const canShowQuestionResult =
                closed || (loggedIn && includes(get(user, "answered_questions"), question.id));
              return canShowQuestionResult
                ? <QuestionResults key={question.id} question={question} lang={language} />
                : null;
            })
          }
          {
            !this.props.isReply &&
            section.questions.map((question) => {
              const canShowQuestionForm = !closed && !includes(get(user, "answered_questions"), question.id);
              return canShowQuestionForm
                ? (
                  <QuestionForm
                    key={question.id}
                    loggedIn={loggedIn}
                    answers={answers.find(answer => answer.question === question.id)}
                    onChange={onChangeAnswers}
                    question={question}
                    lang={language}
                  />
                )
                : null;
            })
          }
          <div className="comment-form__heading-container">
            <div className="comment-form__heading-container__title">
              <h4><FormattedMessage id="writeComment"/></h4>
            </div>
            {
              this.isUserAdmin()
              && !this.props.isReply
              && (
                <div className="comment-form__heading-container__pin">
                  { this.renderPinUnpinIcon() }
                </div>
              )
            }
          </div>
          <FormControl
            componentClass="textarea"
            value={this.state.commentText}
            onChange={this.handleTextChange.bind(this)}
          />
          <div className="comment-form__selected-images">
            {this.state.imageTooBig
              ? (
                <div className="comment-form__image-too-big">
                  <FormattedMessage id="image_too_big"/>
                </div>
              )
              : this.state.images.map(
                (image, key) =>
                  <img
                    style={{ marginRight: 10 }}
                    alt={image.title}
                    src={image.image}
                    width={image.width < 100 ? image.width : 100}
                    height={image.height < 100 ? image.width : 100}
                    key={key + Math.random()} //eslint-disable-line
                  />)
            }
          </div>
          <FormGroup className="comment-form__file">
            <ControlLabel><FormattedMessage id="add_images"/></ControlLabel>
            <div className="comment-form__select-button">
              <label className="btn btn-default btn-sm" htmlFor="fileInput">
                <FormattedMessage id="choose_images"/>
                <input
                  type="file"
                  ref="images"
                  id="fileInput"
                  multiple
                  style={{display: 'none', visibility: 'hidden'}}
                  onChange={(event) => this.handleChange(event)}
                />
              </label>
            </div>
            <span style={{fontSize: 13, marginTop: 20}}><FormattedMessage id="multipleImages"/></span>
          </FormGroup>
          { this.renderNameFormForUser() }
          <div className="comment-buttons clearfix">
            <Button
              bsStyle="default"
              onClick={this.toggle.bind(this)}
            >
              <FormattedMessage id="cancel"/>
            </Button>
            <Button
              bsStyle="primary"
              disabled={!this.state.commentText || this.state.imageTooBig}
              onClick={this.submitComment.bind(this)}
            >
              <FormattedMessage id="submit"/>
            </Button>
          </div>
          <CommentDisclaimer/>
        </form>
      </div>
    );
  }
}

BaseCommentForm.propTypes = {
  onPostComment: PropTypes.func,
  onOverrideCollapse: PropTypes.func,
  intl: intlShape.isRequired,
  collapseForm: PropTypes.bool,
  defaultNickname: PropTypes.string,
  overrideCollapse: PropTypes.bool,
  nicknamePlaceholder: PropTypes.string,
  section: PropTypes.object,
  language: PropTypes.string,
  onChangeAnswers: PropTypes.func,
  answers: PropTypes.array,
  loggedIn: PropTypes.bool,
  closed: PropTypes.bool,
  user: PropTypes.object,
  isReply: PropTypes.bool,
};

BaseCommentForm.defaultProps = {
  defaultNickname: '',
  overrideCollapse: false,
  onOverrideCollapse: () => {},
  isReply: false,
};

export default injectIntl(BaseCommentForm);
