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
  OFFICE_NUMBER_OPTIONS,
  FONT_SIZE,
  AVAILABLE_STYLE_PRESET_MAP,
  AVAILABLE_POINT_SIZES,
} from 'constants/officeEditor';
import openOfficeEditorFilePicker from 'helpers/openOfficeEditorFilePicker';
import { calculateLineSpacing, convertCursorToStylePreset, convertCoreColorToWebViewerColor } from 'helpers/officeEditor';

import './Header.scss';
import './OfficeHeader.scss';
import '../HeaderItems/HeaderItems.scss';

const listOptionsWidth = 121;
const justificationOptionsWidth = 209;
const moreButtonWidth = 77;
const officeEditorToggleableStyles = window.Core.Document.OfficeEditorToggleableStyles;

const TextStyles = ({ activeStates }) => {
  return Object.values(officeEditorToggleableStyles).map((style) => (
    <ActionButton
      key={style}
      isActive={activeStates[style]}
      ariaPressed={activeStates[style]}
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
        }}
      />
      <ActionButton
        isActive={justification === JUSTIFICATION_OPTIONS.Center}
        dataElement='office-editor-center-align'
        title='officeEditor.centerAlign'
        img='icon-menu-center-align'
        onClick={() => {
          core.getOfficeEditor().updateParagraphStyle({
            justification: 'center'
          });
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
        dataElement='unorderedListDropButton'
        title='officeEditor.bulletList'
        img='icon-office-editor-bullet-list'
        className='list-style-button'
        onClick={() => {
          core.getOfficeEditor().toggleListSelection(LIST_OPTIONS.Unordered);
        }}
      />
      <Dropdown
        id='office-editor-bullet-list-dropdown'
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
        img='icon-office-editor-number-list'
        className='list-style-button'
        onClick={() => {
          core.getOfficeEditor().toggleListSelection(LIST_OPTIONS.Ordered);
        }}
      />
      <Dropdown
        id='office-editor-number-list-dropdown'
        dataElement='office-editor-number-list-dropdown'
        images={numberListOptions}
        columns={3}
        onClickItem={(val) => {
          core.getOfficeEditor().setListPreset(val);
        }}
        className='list-style-dropdown'
      />
      <ActionButton
        dataElement='decreaseIndentButton'
        title='officeEditor.decreaseIndent'
        img='ic-indent-decrease'
        onClick={async () => {
          await core.getOfficeEditor().decreaseIndent();
        }}
      />
      <ActionButton
        dataElement='increaseIndentButton'
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
    isCursorInTable,
    selectionProperties,
    availableFontFaces,
    activeTheme,
    cssFontValues,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElement.OFFICE_EDITOR_TOOLS_HEADER),
      selectors.getOfficeEditorCursorProperties(state),
      selectors.isCursorInTable(state),
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
    const onCursorPropertiesUpdated = async (cursorProperties) => {
      dispatch(actions.setOfficeEditorCursorProperties(cursorProperties));
    };
    const onSelectionPropertiesUpdated = (selectionProperties) => {
      dispatch(actions.setOfficeEditorSelectionProperties(selectionProperties));
    };

    core.getDocument().addEventListener('cursorPropertiesUpdated', onCursorPropertiesUpdated);
    core.getDocument()?.addEventListener('selectionPropertiesUpdated', onSelectionPropertiesUpdated);

    return () => {
      core.getDocument().removeEventListener('selectionPropertiesUpdated', onSelectionPropertiesUpdated);
      core.getDocument().removeEventListener('cursorPropertiesUpdated', onCursorPropertiesUpdated);
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

  const isTextSelected = core.getOfficeEditor().isTextSelected();
  const properties = isTextSelected ? selectionProperties : cursorProperties;
  const isBold = properties.bold;
  const isItalic = properties.italic;
  const isUnderline = properties.underlineStyle === 'single';
  const fontFace = properties.fontFace || '';
  const pointSize = properties.pointSize;
  const pointSizeSelectionKey = pointSize === undefined ? '' : pointSize.toString();
  const justification = properties.paragraphProperties.justification;
  const lineHeight = calculateLineSpacing(
    properties.paragraphProperties.lineHeightMultiplier,
    properties.paragraphProperties.lineHeight,
    cursorProperties.paragraphProperties.fontPointSize || DEFAULT_POINT_SIZE,
  );
  const listType = properties.paragraphProperties.listType;

  const isLightMode = activeTheme === Theme.LIGHT;
  const wvFontColor = convertCoreColorToWebViewerColor(properties.color);
  const useColorIconBorder = isLightMode ? wvFontColor.toString() === 'rgba(255,255,255,1)' : wvFontColor.toString() === 'rgba(0,0,0,1)';
  const ariaLabel = wvFontColor?.toHexString?.();

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
                    id='office-editor-text-format'
                    items={Object.keys(AVAILABLE_STYLE_PRESET_MAP)}
                    // TODO: This shouldn't be closing more tools popup
                    // It shouldn't know about the existence of it.
                    onOpened={() => setShowMoreTools(false)}
                    onClickItem={async (item) => {
                      const stylePreset = AVAILABLE_STYLE_PRESET_MAP[item];
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

                      await core.getOfficeEditor().updateParagraphStylePresets(newTextStyle);
                      await core.getOfficeEditor().setMainCursorStyle(newTextStyle);
                    }}
                    getCustomItemStyle={(item) => ({ ...AVAILABLE_STYLE_PRESET_MAP[item], padding: '20px 10px', color: 'var(--gray-8)' })}
                    applyCustomStyleToButton={false}
                    currentSelectionKey={convertCursorToStylePreset(properties)}
                    width={160}
                    dataElement="office-editor-text-format"
                  />
                  <Dropdown
                    id='office-editor-font'
                    items={availableFontFaces}
                    onOpened={() => setShowMoreTools(false)}
                    onClickItem={(fontFace) => {
                      if (typeof fontFace === 'string') {
                        core.getOfficeEditor().updateSelectionAndCursorStyle({ fontFace });
                      }
                    }}
                    getCustomItemStyle={(item) => ({ ...cssFontValues[item] })}
                    maxHeight={500}
                    customDataValidator={(font) => availableFontFaces.includes(font)}
                    width={160}
                    dataElement="office-editor-font"
                    currentSelectionKey={fontFace}
                    hasInput
                  />
                  <Dropdown
                    id='office-editor-font-size'
                    items={AVAILABLE_POINT_SIZES}
                    onOpened={() => setShowMoreTools(false)}
                    onClickItem={(pointSize) => {
                      let fontPointSize = parseInt(pointSize, 10);

                      if (isNaN(fontPointSize)) {
                        fontPointSize = DEFAULT_POINT_SIZE;
                      }

                      if (fontPointSize > FONT_SIZE.MAX) {
                        fontPointSize = FONT_SIZE.MAX;
                      } else if (fontPointSize < FONT_SIZE.MIN) {
                        fontPointSize = FONT_SIZE.MIN;
                      }
                      core.getOfficeEditor().updateSelectionAndCursorStyle({ pointSize: fontPointSize });
                    }}
                    currentSelectionKey={pointSizeSelectionKey}
                    width={80}
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
                    dataElement={DataElement.OFFICE_EDITOR_TEXT_COLOR_BUTTON}
                    title='officeEditor.textColor'
                    ariaLabel={ariaLabel}
                    img='icon-office-editor-circle'
                    element={DataElement.OFFICE_EDITOR_COLOR_PICKER_OVERLAY}
                    color={wvFontColor.toString()}
                    iconClassName={`${useColorIconBorder ? 'icon-border' : ''} icon-text-color`}
                  />
                  <ColorPickerOverlay
                    onStyleChange={(_, newColor) => {
                      const color = {
                        r: newColor.R,
                        g: newColor.G,
                        b: newColor.B,
                        a: 255,
                      };
                      core.getOfficeEditor().updateSelectionAndCursorStyle({ color });
                      dispatch(actions.closeElements([DataElement.OFFICE_EDITOR_COLOR_PICKER_OVERLAY]));
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
                    id='office-editor-line-spacing'
                    items={Object.keys(LINE_SPACING_OPTIONS)}
                    onClickItem={(lineSpacingOption) => {
                      const lineSpacing = LINE_SPACING_OPTIONS[lineSpacingOption];
                      core.getOfficeEditor().updateParagraphStyle({
                        'lineHeightMultiplier': lineSpacing
                      });
                    }}
                    currentSelectionKey={lineHeight}
                    width={80}
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
                  <ActionButton
                    title='officeEditor.pageBreak'
                    img='icon-office-editor-page-break'
                    dataElement={DataElement.OFFICE_EDITOR_PAGE_BREAK}

                    disabled={isCursorInTable}
                    onClick={() => {
                      core.getOfficeEditor().insertPageBreak();
                    }}
                  />
                  <Dropdown
                    id='office-editor-insert-table'
                    dataElement={DataElement.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE}
                    width={136}
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
