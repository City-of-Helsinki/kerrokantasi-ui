import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import {
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  AtomicBlockUtils,
  Modifier,
  SelectionState,
} from 'draft-js';
import Editor, { composeDecorators } from "@draft-js-plugins/editor";
import createImagePlugin from "@draft-js-plugins/image";
import createFocusPlugin from "@draft-js-plugins/focus";
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createResizeablePlugin from '@draft-js-plugins/resizeable'
import '@draft-js-plugins/focus/lib/plugin.css';
import { convertFromHTML } from 'draft-convert';
import { stateToHTML } from 'draft-js-export-html';
import { Map } from 'immutable';

import { BlockStyleControls, InlineStyleControls, IframeControls, SkipLinkControls, ImageControls } from './EditorControls';
import IframeModal from './Iframe/IframeModal';
import {stripWrappingFigureTags, stripIframeWrapperDivs, addIframeWrapperDivs} from './Iframe/IframeUtils';
import IframeEntity from './Iframe/IframeEntity';
import SkipLinkModal from './SkipLink/SkipLinkModal';
import ImageModal from './Image/ImageModal';
import ImageEntity from './Image/ImageEntity';

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
  const { url, id, className, target, title } = props.contentState.getEntity(props.entityKey).getData();
  // use title/rel for id storing because djaft-js doesnt support id field
  return (
    <a href={url} id={id} title={title} rel={id} className={className} target={target}>
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

const findImageEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'image'
      );
    },
    callback
  );
};

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const decorator = composeDecorators(
  focusPlugin.decorator,
  blockDndPlugin.decorator,
  resizeablePlugin.decorator
);
const imagePlugin = createImagePlugin({decorator});

const kerrokantasiPlugins = {
  decorators: [
    {
      strategy: findLinkEntities,
      component: Link,
    },
    {
      strategy: findIframeEntities,
      component: IframeEntity,
    },
    {
      strategy: findImageEntities,
      component: ImageEntity,
    },
  ],
};

