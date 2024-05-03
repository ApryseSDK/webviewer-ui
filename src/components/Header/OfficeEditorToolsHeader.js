import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import Measure from 'react-measure';
import core from 'core';
import Dropdown from 'components/Dropdown';
import ActionButton from 'components/ActionButton';
import ToggleElementButton from 'components/ToggleElementButton';
import DataElementWrapper from 'components/DataElementWrapper';
import OfficeEditorImageFilePickerHandler from 'components/OfficeEditorImageFilePickerHandler';
import ColorPickerOverlay from 'components/ColorPickerOverlay';
import Icon from 'components/Icon';
import OfficeEditorCreateTablePopup from 'components/OfficeEditorCreateTablePopup';
import DataElement from 'constants/dataElement';
import Theme from 'constants/theme';
import {
  LINE_SPACING_OPTIONS,
  JUSTIFICATION_OPTIONS,
  LIST_OPTIONS,
  DEFAULT_POINT_SIZE,
  OFFICE_BULLET_OPTIONS,
  OFFICE_NUMBER_OPTIONS
} from 'constants/officeEditor';
import openOfficeEditorFilePicker from 'helpers/openOfficeEditorFilePicker';

import './Header.scss';
import './OfficeHeader.scss';

const availablePointSizes = ['8', '9', '10', '11', '12', '14', '18', '24', '30', '36', '48', '60', '72'];
const listOptionsWidth = 121;
const justificationOptionsWidth = 209;
const moreButtonWidth = 77;
const officeEditorToggleableStyles = window.Core.Document.OfficeEditorToggleableStyles;

const convertCoreColorToWebViewerColor = (color) => {
  if (!color) {
    return new window.Core.Annotations.Color(0, 0, 0, 1);
  }

  return new window.Core.Annotations.Color(
    color.r,
    color.g,
    color.b,
    1,
  );
};

const TextStyles = ({ activeStates }) => {
  return Object.values(officeEditorToggleableStyles).map((style) => (
    <ActionButton
      key={style}
      isActive={activeStates[style]}
      onClick={() => {
        core.getOfficeEditor().updateSelectionAndCursorStyle({ [style]: true });
      }}
      dataElement={`office-editor-${style}`}
      title={`officeEditor.${style}`}
      img={`icon-text-${style}`}
    />
  ));
};

const JustificationOptions = ({ justification }) => {
  return (
    <>
      <ActionButton
        isActive={justification === JUSTIFICATION_OPTIONS.Left}
        dataElement='office-editor-left-align'
        title='officeEditor.leftAlign'
        img='icon-menu-left-align'
        onClick={() => {
          core.getOfficeEditor().updateParagraphStyle({
            justification: 'left'
          });
          core.getDocumentViewer().clearSelection();
        }}
      />
      <ActionButton
        isActive={justification === JUSTIFICATION_OPTIONS.Center}
        dataElement='office-editor-center-align'
        title='officeEditor.centerAlign'
        img='icon-menu-centre-align'
        onClick={() => {
          core.getOfficeEditor().updateParagraphStyle({
            justification: 'center'
          });
          core.getDocumentViewer().clearSelection();
        }}
      />
      <ActionButton
        isActive={justification === JUSTIFICATION_OPTIONS.Right}
        dataElement='office-editor-right-align'
        title='officeEditor.rightAlign'
        img='icon-menu-right-align'
        onClick={() => {
          core.getOfficeEditor().updateParagraphStyle({
            justification: 'right'
          });
          core.getDocumentViewer().clearSelection();
        }}
      />
      <ActionButton
        isActive={justification === JUSTIFICATION_OPTIONS.Both}
        dataElement='office-editor-justify'
        title='officeEditor.justify'
        img='icon-menu-both-align'
        onClick={() => {
          core.getOfficeEditor().updateParagraphStyle({
            justification: 'both'
          });
          core.getDocumentViewer().clearSelection();
        }}
      />
    </>
  );
};

