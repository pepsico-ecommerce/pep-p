import { define, css, html } from 'uce';
import { ResizeObserver } from '@juggle/resize-observer';

import { removeLastWord } from './removeLastWord';

/**
 * <pep-p>PepsiCo Paragraph Custom Element.</pep-p>
 * Paragraph Element with multiline ellipse support.
 * Text is trimmed to fit inside the parent element. (via 100% width/height)
 */
define('pep-p', {
  style: (selector) => css`
    ${selector} {
      /* Prevent the overflow from flashing */
      overflow: hidden;
      /* Need defined width/height, so use the parents values */
      /* height: 100%; */ /* removed height so text can center in parent. */
      width: 100%;
      display: block;
    }
    ${selector} textarea {
      box-sizing: border-box;
    }
  `,
  init() {
    // Create a Resize Observer so we can re-adjust the length of the text content
    // when the element changes size.
    try {
      this._resizeObserver = new ResizeObserver((elms) => {
        this.render();
      });
      // Start observing.
      this._resizeObserver.observe(this);
    }
    catch(e) {
      console.log('<pep-p /> _resizeObserver error', e, this);
    }
  },
  connected() {
    // Create a copy of the children and text before we  start modifying it.
    this.originalChildNodes = Array.from(this.childNodes).map(node => node.cloneNode(true));
    this.originalTextContent = this.textContent;
    this.setAttribute('tooltip', this.originalTextContent.trim());
    this.trimTextContent();
  },
  disconnected() {
    try {
      this._resizeObserver.disconnect();
      this.restoreChildren();
    }
    catch(e) {
      console.log('<pep-p /> Disconnected error', e, this);
    }
  },

  // Restores the original children
  restoreChildren() {
    this.innerHTML = ''; // clear out all the children
    // Create clones of the original children and put them back.
    this.originalChildNodes.forEach(child => this.appendChild(child.cloneNode(true)));
  },

  // render by updating the trimmed text to match the current size.
  render() {
    // Clear the tooltip.
    this.removeAttribute('tooltip');
    // Find the minimum height needed to display text.
    this.innerHTML = 'ÀEIOUhy';
    this.minHeight = this.scrollHeight;
    // restore the children and then re-trim to the new size.
    this.restoreChildren();
    this.trimTextContent();

    if (!this.didTrim) {
      this.removeAttribute('tooltip');
    }

    if (this.didTrim) {
      this.setAttribute('tooltip', this.originalTextContent.trim());
    }
  },

  // Returns true if the content overflows.
  get hasOverflow() {
    if (this.scrollWidth <= this.clientWidth
       && this.scrollHeight <= this.minHeight) {
      return false;
    }

    return true;
  },
  // Returns true if the element has a size.
  get hasSize() {
    if (0 === this.scrollWidth || 0 === this.scrollHeight) {
      return false;
    }
    return true;
  },

  // Trims the text content of the children to make them fit without overflowing.
  trimTextContent() {
    this.didTrim = false;

    // Skip if the element has no size. We can't trim to an unknown.
    if (!this.hasSize) {
      return;
    }
    // Loop over each child starting with the last,
    // untill we are no longer overflowing, or we run out of children.
    for (let idx=(this.childNodes.length-1);
        idx >= 0 && this.hasOverflow;
        idx--) {

      const childElm = this.childNodes[idx];

      // We don't want to change user's input, so skip those elements.
      if (['TEXTAREA', 'INPUT', 'SELECT'].includes(childElm.nodeName)) {
        continue;
      }

      // We can remove line breaks if we are trying to shrink the content.
      if (childElm.nodeName === 'BR') {
        childElm.remove();
        continue;
      }

      // Remove one word at a time until either the content fits,
      // or we run out of text.
      let shorterText = childElm.textContent;
      do {
        this.didTrim = true;
        // Remove the last word.
        shorterText = removeLastWord(shorterText);
        // update the element so we can check the new size.
        childElm.textContent = shorterText;
      }
      // Stop when we run out of text, or we are no longer overflowing.
      while(this.hasOverflow && shorterText.length > 0);

      // If the text is empty, remove the element,
      if ((!shorterText || shorterText.length === 0)) {
        childElm.remove();
      }
    }

    // Check if we did anything.
    if (this.didTrim) {
      // Find the last text element so we can add ellipsis.
      let lastTextElm = this.childNodes[this.childNodes.length-1];
      while (lastTextElm && lastTextElm.nodeName !== '#text') {
        lastTextElm = lastTextElm.previousSibling;
      }
      // there is a chance there are no text elements left.
      if (lastTextElm) {
        lastTextElm.textContent = removeLastWord(lastTextElm.textContent) + ' ...';
      }
    }

  }
});
