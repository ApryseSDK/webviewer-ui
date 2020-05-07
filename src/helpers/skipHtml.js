import sanitizeHtml from 'sanitize-html';

export default function skipHtml(html = '') {
  return sanitizeHtml(html, { allowedTags: [] });
}
