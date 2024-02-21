import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CustomButton from '../CustomButton';
import ToggleElementButton from '../ToggleElementButton';
import { isMobileSize } from 'helpers/getDeviceSize';
import { DIRECTION } from 'constants/customizationVariables';
import { useTranslation } from 'react-i18next';
import './PageControls.scss';

function PageControls(props) {
  const {
    size,
    dataElement,
    onFlyoutToggle,
    leftChevron,
    rightChevron,
    currentPage,
    totalPages,
    elementRef,
    headerDirection,
    onBlur,
    onFocus,
    onClick,
    onChange,
    onSubmit,
    isFocused,
    input,
    inputRef,
    allowPageNavigation,
  } = props;

  const { t } = useTranslation();
  const isMobile = isMobileSize();
  let inputWidth = 0;
  if (input) {
    inputWidth = 26 + input.length * (isMobile ? 10 : 7);
  }

  const style = { width: inputWidth };
  if (headerDirection === DIRECTION.COLUMN) {
    style.minHeight = 32;
  }

  return (
    <div className="PageControlsWrapper"
      data-element={dataElement}
      style={{ flexDirection: headerDirection }}
      ref={elementRef}>
      {size === 0 && <>
        <CustomButton {...leftChevron} />
        <form
          onClick={onClick}
          onKeyDown={onClick}
          onSubmit={onSubmit}
          onBlur={onBlur}
          onMouseOver={onBlur}
          onFocus={onFocus}>
          <input
            aria-label={t('action.pageNumberInput')}
            ref={inputRef}
            className={classNames({
              unfocused: !isFocused,
            })}
            type="text"
            value={input}
            onChange={onChange}
            disabled={!allowPageNavigation}
            style={style}
          />
        </form>

        <div className={classNames({
          'total-page': true,
          'paddingTop': headerDirection === DIRECTION.COLUMN,
          'paddingLeft': headerDirection === DIRECTION.ROW,
        })}>{totalPages}</div>
        <CustomButton {...rightChevron} />
      </>}
      {size === 1 &&
        <ToggleElementButton
          dataElement="pageNav-toggle-button"
          className="PageNavToggleButton"
          title={t('action.more')}
          disabled={false}
          img={'icon-tools-more'}
          toggleElement="pageNavFlyoutMenu"
          onFlyoutToggled={onFlyoutToggle}
        />
      }
      <span className="visually-hidden">
        <output aria-live="assertive">{t('action.currentPageIs')} {currentPage}</output>
      </span>
    </div>
  );
}

PageControls.propTypes = {
  size: PropTypes.number,
  dataElement: PropTypes.string.isRequired,
  onFlyoutToggle: PropTypes.func,
  leftChevron: PropTypes.object,
  rightChevron: PropTypes.object,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  elementRef: PropTypes.any,
  headerDirection: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  isFocused: PropTypes.bool,
  input: PropTypes.string,
  inputRef: PropTypes.any,
  allowPageNavigation: PropTypes.bool,
};

export default PageControls;