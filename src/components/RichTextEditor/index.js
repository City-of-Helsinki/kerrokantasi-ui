import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  RichUtils,
  convertFromHTML,
  DefaultDraftBlockRenderMap,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Map } from 'immutable';

import { BlockStyleControls, InlineStyleControls } from './EditorControls';

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
};

const kerrokantasiBlockRenderMap = Map({
  unstyled: {
    element: 'p',
  },
  lead: {
    element: 'p'
  }
});

const blockRenderMap = DefaultDraftBlockRenderMap.merge(kerrokantasiBlockRenderMap);

const findEntities = (contentBlock, callback, contentState, entityType) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === entityType
      );
    },
    callback
  );
};

const findLinkEntities = (contentBlock, callback, contentState) => {
  findEntities(contentBlock, callback, contentState, 'LINK');
};

const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url}>
      {props.children}
    </a>
  );
};

Link.propTypes = {
  children: PropTypes.array,
  contentState: PropTypes.object,
  entityKey: PropTypes.string
};

const checkLeadParagraphicity = (contentBlock, callback, contentState) => {
  //findEntities(contentBlock, callback, contentState, 'LEAD');
  // can we get away with just
  return contentBlock.getType() === 'LEAD';
};

const LeadParagraph = (props) => {
  return (
    <p className="lead">
      {props.children}
    </p>
  );
};

LeadParagraph.propTyes = {
  children: PropTypes.array
};

const getLeadParagraphs = (HTML) => {
  // returns an array containing the plain text paragraphs to be rendered as lead
};

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);

    const customDecorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
      {
        strategy: checkLeadParagraphicity,
        component: LeadParagraph,
      },
    ]);
    const createEditorState = () => {
      if (this.props.value) {
        const blocksFromHTML = convertFromHTML(this.props.value);
        // decorate blocksFromHTML entityMap with LEAD type by scanning this.props.value
        for (leadParagraph in getLeadParagraphs(this.props.value)) {
          for (block in blocksFromHTML.contentBlocks) {
            if (block.getText() == leadParagraph) {
              block = new ContentBlock({type: 'LEAD',});
              // TODO: replace block in content blocks
              leadEntity = contentState.createEntity(
                'LEAD',
                'MUTABLE',
                null
              );
              // TODO: add created entity to entityMap
              break;
            };
          };
        };
        const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        return EditorState.createWithContent(contentState, customDecorator);
      }
      return EditorState.createEmpty();
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = this.onChange.bind(this);
    this.onURLChange = this.onURLChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.onTab = this.onTab.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.promptForLink = this.promptForLink.bind(this);
    this.confirmLink = this.confirmLink.bind(this);
    this.onLinkInputKeyDown = this.onLinkInputKeyDown.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.state = {
      editorState: createEditorState(),
      showURLInput: false,
      urlValue: '',
    };
  }

  /* EVENT CONTROLS */
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
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState);
    this.props.onChange(html);
  }

  onURLChange(event) {
    this.setState({ urlValue: event.target.value });
  }

  onBlur() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState);
    this.props.onBlur(html);
  }

  /* HYPERLINK CONTROLS */
  promptForLink(event) {
    event.preventDefault();
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }
      this.setState({
        showURLInput: true,
        urlValue: url,
      }, () => {
        setTimeout(() => this.refs.url.focus(), 0);
      });
    }
  }

  confirmLink(event) {
    event.preventDefault();
    const { editorState, urlValue } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ),
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0);
    });
  }

  onLinkInputKeyDown(event) {
    if (event.which === 13) {
      this.confirmLink(event);
    }
  }

  removeLink(event) {
    event.preventDefault();
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  }

  /* TOGGLE BUTTONS */
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

  toggleLeadParagraph(event) {
    event.preventDefault();
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const location = editorState.getSelection().getStartKey();
    const blockToToggle = contentState.getBlockForKey(location);
    if (!checkLeadParagraphicity(blockToToggle, null, contentState)) {
      const contentStateWithEntity = contentState.createEntity(
        'LEAD',
        'MUTABLE',
        null
      );
    } else {
      contentState.removeLeadToBlock(blockToToggle)
    }
  }

  /* RENDERING */
  renderHyperlinkButton() {
    let urlInput;
    if (this.state.showURLInput) {
      urlInput = (
        <div className="url-input-container">
          <input
            className="url-input"
            ref="url"
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onLinkInputKeyDown}
            onChange={this.onURLChange}
          />
          <span className="RichEditor-styleButton" onMouseDown={this.confirmLink}>
            OK
          </span>
        </div>
      );
    }

    return (
      <div className="hyperlink-button">
        <div>
          <span className="RichEditor-styleButton" onMouseDown={this.promptForLink}>
            Lisää linkki
          </span>
          <span className="RichEditor-styleButton" onMouseDown={this.removeLink}>
            Poista linkki
          </span>
        </div>
        {urlInput}
      </div>
    );
  }

  renderLeadParagraphButton() {
    return (
      <div className="leadParagraph-button">
        <span className="RichEditor-styleButton" onMouseDown={this.toggleLeadParagraph}>
          Korostettu kappale
        </span>
      </div>
    );
  };

  render() {
    const { editorState } = this.state;

    return (
      <div className="rich-text-editor">
        <ControlLabel>
          <FormattedMessage id={this.props.labelId}/>
        </ControlLabel>
        {this.renderLeadParagraphButton()}
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        {this.renderHyperlinkButton()}
        <Editor
          ref="editor"
          blockStyleFn={getBlockStyle}
          blockRenderMap={blockRenderMap}
          editorState={editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          onBlur={this.onBlur}
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
