import React, { useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { isMobileDevice } from 'helpers/device';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import OutlineContext from 'components/Outline/Context';
import OutlineListItem from '../OutlineListItem';
import Button from 'components/Button';
import TextButton from '../TextButton';
import OutlineContent from 'components/OutlineContent';
import DataElementWrapper from 'components/DataElementWrapper';

import useCore from 'hooks/useCore';
import outlineUtils from 'helpers/OutlineUtils';
import { shouldEndAccessibleReadingOrderMode } from 'helpers/accessibility';
import DataElements from 'constants/dataElement';
import defaultTool from 'constants/defaultTool';
import { workerTypes } from 'constants/types';
import actions from 'actions';
import selectors from 'selectors';

import '../../constants/bookmarksOutlinesShared.scss';
import './OutlinesPanel.scss';
import { OutlinesDragLayer } from './OutlinesDragLayer';
import classNames from 'classnames';
import { Virtuoso } from 'react-virtuoso';
import Spinner from 'components/Spinner';
import useDocumentLoadState from 'hooks/useDocumentLoadState';
import { getCurrentDestViewerCoord, getOutlineName, normalizeOutlineCoord } from 'src/helpers/outlinesPanelHelper';

const createOutlinesPanelComponents = (outlineScrollParentRef) => {
  const Scroller = React.forwardRef((props, ref) => {
    const setRef = (node) => {
      outlineScrollParentRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };
    return <div {...props} ref={setRef} />;
  });
  Scroller.displayName = 'OutlinesPanelScroller';

  return { Scroller };
};

const OutlinesPanel = ({ isTest = false }) => {
  const { core } = useCore();
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const panelRef = useRef();
  const nextPathRef = useRef(null);
  const outlinesPromiseRef = useRef(null);
  const outlineScrollParentRef = useRef(null);
  const hasMountedRef = useRef(false);

  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const featureFlags = useSelector(selectors.getFeatureFlags, shallowEqual);
  const isViewOnly = useSelector(selectors.isViewOnly);
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.OUTLINE_PANEL));
  const currentPage = useSelector((state) => selectors.getCurrentPage(state, activeDocumentViewerKey));
  const pageLabels = useSelector((state) => selectors.getPageLabels(state, activeDocumentViewerKey), shallowEqual);
  const outlines = useSelector((state) => selectors.getOutlines(state, activeDocumentViewerKey), shallowEqual);
  const outlineEditingEnabled = useSelector(selectors.getOutlineEditingEnabled);
  const shouldAutoExpandOutlines = useSelector(selectors.shouldAutoExpandOutlines);
  const outlinesStateMap = useSelector((state) => selectors.getOutlinesStateMap(state, activeDocumentViewerKey), shallowEqual);

  const documentLoaded = useDocumentLoadState();
  const [activeOutlinePath, setActiveOutlinePath] = useState(null);
  const [isAddingNewOutline, setIsAddingNewOutline] = useState(false);
  const [isOutlineEditable, setIsOutlineEditable] = useState(false);

  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedOutlines, setSelectedOutlines] = useState([]);

  const defaultDestText = 'Full Page';
  const areaDestinationText = 'Area Selection';
  const defaultDestCoord = { x: 0, y: 0 };
  const [currentDestPage, setCurrentDestPage] = useState(currentPage);
  const [currentDestText, setCurrentDestText] = useState(defaultDestText);
  const [currentDestCoord, setCurrentDestCoord] = useState(defaultDestCoord);

  const customizableUI = featureFlags.customizableUI;
  const outlinesNotLoaded = outlines === null || outlines === undefined;
  const TOOL_NAME = 'OutlineDestinationCreateTool';
  const tool = core.getTool(TOOL_NAME);

  useEffect(() => {
    if (!documentLoaded && outlinesPromiseRef.current) {
      outlinesPromiseRef.current.reject();
      outlinesPromiseRef.current = null;
    }
  }, [documentLoaded]);

  useEffect(() => {
    if (outlinesNotLoaded && documentLoaded) {
      const outlinesPromise = {};
      outlinesPromise.promise = new Promise((resolve) => {
        let isComplete = false;
        const onPromiseCompletion = () => {
          if (!isComplete) {
            isComplete = true;
            outlinesPromiseRef.current = null;
            resolve();
          }
        };

        outlinesPromise.resolve = onPromiseCompletion;
        outlinesPromise.reject = onPromiseCompletion;

        core.getOutlines((outlines, activeDocumentViewerKey) => {
          if (isComplete) {
            return;
          }
          outlinesPromiseRef.current = null;
          dispatch(actions.setOutlines(outlines, activeDocumentViewerKey));
          resolve();
        }, activeDocumentViewerKey);
      });
      outlinesPromiseRef.current = outlinesPromise;
    }
  }, [core, outlinesNotLoaded, documentLoaded]);

  useLayoutEffect(() => {
    setIsAddingNewOutline(false);

    if (nextPathRef.current !== null) {
      setActiveOutlinePath(nextPathRef.current);
      nextPathRef.current = null;
    }

    const shouldResetMultiSelectedMode = !outlines || outlines?.length === 0;
    if (shouldResetMultiSelectedMode) {
      setIsMultiSelectMode(false);
    }
  }, [outlines]);

  useEffect(() => {
    const workerType = core.getType();
    const isSupportedType = (
      workerType === workerTypes.PDF ||
      workerType === workerTypes.IMAGE
    );

    const evaluateOutlineEditable = () => core.isFullPDFEnabled() && isSupportedType && outlineEditingEnabled && !isViewOnly;

    setIsOutlineEditable(evaluateOutlineEditable());

    const onDocumentLoaded = () => {
      setIsOutlineEditable(evaluateOutlineEditable());
    };

    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => core.removeEventListener('documentLoaded', onDocumentLoaded);
  }, [outlineEditingEnabled, core]);

  const isRenamingAnyOutline = useMemo(() => {
    if (!outlinesStateMap) {
      return false;
    }
    return Object.values(outlinesStateMap).some(
      (state) => state?.isRenaming || state?.isChangingDest
    );
  }, [outlinesStateMap]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
    } else {
      // If we just switched to a new viewer, reset panel editing and selection states
      setIsAddingNewOutline(false);
      setIsMultiSelectMode(false);
      setSelectedOutlines([]);
      setCurrentDestPage(currentPage);
      setCurrentDestText(defaultDestText);
      setCurrentDestCoord(defaultDestCoord);
      setActiveOutlinePath(null);

      if (outlinesStateMap) {
        Object.keys(outlinesStateMap).forEach((outlinePath) => {
          const map = outlinesStateMap[outlinePath];
          if (map?.isChangingDest || map?.isRenaming) {
            dispatch(actions.setOutlinesStateMap(outlinePath, { isChangingDest: false, isRenaming: false }, activeDocumentViewerKey));
          }
        });
      }
    }

    // Reset event listeners
    const onSetDestination = (annotation) => {
      setCurrentDestText(annotation['IsText'] ? annotation.getCustomData('trn-annot-preview') : areaDestinationText);
      setCurrentDestCoord({ x: annotation['X'], y: annotation['Y'] });
      setCurrentDestPage(annotation['PageNumber']);
    };

    const onOutlinesBookmarksChanged = () => {
      core.getOutlines((outlines, activeDocumentViewerKey) => {
        dispatch(actions.setOutlines(outlines, activeDocumentViewerKey));
      }, activeDocumentViewerKey);
    };

    const onDocumentLoaded = () => {
      setActiveOutlinePath(null);
    };

    core.addEventListener('outlineSetDestination', onSetDestination);
    window.addEventListener('outlineBookmarksChanged', onOutlinesBookmarksChanged);
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => {
      core.removeEventListener('outlineSetDestination', onSetDestination);
      window.removeEventListener('outlineBookmarksChanged', onOutlinesBookmarksChanged);
      core.removeEventListener('documentLoaded', onDocumentLoaded);
    };
  }, [activeDocumentViewerKey]);

  useEffect(() => {
    // deselect outlines when clicking inside of the outline panel
    const handlePanelClick = (event) => {
      if (event.target.classList.contains('bookmark-outline-row')) {
        setActiveOutlinePath(null);
        setSelectedOutlines([]);
      }
    };

    if (panelRef.current) {
      panelRef.current.addEventListener('click', handlePanelClick);
    }

    return () => {
      if (panelRef.current) {
        panelRef.current.removeEventListener('click', handlePanelClick);
      }
    };
  }, []);

  const addNewOutline = async (name) => {
    const defaultName = t('message.untitled');
    const outlineName = getOutlineName({
      name,
      currentDestText,
      defaultDestText,
      areaDestinationText,
      defaultName,
    });

    const doc = core.getDocumentViewer().getDocument();
    const viewerCoords = getCurrentDestViewerCoord(doc, currentDestPage, currentDestCoord);
    const pageRotation = doc.getPageRotation(currentDestPage) / 90;
    const { x, y } = normalizeOutlineCoord(viewerCoords, pageRotation);
    if (outlines.length === 0) {
      await outlineUtils.addRootOutline(outlineName, currentDestPage, x, y, 0, activeDocumentViewerKey);
    } else {
      await outlineUtils.addNewOutline(outlineName, activeOutlinePath, currentDestPage, x, y, 0, activeDocumentViewerKey);
    }

    updateOutlines();
  };

  const updateOutlines = () => {
    shouldEndAccessibleReadingOrderMode();
    core.getOutlines((outlines, key) => {
      dispatch(actions.setOutlines(outlines, key));
    }, activeDocumentViewerKey);
    clearOutlineDestination();
  };

  const clearOutlineDestination = () => {
    core.setToolMode(defaultTool);
    setCurrentDestText(defaultDestText);
    setCurrentDestCoord(defaultDestCoord);
    setCurrentDestPage(currentPage);
    tool.clearOutlineDestination();
  };

  const updateOutlineDest = async (outlinePath) => {
    const doc = core.getDocumentViewer().getDocument();
    const pageRotation = doc.getPageRotation(currentDestPage) / 90;
    const viewerCoords = getCurrentDestViewerCoord(doc, currentDestPage, currentDestCoord);
    const { x, y } = normalizeOutlineCoord(viewerCoords, pageRotation);
    await outlineUtils.setOutlineDestination(outlinePath, currentDestPage, x, y, 0, activeDocumentViewerKey);
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
    const dragPath = outlineUtils.getPath(dragOutline);
    const dropPath = outlineUtils.getPath(dropOutline);
    setSelectedOutlines([]);

    moveDirection.call(outlineUtils, dragPath, dropPath, activeDocumentViewerKey).then((path) => {
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
    await outlineUtils.setOutlineName(outlinePath, newName, activeDocumentViewerKey);
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
          await outlineUtils.deleteOutline(fullIndex, activeDocumentViewerKey);
        }
        updateOutlines();
        setActiveOutlinePath(null);
        setSelectedOutlines([]);
      },
    };
    dispatch(actions.showWarningMessage(confirmationWarning));
  };

  const virtuosoComponents = useMemo(
    () => createOutlinesPanelComponents(outlineScrollParentRef),
    [outlineScrollParentRef]
  );

  const renderOutlineItem = useCallback((index, outline) => (
    <OutlineListItem
      key={outlineUtils.getOutlineId(outline)}
      outline={outline}
      setSelectedOutlines={setSelectedOutlines}
      moveOutlineInward={moveOutlineInward}
      moveOutlineBeforeTarget={moveOutlineBeforeTarget}
      moveOutlineAfterTarget={moveOutlineAfterTarget}
    />
  ), [moveOutlineAfterTarget, moveOutlineBeforeTarget, moveOutlineInward, setSelectedOutlines]);

  if (isDisabled) {
    return null;
  }

  const testModeProps = isTest ? { initialItemCount: outlines?.length } : {};

  return (
    <div
      className={classNames('Panel OutlinesPanel bookmark-outline-panel', { 'modular-ui-panel': customizableUI })}
      data-element={DataElements.OUTLINE_PANEL} ref={panelRef}
    >
      <div className="bookmark-outline-panel-header">
        <h2 className="header-title">
          {t('component.outlinesPanel')}
        </h2>
        {isOutlineEditable &&
          (isMultiSelectMode ?
            <TextButton
              className="bookmark-outline-control-button"
              dataElement={DataElements.OUTLINE_MULTI_SELECT}
              label={t('option.bookmarkOutlineControls.done')}
              disabled={isAddingNewOutline}
              onClick={() => setIsMultiSelectMode(false)}
              ariaLabel={`${t('option.bookmarkOutlineControls.done')} ${t('action.edit')}`}
            />
            :
            <TextButton
              className="bookmark-outline-control-button"
              dataElement={DataElements.OUTLINE_MULTI_SELECT}
              label={t('option.bookmarkOutlineControls.edit')}
              disabled={isAddingNewOutline || outlinesNotLoaded || outlines.length === 0}
              onClick={() => {
                setIsMultiSelectMode(true);
                setSelectedOutlines([]);
              }}
              ariaLabel={`${t('action.edit')} ${t('component.outlinesPanel')}`}
            />
          )
        }
      </div>
      {outlinesNotLoaded && documentLoaded ? (
        <Spinner inPanel width={'40px'} height={'40px'} />
      ) : (
        <OutlineContext.Provider
          value={{
            currentDestPage: pageLabels[currentDestPage - 1],
            currentDestText,
            setActiveOutlinePath,
            activeOutlinePath,
            isOutlineActive: (outline) => outlineUtils.getPath(outline) === activeOutlinePath,
            setIsAddingNewOutline,
            isAddingNewOutline,
            selectedOutlines,
            isMultiSelectMode,
            shouldAutoExpandOutlines,
            isOutlineEditable,
            addNewOutline,
            updateOutlines,
            renameOutline,
            updateOutlineDest,
            removeOutlines,
            outlineScrollParentRef,
          }}
        >
          <DndProvider backend={isMobileDevice ? TouchBackend : HTML5Backend}>
            <OutlinesDragLayer />

            <div className="bookmark-outline-row">
              {!isAddingNewOutline && (outlinesNotLoaded || outlines?.length === 0) &&
                <div className="msg msg-no-bookmark-outline">{t('message.noOutlines')}</div>
              }
              {isAddingNewOutline && activeOutlinePath === null && (
                <DataElementWrapper className="bookmark-outline-single-container editing">
                  <OutlineContent
                    isAdding={true}
                    text={''}
                    onCancel={() => setIsAddingNewOutline(false)}
                  />
                </DataElementWrapper>
              )}
              <Virtuoso
                className={classNames({ 'small-outlines-list': isAddingNewOutline })}
                data={outlines || []}
                components={virtuosoComponents}
                computeItemKey={(_, outline) => outlineUtils.getOutlineId(outline)}
                itemContent={renderOutlineItem}
                {...testModeProps}
              />
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
                    ariaLabel={`${t('action.add')} ${t('component.outlinesPanel')}`}
                    disabled={selectedOutlines.length > 0 || isAddingNewOutline || isRenamingAnyOutline}
                    onClick={() => setIsAddingNewOutline(true)}
                  />
                  <Button
                    className="multi-selection-button"
                    img="icon-delete-line"
                    disabled={selectedOutlines.length === 0 || isRenamingAnyOutline}
                    onClick={() => removeOutlines(selectedOutlines)}
                  />
                </>
                :
                <TextButton
                  className="bookmark-outline-control-button add-new-button"
                  img="icon-menu-add"
                  dataElement={DataElements.OUTLINE_ADD_NEW_BUTTON}
                  disabled={isAddingNewOutline || isRenamingAnyOutline}
                  label={`${t('action.add')} ${t('component.outlinePanel')}`}
                  onClick={() => setIsAddingNewOutline(true)}
                  ariaLabel={`${t('action.add')} ${t('component.outlinesPanel')}`}
                />
              }
            </DataElementWrapper>
          }
        </OutlineContext.Provider>
      )}
    </div>
  );
};

export default React.memo(OutlinesPanel);
