import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

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
    isThumbnailsPanelButtonDisabled: PropTypes.bool,
    isOutlinesPanelButtonDisabled: PropTypes.bool,
    isNotesPanelButtonDisabled: PropTypes.bool,
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
      isThumbnailsPanelButtonDisabled,
      isOutlinesPanelButtonDisabled,
      isNotesPanelButtonDisabled,
      setActiveLeftPanel,
      disabledCustomPanelTabs
    } = this.props;

    if (isLeftPanelTabsDisabled) {
      return null;
    }

    return(
      <Element className="LeftPanelTabs" dataElement="leftPanelTabs">
        <Button
          isActive={this.isActive('thumbnailsPanel')}
          isDisabled={isThumbnailsPanelButtonDisabled}
          dataElement="thumbnailsPanelButton"
          img="ic_thumbnails_black_24px" 
          title="component.thumbnailsPanel"
          onClick={() => setActiveLeftPanel('thumbnailsPanel')}
        />
        <Button
          isActive={this.isActive('outlinesPanel')}
          isDisabled={isOutlinesPanelButtonDisabled}
          dataElement="outlinesPanelButton"
          img="ic_outline_black_24px" 
          title="component.outlinesPanel"
          onClick={() => setActiveLeftPanel('outlinesPanel')}
        />
        <Button
          isActive={this.isActive('notesPanel')}
          isDisabled={isNotesPanelButtonDisabled}
          dataElement="notesPanelButton"
          img="ic_annotations_black_24px" 
          title="component.notesPanel"
          onClick={() => setActiveLeftPanel('notesPanel')}
        />
        {customPanels.map(({ panel, tab }, index) => (
          <Button
            key={tab.dataElement || index}
            isActive={this.isActive(panel.dataElement)}
            isDisabled={disabledCustomPanelTabs.includes(tab.dataElement)}
            dataElement={tab.dataElement}
            img={tab.img}
            title={tab.title}
            onClick={() => setActiveLeftPanel(panel.dataElement)}
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
  isThumbnailsPanelButtonDisabled: selectors.isElementDisabled(state, 'thumbnailsPanelButton'),
  isOutlinesPanelButtonDisabled: selectors.isElementDisabled(state, 'outlinesPanelButton'),
  isNotesPanelButtonDisabled: selectors.isElementDisabled(state, 'notesPanelButton')
});

const mapDispatchToProps = {
  setActiveLeftPanel: actions.setActiveLeftPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(LeftPanelTabs));