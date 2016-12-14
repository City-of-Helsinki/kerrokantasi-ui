import React from 'react';
import {intlShape, FormattedMessage} from 'react-intl';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Icon from '../utils/Icon';
import {getImageAsBase64Promise} from '../utils/hearing';
import CommentDisclaimer from './CommentDisclaimer';
import forEach from 'lodash/forEach';
import round from 'lodash/round';

class BaseCommentForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {collapsed: true, commentText: "", nickname: "", imageTooBig: false};
    this.imageTooBig = this.imageTooBig.bind(this);
    this.getSelectedImagesAsArray = this.getSelectedImagesAsArray.bind(this);
  }

  componentDidMount() {
    const store = this.context.store;
    if (store) {
      /*
      This is slightly dark magic that sidesteps the usual rules of
      Redux componentry, but I sincerely believe this is for the better.
      (The alternative would be to store the comment text in the global
       store, which seems very unnecessary, plus the cleanup of having to
       remember to empty the comment text from the global store when the user
       "leaves" the hearing view for another seems even more cumbersome.)

      Basically, this component subscribes to the state of the global store
      but ONLY to notice when the "postedComment" action has been dispatched,
      so it can modify its local state to clear the comment text.
      */
      this.unsubscribe = store.subscribe(() => {
        if (store.getState().lastActionType === "postedComment") {
          this.clearCommentText();
          this.toggle();
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
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
    let nickname = (this.state.nickname === "" ? null : this.state.nickname);
    let commentText = (this.state.commentText === null ? '' : this.state.commentText);
    let geojson = null;
    let label = null;
    const imagePromisesArray = [];
    const images = [];

    for (let i = 0; i < this.refs.images.files.length; i += 1) {
      imagePromisesArray.push(getImageAsBase64Promise(this.refs.images.files[i]));
    }

    Promise.all(imagePromisesArray).then((arrayOfResults) => {
      for (let i = 0; i < this.refs.images.files.length; i += 1) {
        const imageObject = {title: "Title", caption: "Caption"};

        imageObject.image = arrayOfResults[i];
        images.push(imageObject);
      }

      // plugin comment will override comment fields, if provided
      if (pluginComment) {
        commentText = pluginComment.content || commentText;
        nickname = pluginComment.author_name || nickname;
        pluginData = pluginComment.plugin_data || pluginData;
        label = pluginComment.label || null;
        geojson = pluginComment.geojson || null;
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
        images
      );
    });
  }

  getPluginData() {  // eslint-disable-line class-methods-use-this
    return undefined;
  }

  getPluginComment() {  // eslint-disable-line class-methods-use-this
    return undefined;
  }

  getSelectedImagesAsArray(files) { // eslint-disable-line class-methods-use-this
    const imagesArray = [];
    for (let i = 0; i < files.length; i += 1) {
      imagesArray.push(files[i]);
    }
    return imagesArray;
  }

  imageTooBig(images) { // eslint-disable-line class-methods-use-this
    let isImageTooBig = false;

    forEach(images, (image) => { // eslint-disable-line consistent-return
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

  render() {
    const canSetNickname = this.props.canSetNickname;
    if (!this.state.collapsed) {
      return (<div className="comment-form">
        <form>
          <h3><FormattedMessage id="writeComment"/></h3>
          <FormControl
            componentClass="textarea"
            value={this.state.commentText}
            onChange={this.handleTextChange.bind(this)}
          />
          <FormGroup className="comment-form__file">
            <ControlLabel><FormattedMessage id="add_images"/></ControlLabel>
            <div className="comment-form__select-button">
              <label className="btn btn-default btn-sm" htmlFor="fileInput">
                <FormattedMessage id="choose_images"/>
              </label>
              <input
                 type="file"
                 ref="images"
                 id="fileInput"
                 multiple
                 style={{display: 'none', visibility: 'hidden'}}
                 onChange={(e) => this.imageTooBig(e.target.files)}
              />
              <div className="comment-form__selected-images">
                {this.state.imageTooBig
                  ? <div className="comment-form__image-too-big">
                    <FormattedMessage id="image_too_big"/>
                  </div>
                  : null}
                {this.refs.images
                  ? this.getSelectedImagesAsArray(this.refs.images.files).map(
                      (image) =>
                        <p style={image.size > 1000000 ? {color: 'red'} : null}>
                          {image.name} {round((image.size / 1000000), 3) + 'MB'}
                        </p>)
                  : null}
              </div>
            </div>
          </FormGroup>
          {canSetNickname ? <h3><FormattedMessage id="nickname"/></h3> : null}
          {canSetNickname ? (
            <FormGroup>
              <FormControl
                type="text"
                placeholder={this.props.intl.formatMessage({id: "anonymous"})}
                value={this.state.nickname}
                onChange={this.handleNicknameChange.bind(this)}
                maxLength={32}
              />
            </FormGroup>
          ) : null}
          <div className="comment-buttons clearfix">
            <Button bsStyle="warning" onClick={this.toggle.bind(this)}>
              <FormattedMessage id="cancel"/>
            </Button>
            <Button
              bsStyle="primary"
              disabled={!this.state.commentText || this.state.imageTooBig}
              className="pull-right"
              onClick={this.submitComment.bind(this)}
            >
              <FormattedMessage id="submit"/>
            </Button>
          </div>
          <CommentDisclaimer/>
        </form>
      </div>);
    }
    return (<Button onClick={this.toggle.bind(this)} bsStyle="primary">
      <Icon name="comment"/> <FormattedMessage id="addComment"/>
    </Button>);
  }
}

BaseCommentForm.propTypes = {
  onPostComment: React.PropTypes.func,
  intl: intlShape.isRequired,
  canSetNickname: React.PropTypes.bool,
};

BaseCommentForm.contextTypes = {
  store: React.PropTypes.object,  // See `componentDidMount`.
};

export default BaseCommentForm;
