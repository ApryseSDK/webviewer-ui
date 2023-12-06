import React, { useCallback } from 'react';
import ContentEditLinkModal from './ContentEditLinkModal';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'src/redux/actions';

const ContentEditLinkModalContainer = () => {
  const [
    isOpen,
    contentBoxEditor,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, DataElements.CONTENT_EDIT_LINK_MODAL),
    selectors.getContentBoxEditor(state),
  ]);

  const dispatch = useDispatch();

  let existingLinkUrl = '';
  if (contentBoxEditor) {
    existingLinkUrl = contentBoxEditor.hyperlink;
  }

  const closeModal = useCallback(() => {
    dispatch(actions.closeElement(DataElements.CONTENT_EDIT_LINK_MODAL));
    if (contentBoxEditor) {
      contentBoxEditor.blur();
    }
  }, [contentBoxEditor]);

  const addLink = useCallback((url) => {
    if (contentBoxEditor) {
      contentBoxEditor.insertHyperlink(url);
      contentBoxEditor.blur();
    }
  }, [contentBoxEditor]);

  return isOpen ? (<ContentEditLinkModal closeModal={closeModal} addLinkHandler={addLink} existingLink={existingLinkUrl} />) : null;
};

export default ContentEditLinkModalContainer;