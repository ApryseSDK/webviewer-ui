import React, { useEffect, useState, } from 'react';
import ReactDOM from 'react-dom';
import './WidgetLocator.scss';
import useCore from 'hooks/useCore';
import getRootNode from 'helpers/getRootNode';
const WidgetLocator = ({ rect }) => {
  const { core } = useCore();
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
        className="widget-locator-overlay"
        css={{
          top: rect.y1,
          left: rect.x1,
          width: rect.x2 - rect.x1,
          height: rect.y2 - rect.y1,
        }}
      />,
      getRootNode().querySelector('#app'),
    )
  );
};

export default WidgetLocator;
