import Button from 'react-bootstrap/lib/Button';
import {MapdonHKRPlugin} from './mapdon-hkr';
import CommentDisclaimer from "../CommentDisclaimer";
import Input from 'react-bootstrap/lib/Input';
import React from 'react';
import {injectIntl} from 'react-intl';


class MapdonKSVPlugin extends MapdonHKRPlugin {
  constructor(props) {
    super(props);
    this.pluginInstanceId = "ksv" + (0 | (Math.random() * 10000000));
    if ('canComment' in props) {
      this.canComment = props.canComment;
    } else {
      // the default behavior allows commenting
      this.canComment = true;
    }
  }

  render() {
    const buttonDisabled = (this.submitting);
    const commentBox = (
      <div>
        <br/>
        <Input
          type="textarea"
          onChange={this.handleTextChange.bind(this)}
          placeholder="Kommentoi ehdotustasi tässä."
        />
        <p>
          <Button bsStyle="primary" onClick={this.getDataAndSubmitComment.bind(this)} disabled={buttonDisabled}>
            Lähetä ehdotus
          </Button>
        </p>
        <CommentDisclaimer/>
      </div>
    );
    return (
      <div className="plugin-comment-form mapdon-ksv-plugin-comment-form">
        <form>
          <iframe
            src="/assets/mapdon-ksv/plugin-inlined.html"
            className="plugin-frame mapdon-ksv-plugin-frame"
            ref="frame"
          ></iframe>
          {this.canComment ? commentBox : null}
        </form>
      </div>
    );
  }
}

MapdonKSVPlugin.propTypes = {
  onPostComment: React.PropTypes.func,
  data: React.PropTypes.string,
  canComment: React.PropTypes.bool,
  comments: React.PropTypes.object
};

export default injectIntl(MapdonKSVPlugin);
