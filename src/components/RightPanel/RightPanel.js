import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import ResizeBar from 'components/ResizeBar';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';

import { motion, AnimatePresence } from "framer-motion";
import { isSafari } from 'src/helpers/device';

import './RightPanel.scss';

const RightPanel = ({ children, dataElement }) => {
  const [
    isOpen,
    isDisabled,
  ] = useSelector(
    state => [
      selectors.isElementOpen(state, dataElement),
      selectors.isElementDisabled(state, dataElement),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const isTabletAndMobile = useMedia(
    // Media queries
    ['(max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  const isVisible = isOpen && !isDisabled;

  let animate = { width: 'auto' };
  if (isMobile) {
    animate = { width: '100vw' };
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="right-panel"
          initial={{ width: '0px' }}
          animate={animate}
          exit={{ width: '0px' }}
          transition={{ ease: "easeOut", duration: isSafari ? 0 : 0.25 }}
        >
          {!isTabletAndMobile &&
            <ResizeBar
              minWidth={293}
              onResize={_width => {
                dispatch(actions.setSearchPanelWidth(_width));
              }}
              leftDirection
            />}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RightPanel;
