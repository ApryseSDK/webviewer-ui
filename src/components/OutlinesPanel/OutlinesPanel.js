import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { isMobileDevice } from 'helpers/device';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TouchBackEnd from 'react-dnd-touch-backend';
import OutlineControls from '../OutlineControls';
import Outline from 'components/Outline';
import OutlineContext from 'components/Outline/Context';
import Button from 'components/Button';
import OutlineContent from 'src/components/OutlineContent';
import DataElementWrapper from 'components/DataElementWrapper';

import core from 'core';
import outlineUtils from 'helpers/OutlineUtils';
import DataElements from 'constants/dataElement';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';

import '../../constants/bookmarksOutlinesShared.scss';
import './OutlinesPanel.scss';
import { OutlinesDragLayer } from './OutlinesDragLayer';

const OutlinesPanel = () => {
  const [
    isDisabled,
    outlines,
    outlineControlVisibility,
    outlineEditingEnabled,
    shouldAutoExpandOutlines,
    currentPage,
    pageLabels,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.OUTLINE_PANEL),
      selectors.getOutlines(state),
      selectors.isOutlineControlVisible(state),
      selectors.getOutlineEditingEnabled(state),
      selectors.shouldAutoExpandOutlines(state),
      selectors.getCurrentPage(state),
      selectors.getPageLabels(state),
    ],
    shallowEqual,
  );

  const defaultDestText = 'Full Page';
  const areaDestinationText = 'Area Selection';
  const defaultDestCoord = { x: 0, y: 0 };

  const [currentDestText, setCurrentDestText] = useState(defaultDestText);
  const [currentDestCoord, setCurrentDestCoord] = useState(defaultDestCoord);
  const [currentDestPage, setCurrentDestPage] = useState(currentPage);
  const [isOutlineEditable, setOutlineEditable] = useState(false);
  const [activeOutlinePath, setActiveOutlinePath] = useState(null);
  const [isAddingNewOutline, setAddingNewOutline] = useState(false);
  const [editingOutlines, setEditingOutlines] = useState({});
  const [isAnyOutlineRenaming, setAnyOutlineRenaming] = useState(false);
  const [isMultiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedOutlines, setSelectedOutlines] = useState([]);

  const [t] = useTranslation();
  const dispatch = useDispatch();
  const nextPathRef = useRef(null);
  const TOOL_NAME = 'OutlineDestinationCreateTool';
  const tool = core.getTool(TOOL_NAME);

  useLayoutEffect(() => {
    setAddingNewOutline(false);

    if (nextPathRef.current !== null) {
      setActiveOutlinePath(nextPathRef.current);
      nextPathRef.current = null;
    }

    const shouldResetMultiSelectedMode = outlines.length === 0;
    if (shouldResetMultiSelectedMode) {
      setMultiSelectMode(false);
    }
  }, [outlines]);

  useEffect(() => {
    setOutlineEditable(core.isFullPDFEnabled() && outlineEditingEnabled);
  }, [outlineEditingEnabled]);

  useEffect(() => {
    const isAnyEditing = Object.values(editingOutlines).some((value) => value);
    setAnyOutlineRenaming(isAnyEditing);
  }, [editingOutlines, outlines]);

  useEffect(() => {
    const onSetDestination = (annotation) => {
      setCurrentDestText(annotation['IsText'] ? annotation.getCustomData('trn-annot-preview') : areaDestinationText);
      setCurrentDestCoord({ x: annotation['X'], y: annotation['Y'] });
      setCurrentDestPage(annotation['PageNumber']);
    };

    const onOutlinesBookmarksChanged = () => {
      core.getOutlines((outlines) => {
        dispatch(actions.setOutlines(outlines));
      });
    };

    core.addEventListener('outlineSetDestination', onSetDestination);
    window.addEventListener('outlineBookmarksChanged', onOutlinesBookmarksChanged);
    return () => {
      core.removeEventListener('outlineSetDestination', onSetDestination);
      window.removeEventListener('outlineBookmarksChanged', onOutlinesBookmarksChanged);
    };
  }, []);

  const getCurrentDestViewerCoord = (pageNum, { x, y }) => {
    const docViewer = core.getDocumentViewer().getDocument();
    // convert annotation coordinates to viewerCoordinates because PDFNet used PDF coordinates
    return docViewer.getViewerCoordinates(pageNum, x, y);
  };

  const addNewOutline = async (name) => {
    const { x, y } = getCurrentDestViewerCoord(currentDestPage, currentDestCoord);
    let nextPath;
    let outlineName = name;
    if (![defaultDestText, areaDestinationText].includes(currentDestText) && !name) {
      outlineName = currentDestText.slice(0, 40);
    } else if (!name) {
      outlineName = t('message.untitled');
    }
    if (outlines.length === 0) {
      nextPath = await outlineUtils.addRootOutline(outlineName, currentDestPage, x, y, 0);
    } else {
      nextPath = await outlineUtils.addNewOutline(outlineName, activeOutlinePath, currentDestPage, x, y, 0);
    }

    nextPathRef.current = nextPath;
    updateOutlines();
  };

  const updateOutlines = () => {
    core.getOutlines((outlines) => {
      dispatch(actions.setOutlines(outlines));
    });

    clearOutlineDestination();
    setEditingOutlines({});
  };

  const getPath = (outline) => {
    return outlineUtils.getPath(outline);
  };

  const clearOutlineDestination = () => {
    core.setToolMode(defaultTool);
    setCurrentDestText(defaultDestText);
    setCurrentDestCoord(defaultDestCoord);
    setCurrentDestPage(currentPage);
    tool.clearOutlineDestination();
  };

  const updateOutlineDest = async (outlinePath) => {
    const { x, y } = getCurrentDestViewerCoord(currentDestPage, currentDestCoord);
    await outlineUtils.setOutlineDestination(outlinePath, currentDestPage, x, y, 0);
    nextPathRef.current = outlinePath;
    updateOutlines();
  };

  useEffect(() => {
    if (currentDestText === defaultDestText) {
      setCurrentDestPage(currentPage);
    }
  }, [currentDestText, currentPage]);

  useEffect(() => {
    if (isAddingNewOutline) {
      core.setToolMode(TOOL_NAME);
    } else {
      clearOutlineDestination();
    }
  }, [isAddingNewOutline]);

  const generalMoveOutlineAction = (dragOutline, dropOutline, moveDirection) => {
    const dragPath = getPath(dragOutline);
    const dropPath = getPath(dropOutline);
    setSelectedOutlines([]);

    moveDirection.call(outlineUtils, dragPath, dropPath).then((path) => {
      updateOutlines();
      nextPathRef.current = path;
    });
    core.goToOutline(dragOutline);
  };

  const moveOutlineAfterTarget = (dragOutline, dropOutline) => {
    generalMoveOutlineAction(dragOutline, dropOutline, outlineUtils.moveOutlineAfterTarget);
  };

  const moveOutlineBeforeTarget = (dragOutline, dropOutline) => {
    generalMoveOutlineAction(dragOutline, dropOutline, outlineUtils.moveOutlineBeforeTarget);
  };

  const moveOutlineInward = (dragOutline, dropOutline) => {
    generalMoveOutlineAction(dragOutline, dropOutline, outlineUtils.moveOutlineInTarget);
  };

  const renameOutline = async (outlinePath, newName) => {
    await outlineUtils.setOutlineName(outlinePath, newName);
    updateOutlines();
  };

  const removeOutlines = async (outlinesToRemove) => {
    outlinesToRemove.sort().reverse();
    const confirmationWarning = {
      message: t('warning.deleteOutline.message'),
      title: t('warning.deleteOutline.title'),
      confirmBtnText: t('action.delete'),
      onConfirm: async () => {
        for (let i = 0; i < outlinesToRemove.length; i++) {
          const fullIndex = outlinesToRemove[i];
          await outlineUtils.deleteOutline(fullIndex);
        }
        updateOutlines();
        setActiveOutlinePath(null);
        setSelectedOutlines([]);
      },
    };
    dispatch(actions.showWarningMessage(confirmationWarning));
  };

  if (isDisabled) {
    return null;
  }

  return (
    <div
      className="Panel OutlinesPanel bookmark-outline-panel"
      data-element={DataElements.OUTLINE_PANEL}
    >
      <div className="bookmark-outline-panel-header">
        <div className="header-title">
          {t('component.outlinesPanel')}
        </div>
        {isOutlineEditable &&
          (isMultiSelectMode ?
            <Button
              className="bookmark-outline-control-button"
              dataElement={DataElements.OUTLINE_MULTI_SELECT}
              label={t('option.bookmarkOutlineControls.done')}
              disabled={isAddingNewOutline}
              onClick={() => setMultiSelectMode(false)}
            />
            :
            <Button
              className="bookmark-outline-control-button"
              dataElement={DataElements.OUTLINE_MULTI_SELECT}
              label={t('action.edit')}
              disabled={isAddingNewOutline || outlines.length === 0}
              onClick={() => {
                setMultiSelectMode(true);
                setSelectedOutlines([]);
              }}
            />
          )
        }
      </div>
      <OutlineContext.Provider
        value={{
          currentDestPage: pageLabels[currentDestPage - 1],
          currentDestText,
          setActiveOutlinePath,
          activeOutlinePath,
          isOutlineActive: (outline) => getPath(outline) === activeOutlinePath,
          setAddingNewOutline,
          isAddingNewOutline,
          setEditingOutlines,
          editingOutlines,
          selectedOutlines,
          isAnyOutlineRenaming,
          isMultiSelectMode,
          shouldAutoExpandOutlines,
          isOutlineEditable,
          addNewOutline,
          updateOutlines,
          renameOutline,
          updateOutlineDest,
          removeOutlines,
        }}
      >
        {outlineControlVisibility && <OutlineControls />}
        <DndProvider backend={isMobileDevice ? TouchBackEnd : HTML5Backend}>
          <OutlinesDragLayer />

          <div className="bookmark-outline-row">
            {!isAddingNewOutline && outlines.length === 0 &&
              <div className="msg msg-no-bookmark-outline">{t('message.noOutlines')}</div>
            }
            {outlines.map((outline) => (
              <Outline
                key={outlineUtils.getOutlineId(outline)}
                outline={outline}
                setMultiSelected={(path, value) => {
                  if (selectedOutlines.find((outline) => outline === path)) {
                    if (!value) {
                      setSelectedOutlines(selectedOutlines.filter((outline) => outline !== path));
                    }
                  } else {
                    if (value) {
                      setSelectedOutlines([...selectedOutlines, path]);
                    }
                  }
                }}
                moveOutlineInward={moveOutlineInward}
                moveOutlineBeforeTarget={moveOutlineBeforeTarget}
                moveOutlineAfterTarget={moveOutlineAfterTarget}
              />
            ))}
            {isAddingNewOutline && activeOutlinePath === null && (
              <DataElementWrapper className="bookmark-outline-single-container editing">
                <OutlineContent
                  isAdding={true}
                  text={''}
                  onCancel={() => setAddingNewOutline(false)}
                />
              </DataElementWrapper>
            )}
          </div>
        </DndProvider>

        {isOutlineEditable &&
          <DataElementWrapper
            className="bookmark-outline-footer"
            dataElement={DataElements.OUTLINE_ADD_NEW_BUTTON_CONTAINER}
          >
            {isMultiSelectMode ?
              <>
                <Button
                  className="multi-selection-button"
                  img="icon-menu-add"
                  disabled={selectedOutlines.length > 0 || isAddingNewOutline}
                  onClick={() => setAddingNewOutline(true)}
                />
                <Button
                  className="multi-selection-button"
                  img="icon-delete-line"
                  disabled={selectedOutlines.length === 0}
                  onClick={() => removeOutlines(selectedOutlines)}
                />
              </>
              :
              <Button
                className="bookmark-outline-control-button add-new-button"
                img="icon-menu-add"
                dataElement={DataElements.OUTLINE_ADD_NEW_BUTTON}
                disabled={isAddingNewOutline}
                label={`${t('action.add')} ${t('component.outlinePanel')}`}
                onClick={() => setAddingNewOutline(true)}
              />
            }
          </DataElementWrapper>
        }
      </OutlineContext.Provider>
    </div>
  );
};

export default React.memo(OutlinesPanel);
