import React, {
  useEffect,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import core from 'core';

const WidgetLocator = ({ rect }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const scrollViewContainer = core.getScrollViewElement();
    const handleScroll = () => {
      setShow(false);
    };

    scrollViewContainer.addEventListener('scroll', handleScroll);
    return () => scrollViewContainer.removeEventListener('scroll', handleScroll);
  });

  useEffect(() => {
    if (rect) {
      setTimeout(() => {
        // so that the locator won't disappear because of the scroll
        setShow(true);
      }, 50);

      setTimeout(() => {
        setShow(false);
      }, 700);
    }
  }, [rect]);

  return (
    show &&
    ReactDOM.createPortal(
      <div
        style={{
          position: 'absolute',
          top: rect.y1,
          left: rect.x1,
          width: rect.x2 - rect.x1,
          height: rect.y2 - rect.y1,
          border: '1px solid #00a5e4',
          zIndex: 100,
        }}
      />,
      document.getElementById('app')
    )
  );
};

export default WidgetLocator;
