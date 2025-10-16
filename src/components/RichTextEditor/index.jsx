/* eslint-disable sonarjs/single-char-in-character-classes */
/* eslint-disable sonarjs/concise-regex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl, injectIntl } from 'react-intl';
import {
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  AtomicBlockUtils,
  Modifier,
  SelectionState,
  getDefaultKeyBinding,
} from 'draft-js';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import createFocusPlugin from '@draft-js-plugins/focus';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import '@draft-js-plugins/focus/lib/plugin.css';
import { convertFromHTML } from 'draft-convert';
import { stateToHTML } from 'draft-js-export-html';
import { Map } from 'immutable';
import { IconLinkExternal, IconSize } from 'hds-react';

import {
  BlockStyleControls,
  InlineStyleControls,
  IframeControls,
  SkipLinkControls,
  ImageControls,
} from './EditorControls';
import IframeModal from './Iframe/IframeModal';
import { stripWrappingFigureTags, stripIframeWrapperDivs, addIframeWrapperDivs } from '../../utils/iframeUtils';
import IframeEntity from './Iframe/IframeEntity';
import SkipLinkModal from './SkipLink/SkipLinkModal';
import ImageModal from './Image/ImageModal';
import ImageEntity from './Image/ImageEntity';
import { textEditorHideControlsShape } from '../../types';
import isExternalLink from '../../utils/isExternalLink';

const CLASS_NAME_IMAGE_CAPTION = 'image-caption';

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    case 'LEAD':
      return 'lead';
    case 'ImageCaption':
      return CLASS_NAME_IMAGE_CAPTION;
    default:
      return null;
  }
};

const kerrokantasiBlockRenderMap = Map({
  unstyled: {
    element: 'p',
  },
  atomic: {
    component: IframeEntity,
    editable: false,
  },
});

const blockRenderMap = DefaultDraftBlockRenderMap.merge(kerrokantasiBlockRenderMap);

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
};

const Link = (props) => {
  const { url, id, className, target, title } = props.contentState.getEntity(props.entityKey).getData();
  // use title/rel for id storing because djaft-js doesnt support id field

  const intl = useIntl();

  return (
    <a
      href={url}
      id={id}
      title={title}
      rel={id}
      className={className}
      target={target}
      {...(isExternalLink(url) && {
        'aria-label': `${props.decoratedText} ${intl.formatMessage({
          id: 'linkLeadsToExternal',
        })}`,
      })}
    >
      {props.children} {isExternalLink(url) && <IconLinkExternal size={IconSize.ExtraSmall} />}
    </a>
  );
};

Link.propTypes = {
  children: PropTypes.array,
  contentState: PropTypes.object,
  decoratedText: PropTypes.string,
  entityKey: PropTypes.string,
};

const findIframeEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'IFRAME';
  }, callback);
};

const findImageEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'image';
  }, callback);
};

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const decorator = composeDecorators(focusPlugin.decorator, blockDndPlugin.decorator, resizeablePlugin.decorator);
const imagePlugin = createImagePlugin({ decorator });

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

const plugins = [kerrokantasiPlugins, blockDndPlugin, focusPlugin, resizeablePlugin, imagePlugin];

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.editorRef = createRef();
    this.urlRef = createRef();

    const createEditorState = () => {
      if (this.props.value) {
        // Remove external link icons from HTML before parsing to avoid duplication
        const cleanHtml = this.props.value.replace(
          /<span class="[^"]*hds-icon[^"]*hds-icon--link-external[^"]*"[^>]*><\/span>/gi,
          '',
        );

        const contentState = convertFromHTML({
          htmlToBlock: (nodeName, node) => {
            if (node.className === 'lead') {
              return { type: 'LEAD', data: {} };
            }
            if (node.className === CLASS_NAME_IMAGE_CAPTION) {
              return { type: 'ImageCaption', data: {} };
            }
            if (nodeName === 'iframe') {
              return { type: 'atomic', data: {} };
            }
            if (nodeName === 'img') {
              return { type: 'atomic', data: {} };
            }
            return null;
          },
          htmlToEntity: (nodeName, node, createEntity) => {
            if (nodeName === 'a') {
              const hrefAttribute = node.attributes.getNamedItem('href');
              const href = hrefAttribute ? hrefAttribute.nodeValue : node.href;
              const target = '_self';

              // Extract link text by removing any icon spans from the text content
              let linkText = node.textContent || '';
              // Remove external link icon text if present
              const iconSpans = node.querySelectorAll('span[aria-hidden="true"]');
              iconSpans.forEach((span) => {
                linkText = linkText.replace(span.textContent || '', '').trim();
              });

              return createEntity('LINK', 'MUTABLE', {
                url: href,
                target,
                id: node.id,
                className: node.className,
                title: node.id,
                linkText: linkText,
              });
            }
            if (nodeName === 'iframe') {
              const iframeAttributes = {};
              for (let index = 0; index < node.attributes.length; index += 1) {
                const attribute = node.attributes.item(index);
                iframeAttributes[attribute.name] = attribute.value;
              }
              return createEntity('IFRAME', 'IMMUTABLE', iframeAttributes);
            }
            if (nodeName === 'img') {
              const imageAttributes = {};
              for (let index = 0; index < node.attributes.length; index += 1) {
                const attribute = node.attributes.item(index);
                imageAttributes[attribute.name] = attribute.value;
              }
              return createEntity('image', 'IMMUTABLE', imageAttributes);
            }
            return null;
          },
        })(stripIframeWrapperDivs(cleanHtml));
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
      showImageModal: false,
    };
  }

  getHtmlOptions() {
    const { formatMessage } = this.props.intl;
    const externalLinkMessage = formatMessage({ id: 'linkLeadsToExternal' });

    return {
      blockStyleFn: (block) => {
        if (block.getType() === 'LEAD') {
          return { attributes: { className: 'lead' } };
        }
        if (block.getType() === 'ImageCaption') {
          return { attributes: { className: CLASS_NAME_IMAGE_CAPTION } };
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
        if (entity.getType() === 'LINK') {
          const data = entity.getData();
          const url = data.url || data.href;

          if (isExternalLink(url)) {
            // Extract link text from entity data or use URL as fallback
            const linkText = data.linkText || url || '';
            return {
              element: 'a',
              attributes: {
                class: 'hds-link',
                href: url,
                target: '_self',
                'aria-label': `${linkText} ${externalLinkMessage}`,
                'data-external': 'true',
              },
            };
          }
        }
        return null;
      },
    };
  }

  /* EVENT CONTROLS */
  handleKeyCommand(command) {
    if (command === 'custom-tab') {
      this.onTab();
      return true;
    }
    const { editorState } = this.state;
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
    const html = stateToHTML(contentState, this.getHtmlOptions());

    // link title is used as temp storing place for id attribute
    // convert link titles back into id attributes
    const linkTitleRegex = /(<a[\s\S]*?)(title)(="[\w\W]*?"[\w]*?>)/gi;
    const htmlWithLinkIds = html.replace(linkTitleRegex, '$1id$3');

    // Add external link icons for external links
    const externalLinkRegex = /(<a[^>]*data-external="true"[^>]*>)(.*?)(<\/a>)/gi;
    const htmlWithExternalIcons = htmlWithLinkIds.replace(
      externalLinkRegex,
      '$1$2 <span class="hds-icon icon hds-icon--link-external hds-icon--size-xs vertical-align-small-icon" aria-hidden="true"></span>$3',
    );

    // strip wrapping figure tags from iframe tags for better accessibility
    // and add iframe wrappers which help with iframe screen overflow
    const iframeWithoutFigureWrap = stripWrappingFigureTags(htmlWithExternalIcons);
    this.props.onChange(addIframeWrapperDivs(iframeWithoutFigureWrap));
  }

  onURLChange(event) {
    this.setState({ urlValue: event.target.value });
  }

  onBlur() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState, this.getHtmlOptions());

    // link title is used as temp storing place for id attribute
    // convert link titles back into id attributes
    const linkTitleRegex = /(<a[\s\S]*?)(title)(="[\w\W]*?"[\w]*?>)/gi;
    const htmlWithLinkIds = html.replace(linkTitleRegex, '$1id$3');

    // Add external link icons for external links
    const externalLinkRegex = /(<a[^>]*data-external="true"[^>]*>)(.*?)(<\/a>)/gi;
    const htmlWithExternalIcons = htmlWithLinkIds.replace(
      externalLinkRegex,
      '$1$2 <span class="hds-icon icon hds-icon--link-external hds-icon--size-xs vertical-align-small-icon" aria-hidden="true"></span>$3',
    );

    // strip wrapping figure tags from iframe tags for better accessibility
    // and add iframe wrappers which help with iframe screen overflow
    const iframeWithoutFigureWrap = stripWrappingFigureTags(htmlWithExternalIcons);
    this.props.onBlur(addIframeWrapperDivs(iframeWithoutFigureWrap));
  }

  onLinkInputKeyDown(event) {
    if (event.which === 13) {
      this.confirmLink(event);
    }
  }

  onFocus() {
    this.editorRef.current.focus();
  }

  getPlaceholder() {
    const { formatMessage } = this.props.intl;
    if (this.props.placeholderId) {
      return formatMessage({ id: this.props.placeholderId });
    }
    return '';
  }

  myKeyBindingFn(e) {
    if (e.keyCode === 9) {
      return 'custom-tab';
    }

    return getDefaultKeyBinding(e);
  }

  removeLink(event) {
    event.preventDefault();
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    // If we have a text selection, use it
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
      return;
    }

    // If cursor is just positioned within a link (no selection), find and remove the entire link
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkEntityKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

    if (linkEntityKey) {
      const linkEntity = contentState.getEntity(linkEntityKey);
      if (linkEntity.getType() === 'LINK') {
        // Find the full range of this link entity
        let entityStart = startOffset;
        let entityEnd = startOffset;

        // Find start of entity
        while (entityStart > 0 && blockWithLinkAtBeginning.getEntityAt(entityStart - 1) === linkEntityKey) {
          entityStart--;
        }

        // Find end of entity
        const blockLength = blockWithLinkAtBeginning.getLength();
        while (entityEnd < blockLength && blockWithLinkAtBeginning.getEntityAt(entityEnd) === linkEntityKey) {
          entityEnd++;
        }

        // Create selection for the entire link
        const linkSelection = selection.merge({
          anchorOffset: entityStart,
          focusOffset: entityEnd,
        });

        this.setState({
          editorState: RichUtils.toggleLink(editorState, linkSelection, null),
        });
      }
    }
  }

  openSkipLinkModal(event) {
    event.preventDefault();
    this.setState({ showSkipLinkModal: true });
  }

  closeSkipLinkModal() {
    this.setState({ showSkipLinkModal: false });
  }

  openIframeModal(event) {
    event.preventDefault();
    this.setState({ showIframeModal: true });
  }

  closeIframeModal() {
    this.setState({ showIframeModal: false });
  }

  confirmIframe(iframeValues) {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IFRAME', 'IMMUTABLE', { ...iframeValues });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState(
      {
        // The third parameter here is a space string, not an empty string
        // If you set an empty string, you will get an error: Unknown DraftEntity key: null
        editorState: AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '),
        showIframeModal: false,
      },
      () => {
        setTimeout(() => this.onFocus(), 0);
      },
    );
  }

  confirmImage(imageValues, imageAltText) {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', {
      src: imageValues,
      alt: imageAltText,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState(
      {
        // The third parameter here is a space string, not an empty string
        // If you set an empty string, you will get an error: Unknown DraftEntity key: null
        editorState: AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '),
        showImageModal: false,
      },
      () => {
        setTimeout(() => this.onFocus(), 0);
      },
    );
  }

  openImageModal(event) {
    event.preventDefault();
    this.setState({ showImageModal: true });
  }

  closeImageModal() {
    this.setState({ showImageModal: false });
  }

  /* TOGGLE BUTTONS */
  toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
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
      this.setState(
        {
          showURLInput: true,
          urlValue: url,
        },
        () => {
          setTimeout(() => this.onFocus(), 0);
        },
      );
    }
  }

  confirmLink(event) {
    event.preventDefault();
    const { editorState, urlValue } = this.state;
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    // Get the selected text to use as linkText for aria-label
    const blockWithLinkAtBeginning = contentState.getBlockForKey(selection.getStartKey());
    const linkText = blockWithLinkAtBeginning.getText().slice(selection.getStartOffset(), selection.getEndOffset());

    // Check if we're editing an existing link to preserve its properties
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const blockWithLink = contentState.getBlockForKey(startKey);
    const existingEntityKey = blockWithLink.getEntityAt(startOffset);
    let existingData = {};

    if (existingEntityKey) {
      const existingEntity = contentState.getEntity(existingEntityKey);
      existingData = existingEntity.getData();
    }

    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
      ...existingData, // Preserve existing properties like id, className, title
      url: urlValue,
      linkText: linkText,
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState(
      {
        editorState: RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey),
        showURLInput: false,
        urlValue: '',
      },
      () => {
        setTimeout(() => this.onFocus(), 0);
      },
    );
  }

  confirmSkipLink(linkText, linkOwnId, linkTargetId, linkIsHidden) {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();

    // create link text before adding link
    const selection = editorState.getSelection();
    const newContent = Modifier.insertText(contentState, selection, linkText);

    // convert given targetId into javascirpt focus function
    const hrefValue = `javascript:document.getElementById('${linkTargetId}').focus();`;
    const className = linkIsHidden ? 'hidden-link' : '';
    const newContentWithEntity = newContent.createEntity('LINK', 'MUTABLE', {
      url: hrefValue,
      id: linkOwnId,
      className,
      title: linkOwnId,
    });
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
    const newContentWithLink = Modifier.applyEntity(newContentWithEntity, newSelection, entityKey);
    // create new state with link text
    const withLinkText = EditorState.push(editorState, newContentWithLink, 'insert-characters');
    // move cursor right after the inserted link
    const withProperCursor = EditorState.forceSelection(withLinkText, newContent.getSelectionAfter());

    this.setState({
      editorState: withProperCursor,
      showSkipLinkModal: false,
    });
  }

  /* RENDERING */
  renderHyperlinkButton() {
    let urlInput;
    if (this.state.showURLInput) {
      urlInput = (
        <div className='url-input-container'>
          <input
            className='url-input'
            ref={this.urlRef}
            type='text'
            value={this.state.urlValue}
            onKeyDown={this.onLinkInputKeyDown}
            onChange={this.onURLChange}
          />
          <span className='RichEditor-styleButton' onMouseDown={this.confirmLink}>
            OK
          </span>
        </div>
      );
    }

    return (
      <div className='hyperlink-button'>
        <div>
          <span className='RichEditor-styleButton' onMouseDown={this.promptForLink}>
            Lisää linkki
          </span>
          <span className='RichEditor-styleButton' onMouseDown={this.removeLink}>
            Poista linkki
          </span>
        </div>
        {urlInput}
      </div>
    );
  }

  render() {
    const { editorState } = this.state;
    const {
      hideBlockStyleControls,
      hideInlineStyleControls,
      hideIframeControls,
      hideImageControls,
      hideSkipLinkControls,
      hideLinkControls,
    } = this.props.hideControls;
    return (
      <div className='rich-text-editor'>
        <label className='form-label' htmlFor='rich-text-editor-input'>
          <FormattedMessage id={this.props.labelId} />
        </label>
        {!hideBlockStyleControls && <BlockStyleControls editorState={editorState} onToggle={this.toggleBlockType} />}
        {!hideInlineStyleControls && (
          <InlineStyleControls editorState={editorState} onToggle={this.toggleInlineStyle} />
        )}
        {!hideIframeControls && (
          <>
            <IframeControls onClick={this.openIframeModal} />
            <IframeModal
              isOpen={this.state.showIframeModal}
              onClose={this.closeIframeModal}
              onSubmit={this.confirmIframe}
            />
          </>
        )}
        {!hideImageControls && (
          <>
            <ImageControls onClick={this.openImageModal} />
            <ImageModal
              isOpen={this.state.showImageModal}
              onClose={this.closeImageModal}
              onSubmit={this.confirmImage}
            />
          </>
        )}
        {!hideSkipLinkControls && (
          <>
            <SkipLinkControls onClick={this.openSkipLinkModal} />
            <SkipLinkModal
              isOpen={this.state.showSkipLinkModal}
              onClose={this.closeSkipLinkModal}
              onSubmit={this.confirmSkipLink}
            />
          </>
        )}
        {!hideLinkControls && this.renderHyperlinkButton()}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <div onClick={this.onFocus}>
          <Editor
            id='rich-text-editor-input'
            plugins={plugins}
            blockStyleFn={getBlockStyle}
            blockRenderMap={blockRenderMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onBlur={this.onBlur}
            keyBindingFn={this.myKeyBindingFn}
            stripPastedStyles
            placeholder={this.getPlaceholder()}
            ref={this.editorRef}
          />
        </div>
      </div>
    );
  }
}

RichTextEditor.defaultProps = {
  hideControls: {
    hideBlockStyleControls: false,
    hideInlineStyleControls: false,
    hideIframeControls: false,
    hideImageControls: false,
    hideSkipLinkControls: false,
    hideLinkControls: false,
  },
};

RichTextEditor.propTypes = {
  hideControls: textEditorHideControlsShape,
  labelId: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  formatMessage: PropTypes.func,
  placeholderId: PropTypes.string,
  intl: PropTypes.object,
};

export default injectIntl(RichTextEditor);
