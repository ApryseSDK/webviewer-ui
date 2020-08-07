import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import ResizeBar from 'components/ResizeBar';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';

import { motion, AnimatePresence } from "framer-motion";
import { isSafari } from 'src/helpers/device';

import './RightPanel.scss';

const RightPanel = () => {
  const [
    isOpen,
    isDisabled,
  ] = useSelector(
    state => [
      selectors.isElementOpen(state, 'rightPanel'),
      selectors.isElementDisabled(state, 'rightPanel'),
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

  const isVisible = !(!isOpen || isDisabled) || true;

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
              minWidth={100}
              onResize={_width => {
                dispatch(actions.setNotesPanelWidth(_width));
              }}
              leftDirection
            />}
          <div>hello</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RightPanel;
