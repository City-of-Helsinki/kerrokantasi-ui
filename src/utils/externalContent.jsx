import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import React from 'react';

/**
 * Extracts all iframes from HTML string that have a src attribute.
 * Empty iframes are ignored as they don't need consent handling.
 * @param {string} htmlString - HTML content
 * @returns {HTMLIFrameElement[]} Array of iframe elements with src attribute
 */
export const extractIframes = (htmlString) => {
  if (!htmlString) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const iframes = Array.from(doc.querySelectorAll('iframe'));
  // Only return iframes that have a src attribute
  return iframes.filter(iframe => iframe.getAttribute('src')?.trim());
};

/**
 * Sanitizes HTML and returns parsed React elements
 * @param {string} html - HTML content to sanitize
 * @param {boolean} allowIframes - Whether to preserve iframe tags
 * @returns {React.ReactNode} Sanitized and parsed React elements
 */
export const sanitizeHtml = (html, allowIframes = false) => {
  const config = allowIframes
    ? { ADD_TAGS: ['iframe'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'] }
    : {};
  const cleanHtml = DOMPurify.sanitize(html, config);
  return parse(cleanHtml);
};

/**
 * Splits HTML into parts, replacing iframes with placeholder components.
 * Handles iframe-wrapper divs by replacing the entire wrapper+iframe combo with a placeholder.
 * Note: Only processes iframes with src attribute (empty iframes are left in original HTML).
 * @param {string} htmlString - Original HTML content
 * @param {HTMLIFrameElement[]} iframes - Array of iframe elements with src to replace
 * @param {React.Component} PlaceholderComponent - Component to use for placeholders
 * @returns {React.ReactNode[]} Array of React elements
 */
export const replaceIframesWithPlaceholders = (htmlString, iframes, PlaceholderComponent) => {
  if (!htmlString) return [];
  
  const elements = [];
  let remainingHtml = htmlString;

  iframes.forEach((iframe, index) => {
    const iframeString = iframe.outerHTML;
    
    // Check if iframe is wrapped in iframe-wrapper div
    const wrapperPattern = `<div class="iframe-wrapper">${iframeString}</div>`;
    const hasWrapper = remainingHtml.includes(wrapperPattern);
    
    // Use the wrapper pattern if it exists, otherwise just the iframe
    const searchString = hasWrapper ? wrapperPattern : iframeString;
    const searchIndex = remainingHtml.indexOf(searchString);
    
    if (searchIndex === -1) return;

    // Add content before iframe/wrapper (without extra div wrapper)
    const beforeHtml = remainingHtml.substring(0, searchIndex);
    if (beforeHtml.trim()) {
      elements.push(<React.Fragment key={`before-${index}`}>{sanitizeHtml(beforeHtml)}</React.Fragment>);
    }

    // Add placeholder (iframe always has src at this point due to extractIframes filtering)
    const src = iframe.getAttribute('src');
    elements.push(<PlaceholderComponent key={`placeholder-${index}`} url={src} />);

    remainingHtml = remainingHtml.substring(searchIndex + searchString.length);
  });

  // Add remaining content (without extra div wrapper)
  if (remainingHtml.trim()) {
    elements.push(<React.Fragment key='after-last'>{sanitizeHtml(remainingHtml)}</React.Fragment>);
  }

  return elements;
};

/**
 * Converts embed URLs to user-friendly viewing URLs.
 * @param {string} url - The embed URL from iframe src
 * @returns {string} User-friendly viewing URL
 */
export const convertEmbedToViewUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // YouTube embed: /embed/VIDEO_ID -> /watch?v=VIDEO_ID
    // Only match exact youtube.com or its subdomains (*.youtube.com)
    const isYouTubeHost = hostname === 'youtube.com' || hostname.endsWith('.youtube.com');
    if (isYouTubeHost && urlObj.pathname.startsWith('/embed/')) {
      const videoId = urlObj.pathname.split('/embed/')[1].split('?')[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    // YouTube short URLs
    if (hostname === 'youtu.be') {
      const videoId = urlObj.pathname.substring(1);
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    // For other services, return the original URL
    // Can be extended for other embed services if needed
    return url;
  } catch {
    // If URL parsing fails, return original
    return url;
  }
};

export default {
  extractIframes,
  sanitizeHtml,
  replaceIframesWithPlaceholders,
  convertEmbedToViewUrl,
};
