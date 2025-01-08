import React from 'react';
import { useTranslation } from 'react-i18next';
import CollapsibleSection from 'src/components/CollapsibleSection';
import PropTypes from 'prop-types';

const OpacityPanelSection = ({
  showFillColorAndCollapsablePanelSections,
  shouldHideOpacitySlider,
  activeTool,
  showLineStyleOptions,
  renderSlider,
  isOpacityContainerActive,
  openOpacityContainer,
}) => {
  const [t] = useTranslation();

  OpacityPanelSection.propTypes = {
    showFillColorAndCollapsablePanelSections: PropTypes.bool,
    shouldHideOpacitySlider: PropTypes.func,
    activeTool: PropTypes.string,
    showLineStyleOptions: PropTypes.bool,
    renderSlider: PropTypes.func,
    isOpacityContainerActive: PropTypes.bool,
    openOpacityContainer: PropTypes.func,
  };

  const sectionContent = (
    <div className="panel-section-wrapper Opacity">
      {/*
        If showLineStyleOptions is true, then we don't want to show the opacity slider
        in the bottom because it is already shown before together with the stroke slider
      */}
      {!showLineStyleOptions && !shouldHideOpacitySlider(activeTool) && (
        <div className="StyleOption">{renderSlider('opacity', showFillColorAndCollapsablePanelSections)}</div>
      )}
    </div>
  );

  if (!(showFillColorAndCollapsablePanelSections && !shouldHideOpacitySlider(activeTool))) {
    return sectionContent;
  }

  return (
    <CollapsibleSection
      header={t('option.slider.opacity')}
      headingLevel={2}
      isInitiallyExpanded={false}
      isExpanded={(isOpacityContainerActive || !showFillColorAndCollapsablePanelSections)}
      onToggle={openOpacityContainer}>
      { sectionContent }
    </CollapsibleSection>
  );
};

export default OpacityPanelSection;