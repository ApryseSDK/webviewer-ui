import React from 'react';
import './ModularColorPicker.scss';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Label from 'components/ModularComponents/Label';
import ToggleElementButton from '../ToggleElementButton';
import ColorPickerContainer from 'components/StylePicker/ColorPickerContainer';
import { parseColor } from 'src/helpers/colorPickerHelper';

const ModularColorPicker = (props) => {
  const {
    isFlyoutItem,
    dataElement,
    disabled,
    defaultColor,
    onColorChange,
    icon,
    label,
    toggleElement,
    property,
    color,
    type,
    className,
    ariaTypeLabel,
    onKeyDownHandler,
  } = props;

  const { t } = useTranslation();


  return (isFlyoutItem ? (
    <div data-element={dataElement} className={classNames({
      'ModularColorPicker': true,
    })}
    >
      <Label dataElement={`${dataElement}Label`} label={label} isFlyoutItem={isFlyoutItem} />
      <div className={classNames({
        'color-picker-container': true,
        'flyout-item': isFlyoutItem
      })}>
        <Button
          className='resetToDefaultColor'
          dataElement={'resetToDefaultColor'}
          label={t('action.resetDefault')}
          ariaLabel={t('action.resetDefault')}
          title={t('action.resetDefault')}
          onClick={() => {
            onColorChange(defaultColor);
          }}
          onKeyDownHandler={onKeyDownHandler}
        />
        <ColorPickerContainer
          dataElement={dataElement}
          onColorChange={onColorChange}
          property={property}
          color={color}
          hasTransparentColor={false}
          type={type}
          ariaTypeLabel={ariaTypeLabel}
          defaultColor={defaultColor}
          onKeyDownHandler={onKeyDownHandler}
        />
      </div>
    </div>
  ) : (
    <div>
      <ToggleElementButton
        dataElement={dataElement}
        className={className}
        disabled={disabled}
        img={icon}
        title={t(label)}
        toggleElement={toggleElement}
        color={parseColor(color)}
      />
    </div>
  ));
};

ModularColorPicker.propTypes = {
  dataElement: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  disabled: PropTypes.bool,
  defaultColor: PropTypes.object,
  onColorChange: PropTypes.func,
  icon: PropTypes.string,
  label: PropTypes.string,
  toggleElement: PropTypes.string,
  property: PropTypes.string,
  color: PropTypes.object,
  type: PropTypes.string,
  className: PropTypes.string,
  ariaTypeLabel: PropTypes.string,
  onKeyDownHandler: PropTypes.func,
};

export default ModularColorPicker;