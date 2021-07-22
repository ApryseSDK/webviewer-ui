import React from 'react';
import PageInsertionControls from './PageInsertionControls';
import PageRotationControls from './PageRotationControls'
import './PageManipulationOverlay.scss'
import PageManipulationControls from './PageManipulationControls';



function PageManipulationOverlay(props) {
  const { pageNumbers } = props;

  return (
    <>
      <PageRotationControls pageNumbers={pageNumbers} />
      <div className='divider'></div>
      <PageInsertionControls />
      <div className='divider'></div>
      <PageManipulationControls pageNumbers={pageNumbers} />
    </>
  )
};

export default PageManipulationOverlay;