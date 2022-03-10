import classNames from 'classnames';
import ActionButton from 'components/ActionButton';
import Button from 'components/Button';
import displayModeObjects from 'constants/displayModeObjects';
import core from 'core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import DataElementWrapper from "components/DataElementWrapper";
import { enterReaderMode, exitReaderMode } from 'helpers/readerMode';

function ViewControlsOverlay() {
  const [t] = useTranslation();
  const store = useStore();

  const totalPages = useSelector(selectors.getTotalPages);
  const displayMode = useSelector(selectors.getDisplayMode);
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, 'viewControlsOverlay'));
  const isReaderMode = useSelector(selectors.isReaderMode);

  const totalPageThreshold = 1000;

  const handleClick = (pageTransition, layout) => {
    const setDisplayMode = () => {
      const displayModeObject = displayModeObjects.find(
        obj => obj.pageTransition === pageTransition && obj.layout === layout,
      );
      core.setDisplayMode(displayModeObject.displayMode);
    };

    if (isReaderMode) {
      exitReaderMode(store);
      setTimeout(() => {
        setDisplayMode();
      });
    } else {
      setDisplayMode();
    }
  };

  const handleReaderModeClick = () => {
    if (isReaderMode) return;
    enterReaderMode(store);
  };

  if (isDisabled) {
    return null;
  }

  let pageTransition;
  let layout;

  const displayModeObject = displayModeObjects.find(obj => obj.displayMode === displayMode);
  if (displayModeObject) {
    pageTransition = displayModeObject.pageTransition;
    layout = displayModeObject.layout;
  }

  const showReaderButton = core.isFullPDFEnabled() && window.documentViewer?.getDocument()?.getType() === 'pdf';

  return (
    <FlyoutMenu menu="viewControlsOverlay" trigger="viewControlsButton" onClose={undefined} ariaLabel={t('component.viewControlsOverlay')}>
      {totalPages < totalPageThreshold && (
        <>
          <DataElementWrapper
            dataElement="pageTransitionHeader"
            className="type"
          >
            {t('option.displayMode.pageTransition')}
          </DataElementWrapper>
          <DataElementWrapper
            className={classNames({ row: true, active: (pageTransition === 'continuous' && !isReaderMode) })}
            onClick={() => handleClick('continuous', layout)}
            dataElement="continuousPageTransitionButton"
          >
            <Button
              title="option.pageTransition.continuous"
              img="icon-header-page-manipulation-page-transition-continuous-page-line"
              isActive={pageTransition === 'continuous' && !isReaderMode}
              role="option"
            />
            <div className="title">{t('option.pageTransition.continuous')}</div>
          </DataElementWrapper>
          <DataElementWrapper
            className={classNames({ row: true, active: (pageTransition === 'default' && !isReaderMode) })}
            onClick={() => handleClick('default', layout)}
            dataElement="defaultPageTransitionButton"
          >
            <Button
              title="option.pageTransition.default"
              img="icon-header-page-manipulation-page-transition-page-by-page-line"
              isActive={pageTransition === 'default' && !isReaderMode}
              role="option"
            />
            <div className="title">{t('option.pageTransition.default')}</div>
          </DataElementWrapper>
          {showReaderButton && (
            <DataElementWrapper
              className={classNames({ row: true, active: isReaderMode })}
              onClick={() => handleReaderModeClick()}
              dataElement="readerPageTransitionButton"
            >
              <Button
                title="option.pageTransition.reader"
                img="icon-header-page-manipulation-page-transition-reader"
                isActive={isReaderMode}
                role="option"
              />
              <div className="title">{t('option.pageTransition.reader')}</div>
            </DataElementWrapper>
          )}
          {!isReaderMode && (
            <DataElementWrapper
              dataElement="viewControlsDivider1"
              className="divider"
            />
          )}
        </>
      )}
      {!isReaderMode && (
        <>
          <DataElementWrapper
            dataElement="rotateHeader"
            className="type"
          >
            {t('action.rotate')}
          </DataElementWrapper>
          <DataElementWrapper className="row" onClick={core.rotateClockwise} dataElement="rotateClockwiseButton">
            <ActionButton
              title="action.rotateClockwise"
              img="icon-header-page-manipulation-page-rotation-clockwise-line"
              role="option"
            />
            <div className="title">{t('action.rotateClockwise')}</div>
          </DataElementWrapper>
          <DataElementWrapper className="row" onClick={core.rotateCounterClockwise} dataElement="rotateCounterClockwiseButton">
            <ActionButton
              title="action.rotateCounterClockwise"
              img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
              role="option"
            />
            <div className="title">{t('action.rotateCounterClockwise')}</div>
          </DataElementWrapper>
          <DataElementWrapper
            dataElement="viewControlsDivider2"
            className="divider"
          />
          <DataElementWrapper
            dataElement="layoutHeader"
            className="type"
          >
            {t('option.displayMode.layout')}
          </DataElementWrapper>
          <DataElementWrapper
            className={classNames({ row: true, active: layout === 'single' })}
            onClick={() => handleClick(pageTransition, 'single')}
            dataElement="singleLayoutButton"
          >
            <Button
              title="option.layout.single"
              img="icon-header-page-manipulation-page-layout-single-page-line"
              isActive={layout === 'single'}
              role="option"
            />
            <div className="title">{t('option.layout.single')}</div>
          </DataElementWrapper>
          <DataElementWrapper
            className={classNames({ row: true, active: layout === 'double' })}
            onClick={() => handleClick(pageTransition, 'double')}
            dataElement="doubleLayoutButton"
          >
            <Button
              title="option.layout.double"
              img="icon-header-page-manipulation-page-layout-double-page-line"
              isActive={layout === 'double'}
              role="option"
            />
            <div className="title">{t('option.layout.double')}</div>
          </DataElementWrapper>
          <DataElementWrapper
            className={classNames({ row: true, active: layout === 'cover' })}
            onClick={() => handleClick(pageTransition, 'cover')}
            dataElement="coverLayoutButton"
          >
            <Button
              title="option.layout.cover"
              img="icon-header-page-manipulation-page-layout-cover-line"
              isActive={layout === 'cover'}
              role="option"
            />
            <div className="title">{t('option.layout.cover')}</div>
          </DataElementWrapper>
        </>
      )}
    </FlyoutMenu>
  );
}

export default ViewControlsOverlay;
