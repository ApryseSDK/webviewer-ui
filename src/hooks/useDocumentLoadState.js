import { useEffect, useState } from 'react';
import core from 'core';

export default function useDocumentLoadState() {
  const [documentLoaded, setDocumentLoaded] = useState(!!core.getDocument());
  useEffect(() => {
    const onLoad = () => setDocumentLoaded(true);
    const onUnload = () => setDocumentLoaded(false);
    core.addEventListener('documentLoaded', onLoad);
    core.addEventListener('documentUnloaded', onUnload);
    return () => {
      core.removeEventListener('documentLoaded', onLoad);
      core.removeEventListener('documentUnloaded', onUnload);
    };
  }, []);
  return documentLoaded;
}