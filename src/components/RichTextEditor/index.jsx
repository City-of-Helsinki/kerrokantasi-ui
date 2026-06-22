/* eslint-disable sonarjs/single-char-in-character-classes */
/* eslint-disable sonarjs/concise-regex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  AtomicBlockUtils,
  Modifier,
  SelectionState,
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
import {
  stripWrappingFigureTags,
  stripIframeWrapperDivs,
  addIframeWrapperDivs,
} from '../../utils/iframeUtils';
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
  atomic: {
    component: IframeEntity,
    editable: false,
  },
});

const blockRenderMap = DefaultDraftBlockRenderMap.merge(
  kerrokantasiBlockRenderMap
);

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
};

const Link = (props) => {
  const { url, id, className, target, title } = props.contentState
    .getEntity(props.entityKey)
    .getData();
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
      {props.children}{' '}
      {isExternalLink(url) && <IconLinkExternal size={IconSize.ExtraSmall} />}
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
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'IFRAME'
    );
  }, callback);
};

const findImageEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'image'
    );
  }, callback);
};

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const decorator = composeDecorators(
  focusPlugin.decorator,
  blockDndPlugin.decorator,
  resizeablePlugin.decorator
);
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

const plugins = [
  kerrokantasiPlugins,
  blockDndPlugin,
  focusPlugin,
  resizeablePlugin,
  imagePlugin,
];

const DEFAULT_HIDE_CONTROLS = {
  hideBlockStyleControls: false,
  hideInlineStyleControls: false,
  hideIframeControls: false,
  hideImageControls: false,
  hideSkipLinkControls: false,
  hideLinkControls: false,
};

function RichTextEditor({
  hideControls = DEFAULT_HIDE_CONTROLS,
  labelId,
  onBlur,
  onChange,
  value,
  placeholderId,
}) {
  const intl = useIntl();
  const editorRef = useRef(null);
  const urlRef = useRef(null);

  const createEditorState = () => {
    if (value) {
      // Remove external link icons from HTML before parsing to avoid duplication
      const cleanHtml = value.replace(
        /<span class="[^"]*hds-icon[^"]*hds-icon--link-external[^"]*"[^>]*><\/span>/gi,
        ''
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

  const [editorState, setEditorState] = useState(() => createEditorState());
  const [showURLInput, setShowURLInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [showSkipLinkModal, setShowSkipLinkModal] = useState(false);
  const [showIframeModal, setShowIframeModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const getHtmlOptions = () => {
    const externalLinkMessage = intl.formatMessage({
      id: 'linkLeadsToExternal',
    });

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
  };

  const buildHtml = (state) => {
    const contentState = state.getCurrentContent();
    const html = stateToHTML(contentState, getHtmlOptions());

    // link title is used as temp storing place for id attribute
    // convert link titles back into id attributes
    const linkTitleRegex = /(<a[\s\S]*?)(title)(="[\w\W]*?"[\w]*?>)/gi;
    const htmlWithLinkIds = html.replace(linkTitleRegex, '$1id$3');

    // Add external link icons for external links
    const externalLinkRegex =
      /(<a[^>]*data-external="true"[^>]*>)(.*?)(<\/a>)/gi;
    const htmlWithExternalIcons = htmlWithLinkIds.replace(
      externalLinkRegex,
      '$1$2 <span class="hds-icon hds-icon--link-external ' +
        'hds-icon--size-xs" aria-hidden="true"></span>$3'
    );

    // strip wrapping figure tags from iframe tags for better accessibility
    // and add iframe wrappers which help with iframe screen overflow
    return addIframeWrapperDivs(stripWrappingFigureTags(htmlWithExternalIcons));
  };

  /* EVENT CONTROLS */
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return true;
    }
    return false;
  };

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
    onChange(buildHtml(newEditorState));
  };

  const handleBlur = () => {
    onBlur(buildHtml(editorState));
  };

  const handleURLChange = (event) => {
    setUrlValue(event.target.value);
  };

  const onLinkInputKeyDown = (event) => {
    if (event.which === 13) {
      confirmLink(event);
    }
  };

  const onFocus = () => {
    editorRef.current.focus();
  };

  const getPlaceholder = () => {
    if (placeholderId) {
      return intl.formatMessage({ id: placeholderId });
    }
    return '';
  };

  const removeLink = (event) => {
    event.preventDefault();
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    // If we have a text selection, use it
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
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
        while (
          entityStart > 0 &&
          blockWithLinkAtBeginning.getEntityAt(entityStart - 1) ===
            linkEntityKey
        ) {
          entityStart--;
        }

        // Find end of entity
        const blockLength = blockWithLinkAtBeginning.getLength();
        while (
          entityEnd < blockLength &&
          blockWithLinkAtBeginning.getEntityAt(entityEnd) === linkEntityKey
        ) {
          entityEnd++;
        }

        // Create selection for the entire link
        const linkSelection = selection.merge({
          anchorOffset: entityStart,
          focusOffset: entityEnd,
        });

        setEditorState(RichUtils.toggleLink(editorState, linkSelection, null));
      }
    }
  };

  const openSkipLinkModal = (event) => {
    event.preventDefault();
    setShowSkipLinkModal(true);
  };

  const closeSkipLinkModal = () => setShowSkipLinkModal(false);

  const openIframeModal = (event) => {
    event.preventDefault();
    setShowIframeModal(true);
  };

  const closeIframeModal = () => setShowIframeModal(false);

  const confirmIframe = (iframeValues) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'IFRAME',
      'IMMUTABLE',
      { ...iframeValues }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      // The third parameter here is a space string, not an empty string
      // If you set an empty string, you will get an error: Unknown DraftEntity key: null
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
    );
    setShowIframeModal(false);
    setTimeout(() => onFocus(), 0);
  };

  const confirmImage = (imageValues, imageAltText) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      {
        src: imageValues,
        alt: imageAltText,
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      // The third parameter here is a space string, not an empty string
      // If you set an empty string, you will get an error: Unknown DraftEntity key: null
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
    );
    setShowImageModal(false);
    setTimeout(() => onFocus(), 0);
  };

  const openImageModal = (event) => {
    event.preventDefault();
    setShowImageModal(true);
  };

  const closeImageModal = () => setShowImageModal(false);

  /* TOGGLE BUTTONS */
  const toggleBlockType = (blockType) => {
    handleChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    handleChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  /* HYPERLINK CONTROLS */
  const promptForLink = (event) => {
    event.preventDefault();
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
      setShowURLInput(true);
      setUrlValue(url);
      setTimeout(() => urlRef.current?.focus(), 0);
    }
  };

  const confirmLink = (event) => {
    event.preventDefault();
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    // Get the selected text to use as linkText for aria-label
    const blockWithLinkAtBeginning = contentState.getBlockForKey(
      selection.getStartKey()
    );
    const linkText = blockWithLinkAtBeginning
      .getText()
      .slice(selection.getStartOffset(), selection.getEndOffset());

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

    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {
        ...existingData, // Preserve existing properties like id, className, title
        url: urlValue,
        linkText: linkText,
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
    setShowURLInput(false);
    setUrlValue('');
    setTimeout(() => onFocus(), 0);
  };

  const confirmSkipLink = (linkText, linkOwnId, linkTargetId, linkIsHidden) => {
    const contentState = editorState.getCurrentContent();

    // create link text before adding link
    const selection = editorState.getSelection();
    const newContent = Modifier.insertText(contentState, selection, linkText);

    // Use a normal fragment link for skip navigation to avoid javascript: URLs.
    const hrefValue = `#${linkTargetId}`;
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
    const newContentWithLink = Modifier.applyEntity(
      newContentWithEntity,
      newSelection,
      entityKey
    );
    // create new state with link text
    const withLinkText = EditorState.push(
      editorState,
      newContentWithLink,
      'insert-characters'
    );
    // move cursor right after the inserted link
    const withProperCursor = EditorState.forceSelection(
      withLinkText,
      newContent.getSelectionAfter()
    );

    setEditorState(withProperCursor);
    setShowSkipLinkModal(false);
  };

  /* RENDERING */
  const {
    hideBlockStyleControls,
    hideInlineStyleControls,
    hideIframeControls,
    hideImageControls,
    hideSkipLinkControls,
    hideLinkControls,
  } = hideControls;

  const urlInput = showURLInput ? (
    <div className='url-input-container'>
      <input
        className='url-input'
        ref={urlRef}
        type='text'
        value={urlValue}
        onKeyDown={onLinkInputKeyDown}
        onChange={handleURLChange}
      />
      <span className='RichEditor-styleButton' onMouseDown={confirmLink}>
        OK
      </span>
    </div>
  ) : null;

  return (
    <div className='rich-text-editor'>
      <label className='form-label' htmlFor='rich-text-editor-input'>
        <FormattedMessage id={labelId} />
      </label>
      {!hideBlockStyleControls && (
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
      )}
      {!hideInlineStyleControls && (
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      )}
      {!hideIframeControls && (
        <>
          <IframeControls onClick={openIframeModal} />
          <IframeModal
            isOpen={showIframeModal}
            onClose={closeIframeModal}
            onSubmit={confirmIframe}
          />
        </>
      )}
      {!hideImageControls && (
        <>
          <ImageControls onClick={openImageModal} />
          <ImageModal
            isOpen={showImageModal}
            onClose={closeImageModal}
            onSubmit={confirmImage}
          />
        </>
      )}
      {!hideSkipLinkControls && (
        <>
          <SkipLinkControls onClick={openSkipLinkModal} />
          <SkipLinkModal
            isOpen={showSkipLinkModal}
            onClose={closeSkipLinkModal}
            onSubmit={confirmSkipLink}
          />
        </>
      )}
      {!hideLinkControls && (
        <div className='hyperlink-button'>
          <div>
            <span
              className='RichEditor-styleButton'
              onMouseDown={promptForLink}
            >
              Lisää linkki
            </span>
            <span className='RichEditor-styleButton' onMouseDown={removeLink}>
              Poista linkki
            </span>
          </div>
          {urlInput}
        </div>
      )}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div onClick={onFocus}>
        <Editor
          id='rich-text-editor-input'
          plugins={plugins}
          blockStyleFn={getBlockStyle}
          blockRenderMap={blockRenderMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={handleChange}
          onBlur={handleBlur}
          stripPastedStyles
          placeholder={getPlaceholder()}
          ref={editorRef}
        />
      </div>
    </div>
  );
}

RichTextEditor.propTypes = {
  hideControls: textEditorHideControlsShape,
  labelId: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  placeholderId: PropTypes.string,
};

export default RichTextEditor;
