import React from 'react';
import selectors from 'selectors';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import './Label.scss';
import Tooltip from 'components/Tooltip';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

const Label = (props) => {
  const {
    dataElement,
    label,
    title,
    disabled = false,
    style = {},
    isFlyoutItem = false,
    className,
    id,
  } = props;

  const { t } = useTranslation();
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));

  if (isDisabled || disabled) {
    return null;
  }

  return (
    <Tooltip content={t(title)}>
      <div className={classNames('Label', {
        'flyout-label': isFlyoutItem,
        [className]: true,
      })} style={style} data-element={dataElement} id={id}>
        {t(label)}
      </div>
    </Tooltip>
  );
};

Label.propTypes = {
  dataElement: PropTypes.string.isRequired,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  isFlyoutItem: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string
};

export default Label;
