import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import uuid from 'uuid/v1';
import Icon from '../utils/Icon';
import nl2br from 'react-nl2br';
import {notifyError} from '../utils/notify';
import forEach from 'lodash/forEach';
<<<<<<< HEAD
import find from 'lodash/find';
import getAttr from '../utils/getAttr';
=======
import moment from 'moment';
>>>>>>> master

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {editorOpen: false};
  }

  onVote() {
    if (this.props.canVote) {
      const {data} = this.props;
      this.props.onPostVote(data.id, data.section);
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
    this.props.onEditComment(section, id, commentData);
    this.setState({editorOpen: false});
  }

  handleDelete(event) {
    event.preventDefault();
    const {data} = this.props;
    const {section, id} = data;
    this.props.onDeleteComment(section, id);
  }

  getStrigifiedAnswer = (answer) => {
    const {questions, intl} = this.props;
    const question = find(questions, que => que.id === answer.question); // eslint-disable-line
    let selectedOption = {};
    // return {question: getAttr(question.text), answers: answer.answers.map(ans => getAttr(question.options[ans]))};
    return {
      question: question ? getAttr(question.text, intl.locale) : '',
      answers: answer.answers.map((ans) => {
        if (question) selectedOption = find(question.options, (option) => option.id === ans);
        return question ? getAttr(selectedOption.text, intl.locale) : '';
      })
    };
  }

  parseTimestamp = (timestamp) => {
    const timeFormat = 'hh:mm DD.MM.YYYY';
    return moment(timestamp).format(timeFormat);
  }

  render() {
    const {data} = this.props;
    /* const mockData = Object.assign({}, data);
    mockData.answers = [
                {
                    "question": 85,
                    "answers": [1]
                },
                {
                    "question": 86,
                    "answers": [1,2]
                },
            ]; */
    const canEdit = data.can_edit;
    const {editorOpen} = this.state;

    if (!data.content) {
      return null;
    }

    return (
      <div className="hearing-comment">
        <div className="hearing-comment-header clearfix">
          <div className="hearing-comment-votes">
            <Button className="btn-sm hearing-comment-vote-link" onClick={this.onVote.bind(this)}>
              <Icon name="thumbs-o-up"/> {data.n_votes}
            </Button>
          </div>
          <div className="hearing-comment-publisher">
            <span className="hearing-comment-user">
              {data.is_registered ?
                <span className="hearing-comment-user-registered">
                  <Icon name="user"/>&nbsp;
                  <FormattedMessage id="registered"/>:&nbsp;
                </span>
                : null}
              {data.author_name || <FormattedMessage id="anonymous"/>}
            </span>
            <span className="hearing-comment-date">
              {this.parseTimestamp(data.created_at)}
            </span>
          </div>
        </div>
        {data.answers.map((answer) => <Answer key={answer.question} answer={this.getStrigifiedAnswer(answer)} />)}
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
        {canEdit ? (
          <div>
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
        ) : null}
        {editorOpen ? (
          <form className="hearing-comment__edit-form" onSubmit={(event) => this.handleSubmit(event)}>
            <FormGroup controlId="formControlsTextarea">
              <textarea
                className="form-control"
                defaultValue={data.content}
                placeholder="textarea"
                ref={(input) => {
                  this.commentEditor = input;
                }}
              />
            </FormGroup>
            <Button type="submit">Save</Button>
          </form>
        ) : null}
      </div>
    );
  }
}

Comment.propTypes = {
  data: PropTypes.object,
  intl: PropTypes.object,
  canVote: PropTypes.bool,
  onPostVote: PropTypes.func,
  onEditComment: PropTypes.func,
  onDeleteComment: PropTypes.func,
  questions: PropTypes.array
};

const Answer = ({answer}) => {
  return (
    <div style={{borderBottom: '1px solid #ebedf1', padding: '8px 0', fontSize: '15px'}}>
      <strong>{answer.question}</strong>
      {answer.answers.map((ans) => <div key={uuid()}><span style={{color: '#9fb6eb', marginRight: '4px'}}><Icon className="icon" name="check" /></span>{ans}</div>)}
    </div>
  );
};

Answer.propTypes = {
  answer: PropTypes.object
};

export default injectIntl(Comment);
