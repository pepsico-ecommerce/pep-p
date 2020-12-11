
/**
 * Removes the last word from text and returns the new string.
 * Trims text before starting.
 * A "word" is text seprated with one or more spaces.
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
export function removeLastWord(text) {
  return text.trim().substring(0, text.lastIndexOf(' '));
}
