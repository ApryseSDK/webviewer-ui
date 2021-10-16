import React, { useCallback } from 'react';
import PageReplacementModal from './PageReplacementModal';

function PageReplacementModalContainer(props) {
  const { closePageReplacement, ...rest } = props;

  const closeModal = useCallback(() => {
    closePageReplacement();
  }, [closePageReplacement]);

  const newProps = {
    ...rest,
    closeModal,
  };

  return <PageReplacementModal {...newProps} />;
}

export default PageReplacementModalContainer;