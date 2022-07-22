import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import Dropdown from 'components/Dropdown';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import core from 'core';

import Measure from 'react-measure';

import "./Ribbons.scss";

const Ribbons = () => {
  const toolbarGroups = useSelector(selectors.getEnabledToolbarGroups);
  const currentToolbarGroup = useSelector(selectors.getCurrentToolbarGroup);
  const customHeadersAdditionalProperties = useSelector(selectors.getCustomHeadersAdditionalProperties);
  const { t, ready: tReady } = useTranslation();
  const [ribbonsWidth, setRibbonsWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hasEnoughCenteredSpace, setHasEnoughCenteredSpace] = useState(false);
  const ribbonsRef = useRef();
  const containerRef = useRef();
  const dispatch = useDispatch();

  const setToolbarGroup = useCallback((group, pickTool) => {
    dispatch(actions.setToolbarGroup(group, pickTool));
  }, [dispatch])

  // don't pick tool for the edit group because the first button in the group is the form editing button,
  // which is an action button that does not have an active background
  const shouldPickTool = toolbarGroup => toolbarGroup !== 'toolbarGroup-Edit';

  const toggleFormFieldCreationMode = toolGroup => {
    const formFieldCreationManager = core.getFormFieldCreationManager();
    if (toolGroup === 'toolbarGroup-Forms') {
      if (!formFieldCreationManager.isInFormFieldCreationMode()) {
        formFieldCreationManager.startFormFieldCreationMode();
      }
    } else if (formFieldCreationManager.isInFormFieldCreationMode()) {
      formFieldCreationManager.endFormFieldCreationMode();
    }
  };

  useEffect(() => {
    // When we initialize the Viewer we don't want to start off in the Forms tab as
    // this may confuse users, since in Forms creation mode regular annotations are hidden.
    // If for some reason we are in this mode on init, we default to switching to the Annotate tab
    if (currentToolbarGroup === 'toolbarGroup-Forms') {
      setToolbarGroup('toolbarGroup-Annotate', shouldPickTool('toolbarGroup-Annotate'));
    }
  }, [])

  useEffect(() => {
    if (ribbonsRef?.current && containerRef?.current) {
      const ribbonsWidth = ribbonsRef.current.getBoundingClientRect().width + 4;
      const containerWidth = containerRef.current.getBoundingClientRect().width;

      const spaceLeftOfContainer = window.innerWidth / 2 - containerRef.current.getBoundingClientRect().left;
      const spaceForLeftHalfOfRibbons = ribbonsWidth / 2;
      // If there is enough space for the Ribbon to fit in half the screen, move it to the center
      // otherwise keep it next to the buttons on the left
      const spaceForRibbons = Math.max(spaceLeftOfContainer, spaceForLeftHalfOfRibbons);

      ribbonsRef.current.style.left = spaceForRibbons + 'px';

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

  const getToolbarTranslationString = (toolbarGroup) => {
    const customHeaderProperties = customHeadersAdditionalProperties[toolbarGroup];
    if (customHeaderProperties && customHeaderProperties.name) {
      return customHeaderProperties.name;
    }
    return `option.toolbarGroup.${toolbarGroup}`;
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
          className={classNames('ribbons-container centered-on-empty-space')}
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
                  'is-hidden': !hasEnoughCenteredSpace,
                })}
              >
                {toolbarGroups.map(toolbarGroup => (
                  <button
                    key={toolbarGroup}
                    data-element={`${toolbarGroup}`}
                    className={classNames({
                      'ribbon-group': true,
                      'active': toolbarGroup === currentToolbarGroup,
                    })}
                    onClick={() => {
                      toggleFormFieldCreationMode(toolbarGroup);
                      setToolbarGroup(toolbarGroup, shouldPickTool(toolbarGroup));
                    }}
                  >
                    {t(getToolbarTranslationString(toolbarGroup))}
                  </button>
                ))
                }
              </div>
            )}
          </Measure>
          <div
            className={classNames({
              'ribbons': true,
              'is-hidden': hasEnoughCenteredSpace,
            })}
          >
            <Dropdown
              dataElement="ribbonsDropdown"
              items={toolbarGroups}
              getTranslationLabel={getToolbarTranslationString}
              currentSelectionKey={currentToolbarGroup}
              onClickItem={toolbarGroup => {
                toggleFormFieldCreationMode(toolbarGroup);
                setToolbarGroup(toolbarGroup, shouldPickTool(toolbarGroup));
              }}
            />
          </div>
        </DataElementWrapper>
      )}
    </Measure>
  );
};

export default Ribbons;