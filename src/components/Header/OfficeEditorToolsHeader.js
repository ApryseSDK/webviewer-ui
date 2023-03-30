import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Dropdown from 'components/Dropdown';
import ActionButton from 'components/ActionButton';
import ToggleElementButton from 'components/ToggleElementButton';
import DataElementWrapper from 'components/DataElementWrapper';
import DataElement from 'constants/dataElement';
import actions from 'actions';
import core from 'core';
import selectors from 'selectors';
import ColorPickerOverlay from 'components/ColorPickerOverlay';
import { rgbaToHex } from 'src/helpers/color';
import Theme from 'src/constants/theme';
import {
  LINE_SPACING_OPTIONS,
  JUSTIFICATION_OPTIONS,
  LIST_OPTIONS,
  DEFAULT_POINT_SIZE,
} from 'src/constants/officeEditor';
import Measure from 'react-measure';

import './Header.scss';
import './OfficeHeader.scss';

const availableStylePresetMap = {
  'Normal Text': {
    fontSize: '11pt',
    color: '#000000',
  },
  'Title': {
    fontSize: '26pt',
    color: '#000000',
  },
  'Subtitle': {
    fontSize: '15pt',
    color: '#666666',
  },
  'Heading 1': {
    fontSize: '20pt',
    color: '#000000',
  },
  'Heading 2': {
    fontSize: '16pt',
    color: '#000000',
  },
  'Heading 3': {
    fontSize: '14pt',
    color: '#434343',
  },
  'Heading 4': {
    fontSize: '12pt',
    color: '#666666',
  },
  'Heading 5': {
    fontSize: '11pt',
    color: '#666666',
  },
};
const availablePointSizes = ['8', '9', '10', '11', '12', '14', '18', '24', '30', '36', '48', '60', '72'];
const listOptionsWidth = 121;
const justificationOptionsWidth = 209;
const moreButtonWidth = 77;

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

const TextStyles = ({ cursorProperties, isBold, isItalic, isUnderline }) => {
  return (
    <>
      <ActionButton
        isActive={isBold}
        onClick={() => {
          if (core.getOfficeEditor().isTextSelected()) {
            core.getOfficeEditor().toggleSelectedTextStyle('bold');
          } else {
            core.getOfficeEditor().setCursorStyle({ bold: !cursorProperties.bold });
          }
          // focus so that after clicking you can still input text
          core.getViewerElement().focus();
        }}
        dataElement="office-editor-bold"
        title="officeEditor.bold"
        img="icon-text-bold"
      />
      <ActionButton
        isActive={isItalic}
        onClick={() => {
          if (core.getOfficeEditor().isTextSelected()) {
            core.getOfficeEditor().toggleSelectedTextStyle('italic');
          } else {
            core.getOfficeEditor().setCursorStyle({ italic: !cursorProperties.italic });
          }
          // focus so that after clicking you can still input text
          core.getViewerElement().focus();
        }}
        dataElement="office-editor-italic"
        title="officeEditor.italic"
        img="icon-text-italic"
      />
      <ActionButton
        isActive={isUnderline}
        onClick={() => {
          if (core.getOfficeEditor().isTextSelected()) {
            core.getOfficeEditor().toggleSelectedTextStyle('underline');
          } else {
            core.getOfficeEditor().setCursorStyle({
              underline: cursorProperties.underlineStyle === 'none'
            });
          }
          // focus so that after clicking you can still input text
          core.getViewerElement().focus();
        }}
        dataElement="office-editor-underline"
        title="officeEditor.underline"
        img="icon-text-underline"
      />
    </>
  );
};

const JustificationOptions = ({ justification }) => {
  return (
    <>
      <ActionButton
        isActive={justification === JUSTIFICATION_OPTIONS.Left}
        dataElement="office-editor-left-align"
        title="officeEditor.leftAlign"
        img="icon-menu-left-align"
        onClick={() => {
          core.getOfficeEditor().updateParagraphStyle({
            justification: 'left'
          });
          core.getOfficeEditor().setCursorStyle({
            justification: 'left'
          });

          // focus so that after clicking you can still input text
          core.getViewerElement().focus();
          core.getDocumentViewer().clearSelection();
        }}
      />
      <ActionButton
        isActive={justification === JUSTIFICATION_OPTIONS.Center}
        dataElement="office-editor-center-align"
        title="officeEditor.centerAlign"
        img="icon-menu-centre-align"
        onClick={() => {
          core.getOfficeEditor().updateParagraphStyle({
            justification: 'center'
          });
          core.getOfficeEditor().setCursorStyle({
            justification: 'center'
          });

          // So that after clicking you can still input text
          core.getViewerElement().focus();
          core.getDocumentViewer().clearSelection();
        }}
      />
      <ActionButton
        isActive={justification === JUSTIFICATION_OPTIONS.Right}
        dataElement="office-editor-right-align"
        title="officeEditor.rightAlign"
        img="icon-menu-right-align"
        onClick={() => {
          core.getOfficeEditor().updateParagraphStyle({
            justification: 'right'
          });
          core.getOfficeEditor().setCursorStyle({
            justification: 'right'
          });

          // focus so that after clicking you can still input text
          core.getViewerElement().focus();
          core.getDocumentViewer().clearSelection();
        }}
      />
      <ActionButton
        isActive={justification === JUSTIFICATION_OPTIONS.Both}
        dataElement="office-editor-justify"
        title="officeEditor.justify"
        img="icon-menu-both-align"
        onClick={() => {
          core.getOfficeEditor().updateParagraphStyle({
            justification: 'both'
          });
          core.getOfficeEditor().setCursorStyle({
            justification: 'both'
          });

          // focus so that after clicking you can still input text
          core.getViewerElement().focus();
          core.getDocumentViewer().clearSelection();
        }}
      />
    </>
  );
};

