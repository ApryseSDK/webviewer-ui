import React from 'react';
import core from 'core';
import PageRotationControls from './PageRotationControls'

function PageRotationControlsContainer(props) {
  const { pageNumbers } = props;

  const rotateClockwise = () => {
    core.rotatePages(pageNumbers, window.Core.PageRotation.e_90);
  };

  const rotateCounterClockwise = () => {
    core.rotatePages(pageNumbers, window.Core.PageRotation.e_270);
  };

  return (
    <PageRotationControls
      rotateClockwise={rotateClockwise}
      rotateCounterClockwise={rotateCounterClockwise}
    />
  )
}

export default PageRotationControlsContainer;