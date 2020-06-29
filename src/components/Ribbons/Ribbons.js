import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Dropdown from 'components/Dropdown';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';

import Measure from 'react-measure';

import "./Ribbons.scss";

const Ribbons = ({ toolbarGroups, currentToolbarGroup, setToolbarGroup }) => {
  const [t] = useTranslation();
  const [ribbonsWidth, setRibbonsWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false);
  const ribbonsRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (ribbonsRef?.current && containerRef?.current) {
      const ribbonsRight = ribbonsRef.current.getBoundingClientRect().right;
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const remainingSpace = ribbonsRight - containerLeft;
      if (remainingSpace - ribbonsWidth > 0) {
        setHasEnoughSpace(true);
      } else {
        setHasEnoughSpace(false);
      }
    }
  }, [ribbonsWidth, containerWidth, ribbonsRef, containerRef]);

  if (toolbarGroups.length <= 1) {
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
        <div
          className="ribbons-container"
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
                  "ribbons": true,
                  "is-hidden": !hasEnoughSpace,
                })}
              >
                {toolbarGroups.map(key =>
                  <button
                    key={key}
                    data-element={`${key}`}
                    className={classNames({
                      "ribbon-group": true,
                      "active": key === currentToolbarGroup,
                    })}
                    onClick={() => {
                      setToolbarGroup(key);
                    }}
                  >
                    {t(`option.toolbarGroup.${key}`)}
                  </button>)}
              </div>
            )}
          </Measure>
          <div
            className={classNames({
              "ribbons": true,
              "is-hidden": hasEnoughSpace,
            })}
          >
            <Dropdown
              items={toolbarGroups}
              translationPrefix="option.toolbarGroup"
              currentSelectionKey={currentToolbarGroup}
              onClickItem={toolbarGroup => {
                setToolbarGroup(toolbarGroup);
              }}
            />
          </div>
        </div>
      )}
    </Measure>
  );
};

const mapStateToProps = state => ({
  toolbarGroups: selectors.getEnabledToolbarGroups(state),
  currentToolbarGroup: selectors.getCurrentToolbarGroup(state),
});

const mapDispatchToProps = {
  setToolbarGroup: actions.setToolbarGroup,
};

const ConnectedRibbons = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Ribbons);

export default ConnectedRibbons;