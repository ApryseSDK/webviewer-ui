import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import core from 'core';
import DataElements from 'constants/dataElement';

export default function useOnHeaderFooterUpdate() {

  const dispatch = useDispatch();
  const [visiblePages, setVisiblePages] = useState([]);
  const [isHeaderControlsActive, setIsHeaderControlsActive] = useState(false);
  const [isFooterControlsActive, setIsFooterControlsActive] = useState(false);

  useEffect(() => {

    const onVisiblePagesChanged = (visiblePages) => {
      setVisiblePages(visiblePages);
    };

    const onActiveStreamChanged = (stream) => {
      setIsHeaderControlsActive(stream === 'header');
      setIsFooterControlsActive(stream === 'footer');
    };

    const documentViewer = core.getDocumentViewer();
    const contentSelectTool = documentViewer.getTool('OfficeEditorContentSelect');

    // visible pages are updated before isOfficeEditorMode is set, so we need to get the first set of visible pages here.
    setVisiblePages(core.getDocumentViewer().getDisplayModeManager().getDisplayMode().getVisiblePages());

    documentViewer.addEventListener('visiblePagesChanged', onVisiblePagesChanged);
    contentSelectTool.addEventListener('activeStreamChanged', onActiveStreamChanged);
    dispatch(actions.openElement(DataElements.HEADER_FOOTER_CONTROLS_OVERLAY));
    return () => {
      documentViewer.removeEventListener('visiblePagesChanged', onVisiblePagesChanged);
      contentSelectTool.removeEventListener('activeStreamChanged', onActiveStreamChanged);
      dispatch(actions.closeElement(DataElements.HEADER_FOOTER_CONTROLS_OVERLAY));
    };
  }, []);

  return { visiblePages, isHeaderControlsActive, isFooterControlsActive };
}