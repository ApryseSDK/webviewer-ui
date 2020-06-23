import classNames from 'classnames';
import ActionButton from 'components/ActionButton';
import Button from 'components/Button';
import displayModeObjects from 'constants/displayModeObjects';
import core from 'core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';

function ViewControlsOverlay() {
  const [t] = useTranslation();

  const totalPages = useSelector(selectors.getTotalPages);
  const displayMode = useSelector(selectors.getDisplayMode);
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, 'viewControlsOverlay'));

  const handleClick = (pageTransition, layout) => {
    const displayModeObject = displayModeObjects.find(
      obj => obj.pageTransition === pageTransition && obj.layout === layout,
    );
    core.setDisplayMode(displayModeObject.displayMode);
  };

  if (isDisabled) {
    return null;
  }

  const { pageTransition, layout } = displayModeObjects.find(obj => obj.displayMode === displayMode);

  return (
    <FlyoutMenu menu="viewControlsOverlay" trigger="viewControlsButton" onClose={undefined}>
      <div className="type">{t('option.displayMode.pageTransition')}</div>
      {totalPages < 1000 && (
        <>
          <div
            className={classNames({ row: true, active: pageTransition === 'continuous' })}
            onClick={() => handleClick('continuous', layout)}
          >
            <Button
              title="option.pageTransition.continuous"
              dataElement="continuousPageTransitionButton"
              img="icon-header-page-manipulation-page-transition-continuous-page-line"
              isActive={pageTransition === 'continuous'}
            />
            <div className="title">{t('option.pageTransition.continuous')}</div>
          </div>
          <div
            className={classNames({ row: true, active: pageTransition === 'default' })}
            onClick={() => handleClick('default', layout)}
          >
            <Button
              title="option.pageTransition.default"
              dataElement="defaultPageTransitionButton"
              img="icon-header-page-manipulation-page-transition-page-by-page-line"
              isActive={pageTransition === 'default'}
            />
            <div className="title">{t('option.pageTransition.default')}</div>
          </div>
          <div className="divider" />
        </>
      )}
      <div className="type">{t('action.rotate')}</div>
      <div className="row" onClick={core.rotateClockwise}>
        <ActionButton
          dataElement="rotateClockwiseButton"
          title="action.rotateClockwise"
          img="icon-header-page-manipulation-page-rotation-clockwise-line"
        />
        <div className="title">{t('action.rotateClockwise')}</div>
      </div>
      <div className="row" onClick={core.rotateCounterClockwise}>
        <ActionButton
          dataElement="rotateCounterClockwiseButton"
          title="action.rotateCounterClockwise"
          img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
        />
        <div className="title">{t('action.rotateCounterClockwise')}</div>
      </div>
      <div className="divider" />
      <div className="type">{t('option.displayMode.layout')}</div>
      <div
        className={classNames({ row: true, active: layout === 'single' })}
        onClick={() => handleClick(pageTransition, 'single')}
      >
        <Button
          title="option.layout.single"
          dataElement="singleLayoutButton"
          img="icon-header-page-manipulation-page-layout-single-page-line"
          isActive={layout === 'single'}
        />
        <div className="title">{t('option.layout.single')}</div>
      </div>
      <div
        className={classNames({ row: true, active: layout === 'double' })}
        onClick={() => handleClick(pageTransition, 'double')}
      >
        <Button
          title="option.layout.double"
          dataElement="doubleLayoutButton"
          img="icon-header-page-manipulation-page-layout-double-page-line"
          isActive={layout === 'double'}
        />
        <div className="title">{t('option.layout.double')}</div>
      </div>
      <div
        className={classNames({ row: true, active: layout === 'cover' })}
        onClick={() => handleClick(pageTransition, 'cover')}
      >
        <Button
          title="option.layout.cover"
          dataElement="coverLayoutButton"
          img="icon-header-page-manipulation-page-layout-cover-line"
          isActive={layout === 'cover'}
        />
        <div className="title">{t('option.layout.cover')}</div>
      </div>
    </FlyoutMenu>
  );
}

export default ViewControlsOverlay;
