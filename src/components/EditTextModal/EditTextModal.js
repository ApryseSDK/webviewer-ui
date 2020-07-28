import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-swipeable';

import defaultTool from 'constants/defaultTool';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import AutoResizeTextarea from 'components/NoteTextarea/AutoResizeTextarea';

import './EditTextModal.scss';

const EditTextModal = () => {
  const [isDisabled, isOpen, currentPage] = useSelector(state => [
    selectors.isElementDisabled(state, 'editTextModal'),
    selectors.isElementOpen(state, 'editTextModal'),
    selectors.getCurrentPage(state),
  ]);

  const [t] = useTranslation();
  const dispatch = useDispatch();
  const newTextInput = React.createRef();
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
      if (isOpen) {
        //  prepopulate selected text
        setNewText(core.getSelectedText());
        // convert and store selected text coordinates
        storeConvertedPDFCoordinates();
      }
    },
    [isOpen]
  );

  // core.getSelectedTextQuads() returns 4 coordinates pair
  // (x4,y4)---(x3,y3)
  //   |          |
  // (x1,y1)---(x2,y2)
  // we need to first convert it to PDF coordinates and then store it.
  const storeConvertedPDFCoordinates = () => {
    const textCoordinates = core.getSelectedTextQuads();
    // Example:
    // textCoordinates = {
    //   1: [
    //     {x1: 32, y1: 582, x2: 67.28, y2: 582, x3: 67.28,4: 32, y1: 582, y2: 582, y3: 565, y4: 565},
    //     {x1: 32, x2: 68, x3: 68, x4: 32, y1: 595, y2: 595, y3: 579, y4: 579},
    //     {...}
    //   ]
    // }

    textCoordinates[1].forEach(rect => {
      const point1 = window.docViewer.getDocument().getPDFCoordinates(currentPage, rect.x1, rect.y1);
      const point2 = window.docViewer.getDocument().getPDFCoordinates(currentPage, rect.x3, rect.y3);
      rect.x1 = point1.x;
      rect.x2 = point2.x;
      rect.y1 = point1.y;
      rect.y2 = point2.y;
    });
    setTextCoordinates(textCoordinates[1]);

  };

  const updateText = e => {
    e.preventDefault();
    // update page content
    window.PDFNet.runWithCleanup(async() => {
      const doc = await window.docViewer.getDocument().getPDFDoc();
      doc.initSecurityHandler();
      doc.lock();

      const page = await doc.getPage(currentPage);
      const PDFNet = window.PDFNet;
      const replacer = await PDFNet.ContentReplacer.create();

      // Treat each line as a rectangle region and update them separately
      const lines = newText.split("\n");
      for (let i=0; i<lines.length; i++) {
        const region = await PDFNet.Rect.init(textCoordinates[i].x1, textCoordinates[i].y1, textCoordinates[i].x2, textCoordinates[i].y2);
        replacer.addText(region, lines[i]);
        replacer.process(page);
      }
      replacer.destroy();

      // clear the cache
      window.docViewer.refreshAll();
      // update viewer with new document
      window.docViewer.updateView();
      // Annotations may contain text so we need to regenerate
      // our text representation
      window.docViewer.getDocument().refreshTextData();
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

  return isDisabled
    ? null
    : <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <div className={modalClass} data-element="editTextModal" onMouseDown={closeModal}>
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <div className="swipe-indicator" />
          <p>Enter the text you want to replaced</p>
          <AutoResizeTextarea ref={el => {
            newTextInput.current = el;
          }}
          value={newText}
          onChange={changeHandler}
          onKeyDown={keyDownHandler}
          />
          <div className="editing-controls">
            <div className="cancel-button editing-pad" onClick={closeModal}>
              {t('action.cancel')}
            </div>
            <div className="editing-button" onClick={updateText}>
              {t('action.save')}
            </div>
          </div>
        </div>
      </div>
    </Swipeable>;
};

export default EditTextModal;
