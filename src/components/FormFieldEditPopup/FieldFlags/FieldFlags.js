import React from 'react';
import Choice from 'components/Choice';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const propTypes = {
  flags: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      isChecked: PropTypes.bool,
      onChange: PropTypes.func,
    }),
  ),
};

const FieldFlags = ({ flags }) => {
  const { t } = useTranslation();
  return (
    <div className="field-flags-container">
      <h2 className="field-flags-title" id="field-flags-group">{t('formField.formFieldPopup.flags')}</h2>
      <div role="group" aria-labelledby="field-flags-group">
        {flags.map((flag) => (
          <Choice
            id={t(flag.label)}
            key={t(flag.label)}
            checked={flag.isChecked}
            onChange={(event) => flag.onChange(event.target.checked)}
            label={t(flag.label)}
            aria-checked={flag.isChecked}
          />
        ))}
      </div>
    </div>
  );
};

FieldFlags.propTypes = propTypes;

export default FieldFlags;