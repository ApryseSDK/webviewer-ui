import { useState, useEffect } from 'react';
import  { getInstanceNode } from 'helpers/getRootNode';


function getWindowDimensions() {
  const isApryseWebViewerWebComponent = window.isApryseWebViewerWebComponent;
  const innerWidth = isApryseWebViewerWebComponent ? getInstanceNode().clientWidth : window.innerWidth;
  const innerHeight = isApryseWebViewerWebComponent ? getInstanceNode().clientHeight : window.innerHeight;

  return {
    width: innerWidth,
    height: innerHeight
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
