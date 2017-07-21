import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertFromHTML,
  convertToRaw
} from 'draft-js';

import { BlockStyleControls, InlineStyleControls } from './EditorControls';

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
};

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);

    const createEditorState = () => {
      if (this.props.value) {
        const blocksFromHTML = convertFromHTML(this.props.value);
        const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        return EditorState.createWithContent(contentState);
      }
      return EditorState.createEmpty();
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = this.onChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.onTab = this.onTab.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.state = {
      editorState: createEditorState()
    };
  }

  handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  onTab(event) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(event, this.state.editorState, maxDepth));
  }

  onChange(editorState) {
    this.setState({ editorState });
    const rawContent = convertToRaw(editorState.getCurrentContent());
    this.props.onChange(rawContent);
  }

  toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const { editorState } = this.state;

    return (
      <div className="rich-text-editor">
        <ControlLabel>
          <FormattedMessage id={this.props.labelId}/>
        </ControlLabel>
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <Editor
          ref="editor"
          blockStyleFn={getBlockStyle}
          editorState={editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          onBlur={this.props.onBlur}
          onTab={this.onTab}
        />
      </div>
    );
  }
}

RichTextEditor.propTypes = {
  labelId: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default RichTextEditor;
