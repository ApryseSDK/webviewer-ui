import React, { useCallback, useEffect } from 'react';
import Model3DModal from './Model3DModal';

function Model3DModalContainer(props) {
  const { close3DModal, ...rest } = props;

  const closeModal = useCallback(() => {
    close3DModal();
  }, [close3DModal]);

  const newProps = {
    ...rest,
    closeModal,
  };

  return <Model3DModal {...newProps} />;
}

export default Model3DModalContainer;
