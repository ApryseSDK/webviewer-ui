import { useStore } from 'react-redux';
import { getHotkeysManager } from 'helpers/hotkeysManager';

const useHotkeysManager = () => {
  const store = useStore();
  return getHotkeysManager(store);
};

export default useHotkeysManager;