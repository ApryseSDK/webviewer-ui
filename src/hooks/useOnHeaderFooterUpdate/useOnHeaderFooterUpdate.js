import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import { EditingStreamType } from 'constants/officeEditor';
import DataElements from 'constants/dataElement';

export default function useOnHeaderFooterUpdate() {
  const activeStream = useSelector(selectors.getOfficeEditorActiveStream);

  const dispatch = useDispatch();
  const [visiblePages, setVisiblePages] = useState([]);
  const [isHeaderControlsActive, setIsHeaderControlsActive] = useState(false);
  const [isFooterControlsActive, setIsFooterControlsActive] = useState(false);

  useEffect(() => {
    const onVisiblePagesChanged = (visiblePages) => {
      setVisiblePages(visiblePages);
    };

    const documentViewer = core.getDocumentViewer();

    // visible pages are updated before isOfficeEditorMode is set, so we need to get the first set of visible pages here.
    setVisiblePages(core.getDocumentViewer().getDisplayModeManager().getDisplayMode().getVisiblePages());

    documentViewer.addEventListener('visiblePagesChanged', onVisiblePagesChanged);
    dispatch(actions.openElement(DataElements.HEADER_FOOTER_CONTROLS_OVERLAY));
    return () => {
      documentViewer.removeEventListener('visiblePagesChanged', onVisiblePagesChanged);
      dispatch(actions.closeElement(DataElements.HEADER_FOOTER_CONTROLS_OVERLAY));
    };
  }, []);

  useEffect(() => {
    setIsHeaderControlsActive(activeStream === EditingStreamType.HEADER);
    setIsFooterControlsActive(activeStream === EditingStreamType.FOOTER);
  }, [activeStream]);

  return { visiblePages, isHeaderControlsActive, isFooterControlsActive };
}