import { useEffect, useState } from 'react';
import useCore from './useCore';

export default function useDocumentLoadState() {
  const { core } = useCore();
  const [documentLoaded, setDocumentLoaded] = useState(!!core.getDocument());
  useEffect(() => {
    setDocumentLoaded(!!core.getDocument());
    const onLoad = () => setDocumentLoaded(true);
    const onUnload = () => setDocumentLoaded(false);
    core.addEventListener('documentLoaded', onLoad);
    core.addEventListener('documentUnloaded', onUnload);
    return () => {
      core.removeEventListener('documentLoaded', onLoad);
      core.removeEventListener('documentUnloaded', onUnload);
    };
  }, [core]);
  return documentLoaded;
}