const plugins = [ kerrokantasiPlugins, blockDndPlugin, focusPlugin, resizeablePlugin, imagePlugin ];

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);

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
            if (nodeName === 'img') {
              return {type: 'atomic', data: {}};
            }
            return null;
          },
          htmlToEntity: (nodeName, node, createEntity) => {
            if (nodeName === 'a') {
              const hrefAttribute = node.attributes.getNamedItem("href");
              const href = hrefAttribute ? hrefAttribute.nodeValue : node.href;
              const target = (href && (href[0] === '#'
                // eslint-disable-next-line no-script-url
                || href.includes("javascript:document.getElementById"))) ? '_self' : '_blank';
              return createEntity(
                'LINK',
                'MUTABLE',
                {url: href, target, id: node.id, className: node.className, title: node.id}
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
            if (nodeName === 'img') {
              const imageAttributes = {};
              for (let index = 0; index < node.attributes.length; index += 1) {
                const attribute = node.attributes.item(index);
                imageAttributes[attribute.name] = attribute.value;
              }
              return createEntity(
                'image',
                'IMMUTABLE',
                imageAttributes
              );
            }
            return null;
          },
        })(stripIframeWrapperDivs(this.props.value));
        return EditorState.createWithContent(contentState);
      }
      return EditorState.createEmpty();
    };

    this.onFocus = this.onFocus.bind(this);
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
    this.openSkipLinkModal = this.openSkipLinkModal.bind(this);
    this.closeSkipLinkModal = this.closeSkipLinkModal.bind(this);
    this.confirmSkipLink = this.confirmSkipLink.bind(this);
    this.openIframeModal = this.openIframeModal.bind(this);
    this.closeIframeModal = this.closeIframeModal.bind(this);
    this.confirmIframe = this.confirmIframe.bind(this);
    this.openImageModal = this.openImageModal.bind(this);
    this.closeImageModal = this.closeImageModal.bind(this);
    this.confirmImage = this.confirmImage.bind(this);
    this.state = {
      editorState: createEditorState(),
      showURLInput: false,
      urlValue: '',
      showSkipLinkModal: false,
      showIframeModal: false,
      showImageModal: false
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

    // link title is used as temp storing place for id attribute
    // convert link titles back into id attributes
    const linkTitleRegex = /(<a[\s\S]*?)(title)(="[\w\W]*?"[\w]*?>)/gi;
    const htmlWithLinkIds = html.replace(linkTitleRegex, '$1id$3');
    // strip wrapping figure tags from iframe tags for better accessibility
    // and add iframe wrappers which help with iframe screen overflow
    const iframeWithoutFigureWrap = stripWrappingFigureTags(htmlWithLinkIds);
    this.props.onChange(addIframeWrapperDivs(iframeWithoutFigureWrap));
  }

  onURLChange(event) {
    this.setState({ urlValue: event.target.value });
  }

  onBlur() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState, htmlOptions);

    // link title is used as temp storing place for id attribute
    // convert link titles back into id attributes
    const linkTitleRegex = /(<a[\s\S]*?)(title)(="[\w\W]*?"[\w]*?>)/gi;
    const htmlWithLinkIds = html.replace(linkTitleRegex, '$1id$3');
    // strip wrapping figure tags from iframe tags for better accessibility
    // and add iframe wrappers which help with iframe screen overflow
    const iframeWithoutFigureWrap = stripWrappingFigureTags(htmlWithLinkIds);
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
        setTimeout(() => this.onFocus(), 0)
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
      setTimeout(() => this.onFocus(), 0)
    });
  }

  confirmSkipLink(linkText, linkOwnId, linkTargetId, linkIsHidden) {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();

    // create link text before adding link
    const selection = editorState.getSelection();
    const newContent = Modifier.insertText(
      contentState,
      selection,
      linkText,
    );

    // convert given targetId into javascirpt focus function
    const hrefValue = `javascript:document.getElementById('${linkTargetId}').focus();`;
    const className = linkIsHidden ? "hidden-link" : "";
    const newContentWithEntity = newContent.createEntity(
      'LINK',
      'MUTABLE',
      { url: hrefValue, target: '_self', id: linkOwnId, className, title: linkOwnId }
    );
    const entityKey = newContentWithEntity.getLastCreatedEntityKey();
    // create new selection with the inserted text
    const anchorOffset = selection.getAnchorOffset();
    const newSelection = new SelectionState({
      anchorKey: selection.getAnchorKey(),
      anchorOffset,
      focusKey: selection.getAnchorKey(),
      focusOffset: anchorOffset + linkText.length,
    });
    // apply link entity to the inserted text
    const newContentWithLink = Modifier.applyEntity(
      newContentWithEntity,
      newSelection,
      entityKey,
    );
    // create new state with link text
    const withLinkText = EditorState.push(
      editorState,
      newContentWithLink,
      'insert-characters',
    );
    // move cursor right after the inserted link
    const withProperCursor = EditorState.forceSelection(
      withLinkText,
      newContent.getSelectionAfter(),
    );

    this.setState({
      editorState: withProperCursor,
      showSkipLinkModal: false,
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

  openSkipLinkModal(event) {
    event.preventDefault();
    this.setState({showSkipLinkModal: true});
  }

  closeSkipLinkModal() {
    this.setState({showSkipLinkModal: false});
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
      setTimeout(() => this.onFocus(), 0);
    });
  }

  confirmImage(imageValues) {
    const {editorState} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      { src: imageValues }
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
      showImageModal: false,
    }, () => {
      setTimeout(() => this.onFocus(), 0);
    });
  }

  openImageModal(event) {
    event.preventDefault();
    this.setState({showImageModal: true});
  }

  closeImageModal() {
    this.setState({showImageModal: false});
  }

  onFocus() {
    this.refs.editor.focus();
  };

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
        <ImageControls
          onClick={this.openImageModal}
        />
        <ImageModal
          isOpen={this.state.showImageModal}
          onClose={this.closeImageModal}
          onSubmit={this.confirmImage}
        />
        <SkipLinkControls
          onClick={this.openSkipLinkModal}
        />
        <SkipLinkModal
          isOpen={this.state.showSkipLinkModal}
          onClose={this.closeSkipLinkModal}
          onSubmit={this.confirmSkipLink}
        />
        {this.renderHyperlinkButton()}
        <div onClick={this.onFocus}>
          <Editor
            plugins={plugins}
            blockStyleFn={getBlockStyle}
            blockRenderMap={blockRenderMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onTab={this.onTab}
            stripPastedStyles
            placeholder={this.getPlaceholder()}
            ref={"editor"}
          />
        </div>
      </div>
    );
  }
}

RichTextEditor.propTypes = {
  labelId: PropTypes.string,
  dispatch: PropTypes.func,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  formatMessage: PropTypes.func,
  placeholderId: PropTypes.string,
  intl: intlShape.isRequired
};

const WrappedRichTextEditor = connect((state) => ({
  ...state
}))(RichTextEditor);

export default WrappedRichTextEditor;
