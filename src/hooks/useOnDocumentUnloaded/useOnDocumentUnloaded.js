import React from 'react';
import core from 'core';

const useOnDocumentUnloaded = (callback) => {
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