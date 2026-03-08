import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'a', 'ul', 'ol', 'li', 'br', 'p', 'div'];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'dir'];

// Add dir="auto" to block-level elements for proper RTL/LTR handling
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (['P', 'DIV', 'LI', 'UL', 'OL'].includes(node.tagName)) {
    node.setAttribute('dir', 'auto');
  }
});

export const sanitizeHtml = (dirty: string): string => {
  // Split content on <br> that separates language blocks into proper <p> tags
  const processed = dirty.replace(/<br\s*\/?>\s*(?=[\u0600-\u06FF])/g, '</p><p>');
  
  return DOMPurify.sanitize(processed, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ['target'],
  });
};
