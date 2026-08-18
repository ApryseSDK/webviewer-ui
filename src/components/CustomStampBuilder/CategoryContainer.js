import React, { useState } from 'react';
import CreatableDropdown from 'components/CreatableDropdown';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getDefaultStampCategory } from 'helpers/stamps';
import selectors from 'selectors';
import PropTypes from 'prop-types';

const CategoryContainer = ({
  category,
  handleCategoryChange,
}) => {
  const [t] = useTranslation();
  const [inputValue, setInputValue] = useState(category || '');
  const categories = useSelector((state) => selectors.getCustomStampCategories(state));
  const categoryInputLabel = t('option.customStampModal.category');
  const dropdownLabel = category === getDefaultStampCategory() ? t('option.customStampModal.customStamp') : category;
  const dropdownValue = category ? { value: category, label: dropdownLabel } : null;

  const categoryOptions = categories.map((category) => {
    if (category === getDefaultStampCategory()) {
      return { value: category, label: t('option.customStampModal.customStamp') };
    }
    return { value: category, label: category };
  });

  const categoryContainer = <div className="category-container">
    <label className="category-label"> {categoryInputLabel}</label>
    <div className="category-dropdown">
      <CreatableDropdown
        options={categoryOptions}
        inputValue={inputValue}
        onInputChange={(inputValue) => {
          setInputValue(inputValue);
        }}
        onChange={handleCategoryChange}
        value={dropdownValue}
        isValid={Boolean(inputValue)}
        textPlaceholder={''} />
    </div>
    <p className="category-instructions-text">{t('option.customStampModal.categoryInstructions')}</p>
  </div>;
  return categoryContainer;
};

CategoryContainer.propTypes = {
  category: PropTypes.string,
  handleCategoryChange: PropTypes.func,
};

export default CategoryContainer;