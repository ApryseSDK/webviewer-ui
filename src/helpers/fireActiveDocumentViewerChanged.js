import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';

export default function fireActiveDocumentViewerChanged(previousDocumentViewerKey, activeDocumentViewerKey) {
  fireEvent(Events.ACTIVE_DOCUMENT_VIEWER_CHANGED, {
    activeDocumentViewerKey,
    previousDocumentViewerKey
  });
}