const ListOptions = ({ listType }) => {
  return (
    <>
      <ActionButton
        isActive={listType === LIST_OPTIONS.Unordered}
        dataElement="office-editor-bullet-list"
        title="officeEditor.bulletList"
        img="icon-office-editor-bullet-list"
        onClick={() => {
          core.getOfficeEditor().toggleListSelection(LIST_OPTIONS.Unordered);

          // So that after clicking you can still input text
          core.getViewerElement().focus();
        }}
      />
      <ActionButton
        isActive={listType === LIST_OPTIONS.Ordered}
        dataElement="office-editor-number-list"
        title="officeEditor.numberList"
        img="icon-office-number-list"
        onClick={() => {
          core.getOfficeEditor().toggleListSelection(LIST_OPTIONS.Ordered);

          // So that after clicking you can still input text
          core.getViewerElement().focus();
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

  const calculateLineSpacing = (lineHeight, fontSize) => {
    const lineSpacing = lineHeight / fontSize;

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
  const isBold = isTextSelected ? selectionProperties.bold : cursorProperties.bold;
  const isItalic = isTextSelected ? selectionProperties.italic : cursorProperties.italic;
  const isUnderline = isTextSelected ? selectionProperties.underlineStyle === 'single' : cursorProperties.underlineStyle === 'single';
  const fontFace = isTextSelected ? selectionProperties.fontFace : cursorProperties.fontFace;
  const pointSize = isTextSelected ? selectionProperties.pointSize : cursorProperties.pointSize;
  const pointSizeSelectionKey = pointSize === undefined ? undefined : pointSize.toString();
  const justification = isTextSelected ? selectionProperties.justification : cursorProperties.justification;
  const lineHeight = calculateLineSpacing(
    isTextSelected ? selectionProperties.lineHeight : cursorProperties.lineHeight,
    cursorProperties.fontPointSize || DEFAULT_POINT_SIZE,
  );
  const listType = isTextSelected ? selectionProperties.listType : cursorProperties.listType;

  const isLightMode = activeTheme === Theme.LIGHT;
  const wvFontColor = convertCoreColorToWebViewerColor(cursorProperties.color);
  const useColorIconBorder = isLightMode ? wvFontColor.toString() === 'rgba(255,255,255,1)' : wvFontColor.toString() === 'rgba(0,0,0,1)';

  const convertCursorToStylePreset = (cursorProperties) => {
    const {
      pointSize,
      color: currentColor
    } = cursorProperties.paragraphTextStyle || cursorProperties;

    let stylePreset = 'Normal Text';
    if (!pointSize || !currentColor) {
      return stylePreset;
    }

    const fontSize = `${pointSize}pt`;
    let color = '#000000';
    if (color) {
      color = rgbaToHex(
        currentColor.r,
        currentColor.g,
        currentColor.b
      ).slice(0, -2);
    }

    Object.keys(availableStylePresetMap).forEach((style) => {
      if (
        availableStylePresetMap[style].fontSize === fontSize &&
        availableStylePresetMap[style].color === color
      ) {
        stylePreset = style;
      }
    });

    return stylePreset;
  };

  return isOpen && (
    <DataElementWrapper
      dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER}
      className="HeaderToolsContainer"
    >
      <Measure
        bounds
        // innerRef={containerRef}
        onResize={({ bounds }) => {
          setContainerWidth(bounds.width);
        }}
      >
        {({ measureRef }) => (
          <div
            className="Header Tools OfficeEditorTools"
            ref={measureRef}
          >
            <Measure
              bounds
              // innerRef={containerRef}
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
                    items={Object.keys(availableStylePresetMap)}
                    onClickItem={(item) => {
                      const stylePreset = availableStylePresetMap[item];
                      const fontPointSize = parseInt(stylePreset.fontSize, 10);
                      const fontColor = new window.Core.Annotations.Color(stylePreset.color);
                      const parsedFontColor = {
                        r: fontColor.R,
                        g: fontColor.G,
                        b: fontColor.B,
                        a: 255,
                      };

                      const newTextStyle = {
                        bold: false,
                        italic: false,
                        underline: false,
                        pointSize: fontPointSize,
                        color: parsedFontColor
                      };

                      core.getOfficeEditor().updateParagraphStyle({
                        textStyle: newTextStyle,
                      });
                      core.getOfficeEditor().setCursorStyle(newTextStyle);

                      // setTimeout hack needed because dropdown closing from click is async?
                      setTimeout(() => {
                        // focus so that after clicking you can still input text
                        core.getViewerElement().focus();
                      });
                      core.getDocumentViewer().clearSelection();
                    }}
                    getCustomItemStyle={(item) => ({ ...availableStylePresetMap[item], padding: '20px 10px', color: 'var(--gray-12)' })}
                    applyCustomStyleToButton={false}
                    currentSelectionKey={convertCursorToStylePreset(cursorProperties)}
                    className="large-dropdown"
                    dataElement="office-editor-text-format"
                  />
                  <Dropdown
                    items={availableFontFaces}
                    onClickItem={(fontFace) => {
                      core.getOfficeEditor().isTextSelected() && core.getOfficeEditor().updateSelectionStyle({ fontFace });

                      core.getOfficeEditor().setCursorStyle({ fontFace });

                      // setTimeout hack needed because dropdown closing from click is async?
                      setTimeout(() => {
                        // focus so that after clicking you can still input text
                        core.getViewerElement().focus();
                      });
                    }}
                    getCustomItemStyle={(item) => ({ ...cssFontValues[item] })}
                    maxHeight={500}
                    customDataValidator={(font) => availableFontFaces.includes(font)}
                    className="large-dropdown"
                    dataElement="office-editor-font"
                    currentSelectionKey={fontFace}
                    hasInput
                  />
                  <Dropdown
                    items={availablePointSizes}
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

                      if (core.getOfficeEditor().isTextSelected()) {
                        core.getOfficeEditor().updateSelectionStyle({
                          pointSize: fontPointSize
                        });
                      }

                      core.getOfficeEditor().setCursorStyle({
                        pointSize: fontPointSize
                      });

                      // setTimeout hack needed because dropdown closing from click is async?
                      setTimeout(() => {
                        // focus so that after clicking you can still input text
                        core.getViewerElement().focus();
                      });
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
                        cursorProperties={cursorProperties}
                        isBold={isBold}
                        isItalic={isItalic}
                        isUnderline={isUnderline}
                      />
                    </>
                  )}
                  <div className="divider" />
                  <ToggleElementButton
                    dataElement="textColorButton"
                    title="officeEditor.textColor"
                    img="icon-office-editor-circle"
                    element="colorPickerOverlay"
                    color={wvFontColor.toString()}
                    iconClassName={useColorIconBorder ? 'icon-border' : ''}
                  />
                  <ColorPickerOverlay
                    onStyleChange={(_, color) => {
                      const fontColor = {
                        r: color.R,
                        g: color.G,
                        b: color.B,
                        a: 255,
                      };

                      core.getOfficeEditor().isTextSelected() && core.getOfficeEditor().updateSelectionStyle({ fontColor });

                      core.getOfficeEditor().setCursorStyle({ fontColor });

                      dispatch(actions.closeElements(['colorPickerOverlay']));

                      // focus so that after clicking you can still input text
                      core.getViewerElement().focus();
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
                      const lineHeight = lineSpacing * (cursorProperties.pointSize || DEFAULT_POINT_SIZE);
                      core.getOfficeEditor().updateParagraphStyle({
                        lineSpacing: lineHeight
                      });

                      // focus so that after clicking you can still input text
                      core.getViewerElement().focus();
                      core.getDocumentViewer().clearSelection();
                    }}
                    currentSelectionKey={lineHeight}
                    className="small-dropdown line-spacing-dropdown"
                    dataElement="office-editor-line-spacing"
                    displayButton={(isOpen) => (
                      <ActionButton
                        title="officeEditor.lineSpacing"
                        img="icon-office-editor-line-spacing"
                        isActive={isOpen}
                        onClick={() => { }}
                      />
                    )}
                  />
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
                          dataElement="office-editor-more-tools"
                          title="action.more"
                          img="icon-tools-more-vertical"
                          onClick={() => setShowMoreTools(!showMoreTools)}
                        />
                        {showMoreTools && (
                          <div className="more-tools Header Tools OfficeEditorTools">
                            <div className="HeaderItems">
                              {(visibleGroupCount < 4) && (
                                <>
                                  <TextStyles
                                    cursorProperties={cursorProperties}
                                    isBold={isBold}
                                    isItalic={isItalic}
                                    isUnderline={isUnderline}
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
  );
};

export default OfficeEditorToolsHeader;
