import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
import { Button, FormGroup } from 'react-bootstrap';
import nl2br from 'react-nl2br';
import { isEmpty } from 'lodash';
import classnames from 'classnames';

import CommentForm from '../../BaseCommentForm';
import ShowMore from './ShowMore';
import Answer from './Answer';
import QuestionForm from '../../QuestionForm';

import Icon from '../../../utils/Icon';
import {notifyError} from '../../../utils/notify';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import getAttr from '../../../utils/getAttr';
import moment from 'moment';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.commentRef = React.createRef();
  }

  state = {
    editorOpen: false,
    isReplyEditorOpen: false,
    shouldJumpTo: this.props.jumpTo === this.props.data.id,
    scrollComplete: false,
    shouldAnimate: false,
    pinned: this.props.data.pinned,
    answers: this.props.data.answers || [],
  }

  componentDidMount = () => {
    if (this.state.shouldJumpTo && this.commentRef && this.commentRef.current && !this.state.scrollComplete) {
      this.commentRef.current.scrollIntoView({
        behaviour: 'smooth',
        block: 'nearest',
      });
      this.setState({
        scrollComplete: true,
        shouldAnimate: true,
      });
    }
  };

  onVote() {
    if (this.props.canVote) {
      const {data} = this.props;
      this.props.onPostVote(data.id, data.section, this.props.isReply, this.props.parentComponentId);
    } else {
      notifyError("Kirjaudu sisään äänestääksesi kommenttia.");
    }
  }

  toggleEditor(event) {
    event.preventDefault();

    if (this.state.editorOpen) {
      this.setState({editorOpen: false});
    } else {
      this.setState({editorOpen: true});
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const {data} = this.props;
    const {section, id} = data;
    const commentData = {};

    forEach(data, (value, key) => {
      if (key !== 'content') {
        commentData[key] = value;
      }
    });
    commentData.content = this.commentEditor.value;
    if (this.props.data.can_edit && this.isAdminUser()) {
      commentData.pinned = this.state.pinned;
    }
    commentData.answers = this.state.answers;
    this.props.onEditComment(section, id, commentData);
    this.setState({editorOpen: false});
  }

  handleDelete(event) {
    event.preventDefault();
    const {data} = this.props;
    const {section, id} = data;
    this.props.onDeleteComment(section, id);
  }

  /**
   * Open reply editor
   */
  handleToggleReplyEditor = (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this.setState((prevState) => ({
      isReplyEditorOpen: !prevState.isReplyEditorOpen,
    }));
  }

  /**
   * Call the parent component to retrieve list of sub comments for current comment.
   */
  handleShowReplys = () => {
    const { data, section } = this.props;
    this.props.onGetSubComments(data.id, section.id);
  }

  /**
   * Determines whether the user type is admin.
   */
  isAdminUser = () => (
    (typeof this.props.data.organization === 'string' || Array.isArray(this.props.data.organization))
  )

  getStrigifiedAnswer = (answer) => {
    const {questions, intl} = this.props;
    const question = find(questions, que => que.id === answer.question); // eslint-disable-line
    let selectedOption = {};
    return {
      question: question ? getAttr(question.text, intl.locale) : '',
      answers: answer.answers.map((ans) => {
        if (question) selectedOption = find(question.options, (option) => option.id === ans);
        return question ? getAttr(selectedOption.text, intl.locale) : '';
      })
    };
  }

  /**
   * User moment to convert current timestamp to desired format.
   * @returns {String}
   */
  parseTimestamp = timestamp => (
    moment(timestamp).format('hh:mm DD.MM.YYYY')
  );

  /**
   * Handle posting of a reply
   */
  handlePostReply = (text, authorName, pluginData, geojson, label, images) => {
    const {section} = this.props;
    const answers = this.state.answers;
    let commentData = {text, authorName, pluginData, geojson, label, images, answers};
    if (this.props.onPostReply && this.props.onPostReply instanceof Function) {
      if (this.props.isReply && this.props.parentComponentId) {
        commentData = { ...commentData, comment: this.props.parentComponentId };
      } else {
        commentData = { ...commentData, comment: this.props.data.id };
      }
      this.props.onPostReply(section.id, { ...commentData });
    }
  }

  /**
   * Once highlight is complete.
   * End animation
   */
  handleEndAnimation = () => {
    this.setState({ shouldAnimate: false });
  }

  /**
   * Toggle the pinning of comment
   */
  handleTogglePin = () => {
    this.setState((prevState) => ({
      pinned: !prevState.pinned,
    }));
    
   /**
   * Once an answer is posted, it can be changed.
   * @param {Number} question - number of corresponsing quesiton.
   * @param {String} questionType - example "single-question" "multiple-choice"
   * @param {Number} answer - id of the answer selected by the user.
   */
  handleAnswerChange = (question, questionType, answer) => {
    const answerExists = this.state.answers.find(stateAnswer => stateAnswer.question === question);
    let updatedAnswer;
    if (answerExists && typeof answerExists !== 'undefined') {
      updatedAnswer = this.state.answers.map((allAnswers) => {
        if (allAnswers.question === question) {
          if (questionType === 'single-choice') {
            return {...allAnswers, answers: [answer]};
          }
          const isDeselecting = allAnswers.answers.includes(answer);
          return {
            ...allAnswers,
            answers: isDeselecting ? allAnswers.answers.filter(sortAnswers => sortAnswers !== answer) : [...allAnswers.answers, answer],
          };
        }
        return allAnswers;
      });
    } else {
      updatedAnswer = [...this.state.answers, { question, answers: [answer], type: questionType }];
    }
    this.setState({ answers: updatedAnswer });
  }

  /**
   * Renders the header area for the comment
   * @returns {Component}
   */
  renderCommentHeader = (isAdminUser, { data } = this.props) => (
    <div className="hearing-comment-header clearfix">
      <div className="hearing-comment-votes">
        <Button className="btn-sm hearing-comment-vote-link" onClick={this.onVote.bind(this)}>
          <Icon name="thumbs-o-up"/> {data.n_votes}
        </Button>
      </div>
      <div className="hearing-comment-publisher">
        <span className="hearing-comment-user">
          {data.is_registered ?
            <span className={classnames({
              'hearing-comment-user-registered': !isAdminUser,
              'hearing-comment-user-organization': isAdminUser,
            })}
            >
              <Icon name="user"/>&nbsp;
              {
                isAdminUser ? data.organization
                : <FormattedMessage id="registered"/>
                }
              :&nbsp;
            </span>
            : null}
          {data.author_name || <FormattedMessage id="anonymous"/>}
        </span>
        <span className="hearing-comment-date">
          {this.parseTimestamp(data.created_at)}
        </span>
      </div>
    </div>
  );

  /**
   * Renders answers for a comment.
   * @returns {JSX<Component>}
   */
  renderCommentAnswers = () => (
    this.props.data.answers.map((answer) => <Answer key={answer.question} answer={this.getStrigifiedAnswer(answer)} />)
  );

  /**
   * When an admin user is logged in and editing their comment.
   * Allow the user to pin and unpin a comment.
   */
  renderPinUnpinButton = () => {
    return (
      <div className="hearing-comment__pin">
        <Button
          className={classnames([
            'hearing-comment__pin__icon',
            {
            'hearing-comment__pin__pin-comment': !this.state.pinned,
            'hearing-comment__pin__unpin-comment': this.state.pinned
            }
          ])}
          onClick={this.handleTogglePin}
        />
      </div>
    );
  }

  /**
   * For each answer answered, a user may edit the answer.
   */
  renderQuestionsForAnswer = (answer) => {
    const correspondingQuestion = this.props.section.questions.find(question => question.id === answer.question);
    return (
      <QuestionForm
        question={correspondingQuestion}
        lang={this.props.language}
        answers={answer}
        key={`$answer-for-question-${answer.question}`}
        loggedIn={!isEmpty(this.props.user)}
        onChange={this.handleAnswerChange}
      />
    );
  };

  /**
   * When state is set to true for editor open. Return the form.
   * When editing, answers may be edited as well.
   * @returns {Component}
   */
  renderEditorForm = () => (
    <React.Fragment>
      { this.isAdminUser()
        && this.props.data.can_edit
        && !this.props.isReply
        && this.renderPinUnpinButton()
      }
      <form className="hearing-comment__edit-form" onSubmit={(event) => this.handleSubmit(event)}>
        <FormGroup controlId="formControlsTextarea">
          {
            this.state.answers
            && this.state.answers.length > 0
            ? this.state.answers.map(answer => this.renderQuestionsForAnswer(answer))
            : null
          }
          <textarea
            className="form-control"
            defaultValue={this.props.data.content}
            placeholder="textarea"
            ref={(input) => {
              this.commentEditor = input;
            }}
          />
        </FormGroup>
        <Button type="submit">Save</Button>
      </form>
    </React.Fragment>
  );

  /**
   * If a user can edit their comment(s) render hyperlinks
   * @returns {Component|null}
   */
  renderEditLinks = () => (
    <div className="hearing-comment__edit-links">
      <a
        href=""
        onClick={(event) => this.toggleEditor(event)}
        style={{paddingRight: 10, borderRight: '1px solid black'}}
      >
        <FormattedMessage id="edit"/>
      </a>
      <a
        href=""
        onClick={(event) => this.handleDelete(event)}
        style={{paddingLeft: 10}}
      >
        <FormattedMessage id="delete"/>
      </a>
    </div>
  );

  /**
   * If a thread can be replied to, render reply links
   */
  renderReplyLinks = () => (
    <div>
      <Icon name="reply"/>
      <a
        href=""
        style={{marginLeft: 10, fontWeight: 'bold'}}
        onClick={this.handleToggleReplyEditor}
      >
        <FormattedMessage id="reply"/>
      </a>
    </div>
  );

  /**
   * When a comment is being replied to.
   * @returns {Component<Form>}
   */
  renderReplyForm = () => (
    <CommentForm
      answers={this.state.answers}
      closed={false}
      defaultNickname={this.props.defaultNickname}
      hearingId={this.props.hearingId}
      isReply
      language={this.props.language}
      loggedIn={!isEmpty(this.props.user)}
      nicknamePlaceholder={this.props.nicknamePlaceholder}
      onChangeAnswers={this.onChangeAnswers}
      onOverrideCollapse={this.handleToggleReplyEditor}
      onPostComment={this.handlePostReply}
      overrideCollapse
      section={this.props.section}
      user={this.props.user}
    />
  );

  /**
   * Renders the button when clicked shows replys posted for a specific comment.
   */
  renderViewReplyButton = ({ data } = this.props) => (
    data.comments && Array.isArray(data.comments) && data.comments.length > 0 && !Array.isArray(data.subComments)
      ? (
        <ShowMore
          numberOfComments={this.props.data.comments.length}
          onClickShowMore={this.handleShowReplys}
          isLoadingSubComment={this.props.data.loadingSubComments}
        />
      )
      : null
  );

  /**
   * Renders the sub comments
   * @returns {Component<Comment>} resursivly renders comment component untill last depth.
   */
  renderSubComments = () => (
    <div className="sub-comments">
      {
        this.props.data.subComments.map((subComment) => (
          <Comment
            {...this.props}
            parentComponentId={this.props.data.id}
            data={subComment}
            key={`${subComment.id}${Math.random()}`}
            isReply
          />
        ))
      }
    </div>
  );

  /**
   * When a comment is pinned, a small black box is displayed on top right corner.
   * @returns {JS<Component>}
   */
  renderPinnedHeader = () => (
    <div className="hearing-comment-pinned-container">
      <span className="hearing-comment-pinned-container__text">
        <FormattedMessage id="pinnedComment"/>
      </span>
    </div>
  );

  render() {
    const {data, canReply} = this.props;
    const canEdit = data.can_edit;
    const {editorOpen, isReplyEditorOpen} = this.state;
    const isAdminUser = this.props.data
      && (typeof this.props.data.organization === 'string' || Array.isArray(this.props.data.organization));

    if (!data.content) {
      return null;
    }
    return (
      <React.Fragment>
        <div
          className={classnames([
            'hearing-comment',
            {
              'comment-reply': this.props.isReply,
              'hearing-comment__has-replys': data.subComments
                && Array.isArray(data.subComments) && data.subComments.length > 0,
              'comment-animate': this.state.shouldAnimate,
              'hearing-comment__admin': isAdminUser,
            }
          ])}
          onAnimationEnd={this.handleEndstAnimation}
          ref={this.commentRef}
        >
          { this.props.data.pinned && this.renderPinnedHeader()}
          { this.renderCommentHeader(isAdminUser) }
          { !this.props.isReply && this.renderCommentAnswers() }
          <div className="hearing-comment-body">
            <p>{nl2br(data.content)}</p>
          </div>
          <div className="hearing-comment__images">
            {data.images
              ? data.images.map((image) =>
                <a
                  className="hearing-comment-images-image"
                  key={image.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  href={image.url}
                >
                  <img
                    alt={image.title}
                    src={image.url}
                    width={image.width < 100 ? image.width : 100}
                    height={image.height < 100 ? image.height : 100}
                  />
                </a>
              )
              : null}
          </div>
          {!isReplyEditorOpen && canReply && this.renderReplyLinks()}
          {canEdit && this.renderEditLinks()}
          {editorOpen && this.renderEditorForm()}
          {isReplyEditorOpen && this.renderReplyForm()}
          {this.renderViewReplyButton()}
        </div>
        {Array.isArray(data.subComments) && data.subComments.length > 0 && this.renderSubComments()}
      </React.Fragment>
    );
  }
}

Comment.propTypes = {
  canReply: PropTypes.bool,
  canVote: PropTypes.bool,
  data: PropTypes.object,
  defaultNickname: PropTypes.string,
  hearingId: PropTypes.string,
  intl: PropTypes.object,
  isReply: PropTypes.bool,
  jumpTo: PropTypes.number,
  language: PropTypes.string,
  nicknamePlaceholder: PropTypes.string,
  onDeleteComment: PropTypes.func,
  onEditComment: PropTypes.func,
  onGetSubComments: PropTypes.func,
  onPostReply: PropTypes.func,
  onPostVote: PropTypes.func,
  parentComponentId: PropTypes.number,
  questions: PropTypes.array,
  section: PropTypes.object,
  user: PropTypes.object,
};

Comment.defaultProps = {
  isReply: false,
};

export default injectIntl(Comment);