const ListOptions = ({ listType }) => {
  const bulletListObjects = OFFICE_BULLET_OPTIONS.map((options) => ({
    className: 'officeEditor-list-style-icon',
    key: options.enum,
    src: options.img
  }));

  const numberListOptions = OFFICE_NUMBER_OPTIONS.map((options) => ({
    className: 'officeEditor-list-style-icon',
    key: options.enum,
    src: options.img
  }));

  return (
    <>
      <ActionButton
        isActive={listType === LIST_OPTIONS.Unordered}
        dataElement='office-editor-bullet-list'
        title='officeEditor.bulletList'
        img='icon-office-editor-bullet-list'
        className='list-style-button'
        onClick={() => {
          core.getOfficeEditor().toggleListSelection(LIST_OPTIONS.Unordered);
        }}
      />
      <Dropdown
        dataElement='office-editor-bullet-list-dropdown'
        images={bulletListObjects}
        columns={3}
        onClickItem={(val) => {
          core.getOfficeEditor().setListPreset(val);
        }}
        className='list-style-dropdown'
      />
      <ActionButton
        isActive={listType === LIST_OPTIONS.Ordered}
        dataElement='office-editor-number-list'
        title='officeEditor.numberList'
        img='icon-office-number-list'
        className='list-style-button'
        onClick={() => {
          core.getOfficeEditor().toggleListSelection(LIST_OPTIONS.Ordered);
        }}
      />
      <Dropdown
        dataElement='office-editor-number-list-dropdown'
        images={numberListOptions}
        columns={3}
        onClickItem={(val) => {
          core.getOfficeEditor().setListPreset(val);
        }}
        className='list-style-dropdown'
      />
      <ActionButton
        dataElement='office-editor-decrease-indent'
        title='officeEditor.decreaseIndent'
        img='ic-indent-decrease'
        onClick={async () => {
          await core.getOfficeEditor().decreaseIndent();
        }}
      />
      <ActionButton
        dataElement='office-editor-increase-indent'
        title='officeEditor.increaseIndent'
        img='ic-indent-increase'
        onClick={async () => {
          await core.getOfficeEditor().increaseIndent();
        }}
      />
    </>
  );
};

