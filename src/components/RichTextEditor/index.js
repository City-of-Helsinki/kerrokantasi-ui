import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import {
  Editor,
  EditorState,
  CompositeDecorator,
  RichUtils,
  DefaultDraftBlockRenderMap,
  AtomicBlockUtils,
} from 'draft-js';
import { convertFromHTML } from 'draft-convert';
import { stateToHTML } from 'draft-js-export-html';
import { Map } from 'immutable';

import { BlockStyleControls, InlineStyleControls, IframeControls } from './EditorControls';
import IframeModal from './Iframe/IframeModal';
import {stripWrappingFigureTags, stripIframeWrapperDivs, addIframeWrapperDivs} from './Iframe/IframeUtils';
import IframeEntity from './Iframe/IframeEntity';

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    case 'LEAD': return 'lead';
    default: return null;
  }
};

const kerrokantasiBlockRenderMap = Map({
  unstyled: {
    element: 'p',
  },
  atomic: {
    component: IframeEntity,
    editable: false,
  }
});

const htmlOptions = {
  blockStyleFn: (block) => {
    if (block.getType() === 'LEAD') {
      return {attributes: {className: 'lead'}};
    }
    return null;
  },
  entityStyleFn: (entity) => {
    if (entity.getType() === 'IFRAME') {
      const data = entity.getData();
      return {
        element: 'iframe',
        attributes: data,
      };
    }
    return null;
  },
};

const blockRenderMap = DefaultDraftBlockRenderMap.merge(kerrokantasiBlockRenderMap);

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
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

const findIframeEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'IFRAME'
      );
    },
    callback
  );
};

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);

    const kerrokantasiDecorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
      {
        strategy: findIframeEntities,
        component: IframeEntity,
      },
    ]);

    const createEditorState = () => {
      if (this.props.value) {
        const contentState = convertFromHTML({
          htmlToBlock: (nodeName, node) => {
            if (node.className === 'lead') {
              return {type: 'LEAD', data: {}};
            }
            if (nodeName === 'iframe') {
              return {type: 'atomic', data: {}};
            }
            return null;
          },
          htmlToEntity: (nodeName, node, createEntity) => {
            if (nodeName === 'a') {
              return createEntity(
                'LINK',
                'MUTABLE',
                {url: node.href, target: '_blank'}
              );
            }
            if (nodeName === 'iframe') {
              const iframeAttributes = {};
              for (let index = 0; index < node.attributes.length; index += 1) {
                const attribute = node.attributes.item(index);
                iframeAttributes[attribute.name] = attribute.value;
              }
              return createEntity(
                'IFRAME',
                'IMMUTABLE',
                iframeAttributes
              );
            }
            return null;
          },
        })(stripIframeWrapperDivs(this.props.value));
        return EditorState.createWithContent(contentState, kerrokantasiDecorator);
      }
      return EditorState.createEmpty(kerrokantasiDecorator);
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
    this.openIframeModal = this.openIframeModal.bind(this);
    this.closeIframeModal = this.closeIframeModal.bind(this);
    this.confirmIframe = this.confirmIframe.bind(this);
    this.state = {
      editorState: createEditorState(),
      showURLInput: false,
      urlValue: '',
      showIframeModal: false,
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
    const html = stateToHTML(contentState, htmlOptions);
    // strip wrapping figure tags from iframe tags for better accessibility
    // and add iframe wrappers which help with iframe screen overflow
    const iframeWithoutFigureWrap = stripWrappingFigureTags(html);
    this.props.onChange(addIframeWrapperDivs(iframeWithoutFigureWrap));
  }

  onURLChange(event) {
    this.setState({ urlValue: event.target.value });
  }

  onBlur() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState, htmlOptions);
    // strip wrapping figure tags from iframe tags for better accessibility
    // and add iframe wrappers which help with iframe screen overflow
    const iframeWithoutFigureWrap = stripWrappingFigureTags(html);
    this.props.onBlur(addIframeWrapperDivs(iframeWithoutFigureWrap));
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
      { url: urlValue, target: '_blank' }
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

  openIframeModal(event) {
    event.preventDefault();
    this.setState({showIframeModal: true});
  }

  closeIframeModal() {
    this.setState({showIframeModal: false});
  }

  confirmIframe(iframeValues) {
    const {editorState} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'IFRAME',
      'IMMUTABLE',
      {...iframeValues}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );
    this.setState({
      // The third parameter here is a space string, not an empty string
      // If you set an empty string, you will get an error: Unknown DraftEntity key: null
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      ),
      showIframeModal: false,
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
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

  getPlaceholder() {
    const {formatMessage} = this.props.intl;
    if (this.props.placeholderId) {
      return formatMessage({id: this.props.placeholderId});
    }
    return "";
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
        <IframeControls
          onClick={this.openIframeModal}
        />
        <IframeModal
          isOpen={this.state.showIframeModal}
          onClose={this.closeIframeModal}
          onSubmit={this.confirmIframe}
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
          placeholder={this.getPlaceholder()}
        />
      </div>
    );
  }
}

RichTextEditor.propTypes = {
  labelId: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  formatMessage: PropTypes.func,
  placeholderId: PropTypes.string,
  intl: intlShape.isRequired
};

export default RichTextEditor;
