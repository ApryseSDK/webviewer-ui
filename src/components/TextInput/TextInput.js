import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import classNames from 'classnames';
import './TextInput.scss';

const propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  validationMessage: PropTypes.string,
  hasError: PropTypes.bool,
  ariaDescribedBy: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
};

const TextInput = ({
  label,
  value,
  onChange,
  validationMessage,
  hasError,
  ariaDescribedBy,
  ariaLabelledBy,
}) => {
  const { t } = useTranslation();
  return (
    <div className="input-container">
      <div className='input-wrapper'>
        <input
          className={classNames({
            'text-input': true,
            'text-input--error': hasError,
          })}
          id={label}
          type='text'
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
          value={value}
          aria-describedby={hasError ? { ariaDescribedBy } : undefined}
          aria-labelledby={ariaLabelledBy}
        />
        {hasError && <Icon glyph="icon-alert" />}
      </div>
      {hasError && (
        <div id="TextInputError" className="text-input-error">
          <p aria-live="assertive" className="no-margin" role="alert" >{t(validationMessage)}</p>
        </div>
      )}
    </div>
  );
};

TextInput.propTypes = propTypes;

export default TextInput;