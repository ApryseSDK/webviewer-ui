import React from 'react';
import { useSelector } from 'react-redux';
import DataElementWrapper from '../DataElementWrapper';
import { PANEL_SIZES } from 'constants/panel';
import selectors from 'selectors';
import classNames from 'classnames';
import './EditorPanel.scss';
import PropTypes from 'prop-types';
import CollapsibleSection from '../CollapsibleSection';
import RecentDeletedItems from './RecentDeletedItems';
import ToolsSection from './ToolsSection';
import RibbonsSection from './RibbonsSection';
import PanelsSection from './PanelsSection';

const EditorPanel = ({ panelSize }) => {

  const isInEditorMode = useSelector(selectors.isInEditorMode);

  return (
    isInEditorMode && (
      <DataElementWrapper dataElement={'editorPanel'} className={
        classNames({
          'Panel': true,
          'EditorPanel': true,
          [panelSize]: true,
        })
      }>
        <h2 className='editor-panel-header'>
          {'Editor Panel'}
        </h2>
        <div className="PanelSection">
          <CollapsibleSection
            header={'Tools'}
            headingLevel={2}
            isInitiallyExpanded={true}
            isExpanded={true}
            onToggle={() => {}}>
            <div className="panel-section-wrapper">
              <ToolsSection />
            </div>
          </CollapsibleSection>
        </div>
        <div className="PanelSection">
          <CollapsibleSection
            header={'Panels'}
            headingLevel={2}
            isInitiallyExpanded={false}
            isExpanded={false}
            onToggle={() => {}}>
            <div className="panel-section-wrapper">
              <PanelsSection />
            </div>
          </CollapsibleSection>
        </div>
        <div className="PanelSection">
          <CollapsibleSection
            header={'Ribbons'}
            headingLevel={1}
            isInitiallyExpanded={false}
            isExpanded={false}
            onToggle={() => {}}>
            <div className="panel-section-wrapper">
              <div className="panel-section-wrapper">
                <RibbonsSection />
              </div>
            </div>
          </CollapsibleSection>
        </div>
        <div className="PanelSection">
          <CollapsibleSection
            header={'Recent Deleted Items'}
            headingLevel={2}
            isInitiallyExpanded={false}
            isExpanded={false}
            onToggle={() => {}}>
            <div className="panel-section-wrapper recent-deleted-section">
              <RecentDeletedItems />
            </div>
          </CollapsibleSection>
        </div>
      </DataElementWrapper>
    )
  );
};

EditorPanel.propTypes = {
  panelSize: PropTypes.oneOf(Object.values(PANEL_SIZES)),
};

export default EditorPanel;