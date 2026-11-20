import React from 'react';
import { useInstanceCore } from 'hooks/useCore/useCore';

const useOnDocumentUnloaded = (callback) => {
  const core = useInstanceCore();
  React.useEffect(() => {
    const onDocumentUnloaded = () => {
      callback();
    };

    core.addEventListener('documentUnloaded', onDocumentUnloaded);

    return () => {
      core.removeEventListener('documentUnloaded', onDocumentUnloaded);
    };
  }, [callback]);
};

export { useOnDocumentUnloaded };