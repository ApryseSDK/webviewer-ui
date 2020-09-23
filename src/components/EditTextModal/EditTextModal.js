  
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-swipeable';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';

import defaultTool from 'constants/defaultTool';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import AutoResizeTextarea from 'components/NoteTextarea/AutoResizeTextarea';

import './EditTextModal.scss';

function EditTextModal() {
  const [isDisabled, isOpen] = useSelector(state => [
    selectors.isElementDisabled(state, 'editTextModal'),
    selectors.isElementOpen(state, 'editTextModal'),
  ]);

  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [newText, setNewText] = useState('');
  // Note: core.getSelectedTextQuads() to store selected text coordinates in the following format
  // ie. {1:[{x1: 81, x2: 553, x3: 553, x4: 81, y1: 608, y2: 608, y3: 592, y4: 592, }, {...}]}
  // when storing in textCoordinates, we take off the wrapper object and only store array
  const [textCoordinates, setTextCoordinates] = useState([]);

  const closeModal = () => {
    dispatch(actions.closeElement('editTextModal'));
    setNewText('');
    core.setToolMode(defaultTool);
  };

  useEffect(
    () => {

      const storeConvertedPDFCoordinates = () => {
        // core.getSelectedTextQuads() returns 4 coordinates pair
        // (x4,y4)---(x3,y3)
        //   |          |
        // (x1,y1)---(x2,y2)
        // Firstly convert it to PDF coordinates and then store it in a flat structure
        const textCoordinates = core.getSelectedTextQuads();
        // Example:
        // textCoordinates = {
        //   1: [
        //     {x1: 32, y1: 582, x2: 67.28, y2: 582, x3: 67.28,4: 32, y1: 582, y2: 582, y3: 565, y4: 565},
        //     {x1: 32, x2: 68, x3: 68, x4: 32, y1: 595, y2: 595, y3: 579, y4: 579},
        //   ]
        // }
        // convert to a flat structure
        // textCoordinates = [{x1:32, x2:1, y1:582, y2:2, pageNum:1}, {x1:1, x2:1, y1:2, y2:2, pageNum:1}]

        if (textCoordinates) {
          const convertedTextCoordinates = [];
          Object.keys(textCoordinates).forEach(pageNum => {
            textCoordinates[pageNum].forEach(rect => {
              const point1 = window.docViewer.getDocument().getPDFCoordinates(pageNum, rect.x1, rect.y1);
              const point2 = window.docViewer.getDocument().getPDFCoordinates(pageNum, rect.x3, rect.y3);
              convertedTextCoordinates.push({ x1: point1.x, x2: point2.x, y1: point1.y, y2: point2.y,pageNum:Number(pageNum) });
            });
          });
          setTextCoordinates(convertedTextCoordinates);
        }
      };

      if (isOpen) {
        //  prepopulate selected text
        setNewText(core.getSelectedText());
        // convert and store selected text coordinates
        storeConvertedPDFCoordinates();
      }
    },
    [isOpen]
  );



  const updateText = e => {
    e.preventDefault();
    window.PDFNet.runWithCleanup(async() => {
      const doc = await window.docViewer.getDocument().getPDFDoc();
      // Treat each line as a rectangle region and update them separately
      const lines = newText.split(/\r?\n/);
      doc.initSecurityHandler();
      doc.lock();
      const PDFNet = window.PDFNet;
      // Note: If the number of lines are more than number of rects defined in textCoordinates, then we just ignore the rest
      if (textCoordinates && textCoordinates.length > 0) {
        for (let i=0; i<textCoordinates.length; i++) {
          const { x1, x2, y1, y2, pageNum } = textCoordinates[i];
          const [page, replacer, region] = await Promise.all([
            doc.getPage(pageNum),
            PDFNet.ContentReplacer.create(),
            PDFNet.Rect.init(x1, y1, x2, y2)
          ]);
          replacer.addText(region, lines[i]);
          replacer.process(page);
          replacer.destroy();
        }

        // clear the cache
        window.docViewer.refreshAll();
        // update viewer with new document
        window.docViewer.updateView();
        // Annotations may contain text so we need to regenerate
        // our text representation
        window.docViewer.getDocument().refreshTextData();
      }
      // doc.unlock();
    });
    closeModal();
  };

  const changeHandler = e => {
    setNewText(e.target.value);
  };

  const keyDownHandler = e => {
    // (Cmd/Ctrl + Enter)
    if ((e.metaKey || e.ctrlKey) && e.which === 13) {
      updateText(e);
    }
  };

  const modalClass = classNames({
    Modal: true,
    EditTextModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <FocusTrap locked={isOpen}>
        <div className={modalClass} data-element="editTextModal" onMouseDown={closeModal}>
          <div className="container" onMouseDown={e => e.stopPropagation()}>
            <div className="swipe-indicator" />
            <p className="textareaLabel">{t('message.enterReplacementText')}</p>
            <AutoResizeTextarea value={newText} onChange={changeHandler} onKeyDown={keyDownHandler} />
            <div className="editing-controls">
              <button className="button cancel-button editing-pad" onClick={closeModal}>
                {t('action.cancel')}
              </button>
              <button className="button editing-button" onClick={updateText}>
                {t('action.save')}
              </button>
            </div>
          </div>
        </div>
      </FocusTrap>
    </Swipeable>
  );
}

export default EditTextModal;