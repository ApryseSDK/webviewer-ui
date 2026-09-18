import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CollapsibleSection from '../../CollapsibleSection';
import DataElementWrapper from '../../DataElementWrapper';
import ColorPicker from '../ColorPicker';
import Dropdown from 'components/Dropdown';
import DataElements from 'constants/dataElement';
import { COLOR_PALETTE_STYLES } from 'src/constants/commonColors';
import { stylePanelSectionTitles, shouldHideTransparentFillColor } from 'helpers/stylePanelHelper';

const FillColorPanelSection = ({
  activeTool,
  onStyleChange,
  onFillColorChange,
  fillColor,
  hasCustomFillStyles,
  fillStyleEntries,
  onFillPatternStyleChange,
  selectedFillStyleKey,
  isFillColorContainerActive,
  openFillColorContainer,
}) => {
  const [t] = useTranslation();

  return (
    <CollapsibleSection
      header={t(stylePanelSectionTitles(activeTool, 'FillColor') || 'option.annotationColor.FillColor')}
      headingLevel={2}
      isInitiallyExpanded={false}
      isExpanded={isFillColorContainerActive}
      onToggle={openFillColorContainer}>
      <div className="panel-section-wrapper">
        <div className="menu-items">
          <ColorPicker
            dataElement={DataElements.StylePanel.FILL_COLOR_PICKER}
            onColorChange={onFillColorChange}
            onStyleChange={onStyleChange}
            color={fillColor}
            hasTransparentColor={!shouldHideTransparentFillColor(activeTool)}
            activeTool={activeTool}
            type={COLOR_PALETTE_STYLES.FillColor.type}
            ariaTypeLabel={t('option.annotationColor.FillColor')}
          />
        </div>
        {hasCustomFillStyles && (
          <div className="StyleOption">
            <DataElementWrapper dataElement={DataElements.StylePanel.FILL_STYLE_PICKER_CONTAINER} className="styles-container fillStyleContainer">
              <div className="styles-title">{t('option.styleOption.style')}</div>
              <Dropdown
                id="fillStyleDropdown"
                translationPrefix="stylePanel.fillStyle"
                className="StylePicker-FillStyleDropdown"
                dataElement={DataElements.StylePanel.FILL_STYLE_PICKER}
                images={fillStyleEntries}
                onClickItem={onFillPatternStyleChange}
                currentSelectionKey={selectedFillStyleKey}
                width={80}
                showLabelInList
              />
            </DataElementWrapper>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};

FillColorPanelSection.propTypes = {
  activeTool: PropTypes.string,
  onStyleChange: PropTypes.func,
  onFillColorChange: PropTypes.func,
  fillColor: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  hasCustomFillStyles: PropTypes.bool,
  fillStyleEntries: PropTypes.array,
  onFillPatternStyleChange: PropTypes.func,
  selectedFillStyleKey: PropTypes.string,
  isFillColorContainerActive: PropTypes.bool,
  openFillColorContainer: PropTypes.func,
};

export default FillColorPanelSection;
