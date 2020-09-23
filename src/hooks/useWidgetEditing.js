import { useState, useEffect } from 'react';
import core from 'core';

export default function useWidgetEditing() {
  const [isEditingWidgets, setIsEditingWidgets] = useState(false);

  useEffect(() => {
    const onWidgetEditingStarted = () => {
      setIsEditingWidgets(true);
    };
    const onWidgetEditingEnded = () => {
      setIsEditingWidgets(false);
    };

    core.addEventListener('editingStarted', onWidgetEditingStarted);
    core.addEventListener('editingEnded', onWidgetEditingEnded);
    return () => {
      core.removeEventListener('editingStarted', onWidgetEditingStarted);
      core.removeEventListener('editingEnded', onWidgetEditingEnded);  
    }
  }, []);

  return isEditingWidgets;
}
