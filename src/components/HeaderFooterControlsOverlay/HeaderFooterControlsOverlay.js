import React from 'react';
import { createPortal } from 'react-dom';
import getRootNode from 'src/helpers/getRootNode';
import HeaderFooterControlsBar from './HeaderFooterControlsBar';
import PropTypes from 'prop-types';
import core from 'core';

import './HeaderFooterControlsOverlay.scss';

const propTypes = {
  visiblePages: PropTypes.arrayOf(PropTypes.number),
  isHeaderControlsActive: PropTypes.bool,
  isFooterControlsActive: PropTypes.bool,
};

const HeaderFooterControlsOverlay = ({ visiblePages, isHeaderControlsActive, isFooterControlsActive }) => {

  const portals = visiblePages.map((pageNumber) => {
    const pageSection = getRootNode().getElementById(`pageSection${pageNumber}`);
    if (!pageSection) {
      return null;
    }
    const headerPageType = core.getOfficeEditor().getHeaderPageType(pageNumber);
    const footerPageType = core.getOfficeEditor().getFooterPageType(pageNumber);

    return createPortal(
      <div key={pageNumber} className='HeaderFooterControlsOverlay'>
        <HeaderFooterControlsBar type='header' pageNumber={pageNumber} isActive={isHeaderControlsActive} layoutType={headerPageType} />
        <HeaderFooterControlsBar type='footer' pageNumber={pageNumber} isActive={isFooterControlsActive} layoutType={footerPageType} />
      </div>,
      pageSection
    );
  });

  return (
    <>
      {portals}
    </>
  );
};

HeaderFooterControlsOverlay.propTypes = propTypes;

export default HeaderFooterControlsOverlay;
