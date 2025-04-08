import { useState } from 'react';
import core from 'core';

const useOnDocumentFileNameEdit = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [extension, setExtension] = useState('');
  const [fileNameWithoutExtension, setFileNameWithoutExtension] = useState('');

  const startEditing = () => {
    const name = core.getDocument()?.getFilename();
    const nameArray = name?.split('.');
    const extension = `.${nameArray.pop()}`;
    setFileNameWithoutExtension(name.slice(0, -extension.length) || name);
    setExtension(extension);
    setIsEditing(true);
  };

  const finishEditing = () => {
    if (fileNameWithoutExtension) {
      core.getDocument()?.setFilename(`${fileNameWithoutExtension}${extension}`);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return {
    extension,
    isEditing,
    fileNameWithoutExtension,
    setFileNameWithoutExtension,
    startEditing,
    finishEditing,
    handleKeyDown,
  };
};

export default useOnDocumentFileNameEdit;
