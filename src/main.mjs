import { define, css } from 'uce';

/**
 * <pep-p>PepsiCo Paragraph Custom Element.</pep-p>
 * Paragraph Element with multiline ellipse support.
 * Text is trimmed to fit inside the parent element. (via 100% width/height)
 */
define('pep-p', {
  style: (selector) => css`
    ${selector} {
      overflow: hidden;
      text-align: inherit;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      display: inline-block;
    }
    ${selector} textarea {
      box-sizing: border-box;
    }
  `,
  handleHover() {
    const isTruncated = this.offsetWidth < this.scrollWidth;
    const hasTooltip = this.hasAttribute('tooltip');
    if (isTruncated && !hasTooltip) {
      this.setAttribute('tooltip', this.originalTextContent.trim());
    } else if (!isTruncated && hasTooltip) {
      this.removeAttribute('tooltip');
    }
  },
  connected() {
    this.originalTextContent = this.textContent;
    this.setAttribute('tooltip', this.originalTextContent.trim());
    this.addEventListener("mouseenter", this.handleHover);
  },
  disconnected() {
    this.removeEventListener("mouseenter", this.handleHover);
  }
});
