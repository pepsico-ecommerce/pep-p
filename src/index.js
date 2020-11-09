import { define, css, html } from "uce";
import { ResizeObserver } from "@juggle/resize-observer";

/**
 * Returns the element's lineHeight as a number.
 */
function getLineHeight(elm) {
  const { lineHeight, fontSize } = window.getComputedStyle(elm);
  if (lineHeight === "normal") {
    // Normal line heights vary from browser to browser. The spec recommends
    // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
    return parseFloat(fontSize) * 1.2;
  }
  return parseFloat(lineHeight);
}

function getTextSize(elParent) {
  const elTest = document.createElement("span");
  elTest.innerText = "e";
  elParent.appendChild(elTest);
  const { width } = elTest.getBoundingClientRect();
  const height = getLineHeight(elTest);
  elParent.removeChild(elTest);
  return {
    width,
    height
  };
}

/**
 * <pep-p>PepsiCo Paragraph Custom Element.</pep-p>
 * Paragraph Element with multiline ellipse support.
 */
define("pep-p", {
  // attachShadow: {mode: 'open'},
  // extends: 'p',
  style: (selector) => css`
    ${selector} {
      /* border: thin solid red; */
      height: 100%;
      width: 100%;
      display: flex;
    }

    ${selector} p {
      /*overflow: hidden;*/

      height: 100%;
      width: 100%;
      margin: 0;
    }

    ${selector} textarea {
      box-sizing: border-box;
    }
  `,
  init() {
    // on init, start a resize observer so we can update the text trim on resize.
    const ro = new ResizeObserver(() => this.trimTextContent());
    ro.observe(this);
  },
  connected() {
    // Keep the original children for unmount.
    this._originalChildNodes = Array.from(this.childNodes) ?? [];
    // Now render it!
    this.render();
  },
  disconnected() {
    // Restore the original children,
    this.childNodes = this._originalChildNodes;
  },

  // Renders the children, text context is upgraded.
  render() {
    // wrap the text nodes in paragraphs so we can style them.
    const children = this._originalChildNodes.reduce((list, el) => {
      if (el.nodeName === "#text") {
        const isEmpty = el.wholeText.trim().length === 0;
        if (!isEmpty) {
          list.push(
            html`
              <p>${el.data}</p>
            `
          );
        }
      } else {
        list.push(el);
      }

      return list;
    }, []);

    // Render all the children.
    this.html`${children}`;

    // Wait for the browser to repaint so we can get the right size.
    setTimeout(() => {
      this.trimTextContent();
    }, 1);
  },

  trimTextContent() {
    const childrenToUpdate = Array.from(
      this.querySelectorAll("p")
    );
    const textSize = getTextSize(this);

    // Check each paragraph to see if it needs ellipsis
    childrenToUpdate.forEach((elChild) => {
      // If we trimmed in the past, untrim so we can re-calc the size.
      if (elChild.originalTextContent) {
        elChild.textContent = elChild.originalTextContent;
      }
      // If we have a scroll height difference, then the text overflowed the element.
      const needsTrimmed = elChild.clientHeight !== elChild.scrollHeight;
      // Bail if the content fits the element.
      if (!needsTrimmed) {
        return;
      }

      // Create the trimmed version.
      const text = elChild.textContent.trim();
      const trimmedLength =
        Math.floor(elChild.clientWidth / textSize.width) *
        Math.floor(elChild.clientHeight / textSize.height);
      const trimmedText = text.substring(0, trimmedLength);

      // Save the original text.
      if (!elChild.originalTextContent) {
        const { textContent } = elChild;
        elChild.originalTextContent = textContent;
        // Set the original text as the tooltip, so the user can hover and read everything.
        elChild.setAttribute("title", textContent.trim());
      }
      // Update with the trimmed text.
      elChild.textContent = trimmedText + "...";
    });
  }
});
