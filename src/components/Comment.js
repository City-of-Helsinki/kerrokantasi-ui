import React from 'react';
import {injectIntl, FormattedMessage, FormattedRelative} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Icon from '../utils/Icon';
import nl2br from 'react-nl2br';
import {notifyError} from '../utils/notify';
import forEach from 'lodash/forEach';

class Comment extends React.Component {

  constructor(props) {
    super(props);

    this.state = { editorOpen: false };
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
    const commentData = { };

    forEach(data, (value, key) => { if (key !== 'content') { commentData[key] = value; } });
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

  render() {
    const {data} = this.props;
    const canEdit = data.can_edit;
    const {editorOpen} = this.state;

    if (!data.content) {
      return null;
    }

    return (<div className="hearing-comment">
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
          <span className="hearing-comment-date"><FormattedRelative value={data.created_at}/></span>
        </div>
      </div>
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
      {canEdit && <div>
        <a
          href=""
          onClick={(event) => this.toggleEditor(event)}
          style={{ paddingRight: 10, borderRight: '1px solid black' }}
        >
          <FormattedMessage id="edit"/>
        </a>
        <a
          href=""
          onClick={(event) => this.handleDelete(event)}
          style={{ paddingLeft: 10 }}
        >
          <FormattedMessage id="delete"/>
        </a>
      </div>
      }
      {editorOpen && <form className="hearing-comment__edit-form" onSubmit={(event) => this.handleSubmit(event)}>
        <FormGroup controlId="formControlsTextarea">
          <textarea
            className="form-control"
            defaultValue={data.content}
            placeholder="textarea"
            ref={(input) => { this.commentEditor = input; }}
          />
        </FormGroup>
        <Button type="submit">Save</Button>
        </form>
      }
    </div>);
  }
}

Comment.propTypes = {
  data: React.PropTypes.object,
  canVote: React.PropTypes.bool,
  onPostVote: React.PropTypes.func,
  onEditComment: React.PropTypes.func,
  onDeleteComment: React.PropTypes.func
};

export default injectIntl(Comment);
