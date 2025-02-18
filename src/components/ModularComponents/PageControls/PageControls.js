import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import selectors from 'selectors';
import CustomButton from '../CustomButton';
import ToggleElementButton from '../ToggleElementButton';
import { DIRECTION } from 'constants/customizationVariables';
import { useTranslation } from 'react-i18next';
import './PageControls.scss';
import DataElements from 'src/constants/dataElement';
import PageControlsInput from './PageControlsInput';

function PageControls(props) {
  const {
    size,
    dataElement,
    onFlyoutToggle,
    previousPageButton,
    nextPageButton,
    elementRef,
    headerDirection,
    className,
  } = props;

  const totalPages = useSelector(selectors.getTotalPages);
  const currentPage = useSelector(selectors.getCurrentPage);
  const { t } = useTranslation();

  return (
    <div className={classNames({ PageControlsWrapper: true, [className]: true })}
      data-element={dataElement}
      style={{ flexDirection: headerDirection }}
      ref={elementRef}>
      {size === 0 && <>
        <CustomButton {...previousPageButton} />
        <PageControlsInput />
        <div className={classNames({
          'total-page': true,
          'paddingTop': headerDirection === DIRECTION.COLUMN,
          'paddingLeft': headerDirection === DIRECTION.ROW,
        })}>{totalPages}</div>
        <CustomButton {...nextPageButton} />
      </>}
      {size === 1 &&
        <ToggleElementButton
          dataElement="pageNav-toggle-button"
          className="PageNavToggleButton"
          title={t('action.more')}
          disabled={false}
          img={'icon-tools-more'}
          toggleElement={DataElements.PAGE_CONTROLS_FLYOUT}
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
  previousPageButton: PropTypes.object,
  nextPageButton: PropTypes.object,
  elementRef: PropTypes.any,
  headerDirection: PropTypes.string,
  className: PropTypes.string,
};

export default PageControls;