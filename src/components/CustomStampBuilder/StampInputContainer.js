import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const StampInputContainer = ({
  stampText,
  handleInputChange
}) => {
  const [t] = useTranslation();
  const inputRef = useRef();
  const stampInputLabel = t('option.customStampModal.stampText');
  const stampInputContainer = <div className="stamp-input-container">
    <label htmlFor="stampTextInput" className="stamp-label"> {stampInputLabel}*</label>
    <input
      id="stampTextInput"
      className={classNames('text-customstamp-input', { 'error': !stampText })}
      ref={inputRef}
      type="text"
      aria-label={stampInputLabel}
      value={stampText}
      onChange={handleInputChange} />
    {!stampText &&
      <>
        <Icon glyph="icon-alert" className="error-icon" role="presentation" />
        <div className="empty-stamp-input" aria-live="assertive">
          {!stampText && <p className="no-margin">{t('message.emptyCustomStampInput')}</p>}
        </div>
      </>}
  </div>;
  return stampInputContainer;
};

StampInputContainer.propTypes = {
  stampText: PropTypes.string,
  handleInputChange: PropTypes.func,
};

export default StampInputContainer;