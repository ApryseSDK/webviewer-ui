import React from 'react';

/**
 * @ignore
 * Renders a dropdown item with a label and description in vertical layout.
 * @param {Object} item - The dropdown item object
 * @param {string} item.label - The label text or translation key for the item
 * @param {string} item.description - The description text or translation key for the item
 * @param {Function} [t] - Optional translation function from react-i18next
 *   - If provided, both label and description will be translated using this function
 *   - If not provided, label and description will be used as-is without translation
 *   - This allows the same component to handle both translated and pre-formatted content
 */
const renderDropdownItemWithDescription = (item, t) => (
  <div className='Dropdown__item-vertical'>
    <div className='Dropdown__item-label'>{t ? t(item.label) : item.label}</div>
    <div className='Dropdown__item-description'>{t ? t(item.description) : item.description}</div>
  </div>
);

export default renderDropdownItemWithDescription;
