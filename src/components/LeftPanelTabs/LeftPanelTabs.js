import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Button from 'components/Button';
import Element from 'components/Element';

import actions from 'actions';
import selectors from 'selectors';

import './LeftPanelTabs.scss';

class LeftPanelTabs extends React.Component {
  static propTypes = {
    activePanel: PropTypes.string.isRequired,
    disabledCustomPanelTabs: PropTypes.array.isRequired,
    customPanels: PropTypes.array.isRequired,
    isLeftPanelTabsDisabled: PropTypes.bool,
    setActiveLeftPanel: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  }

  isActive = panel => {
    return this.props.activePanel === panel;
  }

  render() {
    const {
      customPanels,
      isLeftPanelTabsDisabled,
      setActiveLeftPanel,
    } = this.props;

    if (isLeftPanelTabsDisabled) {
      return null;
    }

    return (
      <Element className="LeftPanelTabs" dataElement="leftPanelTabs">
        <Button
          isActive={this.isActive('thumbnailsPanel')}
          dataElement="thumbnailsPanelButton"
          img="ic_thumbnails_black_24px"
          onClick={() => setActiveLeftPanel('thumbnailsPanel')}
          title="component.thumbnailsPanel"
        />
        <Button
          isActive={this.isActive('outlinesPanel')}
          dataElement="outlinesPanelButton"
          img="ic_outline_black_24px"
          onClick={() => setActiveLeftPanel('outlinesPanel')}
          title="component.outlinesPanel"
        />
        <Button
          isActive={this.isActive('notesPanel')}
          dataElement="notesPanelButton"
          img="ic_annotations_black_24px"
          onClick={() => setActiveLeftPanel('notesPanel')}
          title="component.notesPanel"
        />
        <Button
          isActive={this.isActive('layersPanel')}
          dataElement="layersPanelButton"
          img="ic_layers_24px"
          onClick={() => setActiveLeftPanel('layersPanel')}
          title="component.layersPanel"
        />

        {customPanels.map(({ panel, tab }, index) => (
          <Button
            key={tab.dataElement || index}
            isActive={this.isActive(panel.dataElement)}
            dataElement={tab.dataElement}
            img={tab.img}
            onClick={() => setActiveLeftPanel(panel.dataElement)}
            title={tab.title}
          />
        ))}
      </Element>
    );
  }
}

const mapStateToProps = state => ({
  activePanel: selectors.getActiveLeftPanel(state),
  customPanels: selectors.getCustomPanels(state),
  disabledCustomPanelTabs: selectors.getDisabledCustomPanelTabs(state),
  isLeftPanelTabsDisabled: selectors.isElementDisabled(state, 'leftPanelTabs'),
});

const mapDispatchToProps = {
  setActiveLeftPanel: actions.setActiveLeftPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LeftPanelTabs));