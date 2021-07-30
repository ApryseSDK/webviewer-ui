import React from 'react';
import core from 'core';
import PageInsertionControls from './PageInsertionControls';

function PageInsertionControlsContainer(props) {
  const { pageNumbers } = props;

  const getPageDimensions = () => {
    return {
      width: core.getPageWidth(pageNumbers[0]),
      height: core.getPageHeight(pageNumbers[0])
    }
  };

  const insertAbove = () => {
    let pageDimensions = getPageDimensions()
    core.insertBlankPages(pageNumbers, pageDimensions.width, pageDimensions.height);
  };

  const insertBelow = () => {
    let pageDimensions = getPageDimensions()
    let newPageNumbers = pageNumbers.map((page)=> page + 1)
    core.insertBlankPages(newPageNumbers, pageDimensions.width, pageDimensions.height);
  };

  return (
    <PageInsertionControls 
      insertAbove={insertAbove}
      insertBelow={insertBelow}
    />
  )
};

export default PageInsertionControlsContainer;