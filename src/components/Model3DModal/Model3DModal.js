import React, { useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import core from 'core';
import Choice from '../Choice/Choice';

import { Swipeable } from 'react-swipeable';
import './Model3DModal.scss';

const Model3DModal = ({
  fileInput,
  urlInput,
  error,
  setError,
  file,
  setFile,
  url,
  setURL,
  closeModal,
  isDisabled,
  isOpen,
}) => {
  const [t] = useTranslation();

  const [typeOfInput, setTypeOfInput] = useState('url');
  const [base64, setBase64] = useState('');
  const urlInputRadio = React.createRef();
  const fileInputRadio = React.createRef();

  const draw3DAnnotation = e => {
    const defaultW = 300;
    const defaultH = 300;

    const model3DAnnotation = new Annotations.Model3DAnnotation();
    model3DAnnotation.set3DData(base64);
    if (typeOfInput === 'url') {
      model3DAnnotation.set3DData(url, 'url');
    } else if (typeOfInput === 'file') {
    }
    //reset x and y position with current zoom level
    const zoom = window.documentViewer.getZoom();
    model3DAnnotation.X = e.layerX / zoom;
    model3DAnnotation.Y = e.layerY / zoom;
    model3DAnnotation.Width = defaultW;
    model3DAnnotation.Height = defaultH;
    model3DAnnotation.Author = core.getCurrentUser();
    model3DAnnotation.setPageNumber(window.documentViewer.getCurrentPage());
    core.addAnnotations([model3DAnnotation]);
    // const options = {
    //   pageNumber: model3DAnnotation.PageNumber,
    //   majorRedraw: true,
    // };
    core.drawAnnotationsFromList([model3DAnnotation]);
    core.removeEventListener('click', draw3DAnnotation);
  };

  const getExtension = fileName => {
    return fileName.split('.').pop();
  };

  const drawModel3DHandler = async e => {
    e.preventDefault();

    if (typeOfInput === 'url') {
      // convert url to base 64
      if (getExtension(url) !== 'glb') {
        setError({ ...error, ...{ 'urlError': t('Model3D.formatError') } });
        return;
      } else {
        const base64StrGenerator = async url => {
          // build base64 string from the given file url
          const urlToBase64Str = url => {
            return new Promise(function(resolve) {
              const xhr = new XMLHttpRequest();
              xhr.onload = async function() {
                const reader = new FileReader();
                reader.onloadend = function() {
                  resolve(reader.result);
                };
                await reader.readAsDataURL(xhr.response);
              };
              xhr.open('GET', url);
              xhr.responseType = 'blob';
              xhr.send();
            });
          };
          return await urlToBase64Str(url);
        };
        setBase64(await base64StrGenerator(url));
      }
    } else if (typeOfInput === 'file') {
      if (getExtension(file.name) !== 'glb') {
        setError({ ...error, ...{ 'urlError': t('Model3D.formatError') } });
        return;
      }
    }

    closeModal();
    core.setToolMode('Pan');
    const viewer = documentViewer.getViewerElement();
    viewer.style.cursor = 'crosshair';
    core.addEventListener('click', draw3DAnnotation);
  };

  const modalClass = classNames({
    Modal: true,
    Model3DModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  const handleFileChange = async event => {
    setTypeOfInput('file');
    const file = event.target.files[0];
    setFile(file);
    const fileToBase64 = file =>
      new Promise(() => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          return setBase64(reader.result);
        };
      });
    await fileToBase64(file);
    setError({});
    setURL('');
  };

  const handleURLChange = url => {
    setTypeOfInput('url');
    setURL(url.trim());
    setError('');
    fileInput.current.value = null;
  };

  const urlInputElement = (
    <input
      className="urlInput"
      type="url"
      ref={urlInput}
      value={url}
      onChange={e => handleURLChange(e.target.value)}
      onFocus={() => urlInputRadio.current.click()}
      placeholder={t('Model3D.enterurl')}
    />
  );

  const fileInputElement = (
    <input
      type="file"
      ref={fileInput}
      onChange={handleFileChange}
      accept=".glb"
      onFocus={() => fileInputRadio.current.click()}
    />
  );

  return isDisabled ? null : (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <div className={modalClass} data-element="Model3DModal" onMouseDown={closeModal}>
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <form>
            <div className="col">{t('Model3D.enterurlOrLocalFile')}</div>
            <Choice
              dataElement="3DAnnotationLink"
              id="3D-annotation-link"
              name="3DInput"
              className="inputWrapper"
              ref={urlInputRadio}
              radio
              label={urlInputElement}
              center
            />
            {error?.urlError && <p className="error">* {error.urlError}</p>}
            <Choice
              dataElement="3DAnnotationLocalFile"
              id="3D-annotation-file"
              name="3DInput"
              className="inputWrapper"
              ref={fileInputRadio}
              radio
              label={fileInputElement}
              center
            />
            {error?.fileError && <p className="error">* {error.fileError}</p>}
            <Button dataElement="linkSubmitButton" label={t('action.draw')} onClick={drawModel3DHandler} />
          </form>
        </div>
      </div>
    </Swipeable>
  );
};

export default Model3DModal;
