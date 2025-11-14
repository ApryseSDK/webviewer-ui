import { useEffect, useState } from 'react';

/**
 * Will return true if the user is using keyboard navigation, or false if they
 * are using their mouse. The returned value will be true if the Tab key was
 * used more recently than mouse click, and false if not. You can also provide
 * custom behavior by passing your own observable.
 * @param {Object} observable Optional custom observable.
 */
export default function useAccessibleFocus(observable = tabObservable) {
  const [isUserTabbing, setIsUserTabbing] = useState(observable.value);

  useEffect(() => {
    return observable.subscribe(() => setIsUserTabbing(observable.value));
  }, [observable]);

  return isUserTabbing;
}

function createAccessibleFocusObservable() {
  let subscribers = [];
  let isUserTabbing = false;

  const notify = () => {
    subscribers.forEach((subscriber) => subscriber());
  };

  const setIsUserTabbing = (val) => {
    isUserTabbing = val;
    notify();
  };

  const handleFirstTab = (event) => {
    if (event.key === 'Tab') {
      setIsUserTabbing(true);
      tabToMouseListener();
    }
  };

  const handleFirstMouse = () => {
    setIsUserTabbing(false);
    mouseToTabListener();
  };

  const tabToMouseListener = () => {
    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleFirstMouse);
  };

  const mouseToTabListener = () => {
    window.removeEventListener('mousedown', handleFirstMouse);
    window.addEventListener('keydown', handleFirstTab);
  };

  const removeAllListeners = () => {
    window.removeEventListener('mousedown', handleFirstMouse);
    window.removeEventListener('keydown', handleFirstTab);
  };

  return {
    get value() {
      return isUserTabbing;
    },
    subscribe(subscriber) {
      const alreadyExists = subscribers.includes(subscriber);
      if (!alreadyExists) {
        subscribers.push(subscriber);
      }

      if (subscribers.length === 1) {
        isUserTabbing ? tabToMouseListener() : mouseToTabListener();
      }

      return () => {
        subscribers = subscribers.filter((s) => s !== subscriber);
        if (subscribers.length === 0) {
          removeAllListeners();
        }
      };
    }
  };
}

const tabObservable = createAccessibleFocusObservable();