const OfficeEditorToolsHeader = () => {
  const dispatch = useDispatch();
  const [
    isOpen,
    cursorProperties,
    selectionProperties,
    availableFontFaces,
    activeTheme,
    cssFontValues,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElement.OFFICE_EDITOR_TOOLS_HEADER),
      selectors.getOfficeEditorCursorProperties(state),
      selectors.getOfficeEditorSelectionProperties(state),
      selectors.getAvailableFontFaces(state),
      selectors.getActiveTheme(state),
      selectors.getCSSFontValues(state),
    ],
    shallowEqual
  );

  const [containerWidth, setContainerWidth] = useState(0);
  const [initialHeaderWidth, setInitialHeaderWidth] = useState(0);
  const [visibleGroupCount, setVisibleGroupCount] = useState(6);
  const [showMoreTools, setShowMoreTools] = useState(false);

  useEffect(() => {
    const onCursorPropertiesUpdated = (cursorProperties) => {
      dispatch(actions.setOfficeEditorCursorProperties(cursorProperties));
    };
    const onSelectionPropertiesUpdated = (selectionProperties) => {
      dispatch(actions.setOfficeEditorSelectionProperties(selectionProperties));
    };

    core.getDocument()?.addEventListener('cursorPropertiesUpdated', onCursorPropertiesUpdated);
    core.getDocument()?.addEventListener('selectionPropertiesUpdated', onSelectionPropertiesUpdated);

    return () => {
      core.getDocument()?.removeEventListener('selectionPropertiesUpdated', onSelectionPropertiesUpdated);
      core.getDocument()?.removeEventListener('cursorPropertiesUpdated', onCursorPropertiesUpdated);
    };
  }, []);

  useEffect(() => {
    if (cursorProperties.fontFace && !availableFontFaces.includes(cursorProperties.fontFace)) {
      dispatch(actions.addOfficeEditorAvailableFontFace(cursorProperties.fontFace));
    }
  }, [availableFontFaces, cursorProperties]);

  useEffect(() => {
    if (containerWidth === 0 || initialHeaderWidth === 0) {
      return;
    }

    const actualContainerWidth = containerWidth - 16;
    if (
      actualContainerWidth >= initialHeaderWidth
    ) {
      setVisibleGroupCount(6);
    } else if (
      actualContainerWidth < initialHeaderWidth &&
      actualContainerWidth >= (initialHeaderWidth - listOptionsWidth + moreButtonWidth)
    ) {
      setVisibleGroupCount(5);
    } else if (
      actualContainerWidth < (initialHeaderWidth - listOptionsWidth + moreButtonWidth) &&
      actualContainerWidth >= (initialHeaderWidth - listOptionsWidth - justificationOptionsWidth + moreButtonWidth) &&
      actualContainerWidth >= 858 // HeaderItems's width when on small devices (screen width < 900px)
    ) {
      setVisibleGroupCount(4);
    } else {
      setVisibleGroupCount(3);
    }
  }, [containerWidth, initialHeaderWidth]);

  const calculateLineSpacing = (lineHeightMultiplier, lineHeight, fontSize) => {
    // if lineHeight is provided, it takes precedence, because the rule sets the line height in points (either exact or at least)
    const lineSpacing = lineHeight ? lineHeight / fontSize : lineHeightMultiplier;

    // Sometimes we get floating points so we locate the closest line spacing option
    const roundedLineSpacing = Object.values(LINE_SPACING_OPTIONS).reduce((a, b) => {
      const aDiff = Math.abs(a - lineSpacing);
      const bDiff = Math.abs(b - lineSpacing);

      if (aDiff === bDiff) {
        return a < b ? a : b;
      }
      return bDiff < aDiff ? b : a;
    });

    switch (roundedLineSpacing) {
      case 1:
        return 'Single';
      case 1.15:
        return '1.15';
      case 1.5:
        return '1.5';
      case 2:
        return 'Double';
      default:
        return 'Single';
    }
  };

  const isTextSelected = core.getOfficeEditor().isTextSelected();
  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const isBold = properties.bold;
  const isItalic = properties.italic;
  const isUnderline = properties.underlineStyle === 'single';
  const fontFace = properties.fontFace;
  const pointSize = properties.pointSize;
  const pointSizeSelectionKey = pointSize === undefined ? undefined : pointSize.toString();
  const justification = properties.paragraphProperties.justification;
  const lineHeight = calculateLineSpacing(
    properties.paragraphProperties.lineHeightMultiplier,
    properties.paragraphProperties.lineHeight,
    cursorProperties.paragraphProperties.fontPointSize || DEFAULT_POINT_SIZE,
  );
  const listType = properties.paragraphProperties.listType;

  const isLightMode = activeTheme === Theme.LIGHT;
  const wvFontColor = convertCoreColorToWebViewerColor(cursorProperties.color);
  const useColorIconBorder = isLightMode ? wvFontColor.toString() === 'rgba(255,255,255,1)' : wvFontColor.toString() === 'rgba(0,0,0,1)';

  return isOpen ? (
    <DataElementWrapper
      dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER}
      className='HeaderToolsContainer'
    >
      <Measure
        bounds
        onResize={({ bounds }) => {
          setContainerWidth(bounds.width);
        }}
      >
        {({ measureRef }) => (
          <div
            className='MainHeader Tools OfficeEditorTools'
            ref={measureRef}
          >
            <Measure
              bounds
              onResize={({ bounds }) => {
                (initialHeaderWidth === 0) && setInitialHeaderWidth(bounds.width);
              }}
            >
              {({ measureRef }) => (
                <div
                  className="HeaderItems"
                  ref={measureRef}
                >
                  <Dropdown
                    items={availableFontFaces}
                    onOpened={() => setShowMoreTools(false)}
                    onClickItem={(fontFace) => {
                      core.getOfficeEditor().updateSelectionAndCursorStyle({ fontFace });
                    }}
                    getCustomItemStyle={(item) => ({ ...cssFontValues[item] })}
                    maxHeight={500}
                    width={200}
                    customDataValidator={(font) => availableFontFaces.includes(font)}
                    dataElement="office-editor-font"
                    currentSelectionKey={fontFace}
                    hasInput
                  />
                  <Dropdown
                    items={availablePointSizes}
                    onOpened={() => setShowMoreTools(false)}
                    onClickItem={(pointSize) => {
                      let fontPointSize = parseInt(pointSize, 10);

                      if (isNaN(fontPointSize)) {
                        fontPointSize = DEFAULT_POINT_SIZE;
                      }

                      // TODO: Setting a pointsize of 96 or higher will cause cursor positions array
                      // to be empty for the span
                      // Actually, every large point size seems to break something.
                      if (fontPointSize > 72) {
                        fontPointSize = 72;
                      }
                      core.getOfficeEditor().updateSelectionAndCursorStyle({ pointSize: fontPointSize });
                    }}
                    currentSelectionKey={pointSizeSelectionKey}
                    className="small-dropdown"
                    dataElement="office-editor-font-size"
                    hasInput
                    isSearchEnabled={false}
                  />
                  {(visibleGroupCount >= 4) && (
                    <>
                      <div className="divider" />
                      <TextStyles
                        activeStates={{
                          bold: isBold,
                          italic: isItalic,
                          underline: isUnderline
                        }}
                      />
                    </>
                  )}
                  <div className="divider" />
                  <ToggleElementButton
                    onClick={() => setShowMoreTools(false)}
                    dataElement='textColorButton'
                    title='officeEditor.textColor'
                    img='icon-office-editor-circle'
                    element='colorPickerOverlay'
                    color={wvFontColor.toString()}
                    iconClassName={`${useColorIconBorder ? 'icon-border' : ''} icon-text-color`}
                  />
                  <ColorPickerOverlay
                    onStyleChange={(_, color) => {
                      const fontColor = {
                        r: color.R,
                        g: color.G,
                        b: color.B,
                        a: 255,
                      };
                      core.getOfficeEditor().updateSelectionAndCursorStyle({ fontColor });
                      dispatch(actions.closeElements(['colorPickerOverlay']));
                    }}
                    color={wvFontColor}
                  />
                  {(visibleGroupCount >= 5) && (
                    <>
                      <div className="divider" />
                      <JustificationOptions justification={justification} />
                    </>
                  )}
                  <div className="divider" />
                  <Dropdown
                    items={Object.keys(LINE_SPACING_OPTIONS)}
                    onClickItem={(lineSpacingOption) => {
                      const lineSpacing = LINE_SPACING_OPTIONS[lineSpacingOption];
                      core.getOfficeEditor().updateParagraphStyle({
                        'lineHeightMultiplier': lineSpacing
                      });
                      core.getOfficeEditor().setMainCursorStyle({
                        lineHeight,
                      });
                      core.getDocumentViewer().clearSelection();
                    }}
                    currentSelectionKey={lineHeight}
                    className="small-dropdown line-spacing-dropdown"
                    dataElement="office-editor-line-spacing"
                    displayButton={(isOpen) => (
                      <ActionButton
                        title='officeEditor.lineSpacing'
                        img='icon-office-editor-line-spacing'
                        isActive={isOpen}
                        onClick={() => setShowMoreTools(false)}
                      />
                    )}
                  />
                  <div className="divider" />
                  <Dropdown
                    dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE}
                    className="insert-table-dropdown"
                    displayButton={(isOpen) => (
                      <>
                        <ActionButton
                          title='officeEditor.table'
                          img='ic-table'
                          isActive={isOpen}
                        />
                        <Icon className="arrow" glyph={`icon-chevron-${isOpen ? 'up' : 'down'}`} />
                      </>
                    )}
                  >
                    <OfficeEditorCreateTablePopup />
                  </Dropdown>
                  <>
                    <ActionButton
                      className="tool-group-button"
                      dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_IMAGE}
                      title='officeEditor.insertImage'
                      img='icon-tool-image-line'
                      onClick={() => {
                        openOfficeEditorFilePicker();
                      }}
                    />
                    <OfficeEditorImageFilePickerHandler />
                  </>
                  {(visibleGroupCount === 6) && (
                    <>
                      <div className="divider" />
                      <ListOptions listType={listType} />
                    </>
                  )}
                  {(visibleGroupCount < 6) && (
                    <>
                      <div className="divider" />
                      <div className="action-button-wrapper">
                        <ActionButton
                          className="tool-group-button"
                          isActive={showMoreTools}
                          dataElement='office-editor-more-tools'
                          title='action.more'
                          img='icon-tools-more-vertical'
                          onClick={() => setShowMoreTools(!showMoreTools)}
                        />
                        {showMoreTools && (
                          <div className="more-tools MainHeader Tools OfficeEditorTools">
                            <div className="HeaderItems">
                              {(visibleGroupCount < 4) && (
                                <>
                                  <TextStyles
                                    activeStates={{
                                      bold: isBold,
                                      italic: isItalic,
                                      underline: isUnderline
                                    }}
                                  />
                                  <div className="divider" />
                                </>
                              )}
                              {(visibleGroupCount < 5) && (
                                <>
                                  <JustificationOptions justification={justification} />
                                  <div className="divider" />
                                </>
                              )}
                              {(visibleGroupCount < 6) && (
                                <ListOptions listType={listType} />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </Measure>
          </div>
        )}
      </Measure>
    </DataElementWrapper>
  ) : null;
};

export default OfficeEditorToolsHeader;
