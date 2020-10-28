import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import Dropdown from 'components/Dropdown';
import ActionButton from 'components/ActionButton';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import useWidgetEditing from 'hooks/useWidgetEditing';
import core from 'core';

import Measure from 'react-measure';

import "./Ribbons.scss";

const Ribbons = () => {
  const toolbarGroups = useSelector(selectors.getEnabledToolbarGroups);
  const currentToolbarGroup = useSelector(selectors.getCurrentToolbarGroup);
  const { t, ready: tReady } = useTranslation();
  const [ribbonsWidth, setRibbonsWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false);
  const [hasEnoughCenteredSpace, setHasEnoughCenteredSpace] = useState(false);
  const isEditingWidgets = useWidgetEditing();
  const ribbonsRef = useRef();
  const containerRef = useRef();
  const dispatch = useDispatch();

  const setToolbarGroup = useCallback((group, pickTool) => {
    dispatch(actions.setToolbarGroup(group, pickTool));
  }, [dispatch])

  // don't pick tool for the edit group because the first button in the group is the form editing button,
  // which is an action button that does not have an active background
  const shouldPickTool = toolbarGroup => toolbarGroup !== 'toolbarGroup-Edit';

  useEffect(() => {
    if (ribbonsRef?.current && containerRef?.current) {
      // const ribbonsRight = ribbonsRef.current.getBoundingClientRect().right;
      const ribbonsWidth = ribbonsRef.current.getBoundingClientRect().width + 4;
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const ribbonsRight = ((window.innerWidth - ribbonsWidth) / 2) + ribbonsWidth;
      const remainingSpace = ribbonsRight - containerLeft;

      if (remainingSpace - ribbonsWidth > 0) {
        setHasEnoughSpace(true);
      } else {
        setHasEnoughSpace(false);
      }

      if (ribbonsWidth < containerWidth) {
        setHasEnoughCenteredSpace(true);
      } else {
        setHasEnoughCenteredSpace(false);
      }
    }
  }, [ribbonsWidth, containerWidth, ribbonsRef, containerRef]);

  if (toolbarGroups.length === 0 || !tReady) {
    return null;
  }

  return (
    <Measure
      bounds
      innerRef={containerRef}
      onResize={({ bounds }) => {
        setContainerWidth(bounds.width);
      }}
    >
      {({ measureRef }) => (
        <DataElementWrapper
          dataElement="ribbons"
          className={classNames({
            'ribbons-container': true,
            'centered-on-empty-space': !hasEnoughSpace,
          })}
          ref={measureRef}
        >
          <Measure
            bounds
            innerRef={ribbonsRef}
            onResize={({ bounds }) => {
              setRibbonsWidth(bounds.width);
            }}
          >
            {({ measureRef }) => (
              <div
                ref={measureRef}
                className={classNames({
                  'ribbons': true,
                  'is-hidden': !(hasEnoughSpace || hasEnoughCenteredSpace),
                })}
              >
                {isEditingWidgets ? (
                  <ExitWidgetEditingButton containerWidth={containerWidth} />
                ) : (
                  toolbarGroups.map(key => (
                    <button
                      key={key}
                      data-element={`${key}`}
                      className={classNames({
                        'ribbon-group': true,
                        'active': key === currentToolbarGroup,
                      })}
                      onClick={() => {
                        setToolbarGroup(key, shouldPickTool(key));
                      }}
                    >
                      {t(`option.toolbarGroup.${key}`)}
                    </button>
                  ))
                )}
              </div>
            )}
          </Measure>
          <div
            className={classNames({
              'ribbons': true,
              'is-hidden': hasEnoughCenteredSpace,
            })}
          >
            {isEditingWidgets ? (
              <ExitWidgetEditingButton containerWidth={containerWidth} />
            ) : (
              <Dropdown
                dataElement="ribbonsDropdown"
                items={toolbarGroups}
                translationPrefix="option.toolbarGroup"
                currentSelectionKey={currentToolbarGroup}
                onClickItem={toolbarGroup => {
                  setToolbarGroup(toolbarGroup, shouldPickTool(toolbarGroup));
                }}
              />
            )}
          </div>
        </DataElementWrapper>
      )}
    </Measure>
  );
};

function ExitWidgetEditingButton({ containerWidth }) {
  return (
    <ActionButton
      dataElement="exitFormEditingButton"
      label={containerWidth < 150 ? 'action.exit' : 'action.exitFormEditing'}
      onClick={() => {
        const widgetEditingManager = core.getWidgetEditingManager();
        widgetEditingManager.endEditing();
      }}
    />
  );
}

export default Ribbons;